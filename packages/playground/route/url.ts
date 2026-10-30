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
 * 单路由模块的 routeKey 常与 tabKey 同名（workflow-designer），
 * 写成 /workflow-designer/workflow-designer 太冗余，收成一段。
 */
export function buildPath(tabKey: string, routeKey: string): string {
  if (tabKey === HOME_TAB) return "/";
  if (!routeKey || routeKey === tabKey) return `/${tabKey}`;
  return `/${tabKey}/${encodeURIComponent(routeKey)}`;
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
  const segments = path.split("/").filter(Boolean);
  if (segments.length === 0) return { tabKey: HOME_TAB, routeKey: "" };

  const [tabKey, ...rest] = segments;
  if (!resolveTabMeta(tabKey)) return null;
  return { tabKey, routeKey: rest.map(decodeURIComponent).join("/") };
}
