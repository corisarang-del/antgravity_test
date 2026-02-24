from __future__ import annotations

from datetime import datetime, timezone

from app.store import prediction_map
from app.services.refresh_policy_service import EligibilityReason, RefreshPolicy, resolve_refresh_policy


def get_prediction_summary(ticker: str, has_active_subscription: bool, level_score: int) -> dict:
    prediction = prediction_map.get(ticker)
    if prediction is None:
        raise KeyError("ticker_not_found")

    policy, reason = resolve_refresh_policy(has_active_subscription, level_score)
    return {
        "ticker": ticker,
        "horizon": "D+1~D+5",
        "direction": prediction["direction"],
        "confidence": prediction["confidence"],
        "predictedPrice": prediction["predictedPrice"],
        "cache": {
            "enabled": True,
            "ttlSeconds": 3600,
            "lastSyncAt": datetime.now(timezone.utc).isoformat(),
        },
        "refreshPolicy": policy.model_dump(),
        "eligibilityReason": reason.model_dump(),
    }
