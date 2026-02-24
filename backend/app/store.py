from __future__ import annotations

from datetime import datetime, timezone
from typing import Any

symbols = [
    {"ticker": "TSLA", "name": "Tesla", "market": "NASDAQ"},
    {"ticker": "NVDA", "name": "NVIDIA", "market": "NASDAQ"},
    {"ticker": "AAPL", "name": "Apple", "market": "NASDAQ"},
    {"ticker": "005930.KS", "name": "삼성전자", "market": "KRX"},
    {"ticker": "000660.KS", "name": "하이닉스", "market": "KRX"},
    {"ticker": "005380.KS", "name": "현대차", "market": "KRX"},
]

prediction_map: dict[str, dict[str, Any]] = {
    "TSLA": {"direction": "UP", "confidence": 0.72, "predictedPrice": 212.6},
    "NVDA": {"direction": "UP", "confidence": 0.65, "predictedPrice": 928.4},
    "AAPL": {"direction": "FLAT", "confidence": 0.61, "predictedPrice": 186.8},
    "005930.KS": {"direction": "UP", "confidence": 0.67, "predictedPrice": 84500.0},
    "000660.KS": {"direction": "UP", "confidence": 0.69, "predictedPrice": 182000.0},
    "005380.KS": {"direction": "FLAT", "confidence": 0.62, "predictedPrice": 258000.0},
}

indicator_map: dict[str, dict[str, float]] = {
    "TSLA": {"close": 198.1, "volume": 124000000, "vix": 17.8, "fearGreed": 64, "rsi14": 58.4, "macd": 1.24},
    "NVDA": {"close": 901.5, "volume": 58200000, "vix": 17.8, "fearGreed": 64, "rsi14": 61.2, "macd": 1.82},
    "AAPL": {"close": 183.9, "volume": 47800000, "vix": 17.8, "fearGreed": 64, "rsi14": 53.1, "macd": 0.76},
    "005930.KS": {"close": 81200.0, "volume": 18500000, "vix": 17.8, "fearGreed": 58, "rsi14": 56.4, "macd": 0.91},
    "000660.KS": {"close": 174300.0, "volume": 4200000, "vix": 17.8, "fearGreed": 58, "rsi14": 59.1, "macd": 1.12},
    "005380.KS": {"close": 251500.0, "volume": 930000, "vix": 17.8, "fearGreed": 58, "rsi14": 52.7, "macd": 0.67},
}

history_map: dict[str, list[dict[str, float | str]]] = {
    "TSLA": [
        {"label": "D-5", "predicted": 42, "actual": 48},
        {"label": "D-4", "predicted": 56, "actual": 54},
        {"label": "D-3", "predicted": 64, "actual": 61},
        {"label": "D-2", "predicted": 58, "actual": 53},
        {"label": "D-1", "predicted": 66, "actual": 69},
    ],
    "005930.KS": [
        {"label": "D-5", "predicted": 51, "actual": 49},
        {"label": "D-4", "predicted": 53, "actual": 55},
        {"label": "D-3", "predicted": 57, "actual": 58},
        {"label": "D-2", "predicted": 61, "actual": 60},
        {"label": "D-1", "predicted": 63, "actual": 65},
    ],
    "000660.KS": [
        {"label": "D-5", "predicted": 47, "actual": 46},
        {"label": "D-4", "predicted": 49, "actual": 50},
        {"label": "D-3", "predicted": 55, "actual": 54},
        {"label": "D-2", "predicted": 59, "actual": 61},
        {"label": "D-1", "predicted": 64, "actual": 66},
    ],
    "005380.KS": [
        {"label": "D-5", "predicted": 45, "actual": 44},
        {"label": "D-4", "predicted": 48, "actual": 47},
        {"label": "D-3", "predicted": 50, "actual": 52},
        {"label": "D-2", "predicted": 53, "actual": 54},
        {"label": "D-1", "predicted": 56, "actual": 55},
    ],
}

watchlist_by_user: dict[str, set[str]] = {}
preferences_by_user: dict[str, dict[str, dict[str, Any]]] = {}
notifications_by_user: dict[str, list[dict[str, Any]]] = {}


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()
