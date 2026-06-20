import { BaseRouteRegistrar } from "jsh-core";
import type { TopTabMeta } from "jsh-core";
import { blogDocConfigs } from "../content";

const blogTopTab: TopTabMeta = {
  key: "blog",
  label: "博客",
  mode: "menu",
  order: 70,
  description: "Markdown 内容与迁移文档",
};

export class BlogRouteRegistrar extends BaseRouteRegistrar {
  readonly source = "jsh-blog";

  register(registry: import("jsh-core").RouteRegistry): void {
    this.registerTopTabs(registry, [blogTopTab]);
    this.registerGroups(registry, [
      {
        tabKey: "blog",
        key: "overview",
        title: "概览",
        accent: "#3f51b5",
        order: 10,
      },
      {
        tabKey: "blog",
        key: "migration",
        title: "迁移",
        accent: "#009688",
        order: 20,
      },
    ]);
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
