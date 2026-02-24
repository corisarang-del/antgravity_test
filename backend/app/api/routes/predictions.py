from fastapi import APIRouter, Depends, HTTPException

from app.api.middleware.access_policy import AccessContext, get_access_context
from app.services.prediction_query_service import get_prediction_summary

router = APIRouter(tags=["predictions"])


@router.get("/predictions/{ticker}")
async def get_prediction(ticker: str, ctx: AccessContext = Depends(get_access_context)) -> dict:
    try:
        payload = get_prediction_summary(ticker=ticker, has_active_subscription=ctx.has_active_subscription, level_score=ctx.level_score)
    except KeyError as exc:
        raise HTTPException(status_code=404, detail="ticker_not_found") from exc
    return payload
