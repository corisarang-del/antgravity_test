from __future__ import annotations

from datetime import datetime


class NotificationDedupService:
    def __init__(self) -> None:
        self._seen: set[str] = set()

    @staticmethod
    def build_key(user_id: str, symbol: str, notification_date: str, message: str) -> str:
        return f"{user_id}:{symbol}:{notification_date}:{message.strip().lower()}"

    def can_send(self, user_id: str, symbol: str, notification_date: str, message: str) -> bool:
        key = self.build_key(user_id, symbol, notification_date, message)
        if key in self._seen:
            return False
        self._seen.add(key)
        return True


dedup_service = NotificationDedupService()
