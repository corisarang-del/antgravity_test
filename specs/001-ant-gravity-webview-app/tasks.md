# 작업 목록: Ant Gravity AI 주가 예측 웹앱

**입력**: `/specs/001-ant-gravity-webview-app/`의 설계 문서
**선행조건**: plan.md(필수), spec.md(필수), research.md, data-model.md, contracts/

**테스트**: 본 스펙은 테스트 선행(TDD)을 명시하지 않았으므로 구현 태스크 중심으로 구성한다. 검증은 품질 게이트 및 quickstart 시나리오로 수행한다.

**구성 방식**: 각 사용자 스토리가 독립 구현/독립 검증 가능하도록 스토리 단위로 작업을 묶는다.

## 형식: `[ID] [P?] [Story] 설명`

- **[P]**: 병렬 실행 가능(서로 다른 파일, 의존성 없음)
- **[Story]**: 해당 작업이 속한 사용자 스토리(예: [US1], [US2], [US3])
- 설명에는 정확한 파일 경로를 포함한다.

## 경로 규칙

- **웹 앱**: `backend/app/`, `backend/tests/`, `frontend/src/app/`, `frontend/src/components/`, `frontend/src/features/`
- **DB**: `supabase/migrations/`

## 1단계: 설정 (공통 인프라)

**목적**: 프로젝트 초기 구조와 공통 개발 기준을 정렬한다.

- [x] T001 frontend와 backend 실행 경로 및 스크립트 확인 문서 업데이트 in `specs/001-ant-gravity-webview-app/quickstart.md`
- [x] T002 [P] 웹뷰 UI 톤앤매너(신뢰+퍼니+친근+깔끔) 디자인 토큰 초안 작성 in `frontend/src/lib/designTokens.ts`
- [x] T003 [P] 공통 타입 폴더 및 기본 도메인 타입 파일 생성 in `frontend/src/features/common/types.ts`
- [x] T004 [P] API 기본 클라이언트 래퍼 파일 생성 in `frontend/src/lib/apiClient.ts`
- [x] T005 환경 변수 키 검증 및 보안 주석 추가 in `backend/.env.example`

---

## 2단계: 기반 작업 (차단 선행조건)

**목적**: 모든 사용자 스토리에서 공통으로 사용하는 인증/권한/데이터 상태 기반을 완성한다.

**중요**: 이 단계 완료 전 사용자 스토리 구현 시작 금지.

- [x] T006 사용자/등급/구독/권한 관련 스키마 마이그레이션 추가 in `supabase/migrations/0002_user_access_policy.sql`
- [x] T007 예측/지표/성능/알림 도메인 스키마 마이그레이션 추가 in `supabase/migrations/0003_prediction_domain.sql`
- [x] T008 [P] 비로그인 허용 엔드포인트와 로그인 필수 엔드포인트 권한 분기 미들웨어 구현 in `backend/app/api/middleware/access_policy.py`
- [x] T009 [P] 데이터 상태 배지(NORMAL/DELAYED/FAILED) 공통 응답 모델 정의 in `backend/app/models/data_status.py`
- [x] T010 [P] 사용자 등급별 갱신 정책 판정 서비스 구현 in `backend/app/services/refresh_policy_service.py`
- [x] T011 인앱 알림 중복 방지 키 규칙 구현 in `backend/app/services/notification_dedup_service.py`
- [x] T012 프론트 공통 인증/권한 가드 훅 구현 in `frontend/src/features/common/useAccessGuard.ts`
- [x] T013 프론트 공통 데이터 상태 배지 컴포넌트 구현 in `frontend/src/components/DataStatusBadge.tsx`
- [x] T044 [P] 요청 제한(rate limit) 미들웨어 구현 in `backend/app/api/middleware/rate_limit.py`
- [x] T045 [P] GPS/정밀 위치 입력 차단 검증 로직 구현 in `backend/app/api/middleware/privacy_guard.py`
- [x] T046 API 로그 민감정보 마스킹 규칙 구현 in `backend/app/services/log_masking_service.py`

**체크포인트**: 공통 권한/데이터상태/갱신정책 기반 준비 완료.

---

## 3단계: 사용자 스토리 1 - 예측 대시보드 사용 (우선순위: P1)

**목표**: 비로그인/로그인 사용자가 대시보드에서 종목 예측, 신뢰도, 갱신 상태를 확인한다.

**독립 검증**: 비로그인 상태에서 대시보드 진입 후 종목 전환 시 예측/신뢰도/상태 배지가 정상 갱신되면 완료.

- [x] T014 [P] [US1] 종목 목록 조회 API 구현 in `backend/app/api/routes/symbols.py`
- [x] T015 [P] [US1] 대시보드 예측 조회 API 구현 in `backend/app/api/routes/predictions.py`
- [x] T016 [US1] 예측 조회 서비스에서 일반/유료 갱신 정책 반영 in `backend/app/services/prediction_query_service.py`
- [x] T017 [P] [US1] 대시보드 탭 페이지 UI 구현 in `frontend/src/app/page.tsx`
- [x] T018 [P] [US1] 종목 선택 드롭다운 컴포넌트 구현 in `frontend/src/components/SymbolSelector.tsx`
- [x] T019 [US1] 예측 카드/신뢰도 카드 컴포넌트 구현 in `frontend/src/components/PredictionSummaryCard.tsx`
- [x] T020 [US1] 대시보드 데이터 패칭 훅 구현 in `frontend/src/features/dashboard/useDashboardData.ts`
- [x] T021 [US1] 대시보드 오류/빈상태/재시도 UX 구현 in `frontend/src/features/dashboard/dashboardStateView.tsx`
- [x] T047 [US1] 캐싱 상태/TTL/마지막 갱신 시각 표시 UI 구현 in `frontend/src/components/CacheStatusPanel.tsx`
- [x] T048 [US1] 등급별 갱신 정책 안내 UI 구현 in `frontend/src/components/RefreshPolicyInfo.tsx`
- [x] T049 [US1] 실시간 갱신 권한 판정 근거 표시 UI 구현 in `frontend/src/components/RealtimeEligibilityInfo.tsx`

**체크포인트**: 예측 대시보드 단독 기능 완료.

---

## 4단계: 사용자 스토리 2 - 예측 근거와 성능 이력 검토 (우선순위: P2)

**목표**: 근거 지표와 예측-실제 비교 이력을 조회해 모델 신뢰도를 판단한다.

**독립 검증**: 근거 탭/이력 탭에서 지표 카드, 이력 차트, 성능 지표(DA/MAPE/RMSE)가 표시되면 완료.

- [x] T022 [P] [US2] 지표 스냅샷 조회 API 구현 in `backend/app/api/routes/indicators.py`
- [x] T023 [P] [US2] 예측 이력 조회 API 구현 in `backend/app/api/routes/prediction_history.py`
- [x] T024 [US2] 성능 지표 집계 서비스 구현 in `backend/app/services/performance_metrics_service.py`
- [x] T025 [P] [US2] 근거 탭 UI 구현 in `frontend/src/app/basis/page.tsx`
- [x] T026 [P] [US2] 이력 탭 UI 구현 in `frontend/src/app/history/page.tsx`
- [x] T027 [US2] 지표 카드 컴포넌트 구현 in `frontend/src/components/IndicatorCardGrid.tsx`
- [x] T028 [US2] 이력 스파크라인/비교 차트 컴포넌트 구현 in `frontend/src/components/PredictionHistoryChart.tsx`
- [x] T029 [US2] 근거/이력 데이터 패칭 훅 구현 in `frontend/src/features/history/useHistoryData.ts`

**체크포인트**: 근거/이력 단독 기능 완료.

---

## 5단계: 사용자 스토리 3 - 관심 종목 및 알림 관리 (우선순위: P3)

**목표**: 로그인 사용자가 관심 종목과 인앱 알림을 개인화 관리한다.

**독립 검증**: 로그인 후 관심 종목 추가/삭제, 알림 설정 저장, 인앱 알림 읽음 처리까지 완료되면 기능 완료.

- [x] T030 [P] [US3] 관심 종목 조회/추가/삭제 API 구현 in `backend/app/api/routes/watchlist.py`
- [x] T031 [P] [US3] 알림 설정 조회/저장 API 구현 in `backend/app/api/routes/alert_preferences.py`
- [x] T032 [P] [US3] 인앱 알림 조회/읽음처리 API 구현 in `backend/app/api/routes/notifications.py`
- [x] T033 [US3] 배치 알림 생성 워커 구현 in `backend/app/workers/daily_alert_dispatcher.py`
- [x] T034 [US3] 로그인 필수 관심종목 화면 구현 in `frontend/src/app/watchlist/page.tsx`
- [x] T035 [US3] 알림 설정 폼 컴포넌트 구현 in `frontend/src/components/AlertPreferenceForm.tsx`
- [x] T036 [US3] 인앱 알림함 UI 및 읽음 처리 구현 in `frontend/src/components/AppNotificationPanel.tsx`
- [x] T037 [US3] 비로그인 접근 시 로그인 유도 모달 구현 in `frontend/src/components/LoginRequiredModal.tsx`
- [x] T050 [US3] 관심 종목/알림 설정 동시 수정 충돌 감지 로직 구현 in `backend/app/services/preference_conflict_service.py`
- [x] T051 [US3] 충돌 발생 시 재확인 UX 구현 in `frontend/src/components/PreferenceConflictDialog.tsx`
- [x] T052 [US3] 인앱 알림 읽음 상태 전이 검증 구현 in `backend/tests/integration/test_notification_read_transition.py`

**체크포인트**: 개인화 기능 단독 완료.

---

## N단계: 마무리 및 공통 개선

**목적**: 전 스토리 품질 정리, 문서 정합성, 릴리즈 준비.

- [x] T038 [P] README와 quickstart 실행 절차 동기화 업데이트 in `README.md`
- [x] T039 디자인 일관성 정리(색/타이포/컴포넌트 변형) in `frontend/src/app/globals.css`
- [x] T040 API 계약 대비 구현 누락 점검 리포트 작성 in `specs/001-ant-gravity-webview-app/contracts/contract-gap-report.md`
- [x] T041 품질 게이트 실행(`pnpm lint`, `pnpm typecheck`) 결과 정리 in `specs/001-ant-gravity-webview-app/quickstart.md`
- [x] T042 단계별 개발일지 기록 추가 in `docs/개발일지/001-ant-gravity-webview-app.md`
- [x] T043 단계별 프롬프트 기록 추가 in `docs/prompt/001-ant-gravity-webview-app.md`

---

## 의존성과 실행 순서

### 단계 의존성

- **1단계 설정**: 즉시 시작 가능
- **2단계 기반**: 1단계 완료 후 시작, 모든 스토리 차단
- **3~5단계 사용자 스토리**: 2단계 완료 후 시작
- **N단계 마무리**: 모든 스토리 완료 후 시작

### 사용자 스토리 의존성

- **US1(P1)**: 기반 완료 후 시작, 독립 배포 가능(MVP)
- **US2(P2)**: 기반 완료 후 시작, US1과 독립 진행 가능
- **US3(P3)**: 기반 완료 후 시작, 로그인/권한 기반에 의존

### 병렬 처리 기회

- 1단계의 T002/T003/T004/T005는 병렬 가능
- 2단계의 T008/T009/T010/T012/T013/T044/T045는 병렬 가능
- 3단계에서 API(T014/T015)와 UI(T017/T018/T047/T048/T049)는 병렬 가능
- 4단계에서 API(T022/T023)와 UI(T025/T026)는 병렬 가능
- 5단계에서 API(T030/T031/T032/T050)와 UI(T034/T035/T036/T051)는 병렬 가능

---

## 병렬 실행 예시: 사용자 스토리 1

```bash
작업: "T014 [US1] backend/app/api/routes/symbols.py 종목 목록 API 구현"
작업: "T017 [US1] frontend/src/app/page.tsx 대시보드 탭 UI 구현"
작업: "T018 [US1] frontend/src/components/SymbolSelector.tsx 종목 선택 컴포넌트 구현"
```

## 병렬 실행 예시: 사용자 스토리 2

```bash
작업: "T022 [US2] backend/app/api/routes/indicators.py 지표 조회 API 구현"
작업: "T025 [US2] frontend/src/app/basis/page.tsx 근거 탭 UI 구현"
작업: "T026 [US2] frontend/src/app/history/page.tsx 이력 탭 UI 구현"
```

## 병렬 실행 예시: 사용자 스토리 3

```bash
작업: "T030 [US3] backend/app/api/routes/watchlist.py 관심종목 API 구현"
작업: "T034 [US3] frontend/src/app/watchlist/page.tsx 관심종목 화면 구현"
작업: "T036 [US3] frontend/src/components/AppNotificationPanel.tsx 인앱 알림함 구현"
```

---

## 구현 전략

### MVP 우선 범위

1. 1단계 설정
2. 2단계 기반
3. 3단계 US1 완료
4. US1 독립 검증 후 내부 시연

### 점진적 전달

1. US1 배포(예측 대시보드)
2. US2 추가 배포(근거/이력)
3. US3 추가 배포(개인화)
4. N단계 품질 정리 후 릴리즈

### 포맷 검증

- 모든 태스크는 `- [ ] Txxx [선택적 P] [선택적 USx] 설명 + 파일경로` 형식을 만족한다.
- 사용자 스토리 단계 태스크는 모두 `[US1]`, `[US2]`, `[US3]` 라벨을 가진다.
- 설정/기반/마무리 단계 태스크는 스토리 라벨 없이 구성했다.



