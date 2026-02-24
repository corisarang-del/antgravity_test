# 작업 목록: 프론트엔드 디자인 지침 동기화

**입력**: `/specs/001-sync-design-guidelines/`의 설계 문서
**선행조건**: plan.md, spec.md, research.md, data-model.md, contracts/

## 1단계: 설정 (공통 인프라)

**목적**: 동기화 대상 문서와 검증 기준을 준비한다.

- [x] T001 동기화 대상 문서 인벤토리 작성 in `specs/001-sync-design-guidelines/contracts/document-inventory.md`
- [x] T002 품질 검증 체크리스트 문서 초안 작성 in `specs/001-sync-design-guidelines/contracts/validation-checklist.md`
- [x] T003 [P] 디자인 용어 사전 초안 작성 in `specs/001-sync-design-guidelines/contracts/glossary.md`
- [x] T004 헌법 준수 항목 매핑 작성 in `specs/001-sync-design-guidelines/contracts/constitution-mapping.md`

---

## 2단계: 기반 작업 (차단 선행조건)

**목적**: 사용자 스토리 구현 전에 필요한 공통 동기화 기반을 만든다.

- [x] T005 기존 디자인 문서 충돌 항목 추출 in `specs/001-sync-design-guidelines/contracts/conflict-log.md`
- [x] T006 `frontend` 기준 소스 매핑 표 작성 in `specs/001-sync-design-guidelines/contracts/source-of-truth-map.md`
- [x] T007 [P] 웹뷰 제약 기준 표준화 in `design-system/MASTER.md`
- [x] T008 [P] 라이트/다크 공통 규칙 기준 정리 in `design-system/MASTER.md`
- [x] T009 토큰 기준과 문서 기준 매핑 보강 in `design-system/tokens/shadcn-webview-tokens.css`
- [x] T010 문서 동기화 승인 기준(완료 정의) 고정 in `specs/001-sync-design-guidelines/contracts/design-guideline-contract.md`
- [x] T011 GPS/정밀 위치 저장 금지 검증 항목 추가 in `specs/001-sync-design-guidelines/contracts/validation-checklist.md`

**체크포인트**: 공통 기준이 확정되어 스토리별 작업을 독립 진행할 수 있어야 한다.

---

## 3단계: 사용자 스토리 1 - 디자인 기준 문서 정합화 (우선순위: P1)

**목표**: 기존 문서를 `frontend` 최신 기준으로 충돌 없이 정렬한다.

**독립 테스트**: 문서 간 충돌 로그가 0건이고 공통 규칙 문서가 단일 기준으로 설명되면 완료다.

- [x] T012 [US1] 공통 규칙 섹션 재정렬 및 충돌 해소 in `design-system/MASTER.md`
- [x] T013 [US1] 대시보드 오버라이드 규칙 정합화 in `design-system/pages/dashboard.md`
- [x] T014 [P] [US1] 참고 스타일 채택/기각 근거 반영 in `specs/001-sync-design-guidelines/contracts/reference-adoption-log.md`
- [x] T015 [US1] 문서 내 금지 패턴 항목 정규화 in `design-system/MASTER.md`
- [x] T016 [US1] 문서 간 용어 통일 반영 in `specs/001-sync-design-guidelines/contracts/glossary.md`
- [x] T017 [US1] 정합성 재검증 결과 기록 in `specs/001-sync-design-guidelines/contracts/conflict-log.md`

**체크포인트**: US1 단독으로 문서 정합성 검증이 가능해야 한다.

---

## 4단계: 사용자 스토리 2 - 웹뷰 UI 구현 가이드 일원화 (우선순위: P2)

**목표**: 웹뷰 제약/접근성/토큰 규칙을 구현 가능한 가이드로 통합한다.

**독립 테스트**: 웹뷰 제약 및 접근성 항목이 문서와 토큰에 모두 포함되면 완료다.

- [x] T018 [US2] safe-area/터치/가독성 규칙 보강 in `design-system/MASTER.md`
- [x] T019 [P] [US2] 상태 피드백(로딩/오류/빈상태) 가이드 보강 in `design-system/pages/dashboard.md`
- [x] T020 [US2] 접근성 대비/포커스 기준 반영 in `design-system/MASTER.md`
- [x] T021 [P] [US2] semantic token(success/warning/info) 문서 연동 in `design-system/tokens/shadcn-webview-tokens.css`
- [x] T022 [US2] chart 의미 토큰(up/down/neutral) 기준 정리 in `design-system/tokens/shadcn-webview-tokens.css`
- [x] T023 [US2] 웹뷰 검증 절차 최신화 in `specs/001-sync-design-guidelines/quickstart.md`
- [x] T024 [US2] 본문 텍스트 대비 4.5:1 검증 항목 추가 in `specs/001-sync-design-guidelines/contracts/validation-checklist.md`

**체크포인트**: US2 단독으로 웹뷰 구현 가이드 검증이 가능해야 한다.

---

## 5단계: 사용자 스토리 3 - 문서 기반 리뷰/온보딩 단축 (우선순위: P3)

**목표**: 신규 팀원이 문서만으로 핵심 규칙을 빠르게 이해할 수 있게 한다.

**독립 테스트**: 온보딩 체크리스트 기준으로 15분 이내 핵심 규칙 파악이 가능하면 완료다.

- [x] T025 [US3] 온보딩 요약 섹션 추가 in `design-system/MASTER.md`
- [x] T026 [P] [US3] 페이지별 적용/비적용 예시 추가 in `design-system/pages/dashboard.md`
- [x] T027 [US3] 검토 동선(무엇부터 볼지) 문서화 in `specs/001-sync-design-guidelines/quickstart.md`
- [x] T028 [US3] 문서 리뷰 체크리스트 작성 in `specs/001-sync-design-guidelines/contracts/review-checklist.md`
- [x] T029 [US3] 온보딩 성공 기준 점검 항목 작성 in `specs/001-sync-design-guidelines/contracts/onboarding-check.md`

**체크포인트**: US3 단독으로 온보딩/리뷰 시나리오 검증이 가능해야 한다.

---

## 6단계: 마무리 및 공통 개선

**목적**: 전 사용자 스토리 공통 검증과 기록을 마무리한다.

- [x] T030 동기화 결과 요약 문서 작성 in `specs/001-sync-design-guidelines/contracts/sync-summary.md`
- [x] T031 `frontend/src/app/design-system/page.tsx` 프리뷰 내용과 문서 정합성 최종 점검 in `frontend/src/app/design-system/page.tsx`
- [x] T032 [P] 품질 게이트 실행 및 결과 기록 in `specs/001-sync-design-guidelines/contracts/quality-gate-report.md`
- [x] T033 `docs/개발일지/` 단계 기록 업데이트 in `docs/개발일지/2026-02-24-design-guideline-sync.md`
- [x] T034 `docs/prompt/` 프롬프트 기록 업데이트 in `docs/prompt/2026-02-24-design-guideline-sync.md`
- [x] T035 quickstart 실행 검증 결과 반영 in `specs/001-sync-design-guidelines/quickstart.md`

---

## 의존성과 실행 순서

### 단계 의존성

- 1단계 완료 후 2단계 진행
- 2단계 완료 후 사용자 스토리 단계(3~5단계) 진행
- 3~5단계는 병렬 가능하지만 우선순위는 P1 -> P2 -> P3 권장
- 6단계는 원하는 스토리 완료 후 진행

### 사용자 스토리 의존성

- **US1 (P1)**: 2단계 완료 후 시작, 다른 스토리 의존성 없음
- **US2 (P2)**: 2단계 완료 후 시작, US1 결과를 참조하되 독립 검증 가능
- **US3 (P3)**: 2단계 완료 후 시작, US1/US2 문서 결과를 활용하되 독립 검증 가능

### 병렬 처리 기회

- T003, T007, T008 병렬 실행 가능
- US1: T014 병렬 실행 가능
- US2: T019, T021 병렬 실행 가능
- US3: T026 병렬 실행 가능
- 마무리: T032 병렬 실행 가능

---

## 병렬 실행 예시

```bash
# US2 병렬 작업
작업: "design-system/pages/dashboard.md에 상태 피드백 가이드 보강"
작업: "design-system/tokens/shadcn-webview-tokens.css에 semantic token 연동"

# 마무리 병렬 작업
작업: "품질 게이트 실행 결과 문서화"
작업: "개발일지/프롬프트 기록 업데이트"
```

---

## 구현 전략

### MVP 우선 (US1)

1. 1~2단계 완료
2. 3단계(US1) 완료
3. 문서 충돌 0건 검증 후 리뷰

### 점진적 전달

1. US1 완료 후 공통 기준 확정
2. US2로 웹뷰 구현 규칙 강화
3. US3로 온보딩/리뷰 효율 강화
4. 6단계에서 품질 게이트 및 기록 완료

