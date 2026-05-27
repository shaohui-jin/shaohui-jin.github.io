import type { ResolvedLibConfig } from "./configTypes";

/**
 * 组件库全量默认值
 */
export const defaultLibConfig: ResolvedLibConfig = {
  theme: {
    colorPrimary: "#3370ff",
    colorSuccess: "#00b42a",
    colorWarning: "#ff7d00",

    textHeading: "#1d2129",
    textPrimary: "#303133",
    textRegular: "#606266",
    textSecondary: "#909399",

    bgPage: "#f5f7fa",
    bgCard: "#ffffff",
    bgSubtle: "#fafbfc",
    bgMuted: "#f4f4f5",

    borderColor: "#ebeef5",
    borderMedium: "#dcdfe6",

    fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif',
    fontSizeBase: 14,
    fontSizeSm: 13,

    radiusSm: 4,
    radiusMd: 8,
  },

  table: {
    rowHeight: 36,
    headerHeight: 40,
    fontSizeCell: 13,
    fontSizeEmpty: 14,
    headerFontWeight: 600,
    cellFontWeight: 400,
    minColumnWidth: 64,
    defaultColumnWidth: 120,
  },
};
