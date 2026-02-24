# 2026-02-24_23-35-02 프록시 환경 정리

## 작성시각
2026-02-24 23:35:02

## 해결하고자 한 문제
- 백엔드 실행 환경에 잘못된 시스템 프록시(`127.0.0.1:9`)가 주입되면 yfinance 기반 외부 시세 호출이 실패하고 `/api/predictions/{ticker}/path`가 500 오류를 반환함.

## 진행 내용
- `backend/main.py`
  - 앱 시작 시 `DISABLE_SYSTEM_PROXY_FOR_MARKET_DATA=true`(기본)인 경우 프록시 환경변수(`HTTP_PROXY`, `HTTPS_PROXY`, `ALL_PROXY`, 소문자 포함)를 제거하도록 추가.
  - `NO_PROXY`/`no_proxy`에 `localhost,127.0.0.1` 보장.
- `backend/.env.example`
  - `DISABLE_SYSTEM_PROXY_FOR_MARKET_DATA=true`
  - `NO_PROXY=localhost,127.0.0.1`
- `backend/scripts/start-backend.ps1`
  - 실행 스크립트에서 프록시 변수 정리 후 uvicorn 실행.

## 해결된 것
- yfinance 설치 후 백엔드 재기동 시 프록시 오염으로 인한 시세 API 연결 실패를 기본 설정에서 방지.
- 로컬 실행 명령을 스크립트로 일관화 가능.

## 해결되지 않은 것
- 저장소 `README.md`는 현재 UTF-8이 아닌 인코딩이라 자동 패치 도중 인코딩 오류가 발생해 이번 단계에서 수정 제외.
