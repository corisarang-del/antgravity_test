"use client";

import { useState } from "react";

type AlertPreferenceFormProps = {
  defaultEnabled?: boolean;
};

export function AlertPreferenceForm({ defaultEnabled = true }: AlertPreferenceFormProps) {
  const [enabled, setEnabled] = useState(defaultEnabled);
  const [threshold, setThreshold] = useState("2.0");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <form className="rounded-xl border-2 border-black bg-card p-4 shadow-[var(--shadow-comic)]" onSubmit={handleSubmit}>
      <h3 className="text-sm font-black">알림 설정</h3>

      <label className="mt-3 flex items-center gap-2 text-sm font-semibold" htmlFor="enableInAppAlert">
        <input
          id="enableInAppAlert"
          checked={enabled}
          onChange={(event) => setEnabled(event.target.checked)}
          type="checkbox"
          className="h-4 w-4"
        />
        인앱 알림 사용
      </label>

      <label className="mt-3 block text-sm font-semibold" htmlFor="alertThreshold">
        변동 임계치 (%)
        <input
          id="alertThreshold"
          type="number"
          min="0"
          step="0.1"
          inputMode="decimal"
          className="mt-1 h-10 w-full rounded-md border-2 border-black bg-background px-3"
          value={threshold}
          onChange={(event) => setThreshold(event.target.value)}
        />
      </label>

      <button
        type="submit"
        className="mt-4 h-11 w-full cursor-pointer rounded-md border-2 border-black bg-[hsl(var(--primary))] px-4 text-sm font-extrabold text-primary-foreground hover:-translate-y-0.5 sm:w-auto"
      >
        저장
      </button>
    </form>
  );
}
