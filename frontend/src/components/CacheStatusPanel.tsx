import type { CacheInfo } from "@/features/common/types";

type CacheStatusPanelProps = {
  cacheInfo: CacheInfo;
};

export function CacheStatusPanel({ cacheInfo }: CacheStatusPanelProps) {
  return (
    <section className="rounded-xl border-2 border-black bg-[hsl(var(--secondary)/0.15)] p-4 shadow-[var(--shadow-comic)]">
      <h3 className="text-sm font-black">캐시 상태</h3>
      <div className="mt-2 grid gap-2 text-xs font-semibold text-foreground sm:grid-cols-3">
        <p className="rounded-md border-2 border-black bg-card px-2 py-1">적용 여부: {cacheInfo.enabled ? "적용" : "미적용"}</p>
        <p className="rounded-md border-2 border-black bg-card px-2 py-1">TTL 남은 시간: {cacheInfo.ttlMinutesLeft}분</p>
        <p className="rounded-md border-2 border-black bg-card px-2 py-1">마지막 갱신: {cacheInfo.lastSyncAt}</p>
      </div>
    </section>
  );
}
