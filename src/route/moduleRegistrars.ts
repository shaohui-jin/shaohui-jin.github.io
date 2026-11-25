import type { BaseRouteRegistrar } from "@/app/core";
import { BlogRouteRegistrar } from "@/blog";
import { HomeRouteRegistrar } from "../pages/home/HomeRouteRegistrar";
import { WorksRouteRegistrar } from "../pages/works/WorksRouteRegistrar";

export function createModuleRegistrars(): BaseRouteRegistrar[] {
  return [
    // 首页 order=0，注册顺序不影响排序，但放最前便于阅读
    new HomeRouteRegistrar(),
    new WorksRouteRegistrar(),
    new BlogRouteRegistrar(),
  ];
}
