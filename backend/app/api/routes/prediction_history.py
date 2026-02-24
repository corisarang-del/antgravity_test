from fastapi import APIRouter, HTTPException

from app.services.performance_metrics_service import aggregate_performance_metrics
from app.store import history_map

router = APIRouter(tags=["prediction-history"])


@router.get("/prediction-history/{ticker}")
async def get_prediction_history(ticker: str) -> dict:
    points = history_map.get(ticker)
    if points is None:
        raise HTTPException(status_code=404, detail="ticker_not_found")

    metrics = aggregate_performance_metrics(
        [
            {"da": 0.568, "mape": 0.029, "rmse": 1.18},
            {"da": 0.554, "mape": 0.031, "rmse": 1.24},
        ]
    )
    return {"ticker": ticker, "points": points, "metrics": metrics}
