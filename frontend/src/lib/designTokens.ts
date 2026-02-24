export const designTokens = {
  tone: {
    trust: "신뢰",
    friendly: "친근",
    clean: "깔끔",
    playful: "퍼니",
  },
  refreshPolicy: {
    basic: "장중 15분 + 장마감 1회",
    premium: "1분 실시간",
  },
  dataStatus: {
    normal: "NORMAL",
    delayed: "DELAYED",
    failed: "FAILED",
  },
} as const;

export type DataStatusType = (typeof designTokens.dataStatus)[keyof typeof designTokens.dataStatus];
