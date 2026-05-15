import type { BaseSearchField, BaseSearchFieldOption } from "../base-search/types";

export type { BaseSearchField, BaseSearchFieldOption };

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
