import type { Component } from "vue";

export type RouteComponentModule = Component | { default: Component };
export type RouteComponentLoader = () => Promise<RouteComponentModule>;
export type RouteRenderMode = "component" | "markdown";

export interface TopTabMeta {
  key: string;
  label: string;
  mode: "menu" | "single";
  order?: number;
  description?: string;
}

export interface RouteGroupMeta {
  tabKey: string;
  key: string;
  title: string;
  accent?: string;
  order?: number;
}

export interface RouteRecord {
  key: string;
  tabKey: string;
  label: string;
  loader?: RouteComponentLoader;
  renderMode?: RouteRenderMode;
  markdownSource?: string;
  markdownFileName?: string;
  props?: Record<string, unknown>;
  groupKey?: string;
  tag?: string;
  order?: number;
  description?: string;
}

export interface RegisteredRouteRecord extends RouteRecord {
  source: string;
}

export interface RouteGroupSnapshot extends RouteGroupMeta {
  items: RegisteredRouteRecord[];
}

export interface RouteRegistrySnapshot {
  topTabs: TopTabMeta[];
  tabRoutes: Record<string, RegisteredRouteRecord[]>;
  tabGroups: Record<string, RouteGroupSnapshot[]>;
}
