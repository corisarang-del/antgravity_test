"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";

import { useAuth } from "@/features/auth/AuthProvider";

function LoginPageContent() {
  const searchParams = useSearchParams();
  const redirectTo = useMemo(() => searchParams.get("redirect") ?? "/watchlist", [searchParams]);

  const { isLoggedIn, isLoading, signInWithKakao, signInWithGoogle, signOut, user } = useAuth();

  const [isKakaoLoading, setIsKakaoLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [message, setMessage] = useState<string>("");

  const handleKakaoLogin = async () => {
    setIsKakaoLoading(true);
    setMessage("");
    const result = await signInWithKakao();
    if (result.errorMessage) {
      setMessage(`실패: ${result.errorMessage}`);
      setIsKakaoLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    setMessage("");
    const result = await signInWithGoogle();
    if (result.errorMessage) {
      setMessage(`실패: ${result.errorMessage}`);
      setIsGoogleLoading(false);
    }
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
          <p className="mt-1 text-sm font-semibold text-foreground/85">소셜 계정으로 간편하게 로그인해.</p>
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
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => void handleKakaoLogin()}
                disabled={isKakaoLoading || isGoogleLoading}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-md border-2 border-black bg-[#FEE500] px-4 text-sm font-extrabold text-[#191919] motion-safe:hover:-translate-y-0.5 disabled:opacity-60"
              >
                {isKakaoLoading ? (
                  <svg className="animate-spin" width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                    <circle cx="9" cy="9" r="7" stroke="#191919" strokeWidth="2" strokeOpacity="0.3" />
                    <path d="M9 2a7 7 0 0 1 7 7" stroke="#191919" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M9 1.5C4.858 1.5 1.5 4.134 1.5 7.38c0 2.07 1.368 3.888 3.438 4.938l-.876 3.276a.225.225 0 0 0 .342.246L8.49 13.5c.168.012.336.018.51.018 4.142 0 7.5-2.634 7.5-5.88S13.142 1.5 9 1.5Z"
                      fill="#191919"
                    />
                  </svg>
                )}
                {isKakaoLoading ? "처리 중..." : "카카오로 로그인"}
              </button>

              <button
                type="button"
                onClick={() => void handleGoogleLogin()}
                disabled={isKakaoLoading || isGoogleLoading}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-md border-2 border-black bg-white px-4 text-sm font-extrabold text-[#191919] motion-safe:hover:-translate-y-0.5 disabled:opacity-60"
              >
                {isGoogleLoading ? (
                  <svg className="animate-spin" width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                    <circle cx="9" cy="9" r="7" stroke="#191919" strokeWidth="2" strokeOpacity="0.3" />
                    <path d="M9 2a7 7 0 0 1 7 7" stroke="#191919" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                    <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4"/>
                    <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853"/>
                    <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05"/>
                    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z" fill="#EA4335"/>
                  </svg>
                )}
                {isGoogleLoading ? "처리 중..." : "Google로 로그인"}
              </button>
            </div>
          )}

          {message ? (
            <p
              role="status"
              aria-live="polite"
              className="mt-3 text-xs font-semibold text-[hsl(var(--destructive))]"
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
