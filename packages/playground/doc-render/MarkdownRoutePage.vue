<script setup lang="ts">
import MarkdownRenderer from "./MarkdownRenderer.vue";

defineProps<{
  source: string;
  fileName?: string;
}>();
</script>

<template>
  <section class="markdown-route-page">
    <div v-if="fileName" class="markdown-route-page__meta">来源：{{ fileName }}</div>
    <MarkdownRenderer :source="source" />
  </section>
</template>

<style scoped lang="scss">
.markdown-route-page {
  max-width: 880px;
}

.markdown-route-page__meta {
  margin-bottom: 12px;
  font-size: 12px;
  opacity: 0.7;
}
</style>
