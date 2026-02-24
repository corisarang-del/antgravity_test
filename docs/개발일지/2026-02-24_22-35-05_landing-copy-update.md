# 랜딩 문구 개미 친화 카피 수정

- 작성시각: 2026-02-24 22:35:05
- 해결하고자 한 문제:
  - 랜딩 페이지 문구가 기능 중심이라 초보/개미 투자자 관점의 친화적 전달력이 약함
  - 레이아웃은 유지하고 카피만 톤 조정 필요

- 해결된 것:
  - rontend/src/app/page.tsx에서 레이아웃/클래스 유지한 채 카피만 개미 투자자 친화적으로 교체
  - 디자인 규칙 검수: 토큰(--primary, --secondary, --accent), 카드/버튼 패턴(order-2 border-black, shadow-[var(--shadow-comic)])이 기존 대시보드와 일치 확인
  - pnpm.cmd lint, pnpm.cmd typecheck 통과

- 해결되지 않은 것:
  - 없음
