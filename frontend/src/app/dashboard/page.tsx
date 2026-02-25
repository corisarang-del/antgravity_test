"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import Image from "next/image";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import useSWR from "swr";

import { SymbolSelector } from "@/components/SymbolSelector";
import { useAuth } from "@/features/auth/AuthProvider";
import { useAccessGuard } from "@/features/common/useAccessGuard";
import { DashboardStateView } from "@/features/dashboard/DashboardStateView";
import { useDashboardData } from "@/features/dashboard/useDashboardData";
import { apiClient } from "@/lib/apiClient";

const focusRingClass =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--primary))] focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(var(--background))]";

const DataStatusBadge = dynamic(() => import("@/components/DataStatusBadge").then((module) => module.DataStatusBadge));
const CacheStatusPanel = dynamic(() => import("@/components/CacheStatusPanel").then((module) => module.CacheStatusPanel));
const RefreshPolicyInfo = dynamic(() => import("@/components/RefreshPolicyInfo").then((module) => module.RefreshPolicyInfo));
const RealtimeEligibilityInfo = dynamic(() => import("@/components/RealtimeEligibilityInfo").then((module) => module.RealtimeEligibilityInfo));

type DirectionMeta = {
  title: string;
  accentClass: string;
  toneClass: string;
  toneLabel: string;
  antState: "basic" | "warning" | "celebrate";
};

type EvidenceTab = "tech" | "sentiment" | "external";
const evidenceItemLabels: Record<EvidenceTab, readonly string[]> = {
  tech: ["Close", "Volume", "RSI (14)", "MACD"],
  sentiment: ["Fear & Greed"],
  external: ["VIX"],
};

const HHMM_PATTERN = /(\d{1,2}):(\d{2})/;

const rangePresets = ["1D", "1W", "1M", "3M"] as const;
type RangePreset = (typeof rangePresets)[number];

type ChartPoint = {
  timestamp: string;
  close: number;
  volume: number;
};

type ChartMarker = {
  index: number;
  label: string;
  timestamp: string;
};

type PathApiResponse = {
  range: RangePreset;
  source: string;
  chart: {
    points: ChartPoint[];
    polylinePoints: string;
    markers: ChartMarker[];
  };
  features: {
    close: number;
    volume: number;
    vix: number;
    fearGreed: number;
    rsi14: number;
    macd: number;
  };
};

async function fetchPredictionPath(ticker: string, range: RangePreset): Promise<PathApiResponse> {
  return apiClient<PathApiResponse>(`/api/predictions/${ticker}/path?range=${encodeURIComponent(range)}`);
}

function toSimpleTimeLabel(value: string): string {
  if (!value) return "-";
  const parsed = new Date(value);
  if (!Number.isNaN(parsed.getTime())) {
    return `${String(parsed.getHours()).padStart(2, "0")}:${String(parsed.getMinutes()).padStart(2, "0")}`;
  }

  const hhmmMatch = value.match(HHMM_PATTERN);
  if (hhmmMatch) {
    const hour = hhmmMatch[1].padStart(2, "0");
    const minute = hhmmMatch[2];
    return `${hour}:${minute}`;
  }

  return value.length > 5 ? value.slice(0, 5) : value;
}

function isKrxTicker(ticker: string): boolean {
  return ticker.toUpperCase().endsWith(".KS");
}

function formatDisplayPrice(value: number, ticker: string): string {
  if (isKrxTicker(ticker)) return `₩${Math.round(value).toLocaleString("ko-KR")}`;
  return `$${value.toFixed(2)}`;
}

const PredictionPathChart = memo(function PredictionPathChart({
  polylinePoints,
  markers,
}: {
  polylinePoints: string;
  markers: Array<{ x: number; y: number; label: string }>;
}) {
  return (
    <svg viewBox="0 0 700 160" className="h-44 w-full" role="img" aria-label="예측 경로 차트">
      <defs>
        <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="hsl(var(--info))" />
          <stop offset="100%" stopColor="hsl(var(--success))" />
        </linearGradient>
      </defs>
      <polyline fill="none" stroke="url(#lineGradient)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" points={polylinePoints} />
      {markers.map((marker) => (
        <g key={`${marker.label}-${marker.x}`}>
          <circle cx={marker.x} cy={marker.y} r="4" fill="hsl(var(--warning))" />
          <text x={marker.x + 8} y={Math.max(12, marker.y - 8)} fill="hsl(var(--muted-foreground))" fontSize="11" fontWeight="700">
            {marker.label}
          </text>
        </g>
      ))}
    </svg>
  );
});

const AntCoachCard = memo(function AntCoachCard({ state }: { state: DirectionMeta["antState"] }) {
  const palette =
    state === "celebrate"
      ? { bubble: "좋은 흐름이야. 근거 카드 확인하고 분할 접근해." }
      : state === "warning"
        ? { bubble: "변동성이 커졌어. 비중 조절부터 체크해." }
        : { bubble: "중립 구간이야. 신호보다 근거를 먼저 보자." };

  return (
    <article className="rounded-xl border-2 border-black bg-[hsl(var(--accent)/0.15)] p-4 shadow-[var(--shadow-comic)]">
      <p className="text-sm font-black">개미 코치</p>
      <div className="mt-2 flex items-center gap-3">
        <Image src="/branding/ant-mascot-v3.png" alt="3D 개미 캐릭터" width={88} height={120} className="h-24 w-16 object-contain" />
        <p className="text-xs font-semibold text-foreground/85">{palette.bubble}</p>
      </div>
    </article>
  );
});

type MainAnalysisProps = {
  directionMeta: DirectionMeta;
  targetPrice: number | null;
  selectedTicker: string;
  selectedRange: RangePreset;
  onRangeChange: (nextRange: RangePreset) => void;
  polylinePoints: string;
  markers: Array<{ x: number; y: number; label: string }>;
  dataSource: string;
  isPathLoading: boolean;
  hasPathError: boolean;
  onRetryPath: () => void;
};

const MainAnalysisSection = memo(function MainAnalysisSection({
  directionMeta,
  targetPrice,
  selectedTicker,
  selectedRange,
  onRangeChange,
  polylinePoints,
  markers,
  dataSource,
  isPathLoading,
  hasPathError,
  onRetryPath,
}: MainAnalysisProps) {
  return (
    <div className="mt-4 grid gap-3 lg:grid-cols-[1fr_280px]">
      <article className="rounded-xl border-2 border-black bg-card p-4 shadow-[var(--shadow-comic)]">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs font-black text-muted-foreground">AI 경로 분석 (PREDICTION PATH)</p>
          <p className="rounded-md border-2 border-black bg-[hsl(var(--success)/0.2)] px-2 py-1 text-xs font-black text-[hsl(var(--success))]">
            {targetPrice === null ? "목표가 집계중" : `목표가 ${formatDisplayPrice(targetPrice, selectedTicker)}`}
          </p>
        </div>
        <div className="mt-2 flex flex-wrap gap-2" role="group" aria-label="AI 경로 분석 기간 선택">
          {rangePresets.map((range) => (
            <button
              key={range}
              type="button"
              onClick={() => onRangeChange(range)}
              aria-pressed={selectedRange === range}
              className={`inline-flex h-9 min-w-[46px] cursor-pointer items-center justify-center rounded-md border-2 border-black px-3 text-xs font-black ${
                selectedRange === range ? "bg-[hsl(var(--primary)/0.22)]" : "bg-card"
              } ${focusRingClass}`}
            >
              {range}
            </button>
          ))}
        </div>
        <div className="mt-3 rounded-lg border-2 border-black bg-[hsl(var(--secondary)/0.06)] p-3">
          {isPathLoading ? (
            <div className="h-44 animate-pulse rounded-md bg-muted" aria-live="polite" aria-busy="true" />
          ) : hasPathError ? (
            <div className="flex h-44 flex-col items-center justify-center gap-3 rounded-md border-2 border-dashed border-black bg-card">
              <p className="text-xs font-semibold text-muted-foreground">차트 데이터를 가져오지 못했어.</p>
              <button
                type="button"
                onClick={onRetryPath}
                className={`inline-flex h-9 items-center justify-center rounded-md border-2 border-black bg-card px-3 text-xs font-black hover:-translate-y-0.5 ${focusRingClass}`}
              >
                다시 시도
              </button>
            </div>
          ) : (
            <PredictionPathChart polylinePoints={polylinePoints} markers={markers} />
          )}
        </div>
        <p className="mt-2 text-xs font-semibold text-muted-foreground" aria-live="polite">
          차트 구간은 선택한 기간 기준으로 서버 데이터가 반영돼. 데이터 소스: {dataSource}
        </p>
      </article>

      <AntCoachCard state={directionMeta.antState} />
    </div>
  );
});

export default function DashboardPage() {
  const dashboardData = useDashboardData();
  const { isLoggedIn, isLoading, user, signOut } = useAuth();
  const access = useAccessGuard({ isLoggedIn });
  const headerRef = useRef<HTMLDivElement | null>(null);
  const [headerHeight, setHeaderHeight] = useState(140);
  const [isSignOutLoading, setIsSignOutLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedEvidenceTab, setSelectedEvidenceTab] = useState<EvidenceTab>("tech");
  const [selectedRange, setSelectedRange] = useState<RangePreset>("1D");

  useEffect(() => {
    const target = headerRef.current;
    if (!target) return;

    const update = () => {
      setHeaderHeight(Math.ceil(target.getBoundingClientRect().height));
    };

    update();

    let observer: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      observer = new ResizeObserver(update);
      observer.observe(target);
    }
    window.addEventListener("resize", update);

    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  const pathFetcher = useCallback(
    ([, ticker, range]: readonly [string, string, RangePreset]) => fetchPredictionPath(ticker, range),
    [],
  );

  const {
    data: pathData,
    error: pathError,
    isLoading: isPathLoading,
    mutate: mutatePath,
  } = useSWR(
    dashboardData.selectedTicker ? ["/api/predictions/path", dashboardData.selectedTicker, selectedRange] : null,
    pathFetcher,
    { revalidateOnFocus: false, dedupingInterval: 5000 },
  );

  const handleRetryPath = useCallback(() => {
    void mutatePath();
  }, [mutatePath]);

  const handleSignOut = useCallback(async () => {
    setIsSignOutLoading(true);
    await signOut();
    setIsSignOutLoading(false);
  }, [signOut]);

  const directionMeta = useMemo<DirectionMeta>(() => {
    if (dashboardData.summary.direction === "상승") {
      return {
        title: "상승 확률",
        accentClass: "text-[hsl(var(--success))]",
        toneClass: "text-[hsl(var(--success))]",
        toneLabel: "매수 우위",
        antState: "celebrate",
      };
    }
    if (dashboardData.summary.direction === "하락") {
      return {
        title: "하락 위험",
        accentClass: "text-[hsl(var(--destructive))]",
        toneClass: "text-[hsl(var(--destructive))]",
        toneLabel: "리스크 경계",
        antState: "warning",
      };
    }
    return {
      title: "중립 구간",
      accentClass: "text-[hsl(var(--secondary))]",
      toneClass: "text-[hsl(var(--secondary))]",
      toneLabel: "관망 우위",
      antState: "basic",
    };
  }, [dashboardData.summary.direction]);

  const currentPrice = pathData?.features.close;
  const symbolMap = useMemo(
    () => new Map(dashboardData.symbols.map((s) => [s.ticker, s.name])),
    [dashboardData.symbols],
  );
  const tickerName = symbolMap.get(dashboardData.selectedTicker) ?? dashboardData.selectedTicker;

  const filteredSymbols = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase();
    if (!keyword) return dashboardData.symbols;
    const nextSymbols = dashboardData.symbols.filter((item) => {
      const t = item.ticker.toLowerCase();
      const n = item.name.toLowerCase();
      return t.includes(keyword) || n.includes(keyword);
    });
    return nextSymbols.length > 0 ? nextSymbols : dashboardData.symbols;
  }, [searchKeyword, dashboardData.symbols]);

  const confidenceGrade = useMemo(() => {
    if (dashboardData.summary.confidence >= 80) return "A";
    if (dashboardData.summary.confidence >= 65) return "B";
    return "C";
  }, [dashboardData.summary.confidence]);

  const volatilityMeta = useMemo(() => {
    if (dashboardData.summary.direction === "하락") return { label: "높음", colorClass: "text-[hsl(var(--destructive))]" };
    if (dashboardData.summary.direction === "상승") return { label: "중간", colorClass: "text-[hsl(var(--success))]" };
    return { label: "보통", colorClass: "text-[hsl(var(--secondary))]" };
  }, [dashboardData.summary.direction]);

  const targetPrice = useMemo(() => {
    if (typeof currentPrice !== "number") return null;
    return Math.max(currentPrice * 0.98, currentPrice + (dashboardData.summary.direction === "상승" ? 15 : -9));
  }, [currentPrice, dashboardData.summary.direction]);
  const updatedAtLabel = useMemo(() => toSimpleTimeLabel(dashboardData.summary.updatedAt), [dashboardData.summary.updatedAt]);

  const realtimeBadgeText = dashboardData.tier === "premium" ? "실시간 갱신 활성" : "기본 등급: 지연 갱신";
  const realtimeBadgeTone =
    dashboardData.tier === "premium" ? "bg-[hsl(var(--success)/0.2)] text-[hsl(var(--success))]" : "bg-[hsl(var(--warning)/0.2)] text-[hsl(var(--warning))]";

  const markerCoords = useMemo(() => {
    if (!pathData) return [];
    const points = pathData.chart.points;
    if (points.length === 0) return [];

    let minClose = Number.POSITIVE_INFINITY;
    let maxClose = Number.NEGATIVE_INFINITY;
    for (const point of points) {
      if (point.close < minClose) minClose = point.close;
      if (point.close > maxClose) maxClose = point.close;
    }

    const span = Math.max(maxClose - minClose, 1e-6);
    const maxIndex = Math.max(points.length - 1, 1);
    const xScale = (700 - 24) / maxIndex;
    const yScale = (160 - 24) / span;
    const coords: Array<{ x: number; y: number; label: string }> = [];

    for (const marker of pathData.chart.markers) {
      const point = points[marker.index];
      if (!point) continue;
      const x = marker.index * xScale;
      const y = 160 - (point.close - minClose) * yScale - 12;
      coords.push({ x, y, label: marker.label });
    }

    return coords;
  }, [pathData]);

  const evidenceMap = useMemo(
    () => ({
      tech: [
        { label: "Close", value: pathData ? pathData.features.close.toFixed(2) : typeof currentPrice === "number" ? currentPrice.toFixed(2) : "-", at: dashboardData.summary.updatedAt },
        { label: "Volume", value: pathData ? `${Math.round(pathData.features.volume).toLocaleString()}` : "-", at: dashboardData.summary.updatedAt },
        { label: "RSI (14)", value: pathData ? pathData.features.rsi14.toFixed(2) : "-", at: dashboardData.summary.updatedAt },
        { label: "MACD", value: pathData ? pathData.features.macd.toFixed(4) : "-", at: dashboardData.summary.updatedAt },
      ],
      sentiment: [
        { label: "Fear & Greed", value: pathData ? `${pathData.features.fearGreed.toFixed(1)}` : "50.0", at: dashboardData.summary.updatedAt },
      ],
      external: [
        { label: "VIX", value: pathData ? pathData.features.vix.toFixed(2) : "18.0", at: dashboardData.summary.updatedAt },
      ],
    }),
    [pathData, currentPrice, dashboardData.summary.updatedAt],
  );
  const evidenceTabDescription = useMemo(() => {
    if (selectedEvidenceTab === "tech") return "기술지표: 가격·거래량 흐름으로 추세를 보여줘.";
    if (selectedEvidenceTab === "sentiment") return "감성지표: 시장 심리(공포/탐욕) 분위기를 보여줘.";
    return "외부지표: 시장 전체 위험도(VIX) 같은 바깥 신호를 보여줘.";
  }, [selectedEvidenceTab]);

  if (dashboardData.symbols.length === 0) {
    return (
      <main className="min-h-screen bg-background text-foreground">
        <div className="mx-auto w-full max-w-6xl p-3 sm:p-4 md:p-6">
          <section className="rounded-2xl border-2 border-black bg-card p-6 shadow-[var(--shadow-comic)]">
            <h1 className="text-xl font-black">관심 종목이 아직 없어</h1>
            <p className="mt-2 text-sm font-semibold text-muted-foreground">관심 종목을 추가하면 예측 카드와 근거 지표를 바로 보여줄게.</p>
            <Link href="/watchlist" className="mt-4 inline-flex h-11 cursor-pointer items-center justify-center rounded-md border-2 border-black bg-[hsl(var(--primary))] px-4 text-sm font-extrabold text-primary-foreground hover:-translate-y-0.5">
              관심 종목 추가하기
            </Link>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div ref={headerRef} className="fixed left-0 right-0 top-[var(--safe-top)] z-40 px-3 sm:px-4 md:px-6">
        <div className="mx-auto w-full max-w-6xl rounded-2xl border-2 border-black bg-card p-3 shadow-[var(--shadow-comic)]">
          <div className="grid gap-2 lg:grid-cols-[1fr_auto]">
            <label className="flex h-11 items-center gap-2 rounded-md border-2 border-black bg-card px-3 focus-within:ring-2 focus-within:ring-[hsl(var(--primary))] focus-within:ring-offset-2 focus-within:ring-offset-[hsl(var(--background))]">
              <span className="text-xs font-bold text-muted-foreground">종목 검색</span>
              <input
                value={searchKeyword}
                onChange={(event) => setSearchKeyword(event.target.value)}
                placeholder="예: NVDA, TSLA"
                autoComplete="off"
                className={`h-full w-full bg-transparent text-sm font-semibold outline-none ${focusRingClass}`}
                aria-label="종목 검색"
              />
            </label>
            <div className="flex flex-wrap items-center gap-2">
              <SymbolSelector symbols={filteredSymbols} value={dashboardData.selectedTicker} onChange={dashboardData.setSelectedTicker} />
              <p className="rounded-md border-2 border-black bg-card px-2 py-1 text-xs font-black">등급: {dashboardData.tier === "premium" ? "Premium" : "Basic"}</p>
              <p className={`rounded-md border-2 border-black px-2 py-1 text-xs font-black ${realtimeBadgeTone}`}>{realtimeBadgeText}</p>
              <p className="rounded-md border-2 border-black bg-card px-2 py-1 text-xs font-bold">갱신 {updatedAtLabel}</p>
            </div>
          </div>
        </div>
      </div>

      <div
        className="mx-auto w-full max-w-6xl space-y-4 p-3 pt-[calc(var(--safe-top)+var(--dashboard-header-height)+12px)] sm:p-4 sm:pt-[calc(var(--safe-top)+var(--dashboard-header-height)+12px)] md:p-6 md:pt-[calc(var(--safe-top)+var(--dashboard-header-height)+12px)]"
        style={{ ["--dashboard-header-height" as string]: `${headerHeight}px` }}
      >
        <section className="rounded-2xl border-2 border-black bg-card p-3 shadow-[var(--shadow-comic)] sm:p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-xs font-black tracking-[0.14em] text-muted-foreground">ANT GRAVITY PRO</p>
              <h1 className="text-xl font-black sm:text-2xl">{dashboardData.selectedTicker} 분석 리포트</h1>
              <p className="text-xs font-semibold text-foreground/80">
                 {tickerName} 현재가 <span className="font-mono tabular-nums">{typeof currentPrice === "number" ? formatDisplayPrice(currentPrice, dashboardData.selectedTicker) : "-"}</span>
                </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <DataStatusBadge status={dashboardData.status} />
              <p className="rounded-md border-2 border-black bg-[hsl(var(--secondary)/0.2)] px-2 py-1 text-xs font-black text-secondary-foreground">AI Pheromone Scan · Active</p>
              <p className="rounded-md border-2 border-black bg-card px-2 py-1 text-xs font-bold">권한: {access.canViewDashboard ? "허용" : "차단"}</p>
            </div>
          </div>

          <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            <Link href="/dashboard" className={`inline-flex h-11 cursor-pointer items-center justify-center rounded-md border-2 border-black bg-[hsl(var(--primary)/0.2)] px-3 text-xs font-extrabold hover:-translate-y-0.5 ${focusRingClass}`}>경로 리포트</Link>
            <Link href={`/basis?ticker=${dashboardData.selectedTicker}`} className={`inline-flex h-11 cursor-pointer items-center justify-center rounded-md border-2 border-black bg-card px-3 text-xs font-extrabold hover:-translate-y-0.5 ${focusRingClass}`}>정밀 근거</Link>
            <Link href={`/history?ticker=${dashboardData.selectedTicker}`} className={`inline-flex h-11 cursor-pointer items-center justify-center rounded-md border-2 border-black bg-card px-3 text-xs font-extrabold hover:-translate-y-0.5 ${focusRingClass}`}>행동 보고</Link>
            <Link href="/watchlist" className={`inline-flex h-11 cursor-pointer items-center justify-center rounded-md border-2 border-black bg-card px-3 text-xs font-extrabold hover:-translate-y-0.5 ${focusRingClass}`}>수집 기록</Link>
          </div>

          <DashboardStateView errorType={dashboardData.errorType} onRetry={dashboardData.retry} />

          {isLoading ? (
            <div className="mt-4 rounded-xl border-2 border-black bg-[hsl(var(--secondary)/0.08)] p-4">
              <div className="h-5 w-44 animate-pulse rounded bg-muted" />
              <div className="mt-3 h-28 animate-pulse rounded bg-muted" />
              <p className="mt-3 text-xs font-semibold text-muted-foreground">데이터 동기화 중...</p>
            </div>
          ) : null}

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <article className="rounded-lg border-2 border-black bg-card p-3">
              <p className="text-xs font-bold text-muted-foreground">예측 방향</p>
              <p className={`mt-1 text-xl font-black ${directionMeta.accentClass}`}>{dashboardData.summary.direction}</p>
              <p className="text-xs font-semibold text-muted-foreground">기준 시각 {dashboardData.summary.updatedAt}</p>
            </article>
            <article className="rounded-lg border-2 border-black bg-card p-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-bold text-muted-foreground">신뢰도</p>
                <span className="rounded-md border-2 border-black bg-[hsl(var(--secondary)/0.14)] px-2 py-0.5 text-xs font-black">등급 {confidenceGrade}</span>
              </div>
              <p className="mt-1 font-mono text-xl font-black tabular-nums">{dashboardData.summary.confidence.toFixed(1)}%</p>
              <p className="text-xs font-semibold text-muted-foreground">{dashboardData.summary.horizonLabel}</p>
            </article>
            <article className="rounded-lg border-2 border-black bg-card p-3">
              <p className="text-xs font-bold text-muted-foreground">변동성</p>
              <p className={`mt-1 text-xl font-black ${volatilityMeta.colorClass}`}>{volatilityMeta.label}</p>
              <p className="text-xs font-semibold text-muted-foreground">구간 변동성 기준</p>
            </article>
          </div>

          <MainAnalysisSection
            directionMeta={directionMeta}
            targetPrice={targetPrice}
            selectedTicker={dashboardData.selectedTicker}
            selectedRange={selectedRange}
            onRangeChange={setSelectedRange}
            polylinePoints={pathData?.chart.polylinePoints ?? "0,80 700,80"}
            markers={markerCoords}
            dataSource={pathData?.source ?? "fallback"}
            isPathLoading={isPathLoading}
            hasPathError={Boolean(pathError)}
            onRetryPath={handleRetryPath}
          />

          <article className="mt-3 rounded-xl border-2 border-black bg-card p-4 shadow-[var(--shadow-comic)]">
            <div className="flex flex-wrap gap-2" role="group" aria-label="근거 지표 탭">
              <button
                type="button"
                onClick={() => setSelectedEvidenceTab("tech")}
                aria-pressed={selectedEvidenceTab === "tech"}
                className={`inline-flex h-10 cursor-pointer items-center justify-center rounded-md border-2 border-black px-3 text-xs font-black ${
                  selectedEvidenceTab === "tech" ? "bg-[hsl(var(--primary)/0.2)]" : "bg-card"
                } ${focusRingClass}`}
              >
                기술 지표
              </button>
              <button
                type="button"
                onClick={() => setSelectedEvidenceTab("sentiment")}
                aria-pressed={selectedEvidenceTab === "sentiment"}
                className={`inline-flex h-10 cursor-pointer items-center justify-center rounded-md border-2 border-black px-3 text-xs font-black ${
                  selectedEvidenceTab === "sentiment" ? "bg-[hsl(var(--primary)/0.2)]" : "bg-card"
                } ${focusRingClass}`}
              >
                감성 지표
              </button>
              <button
                type="button"
                onClick={() => setSelectedEvidenceTab("external")}
                aria-pressed={selectedEvidenceTab === "external"}
                className={`inline-flex h-10 cursor-pointer items-center justify-center rounded-md border-2 border-black px-3 text-xs font-black ${
                  selectedEvidenceTab === "external" ? "bg-[hsl(var(--primary)/0.2)]" : "bg-card"
                } ${focusRingClass}`}
              >
                외부 지표
              </button>
            </div>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {evidenceMap[selectedEvidenceTab].map((item) => (
                <div key={item.label} className="rounded-md border-2 border-black bg-[hsl(var(--secondary)/0.08)] px-3 py-2">
                  <p className="text-xs font-bold text-muted-foreground">{item.label}</p>
                  <p className="text-sm font-black">{item.value}</p>
                  <p className="text-xs font-semibold text-muted-foreground">기준 {toSimpleTimeLabel(item.at)}</p>
                </div>
              ))}
            </div>
            <p className="mt-2 text-[11px] font-semibold text-muted-foreground">{evidenceTabDescription}</p>
            <p className="mt-1 text-[11px] font-semibold text-muted-foreground">표시 항목: {evidenceItemLabels[selectedEvidenceTab].join(", ")}</p>
          </article>

          <div className="mt-3 grid gap-3 xl:grid-cols-3">
            <div className="xl:col-span-2">
              <CacheStatusPanel cacheInfo={dashboardData.cacheInfo} />
            </div>
            <div className="space-y-3">
              <RefreshPolicyInfo tier={dashboardData.tier} />
              <RealtimeEligibilityInfo reason={dashboardData.eligibilityReason} />
            </div>
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
                  className={`inline-flex h-11 cursor-pointer items-center justify-center rounded-md border-2 border-black bg-card px-3 text-xs font-extrabold hover:-translate-y-0.5 disabled:opacity-60 ${focusRingClass}`}
                >
                  {isSignOutLoading ? "로그아웃 중..." : "로그아웃"}
                </button>
              </>
            ) : (
              <Link
                href="/login?redirect=/watchlist"
                className={`inline-flex h-11 cursor-pointer items-center justify-center rounded-md border-2 border-black bg-card px-3 text-xs font-extrabold hover:-translate-y-0.5 ${focusRingClass}`}
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
