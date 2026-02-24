import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_18%_12%,hsl(var(--accent)/0.18),transparent_36%),radial-gradient(circle_at_80%_78%,hsl(var(--secondary)/0.15),transparent_40%),hsl(var(--background))] text-foreground">
      <div className="mx-auto w-full max-w-6xl p-3 sm:p-4 md:p-6">
        <header className="flex items-center justify-between rounded-2xl border-2 border-black bg-card/90 px-4 py-3 shadow-[var(--shadow-comic)] backdrop-blur">
          <p className="text-sm font-black tracking-wide">AI Stock Predictor</p>
          <nav className="flex items-center gap-2">
            <Link
              href="/dashboard"
              className="inline-flex h-10 items-center justify-center rounded-md border-2 border-black bg-[hsl(var(--primary))] px-4 text-xs font-extrabold text-primary-foreground hover:-translate-y-0.5"
            >
              시작하기
            </Link>
          </nav>
        </header>

        <section className="px-2 py-20 text-center sm:py-24">
          <p className="mx-auto inline-flex rounded-full border-2 border-black bg-[hsl(var(--secondary))] px-3 py-1 text-[11px] font-black tracking-[0.12em] text-secondary-foreground shadow-[var(--shadow-comic)]">
            개미 투자자 맞춤 AI 분석
          </p>
          <h1 className="mt-6 text-4xl font-black leading-tight sm:text-6xl">
            감(感) 대신 데이터로,
            <span className="block text-[hsl(var(--secondary))]">개미도 납득되는 투자</span>
          </h1>
          <p className="mx-auto mt-5 max-w-3xl text-sm font-semibold text-foreground/80 sm:text-base">
            어려운 용어 대신 핵심만 보여줘. 실시간 지표와 AI 예측을 묶어서 오늘 시장 흐름을 한눈에 파악하고,
            왜 그런 신호가 나왔는지 근거까지 바로 확인할 수 있어.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/dashboard"
              className="inline-flex h-12 w-full items-center justify-center rounded-md border-2 border-black bg-[hsl(var(--primary))] px-5 text-sm font-extrabold text-primary-foreground shadow-[var(--shadow-comic)] hover:-translate-y-0.5 sm:w-auto"
            >
              내 종목 바로 분석하기
            </Link>
            <Link
              href="/basis"
              className="inline-flex h-12 w-full items-center justify-center rounded-md border-2 border-black bg-card px-5 text-sm font-extrabold hover:-translate-y-0.5 sm:w-auto"
            >
              왜 그런 예측인지 보기
            </Link>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <article className="rounded-2xl border-2 border-black bg-card p-5 shadow-[var(--shadow-comic)]">
            <p className="text-sm font-black">헷갈리는 장세, 방향 먼저 확인</p>
            <p className="mt-2 text-sm font-semibold text-muted-foreground">
              단기 흐름을 오를지 내릴지와 함께 보여줘서, 매수/관망 판단을 더 빨리 내릴 수 있어.
            </p>
          </article>
          <article className="rounded-2xl border-2 border-black bg-card p-5 shadow-[var(--shadow-comic)]">
            <p className="text-sm font-black">근거 없는 추천은 하지 않아</p>
            <p className="mt-2 text-sm font-semibold text-muted-foreground">
              변동성, 거래량, 뉴스 흐름 같은 핵심 지표를 같이 보여줘서 내 판단 기준을 직접 세울 수 있어.
            </p>
          </article>
          <article className="rounded-2xl border-2 border-black bg-card p-5 shadow-[var(--shadow-comic)]">
            <p className="text-sm font-black">맞았는지 틀렸는지 기록으로 확인</p>
            <p className="mt-2 text-sm font-semibold text-muted-foreground">
              과거 예측과 실제 결과를 나란히 비교해보면서, 모델이 어떤 장에서 강한지 확인할 수 있어.
            </p>
          </article>
        </section>

        <section className="mt-8 rounded-2xl border-2 border-black bg-[linear-gradient(135deg,hsl(var(--card)),hsl(var(--accent)/0.35))] px-4 py-8 text-center shadow-[var(--shadow-comic)] sm:px-8">
          <h2 className="text-2xl font-black sm:text-3xl">처음 시작하는 개미도 바로 쓸 수 있어</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm font-semibold text-foreground/75">
            가입 후 복잡한 설정 없이 관심 종목만 고르면, 오늘 신호와 근거를 바로 볼 수 있어.
          </p>
          <div className="mt-6">
            <Link
              href="/dashboard"
              className="inline-flex h-12 items-center justify-center rounded-md border-2 border-black bg-[hsl(var(--primary))] px-6 text-sm font-extrabold text-primary-foreground hover:-translate-y-0.5"
            >
              무료로 시작하기
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

