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

function getFallbackPayload(): HistoryPayload {
  return {
    indicators: [
      { label: "RSI (14)", value: "-", hint: "데이터 없음" },
      { label: "MACD", value: "-", hint: "데이터 없음" },
      { label: "VIX", value: "-", hint: "데이터 없음" },
      { label: "Fear & Greed", value: "-", hint: "데이터 없음" },
    ],
    historyPoints: [],
    performance: {
      da: "-",
      mape: "-",
      rmse: "-",
    },
  };
}

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
    return getFallbackPayload();
  }
}

export function useHistoryData(ticker: string) {
  const { data } = useSWR(
    ["/api/history-combined", ticker],
    ([, t]) => fetchHistoryData(t),
    { revalidateOnFocus: false, dedupingInterval: 5000 },
  );

  return data ?? getFallbackPayload();
}
