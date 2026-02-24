import { designTokens } from "@/lib/designTokens";

type RefreshPolicyInfoProps = {
  tier: "basic" | "premium";
};

export function RefreshPolicyInfo({ tier }: RefreshPolicyInfoProps) {
  const policyText = tier === "premium" ? designTokens.refreshPolicy.premium : designTokens.refreshPolicy.basic;
  const tierLabel = tier === "premium" ? "프리미엄" : "기본";

  return (
    <section className="rounded-xl border-2 border-black bg-card p-4 shadow-[var(--shadow-comic)]">
      <h3 className="text-sm font-black">갱신 정책</h3>
      <p className="mt-2 text-sm font-semibold text-foreground">
        현재 등급: <span className="rounded px-1 py-0.5 bg-[hsl(var(--primary))] text-primary-foreground">{tierLabel}</span>
      </p>
      <p className="mt-2 rounded-md border-2 border-black bg-[hsl(var(--secondary)/0.22)] px-2 py-1 text-xs font-semibold text-foreground">
        {policyText}
      </p>
    </section>
  );
}
