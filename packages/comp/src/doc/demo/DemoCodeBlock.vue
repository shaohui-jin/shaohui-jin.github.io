<script setup lang="ts">
/**
 * Demo 站包装：直接复用组件库的 CodeBlock，
 * 通过 CSS 变量注入 Demo 站的主题色。
 */
import { CodeBlock } from "jsh-comp";

defineProps<{
  code: string;
  highlighted: string;
}>();
</script>

<template>
  <CodeBlock :code="code" :highlighted="highlighted" />
</template>
