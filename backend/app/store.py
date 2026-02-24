from __future__ import annotations

from datetime import datetime, timezone
from typing import Any

symbols = [
    {"ticker": "TSLA", "name": "Tesla", "market": "NASDAQ"},
    {"ticker": "NVDA", "name": "NVIDIA", "market": "NASDAQ"},
    {"ticker": "AAPL", "name": "Apple", "market": "NASDAQ"},
]

prediction_map: dict[str, dict[str, Any]] = {
    "TSLA": {"direction": "UP", "confidence": 0.72, "predictedPrice": 212.6},
    "NVDA": {"direction": "UP", "confidence": 0.65, "predictedPrice": 928.4},
    "AAPL": {"direction": "FLAT", "confidence": 0.61, "predictedPrice": 186.8},
}

indicator_map: dict[str, dict[str, float]] = {
    "TSLA": {"close": 198.1, "volume": 124000000, "vix": 17.8, "fearGreed": 64, "rsi14": 58.4, "macd": 1.24},
    "NVDA": {"close": 901.5, "volume": 58200000, "vix": 17.8, "fearGreed": 64, "rsi14": 61.2, "macd": 1.82},
    "AAPL": {"close": 183.9, "volume": 47800000, "vix": 17.8, "fearGreed": 64, "rsi14": 53.1, "macd": 0.76},
}

history_map: dict[str, list[dict[str, float | str]]] = {
    "TSLA": [
        {"label": "D-5", "predicted": 42, "actual": 48},
        {"label": "D-4", "predicted": 56, "actual": 54},
        {"label": "D-3", "predicted": 64, "actual": 61},
        {"label": "D-2", "predicted": 58, "actual": 53},
        {"label": "D-1", "predicted": 66, "actual": 69},
    ],
}

watchlist_by_user: dict[str, set[str]] = {}
preferences_by_user: dict[str, dict[str, dict[str, Any]]] = {}
notifications_by_user: dict[str, list[dict[str, Any]]] = {}


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()
