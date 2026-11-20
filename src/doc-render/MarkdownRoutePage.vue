<script setup lang="ts">
import { ref, watchEffect } from "vue";
import MarkdownRenderer from "./MarkdownRenderer.vue";

const props = defineProps<{
  source?: string;
  sourceLoader?: () => Promise<string>;
  fileName?: string;
  apiTable?: boolean;
}>();

const content = ref(props.source ?? "");

watchEffect(() => {
  if (!props.sourceLoader) {
    content.value = props.source ?? "";
    return;
  }
  let cancelled = false;
  props.sourceLoader().then((text) => {
    if (!cancelled) content.value = text;
  });
  return () => {
    cancelled = true;
  };
});
</script>

<template>
  <section class="markdown-route-page">
    <div v-if="fileName" class="markdown-route-page__meta">来源：{{ fileName }}</div>
    <MarkdownRenderer :source="content" :api-table="apiTable" />
  </section>
</template>

<style scoped lang="scss">
@use "../styles/site/variables" as *;

.markdown-route-page {
  max-width: 880px;
}

.markdown-route-page__meta {
  margin-bottom: $doc-sp-md;
  font-size: $doc-fs-xs;
  opacity: 0.7;
}
</style>
