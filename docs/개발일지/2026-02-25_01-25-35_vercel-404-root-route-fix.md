# Vercel 404 루트 라우트 수정

- 작성시각: 2026-02-25 01:25:35
- 해결하고자 한 문제: Vercel 배포 후 `/` 접속 시 `404: NOT_FOUND` 발생
- 진행 내용:
  - `frontend/app/page.tsx` 파일 부재 확인
  - `frontend/app/page.tsx`를 추가해 `src/app/page` 랜딩을 루트 라우트로 연결
- 해결된 것:
  - App Router 기준 루트 페이지 누락 문제 수정
- 해결되지 않은 것:
  - Vercel 프로젝트 설정의 Root Directory가 `frontend`가 아닌 경우 배포 설정 측면에서 여전히 404 가능성 존재
