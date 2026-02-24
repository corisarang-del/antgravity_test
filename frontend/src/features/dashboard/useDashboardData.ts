import { useMemo, useState } from "react";
import useSWR from "swr";

import { apiClient } from "@/lib/apiClient";
import type {
  CacheInfo,
  EligibilityReason,
  PredictionSummary,
  SymbolItem,
  UserTier,
} from "@/features/common/types";

const fallbackSymbols: SymbolItem[] = [
  { ticker: "TSLA", name: "Tesla" },
  { ticker: "NVDA", name: "NVIDIA" },
  { ticker: "AAPL", name: "Apple" },
];

const fallbackSummaryMap: Record<string, PredictionSummary> = {
  TSLA: { direction: "상승", confidence: 72, horizonLabel: "D+1 ~ D+5", updatedAt: "12:40" },
  NVDA: { direction: "중립", confidence: 65, horizonLabel: "D+1 ~ D+5", updatedAt: "12:39" },
  AAPL: { direction: "하락", confidence: 61, horizonLabel: "D+1 ~ D+5", updatedAt: "12:41" },
};

const fallbackCacheMap: Record<string, CacheInfo> = {
  TSLA: { enabled: true, ttlMinutesLeft: 12, lastSyncAt: "12:40" },
  NVDA: { enabled: true, ttlMinutesLeft: 9, lastSyncAt: "12:39" },
  AAPL: { enabled: true, ttlMinutesLeft: 14, lastSyncAt: "12:41" },
};

type PredictionApiResponse = {
  direction: string;
  confidence: number;
  horizon?: string;
  cache?: {
    enabled: boolean;
    ttlSeconds: number;
    lastSyncAt: string;
  };
};

function mapDirection(direction: string): "상승" | "하락" | "중립" {
  if (direction === "UP" || direction === "상승") return "상승";
  if (direction === "DOWN" || direction === "하락") return "하락";
  return "중립";
}

async function fetchSymbols(): Promise<SymbolItem[]> {
  try {
    const response = await apiClient<{ items: Array<{ ticker: string; name: string }> }>("/api/symbols");
    return response.items;
  } catch {
    return fallbackSymbols;
  }
}

async function fetchPrediction(ticker: string): Promise<{ summary: PredictionSummary; cacheInfo: CacheInfo }> {
  try {
    const response = await apiClient<PredictionApiResponse>(`/api/predictions/${ticker}`);
    return {
      summary: {
        direction: mapDirection(response.direction),
        confidence: Math.round(response.confidence * 100),
        horizonLabel: response.horizon ?? "D+1 ~ D+5",
        updatedAt: response.cache?.lastSyncAt ?? "-",
      },
      cacheInfo: {
        enabled: response.cache?.enabled ?? true,
        ttlMinutesLeft: Math.max(0, Math.floor((response.cache?.ttlSeconds ?? 0) / 60)),
        lastSyncAt: response.cache?.lastSyncAt ?? "-",
      },
    };
  } catch {
    return {
      summary: fallbackSummaryMap[ticker] ?? fallbackSummaryMap.TSLA,
      cacheInfo: fallbackCacheMap[ticker] ?? fallbackCacheMap.TSLA,
    };
  }
}

export function useDashboardData() {
  const [selectedTicker, setSelectedTicker] = useState<string>("TSLA");
  const [tier] = useState<UserTier>("basic");
  const [status] = useState<"NORMAL" | "DELAYED" | "FAILED">("NORMAL");

  const { data: symbols = fallbackSymbols } = useSWR("/api/symbols", fetchSymbols, {
    revalidateOnFocus: false,
    dedupingInterval: 5000,
  });

  const { data: predictionData, error, mutate } = useSWR(
    selectedTicker ? ["/api/predictions", selectedTicker] : null,
    ([, ticker]) => fetchPrediction(ticker),
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000,
    },
  );

  const summary = predictionData?.summary ?? fallbackSummaryMap[selectedTicker] ?? fallbackSummaryMap.TSLA;
  const cacheInfo = predictionData?.cacheInfo ?? fallbackCacheMap[selectedTicker] ?? fallbackCacheMap.TSLA;

  const eligibilityReason: EligibilityReason = useMemo(
    () => ({ hasActiveSubscription: tier === "premium", levelScore: 72 }),
    [tier],
  );

  const errorType: "none" | "network" | "permission" | "data-delay" = error ? "network" : "none";

  const retry = () => {
    void mutate();
  };

  return {
    symbols,
    selectedTicker,
    setSelectedTicker,
    summary,
    cacheInfo,
    tier,
    status,
    errorType,
    eligibilityReason,
    retry,
  };
}
