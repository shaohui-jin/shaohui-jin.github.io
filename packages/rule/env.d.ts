/// <reference types="vite/client" />

declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<object, object, unknown>;
  export default component;
}

declare type Recordable<T = unknown> = Record<string, T>;

declare module "dagre";

type TimeoutHandle = ReturnType<typeof setTimeout>;
