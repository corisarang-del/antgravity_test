# 앤트 그래비티 (Ant Gravity)

개미 투자자를 위한 AI 주가 예측 웹앱.

## 빠른 시작

### 1) 환경 변수 설정
```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

### 2) DB 마이그레이션 적용
Supabase SQL Editor에서 아래 순서대로 실행:
- `supabase/migrations/0001_init.sql` (존재 시)
- `supabase/migrations/0002_user_access_policy.sql`
- `supabase/migrations/0003_prediction_domain.sql`

### 3) 백엔드 실행
```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```
- API Health: `http://localhost:8000/health`

### 4) 프론트엔드 실행
```bash
cd frontend
pnpm install
pnpm run dev
```
- 앱: `http://localhost:3000`

## 핵심 정책
- 비로그인: 대시보드/근거/이력 조회 가능
- 로그인 필수: 관심종목/알림 설정
- 알림 채널: 인앱만 지원
- 갱신 주기:
  - 기본: 장중 15분 + 장마감 1회
  - 유료 또는 고레벨(70점 이상): 1분
- 개인정보: GPS/정밀 위치 저장 금지

## 품질 게이트
```bash
cd frontend
pnpm lint
pnpm typecheck
```

## 주요 경로
- 프론트 라우트: `frontend/src/app/`
- 백엔드 API: `backend/app/api/routes/`
- 서비스: `backend/app/services/`
- 마이그레이션: `supabase/migrations/`
- 스펙: `specs/001-ant-gravity-webview-app/`