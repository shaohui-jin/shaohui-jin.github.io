<script setup lang="ts">
import { provide, reactive, watch, ref, inject } from "vue";
import { ElConfigProvider } from "element-plus";
import type { LibConfig, ResolvedLibConfig } from "./configTypes";
import { defaultLibConfig } from "./configDefaults";
import { LIB_CONFIG_KEY, useCssVarsSync } from "./configInjection";
import { elementPlusLocale } from "./elementPlusLocale";

defineOptions({ name: "ConfigProvider" });

const props = defineProps<{
  theme?: LibConfig["theme"];
}>();

const parent = inject<ResolvedLibConfig>(LIB_CONFIG_KEY, defaultLibConfig);

const merged = reactive<ResolvedLibConfig>({
  theme: { ...parent.theme, ...props.theme },
});

watch(
  [() => props.theme, () => ({ ...parent.theme })],
  () => {
    Object.assign(merged.theme, parent.theme, props.theme);
  },
  { deep: true },
);

provide(LIB_CONFIG_KEY, merged);

const root = ref<HTMLElement | null>(null);

// 子树内的局部覆盖通过 watchEffect 同步成 CSS 变量，等 root 挂载后自动补一次
useCssVarsSync(merged, () => root.value);
</script>

<template>
  <ElConfigProvider :locale="elementPlusLocale">
    <div ref="root" class="comp-config-provider">
      <slot />
    </div>
  </ElConfigProvider>
</template>

<style scoped>
.comp-config-provider {
  display: contents;
}
</style>
