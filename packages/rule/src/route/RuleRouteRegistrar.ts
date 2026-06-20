import { BaseRouteRegistrar } from "jsh-core";
import type { TopTabMeta } from "jsh-core";

const ruleTopTabs: TopTabMeta[] = [{ key: "workflow-designer", label: "画布编排", mode: "single", order: 40 }];

export class RuleRouteRegistrar extends BaseRouteRegistrar {
  readonly source = "jsh-rule";

  register(registry: import("jsh-core").RouteRegistry): void {
    this.registerTopTabs(registry, ruleTopTabs);
    this.registerRoutes(registry, [
      {
        key: "workflow-designer",
        tabKey: "workflow-designer",
        label: "画布编排",
        order: 10,
        loader: () => import("../component/workflow-designer/WorkflowDesigner.vue"),
      },
    ]);
  }
}
