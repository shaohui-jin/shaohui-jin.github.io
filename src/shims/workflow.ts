import { defineComponent } from "vue";
import { BaseRouteRegistrar } from "@/app/core";
import type { RouteRegistry, TopTabMeta } from "@/app/core";

/**
 * 严格类型检查用的替身。
 * Vite 不读这条 paths，运行时 `@/works/workflow` 仍是 src/works/workflow。
 * 画布本身用 tsconfig.workflow.json 按原来的宽松配置检查。
 */
const WorkflowView = defineComponent({ name: "WorkflowDesigner" });

export const WorkflowDesigner = WorkflowView;
export const RuleWorkflowDesignerCore = WorkflowView;
export default WorkflowView;

const worksTab: TopTabMeta = {
  key: "works",
  label: "作品",
  mode: "menu",
  order: 20,
};

export class RuleRouteRegistrar extends BaseRouteRegistrar {
  readonly source = "jsh-rule";

  register(registry: RouteRegistry): void {
    this.registerTopTabs(registry, [worksTab]);
    this.registerRoutes(registry, [
      {
        key: "workflow",
        tabKey: "works",
        groupKey: "workflow",
        label: "画布编排",
        order: 10,
        loader: () => Promise.resolve({ default: WorkflowView }),
      },
    ]);
  }
}
