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
  /**
   * 不在顶部导航中展示，但路由仍然可访问。
   * 用于「主题配置 / 变更记录」这类从右上角入口进入的页面。
   */
  hidden?: boolean;
}

export interface RouteGroupMeta {
  tabKey: string;
  key: string;
  title: string;
  accent?: string;
  order?: number;
  /** 有值时挂到该分组下面，侧栏再套一层 */
  parentKey?: string;
}

export interface RouteRecord {
  key: string;
  tabKey: string;
  label: string;
  loader?: RouteComponentLoader;
  renderMode?: RouteRenderMode;
  markdownSource?: string;
  markdownLoader?: () => Promise<string>;
  markdownFileName?: string;
  props?: Record<string, unknown>;
  groupKey?: string;
  /** 同一 groupKey 只在第一条写，注册时用来生成分组标题 */
  groupTitle?: string;
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
