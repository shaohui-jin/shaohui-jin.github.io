import { BaseRouteRegistrar } from "@/app/core";
import type { RouteRegistry, TopTabMeta } from "@/app/core";

/**
 * 作品页。
 *
 * 只做个人项目的介绍和跳转，不再承载组件 / 工具 / 画布的站内文档，
 * 那些内容各自有独立仓库和文档站。
 */
const worksTopTab: TopTabMeta = {
  key: "works",
  label: "作品",
  mode: "single",
  order: 20,
  description: "个人项目",
};

export class WorksRouteRegistrar extends BaseRouteRegistrar {
  readonly source = "playground-works";

  register(registry: RouteRegistry): void {
    this.registerTopTabs(registry, [worksTopTab]);
    this.registerRoutes(registry, [
      {
        key: "works",
        tabKey: "works",
        label: "作品",
        order: 10,
        loader: () => import("./WorksPage.vue"),
      },
    ]);
  }
}
