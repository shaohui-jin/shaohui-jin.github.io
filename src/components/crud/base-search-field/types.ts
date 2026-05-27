import type { BaseSearchField, BaseSearchFieldOption } from "../base-search/types";

export type { BaseSearchField, BaseSearchFieldOption };

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
