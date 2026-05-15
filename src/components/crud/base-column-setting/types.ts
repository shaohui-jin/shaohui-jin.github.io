import type { BaseTableColumn } from "../base-table/types";

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
