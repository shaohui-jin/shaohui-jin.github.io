import { parseFrontmatter } from "@/doc-render/parseFrontmatter";

export interface CompDoc {
  key: string;
  label: string;
  tag?: string;
  order: number;
  source: string;
}

const rawModules = import.meta.glob("./docs/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

function asString(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

export const compDocs: CompDoc[] = Object.entries(rawModules)
  .map(([path, raw]) => {
    const matched = /^\.\/docs\/(.+)\.md$/.exec(path);
    if (!matched) throw new Error(`非法的组件文档路径：${path}`);
    const key = matched[1];
    const { data, body } = parseFrontmatter(raw);
    const label = asString(data.title) || key;
    const tag = asString(data.tag);
    return {
      key,
      label,
      ...(tag && tag !== label ? { tag } : {}),
      order: Number(asString(data.order)) || 0,
      source: body,
    };
  })
  .sort((a, b) => a.order - b.order || a.key.localeCompare(b.key));
