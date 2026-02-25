"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

import { PredictionHistoryChart } from "@/components/PredictionHistoryChart";
import { useHistoryData } from "@/features/history/useHistoryData";

function HistoryPageContent() {
  const searchParams = useSearchParams();
  const ticker = searchParams.get("ticker") ?? "TSLA";
  const historyData = useHistoryData(ticker);

  return (
    <main className="min-h-screen bg-background p-3 text-foreground sm:p-4 md:p-6">
      <div className="mx-auto max-w-5xl space-y-4">
        <header className="rounded-2xl border-2 border-black bg-[linear-gradient(135deg,hsl(var(--accent)),hsl(var(--secondary)))] p-3 shadow-[var(--shadow-comic)] sm:p-4">
          <h1 className="text-xl font-black md:text-2xl">예측 이력</h1>
          <p className="mt-1 text-sm font-semibold text-foreground/85">예측값과 실제 결과를 비교해 모델 신뢰도를 확인해.</p>
          <div className="mt-3">
            <Link
              href="/dashboard"
              className="inline-flex h-11 w-full cursor-pointer items-center justify-center rounded-md border-2 border-black bg-[hsl(var(--primary))] px-4 text-sm font-extrabold text-primary-foreground hover:-translate-y-0.5 sm:w-auto"
            >
              대시보드로 돌아가기
            </Link>
          </div>
        </header>

        <PredictionHistoryChart points={historyData.historyPoints} />

        <section className="grid gap-3 sm:grid-cols-3">
          <article className="rounded-xl border-2 border-black bg-card p-4 shadow-[var(--shadow-comic)]">
            <p className="text-xs font-bold text-muted-foreground">DA</p>
            <p className="mt-1 text-lg font-black">{historyData.performance.da}</p>
          </article>
          <article className="rounded-xl border-2 border-black bg-card p-4 shadow-[var(--shadow-comic)]">
            <p className="text-xs font-bold text-muted-foreground">MAPE</p>
            <p className="mt-1 text-lg font-black">{historyData.performance.mape}</p>
          </article>
          <article className="rounded-xl border-2 border-black bg-card p-4 shadow-[var(--shadow-comic)]">
            <p className="text-xs font-bold text-muted-foreground">RMSE</p>
            <p className="mt-1 text-lg font-black">{historyData.performance.rmse}</p>
          </article>
        </section>
      </div>
    </main>
  );
}

export default function HistoryPage() {
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
      <HistoryPageContent />
    </Suspense>
  );
}
