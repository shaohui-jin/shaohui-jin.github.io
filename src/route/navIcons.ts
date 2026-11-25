/**
 * 顶部导航 / 移动端底栏的图标与短标签。
 *
 * 图标统一 24×24 viewBox、stroke 描边，靠 currentColor 跟随主题色，
 * 这样切主题时不需要换图。`short` 是移动端底栏用的短标签，
 * 底栏只放首页、博客、作品三个短标签。
 */
export interface NavVisual {
  /** 24×24 viewBox 内的 SVG 子节点 */
  paths: string;
  /** 移动端底栏短标签 */
  short: string;
}

export const navVisuals: Record<string, NavVisual> = {
  home: {
    short: "首页",
    paths: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5.5 9.5V20h13V9.5"/>',
  },
  works: {
    short: "作品",
    paths:
      '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/>' +
      '<rect x="3" y="14" width="7" height="7" rx="1.5"/><path d="M14 17.5h7M17.5 14v7"/>',
  },
  blog: {
    short: "博客",
    paths:
      '<path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v18H6.5A2.5 2.5 0 0 1 4 17.5z"/>' +
      '<path d="M4 17.5A2.5 2.5 0 0 1 6.5 15H20"/>',
  },
};

export const fallbackNavVisual: NavVisual = {
  short: "更多",
  paths: '<circle cx="12" cy="12" r="9"/><path d="M12 8v8"/><path d="M8 12h8"/>',
};

export function getNavVisual(tabKey: string): NavVisual {
  return navVisuals[tabKey] ?? fallbackNavVisual;
}
