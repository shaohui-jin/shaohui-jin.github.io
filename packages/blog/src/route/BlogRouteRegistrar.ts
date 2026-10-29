import { BaseRouteRegistrar } from "jsh-core";
import type { TopTabMeta } from "jsh-core";
import { blogDocConfigs, blogGroups } from "../content";

const blogTopTab: TopTabMeta = {
  key: "blog",
  label: "博客",
  mode: "menu",
  order: 70,
  description: "历史博客内容",
};

export class BlogRouteRegistrar extends BaseRouteRegistrar {
  readonly source = "jsh-blog";

  register(registry: import("jsh-core").RouteRegistry): void {
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
        tag: doc.tag,
        order: doc.order,
        renderMode: "markdown" as const,
        markdownSource: doc.source,
        markdownFileName: doc.fileName,
      })),
    ]);
  }
}
