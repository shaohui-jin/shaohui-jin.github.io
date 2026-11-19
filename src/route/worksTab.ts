import type { TopTabMeta } from "@/app/core";

/** 组件、工具、画布共用的顶栏。三个注册器都登记这一条，后写的字段与先写的相同。 */
export const WORKS_TAB: TopTabMeta = {
  key: "works",
  label: "作品",
  mode: "menu",
  order: 20,
  description: "组件、工具和画布",
};
