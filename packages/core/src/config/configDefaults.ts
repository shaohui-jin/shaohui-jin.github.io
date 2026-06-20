import type { ResolvedLibConfig } from "./configTypes";

/**
 * 组件库全量默认值
 */
export const defaultLibConfig: ResolvedLibConfig = {
  theme: {
    colorPrimary: "#409eff",
    colorSuccess: "#67c23a",
    colorWarning: "#e6a23c",

    textHeading: "#1d2129",
    textPrimary: "#303133",
    textRegular: "#606266",
    textSecondary: "#909399",

    bgPage: "#f5f7fa",
    bgCard: "#ffffff",
    bgSubtle: "#fafafa",
    bgMuted: "#f4f4f5",

    borderColor: "#ebeef5",
    borderMedium: "#dcdfe6",

    fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif',
    fontSizeBase: 14,
    fontSizeSm: 13,

    radiusSm: 3,
    radiusMd: 6,
  },
};
