type MetricCardProps = {
  title: string;
  value: string;
  hint: string;
  tone?: "default" | "success" | "warning" | "danger";
};

const toneClassMap: Record<NonNullable<MetricCardProps["tone"]>, string> = {
  default: "text-foreground",
  success: "text-[hsl(var(--success))]",
  warning: "text-[hsl(var(--warning))]",
  danger: "text-[hsl(var(--destructive))]",
};

export function MetricCard({ title, value, hint, tone = "default" }: MetricCardProps) {
  return (
    <article className="rounded-xl border border-border bg-card p-4 shadow-[var(--shadow-sm)]">
      <p className="text-xs font-semibold tracking-wide text-muted-foreground">{title}</p>
      <p className={`mt-2 text-2xl font-bold ${toneClassMap[tone]}`}>{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
    </article>
  );
}

