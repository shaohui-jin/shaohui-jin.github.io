import { BaseRouteRegistrar } from "@/app/core";
import { WORKS_TAB } from "@/route/worksTab";

export class RuleRouteRegistrar extends BaseRouteRegistrar {
  readonly source = "jsh-rule";

  register(registry: import("@/app/core").RouteRegistry): void {
    this.registerTopTabs(registry, [WORKS_TAB]);
    this.registerGroups(registry, [
      {
        tabKey: WORKS_TAB.key,
        key: "workflow",
        title: "画布",
        accent: "#3f51b5",
        order: 300,
      },
    ]);
    this.registerRoutes(registry, [
      {
        key: "workflow",
        tabKey: WORKS_TAB.key,
        groupKey: "workflow",
        label: "画布编排",
        tag: "流程",
        order: 10,
        loader: () => import("../component/workflow-designer/WorkflowDesigner.vue"),
      },
    ]);
  }
}
