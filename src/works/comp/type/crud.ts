// ============================================================
// CRUD 组件类型声明
// ============================================================

// --- BaseTable ---

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

// --- BaseSearch ---

/** 搜索字段类型 */
export type BaseSearchFieldType =
  | "input"
  | "textarea"
  | "select"
  | "date"
  | "daterange"
  | "datetime"
  | "datetimerange"
  | "cascader"
  | "tree-select"
  | "radio-group";

/** 下拉 / 单选选项 */
export interface BaseSearchFieldOption {
  name: string;
  value: string | number | boolean;
}

/** 搜索字段配置 */
export interface BaseSearchField {
  /** 表单值字段名 */
  key: string;
  /** 标签文本 */
  label: string;
  /** 标签宽度，如 '90px' */
  labelWidth?: string;
  /** 占位文本 */
  placeholder?: string;
  /** 是否固定显示（不折叠），默认 false */
  fixed?: boolean;
  /** 表单项类型，默认 'input' */
  type?: BaseSearchFieldType | (string & {});
  /** select / radio-group 的选项列表 */
  options?: BaseSearchFieldOption[];
  /** 是否可清空，默认 true */
  clearable?: boolean;
  /** 按下回车时是否触发搜索，默认 true */
  keydownSearch?: boolean;
  /** 行内样式 */
  style?: Record<string, string>;
  /** 额外透传属性 */
  [key: string]: unknown;
}

export interface BaseSearchProps {
  /** 搜索字段配置数组 */
  params: BaseSearchField[];
  /** 表单数据（v-model） */
  modelValue: Record<string, unknown>;
  /** 查询按钮加载状态 */
  loading?: boolean;
  /** 异步加载的选项（key 为字段 key，value 为选项数组） */
  paramOptions?: Record<string, BaseSearchFieldOption[]>;
}

export interface BaseSearchEmits {
  "update:modelValue": [value: Record<string, unknown>];
  /** 点击查询 */
  search: [formData: Record<string, unknown>];
  /** 点击重置 */
  reset: [];
  /** 字段值变化 */
  change: [payload: { field?: string; value: unknown; formData: Record<string, unknown> }];
}

// --- BaseSearchField ---

export interface BaseSearchFieldProps {
  /** 字段配置 */
  field: BaseSearchField;
  /** 当前值（v-model） */
  modelValue: unknown;
  /** 异步加载的选项 */
  paramOptions?: BaseSearchFieldOption[];
}

export interface BaseSearchFieldEmits {
  "update:modelValue": [value: unknown];
  change: [value: unknown];
  enter: [];
}

// --- BaseSearchDrawer ---

export interface BaseSearchDrawerProps {
  /** 搜索字段配置数组 */
  params: BaseSearchField[];
  /** 表单数据（v-model） */
  modelValue: Record<string, unknown>;
  /** 异步加载的选项 */
  paramOptions?: Record<string, BaseSearchFieldOption[]>;
  /** 抽屉标题 */
  title?: string;
  /** 抽屉宽度 */
  drawerWidth?: string;
}

export interface BaseSearchDrawerEmits {
  "update:modelValue": [value: Record<string, unknown>];
  /** 点击确定 */
  search: [formData: Record<string, unknown>];
  /** 点击取消 / 重置 */
  reset: [];
}

// --- BaseColumnSetting ---

/**
 * 列设置的列配置，扩展 BaseTableColumn 以支持冻结位置
 */
export interface BaseColumnSettingColumn extends BaseTableColumn {
  /** 列冻结位置 */
  fixed?: "left" | "right";
}

export interface BaseColumnSettingProps {
  /** 列配置数组（v-model:columns） */
  columns: BaseColumnSettingColumn[];
  /** 抽屉标题 */
  title?: string;
  /** 抽屉宽度 */
  drawerWidth?: string;
}

export interface BaseColumnSettingEmits {
  "update:columns": [columns: BaseColumnSettingColumn[]];
  /** 确认修改 */
  confirm: [columns: BaseColumnSettingColumn[]];
}

// --- BaseCrud ---

export interface BaseCrudProps {
  /** 表格渲染模式 */
  mode: BaseTableMode;
  /** 列配置（v-model:columns） */
  columns: BaseColumnSettingColumn[];
  /** 表格数据 */
  tableData: Record<string, unknown>[];
  /** 搜索表单（v-model:searchModel） */
  searchModel?: Record<string, unknown>;
  /** 搜索栏字段配置，为空时不渲染搜索栏 */
  searchParams?: BaseSearchField[];
  /** 高级筛选抽屉字段，为空时不渲染抽屉入口 */
  drawerParams?: BaseSearchField[];
  /** 查询加载状态 */
  loading?: boolean;
  /** 表格高度 */
  tableHeight?: string;
  /** 行主键字段 */
  rowKey?: string;
  /** 是否显示列设置入口 */
  showColumnSetting?: boolean;
  /** 异步选项（key 为字段 key） */
  paramOptions?: Record<string, BaseSearchFieldOption[]>;
}

export interface BaseCrudEmits {
  "update:searchModel": [value: Record<string, unknown>];
  "update:columns": [columns: BaseColumnSettingColumn[]];
  /** 点击查询或高级筛选确定 */
  search: [formData: Record<string, unknown>];
  /** 点击重置 */
  reset: [];
  /** 表格多选变化 */
  selectionChange: [rows: Record<string, unknown>[]];
  /** 列设置确认 */
  columnConfirm: [columns: BaseColumnSettingColumn[]];
}

// --- 共用 ---

/**
 * 表格类组件共用的列配置（宽松结构，便于业务扩展字段）。
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TableColumn = Record<string, any> & { key: string };
