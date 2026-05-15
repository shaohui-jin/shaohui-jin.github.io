/**
 * 搜索字段类型
 */
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
