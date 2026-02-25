"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";

import { useAuth } from "@/features/auth/AuthProvider";

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = useMemo(() => searchParams.get("redirect") ?? "/watchlist", [searchParams]);

  const { isLoggedIn, isLoading, signInWithPassword, signInWithKakao, signOut, user } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isKakaoLoading, setIsKakaoLoading] = useState(false);
  const [message, setMessage] = useState<string>("");

  const handleKakaoLogin = async () => {
    setIsKakaoLoading(true);
    setMessage("");
    const result = await signInWithKakao();
    if (result.errorMessage) {
      setMessage(`실패: ${result.errorMessage}`);
      setIsKakaoLoading(false);
    }
    // 성공 시 카카오 페이지로 리다이렉트되므로 로딩 상태 유지
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    const result = await signInWithPassword(email, password);
    if (result.errorMessage) {
      setMessage(`실패: ${result.errorMessage}`);
      setIsSubmitting(false);
      return;
    }

    setMessage("로그인 성공");
    setIsSubmitting(false);
    router.push(redirectTo);
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background p-3 text-foreground sm:p-4 md:p-6">
        <div className="mx-auto max-w-md rounded-2xl border-2 border-black bg-card p-4 shadow-[var(--shadow-comic)]">
          <p className="text-sm font-semibold">인증 상태 확인 중...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background p-3 text-foreground sm:p-4 md:p-6">
      <div className="mx-auto max-w-md space-y-4">
        <header className="rounded-2xl border-2 border-black bg-[linear-gradient(135deg,hsl(var(--accent)),hsl(var(--brand-pink-soft)))] p-4 shadow-[var(--shadow-comic)]">
          <h1 className="text-2xl font-black">로그인</h1>
          <p className="mt-1 text-sm font-semibold text-foreground/85">계정으로 로그인해서 개인화 기능을 사용해.</p>
        </header>

        <section className="rounded-2xl border-2 border-black bg-card p-4 shadow-[var(--shadow-comic)]">
          {isLoggedIn ? (
            <div className="space-y-3">
              <p className="text-sm font-semibold">현재 로그인: {user?.email}</p>
              <div className="flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={() => void signOut()}
                  className="h-11 w-full rounded-md border-2 border-black bg-card px-4 text-sm font-extrabold hover:-translate-y-0.5 sm:w-auto"
                >
                  로그아웃
                </button>
                <Link
                  href={redirectTo}
                  className="inline-flex h-11 w-full items-center justify-center rounded-md border-2 border-black bg-[hsl(var(--primary))] px-4 text-sm font-extrabold text-primary-foreground hover:-translate-y-0.5 sm:w-auto"
                >
                  이동
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <label className="block text-sm font-semibold" htmlFor="loginEmail">
                이메일
                <input
                  id="loginEmail"
                  type="email"
                  required
                  autoComplete="email"
                  className="mt-1 h-11 w-full rounded-md border-2 border-black bg-background px-3"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </label>

              <label className="block text-sm font-semibold" htmlFor="loginPassword">
                비밀번호
                <input
                  id="loginPassword"
                  type="password"
                  required
                  minLength={6}
                  autoComplete="current-password"
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
                {isSubmitting ? "처리 중..." : "로그인"}
              </button>

              <div className="relative flex items-center py-1">
                <div className="flex-grow border-t-2 border-black/10" />
                <span className="mx-3 text-xs font-semibold text-muted-foreground">또는</span>
                <div className="flex-grow border-t-2 border-black/10" />
              </div>

              <button
                type="button"
                onClick={() => void handleKakaoLogin()}
                disabled={isKakaoLoading || isSubmitting}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-md border-2 border-black bg-[#FEE500] px-4 text-sm font-extrabold text-[#191919] hover:-translate-y-0.5 disabled:opacity-60"
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M9 1.5C4.858 1.5 1.5 4.134 1.5 7.38c0 2.07 1.368 3.888 3.438 4.938l-.876 3.276a.225.225 0 0 0 .342.246L8.49 13.5c.168.012.336.018.51.018 4.142 0 7.5-2.634 7.5-5.88S13.142 1.5 9 1.5Z"
                    fill="#191919"
                  />
                </svg>
                {isKakaoLoading ? "처리 중..." : "카카오로 로그인"}
              </button>

              <p className="text-xs font-semibold text-muted-foreground">
                계정이 없으면 {" "}
                <Link href={`/signup?redirect=${encodeURIComponent(redirectTo)}`} className="underline">
                  회원가입
                </Link>
              </p>
            </form>
          )}

          {message ? (
            <p
              role="status"
              aria-live="polite"
              className={`mt-3 text-xs font-semibold ${message.startsWith("실패") ? "text-[hsl(var(--destructive))]" : "text-[hsl(var(--success))]"}`}
            >
              {message}
            </p>
          ) : null}
        </section>
      </div>
    </main>
  );
}

export default function LoginPage() {
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
      <LoginPageContent />
    </Suspense>
  );
}
