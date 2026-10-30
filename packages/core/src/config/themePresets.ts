import type { LibThemeConfig } from "./configTypes";
import { defaultLibConfig } from "./configDefaults";

/**
 * 主题预设方案。
 *
 * 系统页（ConfigDocPage）与门户首页的主题浮层共用这一份数据，
 * 避免两处各写一套导致配色漂移。
 */
export type ThemePresetKey = "default" | "light" | "purple" | "dark";

export const themePresets: Record<ThemePresetKey, Partial<LibThemeConfig>> = {
  default: { ...defaultLibConfig.theme },

  light: {
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
    fontSizeBase: 14,
    fontSizeSm: 13,
    radiusSm: 4,
    radiusMd: 8,
    radiusLg: 10,
  },

  purple: {
    colorPrimary: "#6366f1",
    colorSuccess: "#10b981",
    colorWarning: "#f59e0b",
    textHeading: "#1e1b4b",
    textPrimary: "#312e81",
    textRegular: "#4338ca",
    textSecondary: "#6366f1",
    bgPage: "#f5f3ff",
    bgCard: "#ffffff",
    bgSubtle: "#eef2ff",
    bgMuted: "#e0e7ff",
    borderColor: "#e0e7ff",
    borderMedium: "#c7d2fe",
    fontSizeBase: 14,
    fontSizeSm: 13,
    radiusSm: 4,
    radiusMd: 8,
    radiusLg: 10,
  },

  dark: {
    colorPrimary: "#7aa2f7",
    colorSuccess: "#9ece6a",
    colorWarning: "#e0af68",
    textHeading: "#a9b1d6",
    textPrimary: "#9aa5ce",
    textRegular: "#787c99",
    textSecondary: "#565a6e",
    bgPage: "#1a1b26",
    bgCard: "#24283b",
    bgSubtle: "#1f2335",
    bgMuted: "#343a52",
    borderColor: "#3b4261",
    borderMedium: "#4e5579",
    fontSizeBase: 14,
    fontSizeSm: 13,
    radiusSm: 4,
    radiusMd: 8,
    radiusLg: 10,
  },
};

/** 预设展示用的主色圆点 */
export const themePresetSwatches: Record<ThemePresetKey, string> = {
  default: "#409eff",
  light: "#3370ff",
  purple: "#6366f1",
  dark: "#7aa2f7",
};

/** 主色快调色板 */
export const primarySwatches = [
  "#409eff",
  "#3370ff",
  "#6366f1",
  "#00b42a",
  "#ff7d00",
  "#f56c6c",
  "#9c27b0",
];
