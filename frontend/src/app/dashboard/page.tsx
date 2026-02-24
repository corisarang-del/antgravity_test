"use client";

import Link from "next/link";
import { memo, useMemo, useState } from "react";

import { CacheStatusPanel } from "@/components/CacheStatusPanel";
import { DataStatusBadge } from "@/components/DataStatusBadge";
import { RealtimeEligibilityInfo } from "@/components/RealtimeEligibilityInfo";
import { RefreshPolicyInfo } from "@/components/RefreshPolicyInfo";
import { SymbolSelector } from "@/components/SymbolSelector";
import { useAuth } from "@/features/auth/AuthProvider";
import { useAccessGuard } from "@/features/common/useAccessGuard";
import { DashboardStateView } from "@/features/dashboard/DashboardStateView";
import { useDashboardData } from "@/features/dashboard/useDashboardData";
import type { PredictionSummary } from "@/features/common/types";

const symbolPriceMap: Record<string, number> = {
  TSLA: 242.86,
  NVDA: 726.13,
  AAPL: 191.22,
};

const chartPoints = "0,128 52,146 104,110 156,136 208,116 260,92 312,108 364,78 416,94 468,86 520,112 572,90 624,98 676,34";

type DirectionMeta = {
  title: string;
  accentClass: string;
  toneClass: string;
  toneLabel: string;
};

const PredictionPathChart = memo(function PredictionPathChart() {
  return (
    <svg viewBox="0 0 700 160" className="h-44 w-full" role="img" aria-label="예측 경로 차트">
      <defs>
        <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="hsl(var(--info))" />
          <stop offset="100%" stopColor="hsl(var(--success))" />
        </linearGradient>
      </defs>
      <polyline fill="none" stroke="url(#lineGradient)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" points={chartPoints} />
      <line x1="624" y1="98" x2="676" y2="34" stroke="hsl(var(--success))" strokeWidth="3" strokeDasharray="8 6" />
    </svg>
  );
});

type MainAnalysisProps = {
  summary: PredictionSummary;
  directionMeta: DirectionMeta;
  targetPrice: number;
};

const MainAnalysisSection = memo(function MainAnalysisSection({ summary, directionMeta, targetPrice }: MainAnalysisProps) {
  return (
    <div className="mt-4 grid gap-3 lg:grid-cols-[260px_1fr]">
      <article className="rounded-xl border-2 border-black bg-[hsl(var(--secondary)/0.1)] p-4 shadow-[var(--shadow-comic)]">
        <p className="text-xs font-black text-muted-foreground">{directionMeta.title}</p>
        <p className={`mt-3 font-mono text-5xl font-black tabular-nums ${directionMeta.accentClass}`}>{summary.confidence.toFixed(1)}%</p>
        <p className={`mt-2 text-sm font-black ${directionMeta.toneClass}`}>{directionMeta.toneLabel}</p>
        <p className="mt-3 text-xs font-semibold text-foreground/75">
          {summary.horizonLabel} 기준으로 모델 점수를 보여줘. 확정 신호가 아니라 참고 지표로 활용해.
        </p>
      </article>

      <article className="rounded-xl border-2 border-black bg-card p-4 shadow-[var(--shadow-comic)]">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs font-black text-muted-foreground">AI 경로 분석 (PREDICTION PATH)</p>
          <p className="rounded-md border-2 border-black bg-[hsl(var(--success)/0.2)] px-2 py-1 text-xs font-black text-[hsl(var(--success))]">목표가 ${targetPrice.toFixed(2)}</p>
        </div>
        <div className="mt-3 rounded-lg border-2 border-black bg-[hsl(var(--secondary)/0.06)] p-3">
          <PredictionPathChart />
        </div>
        <p className="mt-2 text-xs font-semibold text-muted-foreground">
          파란선은 최근 흐름, 점선은 단기 예측 구간이야. 상승/하락 여부는 반드시 근거 카드와 같이 확인해.
        </p>
      </article>
    </div>
  );
});

type MetricsProps = {
  summary: PredictionSummary;
  directionMeta: DirectionMeta;
};

const MetricsRow = memo(function MetricsRow({ summary, directionMeta }: MetricsProps) {
  const riskLabel = summary.direction === "하락" ? "매우 높음" : "중간";
  const riskDelta = summary.direction === "하락" ? "+13.4% 경고" : "+2.1% 정상";
  const momentum = summary.direction === "상승" ? "High" : "Neutral";

  return (
    <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <article className="rounded-lg border-2 border-black bg-card p-3">
        <p className="text-xs font-bold text-muted-foreground">예측 방향</p>
        <p className={`mt-1 text-lg font-black ${directionMeta.accentClass}`}>{summary.direction}</p>
        <p className="text-xs font-semibold text-muted-foreground">기준 시각 {summary.updatedAt}</p>
      </article>
      <article className="rounded-lg border-2 border-black bg-card p-3">
        <p className="text-xs font-bold text-muted-foreground">리스크 밀도</p>
        <p className="mt-1 text-lg font-black">{riskLabel}</p>
        <p className="text-xs font-semibold text-[hsl(var(--destructive))]">{riskDelta}</p>
      </article>
      <article className="rounded-lg border-2 border-black bg-card p-3">
        <p className="text-xs font-bold text-muted-foreground">패턴 점수</p>
        <p className="mt-1 text-lg font-black">{Math.min(99, summary.confidence + 8)}/100</p>
        <p className="text-xs font-semibold text-[hsl(var(--success))]">전 구간 대비 +3.1%</p>
      </article>
      <article className="rounded-lg border-2 border-black bg-card p-3">
        <p className="text-xs font-bold text-muted-foreground">모멘텀 등급</p>
        <p className="mt-1 text-lg font-black">{momentum}</p>
        <p className="text-xs font-semibold text-muted-foreground">뉴스/거래량 합산</p>
      </article>
    </div>
  );
});

export default function DashboardPage() {
  const dashboardData = useDashboardData();
  const { isLoggedIn, isLoading, user, signOut } = useAuth();
  const access = useAccessGuard({ isLoggedIn });
  const [isSignOutLoading, setIsSignOutLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");

  const handleSignOut = async () => {
    setIsSignOutLoading(true);
    await signOut();
    setIsSignOutLoading(false);
  };

  const directionMeta = useMemo<DirectionMeta>(() => {
    if (dashboardData.summary.direction === "상승") {
      return { title: "상승 확률", accentClass: "text-[hsl(var(--success))]", toneClass: "text-[hsl(var(--success))]", toneLabel: "매수 우위" };
    }
    if (dashboardData.summary.direction === "하락") {
      return { title: "하락 위험", accentClass: "text-[hsl(var(--destructive))]", toneClass: "text-[hsl(var(--destructive))]", toneLabel: "리스크 경계" };
    }
    return { title: "중립 구간", accentClass: "text-[hsl(var(--secondary))]", toneClass: "text-[hsl(var(--secondary))]", toneLabel: "관망 우위" };
  }, [dashboardData.summary.direction]);

  const currentPrice = symbolPriceMap[dashboardData.selectedTicker] ?? 412.8;
  const tickerName = useMemo(
    () => dashboardData.symbols.find((item) => item.ticker === dashboardData.selectedTicker)?.name ?? dashboardData.selectedTicker,
    [dashboardData.selectedTicker, dashboardData.symbols],
  );

  const filteredSymbols = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase();
    if (!keyword) return dashboardData.symbols;
    const nextSymbols = dashboardData.symbols.filter((item) => {
      return item.ticker.toLowerCase().includes(keyword) || item.name.toLowerCase().includes(keyword);
    });
    return nextSymbols.length > 0 ? nextSymbols : dashboardData.symbols;
  }, [searchKeyword, dashboardData.symbols]);

  const targetPrice = useMemo(() => {
    return Math.max(currentPrice * 0.98, currentPrice + (dashboardData.summary.direction === "상승" ? 15 : -9));
  }, [currentPrice, dashboardData.summary.direction]);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto w-full max-w-6xl space-y-4 p-3 sm:p-4 md:p-6">
        <header className="rounded-2xl border-2 border-black bg-card p-3 shadow-[var(--shadow-comic)] sm:p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-xs font-black tracking-[0.14em] text-muted-foreground">ANT GRAVITY PRO</p>
              <h1 className="text-xl font-black sm:text-2xl">{dashboardData.selectedTicker} 분석 리포트</h1>
              <p className="text-xs font-semibold text-foreground/80">실시간 AI 시세판 예측 및 리스크 내비게이션</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="rounded-md border-2 border-black bg-[hsl(var(--secondary)/0.2)] px-2 py-1 text-xs font-black text-secondary-foreground">
                AI Pheromone Scan · Active
              </p>
              <DataStatusBadge status={dashboardData.status} />
              <p className="rounded-md border-2 border-black bg-card px-2 py-1 text-xs font-bold">마지막 갱신 {dashboardData.summary.updatedAt}</p>
            </div>
          </div>

          <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            <Link href="/dashboard" className="inline-flex h-11 cursor-pointer items-center justify-center rounded-md border-2 border-black bg-[hsl(var(--primary)/0.2)] px-3 text-xs font-extrabold hover:-translate-y-0.5">
              경로 리포트
            </Link>
            <Link href="/basis" className="inline-flex h-11 cursor-pointer items-center justify-center rounded-md border-2 border-black bg-card px-3 text-xs font-extrabold hover:-translate-y-0.5">
              정밀 근거
            </Link>
            <Link href="/history" className="inline-flex h-11 cursor-pointer items-center justify-center rounded-md border-2 border-black bg-card px-3 text-xs font-extrabold hover:-translate-y-0.5">
              행동 보고
            </Link>
            <Link href="/watchlist" className="inline-flex h-11 cursor-pointer items-center justify-center rounded-md border-2 border-black bg-card px-3 text-xs font-extrabold hover:-translate-y-0.5">
              수집 기록
            </Link>
          </div>

          <div className="mt-3 grid gap-2 md:grid-cols-[1fr_auto]">
            <label className="flex h-11 items-center gap-2 rounded-md border-2 border-black bg-card px-3">
              <span className="text-xs font-bold text-muted-foreground">종목 검색</span>
              <input
                value={searchKeyword}
                onChange={(event) => setSearchKeyword(event.target.value)}
                placeholder="예: NVDA, TSLA"
                className="h-full w-full bg-transparent text-sm font-semibold outline-none"
              />
            </label>
            <SymbolSelector symbols={filteredSymbols} value={dashboardData.selectedTicker} onChange={dashboardData.setSelectedTicker} />
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-md border-2 border-black bg-[hsl(var(--secondary)/0.12)] px-3 py-2">
            <p className="text-xs font-black">
              {tickerName} 현재가 <span className="font-mono tabular-nums">${currentPrice.toFixed(2)}</span>
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <p className="rounded-md border-2 border-black bg-card px-2 py-1 text-xs font-bold">권한: {access.canViewDashboard ? "허용" : "차단"}</p>
              <p className="rounded-md border-2 border-black bg-card px-2 py-1 text-xs font-bold">개인화: {access.canManageWatchlist ? "허용" : "로그인 필요"}</p>
            </div>
          </div>
        </header>

        <section className="rounded-2xl border-2 border-black bg-card p-3 shadow-[var(--shadow-comic)] sm:p-4">
          <DashboardStateView errorType={dashboardData.errorType} onRetry={dashboardData.retry} />

          {isLoading ? (
            <div className="mt-4 rounded-xl border-2 border-black bg-[hsl(var(--secondary)/0.08)] p-4">
              <div className="h-5 w-44 animate-pulse rounded bg-muted" />
              <div className="mt-3 h-28 animate-pulse rounded bg-muted" />
              <p className="mt-3 text-xs font-semibold text-muted-foreground">데이터 동기화 중...</p>
            </div>
          ) : null}

          <MainAnalysisSection summary={dashboardData.summary} directionMeta={directionMeta} targetPrice={targetPrice} />
          <MetricsRow summary={dashboardData.summary} directionMeta={directionMeta} />

          <div className="mt-3 grid gap-3 xl:grid-cols-3">
            <div className="xl:col-span-2">
              <CacheStatusPanel cacheInfo={dashboardData.cacheInfo} />
            </div>
            <article className="rounded-xl border-2 border-black bg-[hsl(var(--accent)/0.15)] p-4 shadow-[var(--shadow-comic)]">
              <p className="text-sm font-black">어떻게 이걸 활용해?</p>
              <p className="mt-1 text-xs font-semibold text-foreground/80">
                1) 현재 구간의 신호를 확인하고 2) 근거에서 이유를 본 다음 3) 리스크 카드까지 확인해서 분할 대응해.
              </p>
            </article>
          </div>

          <div className="mt-3 grid gap-3 lg:grid-cols-2">
            <RefreshPolicyInfo tier={dashboardData.tier} />
            <RealtimeEligibilityInfo reason={dashboardData.eligibilityReason} />
          </div>
        </section>

        <footer className="rounded-xl border-2 border-black bg-card px-4 py-3 text-xs font-bold text-muted-foreground">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p>GLOBAL DATA GATHERING ALPHA</p>
            <p>LIVE PHEROMONE STREAM</p>
          </div>
        </footer>

        <section className="rounded-xl border-2 border-black bg-card px-3 py-2">
          <div className="flex flex-wrap items-center justify-end gap-2">
            {isLoading ? <p className="text-xs font-semibold text-foreground/85">인증 상태 확인 중...</p> : null}
            {isLoggedIn ? (
              <>
                <p className="text-xs font-semibold text-foreground/85">로그인: {user?.email}</p>
                <button
                  type="button"
                  onClick={() => void handleSignOut()}
                  disabled={isSignOutLoading}
                  className="inline-flex h-11 cursor-pointer items-center justify-center rounded-md border-2 border-black bg-card px-3 text-xs font-extrabold hover:-translate-y-0.5 disabled:opacity-60"
                >
                  {isSignOutLoading ? "로그아웃 중..." : "로그아웃"}
                </button>
              </>
            ) : (
              <Link
                href="/login?redirect=/watchlist"
                className="inline-flex h-11 cursor-pointer items-center justify-center rounded-md border-2 border-black bg-card px-3 text-xs font-extrabold hover:-translate-y-0.5"
              >
                로그인
              </Link>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
