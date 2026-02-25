import os

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
    prediction_path,
    prediction_history,
    predictions,
    symbols,
    watchlist,
)

load_dotenv()


def _get_cors_allowed_origins() -> list[str]:
    default_origins = [
        "http://127.0.0.1:3000",
        "http://localhost:3000",
    ]
    configured = os.getenv("CORS_ALLOWED_ORIGINS", "").strip()
    if not configured:
        return default_origins

    origins: list[str] = []
    for value in configured.split(","):
        origin = value.strip().rstrip("/")
        if origin and origin not in origins:
            origins.append(origin)
    return origins or default_origins


def _sanitize_proxy_env_for_market_data() -> None:
    disable_proxy = os.getenv("DISABLE_SYSTEM_PROXY_FOR_MARKET_DATA", "true").strip().lower()
    if disable_proxy not in {"1", "true", "yes", "on"}:
        return

    for key in ("HTTP_PROXY", "HTTPS_PROXY", "ALL_PROXY", "http_proxy", "https_proxy", "all_proxy"):
        os.environ.pop(key, None)

    no_proxy_raw = os.getenv("NO_PROXY", "")
    no_proxy_values = [value.strip() for value in no_proxy_raw.split(",") if value.strip()]
    for required in ("localhost", "127.0.0.1"):
        if required not in no_proxy_values:
            no_proxy_values.append(required)

    no_proxy_joined = ",".join(no_proxy_values)
    os.environ["NO_PROXY"] = no_proxy_joined
    os.environ["no_proxy"] = no_proxy_joined


_sanitize_proxy_env_for_market_data()

app = FastAPI(title="Ant Gravity API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=_get_cors_allowed_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(RateLimitMiddleware, requests_per_minute=60)
app.add_middleware(PrivacyGuardMiddleware)

app.include_router(symbols.router, prefix="/api")
app.include_router(auth.router, prefix="/api")
app.include_router(predictions.router, prefix="/api")
app.include_router(prediction_path.router, prefix="/api")
app.include_router(indicators.router, prefix="/api")
app.include_router(prediction_history.router, prefix="/api")
app.include_router(watchlist.router, prefix="/api")
app.include_router(alert_preferences.router, prefix="/api")
app.include_router(notifications.router, prefix="/api")


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}
