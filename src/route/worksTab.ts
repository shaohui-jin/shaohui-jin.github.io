import type { RouteGroupMeta, TopTabMeta } from "@/app/core";

/** 组件、工具、画布共用的顶栏。三个注册器都登记这一条，后写的字段与先写的相同。 */
export const WORKS_TAB: TopTabMeta = {
  key: "works",
  label: "作品",
  mode: "menu",
  order: 20,
  description: "组件、工具和画布",
};

/** 按路由里第一次出现的 groupKey 生成子分组，标题取该组第一条的 groupTitle */
export function childGroups(
  items: Array<{ groupKey?: string; groupTitle?: string }>,
  parentKey: string,
): RouteGroupMeta[] {
  const seen = new Set<string>();
  const groups: RouteGroupMeta[] = [];
  for (const item of items) {
    if (!item.groupKey || seen.has(item.groupKey)) continue;
    seen.add(item.groupKey);
    groups.push({
      tabKey: WORKS_TAB.key,
      key: item.groupKey,
      title: item.groupTitle ?? item.groupKey,
      parentKey,
      order: groups.length * 10,
    });
  }
  return groups;
}
