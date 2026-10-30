import { BaseRouteRegistrar } from "jsh-core";
import type { RouteRegistry, TopTabMeta } from "jsh-core";

/**
 * 门户首页。
 *
 * order 取 0，排在组件文档（10）之前，成为站点默认落地页 ——
 * RouteRegistry 的 sortByOrder 按 order 升序，App.vue 用
 * navTabs[0] 作为初始模块。
 *
 * 这里刻意只写常量与 loader，不 import homeData / HomePage 的任何内容，
 * 否则会形成 `runtimeRoutes → moduleRegistrars → 本文件 → homeData → runtimeRoutes`
 * 的模块环。页面数据在 HomePage.vue 内部自行引入。
 */
const homeTopTab: TopTabMeta = {
  key: "home",
  label: "首页",
  mode: "single",
  order: 0,
  description: "站点门户",
};

export class HomeRouteRegistrar extends BaseRouteRegistrar {
  readonly source = "playground-home";

  register(registry: RouteRegistry): void {
    this.registerTopTabs(registry, [homeTopTab]);
    this.registerRoutes(registry, [
      {
        key: "index",
        tabKey: "home",
        label: "首页",
        order: 10,
        loader: () => import("./HomePage.vue"),
      },
    ]);
  }
}
