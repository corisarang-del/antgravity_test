from fastapi import APIRouter

from app.store import symbols

router = APIRouter(tags=["symbols"])


@router.get("/symbols")
async def get_symbols() -> dict:
    return {"items": symbols}
