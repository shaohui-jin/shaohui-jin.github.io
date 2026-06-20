import type { App } from "vue";
import {
  BaseTable,
  BaseSearch,
  BaseSearchField,
  BaseSearchDrawer,
  BaseColumnSetting,
  BaseCrud,
  Dot,
  Tag,
  Image3D,
  ImageCarousel,
  ImagePointer,
  ImageLightbox,
  CodeBlock,
  WidgetTabs,
  SplitPane,
  DragSortList,
  FloatingToolbar,
  TreeTransfer,
  StepWizard,
  ContextMenu,
  CanvasTime,
  CanvasCountUp,
  HeatmapCalendar,
} from "@/component";
import { createCompLib } from "jsh-core";

export {
  BaseTable,
  BaseSearch,
  BaseSearchField,
  BaseSearchDrawer,
  BaseColumnSetting,
  BaseCrud,
  Dot,
  Tag,
  Image3D,
  ImageCarousel,
  ImagePointer,
  ImageLightbox,
  CodeBlock,
  WidgetTabs,
  SplitPane,
  DragSortList,
  FloatingToolbar,
  TreeTransfer,
  StepWizard,
  ContextMenu,
  CanvasTime,
  CanvasCountUp,
  HeatmapCalendar,
};

// 配置系统（来自 jsh-core）
export {
  createCompLib,
  ConfigProvider,
  elementPlusLocale,
  useLibConfig,
  defaultLibConfig,
} from "jsh-core";
export type {
  LibConfig,
  LibThemeConfig,
  ResolvedLibConfig,
  PersistOptions,
} from "jsh-core";

export type {
  DotProps,
  TagProps,
  TagType,
  Image3DProps,
  ImageCarouselProps,
  ImagePointerProps,
  ImagePointerEmits,
  ImageLightboxProps,
  CodeBlockProps,
  WidgetTabsProps,
} from "@/type/basic";
export type {
  BaseTableColumn,
  BaseTableColumnType,
  BaseTableMode,
  BaseTableProps,
  BaseTableEmits,
  BaseSearchField as SearchFieldConfig,
  BaseSearchFieldType,
  BaseSearchFieldOption,
  BaseSearchProps,
  BaseSearchEmits,
  BaseSearchFieldProps,
  BaseSearchFieldEmits,
  BaseSearchDrawerProps,
  BaseSearchDrawerEmits,
  BaseColumnSettingColumn,
  BaseColumnSettingProps,
  BaseColumnSettingEmits,
  BaseCrudProps,
  BaseCrudEmits,
} from "@/type/crud";
export type {
  SplitPaneProps,
  DragSortListProps,
  DragSortItem,
  FloatingToolbarProps,
  TreeTransferProps,
  TreeTransferNode,
  StepWizardProps,
  StepWizardStep,
  ContextMenuProps,
  ContextMenuItem,
  CanvasTimeProps,
  CanvasCountUpProps,
  HeatmapCalendarProps,
  HeatmapCell,
} from "@/type/interaction";
/** @deprecated 使用 createCompLib 配置代替 */
export {
  tableLayoutDefaults,
  tableSurfaceConfig,
} from "@/component/crud/base-table/theme/tableSurface";
export { columnDefaults, normalizeColumns, withEditColumn, stripEditColumn } from "@/component/crud/base-table/utils/column";

const components = [
  Dot,
  Tag,
  Image3D,
  ImageCarousel,
  ImagePointer,
  ImageLightbox,
  CodeBlock,
  WidgetTabs,
  SplitPane,
  DragSortList,
  FloatingToolbar,
  TreeTransfer,
  StepWizard,
  ContextMenu,
  CanvasTime,
  CanvasCountUp,
  HeatmapCalendar,
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
