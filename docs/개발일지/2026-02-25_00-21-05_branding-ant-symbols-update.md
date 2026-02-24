# 2026-02-25_00-21-05 나노바나나 캐릭터/워드마크 적용 및 종목 확장

## 작성시각
2026-02-25 00:21:05

## 해결하고자 한 문제
- 개미 코치 캐릭터를 3D 귀여운 버전(v3)으로 반영.
- 랜딩 상단 브랜드 영역에 ANT GRAVITY 워드마크 추가.
- 종목 목록에 삼성전자/하이닉스/현대차 추가.

## 진행 내용
- 나노바나나로 워드마크 이미지 생성 후 `frontend/public/branding`에 배치.
- 기존 생성된 v3 개미 이미지도 같은 디렉터리에 배치.
- 대시보드 `AntCoachCard`를 SVG에서 이미지(`ant-mascot-v3.png`)로 교체.
- 랜딩 헤더에 `ant-gravity-wordmark.png` 표시 추가.
- `backend/app/store.py`에 KRX 종목 3개 및 예측/지표/히스토리 mock 데이터 확장.
- `frontend/src/features/dashboard/useDashboardData.ts` fallback 심볼/요약/캐시 확장.

## 해결된 것
- 요청한 v3 개미 캐릭터 실제 UI 반영 완료.
- 랜딩 상단에 ANT GRAVITY 워드마크 반영 완료.
- 종목 선택 리스트에 삼성전자/하이닉스/현대차 추가 완료.

## 해결되지 않은 것
- 없음.

## 검증
- `pnpm.cmd lint` 통과
- `pnpm.cmd typecheck` 통과
- `python -m compileall backend/app` 통과
