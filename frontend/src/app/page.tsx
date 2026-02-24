"use client";

import Link from "next/link";
import { useState } from "react";

import { CacheStatusPanel } from "@/components/CacheStatusPanel";
import { DataStatusBadge } from "@/components/DataStatusBadge";
import { PredictionSummaryCard } from "@/components/PredictionSummaryCard";
import { RealtimeEligibilityInfo } from "@/components/RealtimeEligibilityInfo";
import { RefreshPolicyInfo } from "@/components/RefreshPolicyInfo";
import { SymbolSelector } from "@/components/SymbolSelector";
import { useAccessGuard } from "@/features/common/useAccessGuard";
import { useAuth } from "@/features/auth/AuthProvider";
import { DashboardStateView } from "@/features/dashboard/DashboardStateView";
import { useDashboardData } from "@/features/dashboard/useDashboardData";

export default function DashboardPage() {
  const dashboardData = useDashboardData();
  const { isLoggedIn, user, signOut } = useAuth();
  const access = useAccessGuard({ isLoggedIn });
  const [isSignOutLoading, setIsSignOutLoading] = useState(false);

  const handleSignOut = async () => {
    setIsSignOutLoading(true);
    await signOut();
    setIsSignOutLoading(false);
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto w-full max-w-6xl space-y-4 p-3 sm:space-y-5 sm:p-4 md:p-6">
        <header className="rounded-2xl border-2 border-black bg-[linear-gradient(140deg,hsl(var(--brand-pink)),hsl(var(--brand-pink-soft)))] p-3 shadow-[var(--shadow-comic)] sm:p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-black tracking-[0.14em] text-foreground">ANT GRAVITY</p>
              <h1 className="mt-1 text-2xl font-black md:text-3xl">개미 투자자를 위한 AI 주가 예측</h1>
              <p className="mt-1 text-sm font-semibold text-foreground/80">
                신뢰를 주는 데이터 중심 UX 위에 친근한 가이드를 얹은 웹뷰형 대시보드
              </p>
            </div>
            <div className="grid w-full grid-cols-2 gap-2 md:flex md:w-auto md:flex-wrap md:items-center">
              <div className="col-span-2 md:col-span-1">
                <DataStatusBadge status={dashboardData.status} />
              </div>
              <Link
                href="/basis"
                className="inline-flex h-11 items-center justify-center rounded-md border-2 border-black bg-card px-3 text-sm font-extrabold hover:-translate-y-0.5"
              >
                근거
              </Link>
              <Link
                href="/history"
                className="inline-flex h-11 items-center justify-center rounded-md border-2 border-black bg-card px-3 text-sm font-extrabold hover:-translate-y-0.5"
              >
                이력
              </Link>
              <Link
                href="/watchlist"
                className="col-span-2 inline-flex h-11 items-center justify-center rounded-md border-2 border-black bg-[hsl(var(--primary))] px-3 text-sm font-extrabold text-primary-foreground hover:-translate-y-0.5 md:col-span-1"
              >
                관심종목
              </Link>
            </div>
          </div>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
            {isLoggedIn ? (
              <>
                <p className="text-xs font-semibold text-foreground/85">로그인: {user?.email}</p>
                <button
                  type="button"
                  onClick={() => void handleSignOut()}
                  disabled={isSignOutLoading}
                  className="inline-flex h-11 items-center justify-center rounded-md border-2 border-black bg-card px-3 text-xs font-extrabold hover:-translate-y-0.5 disabled:opacity-60"
                >
                  {isSignOutLoading ? "로그아웃 중..." : "로그아웃"}
                </button>
              </>
            ) : (
              <Link
                href="/login?redirect=/watchlist"
                className="inline-flex h-11 items-center justify-center rounded-md border-2 border-black bg-card px-3 text-xs font-extrabold hover:-translate-y-0.5"
              >
                로그인
              </Link>
            )}
          </div>
        </header>

        <section className="rounded-2xl border-2 border-black bg-card p-3 shadow-[var(--shadow-comic)] sm:p-4">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
            <SymbolSelector
              symbols={dashboardData.symbols}
              value={dashboardData.selectedTicker}
              onChange={dashboardData.setSelectedTicker}
            />
            <div className="rounded-md border-2 border-black bg-[hsl(var(--secondary))] px-2 py-1 text-xs font-bold text-secondary-foreground sm:max-w-max">
              조회 권한: {access.canViewDashboard ? "허용" : "차단"} / 개인화 기능: {" "}
              {access.canManageWatchlist ? "허용" : "로그인 필요"}
            </div>
          </div>

          <DashboardStateView errorType={dashboardData.errorType} onRetry={dashboardData.retry} />

          <div className="mt-4 grid gap-4 lg:grid-cols-3">
            <PredictionSummaryCard summary={dashboardData.summary} />
            <RefreshPolicyInfo tier={dashboardData.tier} />
            <RealtimeEligibilityInfo reason={dashboardData.eligibilityReason} />
          </div>

          <div className="mt-4">
            <CacheStatusPanel cacheInfo={dashboardData.cacheInfo} />
          </div>
        </section>
      </div>
    </main>
  );
}
