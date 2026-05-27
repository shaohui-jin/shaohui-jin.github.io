<script setup lang="ts">
import { provide, reactive, watch, ref, onMounted, inject } from "vue";
import { ElConfigProvider } from "element-plus";
import type { LibConfig, ResolvedLibConfig } from "./configTypes";
import { defaultLibConfig } from "./configDefaults";
import { LIB_CONFIG_KEY, configToCssVars } from "./configInjection";
import { elementPlusLocale } from "./elementPlusLocale";

defineOptions({ name: "ConfigProvider" });

const props = defineProps<{
  theme?: LibConfig["theme"];
  table?: LibConfig["table"];
}>();

const parent = inject<ResolvedLibConfig>(LIB_CONFIG_KEY, defaultLibConfig);

const merged = reactive<ResolvedLibConfig>({
  theme: { ...parent.theme, ...props.theme },
  table: { ...parent.table, ...props.table },
});

watch(
  [() => props.theme, () => props.table, () => ({ ...parent.theme }), () => ({ ...parent.table })],
  () => {
    Object.assign(merged.theme, parent.theme, props.theme);
    Object.assign(merged.table, parent.table, props.table);
  },
  { deep: true },
);

provide(LIB_CONFIG_KEY, merged);

const root = ref<HTMLElement | null>(null);

onMounted(() => {
  syncCssVars();
});

watch(merged, syncCssVars, { deep: true });

function syncCssVars() {
  if (!root.value) return;
  const vars = configToCssVars(merged);
  Object.entries(vars).forEach(([key, value]) => {
    root.value!.style.setProperty(key, value);
  });
}
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
