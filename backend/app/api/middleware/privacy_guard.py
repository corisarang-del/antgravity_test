from __future__ import annotations

from typing import Any

from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse

BLOCKED_KEYS = {"gps", "latitude", "longitude", "lat", "lng", "preciseLocation"}


class PrivacyGuardMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        if request.method in {"POST", "PUT", "PATCH"}:
            try:
                payload = await request.json()
                if isinstance(payload, dict):
                    lowered_keys = {key.lower() for key in payload.keys()}
                    if lowered_keys.intersection({key.lower() for key in BLOCKED_KEYS}):
                        return JSONResponse(
                            status_code=400,
                            content={"error": "gps_storage_forbidden"},
                        )
            except Exception:
                pass

        return await call_next(request)
