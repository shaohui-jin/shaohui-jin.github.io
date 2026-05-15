import type { App } from "vue";
import {
  BaseTable,
  BaseSearch,
  BaseSearchDrawer,
  BaseColumnSetting,
  EmptyPlaceholder,
  HelloButton,
  SearchBar,
  StatusDot,
  StatusTag,
  TextLink,
} from "./components";

export {
  BaseTable,
  BaseSearch,
  BaseSearchDrawer,
  BaseColumnSetting,
  EmptyPlaceholder,
  HelloButton,
  SearchBar,
  StatusDot,
  StatusTag,
  TextLink,
};

export type { HelloButtonProps } from "./components/hello-button/types";
export type { EmptyPlaceholderProps } from "./components/empty-placeholder/types";
export type { SearchBarProps, SearchBarEmits } from "./components/search-bar/types";
export type { StatusDotProps } from "./components/status-dot/types";
export type { StatusTagProps, StatusTagType } from "./components/status-tag/types";
export type { TextLinkProps, TextLinkEmits } from "./components/text-link/types";
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
  BaseSearchDrawerProps,
  BaseSearchDrawerEmits,
} from "./components/crud/base-search-drawer/types";
export type {
  BaseColumnSettingColumn,
  BaseColumnSettingProps,
  BaseColumnSettingEmits,
} from "./components/crud/base-column-setting/types";
export { tableLayoutDefaults } from "./components/crud/base-table/theme/tableSurface";
export { columnDefaults, normalizeColumns } from "./components/crud/base-table/utils/column";

const components = [
  HelloButton,
  StatusDot,
  StatusTag,
  EmptyPlaceholder,
  TextLink,
  SearchBar,
  BaseTable,
  BaseSearch,
  BaseSearchDrawer,
  BaseColumnSetting,
];

export default {
  install(app: App) {
    components.forEach((c) => {
      app.component(c.name ?? "AnonymousComponent", c);
    });
  },
};
