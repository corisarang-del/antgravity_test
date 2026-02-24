# 리서치: 프론트엔드 디자인 지침 동기화

## Decision 1: 기준 소스 우선순위
- Decision: `frontend` 폴더의 현재 산출물(`src/app/globals.css`, `src/app/design-system/page.tsx`)을 1차 기준으로 사용한다.
- Rationale: 실제 구현에 즉시 반영되는 소스가 문서보다 최신일 가능성이 높고 검증 가능하다.
- Alternatives considered:
  - `design-system/MASTER.md` 단독 기준: 코드와 불일치 발생 가능
  - 참고 홈피 스크린샷 단독 기준: 서비스 목적(금융 신뢰 UX)과 괴리 위험

## Decision 2: 참고 스타일 적용 방식
- Decision: 참고 홈피의 스타일은 키워드(친근함/세련됨/강한 대비/명확한 CTA)만 추출해 정제 적용한다.
- Rationale: 레퍼런스 원형을 복제하면 브랜드/제품 맥락 불일치 및 과도한 장식 위험이 있다.
- Alternatives considered:
  - 레이아웃/컬러를 그대로 모사: 금융 UX에서 신뢰도 저하 가능
  - 참고 스타일 배제: 사용자 요구(참고 홈피 반영) 미충족

## Decision 3: 웹뷰 제약 강제 반영
- Decision: safe-area, 터치 타깃, 라이트/다크 대비, 상태 피드백을 문서 필수 항목으로 고정한다.
- Rationale: 웹뷰 환경에서 발생하는 잘림/오동작/가독성 문제를 사전 차단할 수 있다.
- Alternatives considered:
  - 웹뷰 항목을 선택 사항으로 처리: 플랫폼 이슈 누락 위험

## Decision 4: 토큰 표준
- Decision: shadcn/ui CSS 변수 형식을 기준으로 core token + 확장 token(spacing/shadow/state)을 유지한다.
- Rationale: 프론트엔드 구현과 문서 간 매핑이 쉬워지고 재사용성이 높다.
- Alternatives considered:
  - HEX 기반 별도 토큰 문서: 컴포넌트 시스템과 결합도 낮음
  - 화면별 개별 토큰: 일관성 저하

## Decision 5: 품질 검증 방식
- Decision: 문서 동기화 작업 완료 조건에 `pnpm lint`, `pnpm typecheck`를 포함한다.
- Rationale: 헌법 품질 게이트 준수와 코드/문서 간 회귀 탐지에 필요하다.
- Alternatives considered:
  - 수동 확인만 수행: 누락 가능성 증가
