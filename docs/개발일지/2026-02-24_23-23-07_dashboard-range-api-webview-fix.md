# 대시보드 고정 검색바 + 기간별 차트 API 연동

- 작성시각: 2026-02-24 23:23:07
- 해결하고자 한 문제:
  - 대시보드 종목 검색창 고정 동작이 웹뷰 스크롤 맥락에서 불안정
  - 1D/1W/1M/3M 버튼이 UI 상태만 바꾸고 차트 데이터는 반영되지 않음
  - 차트/근거 지표가 백엔드 실데이터 피처셋(6개) 기반으로 갱신되지 않음

- 해결된 것:
  - 검색바를 ixed 상단 바 구조로 변경하고 safe-area 기준으로 고정 처리
  - 백엔드 신규 엔드포인트 /api/predictions/{ticker}/path?range= 추가
  - 데이터 소스 체인 구현: yfinance 기본 + Alpha Vantage(fallback, 키 있을 때) + CNN Fear&Greed
  - 6개 피처셋 반영: Close, Volume, VIX, Fear&Greed, RSI(14), MACD
  - 프론트에서 selectedRange 변화 시 SWR 재요청으로 차트/마커/피처셋 갱신
  - pnpm.cmd lint, pnpm.cmd typecheck, python -m compileall backend/app 통과

- 해결되지 않은 것:
  - 로컬 실행 전 백엔드 의존성 설치 필요(yfinance 추가됨)
