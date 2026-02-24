from fastapi import APIRouter, Depends

from app.api.middleware.access_policy import AccessContext, get_access_context, require_login
from app.store import watchlist_by_user

router = APIRouter(tags=["watchlist"])


@router.get("/watchlist")
async def get_watchlist(ctx: AccessContext = Depends(get_access_context)) -> dict:
    user_id = require_login(ctx)
    items = sorted(list(watchlist_by_user.get(user_id, set())))
    return {"items": items}


@router.post("/watchlist/{ticker}")
async def add_watchlist(ticker: str, ctx: AccessContext = Depends(get_access_context)) -> dict:
    user_id = require_login(ctx)
    watchlist_by_user.setdefault(user_id, set()).add(ticker)
    return {"ok": True}


@router.delete("/watchlist/{ticker}")
async def remove_watchlist(ticker: str, ctx: AccessContext = Depends(get_access_context)) -> dict:
    user_id = require_login(ctx)
    watchlist_by_user.setdefault(user_id, set()).discard(ticker)
    return {"ok": True}
