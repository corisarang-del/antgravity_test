"use client";

import { useState } from "react";

type NotificationItem = {
  id: string;
  title: string;
  read: boolean;
};

const initialItems: NotificationItem[] = [
  { id: "n1", title: "TSLA 예측 업데이트가 도착했어.", read: false },
  { id: "n2", title: "NVDA 알림 조건을 충족했어.", read: false },
];

export function AppNotificationPanel() {
  const [items, setItems] = useState(() => initialItems);

  return (
    <section className="rounded-xl border-2 border-black bg-card p-4 shadow-[var(--shadow-comic)]">
      <h3 className="text-sm font-black">인앱 알림함</h3>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li key={item.id} className="flex flex-col gap-2 rounded-md border-2 border-black bg-background p-3 text-sm sm:flex-row sm:items-center sm:justify-between">
            <span className={item.read ? "text-muted-foreground" : "font-bold"}>{item.title}</span>
            {!item.read ? (
              <button
                type="button"
                className="h-10 w-full cursor-pointer rounded-md border-2 border-black bg-[hsl(var(--primary))] px-3 text-xs font-extrabold text-primary-foreground hover:-translate-y-0.5 sm:h-8 sm:w-auto"
                onClick={() => setItems((prev) => prev.map((x) => (x.id === item.id ? { ...x, read: true } : x)))}
              >
                읽음 처리
              </button>
            ) : (
              <span className="text-xs font-semibold text-muted-foreground">읽음</span>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
