import hashlib
import hmac
import json
import os
import time
from urllib.parse import parse_qsl

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN", "")
MAX_INIT_DATA_AGE = int(os.getenv("TELEGRAM_INIT_DATA_MAX_AGE", "86400"))
ALLOWED_ORIGINS = [origin.strip() for origin in os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",") if origin.strip()]

app = FastAPI(title="GIFTORA API", version="0.1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type", "Authorization"],
)


class TelegramAuthRequest(BaseModel):
    init_data: str = Field(min_length=1, max_length=8192)


def validate_telegram_init_data(init_data: str, bot_token: str) -> dict:
    if not bot_token:
        raise HTTPException(status_code=503, detail="Telegram authentication is not configured")

    try:
        pairs = parse_qsl(init_data, keep_blank_values=True, strict_parsing=True)
        data = dict(pairs)
        received_hash = data.pop("hash")
    except (ValueError, KeyError):
        raise HTTPException(status_code=401, detail="Invalid Telegram initData")

    if len(data) != len(pairs) - 1 or not hmac.compare_digest(received_hash, received_hash.lower()):
        raise HTTPException(status_code=401, detail="Invalid Telegram initData")

    data_check_string = "\n".join(f"{key}={value}" for key, value in sorted(data.items()))
    secret_key = hmac.new(b"WebAppData", bot_token.encode(), hashlib.sha256).digest()
    expected_hash = hmac.new(secret_key, data_check_string.encode(), hashlib.sha256).hexdigest()
    if not hmac.compare_digest(expected_hash, received_hash):
        raise HTTPException(status_code=401, detail="Telegram signature mismatch")

    try:
        auth_date = int(data["auth_date"])
    except (KeyError, ValueError):
        raise HTTPException(status_code=401, detail="Missing Telegram auth_date")

    now = int(time.time())
    if auth_date > now + 30 or now - auth_date > MAX_INIT_DATA_AGE:
        raise HTTPException(status_code=401, detail="Telegram initData expired")

    try:
        user = json.loads(data["user"])
    except (KeyError, json.JSONDecodeError):
        raise HTTPException(status_code=401, detail="Missing Telegram user")

    if not isinstance(user, dict) or not isinstance(user.get("id"), int):
        raise HTTPException(status_code=401, detail="Invalid Telegram user")
    return {"id": user["id"], "first_name": user.get("first_name", ""), "username": user.get("username")}


@app.get("/health")
def health():
    return {"ok": True, "service": "giftora-api"}


@app.post("/api/auth/telegram")
def telegram_auth(payload: TelegramAuthRequest):
    user = validate_telegram_init_data(payload.init_data, BOT_TOKEN)
    return {"authenticated": True, "user": user}
