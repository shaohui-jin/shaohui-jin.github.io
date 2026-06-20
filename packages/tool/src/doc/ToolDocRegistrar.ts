import { BaseRouteRegistrar } from "jsh-core";
import type { RouteComponentLoader, RouteGroupMeta, RouteRecord, TopTabMeta } from "jsh-core";

const utilsTopTab: TopTabMeta = {
  key: "utils",
  label: "工具函数",
  mode: "menu",
  order: 20,
};

const toolGroups: RouteGroupMeta[] = [
  { tabKey: "utils", key: "color", title: "颜色工具", accent: "#409eff", order: 10 },
  { tabKey: "utils", key: "number", title: "数字工具", accent: "#67c23a", order: 20 },
  { tabKey: "utils", key: "object", title: "对象工具", accent: "#e6a23c", order: 30 },
  { tabKey: "utils", key: "array", title: "数组工具", accent: "#f56c6c", order: 40 },
  { tabKey: "utils", key: "clipboard", title: "剪贴板", accent: "#9c27b0", order: 50 },
  { tabKey: "utils", key: "debounce-group", title: "防抖", accent: "#00bcd4", order: 60 },
  { tabKey: "utils", key: "optimize", title: "性能优化", accent: "#ff9800", order: 70 },
  { tabKey: "utils", key: "permission", title: "权限管理", accent: "#795548", order: 80 },
  { tabKey: "utils", key: "typescript", title: "类型体操", accent: "#3f51b5", order: 90 },
];

const utilRouteMeta: Omit<RouteRecord, "tabKey" | "loader" | "props">[] = [
  { key: "rgbaToHex", label: "rgbaToHex", groupKey: "color", tag: "rgba转hex", order: 10 },
  { key: "hexToRGBA", label: "hexToRGBA", groupKey: "color", tag: "hex转rgba", order: 20 },
  { key: "colorToRGBA", label: "colorToRGBA", groupKey: "color", tag: "hex转对象", order: 30 },
  { key: "getRandom", label: "getRandom", groupKey: "number", tag: "随机整数", order: 40 },
  { key: "scaleFormat", label: "scaleFormat", groupKey: "number", tag: "精度格式化", order: 50 },
  { key: "flattenObj", label: "flattenObj", groupKey: "object", tag: "扁平化", order: 60 },
  { key: "unFlatten", label: "unFlatten", groupKey: "object", tag: "还原嵌套", order: 70 },
  { key: "isObjEqual", label: "isObjEqual", groupKey: "object", tag: "深度比较", order: 80 },
  { key: "isObjEmpty", label: "isObjEmpty", groupKey: "object", tag: "判空", order: 90 },
  { key: "flattenTree", label: "flattenTree", groupKey: "array", tag: "树形展开", order: 100 },
  { key: "isArrEqual", label: "isArrEqual", groupKey: "array", tag: "无序比较", order: 110 },
  { key: "copyToClipboard", label: "copyToClipboard", groupKey: "clipboard", tag: "复制文本", order: 120 },
  { key: "debounce", label: "debounce", groupKey: "debounce-group", tag: "延迟执行", order: 130 },
  { key: "useDebounceRef", label: "useDebounceRef", groupKey: "debounce-group", tag: "防抖ref", order: 140 },
  { key: "performChunk", label: "performChunk", groupKey: "optimize", tag: "分片执行", order: 150 },
  { key: "concurRequest", label: "concurRequest", groupKey: "optimize", tag: "并发控制", order: 160 },
  { key: "usePermission", label: "usePermission", groupKey: "permission", tag: "位运算权限", order: 170 },
  { key: "getValue", label: "getValue", groupKey: "typescript", tag: "getter映射", order: 180 },
  { key: "setValue", label: "setValue", groupKey: "typescript", tag: "setter映射", order: 190 },
  { key: "getOptional", label: "getOptional", groupKey: "typescript", tag: "提取可选", order: 200 },
  { key: "setOptional", label: "setOptional", groupKey: "typescript", tag: "设为可选", order: 210 },
  { key: "arrayToUnion", label: "arrayToUnion", groupKey: "typescript", tag: "数组转联合", order: 220 },
  { key: "getCompType", label: "getCompType", groupKey: "typescript", tag: "组件ref类型", order: 230 },
];

const toolDocLoaders: Record<string, RouteComponentLoader> = {
  rgbaToHex: () => import("./demo/rgbaToHex/DemoRgbaToHex.vue"),
  hexToRGBA: () => import("./demo/hexToRGBA/DemoHexToRGBA.vue"),
  colorToRGBA: () => import("./demo/colorToRGBA/DemoColorToRGBA.vue"),
  getRandom: () => import("./demo/getRandom/DemoGetRandom.vue"),
  scaleFormat: () => import("./demo/scaleFormat/DemoScaleFormat.vue"),
  flattenObj: () => import("./demo/flattenObj/DemoFlattenObj.vue"),
  unFlatten: () => import("./demo/unFlatten/DemoUnFlatten.vue"),
  isObjEqual: () => import("./demo/isObjEqual/DemoIsObjEqual.vue"),
  isObjEmpty: () => import("./demo/isObjEmpty/DemoIsObjEmpty.vue"),
  flattenTree: () => import("./demo/flattenTree/DemoFlattenTree.vue"),
  isArrEqual: () => import("./demo/isArrEqual/DemoIsArrEqual.vue"),
  copyToClipboard: () => import("./demo/copyToClipboard/DemoCopyToClipboard.vue"),
  debounce: () => import("./demo/debounce/DemoDebounce.vue"),
  useDebounceRef: () => import("./demo/useDebounceRef/DemoUseDebounceRef.vue"),
  performChunk: () => import("./demo/performChunk/DemoPerformChunk.vue"),
  concurRequest: () => import("./demo/concurRequest/DemoConcurRequest.vue"),
  usePermission: () => import("./demo/usePermission/DemoUsePermission.vue"),
  getValue: () => import("./demo/getValue/DemoGetValue.vue"),
  setValue: () => import("./demo/setValue/DemoSetValue.vue"),
  getOptional: () => import("./demo/getOptional/DemoGetOptional.vue"),
  setOptional: () => import("./demo/setOptional/DemoSetOptional.vue"),
  arrayToUnion: () => import("./demo/arrayToUnion/DemoArrayToUnion.vue"),
  getCompType: () => import("./demo/getCompType/DemoGetCompType.vue"),
};

export class ToolDocRegistrar extends BaseRouteRegistrar {
  readonly source = "jsh-tool";

  register(registry: import("jsh-core").RouteRegistry): void {
    this.registerTopTabs(registry, [utilsTopTab]);
    this.registerGroups(registry, toolGroups);
    this.registerRoutes(
      registry,
      utilRouteMeta.map((item) => ({
        ...item,
        tabKey: "utils",
        loader: toolDocLoaders[item.key],
      })),
    );
  }
}
