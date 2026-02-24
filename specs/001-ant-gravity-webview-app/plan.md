# 구현 계획서: Ant Gravity AI 주가 예측 웹앱

**브랜치**: `001-ant-gravity-webview-app` | **작성일**: 2026-02-24 | **명세**: [spec.md](./spec.md)
**입력**: `/specs/001-ant-gravity-webview-app/spec.md`의 기능 명세

## 요약

README 기반 Ant Gravity 서비스를 웹뷰 친화형 웹앱으로 구현한다. 핵심은 예측 대시보드,
예측 근거/이력, 관심종목/인앱알림이며, 시각 스타일은 "세련되고 친근하고 깔끔하며
신뢰를 주면서 퍼니한 느낌"을 만족해야 한다. 접근 정책은 비로그인 조회 허용 범위와
로그인 필수 개인화 범위를 분리한다.

## 기술 맥락

**언어/버전**: TypeScript (Frontend), Python 3.11 (Backend)
**주요 의존성**: Next.js 15(App Router), Tailwind CSS, FastAPI, PyTorch, Supabase
**저장소**: Supabase Postgres
**테스트**: Frontend 통합 테스트(Playwright), Backend API 테스트(pytest)
**대상 플랫폼**: 모바일 WebView + 데스크톱/모바일 브라우저
**프로젝트 유형**: 웹 애플리케이션 (frontend + backend + managed DB)
**성능 목표**: 첫 대시보드 데이터 30초 이내, 핵심 탭 이동 성공률 99% 이상
**제약사항**: GPS/정밀 위치 저장 금지, 인앱 알림 전용, 비용 최적화 캐싱 정책 준수
**규모/범위**: 초기 MVP 3개 핵심 사용자 스토리 + 예측/이력/개인화 8개 핵심 엔터티

## 헌법 점검

*게이트: 0단계 리서치 전에 반드시 통과하고, 1단계 설계 후 재확인한다.*

- [x] 명세 우선 범위가 정의되어 있고 모호점이 열린 이슈로 정리되어 있다.
- [x] 개인정보 제약(특히 GPS 저장 금지)이 명시되어 있다.
- [x] 네이밍 제약(PascalCase 컴포넌트, camelCase 변수)이 반영되어 있다.
- [x] 품질 게이트(`pnpm lint`, `pnpm typecheck`) 실행 계획이 포함되어 있다.
- [x] 단계 산출물에 `docs/개발일지/`, `docs/prompt/` 갱신이 포함되어 있다.

게이트 판정: 통과. 헌법 위반 없음.

## 프로젝트 구조

### 문서 구조 (해당 기능)

```text
specs/001-ant-gravity-webview-app/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── api-contract.yaml
│   └── ui-contract.md
└── tasks.md
```

### 소스 코드 구조 (저장소 루트)

```text
backend/
├── app/
│   ├── api/
│   ├── services/
│   ├── models/
│   └── workers/
└── tests/

frontend/
├── app/
├── components/
├── features/
├── lib/
└── tests/

supabase/
└── migrations/
```

**구조 결정**: 웹 애플리케이션 구조(backend + frontend + supabase)를 채택한다.
데이터/AI 추론/권한 처리는 backend와 supabase에 집중하고, frontend는 웹뷰 친화 UI/UX와
상태 표현에 집중한다.

## 복잡도 추적

해당 없음 (헌법 점검 위반 없음)

## 설계 후 헌법 점검(재확인)

- [x] spec 기준으로 research/data-model/contracts/quickstart를 생성했다.
- [x] 개인정보 제약(GPS 저장 금지)이 data-model/contract 전반에 유지된다.
- [x] 품질 게이트(`pnpm lint`, `pnpm typecheck`)가 quickstart와 계획에 반영됐다.
- [x] 단계별 기록 갱신(`docs/개발일지/`, `docs/prompt/`) 요구를 유지한다.

재점검 판정: 통과. 설계 산출물과 헌법 간 충돌 없음.
