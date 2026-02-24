# 프롬프트 기록 - Hydration 오류 수정

- 작성시각: 2026-02-24 22:52:08
- 사용자 프롬프트:
  - "Recoverable Error ... Hydration failed because the server rendered text didn't match the client"

- 해결하고자 한 문제:
  - 대시보드 진입 시 SSR/CSR 인증 상태 불일치로 인한 hydration 실패

- 해결된 것:
  - AuthProvider 초기화/세션 복원 타이밍 분리로 SSR/CSR 초기 렌더 일치 보장

- 해결되지 않은 것:
  - 없음
