/**
 * API 文档中「仅类型名、无可读字面量」的类型说明
 * 所有 Demo 页通过 ApiTable 统一读取
 */

export interface ApiTypeHintInfo {
  title?: string;
  /** 枚举可选值，横向展示 */
  values?: string[];
  /** 结构说明（单行展示） */
  desc?: string;
  valueDesc?: Record<string, string>;
}

const TYPE_HINTS: Record<string, ApiTypeHintInfo> = {
  BaseSearchFieldType: {
    title: "可选值",
    values: [
      "input",
      "textarea",
      "select",
      "date",
      "daterange",
      "datetime",
      "datetimerange",
      "cascader",
      "tree-select",
      "radio-group",
    ],
    desc: "默认 input",
  },
  BaseSearchField: {
    title: "说明",
    desc: "搜索字段配置对象，完整字段见 BaseSearchField 文档「field 配置项」",
  },
  BaseSearchFieldOption: {
    title: "说明",
    desc: "{ name: string, value: string | number | boolean }",
  },
  "{ name, value }[]": {
    title: "说明",
    desc: "选项数组，项结构同 BaseSearchFieldOption",
  },
  "Record<string, BaseSearchFieldOption[]>": {
    title: "说明",
    desc: "key 为字段 key，value 为 BaseSearchFieldOption[]",
  },
  BaseTableMode: {
    title: "可选值",
    values: ["element", "virtual", "canvas", "canvas-tile", "skia-wasm"],
    valueDesc: {
      element: "el-table",
      virtual: "虚拟滚动",
      canvas: "Canvas 2D",
      "canvas-tile": "Canvas 预渲染",
      "skia-wasm": "Skia WASM",
    },
  },
  BaseTableColumn: {
    title: "说明",
    desc: "列配置对象，完整字段见 BaseTable 文档「列配置」",
  },
  BaseTableColumnType: {
    title: "可选值",
    values: [
      "default",
      "index",
      "selection",
      "formatter",
      "switch",
      "image",
      "status",
      "status-custom",
      "tableSlot",
    ],
    desc: "canvas 系模式仅文本展示",
  },
  BaseColumnSettingColumn: {
    title: "说明",
    desc: "继承 BaseTableColumn，新增 fixed?: 'left' | 'right'",
  },
  DragSortItem: {
    title: "说明",
    desc: "{ id: string | number, label: string }",
  },
  TreeTransferNode: {
    title: "说明",
    desc: "{ id: string, label: string, children?: TreeTransferNode[] }",
  },
  StepWizardStep: {
    title: "说明",
    desc: "{ title: string, description?: string }",
  },
  ContextMenuItem: {
    title: "说明",
    desc: "{ label: string, shortcut?: string, danger?: boolean, action?: string }",
  },
  HeatmapCell: {
    title: "说明",
    desc: "{ date: string, count: number }",
  },
};

function normalizeTypeKey(type: string): string {
  const trimmed = type.trim();
  // 从事件参数 (name: TypeName) 中提取类型名
  const paramMatch = trimmed.match(/:\s*([A-Za-z][\w]*(?:\[\])?)/);
  if (paramMatch) {
    return paramMatch[1].replace(/\[\]$/, "");
  }
  return trimmed
    .replace(/\[\]$/, "")
    .split("|")[0]
    .trim();
}

/** 类型字符串已包含字面量联合时，无需提示 */
export function shouldShowTypeHint(type: string): boolean {
  if (type.trim() === "—") return false;
  if (/"[^"]+"/.test(type)) return false;
  return !!getApiTypeHint(type);
}

export function getApiTypeHint(type: string): ApiTypeHintInfo | undefined {
  const trimmed = type.trim();
  if (TYPE_HINTS[trimmed]) return TYPE_HINTS[trimmed];
  return TYPE_HINTS[normalizeTypeKey(trimmed)];
}

/** 格式化为单行文本 */
export function formatApiTypeHint(info: ApiTypeHintInfo): string {
  if (info.values?.length) {
    const items = info.values.map((value) => {
      const extra = info.valueDesc?.[value];
      return extra ? `${value}（${extra}）` : value;
    });
    const line = items.join(" · ");
    return info.desc ? `${line}；${info.desc}` : line;
  }
  return info.desc ?? "";
}
