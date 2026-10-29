<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import type { DemoBlock } from "./createMarkdownEngine";
import { renderMermaid } from "./mermaidRuntime";

const props = defineProps<{ demo: DemoBlock }>();

const svg = ref("");
const error = ref("");
const loading = ref(true);

let disposed = false;

async function renderDiagram(): Promise<void> {
  loading.value = true;
  error.value = "";
  svg.value = "";

  try {
    const output = await renderMermaid(props.demo.code);
    if (disposed) return;
    svg.value = output;
  } catch (err) {
    if (disposed) return;
    error.value = err instanceof Error ? err.message : String(err);
  } finally {
    if (!disposed) loading.value = false;
  }
}

onMounted(() => {
  void renderDiagram();
});

watch(
  () => props.demo.code,
  () => {
    void renderDiagram();
  },
);

onBeforeUnmount(() => {
  disposed = true;
});
</script>

<template>
  <div class="vp-mermaid">
    <div v-if="loading" class="vp-mermaid__hint">图表渲染中…</div>

    <div v-else-if="error" class="vp-mermaid__error">
      <div class="vp-mermaid__error-title">Mermaid 渲染失败</div>
      <pre class="vp-mermaid__error-msg">{{ error }}</pre>
      <pre class="vp-mermaid__fallback"><code>{{ demo.code }}</code></pre>
    </div>

    <div v-else class="vp-mermaid__canvas" v-html="svg" />
  </div>
</template>

<style scoped lang="scss">
@use "../style/variables" as *;

.vp-mermaid {
  margin: $doc-sp-md 0;
  padding: $doc-sp-md;
  border: 1px solid $doc-border-color;
  border-radius: $doc-radius-lg;
  background: $doc-bg-subtle;
  overflow-x: auto;
  text-align: center;

  &__hint {
    padding: $doc-sp-lg 0;
    font-size: $doc-fs-sm;
    color: $doc-text-secondary;
  }

  &__canvas :deep(svg) {
    max-width: 100%;
    height: auto;
  }

  &__error {
    text-align: left;
  }

  &__error-title {
    font-weight: 500;
    color: #f56c6c;
    margin-bottom: $doc-sp-xs;
  }

  &__error-msg {
    margin: 0 0 $doc-sp-sm;
    padding: $doc-sp-sm;
    font-family: $doc-font-mono;
    font-size: $doc-fs-xs;
    color: #f56c6c;
    background: rgba(245, 108, 108, 0.08);
    border-radius: $doc-radius-sm;
    white-space: pre-wrap;
  }

  &__fallback {
    margin: 0;
    padding: $doc-sp-sm;
    background: $doc-bg-card;
    border-radius: $doc-radius-sm;
    overflow-x: auto;
  }

  &__fallback code {
    font-family: $doc-font-mono;
    font-size: $doc-fs-sm;
  }
}
</style>
