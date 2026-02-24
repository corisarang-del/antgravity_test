# Quickstart: 디자인 지침 동기화 검증

## 1) 기준 문서 확인
1. `frontend/src/app/globals.css` 토큰 정의 확인
2. `frontend/src/app/design-system/page.tsx` 프리뷰 구조 확인
3. `design-system/MASTER.md`, `design-system/pages/dashboard.md` 문서 범위 확인

## 2) 동기화 포인트 점검
1. 색상/간격/그림자/상태 토큰이 문서와 코드에 동일하게 존재하는지 확인
2. 웹뷰 제약(safe-area, 터치 영역, 모바일 가독성) 명시 여부 확인
3. 라이트/다크 규칙과 접근성 항목(대비/포커스) 포함 여부 확인
4. 금지 패턴이 명시돼 있는지 확인

## 3) 검토 동선
1. `design-system/MASTER.md`에서 공통 규칙 확인
2. `design-system/tokens/shadcn-webview-tokens.css`에서 토큰 규칙 확인
3. `design-system/pages/dashboard.md`에서 페이지 오버라이드 확인
4. `frontend/src/app/design-system/page.tsx`에서 프리뷰 정합성 확인
5. `contracts/validation-checklist.md`로 최종 체크

## 4) 접근성 검증
- 본문 텍스트 대비 4.5:1 미만 항목이 0건인지 확인
- 포커스 가시성 및 상태 구분이 색상 외 수단으로도 전달되는지 확인

## 5) 품질 게이트
```bash
cd frontend
pnpm lint
pnpm typecheck
```

## 6) 추적성 기록
- `docs/개발일지/`에 작성시각, 해결한 문제/미해결 문제 기록
- `docs/prompt/`에 사용 프롬프트 기록

## 7) 실행 결과 기록
- 2026-02-24 기준 `pnpm lint`, `pnpm typecheck` 통과
- 동기화 문서/토큰/프리뷰 정합성 확인 완료
