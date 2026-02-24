"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";

import { useAuth } from "@/features/auth/AuthProvider";

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = useMemo(() => searchParams.get("redirect") ?? "/watchlist", [searchParams]);

  const { isLoggedIn, isLoading, signInWithPassword, signOut, user } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string>("");

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

              <p className="text-xs font-semibold text-muted-foreground">
                계정이 없으면 {" "}
                <Link href={`/signup?redirect=${encodeURIComponent(redirectTo)}`} className="underline">
                  회원가입
                </Link>
              </p>
            </form>
          )}

          {message ? <p className="mt-3 text-xs font-semibold text-muted-foreground">{message}</p> : null}
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
