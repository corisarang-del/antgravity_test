from __future__ import annotations

import re
from typing import Any

SENSITIVE_KEYS = {"authorization", "token", "password", "secret", "api_key", "service_role_key"}


def _mask_value(value: str) -> str:
    if len(value) <= 6:
        return "***"
    return f"{value[:3]}***{value[-2:]}"


def mask_sensitive_log(payload: dict[str, Any]) -> dict[str, Any]:
    masked: dict[str, Any] = {}
    for key, value in payload.items():
        lowered = key.lower()
        if lowered in SENSITIVE_KEYS and isinstance(value, str):
            masked[key] = _mask_value(value)
            continue
        if isinstance(value, str) and re.search(r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+", value):
            masked[key] = re.sub(r"([A-Za-z0-9._%+-]{2})[A-Za-z0-9._%+-]*(@[A-Za-z0-9.-]+)", r"\1***\2", value)
            continue
        masked[key] = value
    return masked
