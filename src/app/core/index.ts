export { createCompLib, LIB_PLUGIN_KEY } from "./config/configInjection";
export { elementPlusLocale } from "./config/elementPlusLocale";
export { useLibPlugin } from "./config/useLibConfig";
export { defaultLibConfig } from "./config/configDefaults";
export { BaseRouteRegistrar, RouteRegistry } from "./route";
export type { LibConfig, LibThemeConfig, ResolvedLibConfig } from "./config/configTypes";
export type { PersistOptions, LibPluginHandle } from "./config/configInjection";
export type {
  RouteComponentModule,
  RouteComponentLoader,
  RouteRenderMode,
  RouteGroupMeta,
  RouteGroupSnapshot,
  RouteRecord,
  RouteRegistrySnapshot,
  RegisteredRouteRecord,
  TopTabMeta,
} from "./route";
