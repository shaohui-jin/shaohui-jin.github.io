import type { BaseRouteRegistrar } from "@/app/core";
import { BlogRouteRegistrar } from "@/blog";
import { CompDocRegistrar } from "@/works/comp/doc";
import { CoreDocRegistrar } from "@/app/core/doc";
import { RuleRouteRegistrar } from "@/works/workflow";
import { ToolDocRegistrar } from "@/works/tools";
import { HomeRouteRegistrar } from "../pages/home/HomeRouteRegistrar";

export function createModuleRegistrars(): BaseRouteRegistrar[] {
  return [
    // 首页 order=0，注册顺序不影响排序，但放最前便于阅读
    new HomeRouteRegistrar(),
    new CompDocRegistrar(),
    new ToolDocRegistrar(),
    new CoreDocRegistrar(),
    new RuleRouteRegistrar(),
    new BlogRouteRegistrar(),
  ];
}
