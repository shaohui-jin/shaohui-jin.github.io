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
  topTabs: TopTabMeta[];
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
      component: isMarkdownRoute
        ? MarkdownRoutePage
        : defineAsyncComponent(route.loader!),
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

export const playgroundNavigation: PlaygroundNavigation = {
  topTabs: snapshot.topTabs,
  tabRoutes,
  tabGroups,
  initialTabKey: snapshot.topTabs[0]?.key ?? "",
  initialRouteByTab,
};

export function resolveRouteView(tabKey: string, routeKey: string): RouteViewItem | undefined {
  return playgroundNavigation.tabRoutes[tabKey]?.find((item) => item.key === routeKey);
}
