# 개발일지 - 2026-02-24 20:46:06

## 해결하려는 문제
- 백엔드(.env) 기준 Supabase 인증으로 로그인/회원가입 흐름 통일
- Invalid login credentials 원인 분리
- 인증 메일 미수신 점검 포인트 정리

## 진행 내용
- backend에 Supabase Auth 프록시 API 추가
  - POST /api/auth/signup
  - POST /api/auth/login
  - POST /api/auth/resend-signup
- frontend AuthProvider를 Supabase 직접 호출 방식에서 백엔드 API 호출 방식으로 전환
- localStorage 세션 저장 + apiClient에 x-user-id/Authorization 헤더 자동 첨부
- lint/typecheck 통과, backend import 확인

## 해결된 것
- 프론트 인증 호출 경로가 백엔드 기준으로 통일됨
- 회원가입/로그인/인증메일 재전송 UI 동작이 백엔드 응답 기준으로 정렬됨
- 품질게이트(frontend lint/typecheck) 통과

## 아직 안된 것
- backend/.env의 SUPABASE_SERVICE_ROLE_KEY 값이 publishable 키 형식이라 키 역할 불일치 가능성 큼
- 현재 Supabase MCP는 다른 프로젝트(ietcw...)에 연결돼 있어 backend 기준 프로젝트(hncx...)에 직접 마이그레이션 적용 불가
- 실제 인증메일 발송 성공 여부는 Supabase Auth SMTP/메일 템플릿/발신 도메인 설정 확인 필요
