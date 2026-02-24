"use client";

import Link from "next/link";
import { useState } from "react";

import { AlertPreferenceForm } from "@/components/AlertPreferenceForm";
import { AppNotificationPanel } from "@/components/AppNotificationPanel";
import { LoginRequiredModal } from "@/components/LoginRequiredModal";
import { PreferenceConflictDialog } from "@/components/PreferenceConflictDialog";
import { useAuth } from "@/features/auth/AuthProvider";

export default function WatchlistPage() {
  const { isLoggedIn, isLoading, user } = useAuth();
  const [showConflictDialog, setShowConflictDialog] = useState(false);

  return (
    <main className="min-h-screen bg-background p-3 text-foreground sm:p-4 md:p-6">
      <div className="mx-auto max-w-5xl space-y-4">
        <header className="rounded-2xl border-2 border-black bg-[linear-gradient(135deg,hsl(var(--accent)),hsl(var(--brand-pink-soft)))] p-3 shadow-[var(--shadow-comic)] sm:p-4">
          <h1 className="text-xl font-black md:text-2xl">관심 종목 & 알림</h1>
          <p className="mt-1 text-sm font-semibold text-foreground/85">
            {isLoading ? "로그인 상태 확인 중..." : isLoggedIn ? `로그인 계정: ${user?.email}` : "로그인 사용자 전용 개인화 영역이야."}
          </p>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              className="inline-flex h-11 w-full cursor-pointer items-center justify-center rounded-md border-2 border-black bg-card px-4 text-sm font-extrabold hover:-translate-y-0.5 sm:w-auto"
              onClick={() => setShowConflictDialog(true)}
            >
              충돌 시나리오 보기
            </button>
            <Link
              href="/dashboard"
              className="inline-flex h-11 w-full cursor-pointer items-center justify-center rounded-md border-2 border-black bg-[hsl(var(--primary))] px-4 text-sm font-extrabold text-primary-foreground hover:-translate-y-0.5 sm:w-auto"
            >
              대시보드로 돌아가기
            </Link>
          </div>
        </header>

        <div className="grid gap-4 lg:grid-cols-2">
          <AlertPreferenceForm />
          <AppNotificationPanel />
        </div>
      </div>

      <LoginRequiredModal open={!isLoading && !isLoggedIn} />
      <PreferenceConflictDialog
        open={showConflictDialog}
        onClose={() => setShowConflictDialog(false)}
        onConfirm={() => setShowConflictDialog(false)}
      />
    </main>
  );
}

