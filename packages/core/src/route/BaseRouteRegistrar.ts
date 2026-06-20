import type { RouteGroupMeta, RouteRecord, TopTabMeta } from "./types";
import type { RouteRegistry } from "./RouteRegistry";

/**
 * 子项目路由注册父类。
 * 每个需要向壳应用暴露页面的包，都通过继承该类注册路由信息。
 */
export abstract class BaseRouteRegistrar {
  abstract readonly source: string;

  abstract register(registry: RouteRegistry): void;

  protected registerTopTabs(registry: RouteRegistry, tabs: TopTabMeta[]): void {
    tabs.forEach((tab) => registry.registerTopTab(tab));
  }

  protected registerGroups(registry: RouteRegistry, groups: RouteGroupMeta[]): void {
    groups.forEach((group) => registry.registerGroup(group));
  }

  protected registerRoutes(registry: RouteRegistry, routes: RouteRecord[]): void {
    routes.forEach((route) => registry.registerRoute(route, this.source));
  }
}
