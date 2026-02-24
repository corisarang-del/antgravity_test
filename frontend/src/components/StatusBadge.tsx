type StatusBadgeProps = {
  label: string;
  variant?: "default" | "success" | "warning" | "danger" | "info";
};

const variantClassMap: Record<NonNullable<StatusBadgeProps["variant"]>, string> = {
  default: "bg-muted text-muted-foreground border-border",
  success: "bg-[hsl(var(--success)/0.15)] text-[hsl(var(--success))] border-[hsl(var(--success)/0.4)]",
  warning: "bg-[hsl(var(--warning)/0.14)] text-[hsl(var(--warning))] border-[hsl(var(--warning)/0.4)]",
  danger:
    "bg-[hsl(var(--destructive)/0.12)] text-[hsl(var(--destructive))] border-[hsl(var(--destructive)/0.35)]",
  info: "bg-[hsl(var(--info)/0.14)] text-[hsl(var(--info))] border-[hsl(var(--info)/0.35)]",
};

export function StatusBadge({ label, variant = "default" }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${variantClassMap[variant]}`}
    >
      {label}
    </span>
  );
}

