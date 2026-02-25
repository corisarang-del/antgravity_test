"use client";

import { useEffect, useRef, useState } from "react";

import { setStoredAuthSession } from "@/lib/authSession";
import { supabase } from "@/lib/supabaseClient";

export default function AuthCallbackPage() {
  const [message, setMessage] = useState("로그인 처리 중...");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    void (async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error || !data.session) {
        setMessage("로그인 실패. 잠시 후 로그인 페이지로 이동해.");
        timeoutRef.current = setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
        return;
      }

      const { session } = data;
      setStoredAuthSession({
        accessToken: session.access_token,
        refreshToken: session.refresh_token,
        expiresIn: session.expires_in,
        user: {
          id: session.user.id,
          email: session.user.email ?? "",
        },
      });

      window.location.href = "/watchlist";
    })();

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <main className="min-h-screen bg-background p-3 text-foreground sm:p-4 md:p-6">
      <div className="mx-auto max-w-md rounded-2xl border-2 border-black bg-card p-6 shadow-[var(--shadow-comic)]">
        <p role="status" aria-live="polite" className="text-sm font-semibold">
          {message}
        </p>
      </div>
    </main>
  );
}
