import type { ResolvedLibConfig } from "@/config/configTypes";
import { defaultLibConfig } from "@/config/configDefaults";

/**
 * 五种 BaseTable 模式共用的 tooltip popper class，
 * 保证 element / virtual / canvas 系列的 tooltip 样式统一。
 */
export const TABLE_TOOLTIP_POPPER_CLASS = "crud-base-table-tooltip";

/**
 * 五种 BaseTable 模式共用的布局默认值（行高、列宽与 BaseTable props 默认一致）。
 * @deprecated 使用 config.table 代替
 */
export const tableLayoutDefaults = {
  rowHeight: defaultLibConfig.table.rowHeight,
  headerHeight: defaultLibConfig.table.headerHeight,
  minColumnWidth: defaultLibConfig.table.minColumnWidth,
  defaultColumnWidth: defaultLibConfig.table.defaultColumnWidth,
  selectionColumnWidth: 40,
  indexColumnWidth: 52,
} as const;

/**
 * 表格表面配置（颜色 + 字体），从 theme 统一配置自动派生。
 * 内部类型，不对外暴露。
 */
export interface TableSurfaceConfig {
  surfaceBg: string;
  headerBg: string;
  borderColor: string;
  textPrimary: string;
  textHeader: string;
  textEmpty: string;
  rowStripe: string;
  rowBase: string;
  rowHoverBg: string;
  checkboxBorder: string;
  checkboxCheckedBg: string;
  fontFamily: string;
  headerFontWeight: number;
  cellFontWeight: number;
  fontSizeCell: number;
  fontSizeEmpty: number;
  neutralLamp: string;
}

/** 从 ResolvedLibConfig 派生 table 绘制所需的 surface 配置 */
export function getTableSurface(config: ResolvedLibConfig = defaultLibConfig): TableSurfaceConfig {
  const { theme, table } = config;
  return {
    surfaceBg: theme.bgCard,
    headerBg: theme.bgPage,
    borderColor: theme.borderColor,
    textPrimary: theme.textRegular,
    textHeader: theme.textSecondary,
    textEmpty: theme.textRegular,
    rowStripe: theme.bgSubtle,
    rowBase: theme.bgCard,
    rowHoverBg: theme.bgPage,
    checkboxBorder: theme.borderMedium,
    checkboxCheckedBg: theme.colorPrimary,
    fontFamily: theme.fontFamily,
    headerFontWeight: table.headerFontWeight,
    cellFontWeight: table.cellFontWeight,
    fontSizeCell: table.fontSizeCell,
    fontSizeEmpty: table.fontSizeEmpty,
    neutralLamp: "rgba(203, 206, 212, 1)",
  };
}

/** 默认 surface 配置（基于 defaultLibConfig 派生） */
export const tableSurfaceConfig = getTableSurface(defaultLibConfig);

/** 解析 #RRGGBB → Skia / Canvas 用的 RGB（0–255） */
export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const m = /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/.exec(hex.trim());
  if (!m) {
    return { r: 0, g: 0, b: 0 };
  }
  return {
    r: parseInt(m[1], 16),
    g: parseInt(m[2], 16),
    b: parseInt(m[3], 16),
  };
}

/** `rgb()` / `rgba()` / `#RRGGBB` → RGB，供 Skia 等着色 */
export function cssRgbOrRgbaToRgb(color: string): { r: number; g: number; b: number } {
  const s = color.trim();
  const rgba = /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i.exec(s);
  if (rgba) {
    return { r: +rgba[1], g: +rgba[2], b: +rgba[3] };
  }
  if (s.startsWith("#")) {
    return hexToRgb(s);
  }
  return { r: 203, g: 206, b: 212 };
}

/** 挂到 `.crud-base-table` 根节点的 CSS 变量（DOM 模式） */
export function tableSurfaceCssVars(
  config: ResolvedLibConfig = defaultLibConfig,
  rowHeight?: number,
  headerHeight?: number,
): Record<string, string> {
  const t = getTableSurface(config);
  const rh = rowHeight ?? config.table.rowHeight;
  const hh = headerHeight ?? config.table.headerHeight;
  return {
    "--crud-bt-surface-bg": t.surfaceBg,
    "--crud-bt-header-bg": t.headerBg,
    "--crud-bt-border": t.borderColor,
    "--crud-bt-text": t.textPrimary,
    "--crud-bt-header-text": t.textHeader,
    "--crud-bt-text-empty": t.textEmpty,
    "--crud-bt-row-stripe": t.rowStripe,
    "--crud-bt-row-base": t.rowBase,
    "--crud-bt-row-hover": t.rowHoverBg,
    "--crud-bt-font-size": `${t.fontSizeCell}px`,
    "--crud-bt-row-height": `${rh}px`,
    "--crud-bt-header-height": `${hh}px`,
    "--crud-bt-header-font-weight": String(t.headerFontWeight),
    "--crud-bt-cell-font-weight": String(t.cellFontWeight),
    "--el-table-border-color": t.borderColor,
    "--el-table-text-color": t.textPrimary,
    "--el-table-header-text-color": t.textHeader,
    "--el-table-header-bg-color": t.headerBg,
    "--el-table-bg-color": t.surfaceBg,
    "--el-table-tr-bg-color": t.rowBase,
    "--el-table-row-hover-bg-color": t.rowHoverBg,
  };
}

export function canvasCellFont(cfg: TableSurfaceConfig = tableSurfaceConfig): string {
  return `${cfg.cellFontWeight} ${cfg.fontSizeCell}px ${cfg.fontFamily}`;
}

export function canvasHeaderFont(cfg: TableSurfaceConfig = tableSurfaceConfig): string {
  return `${cfg.headerFontWeight} ${cfg.fontSizeCell}px ${cfg.fontFamily}`;
}

export function canvasEmptyFont(cfg: TableSurfaceConfig = tableSurfaceConfig): string {
  return `${cfg.cellFontWeight} ${cfg.fontSizeEmpty}px ${cfg.fontFamily}`;
}
