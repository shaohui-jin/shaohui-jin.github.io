import { BaseRouteRegistrar } from "../route/BaseRouteRegistrar";

export class CoreDocRegistrar extends BaseRouteRegistrar {
  readonly source = "jsh-core";

  register(registry: import("../route").RouteRegistry): void {
    this.registerTopTabs(registry, [
      {
        key: "system",
        label: "系统",
        mode: "menu",
        order: 999,
      },
    ]);

    this.registerRoutes(registry, [
      {
        key: "config",
        tabKey: "system",
        label: "主题配置",
        order: 10,
        loader: () => import("./ConfigDocPage.vue"),
      },
      {
        key: "changelog",
        tabKey: "system",
        label: "变更记录",
        order: 20,
        loader: () => import("./ChangelogDocPage.vue"),
      },
    ]);
  }
}
