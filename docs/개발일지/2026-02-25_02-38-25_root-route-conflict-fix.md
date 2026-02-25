# 루트 라우트 충돌 정리

- 작성시각: 2026-02-25 02:38:25
- 해결하고자 한 문제: Vercel 배포에서 `/` 요청이 404로 반환되는 문제
- 진행 내용:
  - `frontend/app/page.tsx`와 `frontend/app/(dashboard)/page.tsx`가 모두 `/` 경로를 점유하는 구조 확인
  - `frontend/app/(dashboard)/page.tsx` 삭제로 루트 라우트 단일화
- 해결된 것:
  - `/` 경로 중복 정의 제거
- 해결되지 않은 것:
  - Vercel 재배포 및 실제 도메인 반영 확인은 운영 단계에서 추가 확인 필요
