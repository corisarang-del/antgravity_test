# 2026-02-25 Vercel 리뷰 기반 접근성·성능 최적화 및 proxy 파일 정리

## 작성시각
2026-02-25

## 해결하고자 한 문제
- `/vercel-review` 스킬 실행 결과 도출된 HIGH 4개, MEDIUM 5개 이슈 수정.
- `/vercel-react-best-practices` 스킬 실행 결과 도출된 HIGH 1개, MEDIUM 1개, LOW-MEDIUM 1개, LOW 1개 이슈 수정.
- 구조 이전(`src/`) 완료 후 남아 있던 루트 proxy 파일 28개 제거.

---

## 진행 내용

### vercel-review — 접근성

- `src/components/LoginRequiredModal.tsx`
  - 모달 컨테이너에 `role="dialog"`, `aria-modal="true"`, `aria-labelledby="login-modal-title"` 추가.
  - `<h3>`에 `id="login-modal-title"` 부여.

- `src/app/login/page.tsx`
  - 에러/성공 메시지에 `role="status"`, `aria-live="polite"` 추가.
  - 실패 메시지는 `text-[hsl(var(--destructive))]`, 성공은 `text-[hsl(var(--success))]`로 색상 구분.

- `src/lib/apiClient.ts`
  - `localStorage` 직접 파싱 코드 제거.
  - `getStoredAuthSession()` 임포트 후 활용 → 스토리지 키 단일 관리.

### vercel-review — 재렌더 최적화

- `src/features/dashboard/useDashboardData.ts`
  - `retry` 함수 `useCallback` 적용.

- `src/app/dashboard/page.tsx`
  - `handleSignOut` `useCallback` 적용 (의존성: `signOut`).
  - `handleRetryPath` 인라인 함수 분리 후 `useCallback` 적용 → `memo`된 `MainAnalysisSection` 불필요 재렌더 방지.
  - 종목 검색 `<input>`에 `autoComplete="off"` 추가.

### vercel-react-best-practices — 성능 최적화

- `src/features/history/useHistoryData.ts`
  - `ticker` 파라미터 추가.
  - 내부 API 호출 URL을 `/api/indicators/TSLA` → `/api/indicators/${ticker}` 동적화.
  - SWR 키를 `"/api/history-combined"` → `["/api/history-combined", ticker]` 배열로 변경 → 종목별 캐시 분리.

- `src/app/basis/page.tsx`, `src/app/history/page.tsx`
  - `useSearchParams()`로 URL `?ticker=` 파라미터 수신.
  - `useHistoryData(ticker)` 호출로 변경.
  - `Suspense` 경계 추가 (`useSearchParams` 요구사항).

- `src/app/dashboard/page.tsx`
  - `/basis`, `/history` 링크에 `?ticker=${dashboardData.selectedTicker}` 쿼리 추가.
  - `tickerName` 계산: `symbols.find()` O(n) → `useMemo`로 `Map` 생성 후 `Map.get()` O(1).
  - `HHMM_PATTERN` RegExp 상수를 모듈 레벨로 호이스팅 (기존: `toSimpleTimeLabel` 내부에서 매 호출 생성).
  - `filteredSymbols` `filter` 내부에서 `item.ticker.toLowerCase()`, `item.name.toLowerCase()` 각각 변수 사전 변환.

### 구조 정리

- `frontend/app/`, `frontend/components/`, `frontend/features/`, `frontend/lib/` 루트 proxy 파일 28개 삭제.
  - 해당 파일들은 `src/` 구조 이전 완료 후 더 이상 참조되지 않는 단순 재내보내기(proxy) 파일.

---

## 해결된 것

- 로그인 모달 스크린 리더 인식 가능 (role, aria-modal, labelledby).
- 로그인 에러/성공 상태를 색상만이 아닌 role="status" + aria-live로 구분.
- apiClient 스토리지 키 중복 관리 제거.
- memo 컴포넌트로 props로 전달되는 함수 참조 안정화.
- basis/history 페이지에서 선택 종목 기준 데이터 표시 (기존: 항상 TSLA).
- ticker별 SWR 캐시 분리.
- tickerName O(1) 조회.
- 불필요한 proxy 파일 제거로 저장소 구조 명확화.

## 해결되지 않은 것

- ~~`useHistoryData`의 fallback 데이터가 ticker 무관하게 단일 고정값.~~ → `getFallbackPayload()` 함수로 교체, 모든 ticker에 동일한 빈(`"-"`) 플레이스홀더 반환으로 수정 완료.
- `gh` CLI 설치 완료(v2.87.3, `/c/Users/khc/bin/gh.exe`)했으나 `read:org` 스코프 부재로 `gh auth login` 실패. PR은 GitHub REST API 직접 호출로 우회 생성.

## 검증

- `pnpm typecheck` 통과
- `pnpm lint` 통과

## 참조

- PR #2: https://github.com/corisarang-del/antgravity_test/pull/2
- 브랜치: `001-doc-structure-update`
- 커밋: `b762224` (proxy 삭제), `b45010a` (리뷰 수정)
