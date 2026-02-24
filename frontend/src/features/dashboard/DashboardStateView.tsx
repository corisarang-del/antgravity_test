type DashboardStateViewProps = {
  errorType: "none" | "network" | "permission" | "data-delay";
  onRetry: () => void;
};

export function DashboardStateView({ errorType, onRetry }: DashboardStateViewProps) {
  if (errorType === "none") return null;

  const messageMap = {
    network: "네트워크 오류가 발생했어. 연결 상태를 확인해줘.",
    permission: "권한이 부족해. 로그인 여부와 플랜 상태를 확인해줘.",
    "data-delay": "데이터가 지연되고 있어. 마지막 유효 데이터 기준으로 보여줄게.",
  } as const;

  return (
    <section className="rounded-xl border border-[hsl(var(--warning)/0.35)] bg-[hsl(var(--warning)/0.08)] p-4">
      <p className="text-sm font-medium text-[hsl(var(--warning))]">{messageMap[errorType]}</p>
      <button
        type="button"
        className="mt-3 inline-flex h-10 items-center rounded-md border border-border bg-card px-4 text-sm font-semibold hover:bg-muted"
        onClick={onRetry}
      >
        다시 시도
      </button>
    </section>
  );
}
