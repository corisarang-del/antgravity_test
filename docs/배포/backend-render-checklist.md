# Backend 배포 체크리스트 (Render 기준)

## 1) Render 서비스 생성

- [ ] Render에서 `New +` → `Web Service` 선택
- [ ] 저장소 연결: `corisarang-del/antgravity_test`
- [ ] Root Directory: `backend`
- [ ] Runtime: `Python 3`

## 2) Build / Start 명령 설정

- [ ] Build Command:
```bash
pip install -r requirements.txt
```
- [ ] Start Command:
```bash
uvicorn main:app --host 0.0.0.0 --port $PORT
```

## 3) Render 환경변수 등록 (backend/.env.example 기준)

- [ ] `APP_ENV=production`
- [ ] `APP_HOST=0.0.0.0`
- [ ] `APP_PORT=8000`
- [ ] `SUPABASE_URL=...`
- [ ] `SUPABASE_ANON_KEY=...`
- [ ] `SUPABASE_SERVICE_ROLE_KEY=...`
- [ ] `GEMINI_API_KEY=...`
- [ ] `PORTONE_SECRET_KEY=...`
- [ ] `YFINANCE_CACHE_TTL_MINUTES=30`
- [ ] `ALPHA_VANTAGE_API_KEY=...`
- [ ] `DISABLE_SYSTEM_PROXY_FOR_MARKET_DATA=true`
- [ ] `NO_PROXY=localhost,127.0.0.1`

주의:
- `SUPABASE_SERVICE_ROLE_KEY`는 절대 프론트에 노출하면 안 됨
- Render Secret Env로만 관리

## 4) 헬스체크 확인

- [ ] 배포 완료 후 아래 URL 확인:
```text
https://<render-service>.onrender.com/health
```
- [ ] 응답이 `{"status":"ok"}`인지 확인

## 5) 프론트(Vercel) 연동값 설정

Vercel Project > Settings > Environment Variables:

- [ ] `NEXT_PUBLIC_API_BASE_URL=https://<render-service>.onrender.com`
- [ ] `NEXT_PUBLIC_SUPABASE_URL=<현재 사용값 유지>`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY=<현재 사용값 유지>`

설정 후:
- [ ] Vercel 재배포 (Redeploy)

## 6) CORS 필수 확인 (중요)

현재 백엔드 `backend/main.py`는 `localhost:3000`만 허용 중이라, 배포 프론트에서 API 호출 시 CORS 에러가 날 수 있음.

- [ ] Vercel 도메인 허용 추가 필요
  - 예: `https://<your-app>.vercel.app`
  - 커스텀 도메인 사용 시 해당 도메인도 추가

권장 방식:
- `CORS_ALLOWED_ORIGINS` 환경변수(콤마 구분)로 관리
- 코드에서 환경변수 파싱해서 `allow_origins`에 주입

## 7) 배포 후 스모크 테스트

- [ ] 프론트에서 로그인/회원가입 API 호출 확인
- [ ] 대시보드 종목 조회/예측 경로 조회 확인
- [ ] 한국 종목 가격 KRW 표기 동작 확인
- [ ] 브라우저 콘솔 CORS 에러 없는지 확인

## 8) 트러블슈팅 빠른 체크

- [ ] `404`면 Render Root Directory가 `backend`인지 확인
- [ ] `502/503`면 Start Command와 `requirements.txt` 설치 로그 확인
- [ ] `CORS`면 `backend/main.py`의 `allow_origins` 확인
- [ ] `환경변수 누락` 에러면 Render Env Key 이름 오타 확인
