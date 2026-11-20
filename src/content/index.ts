import { blogMeta } from "virtual:blog-meta";

/**
 * 博客内容索引。
 *
 * 内容源：`./posts/<groupKey>/<slug>.md`。标题、日期、分类与摘要等元数据由
 * `virtual:blog-meta` 在构建期生成，正文通过 `import.meta.glob` 按需加载。
 *
 * 路由标识规则（不兼容旧站 permalink）：
 *   posts/vue/vue-lifecycle.md → key = "blog-vue-lifecycle"、groupKey = "vue"
 * 文件名是全局唯一的 `{分组}-{短名}.md`，目录只表示分组。
 */

/** 分组定义的唯一来源：类型、校验、侧栏配色都从这里派生 */
const blogGroupList = [
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
] as const;

export type BlogGroupKey = (typeof blogGroupList)[number]["key"];

export const blogGroups: readonly BlogGroupConfig[] = blogGroupList;

const blogGroupKeys = new Set<string>(blogGroups.map((group) => group.key));

/** A = 纯标准 Markdown；B = 含 `:::` 容器；C = 含 demo 块 */
export interface BlogDocConfig {
  /** 全局唯一路由 key */
  key: string;
  /** 中文标题，取自 frontmatter.title */
  label: string;
  groupKey: BlogGroupKey;
  order: number;
  /** 相对 posts 的路径，如 `vue/vue-lifecycle.md` */
  file: string;
  fileName: string;
  date: string;
  category: string;
  headerDepth?: number;
  excerpt: string;
}

export interface BlogGroupConfig {
  key: BlogGroupKey;
  title: string;
  accent: string;
  order: number;
}

const rawModules = import.meta.glob("./posts/**/*.md", {
  query: "?raw",
  import: "default",
}) as Record<string, () => Promise<string>>;

/** 正文按需加载；file 形如 `vue/vue-lifecycle.md` */
export async function loadBlogSource(file: string): Promise<string> {
  const loader = rawModules[`./posts/${file}`];
  if (!loader) throw new Error(`[@/blog] 找不到内容文件：${file}`);
  return loader();
}

function resolveGroupKey(raw: string, file: string): BlogGroupKey {
  if (!blogGroupKeys.has(raw)) {
    throw new Error(`[@/blog] 未知分组目录「${raw}」，请在 blogGroups 中登记（文件：${file}）`);
  }
  return raw as BlogGroupKey;
}

function buildConfigs(): BlogDocConfig[] {
  const configs: BlogDocConfig[] = blogMeta.map((meta) => ({
    ...meta,
    groupKey: resolveGroupKey(meta.groupKey, meta.file),
    order: 0,
    fileName: meta.file.split("/").pop() ?? meta.file,
  }));

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
