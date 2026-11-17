import { inject, computed, type Ref } from "vue";
import type { LibConfig, ResolvedLibConfig } from "./configTypes";
import { defaultLibConfig } from "./configDefaults";
import { LIB_CONFIG_KEY } from "./configInjection";

/**
 * 组件内消费配置的 composable
 *
 * 优先级：组件 props.theme > ConfigProvider > 全局 install 配置 > 默认值
 *
 * @param componentOverrides - 组件级 props 中的 theme 覆盖（可选，响应式）
 */
export function useLibConfig(
  componentOverrides?: Ref<LibConfig | undefined> | (() => LibConfig | undefined),
) {
  const injected = inject(LIB_CONFIG_KEY, defaultLibConfig);

  const resolved = computed<ResolvedLibConfig>(() => {
    const overrides =
      typeof componentOverrides === "function" ? componentOverrides() : componentOverrides?.value;

    const base = injected;

    if (!overrides) {
      return {
        theme: { ...base.theme },
      };
    }

    return {
      theme: { ...base.theme, ...overrides.theme },
    };
  });

  return resolved;
}
