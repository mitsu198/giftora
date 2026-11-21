# GIFTORA

Mobile-first Telegram digital gifts experience.

## Stack
- React + TypeScript + Vite
- TON Connect UI React for wallet connection
- Telegram Mini Apps WebApp bridge
- FastAPI backend for server-side Telegram initData verification

## Local development

Frontend:
```bash
npm install
npm run dev
```

Backend:
```bash
cd backend
python -m venv .venv
# activate the virtual environment, then:
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload --port 8000
```

Set `VITE_API_BASE_URL=http://localhost:8000` in a root `.env.local` when testing the backend. Set `TELEGRAM_BOT_TOKEN` in `backend/.env` (never expose it as a VITE_ variable). Telegram authentication only succeeds after the backend has a valid bot token and verifies the signed initData.

## TON Connect setup

The frontend loads `/tonconnect-manifest.json` from its own origin. Before deploying, update the manifest's `url` to the actual HTTPS app domain and set `iconUrl` to a publicly accessible 180x180 PNG or ICO owned by GIFTORA. The current icon URL is a temporary placeholder. Wallets must be configured to the TON Testnet for the initial test phase; the UI labels the connected chain and warns when the wallet is not on Testnet. No transactions are sent by this prototype.

## Backend deployment

The root `render.yaml` describes a separate FastAPI web service. Before deploying, replace the example CORS origin with the actual frontend origin and add `TELEGRAM_BOT_TOKEN` as a secret environment variable in Render. The backend's `/health` route is used for health checks.

## Current scope and safety

The first frontend catalog entries and displayed TON values are mock presentation data. They do not represent live listings, ownership, or on-chain transactions. Telegram initData is validated server-side using Telegram's HMAC procedure and an expiry window. The current auth endpoint verifies the Telegram identity payload but does not yet issue a persistent login session or store user records.

Official Telegram collectible gift availability and real asset ownership must be verified through authoritative Telegram/TON data before showing them as live assets. Wallet private keys are never requested or stored. Telegram digital-goods payment rules must be respected; TON Connect is not a workaround for Telegram Stars requirements.
