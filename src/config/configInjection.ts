import type { App, InjectionKey } from "vue";
import { reactive, watchEffect } from "vue";
import type { LibConfig, ResolvedLibConfig } from "./configTypes";
import { defaultLibConfig } from "./configDefaults";

/** provide/inject 用的 key */
export const LIB_CONFIG_KEY: InjectionKey<ResolvedLibConfig> = Symbol("comp-lib-config");

/** 持久化选项 */
export interface PersistOptions {
  /** localStorage key，默认 "comp-lib-config" */
  key?: string;
  /** 是否启用持久化 */
  enabled: boolean;
}

// ─── localStorage 工具 ───────────────────────────────────────

const DEFAULT_STORAGE_KEY = "comp-lib-config";

function readFromStorage(key?: string): LibConfig | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    const raw = localStorage.getItem(key ?? DEFAULT_STORAGE_KEY);
    return raw ? JSON.parse(raw) : undefined;
  } catch {
    return undefined;
  }
}

function writeToStorage(config: LibConfig, key?: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key ?? DEFAULT_STORAGE_KEY, JSON.stringify(config));
  } catch {
    /* quota exceeded 等异常静默 */
  }
}

// ─── 核心逻辑 ────────────────────────────────────────────────

/** 深度合并用户配置与默认值 */
function resolveConfig(userConfig?: LibConfig): ResolvedLibConfig {
  const theme = { ...defaultLibConfig.theme, ...userConfig?.theme };
  const table = { ...defaultLibConfig.table, ...userConfig?.table };
  return { theme, table };
}

/** 将 resolved config 映射为 CSS 自定义属性名/值 */
function configToCssVars(config: ResolvedLibConfig): Record<string, string> {
  const { theme, table } = config;
  return {
    // ── 组件库自有变量 ──
    "--comp-color-primary": theme.colorPrimary,
    "--comp-color-success": theme.colorSuccess,
    "--comp-color-warning": theme.colorWarning,

    "--comp-text-heading": theme.textHeading,
    "--comp-text-primary": theme.textPrimary,
    "--comp-text-regular": theme.textRegular,
    "--comp-text-secondary": theme.textSecondary,

    "--comp-bg-page": theme.bgPage,
    "--comp-bg-card": theme.bgCard,
    "--comp-bg-subtle": theme.bgSubtle,
    "--comp-bg-muted": theme.bgMuted,

    "--comp-border-color": theme.borderColor,
    "--comp-border-medium": theme.borderMedium,

    "--comp-font-family": theme.fontFamily,
    "--comp-font-size-base": `${theme.fontSizeBase}px`,
    "--comp-font-size-sm": `${theme.fontSizeSm}px`,

    "--comp-radius-sm": `${theme.radiusSm}px`,
    "--comp-radius-md": `${theme.radiusMd}px`,

    "--comp-table-row-height": `${table.rowHeight}px`,
    "--comp-table-header-height": `${table.headerHeight}px`,
    "--comp-table-font-size-cell": `${table.fontSizeCell}px`,
    "--comp-table-font-size-empty": `${table.fontSizeEmpty}px`,
    "--comp-table-header-font-weight": String(table.headerFontWeight),
    "--comp-table-cell-font-weight": String(table.cellFontWeight),

    // ── Element Plus 全局变量同步 ──
    "--el-color-primary": theme.colorPrimary,
    "--el-color-success": theme.colorSuccess,
    "--el-color-warning": theme.colorWarning,

    "--el-text-color-primary": theme.textPrimary,
    "--el-text-color-regular": theme.textRegular,
    "--el-text-color-secondary": theme.textSecondary,
    "--el-text-color-placeholder": theme.textSecondary,

    "--el-bg-color": theme.bgCard,
    "--el-bg-color-page": theme.bgPage,
    "--el-bg-color-overlay": theme.bgCard,

    "--el-border-color": theme.borderColor,
    "--el-border-color-light": theme.borderColor,
    "--el-border-color-lighter": theme.borderMedium,

    "--el-fill-color-blank": theme.bgCard,
    "--el-fill-color-light": theme.bgSubtle,
    "--el-fill-color": theme.bgMuted,

    "--el-border-radius-base": `${theme.radiusMd}px`,
    "--el-border-radius-small": `${theme.radiusSm}px`,

    "--el-font-size-base": `${theme.fontSizeBase}px`,
    "--el-font-size-small": `${theme.fontSizeSm}px`,
    "--el-font-family": theme.fontFamily,
  };
}

/** 将 CSS 变量注入到指定 element（默认 :root） */
function applyCssVars(config: ResolvedLibConfig, el?: HTMLElement): void {
  const target = el ?? document.documentElement;
  const vars = configToCssVars(config);
  Object.entries(vars).forEach(([key, value]) => {
    target.style.setProperty(key, value);
  });
}

/**
 * 创建组件库插件（工厂模式）
 *
 * 配置在初始化时固化：代码默认值 → localStorage 覆盖 → 注入 provide + CSS 变量。
 * 运行时不做实时修改，通过 saveConfig 写入 localStorage 在下次加载时生效。
 */
export function createCompLib(userConfig?: LibConfig, persist?: PersistOptions) {
  const storageKey = persist?.key ?? DEFAULT_STORAGE_KEY;
  const base = resolveConfig(userConfig);

  const stored = persist?.enabled ? readFromStorage(storageKey) : undefined;
  const initial: ResolvedLibConfig = stored
    ? { theme: { ...base.theme, ...stored.theme }, table: { ...base.table, ...stored.table } }
    : base;

  const resolved = reactive(initial) as ResolvedLibConfig;

  return {
    install(app: App) {
      app.provide(LIB_CONFIG_KEY, resolved);

      if (typeof document !== "undefined") {
        applyCssVars(resolved);
      }

      app.config.globalProperties.$compLibConfig = resolved;
    },

    /** 保存配置：同步更新内存 + localStorage + CSS 变量，切换页面即可见 */
    saveConfig(newConfig: LibConfig) {
      if (newConfig.theme) Object.assign(resolved.theme, newConfig.theme);
      if (newConfig.table) Object.assign(resolved.table, newConfig.table);

      if (typeof document !== "undefined") {
        applyCssVars(resolved);
      }

      if (persist?.enabled) {
        writeToStorage({ theme: { ...resolved.theme }, table: { ...resolved.table } }, storageKey);
      }
    },

    /** 当前已解析的完整配置（响应式） */
    config: resolved,
  };
}

export { resolveConfig, applyCssVars, configToCssVars };

/** watchEffect 辅助：当 config 变化时自动同步 CSS 变量到目标元素 */
export function useCssVarsSync(config: ResolvedLibConfig, el?: () => HTMLElement | null) {
  watchEffect(() => {
    const target = el?.() ?? (typeof document !== "undefined" ? document.documentElement : null);
    if (!target) return;
    const vars = configToCssVars(config);
    Object.entries(vars).forEach(([key, value]) => {
      target.style.setProperty(key, value);
    });
  });
}
