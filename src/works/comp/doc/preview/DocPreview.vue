<script setup lang="ts">
import { computed } from "vue";
import { CodeBlock, WidgetTabs } from "@/works/comp";
import { highlightDemoCode, highlightTsCode } from "../demo/demoCodeHighlight";

defineProps<{ name: string }>();

const sampleCode = `function greet(name: string) {
  return \`Hello, \${name}!\`;
}

const result = greet("World");
console.log(result);`;

const highlightedSample = computed(() => highlightTsCode(sampleCode));

const innerCode = `<div style="padding: 24px; text-align: center; color: #666">
  这是预览区域，放置组件实际效果
</div>`;
const highlightedInner = computed(() => highlightDemoCode(innerCode));

const flushCode = `<div style="background: linear-gradient(135deg, #667eea, #764ba2); height: 120px;">
  全宽内容区
</div>`;
const highlightedFlush = computed(() => highlightDemoCode(flushCode));
</script>

<template>
  <CodeBlock v-if="name === 'code-block'" :code="sampleCode" :highlighted="highlightedSample" />
  <CodeBlock v-else-if="name === 'code-block-plain'" :code="sampleCode" />
  <div
    v-else-if="name === 'code-block-theme'"
    style="--code-block-bg: #1e1e2e; --code-block-text: #cdd6f4; --code-block-comment: #6c7086"
  >
    <CodeBlock :code="sampleCode" :highlighted="highlightedSample" />
  </div>
  <WidgetTabs v-else-if="name === 'widget-tabs'" :code="innerCode" :highlighted="highlightedInner">
    <div style="padding: 24px; text-align: center; color: #666">这是预览区域，放置组件实际效果</div>
  </WidgetTabs>
  <WidgetTabs
    v-else-if="name === 'widget-tabs-flush'"
    :code="flushCode"
    :highlighted="highlightedFlush"
    flush
  >
    <div class="doc-preview__flush">全宽内容区</div>
  </WidgetTabs>
</template>

<style scoped lang="scss">
.doc-preview__flush {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 120px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  font-size: 18px;
}
</style>
