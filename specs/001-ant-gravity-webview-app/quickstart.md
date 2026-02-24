# Quickstart - Ant Gravity AI 주가 예측 웹앱

## 1) 사전 조건
- Node.js LTS
- Python 3.11
- pnpm
- Supabase 프로젝트 접근 권한

## 2) 환경 변수 설정
```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```
민감 키는 절대 커밋하지 않는다.

## 3) 데이터베이스 준비
Supabase SQL Editor에서 아래 순서로 실행:
1. `supabase/migrations/0001_init.sql` (존재 시)
2. `supabase/migrations/0002_user_access_policy.sql`
3. `supabase/migrations/0003_prediction_domain.sql`

## 4) 백엔드 실행
```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

## 5) 프론트엔드 실행
```bash
cd frontend
pnpm install
pnpm run dev
```

## 5-1) 현재 저장소 구조 기준 경로 참고
- 프론트엔드 앱 라우트: `frontend/src/app/`
- 대시보드 메인 화면: `frontend/src/app/page.tsx`
- 디자인 시스템 프리뷰: `frontend/src/app/design-system/page.tsx`
- 디자인 토큰 소스: `design-system/tokens/shadcn-webview-tokens.css`

## 6) 핵심 플로우 검증
1. 비로그인 상태로 대시보드/근거/이력 조회
2. 로그인 후 관심 종목 추가/삭제
3. 알림 설정 저장 후 인앱 알림 읽음 처리
4. 일반/유료(또는 고레벨) 갱신 주기 정책 UI 확인

## 7) 품질 게이트
```bash
cd frontend
pnpm lint
pnpm typecheck
```

## 7-1) 최신 실행 결과 (2026-02-24)
- `pnpm.cmd lint`: PASS
- `pnpm.cmd typecheck`: PASS
- `python -m compileall backend`: PASS

## 8) 디자인 체크포인트
- 세련됨: 정보 밀도 대비 여백과 계층이 명확한지
- 친근함: 카피/아이콘이 과하지 않게 따뜻한지
- 깔끔함: 색상/타이포/컴포넌트 규칙이 일관적인지
- 신뢰+퍼니: 데이터 신뢰를 해치지 않는 범위의 경쾌한 표현인지
