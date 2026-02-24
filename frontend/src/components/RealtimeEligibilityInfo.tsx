import type { EligibilityReason } from "@/features/common/types";

type RealtimeEligibilityInfoProps = {
  reason: EligibilityReason;
};

export function RealtimeEligibilityInfo({ reason }: RealtimeEligibilityInfoProps) {
  const isEligible = reason.hasActiveSubscription || reason.levelScore >= 70;

  return (
    <section className="rounded-xl border-2 border-black bg-card p-4 shadow-[var(--shadow-comic)]">
      <h3 className="text-sm font-black">실시간 갱신 권한</h3>
      <p className="mt-2 text-sm font-semibold">
        상태: {" "}
        <span className={isEligible ? "text-[hsl(var(--success))] font-black" : "text-[hsl(var(--warning))] font-black"}>
          {isEligible ? "활성" : "비활성"}
        </span>
      </p>
      <ul className="mt-2 space-y-1 text-xs font-semibold text-muted-foreground">
        <li>구독 활성 여부: {reason.hasActiveSubscription ? "예" : "아니오"}</li>
        <li>레벨 점수: {reason.levelScore}점</li>
        <li>기준: 구독 활성 또는 레벨 70점 이상</li>
      </ul>
    </section>
  );
}
