import type { BaseRouteRegistrar } from "jsh-core";
import { BlogRouteRegistrar } from "jsh-blog";
import { CompDocRegistrar } from "jsh-comp/doc";
import { CoreDocRegistrar } from "jsh-core/doc";
import { RuleRouteRegistrar } from "jsh-rule";
import { ToolDocRegistrar } from "jsh-tool/doc";
import { HomeRouteRegistrar } from "../home/HomeRouteRegistrar";

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
