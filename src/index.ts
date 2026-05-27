import type { App } from "vue";
import {
  BaseTable,
  BaseSearch,
  BaseSearchField,
  BaseSearchDrawer,
  BaseColumnSetting,
  BaseCrud,
  StatusDot,
  StatusTag,
} from "./components";
import { createCompLib } from "./config/configInjection";
import ConfigProvider from "./config/ConfigProvider.vue";

export {
  BaseTable,
  BaseSearch,
  BaseSearchField,
  BaseSearchDrawer,
  BaseColumnSetting,
  BaseCrud,
  StatusDot,
  StatusTag,
};

// 配置系统
export { createCompLib, ConfigProvider };
export { elementPlusLocale } from "./config/elementPlusLocale";
export { useLibConfig } from "./config/useLibConfig";
export { defaultLibConfig } from "./config/configDefaults";
export type {
  LibConfig,
  LibThemeConfig,
  LibTableConfig,
  ResolvedLibConfig,
} from "./config/configTypes";
export type { PersistOptions } from "./config/configInjection";

export type { StatusDotProps } from "./components/basic/status-dot/types";
export type { StatusTagProps, StatusTagType } from "./components/basic/status-tag/types";
export type {
  BaseTableColumn,
  BaseTableColumnType,
  BaseTableMode,
  BaseTableProps,
  BaseTableEmits,
} from "./components/crud/base-table/types";
export type {
  BaseSearchField,
  BaseSearchFieldType,
  BaseSearchFieldOption,
  BaseSearchProps,
  BaseSearchEmits,
} from "./components/crud/base-search/types";
export type {
  BaseSearchFieldProps,
  BaseSearchFieldEmits,
} from "./components/crud/base-search-field/types";
export type {
  BaseSearchDrawerProps,
  BaseSearchDrawerEmits,
} from "./components/crud/base-search-drawer/types";
export type {
  BaseColumnSettingColumn,
  BaseColumnSettingProps,
  BaseColumnSettingEmits,
} from "./components/crud/base-column-setting/types";
export type { BaseCrudProps, BaseCrudEmits } from "./components/crud/base-crud/types";
/** @deprecated 使用 createCompLib 配置代替 */
export {
  tableLayoutDefaults,
  tableSurfaceConfig,
} from "./components/crud/base-table/theme/tableSurface";
export { columnDefaults, normalizeColumns, withEditColumn, stripEditColumn } from "./components/crud/base-table/utils/column";

const components = [
  StatusDot,
  StatusTag,
  BaseTable,
  BaseSearch,
  BaseSearchField,
  BaseSearchDrawer,
  BaseColumnSetting,
  BaseCrud,
];

/**
 * 默认插件（向后兼容），不带自定义配置。
 * 推荐使用 createCompLib() 替代。
 */
export default {
  install(app: App) {
    const lib = createCompLib();
    lib.install(app);
    components.forEach((c) => {
      app.component(c.name ?? "AnonymousComponent", c);
    });
  },
};
