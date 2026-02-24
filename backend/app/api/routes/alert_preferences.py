from fastapi import APIRouter, Depends, Header, HTTPException
from pydantic import BaseModel

from app.api.middleware.access_policy import AccessContext, get_access_context, require_login
from app.services.preference_conflict_service import assert_preference_version
from app.store import preferences_by_user

router = APIRouter(tags=["alert-preferences"])


class AlertPreferenceInput(BaseModel):
    symbol: str
    isEnabled: bool
    thresholdType: str
    thresholdValue: float


@router.get("/alert-preferences")
async def get_alert_preferences(ctx: AccessContext = Depends(get_access_context)) -> dict:
    user_id = require_login(ctx)
    return {"items": list(preferences_by_user.get(user_id, {}).values())}


@router.put("/alert-preferences/{symbol}")
async def put_alert_preference(
    symbol: str,
    payload: AlertPreferenceInput,
    ctx: AccessContext = Depends(get_access_context),
    if_match_version: int | None = Header(default=None, alias="If-Match-Version"),
) -> dict:
    user_id = require_login(ctx)
    user_preferences = preferences_by_user.setdefault(user_id, {})
    current = user_preferences.get(symbol)
    current_version = int(current.get("version", 0)) if current else 0

    try:
        assert_preference_version(current_version=current_version, provided_version=if_match_version)
    except ValueError as exc:
        raise HTTPException(status_code=409, detail="preference_conflict") from exc

    next_version = current_version + 1
    item = {
        "symbol": symbol,
        "isEnabled": payload.isEnabled,
        "thresholdType": payload.thresholdType,
        "thresholdValue": payload.thresholdValue,
        "version": next_version,
    }
    user_preferences[symbol] = item
    return item
