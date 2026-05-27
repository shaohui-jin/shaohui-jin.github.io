/**
 * 渲染模式
 * - element：Element Plus `el-table` 封装（能力最全，适合常规数据量）
 * - virtual：`el-table-v2` 虚拟滚动（适合万级行 DOM 仍可控）
 * - canvas：单 Canvas 2D，视口内重绘（适合超大数据、结构简单）
 * - canvas-tile：Canvas + 整表预渲染，滚动裁切视口
 * - skia-wasm：CanvasKit（Skia WASM）渲染，需加载 wasm
 */
export type BaseTableMode = "element" | "virtual" | "canvas" | "canvas-tile" | "skia-wasm";

/** 内置列类型 */
export type BaseTableColumnType =
  | "default"
  | "index"
  | "selection"
  | "formatter"
  | "switch"
  | "image"
  | "status"
  | "status-custom"
  | "tableSlot"
  | "editColumn"
  | "action";

/** 列配置（高性能模式仅使用其中一部分字段） */
export interface BaseTableColumn {
  key: string;
  /** 表头文案，兼容 Table-V2 的 title */
  label?: string;
  title?: string;
  width?: number;
  minWidth?: number;
  align?: "left" | "center" | "right";
  /** 为 false 时隐藏 */
  show?: boolean;
  /** 列类型（element 模式支持较多；canvas 系仅文本化展示） */
  type?: BaseTableColumnType | (string & {});
  formatter?: (row: Record<string, unknown>, column: BaseTableColumn, cellValue: unknown) => string;
  /**
   * `type === 'status-custom'` 时按单元格值取灯色：`colorMap[row[key]]`
   *（与历史项目 BaseTable 一致；键可为数字或字符串）
   */
  colorMap?: Record<string, string>;

  /** `type === 'switch'` 激活值，默认 true */
  activeValue?: string | number | boolean;
  /** `type === 'switch'` 非激活值，默认 false */
  inactiveValue?: string | number | boolean;
  /** `type === 'switch'` 是否禁用 */
  disabled?: boolean;
  /**
   * `type === 'switch'` 切换前的阻断钩子，返回 false 或 reject 时阻止切换。
   * 签名与 Element Plus ElSwitch before-change 一致，额外提供 row / col 上下文。
   */
  beforeChange?: (row: Record<string, unknown>, col: BaseTableColumn) => boolean | Promise<boolean>;

  /** `type === 'tableSlot'` 时弹窗内嵌子表格的列配置 */
  columns?: BaseTableColumn[];
  /** `type === 'tableSlot'` 弹窗宽度，默认 430 */
  popoverWidth?: number;
  /** `type === 'tableSlot'` 弹窗内搜索过滤函数 */
  filter?: (keyword: string, item: Record<string, unknown>) => boolean;
  /** `type === 'tableSlot'` 弹窗内搜索框 placeholder */
  filterPlaceholder?: string;

  /** 超长文本省略时是否显示 tooltip，默认 true */
  showOverflowTooltip?: boolean;
  /** 列是否可拖拽调整宽度，默认 true（仅 element 模式有效） */
  resizable?: boolean;

  /** 透传给 el-table-column / el-table-v2 Column 的额外属性（经 omit 过滤业务字段后） */
  [key: string]: unknown;
}

export interface BaseTableProps {
  mode: BaseTableMode;
  tableData: Record<string, unknown>[];
  columns: BaseTableColumn[];
  /** 容器高度，如 400px、60vh、100% */
  height?: string;
  rowKey?: string;
  loading?: boolean;
  emptyText?: string;
  rowHeight?: number;
  headerHeight?: number;
  /** canvas-tile 模式最大预渲染像素数 */
  maxPrerenderPixels?: number;
  skiaWasmBaseUrl?: string;
}

export interface BaseTableEmits {
  /** 选中行变化时触发 */
  selectionChange: [rows: Record<string, unknown>[]];
  /** 点击列设置表头图标（editColumn 列） */
  editColumn: [];
}
