import type { BaseColumnSettingColumn } from "../base-column-setting/types";
import type { BaseSearchField, BaseSearchFieldOption } from "../base-search/types";
import type { BaseTableMode } from "../base-table/types";

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
