from fastapi import APIRouter, HTTPException

from app.store import indicator_map

router = APIRouter(tags=["indicators"])


@router.get("/indicators/{ticker}")
async def get_indicators(ticker: str) -> dict:
    data = indicator_map.get(ticker)
    if data is None:
        raise HTTPException(status_code=404, detail="ticker_not_found")
    return {"ticker": ticker, "snapshot": data}
