/**
 * 跨页面传「要展开哪个项目」。
 *
 * 首页点项目卡时先记下来，切到作品页后取走并清空。
 * 不用 URL 参数：作品页是单路由，地址里挂 query 会和壳层的
 * pushState 同步逻辑打架，收益只有「可分享」，不值得。
 */

let pending: string | null = null;

export function setPendingProject(name: string): void {
  pending = name;
}

/** 取一次就清空，避免返回作品页时又自动展开 */
export function takePendingProject(): string | null {
  const value = pending;
  pending = null;
  return value;
}
