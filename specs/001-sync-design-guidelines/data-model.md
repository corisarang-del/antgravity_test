# 데이터 모델: 프론트엔드 디자인 지침 동기화

## 1) DesignGuidelineDoc

### 필드
- `docId` (string, required): 문서 식별자 (`master`, `token`, `page-override-*`)
- `title` (string, required): 문서 제목
- `scope` (enum, required): `global` | `page` | `token`
- `sourceOfTruth` (string, required): 기준 소스 경로
- `status` (enum, required): `draft` | `reviewed` | `approved`
- `updatedAt` (datetime, required): 마지막 갱신 시각
- `updatedBy` (string, required): 갱신 담당자

### 검증 규칙
- `scope=token`이면 토큰 섹션(색상/간격/그림자/상태)이 반드시 포함되어야 한다.
- `status=approved` 이전에는 충돌 이슈 목록이 0건이어야 한다.

### 상태 전이
- `draft -> reviewed -> approved`
- 충돌 발견 시 `approved -> draft` 롤백 가능

## 2) PageOverrideDoc

### 필드
- `pageId` (string, required): 페이지 식별자 (`dashboard`, `landing` 등)
- `baseDocId` (string, required): 참조하는 공통 문서 ID
- `overrideRules` (array, required): 공통 규칙 대비 변경/추가 규칙
- `constraints` (array, required): 웹뷰/접근성 제약
- `forbiddenPatterns` (array, required): 페이지 단위 금지 패턴

### 검증 규칙
- `overrideRules`는 공통 규칙을 무효화하는 경우 근거를 반드시 포함해야 한다.
- 접근성 항목(대비/포커스/상태 표현)을 최소 1개 이상 포함해야 한다.

## 3) DesignTokenSet

### 필드
- `theme` (enum, required): `light` | `dark`
- `coreTokens` (object, required): background/foreground/primary 등 shadcn core
- `semanticTokens` (object, required): success/warning/info/chart-up/down/neutral
- `layoutTokens` (object, required): spacing/radius/safe-area
- `effectTokens` (object, required): shadow/glow/focus/pressed

### 검증 규칙
- 라이트/다크 테마 모두 존재해야 한다.
- 색상 토큰은 접근성 대비 요구를 충족해야 한다.

## 4) ReferenceStyleItem

### 필드
- `referenceId` (string, required): 레퍼런스 식별자
- `sourcePath` (string, required): 참고 자산 경로
- `styleKeywords` (array, required): 추출 키워드(예: playful, clean, high-contrast)
- `adoptionDecision` (enum, required): `adopted` | `adapted` | `rejected`
- `reason` (string, required): 채택/기각 근거

### 검증 규칙
- `adoptionDecision=rejected`라도 `reason`은 필수다.
- 금융 신뢰 원칙을 위반하는 스타일은 `adapted` 또는 `rejected`만 허용한다.

## 관계
- `DesignGuidelineDoc (global)` 1:N `PageOverrideDoc`
- `DesignGuidelineDoc (token)` 1:1 `DesignTokenSet`
- `ReferenceStyleItem` N:1 `DesignGuidelineDoc`
