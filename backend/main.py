from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.middleware.privacy_guard import PrivacyGuardMiddleware
from app.api.middleware.rate_limit import RateLimitMiddleware
from app.api.routes import (
    alert_preferences,
    auth,
    indicators,
    notifications,
    prediction_history,
    predictions,
    symbols,
    watchlist,
)

load_dotenv()

app = FastAPI(title="Ant Gravity API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:3000",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(RateLimitMiddleware, requests_per_minute=60)
app.add_middleware(PrivacyGuardMiddleware)

app.include_router(symbols.router, prefix="/api")
app.include_router(auth.router, prefix="/api")
app.include_router(predictions.router, prefix="/api")
app.include_router(indicators.router, prefix="/api")
app.include_router(prediction_history.router, prefix="/api")
app.include_router(watchlist.router, prefix="/api")
app.include_router(alert_preferences.router, prefix="/api")
app.include_router(notifications.router, prefix="/api")


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}
