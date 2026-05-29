<script setup lang="ts">
import { TextOverflowArea } from "comp-vue-lib";
import type { ComponentApi } from "../../type/types";
import ApiTable from "../ApiTable.vue";
import DemoWidgetTabs from "../DemoWidgetTabs.vue";
import { demoCodes } from "../demoCodes";

const content =
  "这是一段很长的文本内容，TextOverflowArea 组件会在固定高度内显示文本，超出部分隐藏并在右侧显示省略号指示器。通过 CSS 浮动技巧实现纯样式的多行省略效果，无需 JS 计算行数，性能优秀。适用于文章摘要、评论预览等场景。这是一段很长的文本内容，TextOverflowArea 组件会在固定高度内显示文本，超出部分隐藏并在右侧显示省略号指示器。";

const api: ComponentApi = {
  props: [
    { name: "content", type: "string", default: "—", required: true, desc: "文本内容" },
    { name: "height", type: "number", default: "100", required: false, desc: "容器高度（px）" },
    { name: "padding", type: "number", default: "16", required: false, desc: "内边距（px）" },
  ],
};
</script>

<template>
  <div class="doc-content__header">
    <h2>TextOverflowArea 文本溢出</h2>
    <p>纯 CSS 多行文本溢出省略，无需 JS 计算</p>
  </div>

  <DemoWidgetTabs :code="demoCodes.textOverflowArea">
    <div style="background: #f6f6f7; border-radius: 8px">
      <TextOverflowArea :content="content" :height="100" />
    </div>
  </DemoWidgetTabs>

  <div class="api-section">
    <h3 class="api-section__title">TextOverflowArea Props</h3>
    <ApiTable type="props" :rows="api.props" />
  </div>
</template>

<style scoped lang="scss">
@use "../../style/variables" as *;
@use "../../style/demo";
</style>
