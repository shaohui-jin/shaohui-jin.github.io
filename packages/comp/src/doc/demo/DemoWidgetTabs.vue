<script setup lang="ts">
/**
 * Demo 站包装：复用组件库的 WidgetTabs，
 * 注入 Demo 站主题 + 本地 highlight 逻辑。
 */
import { computed, useSlots } from "vue";
import { WidgetTabs } from "jsh-comp";
import { highlightDemoCode } from "./demoCodeHighlight";

const props = withDefaults(
  defineProps<{
    code: string;
    flush?: boolean;
  }>(),
  { flush: false },
);

const slots = useSlots() as Readonly<Record<string, (() => unknown[]) | undefined>>;
const highlightedCode = computed(() => highlightDemoCode(props.code));
</script>

<template>
  <WidgetTabs :code="props.code" :highlighted="highlightedCode" :flush="flush">
    <slot />
    <template v-if="slots.footer" #footer>
      <slot name="footer" />
    </template>
  </WidgetTabs>
</template>

<style scoped lang="scss">
@use "../style/variables" as *;
@use "../style/el-overrides" as ep;

:deep(.widget-tabs) {
  @include ep.el-tabs-border-card;
}
</style>
