<script setup lang="ts">
import { computed } from "vue";
import { WidgetTabs } from "jsh-comp";
import type { ComponentApi } from "../../type/types";
import ApiTable from "../ApiTable.vue";
import DemoWidgetTabs from "../DemoWidgetTabs.vue";
import { demoCodes } from "../demoCodes";
import { highlightDemoCode } from "../demoCodeHighlight";

const innerCode = `<div style="padding: 24px; text-align: center; color: #666">
  这是预览区域，放置组件实际效果
</div>`;
const highlightedInner = computed(() => highlightDemoCode(innerCode));

const basicDemoCode = `<WidgetTabs :code="sourceCode" :highlighted="highlighted">
  <div style="padding: 24px; text-align: center; color: #666">
    这是预览区域，放置组件实际效果
  </div>
</WidgetTabs>`;

const flushCode = `<div style="background: linear-gradient(135deg, #667eea, #764ba2); height: 120px;">
  全宽内容区
</div>`;
const highlightedFlush = computed(() => highlightDemoCode(flushCode));

const flushDemoCode = `<WidgetTabs :code="sourceCode" :highlighted="highlighted" flush>
  <div style="background: linear-gradient(135deg, #667eea, #764ba2); height: 120px; display: flex; align-items: center; justify-content: center; color: #fff;">
    全宽内容区
  </div>
</WidgetTabs>`;

const api: ComponentApi = {
  props: [
    { name: "code", type: "string", default: "—", required: true, desc: "代码 Tab 展示的源代码文本" },
    { name: "highlighted", type: "string", default: "—", required: true, desc: "经 highlight 处理后的代码 HTML" },
    { name: "flush", type: "boolean", default: "true", required: false, desc: "预览区去除内边距" },
  ],
};
</script>

<template>
  <div class="doc-content__header">
    <h2>WidgetTabs</h2>
    <p>预览/代码切换容器，代码 Tab 内置 CodeBlock 提供复制功能。</p>
  </div>

  <DemoWidgetTabs :code="basicDemoCode">
    <WidgetTabs :code="innerCode" :highlighted="highlightedInner">
      <div style="padding: 24px; text-align: center; color: #666">
        这是预览区域，放置组件实际效果
      </div>
    </WidgetTabs>
  </DemoWidgetTabs>

  <h3 style="margin-top: 32px">贴边模式</h3>
  <p>设置 <code>flush</code>，预览区去除内边距：</p>
  <DemoWidgetTabs :code="flushDemoCode">
    <WidgetTabs :code="flushCode" :highlighted="highlightedFlush" flush>
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); height: 120px; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 18px;">
        全宽内容区
      </div>
    </WidgetTabs>
  </DemoWidgetTabs>

  <div class="api-section">
    <h3 class="api-section__title">WidgetTabs Props</h3>
    <ApiTable type="props" :rows="api.props" />
  </div>
</template>

<style scoped lang="scss">
@use "../../style/demo";
</style>
