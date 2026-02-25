import useSWR from "swr";

import { apiClient } from "@/lib/apiClient";

type IndicatorItem = {
  label: string;
  value: string;
  hint: string;
};

type HistoryPoint = {
  label: string;
  predicted: number;
  actual: number;
};

type HistoryPayload = {
  indicators: IndicatorItem[];
  historyPoints: HistoryPoint[];
  performance: {
    da: string;
    mape: string;
    rmse: string;
  };
};

const fallbackPayload: HistoryPayload = {
  indicators: [
    { label: "RSI (14)", value: "58.4", hint: "중립-상승 구간" },
    { label: "MACD", value: "+1.24", hint: "상승 모멘텀" },
    { label: "VIX", value: "17.8", hint: "변동성 보통" },
    { label: "Fear & Greed", value: "64", hint: "탐욕 구간" },
  ],
  historyPoints: [
    { label: "D-5", predicted: 42, actual: 48 },
    { label: "D-4", predicted: 56, actual: 54 },
    { label: "D-3", predicted: 64, actual: 61 },
    { label: "D-2", predicted: 58, actual: 53 },
    { label: "D-1", predicted: 66, actual: 69 },
  ],
  performance: {
    da: "56.8%",
    mape: "2.9%",
    rmse: "v0 대비 -11%",
  },
};

async function fetchHistoryData(ticker: string): Promise<HistoryPayload> {
  try {
    const [indicatorRes, historyRes] = await Promise.all([
      apiClient<{ snapshot: Record<string, number> }>(`/api/indicators/${ticker}`),
      apiClient<{ points: HistoryPoint[]; metrics: { da: number; mape: number; rmse: number } }>(
        `/api/prediction-history/${ticker}`,
      ),
    ]);

    return {
      indicators: [
        { label: "RSI (14)", value: String(indicatorRes.snapshot.rsi14 ?? "-"), hint: "모멘텀 지표" },
        { label: "MACD", value: String(indicatorRes.snapshot.macd ?? "-"), hint: "추세 강도" },
        { label: "VIX", value: String(indicatorRes.snapshot.vix ?? "-"), hint: "시장 변동성" },
        {
          label: "Fear & Greed",
          value: String(indicatorRes.snapshot.fearGreed ?? "-"),
          hint: "시장 심리 지표",
        },
      ],
      historyPoints: historyRes.points,
      performance: {
        da: `${(historyRes.metrics.da * 100).toFixed(1)}%`,
        mape: `${(historyRes.metrics.mape * 100).toFixed(1)}%`,
        rmse: historyRes.metrics.rmse.toFixed(2),
      },
    };
  } catch {
    return fallbackPayload;
  }
}

export function useHistoryData(ticker: string) {
  const { data } = useSWR(
    ["/api/history-combined", ticker],
    ([, t]) => fetchHistoryData(t),
    { revalidateOnFocus: false, dedupingInterval: 5000 },
  );

  return data ?? fallbackPayload;
}
