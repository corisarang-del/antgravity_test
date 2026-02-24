"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";

import { useAuth } from "@/features/auth/AuthProvider";

function SignupPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = useMemo(() => searchParams.get("redirect") ?? "/watchlist", [searchParams]);

  const { signUpWithPassword, resendSignupConfirmEmail } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string>("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    const result = await signUpWithPassword(email, password);

    if (result.errorMessage) {
      setMessage(`실패: ${result.errorMessage}`);
      setIsSubmitting(false);
      return;
    }

    if (result.needsEmailConfirm) {
      setMessage("회원가입 성공. 인증 메일을 확인해. 메일 인증 후 로그인할 수 있어.");
    } else {
      setMessage("회원가입 성공. 바로 로그인할 수 있어.");
      router.push(`/login?redirect=${encodeURIComponent(redirectTo)}`);
    }

    setIsSubmitting(false);
  };

  const handleResend = async () => {
    if (!email) {
      setMessage("재전송하려면 이메일을 먼저 입력해.");
      return;
    }
    const result = await resendSignupConfirmEmail(email);
    if (result.errorMessage) {
      setMessage(`재전송 실패: ${result.errorMessage}`);
      return;
    }
    setMessage("인증 메일 재전송 요청 완료. 메일함/스팸함을 확인해.");
  };

  return (
    <main className="min-h-screen bg-background p-3 text-foreground sm:p-4 md:p-6">
      <div className="mx-auto max-w-md space-y-4">
        <header className="rounded-2xl border-2 border-black bg-[linear-gradient(135deg,hsl(var(--secondary)),hsl(var(--accent)))] p-4 shadow-[var(--shadow-comic)]">
          <h1 className="text-2xl font-black">회원가입</h1>
          <p className="mt-1 text-sm font-semibold text-foreground/85">새 계정을 만든 뒤 로그인해서 기능을 사용해.</p>
        </header>

        <section className="rounded-2xl border-2 border-black bg-card p-4 shadow-[var(--shadow-comic)]">
          <form onSubmit={handleSubmit} className="space-y-3">
            <label className="block text-sm font-semibold" htmlFor="signupEmail">
              이메일
              <input
                id="signupEmail"
                type="email"
                required
                autoComplete="email"
                className="mt-1 h-11 w-full rounded-md border-2 border-black bg-background px-3"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </label>

            <label className="block text-sm font-semibold" htmlFor="signupPassword">
              비밀번호
              <input
                id="signupPassword"
                type="password"
                required
                minLength={6}
                autoComplete="new-password"
                className="mt-1 h-11 w-full rounded-md border-2 border-black bg-background px-3"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </label>

            <button
              type="submit"
              disabled={isSubmitting}
              className="h-11 w-full rounded-md border-2 border-black bg-[hsl(var(--primary))] px-4 text-sm font-extrabold text-primary-foreground hover:-translate-y-0.5 disabled:opacity-60"
            >
              {isSubmitting ? "처리 중..." : "회원가입"}
            </button>

            <button
              type="button"
              onClick={() => void handleResend()}
              className="h-11 w-full rounded-md border-2 border-black bg-card px-4 text-sm font-extrabold hover:-translate-y-0.5"
            >
              인증 메일 재전송
            </button>

            <p className="text-xs font-semibold text-muted-foreground">
              이미 계정이 있으면 {" "}
              <Link href={`/login?redirect=${encodeURIComponent(redirectTo)}`} className="underline">
                로그인
              </Link>
            </p>
            <p className="text-[11px] font-semibold text-muted-foreground">
              메일이 안 오면 스팸함 확인 후, Supabase Auth의 Email 설정(SMTP/확인 메일 정책)도 확인해.
            </p>
          </form>

          {message ? <p className="mt-3 text-xs font-semibold text-muted-foreground">{message}</p> : null}
        </section>
      </div>
    </main>
  );
}

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-background p-3 text-foreground sm:p-4 md:p-6">
          <div className="mx-auto max-w-md rounded-2xl border-2 border-black bg-card p-4 shadow-[var(--shadow-comic)]">
            <p className="text-sm font-semibold">페이지 준비 중...</p>
          </div>
        </main>
      }
    >
      <SignupPageContent />
    </Suspense>
  );
}
