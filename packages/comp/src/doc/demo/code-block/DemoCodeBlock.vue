<script setup lang="ts">
import { ref, computed } from "vue";
import { CodeBlock } from "jsh-comp";
import type { ComponentApi } from "../../type/types";
import ApiTable from "../ApiTable.vue";
import DemoWidgetTabs from "../DemoWidgetTabs.vue";
import { demoCodes } from "../demoCodes";
import { highlightTsCode } from "../demoCodeHighlight";

const sampleCode = `function greet(name: string) {
  return \`Hello, \${name}!\`;
}

const result = greet("World");
console.log(result);`;

const highlightedSample = computed(() => highlightTsCode(sampleCode));

const basicDemoCode = `<CodeBlock :code="sampleCode" :highlighted="highlightedSample" />`;

const plainDemoCode = `<CodeBlock :code="sampleCode" />`;

const themeDemoCode = `<div style="--code-block-bg: #1e1e2e; --code-block-text: #cdd6f4; --code-block-comment: #6c7086;">
  <CodeBlock :code="sampleCode" :highlighted="highlightedSample" />
</div>`;

const api: ComponentApi = {
  props: [
    { name: "code", type: "string", default: "—", required: true, desc: "需要复制的原始代码文本" },
    { name: "highlighted", type: "string", default: "—", required: false, desc: "经 highlight 处理后的 HTML，不传则直接展示 code" },
  ],
};
</script>

<template>
  <div class="doc-content__header">
    <h2>CodeBlock</h2>
    <p>代码展示组件，支持语法高亮和一键复制。通过 CSS 变量可自定义主题。</p>
  </div>

  <DemoWidgetTabs :code="basicDemoCode">
    <CodeBlock :code="sampleCode" :highlighted="highlightedSample" />
  </DemoWidgetTabs>

  <h3 style="margin-top: 32px">纯文本模式</h3>
  <p>不传 <code>highlighted</code> 时直接展示原始文本：</p>
  <DemoWidgetTabs :code="plainDemoCode">
    <CodeBlock :code="sampleCode" />
  </DemoWidgetTabs>

  <h3 style="margin-top: 32px">自定义主题</h3>
  <p>通过 CSS 变量覆盖外观：</p>
  <DemoWidgetTabs :code="themeDemoCode">
    <div style="--code-block-bg: #1e1e2e; --code-block-text: #cdd6f4; --code-block-comment: #6c7086;">
      <CodeBlock :code="sampleCode" :highlighted="highlightedSample" />
    </div>
  </DemoWidgetTabs>

  <div class="api-section">
    <h3 class="api-section__title">CodeBlock Props</h3>
    <ApiTable type="props" :rows="api.props" />
  </div>
</template>

<style scoped lang="scss">
@use "../../style/demo";
</style>
