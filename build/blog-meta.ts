import { readdirSync, readFileSync } from "node:fs";
import { join, relative, sep } from "node:path";
import type { Plugin } from "vite";
import { parseFrontmatter } from "../src/doc-render/parseFrontmatter";

/**
 * 构建期博客元数据。
 *
 * 正文通过 `?raw` 懒加载，首包只保留标题、日期、分类与摘要等元数据。
 * 虚拟模块 `virtual:blog-meta` 由本插件生成，dev 下 md 变更会整页刷新。
 */

const CONTENT_ROOT = join(process.cwd(), "src/content/posts");
const VIRTUAL_ID = "virtual:blog-meta";
const RESOLVED_ID = "\0" + VIRTUAL_ID;

/** 逐行提取摘要：剔除代码块与非散文行，纯代码笔记退化为小标题串联 */
function extractExcerpt(source: string, limit = 60): string {
  const lines = source
    .replace(/```[\s\S]*?```/g, "\n")
    .replace(/~~~[\s\S]*?~~~/g, "\n")
    .split(/\r?\n/);

  const prose: string[] = [];
  const headings: string[] = [];

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;
    if (/^(:::|\||!\[|<|\d+\.\s|[-*+]\s)/.test(line)) continue;

    const isHeading = /^#{1,6}\s/.test(line);
    const clean = line
      .replace(/^#{1,6}\s+/, "")
      .replace(/^>\s?/, "")
      .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
      .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
      .replace(/`[^`]*`/g, "")
      .replace(/<[^>]+>/g, "")
      .replace(/[*_~]/g, "")
      .replace(/\s+([，。；：、])/g, "$1")
      .replace(/\s+/g, " ")
      .trim();
    if (!clean) continue;

    if (isHeading) {
      headings.push(clean);
      continue;
    }

    const cjk = (clean.match(/[\u4e00-\u9fa5]/g) ?? []).length;
    if (cjk >= 4) prose.push(clean);
  }

  const joined = prose.join(" ").trim();
  const cjkCount = (joined.match(/[\u4e00-\u9fa5]/g) ?? []).length;
  const text = cjkCount >= 8 || headings.length === 0 ? joined : headings.join(" · ");

  if (!text) return "";
  return text.length > limit ? `${text.slice(0, limit)}…` : text;
}

function walk(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

function readMeta(raw: string, file: string) {
  const { data, body } = parseFrontmatter(raw);
  const [groupKey, name] = file.split("/");
  const slug = name.replace(/\.md$/, "");
  const list = (value: string | string[] | undefined) =>
    Array.isArray(value) ? value : value ? [value] : [];
  const text = (value: string | string[] | undefined) => list(value)[0] ?? "";

  return {
    file,
    key: `blog-${slug}`,
    label: text(data.title) || slug,
    groupKey,
    date: text(data.date),
    category: list(data.category)[0] ?? groupKey,
    headerDepth: Number(text(data.headerDepth)) || undefined,
    excerpt: extractExcerpt(body),
  };
}

export function blogMetaPlugin(): Plugin {
  return {
    name: "blog-meta",
    resolveId(id) {
      if (id === VIRTUAL_ID) return RESOLVED_ID;
    },
    load(id) {
      if (id !== RESOLVED_ID) return;
      const entries = walk(CONTENT_ROOT)
        .filter((full) => full.endsWith(".md"))
        .map((full) =>
          readMeta(readFileSync(full, "utf8"), relative(CONTENT_ROOT, full).split(sep).join("/")),
        );
      return `export const blogMeta = ${JSON.stringify(entries)};`;
    },
    configureServer(server) {
      server.watcher.add(CONTENT_ROOT);
      server.watcher.on("all", (_event, file) => {
        const normalized = file.replace(/\\/g, "/");
        if (!normalized.endsWith(".md") || !normalized.includes("/src/content/posts/")) return;
        const mod = server.moduleGraph.getModuleById(RESOLVED_ID);
        if (mod) server.moduleGraph.invalidateModule(mod);
        server.ws.send({ type: "full-reload" });
      });
    },
  };
}
