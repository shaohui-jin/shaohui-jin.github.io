<script setup lang="ts">
import { computed } from "vue";
import type { DemoBlock } from "./createMarkdownEngine";

const props = defineProps<{
  demo: DemoBlock;
}>();

const srcdoc = computed(() => {
  const code = props.demo.code;
  if (/<html[\s>]/i.test(code)) return code;
  return `<!DOCTYPE html><html lang="zh-CN"><head><meta charset="utf-8"><style>body{margin:0;padding:12px;font-family:system-ui,sans-serif;font-size:14px;color:#303133}</style></head><body>${code}</body></html>`;
});
</script>

<template>
  <iframe class="vp-demo-html" :srcdoc="srcdoc" sandbox="allow-scripts allow-same-origin" />
</template>

<style scoped>
.vp-demo-html {
  display: block;
  width: 100%;
  min-height: 260px;
  border: 0;
  background: #fff;
}
</style>
