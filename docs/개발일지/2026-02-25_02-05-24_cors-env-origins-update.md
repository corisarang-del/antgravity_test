# CORS 환경변수 기반 허용 도메인 반영

- 작성시각: 2026-02-25 02:05:24
- 해결하고자 한 문제: 배포 프론트 도메인에서 백엔드 API 호출 시 CORS 차단 가능성
- 진행 내용:
  - `backend/main.py`의 CORS 허용 도메인을 고정 리스트에서 환경변수 파싱 방식으로 변경
  - `backend/.env.example`에 `CORS_ALLOWED_ORIGINS` 항목 추가
- 해결된 것:
  - Render/Vercel 배포 도메인을 환경변수만으로 허용 가능
- 해결되지 않은 것:
  - 실제 Render 환경변수 값 입력 및 재배포는 운영 단계에서 별도 수행 필요
