export { createCompLib } from "./config/configInjection";
export { default as ConfigProvider } from "./config/ConfigProvider.vue";
export { elementPlusLocale } from "./config/elementPlusLocale";
export { useLibConfig } from "./config/useLibConfig";
export { defaultLibConfig } from "./config/configDefaults";
export { BaseRouteRegistrar, RouteRegistry } from "./route";
export { CoreDocRegistrar } from "./doc";
export type {
  LibConfig,
  LibThemeConfig,
  ResolvedLibConfig,
} from "./config/configTypes";
export type { PersistOptions } from "./config/configInjection";
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
export { libColorDefaults } from "./style/colorDefaults";
