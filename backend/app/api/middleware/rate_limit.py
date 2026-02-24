from __future__ import annotations

import time
from collections import defaultdict, deque

from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse


class RateLimitMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, requests_per_minute: int = 60) -> None:
        super().__init__(app)
        self.requests_per_minute = requests_per_minute
        self._requests: dict[str, deque[float]] = defaultdict(deque)

    async def dispatch(self, request: Request, call_next):
        key = f"{request.client.host if request.client else 'local'}:{request.url.path}"
        now = time.time()
        window_start = now - 60
        bucket = self._requests[key]
        while bucket and bucket[0] < window_start:
            bucket.popleft()

        if len(bucket) >= self.requests_per_minute:
            retry_at = int(bucket[0] + 60)
            return JSONResponse(
                status_code=429,
                content={"error": "rate_limited", "retryAtEpoch": retry_at},
            )

        bucket.append(now)
        return await call_next(request)
