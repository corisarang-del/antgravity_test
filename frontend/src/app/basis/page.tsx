"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

import { IndicatorCardGrid } from "@/components/IndicatorCardGrid";
import { useHistoryData } from "@/features/history/useHistoryData";

function BasisPageContent() {
  const searchParams = useSearchParams();
  const ticker = searchParams.get("ticker") ?? "TSLA";
  const historyData = useHistoryData(ticker);

  return (
    <main className="min-h-screen bg-background p-3 text-foreground sm:p-4 md:p-6">
      <div className="mx-auto max-w-5xl space-y-4">
        <header className="rounded-2xl border-2 border-black bg-[linear-gradient(135deg,hsl(var(--secondary)),hsl(var(--accent)))] p-3 shadow-[var(--shadow-comic)] sm:p-4">
          <h1 className="text-xl font-black md:text-2xl">예측 근거</h1>
          <p className="mt-1 text-sm font-semibold text-foreground/85">예측에 사용된 핵심 지표를 한눈에 확인해.</p>
          <div className="mt-3">
            <Link
              href="/dashboard"
              className="inline-flex h-11 w-full cursor-pointer items-center justify-center rounded-md border-2 border-black bg-[hsl(var(--primary))] px-4 text-sm font-extrabold text-primary-foreground hover:-translate-y-0.5 sm:w-auto"
            >
              대시보드로 돌아가기
            </Link>
          </div>
        </header>

        <IndicatorCardGrid items={historyData.indicators} />
      </div>
    </main>
  );
}

export default function BasisPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-background p-3 text-foreground sm:p-4 md:p-6">
          <div className="mx-auto max-w-5xl rounded-2xl border-2 border-black bg-card p-4 shadow-[var(--shadow-comic)]">
            <p className="text-sm font-semibold">페이지 준비 중...</p>
          </div>
        </main>
      }
    >
      <BasisPageContent />
    </Suspense>
  );
}
