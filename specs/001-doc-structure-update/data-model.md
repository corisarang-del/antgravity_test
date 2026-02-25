# 데이터 모델: 문서 구조 최신화

## 1) DocumentPathInventory

### 필드
- `inventoryId` (string, required): 인벤토리 식별자
- `documentPath` (string, required): 검증 대상 문서 경로
- `referencedPath` (string, required): 문서가 참조하는 경로
- `pathStatus` (enum, required): `valid` | `broken` | `legacy` | `duplicate`
- `checkedAt` (datetime, required): 점검 시각
- `checkedBy` (string, required): 점검자

### 검증 규칙
- `pathStatus=valid`는 실제 경로 존재가 확인돼야 한다.
- `legacy` 또는 `duplicate`는 대체 경로를 반드시 연결해야 한다.

## 2) StructureSyncRule

### 필드
- `ruleId` (string, required): 규칙 식별자
- `scope` (enum, required): `global` | `feature-doc` | `page-override`
- `canonicalPathPattern` (string, required): 표준 경로 표기 패턴
- `namingRule` (string, required): PascalCase/camelCase 준수 규칙
- `qualityGateRule` (array, required): 필수 검증 명령 목록

### 검증 규칙
- 모든 `scope`는 최소 1개의 `canonicalPathPattern`을 가져야 한다.
- 품질 게이트 목록에는 `pnpm lint`, `pnpm typecheck`가 모두 포함돼야 한다.

## 3) ReviewCheckpoint

### 필드
- `checkpointId` (string, required): 체크포인트 식별자
- `phase` (enum, required): `structure-check` | `sync-update` | `quality-gate` | `trace-log`
- `passCriteria` (string, required): 통과 기준
- `evidencePath` (string, required): 증빙 위치

### 검증 규칙
- 각 phase는 정확히 1개 이상 존재해야 한다.
- `trace-log` phase는 `docs/개발일지/`, `docs/prompt/`를 모두 참조해야 한다.

## 4) OnboardingFlow

### 필드
- `flowId` (string, required): 동선 식별자
- `orderedDocs` (array, required): 읽기 순서 문서 목록
- `expectedOutcome` (string, required): 동선 완료 기대 결과
- `timeBudgetMinutes` (number, required): 목표 소요 시간

### 검증 규칙
- `orderedDocs`는 최소 5개 문서를 포함해야 한다.
- `timeBudgetMinutes`는 15분 이하 목표를 가져야 한다.

## 관계
- `DocumentPathInventory` N:1 `StructureSyncRule`
- `ReviewCheckpoint`는 `DocumentPathInventory` 검증 결과를 증빙으로 참조
- `OnboardingFlow`는 `ReviewCheckpoint( structure-check, sync-update )` 완료 후 유효
