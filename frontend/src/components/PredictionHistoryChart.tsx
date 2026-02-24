type HistoryPoint = {
  label: string;
  predicted: number;
  actual: number;
};

type PredictionHistoryChartProps = {
  points: HistoryPoint[];
};

export function PredictionHistoryChart({ points }: PredictionHistoryChartProps) {
  return (
    <section className="rounded-xl border-2 border-black bg-card p-4 shadow-[var(--shadow-comic)]">
      <figure>
        <h3 className="text-sm font-black">예측 vs 실제 (프리뷰)</h3>
        <figcaption className="sr-only">최근 5일 예측값과 실제값 비교 차트</figcaption>

        <div className="mt-3 grid gap-3" role="list" aria-label="예측 대비 실제 성과">
          {points.map((point) => (
            <div
              key={point.label}
              role="listitem"
              aria-label={`${point.label} 예측 ${point.predicted}%, 실제 ${point.actual}%`}
              className="grid grid-cols-1 gap-2 rounded-md border-2 border-black bg-background p-2 text-xs sm:grid-cols-[64px_1fr_1fr] sm:items-center"
            >
              <span className="font-bold text-muted-foreground">{point.label}</span>
              <div className="h-3 rounded border border-black bg-[hsl(var(--chart-1)/0.25)] sm:h-2" aria-hidden>
                <div className="h-full rounded bg-[hsl(var(--chart-1))]" style={{ width: `${point.predicted}%` }} />
              </div>
              <div className="h-3 rounded border border-black bg-[hsl(var(--chart-2)/0.25)] sm:h-2" aria-hidden>
                <div className="h-full rounded bg-[hsl(var(--chart-2))]" style={{ width: `${point.actual}%` }} />
              </div>
            </div>
          ))}
        </div>
      </figure>
    </section>
  );
}
