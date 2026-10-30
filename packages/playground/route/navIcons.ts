/**
 * 顶部导航 / 移动端底栏的图标与短标签。
 *
 * 图标统一 24×24 viewBox、stroke 描边，靠 currentColor 跟随主题色，
 * 这样切主题时不需要换图。`short` 是移动端底栏用的短标签，
 * 因为「组件文档」「画布编排」在 5 等分的底栏里放不下。
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
  docs: {
    short: "组件",
    paths:
      '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/>' +
      '<rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  },
  utils: {
    short: "工具",
    paths: '<polyline points="4 7 9 12 4 17"/><line x1="12" y1="17" x2="20" y2="17"/>',
  },
  "workflow-designer": {
    short: "画布",
    paths: '<path d="M12 3 3 8l9 5 9-5-9-5Z"/><path d="M3 13l9 5 9-5"/>',
  },
  blog: {
    short: "博客",
    paths:
      '<path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v18H6.5A2.5 2.5 0 0 1 4 17.5z"/>' +
      '<path d="M4 17.5A2.5 2.5 0 0 1 6.5 15H20"/>',
  },
  system: {
    short: "系统",
    paths:
      '<circle cx="12" cy="12" r="3.2"/>' +
      '<path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.8-.3 1.6 1.6 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1A1.6 1.6 0 0 0 9 19.4a1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.8 1.6 1.6 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1A1.6 1.6 0 0 0 4.6 9a1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3H9a1.6 1.6 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8V9a1.6 1.6 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1z"/>',
  },
};

export const fallbackNavVisual: NavVisual = {
  short: "更多",
  paths: '<circle cx="12" cy="12" r="9"/><path d="M12 8v8"/><path d="M8 12h8"/>',
};

export function getNavVisual(tabKey: string): NavVisual {
  return navVisuals[tabKey] ?? fallbackNavVisual;
}
