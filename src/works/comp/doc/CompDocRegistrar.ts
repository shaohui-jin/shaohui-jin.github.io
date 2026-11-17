import { BaseRouteRegistrar } from "@/app/core";
import type { RouteComponentLoader, RouteGroupMeta, RouteRecord } from "@/app/core";
import { WORKS_TAB } from "@/route/worksTab";

const docGroups: RouteGroupMeta[] = [
  { tabKey: WORKS_TAB.key, key: "crud", title: "组件 · CRUD", accent: "#e6a23c", order: 10 },
  { tabKey: WORKS_TAB.key, key: "status", title: "组件 · 状态标记", accent: "#909399", order: 20 },
  { tabKey: WORKS_TAB.key, key: "image", title: "组件 · 图片", accent: "#409eff", order: 30 },
  { tabKey: WORKS_TAB.key, key: "doc", title: "组件 · 文档", accent: "#626aef", order: 40 },
  { tabKey: WORKS_TAB.key, key: "canvas", title: "组件 · Canvas", accent: "#f56c6c", order: 50 },
  { tabKey: WORKS_TAB.key, key: "layout", title: "组件 · 布局", accent: "#00bcd4", order: 60 },
  { tabKey: WORKS_TAB.key, key: "list-op", title: "组件 · 列表操作", accent: "#ff9800", order: 70 },
  { tabKey: WORKS_TAB.key, key: "select", title: "组件 · 选择", accent: "#9c27b0", order: 80 },
  { tabKey: WORKS_TAB.key, key: "flow", title: "组件 · 流程", accent: "#3f51b5", order: 90 },
  { tabKey: WORKS_TAB.key, key: "menu", title: "组件 · 菜单", accent: "#795548", order: 100 },
  { tabKey: WORKS_TAB.key, key: "viz", title: "组件 · 数据可视化", accent: "#009688", order: 110 },
  {
    tabKey: WORKS_TAB.key,
    key: "interaction-preview",
    title: "组件 · 交互预览",
    accent: "#607d8b",
    order: 120,
  },
];

const docLoaders: Record<string, RouteComponentLoader> = {
  tables: () => import("./demo/base-table/DemoBaseTable.vue"),
  "base-search": () => import("./demo/base-search/DemoBaseSearch.vue"),
  "base-search-field": () => import("./demo/base-search-field/DemoBaseSearchField.vue"),
  "base-search-drawer": () => import("./demo/base-search-drawer/DemoBaseSearchDrawer.vue"),
  "base-column-setting": () => import("./demo/base-column-setting/DemoBaseColumnSetting.vue"),
  "base-crud": () => import("./demo/base-crud/DemoBaseCrud.vue"),
  tag: () => import("./demo/tag/DemoTag.vue"),
  dot: () => import("./demo/dot/DemoDot.vue"),
  "image-3d": () => import("./demo/image-3d/DemoImage3D.vue"),
  "image-carousel": () => import("./demo/image-carousel/DemoImageCarousel.vue"),
  "image-pointer": () => import("./demo/image-pointer/DemoImagePointer.vue"),
  "image-lightbox": () => import("./demo/image-lightbox/DemoImageLightbox.vue"),
  "code-block": () => import("./demo/code-block/DemoCodeBlock.vue"),
  "widget-tabs": () => import("./demo/widget-tabs/DemoWidgetTabs.vue"),
  "canvas-time": () => import("./demo/canvas-time/DemoCanvasTime.vue"),
  "canvas-count-up": () => import("./demo/canvas-count-up/DemoCanvasCountUp.vue"),
  "split-pane": () => import("./demo/split-pane/DemoSplitPane.vue"),
  "drag-sort-list": () => import("./demo/drag-sort-list/DemoDragSortList.vue"),
  "floating-toolbar": () => import("./demo/floating-toolbar/DemoFloatingToolbar.vue"),
  "tree-transfer": () => import("./demo/tree-transfer/DemoTreeTransfer.vue"),
  "step-wizard": () => import("./demo/step-wizard/DemoStepWizard.vue"),
  "context-menu": () => import("./demo/context-menu/DemoContextMenu.vue"),
  "heatmap-calendar": () => import("./demo/heatmap-calendar/DemoHeatmapCalendar.vue"),
  "interaction-preview": () => import("./demo/interaction/DemoInteraction.vue"),
};

const docRouteMeta: Omit<RouteRecord, "tabKey" | "loader">[] = [
  { key: "tables", label: "BaseTable", groupKey: "crud", tag: "表格", order: 10 },
  { key: "base-search", label: "BaseSearch", groupKey: "crud", tag: "搜索", order: 20 },
  { key: "base-search-field", label: "BaseSearchField", groupKey: "crud", tag: "字段", order: 30 },
  {
    key: "base-search-drawer",
    label: "BaseSearchDrawer",
    groupKey: "crud",
    tag: "抽屉",
    order: 40,
  },
  {
    key: "base-column-setting",
    label: "BaseColumnSetting",
    groupKey: "crud",
    tag: "列设置",
    order: 50,
  },
  { key: "base-crud", label: "BaseCrud", groupKey: "crud", tag: "联动", order: 60 },
  { key: "tag", label: "Tag", groupKey: "status", tag: "状态标记", order: 70 },
  { key: "dot", label: "Dot", groupKey: "status", tag: "状态标记", order: 80 },
  { key: "image-3d", label: "Image3D", groupKey: "image", tag: "图片", order: 90 },
  { key: "image-carousel", label: "ImageCarousel", groupKey: "image", tag: "图片", order: 100 },
  { key: "image-pointer", label: "ImagePointer", groupKey: "image", tag: "图片", order: 110 },
  { key: "image-lightbox", label: "ImageLightbox", groupKey: "image", tag: "图片", order: 120 },
  { key: "code-block", label: "CodeBlock", groupKey: "doc", tag: "文档", order: 130 },
  { key: "widget-tabs", label: "WidgetTabs", groupKey: "doc", tag: "文档", order: 140 },
  { key: "canvas-time", label: "CanvasTime", groupKey: "canvas", tag: "Canvas", order: 150 },
  { key: "canvas-count-up", label: "CanvasCountUp", groupKey: "canvas", tag: "Canvas", order: 160 },
  { key: "split-pane", label: "SplitPane", groupKey: "layout", tag: "布局", order: 170 },
  {
    key: "drag-sort-list",
    label: "DragSortList",
    groupKey: "list-op",
    tag: "列表操作",
    order: 180,
  },
  {
    key: "floating-toolbar",
    label: "FloatingToolbar",
    groupKey: "list-op",
    tag: "列表操作",
    order: 190,
  },
  { key: "tree-transfer", label: "TreeTransfer", groupKey: "select", tag: "选择", order: 200 },
  { key: "step-wizard", label: "StepWizard", groupKey: "flow", tag: "流程", order: 210 },
  { key: "context-menu", label: "ContextMenu", groupKey: "menu", tag: "菜单", order: 220 },
  {
    key: "heatmap-calendar",
    label: "HeatmapCalendar",
    groupKey: "viz",
    tag: "数据可视化",
    order: 230,
  },
  {
    key: "interaction-preview",
    label: "InteractionPreview",
    groupKey: "interaction-preview",
    tag: "预览",
    order: 240,
  },
];

export class CompDocRegistrar extends BaseRouteRegistrar {
  readonly source = "jsh-comp";

  register(registry: import("@/app/core").RouteRegistry): void {
    this.registerTopTabs(registry, [WORKS_TAB]);
    this.registerGroups(registry, docGroups);
    this.registerRoutes(
      registry,
      docRouteMeta.map((item) => ({
        ...item,
        key: `components/${item.key}`,
        tabKey: WORKS_TAB.key,
        loader: docLoaders[item.key],
      })),
    );
  }
}
