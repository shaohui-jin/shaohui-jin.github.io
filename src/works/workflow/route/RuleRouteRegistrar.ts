import { BaseRouteRegistrar } from "@/app/core";
import { WORKS_TAB } from "@/route/worksTab";
import { workflowGroups, workflowRoute } from "./routeMeta";

export class RuleRouteRegistrar extends BaseRouteRegistrar {
  readonly source = "jsh-rule";

  register(registry: import("@/app/core").RouteRegistry): void {
    this.registerTopTabs(registry, [WORKS_TAB]);
    this.registerGroups(registry, workflowGroups);
    this.registerRoutes(registry, [
      workflowRoute(() => import("../component/workflow-designer/WorkflowDesigner.vue")),
    ]);
  }
}
