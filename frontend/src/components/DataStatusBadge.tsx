import type { DataStatusType } from "@/lib/designTokens";

type DataStatusBadgeProps = {
  status: DataStatusType;
};

const styleMap: Record<DataStatusType, string> = {
  NORMAL: "bg-[hsl(var(--success)/0.18)] text-[hsl(var(--success))] border-black",
  DELAYED: "bg-[hsl(var(--warning)/0.2)] text-[hsl(var(--warning))] border-black",
  FAILED: "bg-[hsl(var(--destructive)/0.15)] text-[hsl(var(--destructive))] border-black",
};

export function DataStatusBadge({ status }: DataStatusBadgeProps) {
  return (
    <span className={`inline-flex rounded-md border-2 px-2.5 py-1 text-xs font-black ${styleMap[status]}`}>
      {status}
    </span>
  );
}
