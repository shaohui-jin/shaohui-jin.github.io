import { defineComponent } from "vue";
import { BaseRouteRegistrar } from "@/app/core";
import type { RouteRegistry } from "@/app/core";
import { WORKS_TAB } from "@/route/worksTab";
import { workflowGroups, workflowRoute } from "../works/workflow/route/routeMeta";

/**
 * 严格类型检查用的替身。
 * Vite 不读这条 paths，运行时 `@/works/workflow` 仍是 src/works/workflow。
 * 画布本身用 tsconfig.workflow.json 按原来的宽松配置检查。
 * 路由元数据与真实注册器共用 routeMeta，避免两处手写漂移。
 */
const WorkflowView = defineComponent({ name: "WorkflowDesigner" });

export const WorkflowDesigner = WorkflowView;
export const RuleWorkflowDesignerCore = WorkflowView;
export default WorkflowView;

export class RuleRouteRegistrar extends BaseRouteRegistrar {
  readonly source = "jsh-rule";

  register(registry: RouteRegistry): void {
    this.registerTopTabs(registry, [WORKS_TAB]);
    this.registerGroups(registry, workflowGroups);
    this.registerRoutes(registry, [
      workflowRoute(() => Promise.resolve({ default: WorkflowView })),
    ]);
  }
}
