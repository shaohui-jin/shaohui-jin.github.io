import { BaseRouteRegistrar } from "@/app/core";
import { WORKS_TAB } from "@/route/worksTab";
import { toolDocs } from "./toolDocs";

export class ToolDocRegistrar extends BaseRouteRegistrar {
  readonly source = "jsh-tool";

  register(registry: import("@/app/core").RouteRegistry): void {
    this.registerTopTabs(registry, [WORKS_TAB]);
    this.registerGroups(registry, [
      { tabKey: WORKS_TAB.key, key: "tools", title: "工具", accent: "#67c23a", order: 20 },
    ]);
    this.registerRoutes(
      registry,
      toolDocs.map((doc) => ({
        key: `tools/${doc.key}`,
        tabKey: WORKS_TAB.key,
        groupKey: "tools",
        label: doc.label,
        order: doc.order,
        renderMode: "markdown" as const,
        markdownSource: doc.source,
        props: { apiTable: true },
      })),
    );
  }
}
