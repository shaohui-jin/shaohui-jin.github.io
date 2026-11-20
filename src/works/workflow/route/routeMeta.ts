import { WORKS_TAB } from "@/route/worksTab";
import type { RouteGroupMeta, RouteRecord } from "@/app/core";

/**
 * 画布路由的共享元数据。
 *
 * 真实注册器与类型检查替身都从这里取数据，避免两处手写导致 label/tag/分组漂移。
 */
export const workflowGroups: RouteGroupMeta[] = [
  {
    tabKey: WORKS_TAB.key,
    key: "workflow",
    title: "画布",
    accent: "#3f51b5",
    order: 300,
  },
];

export function workflowRoute(loader: RouteRecord["loader"]): RouteRecord {
  return {
    key: "workflow",
    tabKey: WORKS_TAB.key,
    groupKey: "workflow",
    label: "画布编排",
    tag: "流程",
    order: 10,
    loader,
  };
}
