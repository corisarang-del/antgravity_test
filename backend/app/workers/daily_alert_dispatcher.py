from __future__ import annotations

from datetime import date
from uuid import uuid4

from app.services.notification_dedup_service import dedup_service
from app.store import notifications_by_user, preferences_by_user


def run_daily_alert_dispatcher(run_date: date) -> dict[str, int]:
    sent = 0
    skipped = 0

    for user_id, preferences in preferences_by_user.items():
        items = notifications_by_user.setdefault(user_id, [])
        for symbol, pref in preferences.items():
            if not pref.get("isEnabled"):
                continue
            message = f"{symbol} prediction update is ready."
            if not dedup_service.can_send(user_id, symbol, run_date.isoformat(), message):
                skipped += 1
                continue
            items.append(
                {
                    "id": str(uuid4()),
                    "symbol": symbol,
                    "message": message,
                    "isRead": False,
                    "createdAt": run_date.isoformat(),
                    "readAt": None,
                }
            )
            sent += 1

    return {"sent": sent, "skipped": skipped}

