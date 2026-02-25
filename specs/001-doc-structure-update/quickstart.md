# Quickstart: 문서 구조 최신화 검증

## 1) 구조 기준 확인
1. 루트 구조 확인: `backend/`, `frontend/`, `design-system/`, `docs/`, `specs/`
2. 프론트엔드 구조 확인: `frontend/app`, `frontend/src/app` 병행 구조
3. 문서 대상 범위 확인: `design-system/`, `specs/`, `docs/`

## 2) 경로 동기화 절차
1. 문서 내 경로 참조 수집
2. 실제 디렉터리 존재 여부 검증
3. `broken/legacy/duplicate` 경로 정규화
4. canonical 경로 표기로 통일

## 3) 검토 동선
1. `specs/001-doc-structure-update/spec.md`
2. `specs/001-doc-structure-update/plan.md`
3. `specs/001-doc-structure-update/contracts/path-sync-contract.md`
4. `design-system/MASTER.md`
5. `design-system/pages/dashboard.md`

## 4) 품질 게이트
```bash
cd C:/Users/khc/Desktop/fastcampus/ant_gravity_test/frontend
pnpm lint
pnpm typecheck
```

## 5) 추적성 기록
1. `docs/개발일지/`에 작성시각/문제/해결/미해결 기록
2. `docs/prompt/`에 사용 프롬프트 기록

## 6) 완료 조건
- 경로 불일치 0건
- 품질 게이트 통과
- 기록 갱신 완료
