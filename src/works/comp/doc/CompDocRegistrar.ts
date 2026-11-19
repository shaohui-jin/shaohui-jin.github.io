import { BaseRouteRegistrar } from "@/app/core";
import type { RouteComponentLoader, RouteRecord } from "@/app/core";
import { childGroups, WORKS_TAB } from "@/route/worksTab";

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
  {
    key: "tables",
    label: "BaseTable",
    groupKey: "crud",
    groupTitle: "CRUD",
    tag: "表格",
    order: 10,
  },
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
  {
    key: "tag",
    label: "Tag",
    groupKey: "status",
    groupTitle: "状态标记",
    tag: "状态标记",
    order: 70,
  },
  { key: "dot", label: "Dot", groupKey: "status", tag: "状态标记", order: 80 },
  {
    key: "image-3d",
    label: "Image3D",
    groupKey: "image",
    groupTitle: "图片",
    tag: "图片",
    order: 90,
  },
  { key: "image-carousel", label: "ImageCarousel", groupKey: "image", tag: "图片", order: 100 },
  { key: "image-pointer", label: "ImagePointer", groupKey: "image", tag: "图片", order: 110 },
  { key: "image-lightbox", label: "ImageLightbox", groupKey: "image", tag: "图片", order: 120 },
  {
    key: "code-block",
    label: "CodeBlock",
    groupKey: "doc",
    groupTitle: "文档",
    tag: "文档",
    order: 130,
  },
  { key: "widget-tabs", label: "WidgetTabs", groupKey: "doc", tag: "文档", order: 140 },
  {
    key: "canvas-time",
    label: "CanvasTime",
    groupKey: "canvas",
    groupTitle: "Canvas",
    tag: "Canvas",
    order: 150,
  },
  { key: "canvas-count-up", label: "CanvasCountUp", groupKey: "canvas", tag: "Canvas", order: 160 },
  {
    key: "split-pane",
    label: "SplitPane",
    groupKey: "layout",
    groupTitle: "布局",
    tag: "布局",
    order: 170,
  },
  {
    key: "drag-sort-list",
    label: "DragSortList",
    groupKey: "list-op",
    groupTitle: "列表操作",
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
  {
    key: "tree-transfer",
    label: "TreeTransfer",
    groupKey: "select",
    groupTitle: "选择",
    tag: "选择",
    order: 200,
  },
  {
    key: "step-wizard",
    label: "StepWizard",
    groupKey: "flow",
    groupTitle: "流程",
    tag: "流程",
    order: 210,
  },
  {
    key: "context-menu",
    label: "ContextMenu",
    groupKey: "menu",
    groupTitle: "菜单",
    tag: "菜单",
    order: 220,
  },
  {
    key: "heatmap-calendar",
    label: "HeatmapCalendar",
    groupKey: "viz",
    groupTitle: "数据可视化",
    tag: "数据可视化",
    order: 230,
  },
  {
    key: "interaction-preview",
    label: "InteractionPreview",
    groupKey: "interaction-preview",
    groupTitle: "交互预览",
    tag: "预览",
    order: 240,
  },
];

export class CompDocRegistrar extends BaseRouteRegistrar {
  readonly source = "jsh-comp";

  register(registry: import("@/app/core").RouteRegistry): void {
    this.registerTopTabs(registry, [WORKS_TAB]);
    this.registerGroups(registry, [
      { tabKey: WORKS_TAB.key, key: "components", title: "组件", accent: "#409eff", order: 10 },
      ...childGroups(docRouteMeta, "components"),
    ]);
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
