# Vercel React Best Practices 이슈 전체 수정

- 작성시각: 2026-02-24 22:48:49
- 해결하고자 한 문제:
  - 대시보드 페이지에서 검색 입력 시 과도한 리렌더 및 파생 연산 재실행
  - 정적 SVG JSX가 렌더 함수 내부에 있어 렌더링 비용 증가
  - 파생값 계산이 인라인으로 분산되어 유지보수성과 성능 안정성 저하

- 해결된 것:
  - `filteredSymbols`, `directionMeta`, `tickerName`, `targetPrice`를 `useMemo`로 캐싱
  - 정적 차트 SVG를 `PredictionPathChart` 컴포넌트로 hoist + `memo` 적용
  - 메인 분석 섹션/요약 지표 섹션을 `memo` 컴포넌트(`MainAnalysisSection`, `MetricsRow`)로 분리
  - 인라인 파생 계산 일부를 상단 파생값으로 정리
  - `pnpm.cmd lint`, `pnpm.cmd typecheck` 통과

- 해결되지 않은 것:
  - 없음
