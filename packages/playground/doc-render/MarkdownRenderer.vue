<script setup lang="ts">
import { computed } from "vue";
import { renderMarkdown } from "./createMarkdownEngine";

const props = withDefaults(
  defineProps<{
    source: string;
  }>(),
  {
    source: "",
  },
);

const renderedHtml = computed(() => renderMarkdown(props.source));
</script>

<template>
  <article class="markdown-body">
    <div class="markdown-body__content" v-html="renderedHtml" />
  </article>
</template>

<style scoped lang="scss">
@use "../style/variables" as *;

.markdown-body {
  color: $doc-text-primary;
  line-height: 1.75;

  :deep(h1),
  :deep(h2),
  :deep(h3) {
    color: $doc-text-heading;
    margin: 1.2em 0 0.6em;
  }

  :deep(p) {
    margin: 0.8em 0;
  }

  :deep(a) {
    color: $doc-color-primary;
    text-decoration: none;
  }

  :deep(pre) {
    overflow: auto;
    background: $doc-bg-subtle;
    border: 1px solid $doc-border-color;
    border-radius: $doc-radius-sm;
    padding: 12px;
  }

  :deep(code) {
    font-family: $doc-font-mono;
    font-size: $doc-fs-sm;
  }

  :deep(blockquote) {
    margin: 1em 0;
    padding: 8px 12px;
    border-left: 3px solid $doc-color-primary;
    background: $doc-bg-subtle;
  }
}
</style>
