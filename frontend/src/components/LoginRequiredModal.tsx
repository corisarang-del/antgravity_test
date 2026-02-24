"use client";

import Link from "next/link";

type LoginRequiredModalProps = {
  open: boolean;
};

export function LoginRequiredModal({ open }: LoginRequiredModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4">
      <div className="w-full max-w-sm rounded-xl border-2 border-black bg-card p-5 shadow-[var(--shadow-comic)]">
        <h3 className="text-base font-black">로그인이 필요해</h3>
        <p className="mt-2 text-sm font-semibold text-muted-foreground">관심종목과 알림 설정은 로그인 후 사용할 수 있어.</p>
        <div className="mt-4 flex justify-end">
          <Link
            href="/login?redirect=/watchlist"
            className="inline-flex h-11 w-full cursor-pointer items-center justify-center rounded-md border-2 border-black bg-[hsl(var(--primary))] px-4 text-sm font-extrabold text-primary-foreground hover:-translate-y-0.5 sm:w-auto"
          >
            로그인
          </Link>
        </div>
      </div>
    </div>
  );
}
