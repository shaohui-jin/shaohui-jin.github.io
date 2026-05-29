<script setup lang="ts">
import { TextEraseArea } from "comp-vue-lib";
import type { ComponentApi } from "../../type/types";
import ApiTable from "../ApiTable.vue";
import DemoWidgetTabs from "../DemoWidgetTabs.vue";
import { demoCodes } from "../demoCodes";

const content =
  "这是一段演示文本，文本擦除区域组件会从左到右逐渐擦除显示内容，形成类似打字机反向的视觉效果。适合用于展示公告、提示语等场景，吸引用户注意力。";

const api: ComponentApi = {
  props: [
    { name: "content", type: "string", default: "—", required: true, desc: "文本内容" },
  ],
};
</script>

<template>
  <div class="doc-content__header">
    <h2>TextEraseArea 文本擦除</h2>
    <p>从左到右渐进擦除文本的动画组件</p>
  </div>

  <DemoWidgetTabs :code="demoCodes.textEraseArea">
    <div style="background: #f6f6f7; border-radius: 8px">
      <TextEraseArea :content="content" />
    </div>
  </DemoWidgetTabs>

  <div class="api-section">
    <h3 class="api-section__title">TextEraseArea Props</h3>
    <ApiTable type="props" :rows="api.props" />
  </div>
</template>

<style scoped lang="scss">
@use "../../style/variables" as *;
@use "../../style/demo";
</style>
