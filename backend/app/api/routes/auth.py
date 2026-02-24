from __future__ import annotations

import os
from typing import Any

import httpx
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

router = APIRouter(tags=["auth"])


class AuthPayload(BaseModel):
    email: str = Field(min_length=3)
    password: str = Field(min_length=6)


class ResendPayload(BaseModel):
    email: str = Field(min_length=3)


def _supabase_config() -> tuple[str, str]:
    supabase_url = os.getenv("SUPABASE_URL", "").strip()
    auth_key = os.getenv("SUPABASE_ANON_KEY", "").strip() or os.getenv("SUPABASE_SERVICE_ROLE_KEY", "").strip()
    if not supabase_url or not auth_key:
        raise HTTPException(status_code=500, detail="supabase_auth_env_missing")
    return supabase_url, auth_key


async def _supabase_auth_post(
    *,
    path: str,
    payload: dict[str, Any],
    key: str,
    supabase_url: str,
) -> dict[str, Any]:
    url = f"{supabase_url.rstrip('/')}/auth/v1/{path.lstrip('/')}"
    headers = {
        "apikey": key,
        "Authorization": f"Bearer {key}",
        "Content-Type": "application/json",
    }
    async with httpx.AsyncClient(timeout=15) as client:
        response = await client.post(url, headers=headers, json=payload)

    data: dict[str, Any]
    try:
        data = response.json()
    except Exception:
        data = {"message": response.text}

    if response.status_code >= 400:
        message = data.get("msg") or data.get("message") or "supabase_auth_request_failed"
        raise HTTPException(status_code=response.status_code, detail=message)
    return data


@router.post("/auth/signup")
async def signup(payload: AuthPayload) -> dict[str, Any]:
    supabase_url, auth_key = _supabase_config()
    data = await _supabase_auth_post(
        path="signup",
        payload={"email": payload.email, "password": payload.password},
        key=auth_key,
        supabase_url=supabase_url,
    )
    user = data.get("user") or {}
    return {
        "ok": True,
        "needsEmailConfirm": data.get("session") is None,
        "user": {"id": user.get("id"), "email": user.get("email")},
    }


@router.post("/auth/login")
async def login(payload: AuthPayload) -> dict[str, Any]:
    supabase_url, auth_key = _supabase_config()
    data = await _supabase_auth_post(
        path="token?grant_type=password",
        payload={"email": payload.email, "password": payload.password},
        key=auth_key,
        supabase_url=supabase_url,
    )
    user = data.get("user") or {}
    return {
        "ok": True,
        "accessToken": data.get("access_token"),
        "refreshToken": data.get("refresh_token"),
        "expiresIn": data.get("expires_in"),
        "user": {"id": user.get("id"), "email": user.get("email")},
    }


@router.post("/auth/resend-signup")
async def resend_signup(payload: ResendPayload) -> dict[str, Any]:
    supabase_url, auth_key = _supabase_config()
    await _supabase_auth_post(
        path="resend",
        payload={"type": "signup", "email": payload.email},
        key=auth_key,
        supabase_url=supabase_url,
    )
    return {"ok": True}
