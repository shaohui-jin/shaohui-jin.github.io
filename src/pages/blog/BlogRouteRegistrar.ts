import { BaseRouteRegistrar } from "@/app/core";
import type { TopTabMeta } from "@/app/core";
import { blogDocConfigs, blogGroups } from "../../content";

const blogTopTab: TopTabMeta = {
  key: "blog",
  label: "博客",
  mode: "menu",
  order: 10,
  description: "历史博客内容",
};

export class BlogRouteRegistrar extends BaseRouteRegistrar {
  readonly source = "jsh-blog";

  register(registry: import("@/app/core").RouteRegistry): void {
    this.registerTopTabs(registry, [blogTopTab]);
    this.registerGroups(
      registry,
      blogGroups.map((group) => ({
        tabKey: "blog",
        key: group.key,
        title: group.title,
        accent: group.accent,
        order: group.order,
      })),
    );
    this.registerRoutes(registry, [
      ...blogDocConfigs.map((doc) => ({
        key: doc.key,
        tabKey: "blog",
        groupKey: doc.groupKey,
        label: doc.label,
        tag: doc.category,
        order: doc.order,
        renderMode: "markdown" as const,
        markdownSource: doc.source,
        markdownFileName: doc.fileName,
      })),
    ]);
  }
}
