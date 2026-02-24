from fastapi import APIRouter, Depends, HTTPException

from app.api.middleware.access_policy import AccessContext, get_access_context, require_login
from app.store import notifications_by_user, now_iso

router = APIRouter(tags=["notifications"])


@router.get("/notifications")
async def get_notifications(ctx: AccessContext = Depends(get_access_context)) -> dict:
    user_id = require_login(ctx)
    return {"items": notifications_by_user.get(user_id, [])}


@router.patch("/notifications/{notification_id}/read")
async def mark_notification_read(notification_id: str, ctx: AccessContext = Depends(get_access_context)) -> dict:
    user_id = require_login(ctx)
    items = notifications_by_user.setdefault(user_id, [])
    for item in items:
        if item["id"] == notification_id:
            if item["isRead"]:
                return item
            item["isRead"] = True
            item["readAt"] = now_iso()
            return item
    raise HTTPException(status_code=404, detail="notification_not_found")
