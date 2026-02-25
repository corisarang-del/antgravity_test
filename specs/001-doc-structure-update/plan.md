# 구현 계획서: 문서 구조 최신화

**브랜치**: `001-doc-structure-update` | **작성일**: 2026-02-24 | **명세**: [spec.md](C:/Users/khc/Desktop/fastcampus/ant_gravity_test/specs/001-doc-structure-update/spec.md)
**입력**: `/specs/001-doc-structure-update/spec.md`의 기능 명세

## 요약

현재 저장소 구조와 문서 참조 경로의 불일치를 제거한다. 핵심은 문서 경로 인벤토리 기준으로
구버전 경로를 최신 구조로 정규화하고, 실행/검증/온보딩 동선을 같은 구조 기준으로 재정렬하는 것이다.

## 기술 맥락

**언어/버전**: Markdown, TypeScript 5.x, Python 3.12(백엔드 런타임 존재)  
**주요 의존성**: Next.js 16, Tailwind CSS v4, FastAPI(백엔드), shadcn/ui 구성  
**저장소**: 파일 기반 문서 저장소(Git working tree)  
**테스트**: `pnpm lint`, `pnpm typecheck`  
**대상 플랫폼**: 문서 소비 환경(개발자 로컬, CI 리뷰), 웹뷰 프론트엔드 개발 컨텍스트
**프로젝트 유형**: 웹 애플리케이션(프론트엔드+백엔드) + 문서 동기화 기능  
**성능 목표**: 신규 팀원이 15분 내 핵심 문서 5개 위치/목적 파악  
**제약사항**: GPS/정밀 위치 저장 금지, PascalCase/camelCase 규칙 유지, pnpm 품질 게이트 필수, 문서 경로 불일치 0건  
**규모/범위**: `design-system/`, `specs/`, `frontend/` 관련 가이드 문서 및 계약 문서 최신화

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
C:/Users/khc/Desktop/fastcampus/ant_gravity_test/specs/001-doc-structure-update/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── path-sync-contract.md
└── tasks.md  # /speckit.tasks 단계에서 생성/갱신
```

### 소스 코드 구조 (저장소 루트)

```text
C:/Users/khc/Desktop/fastcampus/ant_gravity_test/
├── backend/
│   ├── main.py
│   └── requirements.txt
├── frontend/
│   ├── app/                  # 라우트 브리지/실사용 app 경로
│   ├── src/
│   │   └── app/              # UI/디자인 시스템 소스
│   ├── features/
│   └── lib/
├── design-system/
│   ├── MASTER.md
│   └── pages/
├── docs/
│   ├── 개발일지/
│   └── prompt/
└── specs/
```

**구조 결정**: 웹 애플리케이션(프론트+백) 구조를 기준으로 문서 경로를 최신화한다. 특히 `frontend/app`과 `frontend/src/app`의 병행 구조를 공식 경로로 문서화해 경로 드리프트를 방지한다.

## Phase 0: Outline & Research

- 현재 구조 기준 문서 경로 표준 결정(절대 경로 기준 문서화 원칙)
- 문서 경로 인벤토리 수집 범위 결정(검증 대상/제외 대상)
- 실행/검증/온보딩 동선 정규화 기준 결정

**출력물**: `research.md`

## Phase 1: Design & Contracts

- 엔터티 모델 정의: 경로 인벤토리, 동기화 규칙, 검토 체크포인트, 온보딩 동선
- 계약 정의: 경로 검증 규칙, 불일치 분류, 완료 조건, 품질 게이트
- 실행 가이드 최신화: 구조 점검 → 동기화 반영 → 품질 게이트 → 기록 갱신

**출력물**:
- `data-model.md`
- `contracts/path-sync-contract.md`
- `quickstart.md`

## Post-Design 헌법 재점검

- [x] 개인정보 제약 위반 없음 (GPS/정밀 위치 저장 요구 없음)
- [x] 네이밍 규칙 문서화 유지 (PascalCase/camelCase)
- [x] 품질 게이트 실행 절차 문서화 (`pnpm lint`, `pnpm typecheck`)
- [x] 단계별 기록 갱신 계획 포함 (`docs/개발일지/`, `docs/prompt/`)

## 복잡도 추적

해당 없음. 헌법 위반 및 예외 승인 필요 항목 없음.
