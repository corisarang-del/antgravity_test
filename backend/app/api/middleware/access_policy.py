from __future__ import annotations

from fastapi import Header, HTTPException


class AccessContext:
    def __init__(self, user_id: str | None, level_score: int, has_active_subscription: bool) -> None:
        self.user_id = user_id
        self.level_score = level_score
        self.has_active_subscription = has_active_subscription


async def get_access_context(
    x_user_id: str | None = Header(default=None),
    x_level_score: int = Header(default=0),
    x_paid_subscriber: str | None = Header(default=None),
) -> AccessContext:
    is_paid = (x_paid_subscriber or "false").lower() in {"1", "true", "yes"}
    return AccessContext(user_id=x_user_id, level_score=x_level_score, has_active_subscription=is_paid)


def require_login(ctx: AccessContext) -> str:
    if not ctx.user_id:
        raise HTTPException(status_code=401, detail="login_required")
    return ctx.user_id
