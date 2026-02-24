# 2026-02-24_23-52-33 vercel-react-best-practices 미디엄/로우 개선

## 작성시각
2026-02-24 23:52:33

## 해결하고자 한 문제
- vercel-react-best-practices 리뷰에서 Medium/Low 항목으로 지적된 성능 개선점 반영.

## 진행 내용
- `frontend/src/app/dashboard/page.tsx`
  - `DataStatusBadge`, `CacheStatusPanel`, `RefreshPolicyInfo`, `RealtimeEligibilityInfo` 동적 import 적용.
  - SWR fetcher 인라인 함수를 `useCallback`으로 안정화.
  - 차트 marker 좌표 계산에서 min/max + 좌표 계산을 단일 루프 기반으로 최적화.
  - 근거 탭 라벨 배열을 상수화하여 정적 메타를 컴포넌트 외부로 이동.

## 해결된 것
- 초기 번들 부담 완화(하단/보조 패널의 지연 로딩).
- 렌더링 시 불필요한 fetcher 함수 재생성 제거.
- 차트 좌표 계산의 반복 배열 순회 비용 감소.

## 해결되지 않은 것
- 없음.

## 검증
- `pnpm.cmd lint` 통과
- `pnpm.cmd typecheck` 통과
