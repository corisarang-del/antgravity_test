const colorTokens = [
  "background",
  "foreground",
  "card",
  "primary",
  "secondary",
  "accent",
  "success",
  "warning",
  "destructive",
  "muted",
] as const;

const spacingTokens = [
  "space-1",
  "space-2",
  "space-3",
  "space-4",
  "space-5",
  "space-6",
  "space-7",
  "space-8",
  "space-9",
  "space-10",
  "space-12",
] as const;

const shadowTokens = [
  "shadow-xs",
  "shadow-sm",
  "shadow-md",
  "shadow-lg",
  "shadow-pop",
  "shadow-glow-indigo",
  "shadow-glow-warm",
] as const;

function PreviewPanel({ isDark }: { isDark: boolean }) {
  return (
    <section className={isDark ? "dark" : ""}>
      <div className="bg-background text-foreground border border-border rounded-xl p-6 space-y-8">
        <header className="space-y-1">
          <h2 className="text-xl font-semibold">
            {isDark ? "다크 토큰 프리뷰" : "라이트 토큰 프리뷰"}
          </h2>
          <p className="text-sm text-muted-foreground">
            shadcn/ui 변수와 웹뷰 확장 토큰 적용 상태를 확인한다.
          </p>
        </header>

        <section className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground">Colors</h3>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
            {colorTokens.map((token) => (
              <div key={token} className="rounded-lg border border-border p-3 bg-card">
                <div
                  className="h-12 rounded-md border border-border"
                  style={{ backgroundColor: `hsl(var(--${token}))` }}
                />
                <p className="mt-2 text-xs font-medium">{token}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground">Spacing</h3>
          <div className="space-y-2">
            {spacingTokens.map((token) => (
              <div key={token} className="flex items-center gap-3">
                <span className="w-20 text-xs">{token}</span>
                <div
                  className="h-3 rounded-full bg-primary"
                  style={{ width: `var(--${token})` }}
                />
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground">Shadows</h3>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {shadowTokens.map((token) => (
              <div
                key={token}
                className="rounded-lg bg-card border border-border p-4 text-sm"
                style={{ boxShadow: `var(--${token})` }}
              >
                {token}
              </div>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}

export default function DesignSystemPage() {
  return (
    <main className="min-h-screen bg-muted/40 p-4 md:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="rounded-xl border border-border bg-card p-6">
          <h1 className="text-2xl font-bold tracking-tight">
            Ant Gravity WebView Design System
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            신뢰 중심 금융 UI와 친근한 개미 캐릭터 컨셉을 위한 토큰 프리뷰 페이지다.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <PreviewPanel isDark={false} />
          <PreviewPanel isDark />
        </div>
      </div>
    </main>
  );
}
