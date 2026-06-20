import { BaseRouteRegistrar } from "./BaseRouteRegistrar";
import type {
  RegisteredRouteRecord,
  RouteGroupMeta,
  RouteGroupSnapshot,
  RouteRecord,
  RouteRegistrySnapshot,
  TopTabMeta,
} from "./types";

function sortByOrder<T extends { order?: number; label?: string; title?: string; key: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    const ao = a.order ?? Number.MAX_SAFE_INTEGER;
    const bo = b.order ?? Number.MAX_SAFE_INTEGER;
    if (ao !== bo) return ao - bo;
    const an = a.label ?? a.title ?? a.key;
    const bn = b.label ?? b.title ?? b.key;
    return an.localeCompare(bn);
  });
}

export class RouteRegistry {
  private topTabs = new Map<string, TopTabMeta>();

  private tabGroups = new Map<string, Map<string, RouteGroupMeta>>();

  private tabRoutes = new Map<string, Map<string, RegisteredRouteRecord>>();

  registerTopTab(tab: TopTabMeta): this {
    const prev = this.topTabs.get(tab.key);
    this.topTabs.set(tab.key, prev ? { ...prev, ...tab } : tab);
    return this;
  }

  registerGroup(group: RouteGroupMeta): this {
    const map = this.tabGroups.get(group.tabKey) ?? new Map<string, RouteGroupMeta>();
    const prev = map.get(group.key);
    map.set(group.key, prev ? { ...prev, ...group } : group);
    this.tabGroups.set(group.tabKey, map);
    return this;
  }

  registerRoute(route: RouteRecord, source: string): this {
    const renderMode = route.renderMode ?? (route.markdownSource ? "markdown" : "component");
    if (renderMode === "component" && !route.loader) {
      throw new Error(`[RouteRegistry] route "${route.key}" must provide loader in component mode`);
    }
    if (renderMode === "markdown" && !route.markdownSource) {
      throw new Error(`[RouteRegistry] route "${route.key}" must provide markdownSource in markdown mode`);
    }

    const map = this.tabRoutes.get(route.tabKey) ?? new Map<string, RegisteredRouteRecord>();
    if (map.has(route.key)) {
      const hit = map.get(route.key);
      throw new Error(
        `[RouteRegistry] duplicated route key "${route.key}" under tab "${route.tabKey}"` +
          `, from "${hit?.source}" and "${source}"`,
      );
    }

    map.set(route.key, { ...route, renderMode, source });
    this.tabRoutes.set(route.tabKey, map);

    if (!this.topTabs.has(route.tabKey)) {
      this.registerTopTab({
        key: route.tabKey,
        label: route.tabKey,
        mode: route.groupKey ? "menu" : "single",
      });
    }
    return this;
  }

  applyRegistrar(registrar: BaseRouteRegistrar): this {
    if (!(registrar instanceof BaseRouteRegistrar)) {
      const source = (registrar as { source?: string })?.source ?? "unknown";
      console.warn(
        `[RouteRegistry] skip registrar "${source}" because it does not extend BaseRouteRegistrar`,
      );
      return this;
    }
    registrar.register(this);
    return this;
  }

  applyRegistrars(registrars: BaseRouteRegistrar[]): this {
    registrars.forEach((registrar) => this.applyRegistrar(registrar));
    return this;
  }

  snapshot(): RouteRegistrySnapshot {
    const topTabs = sortByOrder(Array.from(this.topTabs.values()));
    const tabRoutes: Record<string, RegisteredRouteRecord[]> = {};
    const tabGroups: Record<string, RouteGroupSnapshot[]> = {};

    for (const tab of topTabs) {
      const routes = sortByOrder(Array.from(this.tabRoutes.get(tab.key)?.values() ?? []));
      tabRoutes[tab.key] = routes;

      const groups = sortByOrder(Array.from(this.tabGroups.get(tab.key)?.values() ?? []));
      tabGroups[tab.key] = groups.map((group) => {
        const items = sortByOrder(routes.filter((route) => route.groupKey === group.key));
        return { ...group, items };
      });
    }

    return { topTabs, tabRoutes, tabGroups };
  }
}
