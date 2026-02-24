# Contract Gap Report (001-ant-gravity-webview-app)

- Date: 2026-02-24
- Scope: `specs/001-ant-gravity-webview-app/contracts/api-contract.yaml` vs current backend route scaffold

## Covered
- Symbols list: `/api/symbols`
- Prediction summary: `/api/predictions/{ticker}`
- Indicators snapshot: `/api/indicators/{ticker}`
- Prediction history: `/api/prediction-history/{ticker}`
- Watchlist CRUD: `/api/watchlist`, `/api/watchlist/{ticker}`
- Alert preferences read/write: `/api/alert-preferences`, `/api/alert-preferences/{symbol}`
- Notifications read flow: `/api/notifications`, `/api/notifications/{notification_id}/read`

## Remaining gaps
- Auth provider integration not wired (header 기반 mock access context)
- Persistent DB repository layer not wired (in-memory store 사용)
- Background scheduler wiring missing (dispatcher 함수만 구현)
- Error schema standardization not complete across all endpoints

## Action
- Planning phase 이후 DB 연결 및 인증 어댑터 연결 태스크에서 보완 필요