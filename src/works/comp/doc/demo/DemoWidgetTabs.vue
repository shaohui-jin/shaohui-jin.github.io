<script setup lang="ts">
/**
 * Demo 站包装：复用组件库的 WidgetTabs，注入 Demo 站主题。
 * 代码 Tab 按 vue 交给 CodeBlock 着色。
 */
import { useSlots } from "vue";
import { WidgetTabs } from "@/works/comp";

const props = withDefaults(
  defineProps<{
    code: string;
    flush?: boolean;
  }>(),
  { flush: false },
);

const slots = useSlots() as Readonly<Record<string, (() => unknown[]) | undefined>>;
</script>

<template>
  <WidgetTabs :code="props.code" lang="vue" :flush="flush">
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
