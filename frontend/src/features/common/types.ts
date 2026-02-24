export type UserTier = "basic" | "premium";

export type EligibilityReason = {
  hasActiveSubscription: boolean;
  levelScore: number;
};

export type SymbolItem = {
  ticker: string;
  name: string;
};

export type PredictionSummary = {
  direction: "상승" | "하락" | "중립";
  confidence: number;
  horizonLabel: string;
  updatedAt: string;
};

export type CacheInfo = {
  enabled: boolean;
  ttlMinutesLeft: number;
  lastSyncAt: string;
};
