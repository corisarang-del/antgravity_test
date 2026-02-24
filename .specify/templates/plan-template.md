# 구현 계획서: [FEATURE]

**브랜치**: `[###-feature-name]` | **작성일**: [DATE] | **명세**: [link]
**입력**: `/specs/[###-feature-name]/spec.md`의 기능 명세

**참고**: 이 템플릿은 `/speckit.plan` 명령으로 채워진다. 실행 흐름은
`.specify/templates/plan-template.md`를 참고한다.

## 요약

[기능 명세에서 핵심 요구사항과 리서치 기반 기술 접근을 추출]

## 기술 맥락

<!--
  작업 필요: 이 섹션은 반드시 프로젝트에 맞는 실제 기술 정보로 교체한다.
  아래 구조는 반복 수행을 돕기 위한 가이드다.
-->

**언어/버전**: [예: Python 3.11, Swift 5.9, Rust 1.75 또는 확인 필요]  
**주요 의존성**: [예: FastAPI, UIKit, LLVM 또는 확인 필요]  
**저장소**: [해당 시: PostgreSQL, CoreData, 파일 또는 N/A]  
**테스트**: [예: pytest, XCTest, cargo test 또는 확인 필요]  
**대상 플랫폼**: [예: Linux server, iOS 15+, WASM 또는 확인 필요]
**프로젝트 유형**: [예: library/cli/web-service/mobile-app/compiler/desktop-app 또는 확인 필요]  
**성능 목표**: [도메인 기준 수치, 예: 1000 req/s, 10k lines/sec, 60 fps 또는 확인 필요]  
**제약사항**: [도메인 제약, 예: <200ms p95, <100MB memory, offline-capable 또는 확인 필요]  
**규모/범위**: [도메인 규모, 예: 10k users, 1M LOC, 50 screens 또는 확인 필요]

## 헌법 점검

*게이트: 0단계 리서치 전에 반드시 통과하고, 1단계 설계 후 재확인한다.*

- [ ] 명세 우선 범위가 정의되어 있고 모호점이 열린 이슈로 정리되어 있다.
- [ ] 개인정보 제약(특히 GPS 저장 금지)이 명시되어 있다.
- [ ] 네이밍 제약(PascalCase 컴포넌트, camelCase 변수)이 반영되어 있다.
- [ ] 품질 게이트(`pnpm lint`, `pnpm typecheck`) 실행 계획이 포함되어 있다.
- [ ] 단계 산출물에 `docs/개발일지/`, `docs/prompt/` 갱신이 포함되어 있다.

## 프로젝트 구조

### 문서 구조 (해당 기능)

```text
specs/[###-feature]/
├── plan.md              # 이 파일 (/speckit.plan 출력)
├── research.md          # 0단계 출력 (/speckit.plan)
├── data-model.md        # 1단계 출력 (/speckit.plan)
├── quickstart.md        # 1단계 출력 (/speckit.plan)
├── contracts/           # 1단계 출력 (/speckit.plan)
└── tasks.md             # 2단계 출력 (/speckit.tasks, /speckit.plan은 생성 안 함)
```

### 소스 코드 구조 (저장소 루트)
<!--
  작업 필요: 아래 예시 트리를 실제 기능 구조로 교체한다.
  사용하지 않는 옵션은 제거하고 선택한 구조를 실제 경로로 구체화한다.
  최종 계획서에는 옵션 라벨이 남아 있으면 안 된다.
-->

```text
# [미사용 시 제거] 옵션 1: 단일 프로젝트 (기본)
src/
├── models/
├── services/
├── cli/
└── lib/

tests/
├── contract/
├── integration/
└── unit/

# [미사용 시 제거] 옵션 2: 웹 애플리케이션 ("frontend" + "backend" 감지 시)
backend/
├── src/
│   ├── models/
│   ├── services/
│   └── api/
└── tests/

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   └── services/
└── tests/

# [미사용 시 제거] 옵션 3: 모바일 + API ("iOS/Android" 감지 시)
api/
└── [backend와 동일 구조]

ios/ 또는 android/
└── [플랫폼별 구조: 기능 모듈, UI 흐름, 플랫폼 테스트]
```

**구조 결정**: [선택한 구조를 문서화하고 위에 기재한 실제 경로를 참조]

## 복잡도 추적

> **헌법 점검 위반이 있고 정당화가 필요한 경우에만 작성**

| 위반 항목 | 필요한 이유 | 더 단순한 대안을 기각한 이유 |
|-----------|-------------|-------------------------------|
| [예: 4번째 프로젝트] | [현재 필요] | [왜 3개 프로젝트로 부족한지] |
| [예: Repository 패턴] | [구체적 문제] | [직접 DB 접근이 왜 부족한지] |

