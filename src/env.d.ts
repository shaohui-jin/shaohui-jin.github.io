/// <reference types="vite/client" />

declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<object, object, unknown>;
  export default component;
}

declare module "*.md?raw" {
  const content: string;
  export default content;
}

declare module "virtual:blog-meta" {
  interface BlogMetaEntry {
    file: string;
    key: string;
    label: string;
    groupKey: string;
    date: string;
    category: string;
    headerDepth?: number;
    excerpt: string;
  }
  export const blogMeta: BlogMetaEntry[];
}
