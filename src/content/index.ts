/**
 * 博客内容索引。
 *
 * 内容源：`./posts/<groupKey>/<slug>.md`，构建期通过 `import.meta.glob` 内联为字符串，
 * 再由 `parseFrontmatter` 解析出标题、日期、分类等元数据。
 *
 * 路由标识规则（不兼容旧站 permalink）：
 *   posts/vue/vue-lifecycle.md → key = "blog-vue-lifecycle"、groupKey = "vue"
 * 文件名是全局唯一的 `{分组}-{短名}.md`，目录只表示分组。
 */

export type BlogGroupKey =
  | "vue"
  | "react"
  | "javascript"
  | "browser"
  | "css"
  | "engineering"
  | "practice"
  | "performance"
  | "design-pattern"
  | "algorithm"
  | "java"
  | "interview"
  | "recommend";

/** A = 纯标准 Markdown；B = 含 `:::` 容器；C = 含 demo 块 */
export type BlogDocTier = "A" | "B" | "C";

export interface BlogDocConfig {
  /** 全局唯一路由 key */
  key: string;
  /** 中文标题，取自 frontmatter.title */
  label: string;
  groupKey: BlogGroupKey;
  order: number;
  fileName: string;
  source: string;
  date: string;
  category: string;
  headerDepth?: number;
  tier: BlogDocTier;
}

export interface BlogGroupConfig {
  key: BlogGroupKey;
  title: string;
  accent: string;
  order: number;
}

interface FrontmatterData {
  [key: string]: string | string[];
}

function unquote(value: string): string {
  const matched = /^(['"])([\s\S]*)\1$/.exec(value);
  return matched ? matched[2] : value;
}

/** 解析本仓库用到的 YAML 子集：`key: value` 与 `key:\n  - item` */
function parseFrontmatter(raw: string): { data: FrontmatterData; body: string } {
  const matched = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(raw);
  if (!matched) return { data: {}, body: raw };

  const data: FrontmatterData = {};
  let currentKey = "";

  for (const line of matched[1].split(/\r?\n/)) {
    const listItem = /^\s+-\s+(.*)$/.exec(line);
    if (listItem && currentKey) {
      const list = Array.isArray(data[currentKey]) ? (data[currentKey] as string[]) : [];
      list.push(unquote(listItem[1].trim()));
      data[currentKey] = list;
      continue;
    }

    const pair = /^([A-Za-z_][\w-]*)\s*:\s*(.*)$/.exec(line);
    if (!pair) continue;

    currentKey = pair[1];
    const value = pair[2].trim();
    if (value === "") {
      data[currentKey] = [];
    } else if (value.startsWith("[") && value.endsWith("]")) {
      data[currentKey] = value
        .slice(1, -1)
        .split(",")
        .map((item) => unquote(item.trim()))
        .filter(Boolean);
    } else {
      data[currentKey] = unquote(value);
    }
  }

  return { data, body: raw.slice(matched[0].length) };
}

function asString(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

function asStringList(value: string | string[] | undefined): string[] {
  if (Array.isArray(value)) return value;
  return value ? [value] : [];
}

function detectTier(source: string): BlogDocTier {
  if (/^:::\s*(vue-demo|vue-playground|normal-demo)/m.test(source)) return "C";
  if (/^:::/m.test(source)) return "B";
  return "A";
}

const rawModules = import.meta.glob("./posts/**/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

function buildConfigs(): BlogDocConfig[] {
  const configs = Object.entries(rawModules).map(([path, raw]) => {
    const matched = /^\.\/posts\/([^/]+)\/(.+)\.md$/.exec(path);
    if (!matched) throw new Error(`[@/blog] 非法的内容路径：${path}`);

    const groupKey = matched[1] as BlogGroupKey;
    const slug = matched[2];
    const { data, body } = parseFrontmatter(raw);
    const category = asStringList(data.category);

    return {
      key: `blog-${slug}`,
      label: asString(data.title) || slug,
      groupKey,
      order: 0,
      fileName: `${slug}.md`,
      source: body,
      date: asString(data.date),
      category: category[0] ?? groupKey,
      headerDepth: Number(asString(data.headerDepth)) || undefined,
      tier: detectTier(body),
    } satisfies BlogDocConfig;
  });

  const byGroup = new Map<string, BlogDocConfig[]>();
  for (const config of configs) {
    const list = byGroup.get(config.groupKey) ?? [];
    list.push(config);
    byGroup.set(config.groupKey, list);
  }

  // 组内按日期倒序，order 以 10 递增，便于后续插入
  for (const list of byGroup.values()) {
    list
      .sort((a, b) => b.date.localeCompare(a.date) || a.key.localeCompare(b.key))
      .forEach((config, index) => {
        config.order = (index + 1) * 10;
      });
  }

  return configs;
}

export const blogDocConfigs: BlogDocConfig[] = buildConfigs();

export const blogGroups: BlogGroupConfig[] = [
  { key: "vue", title: "Vue", accent: "#3f51b5", order: 10 },
  { key: "react", title: "React", accent: "#009688", order: 20 },
  { key: "javascript", title: "JavaScript", accent: "#3949ab", order: 30 },
  { key: "browser", title: "浏览器", accent: "#0277bd", order: 40 },
  { key: "css", title: "CSS", accent: "#8e24aa", order: 50 },
  { key: "engineering", title: "工程化", accent: "#546e7a", order: 60 },
  { key: "practice", title: "手写题", accent: "#ef6c00", order: 70 },
  { key: "performance", title: "性能优化", accent: "#ff9800", order: 80 },
  { key: "design-pattern", title: "设计模式", accent: "#607d8b", order: 90 },
  { key: "algorithm", title: "算法", accent: "#9c27b0", order: 100 },
  { key: "java", title: "Java", accent: "#e91e63", order: 110 },
  { key: "interview", title: "面试题", accent: "#ff5722", order: 120 },
  { key: "recommend", title: "推荐", accent: "#795548", order: 130 },
];
