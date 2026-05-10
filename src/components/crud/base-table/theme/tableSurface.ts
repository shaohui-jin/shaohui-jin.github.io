/**
 * 五种 BaseTable 模式共用的 tooltip popper class，
 * 保证 element / virtual / canvas 系列的 tooltip 样式统一。
 */
export const TABLE_TOOLTIP_POPPER_CLASS = "crud-base-table-tooltip";

/**
 * 五种 BaseTable 模式共用的布局默认值（行高、列宽与 BaseTable props 默认一致）。
 */
export const tableLayoutDefaults = {
  rowHeight: 36,
  headerHeight: 40,
  minColumnWidth: 64,
  defaultColumnWidth: 120,
  /** 与 Element 模式 `type="selection"` 默认列宽一致 */
  selectionColumnWidth: 40,
  /** 与 Element 模式 `type="index"` 默认列宽一致 */
  indexColumnWidth: 52,
} as const;

/**
 * 五种 BaseTable 模式共用的表面样式（与 Canvas 2D 绘制一致）。
 * 修改此处即可同步 Element / Virtual / Canvas / Tile / Skia 的视觉。
 */
export const tableSurfaceTokens = {
  /** 表体、画布底色 */
  surfaceBg: "#ffffff",
  /** 表头背景（对齐 Element 常见工作台表头） */
  headerBg: "#f2f6fc",
  /** 边框线 */
  borderColor: "#ebeef5",
  /** 单元格正文 */
  textPrimary: "#606266",
  /** 表头文字 */
  textHeader: "#303133",
  /** 空状态提示 */
  textEmpty: "#606266",
  /** 斑马纹行（与 ElTable stripe：奇数 displayIndex） */
  rowStripe: "#fafafa",
  /** 非斑马行底 */
  rowBase: "#ffffff",
  /** 行 hover（与 EP 常用浅灰接近） */
  rowHoverBg: "#f5f7fa",
  /** Checkbox 未选边框（与 EP --el-border-color 一致） */
  checkboxBorder: "#dcdfe6",
  /** Checkbox 选中/半选填充（与 EP --el-color-primary 一致） */
  checkboxCheckedBg: "#409eff",
  fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif',
  /** 表头字重（与 Table-V2 / 覆盖后的 ElTable 一致） */
  headerFontWeight: 600,
  /** 单元格字重 */
  cellFontWeight: 400,
  /** 与默认 rowHeight 搭配的单元格字号 */
  fontSizeCell: 13,
  fontSizeEmpty: 14,
} as const;

export type TableSurfaceTokens = typeof tableSurfaceTokens;

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

/** 挂到 `.crud-base-table` 根节点：自有变量 + 覆盖 Element Plus Table 变量 */
export function tableSurfaceCssVars(
  rowHeight: number = tableLayoutDefaults.rowHeight,
  headerHeight: number = tableLayoutDefaults.headerHeight,
): Record<string, string> {
  const t = tableSurfaceTokens;
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
    "--crud-bt-row-height": `${rowHeight}px`,
    "--crud-bt-header-height": `${headerHeight}px`,
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

export function canvasCellFont(tokens: TableSurfaceTokens = tableSurfaceTokens): string {
  return `${tokens.cellFontWeight} ${tokens.fontSizeCell}px ${tokens.fontFamily}`;
}

export function canvasHeaderFont(tokens: TableSurfaceTokens = tableSurfaceTokens): string {
  return `${tokens.headerFontWeight} ${tokens.fontSizeCell}px ${tokens.fontFamily}`;
}

export function canvasEmptyFont(tokens: TableSurfaceTokens = tableSurfaceTokens): string {
  return `${tokens.cellFontWeight} ${tokens.fontSizeEmpty}px ${tokens.fontFamily}`;
}
