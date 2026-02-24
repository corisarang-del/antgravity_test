# Hydration mismatch 핫픽스 (AuthProvider)

- 작성시각: 2026-02-24 22:52:08
- 해결하고자 한 문제:
  - 서버 렌더와 클라이언트 첫 렌더의 인증 텍스트가 달라 hydration mismatch 발생

- 해결된 것:
  - AuthProvider 초기 상태를 항상 session: null, user: null, isLoading: true로 고정
  - 로컬스토리지 세션 복원은 useEffect에서 마운트 후 실행하도록 변경
  - pnpm.cmd lint, pnpm.cmd typecheck 통과

- 해결되지 않은 것:
  - 없음
