from __future__ import annotations

from datetime import datetime, timedelta, timezone
import os
from typing import Any, Iterable

import httpx
import yfinance as yf

RangeKey = str

RANGE_CONFIG: dict[RangeKey, dict[str, str | int]] = {
    "1D": {"period": "1d", "interval": "5m", "resolution": "5m", "marker_step": 16},
    "1W": {"period": "5d", "interval": "30m", "resolution": "30m", "marker_step": 10},
    "1M": {"period": "1mo", "interval": "1d", "resolution": "1d", "marker_step": 7},
    "3M": {"period": "3mo", "interval": "1d", "resolution": "1d", "marker_step": 14},
}


def _safe_float(value: Any, fallback: float = 0.0) -> float:
    try:
        if value is None:
            return fallback
        return float(value)
    except (TypeError, ValueError):
        return fallback


def _ema(values: list[float], period: int) -> list[float]:
    if not values:
        return []
    multiplier = 2 / (period + 1)
    result: list[float] = [values[0]]
    for price in values[1:]:
        result.append((price - result[-1]) * multiplier + result[-1])
    return result


def _rsi14(closes: list[float]) -> float:
    if len(closes) < 15:
        return 50.0
    gains: list[float] = []
    losses: list[float] = []
    for i in range(1, len(closes)):
        change = closes[i] - closes[i - 1]
        gains.append(max(change, 0.0))
        losses.append(abs(min(change, 0.0)))
    period = 14
    avg_gain = sum(gains[:period]) / period
    avg_loss = sum(losses[:period]) / period
    if avg_loss == 0:
        return 100.0
    for i in range(period, len(gains)):
        avg_gain = ((avg_gain * (period - 1)) + gains[i]) / period
        avg_loss = ((avg_loss * (period - 1)) + losses[i]) / period
    if avg_loss == 0:
        return 100.0
    rs = avg_gain / avg_loss
    return 100 - (100 / (1 + rs))


def _macd(closes: list[float]) -> float:
    if len(closes) < 26:
        return 0.0
    ema12 = _ema(closes, 12)
    ema26 = _ema(closes, 26)
    min_len = min(len(ema12), len(ema26))
    return ema12[min_len - 1] - ema26[min_len - 1]


def _normalize_points(closes: list[float]) -> str:
    if not closes:
        return "0,80 700,80"
    width = 700
    height = 160
    min_close = min(closes)
    max_close = max(closes)
    span = max(max_close - min_close, 1e-6)
    points: list[str] = []
    for idx, close in enumerate(closes):
        x = round((idx / max(len(closes) - 1, 1)) * (width - 24), 1)
        y = round(height - (((close - min_close) / span) * (height - 24)) - 12, 1)
        points.append(f"{x},{y}")
    return " ".join(points)


def _build_markers(points: list[dict[str, Any]], marker_step: int) -> list[dict[str, Any]]:
    if len(points) < 2:
        return []
    markers: list[dict[str, Any]] = []
    for idx in range(marker_step, len(points), marker_step):
        point = points[idx]
        label = "실적" if len(markers) % 2 == 0 else "뉴스"
        markers.append({"index": idx, "label": label, "timestamp": point["timestamp"]})
    return markers[:2]


async def _fetch_fear_greed_index() -> float:
    # CNN 공개 그래프 데이터 엔드포인트를 우선 사용한다.
    url = "https://production.dataviz.cnn.io/index/fearandgreed/graphdata"
    try:
        async with httpx.AsyncClient(timeout=6.0) as client:
            response = await client.get(url)
            response.raise_for_status()
            payload = response.json()
        score = payload.get("fear_and_greed", {}).get("score")
        if score is not None:
            return _safe_float(score, 50.0)
        score = payload.get("fear_and_greed_historical", {}).get("data", [])[-1].get("y")
        return _safe_float(score, 50.0)
    except Exception:
        return 50.0


async def _fetch_from_alpha_vantage(ticker: str) -> dict[str, Any] | None:
    api_key = os.getenv("ALPHA_VANTAGE_API_KEY", "").strip()
    if not api_key:
        return None

    base_url = "https://www.alphavantage.co/query"
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            daily_res = await client.get(
                base_url,
                params={
                    "function": "TIME_SERIES_DAILY",
                    "symbol": ticker,
                    "outputsize": "compact",
                    "apikey": api_key,
                },
            )
            daily_res.raise_for_status()
            daily_json = daily_res.json()
            time_series = daily_json.get("Time Series (Daily)", {})
            if not time_series:
                return None

            ordered = sorted(time_series.items(), key=lambda item: item[0])[-30:]
            closes = [_safe_float(item[1].get("4. close")) for item in ordered]
            volumes = [_safe_float(item[1].get("5. volume")) for item in ordered]
            points = [
                {
                    "timestamp": datetime.fromisoformat(date).replace(tzinfo=timezone.utc).isoformat(),
                    "close": close,
                    "volume": volume,
                }
                for (date, _), close, volume in zip(ordered, closes, volumes)
            ]
            return {
                "points": points,
                "source": "alphavantage",
            }
    except Exception:
        return None


def _iter_rows(history_df: Any) -> Iterable[tuple[datetime, float, float]]:
    for timestamp, row in history_df.iterrows():
        close = _safe_float(row.get("Close"))
        volume = _safe_float(row.get("Volume"))
        if close <= 0:
            continue
        if isinstance(timestamp, datetime):
            dt = timestamp if timestamp.tzinfo else timestamp.replace(tzinfo=timezone.utc)
        else:
            dt = datetime.now(timezone.utc)
        yield dt, close, volume


def _fetch_from_yfinance(ticker: str, range_key: str) -> dict[str, Any] | None:
    config = RANGE_CONFIG.get(range_key, RANGE_CONFIG["1D"])
    period = str(config["period"])
    interval = str(config["interval"])
    history_df = yf.Ticker(ticker).history(period=period, interval=interval)
    if history_df is None or history_df.empty:
        return None

    points: list[dict[str, Any]] = []
    for dt, close, volume in _iter_rows(history_df):
        points.append({"timestamp": dt.isoformat(), "close": close, "volume": volume})
    if not points:
        return None
    return {"points": points, "source": "yfinance"}


def _fetch_vix_close() -> float:
    try:
        history_df = yf.Ticker("^VIX").history(period="5d", interval="1d")
        if history_df is None or history_df.empty:
            return 18.0
        close_value = _safe_float(history_df["Close"].iloc[-1], 18.0)
        return close_value if close_value > 0 else 18.0
    except Exception:
        return 18.0


async def get_prediction_path_payload(ticker: str, range_key: str) -> dict[str, Any]:
    normalized_range = range_key.upper()
    config = RANGE_CONFIG.get(normalized_range, RANGE_CONFIG["1D"])
    marker_step = int(config["marker_step"])

    primary_data = _fetch_from_yfinance(ticker, normalized_range)
    source = "yfinance"
    if primary_data is None:
        primary_data = await _fetch_from_alpha_vantage(ticker)
        source = "alphavantage" if primary_data else "synthetic"

    if primary_data is None:
        now = datetime.now(timezone.utc)
        synthetic_points = [
            {
                "timestamp": (now - timedelta(hours=(10 - idx))).isoformat(),
                "close": 100 + (idx * 0.8),
                "volume": 100000 + (idx * 3500),
            }
            for idx in range(10)
        ]
        primary_data = {"points": synthetic_points}

    points = primary_data["points"]
    closes = [point["close"] for point in points]
    volumes = [point["volume"] for point in points]
    latest_close = closes[-1] if closes else 0.0
    latest_volume = volumes[-1] if volumes else 0.0
    vix_close = _fetch_vix_close()
    fear_greed = await _fetch_fear_greed_index()
    rsi14 = _rsi14(closes)
    macd = _macd(closes)
    return {
        "ticker": ticker,
        "range": normalized_range,
        "source": source,
        "chart": {
            "points": points,
            "polylinePoints": _normalize_points(closes),
            "markers": _build_markers(points, marker_step),
        },
        "features": {
            "close": round(latest_close, 4),
            "volume": round(latest_volume, 2),
            "vix": round(vix_close, 4),
            "fearGreed": round(fear_greed, 2),
            "rsi14": round(rsi14, 4),
            "macd": round(macd, 4),
        },
    }

