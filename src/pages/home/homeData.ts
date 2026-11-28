/**
 * 门户首页内容数据。
 *
 * 只放「静态文案 + 外链」，文章数据一律从 `@/blog` 的内容索引实时推导，
 * 避免首页和博客模块两处维护同一份列表。
 *
 * 注意：本文件会被 HomePage.vue 引用，而 HomePage.vue 由
 * HomeRouteRegistrar 以懒加载方式引入，因此这里不要再反向 import
 * `route/runtimeRoutes`，否则会形成模块环。
 */

import { blogDocConfigs, blogGroups } from "@/blog";

export interface HomeProfile {
  name: string;
  avatar: string;
  /** 头像加载失败时的兜底文字 */
  avatarFallback: string;
  role: string;
  bio: string;
  repoUrl: string;
  repoLabel: string;
  /**
   * 关注方向与技术栈。
   * Hero 的终端窗口会把它们拼进 profile.json 展示，
   * 所以这里是「对外展示用」的短标签，不是完整的技能清单。
   */
  focus?: string[];
  stack?: string[];
}

export interface HomeSocialLink {
  label: string;
  href: string;
}

export interface HomeProject {
  name: string;
  desc: string;
  href: string;
  host: string;
  accent: string;
  /** 24×24 viewBox 内的 SVG 子节点 */
  icon: string;
  /** 底部动作文案，默认「访问」；指向仓库时用「源码」更准确 */
  action?: string;
  /** 占位卡：虚线边框 + 置灰 */
  placeholder?: boolean;
  /** GitHub owner/repo，作品页用它取 README 与仓库链接 */
  repo?: string;
  /** 仓库根目录没有 README 时，右侧只展示描述 */
  hasReadme?: boolean;
  /** 已部署的线上地址；没有就不显示预览 Tab */
  demo?: string;
}

/** 首屏文案与底图 */
export const homeHero = {
  title: "我站在风中，任你大雾四起",
  subtitles: ["谋生的路上不抛弃良知", "谋爱的路上不丢失尊严"],
  logo: "https://shaohui-jin.github.io/picx-images-hosting/blog/Logo/HomePage.231mqnxpdm.webp",
  /** 浅色底图（原站 white-001） */
  background:
    "https://shaohui-jin.github.io/picx-images-hosting/blog/Background/white-001.4qr310isuh.webp",
  /** 暗色底图（原站 black-001），主题为暗色时自动切换 */
  backgroundDark:
    "https://shaohui-jin.github.io/picx-images-hosting/blog/Background/black-001.ibvr6sk0w.webp",
};

export const homeProfile: HomeProfile = {
  name: "石怜安",
  avatar: "https://shaohui-jin.github.io/picx-images-hosting/blog/Logo/User.73tpi84jwb.gif",
  avatarFallback: "石",
  role: "前端工程师",
  bio: "笔记、源码和做过的项目，记在这里。",
  repoUrl: "https://github.com/shaohui-jin/shaohui-jin.github.io",
  repoLabel: "源码仓库",
  focus: ["组件设计", "工程化", "性能优化"],
  stack: ["Vue", "TypeScript", "Node"],
};

export const homeSocials: HomeSocialLink[] = [
  {
    label: "QQ",
    href: "http://wpa.qq.com/msgrd?v=3&uin=1051131737&site=qq&menu=yes",
  },
  { label: "QQ空间", href: "https://1051131737.qzone.qq.com/" },
  { label: "Gmail", href: "mailto:a1051131737@outlook.com" },
  { label: "微博", href: "https://weibo.com/6459900628/profile" },
  { label: "Gitee", href: "https://gitee.com/jin-shaohui" },
];

const REPO = "https://github.com/shaohui-jin";
const REPO_HOST = "github.com/shaohui-jin";

/**
 * 个人项目 —— 文案对齐 GitHub 仓库描述。
 *
 * 这几项多数以「Cursor 扩展 + Skill + MCP」三种形态同时提供，前缀重复度太高，
 * 统一收到区块描述里说明，卡片只留功能本身。描述控制在两行内
 * （`.home-project__desc` 有 line-clamp: 2）。
 */
export const homeProjects: HomeProject[] = [
  {
    name: "git-cockpit",
    desc: "用 MCP 让 Agent 安全操作 Git：合并预演、分支矩阵、写操作先 dry-run",
    href: `${REPO}/git-cockpit`,
    host: REPO_HOST,
    accent: "#409eff",
    action: "源码",
    repo: "git-cockpit",
    hasReadme: true,
    icon:
      '<circle cx="12" cy="12" r="9"/>' +
      '<path d="M12 12l4.5-4.5"/><circle cx="12" cy="12" r="1.6"/>',
  },
  {
    name: "git-insight",
    desc: "用 git merge-tree 在对象库里试合并：分支图、冲突预演、合入顺序、一键 MR",
    href: `${REPO}/git-insight`,
    host: REPO_HOST,
    accent: "#67c23a",
    action: "源码",
    repo: "git-insight",
    hasReadme: true,
    icon:
      '<line x1="6" y1="4" x2="6" y2="15"/>' +
      '<circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/>' +
      '<path d="M18 9a9 9 0 0 1-9 9"/>',
  },
  {
    name: "tool-box",
    desc: "杂七杂八的组件库、工具库",
    href: `${REPO}/tool-box`,
    host: REPO_HOST,
    accent: "#13a8a8",
    action: "源码",
    repo: "tool-box",
    hasReadme: true,
    demo: "https://shaohui-jin.github.io/tool-box/",
    icon:
      '<rect x="3" y="7" width="18" height="12" rx="2"/>' +
      '<path d="M3 11h18"/><path d="M9 7a3 3 0 0 1 6 0"/>',
  },
  {
    name: "china-history",
    desc: "中国历史可视化百科：事件、人物、政权与史料，串成可漫游的时间轴",
    href: `${REPO}/china-history`,
    host: REPO_HOST,
    accent: "#8d6e63",
    action: "源码",
    repo: "china-history",
    hasReadme: true,
    demo: "https://shaohui-jin.github.io/china-history/",
    icon:
      '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H19v18H6.5A2.5 2.5 0 0 1 4 18.5z"/>' +
      '<path d="M7 8h9M7 12h9M7 16h6"/>',
  },
  {
    name: "game-demo",
    desc: "一个小游戏复刻的网站",
    href: `${REPO}/game-demo`,
    host: REPO_HOST,
    accent: "#f56c6c",
    action: "源码",
    repo: "game-demo",
    hasReadme: false,
    demo: "https://shaohui-jin.github.io/game-demo/",
    icon:
      '<rect x="2" y="6" width="20" height="12" rx="4"/>' +
      '<line x1="6" y1="12" x2="10" y2="12"/><line x1="8" y1="10" x2="8" y2="14"/>' +
      '<line x1="15" y1="12" x2="15.01" y2="12"/><line x1="18" y1="10" x2="18.01" y2="10"/>',
  },
  {
    name: "comp-insight",
    desc: "Vue 组件依赖分析：依赖图、循环依赖、无用组件、扇入扇出",
    href: `${REPO}/comp-insight`,
    host: REPO_HOST,
    accent: "#9c27b0",
    action: "源码",
    repo: "comp-insight",
    hasReadme: true,
    icon:
      '<circle cx="12" cy="5" r="2.5"/><circle cx="5" cy="19" r="2.5"/><circle cx="19" cy="19" r="2.5"/>' +
      '<path d="M12 7.5v3.5M10.6 12.6 6.6 16.8M13.4 12.6l4 4.2"/>',
  },
  {
    name: "why-css-insight",
    desc: "CSS 失效诊断：对齐运行时、构建产物与源码",
    href: `${REPO}/why-css-insight`,
    host: REPO_HOST,
    accent: "#e6a23c",
    action: "源码",
    repo: "why-css-insight",
    hasReadme: true,
    icon: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.6-3.6"/><path d="M11 8v3.2"/>',
  },
  {
    name: "agent-lib",
    desc: "零依赖 TypeScript Agent 内核：手写 SSE、流式 tool_calls 聚合，事件日志即事实源",
    href: `${REPO}/agent-lib`,
    host: REPO_HOST,
    accent: "#d97757",
    action: "源码",
    repo: "agent-lib",
    hasReadme: true,
    icon:
      '<path d="M12 3v3M12 18v3M5 12H3M21 12h-3"/>' +
      '<circle cx="12" cy="12" r="6"/><path d="M9 12h1.5M13.5 12H15"/>',
  },
  {
    name: "更多项目",
    desc: "还没整理成卡片，先去 GitHub 翻一翻",
    href: `${REPO}?tab=repositories`,
    host: REPO_HOST,
    accent: "#909399",
    icon: '<circle cx="12" cy="12" r="9"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>',
    placeholder: true,
  },
];

export const homeFooter = {
  wish: "愿新的一年顺风顺水顺财神",
  copyright: "© 2026 石怜安",
};

/** 首页项目区块只铺 3 张卡，完整列表在作品页 */
export const HOME_PROJECT_LIMIT = 3;

// ============================================================
// 文章数据 —— 全部从 @/blog 的内容索引实时推导
// ============================================================

export interface HomeArticle {
  key: string;
  title: string;
  excerpt: string;
  date: string;
  groupKey: string;
  groupTitle: string;
  accent: string;
}

export interface HomeArticleGroup {
  key: string;
  title: string;
  accent: string;
  count: number;
}

/**
 * 生成文章摘要的职责已上移到构建期（build/blog-meta.ts），
 * 首页直接使用内容索引里的 excerpt，避免启动时扫描全部正文。
 */

const groupMeta = new Map(blogGroups.map((group) => [group.key, group]));

/** frontmatter 里的 date 形如 `2025-05-24 15:53:31`，展示层只要日期 */
function toDay(date: string): string {
  return date.slice(0, 10);
}

/** 全部文章，按发布时间倒序 */
export const homeArticles: HomeArticle[] = [...blogDocConfigs]
  .sort((a, b) => b.date.localeCompare(a.date) || a.key.localeCompare(b.key))
  .map((doc) => {
    const group = groupMeta.get(doc.groupKey);
    return {
      key: doc.key,
      title: doc.label,
      excerpt: doc.excerpt,
      date: toDay(doc.date),
      groupKey: doc.groupKey,
      groupTitle: group?.title ?? doc.groupKey,
      accent: group?.accent ?? "#409eff",
    };
  });

/** 有内容的分组，带篇数，供筛选片使用 */
export const homeArticleGroups: HomeArticleGroup[] = blogGroups
  .map((group) => ({
    key: group.key,
    title: group.title,
    accent: group.accent,
    count: blogDocConfigs.filter((doc) => doc.groupKey === group.key).length,
  }))
  .filter((group) => group.count > 0);

/** 最近一次更新的日期，展示在「关于我」右侧 */
export const homeLatestDate = homeArticles[0]?.date ?? "";

/** 首页只铺 6 张卡 */
export const HOME_ARTICLE_LIMIT = 6;
