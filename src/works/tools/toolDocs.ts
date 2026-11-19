import { parseFrontmatter } from "@/doc-render/parseFrontmatter";

export interface ToolDoc {
  key: string;
  label: string;
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

export const toolDocs: ToolDoc[] = Object.entries(rawModules)
  .map(([path, raw]) => {
    const matched = /^\.\/docs\/(.+)\.md$/.exec(path);
    if (!matched) throw new Error(`非法的工具文档路径：${path}`);
    const key = matched[1];
    const { data, body } = parseFrontmatter(raw);
    return {
      key,
      label: asString(data.title) || key,
      order: Number(asString(data.order)) || 0,
      source: body,
    };
  })
  .sort((a, b) => a.order - b.order || a.key.localeCompare(b.key));
