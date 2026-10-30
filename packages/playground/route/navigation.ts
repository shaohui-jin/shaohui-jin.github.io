import type { InjectionKey } from "vue";

/**
 * 站点内跳转能力。
 *
 * App.vue 把壳层的跳转方法 provide 出去，深层组件（首页文章卡片、
 * 浮层里的「打开完整配置」等）就不必各自持有 tab 状态。
 */
export interface PlaygroundNavigate {
  /** 切到某个顶部模块；传 routeKey 时同时定位到该模块下的具体路由 */
  to(tabKey: string, routeKey?: string): void;
}

export const PLAYGROUND_NAV_KEY: InjectionKey<PlaygroundNavigate> = Symbol("playground-navigate");
