import { BaseRouteRegistrar } from "@/app/core";
import { WORKS_TAB } from "@/route/worksTab";
import { compDocs } from "./compDocs";

export class CompDocRegistrar extends BaseRouteRegistrar {
  readonly source = "jsh-comp";

  register(registry: import("@/app/core").RouteRegistry): void {
    this.registerTopTabs(registry, [WORKS_TAB]);
    this.registerGroups(registry, [
      { tabKey: WORKS_TAB.key, key: "components", title: "组件", accent: "#409eff", order: 10 },
    ]);
    this.registerRoutes(
      registry,
      compDocs.map((doc) => ({
        key: `components/${doc.key}`,
        tabKey: WORKS_TAB.key,
        groupKey: "components",
        label: doc.label,
        ...(doc.tag ? { tag: doc.tag } : {}),
        order: doc.order,
        renderMode: "markdown" as const,
        markdownSource: doc.source,
        props: { apiTable: true },
      })),
    );
  }
}
