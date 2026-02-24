# [PROJECT_NAME] 헌법
<!-- 예시: Spec 헌법, TaskFlow 헌법 등 -->

## 핵심 원칙

### [PRINCIPLE_1_NAME]
<!-- 예시: I. 라이브러리 우선 -->
[PRINCIPLE_1_DESCRIPTION]
<!-- 예시: 모든 기능은 독립 라이브러리로 시작한다. 라이브러리는 자체 완결, 독립 테스트 가능, 문서화를 만족해야 한다. 조직 구분만을 위한 라이브러리는 금지한다. -->

### [PRINCIPLE_2_NAME]
<!-- 예시: II. CLI 인터페이스 -->
[PRINCIPLE_2_DESCRIPTION]
<!-- 예시: 모든 라이브러리는 CLI 진입점을 제공한다. 텍스트 입출력 규약(stdin/args -> stdout, 오류 -> stderr)을 따른다. JSON과 사람 친화 형식을 함께 지원한다. -->

### [PRINCIPLE_3_NAME]
<!-- 예시: III. 테스트 우선 (비타협) -->
[PRINCIPLE_3_DESCRIPTION]
<!-- 예시: TDD를 의무화한다. 테스트 작성 -> 사용자 승인 -> 실패 확인 -> 구현 순서를 지킨다. Red-Green-Refactor 사이클을 엄격히 준수한다. -->

### [PRINCIPLE_4_NAME]
<!-- 예시: IV. 통합 테스트 -->
[PRINCIPLE_4_DESCRIPTION]
<!-- 예시: 새 라이브러리 계약 테스트, 계약 변경, 서비스 간 통신, 공유 스키마 변경은 반드시 통합 테스트를 포함한다. -->

### [PRINCIPLE_5_NAME]
<!-- 예시: V. 관측성, VI. 버전/호환성, VII. 단순성 -->
[PRINCIPLE_5_DESCRIPTION]
<!-- 예시: 텍스트 I/O로 디버깅 가능성을 확보한다. 구조화 로그를 의무화한다. 또는 MAJOR.MINOR.PATCH 정책을 적용한다. 단순함을 우선하고 YAGNI를 지킨다. -->

## [SECTION_2_NAME]
<!-- 예시: 추가 제약사항, 보안 요구사항, 성능 기준 등 -->

[SECTION_2_CONTENT]
<!-- 예시: 기술 스택 요구사항, 규정 준수 기준, 배포 정책 등 -->

## [SECTION_3_NAME]
<!-- 예시: 개발 워크플로우, 리뷰 프로세스, 품질 게이트 등 -->

[SECTION_3_CONTENT]
<!-- 예시: 코드 리뷰 기준, 테스트 게이트, 배포 승인 절차 등 -->

## 거버넌스
<!-- 예시: 헌법은 다른 실무 규칙보다 우선한다. 개정에는 문서화, 승인, 마이그레이션 계획이 필요하다. -->

[GOVERNANCE_RULES]
<!-- 예시: 모든 PR/리뷰는 헌법 준수를 검증해야 한다. 복잡도는 정당화되어야 한다. 런타임 개발 가이드는 [GUIDANCE_FILE]을 사용한다. -->

**버전**: [CONSTITUTION_VERSION] | **제정일**: [RATIFICATION_DATE] | **최종 개정일**: [LAST_AMENDED_DATE]
<!-- 예시: 버전: 2.1.1 | 제정일: 2025-06-13 | 최종 개정일: 2025-07-16 -->
