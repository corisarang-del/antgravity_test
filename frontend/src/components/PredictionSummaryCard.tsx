import type { PredictionSummary } from "@/features/common/types";

type PredictionSummaryCardProps = {
  summary: PredictionSummary;
};

const directionClassMap: Record<PredictionSummary["direction"], string> = {
  상승: "text-[hsl(var(--success))]",
  하락: "text-[hsl(var(--destructive))]",
  중립: "text-[hsl(var(--muted-foreground))]",
};

export function PredictionSummaryCard({ summary }: PredictionSummaryCardProps) {
  return (
    <article className="rounded-xl border-2 border-black bg-card p-4 shadow-[var(--shadow-comic)]">
      <p className="text-xs font-black tracking-wide text-muted-foreground">예측 요약</p>
      <p className={`mt-2 text-3xl font-black leading-none ${directionClassMap[summary.direction]}`}>{summary.direction}</p>
      <p className="mt-2 text-sm font-semibold text-foreground">신뢰도 {summary.confidence}%</p>
      <p className="mt-1 text-xs font-semibold text-muted-foreground">{summary.horizonLabel}</p>
      <p className="mt-3 rounded-md border-2 border-black bg-background px-2 py-1 text-xs font-semibold text-muted-foreground">
        기준 시각: {summary.updatedAt}
      </p>
    </article>
  );
}
