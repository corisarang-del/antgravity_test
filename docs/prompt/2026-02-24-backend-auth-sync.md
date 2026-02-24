# Prompt 기록 - 2026-02-24 20:46:06

## 사용자 요청
- "백엔드가 진짜. 백엔드 기준"
- "응 진행해"

## 내가 사용한 작업 프롬프트/지시
- backend env 기준으로 frontend Supabase 연결 여부 검증
- backend에 Supabase Auth API 추가 (signup/login/resend)
- frontend 인증 컨텍스트를 backend API 방식으로 전환
- lint/typecheck 및 backend import 검증
- Supabase MCP 현재 연결 프로젝트 확인

## 결과 요약
- 인증 흐름을 backend 기준으로 코드 변경 완료
- 프론트 품질게이트 통과
- MCP 프로젝트 불일치(ietcw... vs hncx...) 확인
