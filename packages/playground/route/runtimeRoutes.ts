import { RouteRegistry } from "jsh-core";
import type { RouteGroupMeta, TopTabMeta } from "jsh-core";
import { defineAsyncComponent } from "vue";
import type { Component } from "vue";
import MarkdownRoutePage from "../doc-render/MarkdownRoutePage.vue";
import { createModuleRegistrars } from "./moduleRegistrars";

export interface RouteViewItem {
  key: string;
  label: string;
  tag?: string;
  groupKey?: string;
  component: Component;
  props?: Record<string, unknown>;
}

export interface RouteViewGroup extends RouteGroupMeta {
  items: RouteViewItem[];
}

export interface PlaygroundNavigation {
  /** 全量模块（含 hidden），用于按 key 解析路由 */
  topTabs: TopTabMeta[];
  /** 参与导航渲染的模块（已过滤 hidden） */
  navTabs: TopTabMeta[];
  tabRoutes: Record<string, RouteViewItem[]>;
  tabGroups: Record<string, RouteViewGroup[]>;
  initialTabKey: string;
  initialRouteByTab: Record<string, string>;
}

const registry = new RouteRegistry();
registry.applyRegistrars(createModuleRegistrars());
const snapshot = registry.snapshot();

const tabRoutes: Record<string, RouteViewItem[]> = {};
const tabGroups: Record<string, RouteViewGroup[]> = {};
const initialRouteByTab: Record<string, string> = {};

for (const tab of snapshot.topTabs) {
  const routes = snapshot.tabRoutes[tab.key] ?? [];
  const views = routes.map<RouteViewItem>((route) => {
    const isMarkdownRoute = route.renderMode === "markdown" || Boolean(route.markdownSource);
    return {
      key: route.key,
      label: route.label,
      tag: route.tag,
      groupKey: route.groupKey,
      component: isMarkdownRoute ? MarkdownRoutePage : defineAsyncComponent(route.loader!),
      props: isMarkdownRoute
        ? {
            source: route.markdownSource,
            fileName: route.markdownFileName,
            ...route.props,
          }
        : route.props,
    };
  });

  tabRoutes[tab.key] = views;
  const viewMap = new Map(views.map((item) => [item.key, item]));

  const groups = (snapshot.tabGroups[tab.key] ?? [])
    .map<RouteViewGroup>((group) => ({
      ...group,
      items: group.items
        .map((item) => viewMap.get(item.key))
        .filter((item): item is RouteViewItem => Boolean(item)),
    }))
    .filter((group) => group.items.length > 0);

  tabGroups[tab.key] = groups;
  initialRouteByTab[tab.key] = groups[0]?.items[0]?.key ?? views[0]?.key ?? "";
}

/**
 * 顶部导航实际渲染的模块。
 *
 * `system` 这类 hidden tab 只是从导航里藏起来，路由本身仍然可用，
 * 由首页右上角的主题 / 日志入口或「打开完整配置」进入。
 */
const navTabs = snapshot.topTabs.filter((tab) => !tab.hidden);

export const playgroundNavigation: PlaygroundNavigation = {
  topTabs: snapshot.topTabs,
  navTabs,
  tabRoutes,
  tabGroups,
  initialTabKey: navTabs[0]?.key ?? snapshot.topTabs[0]?.key ?? "",
  initialRouteByTab,
};

export function resolveRouteView(tabKey: string, routeKey: string): RouteViewItem | undefined {
  return playgroundNavigation.tabRoutes[tabKey]?.find((item) => item.key === routeKey);
}

export function resolveTabMeta(tabKey: string): TopTabMeta | undefined {
  return playgroundNavigation.topTabs.find((tab) => tab.key === tabKey);
}
