import type { BaseRouteRegistrar } from "jsh-core";
import { BlogRouteRegistrar } from "jsh-blog";
import { CompDocRegistrar } from "jsh-comp/doc";
import { CoreDocRegistrar } from "jsh-core/doc";
import { RuleRouteRegistrar } from "jsh-rule";
import { ToolDocRegistrar } from "jsh-tool/doc";

export function createModuleRegistrars(): BaseRouteRegistrar[] {
  return [
    new CompDocRegistrar(),
    new ToolDocRegistrar(),
    new CoreDocRegistrar(),
    new RuleRouteRegistrar(),
    new BlogRouteRegistrar(),
  ];
}
