type IndicatorItem = {
  label: string;
  value: string;
  hint: string;
};

type IndicatorCardGridProps = {
  items: IndicatorItem[];
};

export function IndicatorCardGrid({ items }: IndicatorCardGridProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {items.map((item) => (
        <article key={item.label} className="rounded-xl border-2 border-black bg-card p-4 shadow-[var(--shadow-comic)]">
          <p className="text-xs font-bold text-muted-foreground">{item.label}</p>
          <p className="mt-1 text-lg font-black">{item.value}</p>
          <p className="mt-1 text-xs font-semibold text-muted-foreground">{item.hint}</p>
        </article>
      ))}
    </div>
  );
}
