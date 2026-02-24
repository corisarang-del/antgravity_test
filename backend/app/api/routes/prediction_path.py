from fastapi import APIRouter, Query

from app.services.market_data_service import get_prediction_path_payload

router = APIRouter(tags=["prediction-path"])


@router.get("/predictions/{ticker}/path")
async def get_prediction_path(
    ticker: str,
    range: str = Query(default="1D", pattern="^(1D|1W|1M|3M)$"),
) -> dict:
    return await get_prediction_path_payload(ticker=ticker, range_key=range)

