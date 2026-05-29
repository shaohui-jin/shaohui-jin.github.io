<script setup lang="ts">
import { ImagePointer } from "comp-vue-lib";
import type { ComponentApi } from "../../type/types";
import ApiTable from "../ApiTable.vue";
import DemoWidgetTabs from "../DemoWidgetTabs.vue";
import { demoCodes } from "../demoCodes";

const urls = [
  "https://picsum.photos/seed/p1/150/120",
  "https://picsum.photos/seed/p2/180/120",
  "https://picsum.photos/seed/p3/120/120",
  "https://picsum.photos/seed/p4/160/120",
  "https://picsum.photos/seed/p5/140/120",
  "https://picsum.photos/seed/p6/170/120",
];

const api: ComponentApi = {
  props: [
    { name: "imageUrls", type: "string[]", default: "—", required: true, desc: "图片地址列表" },
  ],
};
</script>

<template>
  <div class="doc-content__header">
    <h2>ImagePointer 图片指针</h2>
    <p>鼠标悬停时显示四角线框选中效果</p>
  </div>

  <DemoWidgetTabs :code="demoCodes.imagePointer">
    <div style="padding: 24px">
      <ImagePointer :image-urls="urls" />
    </div>
  </DemoWidgetTabs>

  <div class="api-section">
    <h3 class="api-section__title">ImagePointer Props</h3>
    <ApiTable type="props" :rows="api.props" />
  </div>
</template>

<style scoped lang="scss">
@use "../../style/variables" as *;
@use "../../style/demo";

:deep(.pointer-img) {
  max-width: 100%;
  height: auto;
}

@media (max-width: $doc-bp-mobile) {
  :deep(.pointer-img) {
    width: calc(50% - 20px);
    height: auto !important;
  }
}
</style>
