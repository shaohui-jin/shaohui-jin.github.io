/**
 * URL 与路由状态之间的换算。
 *
 * 抽成独立模块而不是塞在 App.vue 里，是因为「首页文章卡」这类地方
 * 也需要拼出真实 href（右键新窗口打开、中键点击、爬虫抓取都依赖它）。
 * 两处各拼一套的话，将来改 base 或路径结构必然漏改一处。
 */
import { playgroundNavigation, resolveTabMeta } from "./runtimeRoutes";

/** 首页占根路径，不做 /home 这种冗余层级 */
export const HOME_TAB = playgroundNavigation.initialTabKey;

export interface RouteLocation {
  tabKey: string;
  routeKey: string;
}

/**
 * 状态 → URL 路径。
 *
 * 博客文章 key 带分级时保留斜杠，只编码每一段。
 */
export function buildPath(tabKey: string, routeKey: string): string {
  if (tabKey === HOME_TAB) return "/";
  if (!routeKey || routeKey === tabKey) return `/${tabKey}`;
  const tail = routeKey
    .split("/")
    .filter(Boolean)
    .map((part) => encodeURIComponent(part))
    .join("/");
  return tail ? `/${tabKey}/${tail}` : `/${tabKey}`;
}

/**
 * URL 路径 → 状态。识别不了返回 null，由调用方决定回退到哪。
 *
 * 读 `import.meta.env.BASE_URL` 而不是写死 `/`：现在部署在根路径，
 * base 是 `/`，这一步等于空操作；将来若改成 `/<repo>/` 子路径部署，
 * 不用再回来改这里。
 */
export function parsePath(pathname: string): RouteLocation | null {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  const path = base && pathname.startsWith(base) ? pathname.slice(base.length) : pathname;
  let segments: string[];
  try {
    segments = path.split("/").filter(Boolean).map(decodeURIComponent);
  } catch {
    // 非法百分号编码等异常：按无法解析处理，由调用方回落首页
    return null;
  }
  if (segments.length === 0) return { tabKey: HOME_TAB, routeKey: "" };

  const [head, ...rest] = segments;
  const legacy = legacyWorksLocation(head);
  if (legacy) return legacy;

  if (!resolveTabMeta(head)) return null;
  return { tabKey: head, routeKey: rest.join("/") };
}

/**
 * 旧顶栏地址。
 *
 * 组件文档、工具函数、画布编排、系统页都已迁出本仓库，
 * 已发出的链接统一落到作品页，不再渲染站内文档。
 */
function legacyWorksLocation(head: string): RouteLocation | null {
  if (head === "docs" || head === "utils" || head === "workflow-designer" || head === "system") {
    return { tabKey: "works", routeKey: "" };
  }
  return null;
}
