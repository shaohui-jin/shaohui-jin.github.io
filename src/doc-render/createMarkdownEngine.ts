import MarkdownIt from "markdown-it";
import { hljs } from "@/utils/highlight";

export type DemoKind = "playground" | "sfc" | "html" | "mermaid";

export interface DemoBlock {
  id: string;
  /** 在本文档 demos 数组中的下标，渲染层靠它定位占位符 */
  index: number;
  kind: DemoKind;
  /** 文件名 → 源码；`html` 类型为空，源码在 code 中 */
  files: Record<string, string>;
  /** 原始代码，用于折叠展示 */
  code: string;
  lang: string;
}

export interface CodeFenceBlock {
  code: string;
  lang: string;
  highlightLines: number[];
}

export interface CalloutBlock {
  name: string;
  title: string;
  html: string;
}

export interface ApiTableRow {
  name: string;
  type: string;
  default: string;
  required: boolean;
  desc: string;
}

export interface ApiTableBlock {
  rows: ApiTableRow[];
}

export interface RenderedMarkdown {
  html: string;
  demos: DemoBlock[];
  fences: CodeFenceBlock[];
  callouts: CalloutBlock[];
  apiTables: ApiTableBlock[];
}

interface MdNode {
  type: "md";
  text: string;
}

interface ContainerNode {
  type: "container";
  name: string;
  title: string;
  children: Node[];
}

interface DemoNode {
  type: "demo";
  demo: DemoBlock;
}

interface CodeNode {
  type: "code";
  index: number;
}

interface ApiNode {
  type: "api";
  index: number;
}

type Node = MdNode | ContainerNode | DemoNode | CodeNode | ApiNode;

const API_TABLE_HEADER = ["名称", "类型", "默认值", "必填", "说明"];

const OPEN_RE = /^:::\s*([A-Za-z][\w-]*)\s*(.*)$/;
const CLOSE_RE = /^:::\s*$/;

const DEMO_NAMES = new Set(["vue-demo", "vue-playground", "normal-demo"]);

const CALLOUT_NAMES = new Set([
  "info",
  "tip",
  "warning",
  "danger",
  "important",
  "note",
  "theorem",
  "right",
  "cxt",
  "details",
]);

const CALLOUT_LABELS: Record<string, string> = {
  info: "提示",
  tip: "技巧",
  warning: "注意",
  danger: "警告",
  important: "重要",
  note: "说明",
  theorem: "定理",
  right: "补充",
  cxt: "上下文",
  details: "详情",
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** 把 `![alt](src "title" =800x)` 转成 `<img>`，顺带兼容 URL 内含括号的情况 */
function replaceImages(line: string): string {
  let out = "";
  let cursor = 0;

  while (cursor < line.length) {
    const start = line.indexOf("![", cursor);
    if (start === -1) {
      out += line.slice(cursor);
      break;
    }

    const mid = line.indexOf("](", start + 2);
    if (mid === -1) {
      out += line.slice(cursor);
      break;
    }

    let depth = 0;
    let end = -1;
    for (let i = mid + 2; i < line.length; i += 1) {
      const char = line[i];
      if (char === "(") depth += 1;
      else if (char === ")") {
        if (depth === 0) {
          end = i;
          break;
        }
        depth -= 1;
      }
    }

    if (end === -1) {
      out += line.slice(cursor);
      break;
    }

    const alt = line.slice(start + 2, mid);
    let inner = line.slice(mid + 2, end).trim();

    let width = "";
    let height = "";
    const sizeMatched = /\s*=(\d+)?x(\d+)?$/.exec(inner);
    if (sizeMatched) {
      width = sizeMatched[1] ?? "";
      height = sizeMatched[2] ?? "";
      inner = inner.slice(0, sizeMatched.index).trim();
    }

    let title = "";
    const titleMatched = /\s+["']([\s\S]*)["']$/.exec(inner);
    if (titleMatched) {
      title = titleMatched[1];
      inner = inner.slice(0, titleMatched.index).trim();
    }

    const attrs = [`src="${escapeHtml(inner)}"`, `alt="${escapeHtml(alt)}"`, `loading="lazy"`];
    if (title) attrs.push(`title="${escapeHtml(title)}"`);
    if (width) attrs.push(`width="${width}"`);
    if (height) attrs.push(`height="${height}"`);

    out += `<img ${attrs.join(" ")}>`;
    cursor = end + 1;
  }

  return out;
}

/** `==高亮==` → `<mark>`，跳过行内代码 */
function replaceMarks(line: string): string {
  return line
    .split("`")
    .map((segment, index) =>
      index % 2 === 0 ? segment.replace(/==([^=\n]+)==/g, "<mark>$1</mark>") : segment,
    )
    .join("`");
}

/** VuePress 的 `<Badge text="避免" type="danger" />` → 带样式的 span */
function replaceBadges(line: string): string {
  return line.replace(/<Badge\b([^>]*?)\/?>/g, (_all, attrs: string) => {
    const text = /text="([^"]*)"/.exec(attrs)?.[1] ?? /content="([^"]*)"/.exec(attrs)?.[1] ?? "";
    const type = /type="([^"]*)"/.exec(attrs)?.[1] ?? "info";
    return `<span class="vp-badge vp-badge--${type}">${escapeHtml(text)}</span>`;
  });
}

/** 只处理代码围栏之外的文本 */
function transformInlineText(text: string): string {
  let fence = false;

  return text
    .split("\n")
    .map((line) => {
      if (/^\s*```/.test(line)) {
        fence = !fence;
        return line;
      }
      if (fence) return line;
      return replaceBadges(replaceMarks(replaceImages(line)));
    })
    .join("\n");
}

function extractFence(lines: string[]): {
  lang: string;
  code: string;
  files: Record<string, string>;
  css: string;
} {
  const files: Record<string, string> = {};
  let pendingName = "";
  let firstLang = "";
  let firstCode = "";
  let css = "";

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    const fileMatched = /^@file\s+(\S+)\s*$/.exec(line.trim());
    if (fileMatched) {
      pendingName = fileMatched[1];
      continue;
    }

    const fenceMatched = /^\s*```(\w*)(?:\s*\{[^}]*\})?\s*$/.exec(line);
    if (!fenceMatched) continue;

    const lang = fenceMatched[1] || "text";
    const body: string[] = [];
    let j = i + 1;
    for (; j < lines.length; j += 1) {
      if (/^\s*```\s*$/.test(lines[j])) break;
      body.push(lines[j]);
    }

    const code = body.join("\n");
    if (!firstCode) {
      firstLang = lang;
      firstCode = code;
    }
    if (lang === "css") css = css ? `${css}\n${code}` : code;

    if (pendingName) {
      files[pendingName] = code;
      pendingName = "";
    } else if (!Object.keys(files).length && lang === "vue") {
      files["App.vue"] = code;
    }

    i = j;
  }

  return { lang: firstLang, code: firstCode, files, css };
}

function parseHighlightLines(spec: string): number[] {
  const lines: number[] = [];
  for (const part of spec.split(",")) {
    const piece = part.trim();
    if (!piece) continue;
    const range = /^(\d+)\s*-\s*(\d+)$/.exec(piece);
    if (range) {
      const from = Math.min(Number(range[1]), Number(range[2]));
      const to = Math.max(Number(range[1]), Number(range[2]));
      for (let n = from; n <= to; n += 1) lines.push(n);
      continue;
    }
    if (/^\d+$/.test(piece)) lines.push(Number(piece));
  }
  return lines;
}

/** 按开头反引号数量找到结束行。未闭合时返回 null */
function readFence(
  lines: string[],
  start: number,
): { code: string; lang: string; highlightLines: number[]; end: number } | null {
  const open = /^(\s*)(`{3,})([^`]*)$/.exec(lines[start] ?? "");
  if (!open) return null;

  const marker = open[2];
  const info = open[3].trim();
  const closeRe = new RegExp(`^\\s*${marker}\\s*$`);
  const body: string[] = [];

  for (let j = start + 1; j < lines.length; j += 1) {
    if (!closeRe.test(lines[j])) {
      body.push(lines[j]);
      continue;
    }
    const highlightMatched = /\{([^{}]*)\}/.exec(info);
    const lang = info.split(/\s+/).find((token) => token && !token.startsWith("{")) ?? "";
    return {
      code: body.join("\n"),
      lang,
      highlightLines: highlightMatched ? parseHighlightLines(highlightMatched[1]) : [],
      end: j,
    };
  }

  return null;
}

function splitTableCells(line: string): string[] {
  const body = line.trim().replace(/^\|/, "").replace(/\|$/, "");
  const cells: string[] = [];
  let current = "";
  for (let i = 0; i < body.length; i += 1) {
    if (body[i] === "\\" && body[i + 1] === "|") {
      current += "\\|";
      i += 1;
      continue;
    }
    if (body[i] === "|") {
      cells.push(current.trim());
      current = "";
      continue;
    }
    current += body[i];
  }
  cells.push(current.trim());
  return cells;
}

function plainCell(value: string): string {
  return value.replace(/`/g, "").replace(/\\\|/g, "|");
}

/** 表头匹配参数说明时抽成 ApiTable，否则留给 markdown-it */
function readApiTable(lines: string[], start: number): { rows: ApiTableRow[]; end: number } | null {
  if (!/^\s*\|/.test(lines[start] ?? "")) return null;

  const block: string[] = [];
  let end = start;
  for (; end < lines.length; end += 1) {
    if (!/^\s*\|/.test(lines[end])) break;
    block.push(lines[end]);
  }
  if (block.length < 2) return null;

  const header = splitTableCells(block[0]).map(plainCell);
  if (header.join("\0") !== API_TABLE_HEADER.join("\0")) return null;

  let dataStart = 1;
  const second = splitTableCells(block[1]);
  if (second.every((cell) => /^:?-+:?$/.test(cell))) dataStart = 2;

  const rows = block.slice(dataStart).map((line) => {
    const cells = splitTableCells(line).map(plainCell);
    return {
      name: cells[0] ?? "",
      type: cells[1] ?? "",
      default: cells[2] ?? "—",
      required: cells[3] === "是",
      desc: cells[4] ?? "",
    };
  });

  return { rows, end: end - 1 };
}

function parseBlocks(
  lines: string[],
  demos: DemoBlock[],
  fences: CodeFenceBlock[],
  extractFences: boolean,
  apiTables?: ApiTableBlock[],
): Node[] {
  const nodes: Node[] = [];
  let buffer: string[] = [];

  const flush = (): void => {
    if (!buffer.length) return;
    const text = buffer.join("\n");
    if (text.trim()) nodes.push({ type: "md", text });
    buffer = [];
  };

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];

    // ```mermaid 围栏：直接抽成 demo，交给 MermaidBlock 异步渲染
    if (/^\s*```mermaid\s*$/.test(line)) {
      const body: string[] = [];
      let k = i + 1;
      for (; k < lines.length; k += 1) {
        if (/^\s*```\s*$/.test(lines[k])) break;
        body.push(lines[k]);
      }
      if (k < lines.length) {
        flush();
        const code = body.join("\n");
        const demo: DemoBlock = {
          id: `demo-${demos.length}`,
          index: demos.length,
          kind: "mermaid",
          files: {},
          code,
          lang: "mermaid",
        };
        demos.push(demo);
        nodes.push({ type: "demo", demo });
        i = k;
        continue;
      }
    }

    if (extractFences) {
      const fence = readFence(lines, i);
      if (fence) {
        flush();
        const index = fences.length;
        fences.push({
          code: fence.code,
          lang: fence.lang,
          highlightLines: fence.highlightLines,
        });
        nodes.push({ type: "code", index });
        i = fence.end;
        continue;
      }
    }

    if (apiTables) {
      const table = readApiTable(lines, i);
      if (table) {
        flush();
        const index = apiTables.length;
        apiTables.push({ rows: table.rows });
        nodes.push({ type: "api", index });
        i = table.end;
        continue;
      }
    }

    const openMatched = OPEN_RE.exec(line.trim());
    const name = openMatched?.[1] ?? "";

    if (!openMatched || (!DEMO_NAMES.has(name) && !CALLOUT_NAMES.has(name))) {
      buffer.push(line);
      continue;
    }

    flush();

    let depth = 1;
    let j = i + 1;
    const inner: string[] = [];
    for (; j < lines.length; j += 1) {
      const current = lines[j].trim();
      if (CLOSE_RE.test(current)) {
        depth -= 1;
        if (depth === 0) break;
      } else if (OPEN_RE.test(current)) {
        depth += 1;
      }
      inner.push(lines[j]);
    }

    if (DEMO_NAMES.has(name)) {
      const { code, files, css } = extractFence(inner);
      if (!code) {
        buffer.push(line, ...inner, ":::");
      } else {
        const kind: DemoKind =
          name === "normal-demo" ? "html" : name === "vue-playground" ? "playground" : "sfc";
        const previewCode =
          name === "normal-demo" && css ? `${code}\n<style>\n${css}\n</style>` : code;
        const resolvedFiles = files["App.vue"] ? files : { "App.vue": code };
        const demo: DemoBlock = {
          id: `demo-${demos.length}`,
          index: demos.length,
          kind,
          files: kind === "html" ? {} : resolvedFiles,
          code: previewCode,
          lang: kind === "html" ? "html" : "vue",
        };
        demos.push(demo);
        nodes.push({ type: "demo", demo });
      }
    } else {
      nodes.push({
        type: "container",
        name,
        title: openMatched[2]?.trim() ?? "",
        children: parseBlocks(inner, demos, fences, false),
      });
    }

    i = j;
  }

  flush();
  return nodes;
}

function slugify(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5\s-]/g, "")
    .replace(/\s+/g, "-");
}

export function createMarkdownEngine(): MarkdownIt {
  const engine = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
    highlight(code, lang) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          const result = hljs.highlight(code, { language: lang, ignoreIllegals: true });
          return `<pre class="hljs"><code>${result.value}</code></pre>`;
        } catch {
          /* 落到兜底 */
        }
      }
      return `<pre class="hljs"><code>${escapeHtml(code)}</code></pre>`;
    },
  });

  const headingOpen = engine.renderer.rules.heading_open;
  engine.renderer.rules.heading_open = (tokens, idx, opts, env, self) => {
    const token = tokens[idx];
    const inlineToken = tokens[idx + 1];
    const title = inlineToken?.content ?? "";
    if (title) token.attrSet("id", slugify(title));
    return headingOpen
      ? headingOpen(tokens, idx, opts, env, self)
      : self.renderToken(tokens, idx, opts);
  };

  // 表格外包一层滚动容器，避免宽表撑破内容区
  const tableOpen = engine.renderer.rules.table_open;
  engine.renderer.rules.table_open = (tokens, idx, opts, env, self) => {
    const inner = tableOpen
      ? tableOpen(tokens, idx, opts, env, self)
      : self.renderToken(tokens, idx, opts);
    return `<div class="vp-table-wrap">${inner}`;
  };

  const tableClose = engine.renderer.rules.table_close;
  engine.renderer.rules.table_close = (tokens, idx, opts, env, self) => {
    const inner = tableClose
      ? tableClose(tokens, idx, opts, env, self)
      : self.renderToken(tokens, idx, opts);
    return `${inner}</div>`;
  };

  return engine;
}

const markdownEngine = createMarkdownEngine();

function renderNodes(nodes: Node[], callouts: CalloutBlock[]): string {
  return nodes
    .map((node) => {
      if (node.type === "md") {
        return markdownEngine.render(transformInlineText(node.text));
      }
      if (node.type === "code") {
        return `<div class="vp-code-slot" data-code-index="${node.index}"></div>`;
      }
      if (node.type === "api") {
        return `<div class="vp-api-slot" data-api-index="${node.index}"></div>`;
      }
      if (node.type === "demo") {
        // 占位符类名刻意不用 vp-demo，避免和挂载后的组件根节点同名
        return (
          `<div class="vp-demo-slot" data-demo-id="${node.demo.id}"` +
          ` data-demo-index="${node.demo.index}" data-demo-kind="${node.demo.kind}"></div>`
        );
      }
      const title = node.title || CALLOUT_LABELS[node.name] || node.name;
      const html = renderNodes(node.children, callouts);
      const index = callouts.length;
      callouts.push({ name: node.name, title, html });
      return `<div class="vp-callout-slot" data-callout-index="${index}"></div>`;
    })
    .join("\n");
}

/** 抽出 `[^id]: 说明` 定义行，交给文末统一渲染（markdown-it 分块渲染无法跨块收集） */
function extractFootnotes(source: string): { source: string; defs: Map<string, string> } {
  const defs = new Map<string, string>();
  const kept: string[] = [];

  for (const line of source.split("\n")) {
    const matched = /^\[\^([^\]]+)\]:\s*(.*)$/.exec(line);
    if (matched) defs.set(matched[1], matched[2].trim());
    else kept.push(line);
  }

  return { source: kept.join("\n"), defs };
}

function replaceFootnoteRefs(html: string, defs: Map<string, string>, used: string[]): string {
  const segments = html.split(/(<pre[\s\S]*?<\/pre>|<code[\s\S]*?<\/code>)/g);
  return segments
    .map((segment, index) => {
      if (index % 2 === 1) return segment;
      return segment.replace(/\[\^([^\]]+)\]/g, (all, id: string) => {
        if (!defs.has(id)) return all;
        if (!used.includes(id)) used.push(id);
        const number = used.indexOf(id) + 1;
        return `<sup class="vp-footnote-ref"><a href="#fn-${id}" id="fnref-${id}">[${number}]</a></sup>`;
      });
    })
    .join("");
}

/** 按文档顺序处理正文和提示容器里的脚注，编号保持连续 */
function applyFootnotesInOrder(
  html: string,
  callouts: CalloutBlock[],
  defs: Map<string, string>,
  used: string[],
): string {
  const slotRe = /<div class="vp-callout-slot" data-callout-index="(\d+)"><\/div>/g;
  let cursor = 0;
  let out = "";
  let matched: RegExpExecArray | null;

  while ((matched = slotRe.exec(html))) {
    const at = matched.index;
    out += replaceFootnoteRefs(html.slice(cursor, at), defs, used);
    const callout = callouts[Number(matched[1])];
    if (callout) callout.html = applyFootnotesInOrder(callout.html, callouts, defs, used);
    out += matched[0];
    cursor = at + matched[0].length;
  }

  return out + replaceFootnoteRefs(html.slice(cursor), defs, used);
}

function applyFootnotes(html: string, callouts: CalloutBlock[], defs: Map<string, string>): string {
  if (!defs.size) return html;

  const used: string[] = [];
  const replaced = applyFootnotesInOrder(html, callouts, defs, used);

  if (!used.length) return replaced;

  const items = used
    .map(
      (id) =>
        `<li id="fn-${id}">${defs.get(id)} <a class="vp-footnote-back" href="#fnref-${id}">&#8617;</a></li>`,
    )
    .join("");

  return `${replaced}<section class="vp-footnotes"><ol>${items}</ol></section>`;
}

export function renderMarkdown(source: string, options?: { apiTable?: boolean }): RenderedMarkdown {
  const demos: DemoBlock[] = [];
  const fences: CodeFenceBlock[] = [];
  const callouts: CalloutBlock[] = [];
  const apiTables: ApiTableBlock[] = [];
  const { source: body, defs } = extractFootnotes(source);
  const cleaned = body
    .replace(/<!--\s*#?region[^>]*-->/gi, "")
    .replace(/<!--\s*#?endregion[^>]*-->/gi, "");
  const nodes = parseBlocks(
    cleaned.split("\n"),
    demos,
    fences,
    true,
    options?.apiTable ? apiTables : undefined,
  );
  return {
    html: applyFootnotes(renderNodes(nodes, callouts), callouts, defs),
    demos,
    fences,
    callouts,
    apiTables,
  };
}
