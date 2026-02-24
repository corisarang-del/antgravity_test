# 구현 계획서: 프론트엔드 디자인 지침 동기화

**브랜치**: `001-sync-design-guidelines` | **작성일**: 2026-02-24 | **명세**: [spec.md](./spec.md)
**입력**: `/specs/001-sync-design-guidelines/spec.md`의 기능 명세

## 요약

`frontend` 폴더의 최신 디자인 지침과 참고 스타일에 맞춰 기존 문서를 동기화한다.
핵심은 문서 간 규칙 충돌 제거, 웹뷰 제약 반영, 디자인 토큰 기준 일원화,
그리고 리뷰/온보딩에 바로 활용 가능한 문서 구조 정리다.

## 기술 맥락

**언어/버전**: TypeScript 5.x, Markdown  
**주요 의존성**: Next.js 16, shadcn/ui CLI, Tailwind CSS v4  
**저장소**: N/A (문서/토큰 정의 작업)  
**테스트**: `pnpm lint`, `pnpm typecheck`  
**대상 플랫폼**: 모바일 웹뷰 + 데스크톱 브라우저 문서 소비 환경
**프로젝트 유형**: web-app (design-document sync feature)  
**성능 목표**: 신규 팀원이 15분 내 규칙 5개 이상 식별 가능  
**제약사항**: GPS/정밀 위치 저장 금지, 네이밍 규칙 준수, 문서 충돌 0건, 본문 텍스트 대비 4.5:1 미만 0건  
**규모/범위**: 디자인 시스템 문서(공통 1개 + 페이지 오버라이드 + 토큰) 동기화

## 헌법 점검

*게이트: 0단계 리서치 전에 반드시 통과하고, 1단계 설계 후 재확인한다.*

- [x] 명세 우선 범위가 정의되어 있고 모호점이 열린 이슈로 정리되어 있다.
- [x] 개인정보 제약(특히 GPS 저장 금지)이 명시되어 있다.
- [x] 네이밍 제약(PascalCase 컴포넌트, camelCase 변수)이 반영되어 있다.
- [x] 품질 게이트(`pnpm lint`, `pnpm typecheck`) 실행 계획이 포함되어 있다.
- [x] 단계 산출물에 `docs/개발일지/`, `docs/prompt/` 갱신이 포함되어 있다.

## 프로젝트 구조

### 문서 구조 (해당 기능)

```text
specs/001-sync-design-guidelines/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── design-guideline-contract.md
│   └── (동기화/검증 보조 문서)
└── tasks.md
```

### 소스 코드 구조 (저장소 루트)

```text
frontend/
├── src/
│   ├── app/
│   │   ├── globals.css
│   │   └── design-system/page.tsx
│   └── lib/
├── components.json
└── package.json

design-system/
├── MASTER.md
├── pages/
│   └── dashboard.md
├── refer/
└── tokens/
    └── shadcn-webview-tokens.css
```

**구조 결정**: 웹 애플리케이션 구조를 유지하고, 디자인 문서/토큰은 `design-system/`에
집중 배치한다. 구현 확인 페이지는 `frontend/src/app/design-system/page.tsx`를 사용한다.

## Phase 0: Outline & Research

- 디자인 기준 소스 결정: `frontend` 내부 지침/토큰/프리뷰 페이지를 우선 기준으로 채택
- 참고 스타일 적용 원칙: 참고 홈피의 시각 키워드는 그대로 복제하지 않고 금융 신뢰 UX에 맞게 정제
- 헌법 제약 적용: 개인정보/네이밍/품질게이트/추적성 요구를 문서 항목으로 강제

출력물: [research.md](./research.md)

## Phase 1: Design & Contracts

- 엔터티 정의: 문서, 페이지 오버라이드, 토큰 세트, 레퍼런스 스타일 항목
- 계약 정의: 문서 동기화 규칙, 필수 섹션, 허용/금지 항목, 검증 기준(본문 대비 4.5:1 포함)
- 빠른 검증 가이드: 문서 갱신 후 확인 순서와 품질게이트 실행 절차 제공

출력물:
- [data-model.md](./data-model.md)
- [contracts/design-guideline-contract.md](./contracts/design-guideline-contract.md)
- [quickstart.md](./quickstart.md)

## Post-Design 헌법 재점검

- [x] 개인정보 제약 위반 없음 (GPS/정밀 위치 저장 요구 없음)
- [x] 네이밍 규칙 문서화 유지 (PascalCase/camelCase)
- [x] 품질 게이트 실행 절차 문서화 (`pnpm lint`, `pnpm typecheck`)
- [x] 단계별 기록 갱신 계획 포함 (`docs/개발일지/`, `docs/prompt/`)

## 복잡도 추적

해당 없음. 헌법 점검 위반 항목 없음.
