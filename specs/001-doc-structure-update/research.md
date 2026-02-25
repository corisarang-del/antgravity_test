# 리서치: 문서 구조 최신화

## Decision 1: 문서 구조 기준은 "현재 실제 디렉터리"로 고정
- Decision: 경로 동기화 기준은 현재 워킹트리의 실제 폴더 구조(`backend/`, `frontend/`, `design-system/`, `specs/`, `docs/`)로 고정한다.
- Rationale: 과거 스냅샷이나 추정 구조를 기준으로 하면 경로 드리프트가 반복된다.
- Alternatives considered:
  - 기존 plan의 구조 스냅샷 유지: 최신 구조 반영 실패
  - 일부 문서만 부분 반영: 문서 간 충돌 지속

## Decision 2: frontend 경로는 `app` + `src/app` 병행 구조를 공식화
- Decision: `frontend/app`과 `frontend/src/app`를 모두 문서 구조에 포함하고 역할(라우트 브리지/소스)을 명시한다.
- Rationale: 현재 프로젝트가 두 경로를 모두 사용 중이므로 단일 경로로 축약하면 오인 가능성이 높다.
- Alternatives considered:
  - `frontend/src/app`만 표기: 실제 라우트 브리지 누락
  - `frontend/app`만 표기: 디자인 소스 파일 탐색 혼선

## Decision 3: 경로 검증 범위와 제외 범위 분리
- Decision: 검증 범위는 설계/가이드 문서(`design-system/`, `specs/`, `docs/`)로 한정하고, 생성 산출물(`node_modules`, `.next`, `.venv`, 로그)은 제외한다.
- Rationale: 문서 신뢰성 점검에 필요한 신호만 남기고 노이즈를 제거한다.
- Alternatives considered:
  - 전체 트리 전수 검증: 신호 대비 비용 과다
  - 수동 탐색만 수행: 누락 위험 증가

## Decision 4: 품질 게이트는 frontend 작업 경로를 명시
- Decision: 품질 게이트는 `C:/Users/khc/Desktop/fastcampus/ant_gravity_test/frontend`에서 `pnpm lint`, `pnpm typecheck`로 실행한다.
- Rationale: 루트에서 실행 시 패키지 매니페스트 미탐색 문제가 재발할 수 있다.
- Alternatives considered:
  - 루트 기준 실행: 환경에 따라 실패 가능

## Decision 5: 검토 동선은 "구조 확인 → 경로 동기화 → 게이트 → 기록" 순서 고정
- Decision: 문서 업데이트 검토는 4단계 고정 순서로 정의한다.
- Rationale: 순서가 고정돼야 리뷰어와 구현자의 재현 가능성이 높아진다.
- Alternatives considered:
  - 문서별 임의 순서: 누락/중복 검토 발생
