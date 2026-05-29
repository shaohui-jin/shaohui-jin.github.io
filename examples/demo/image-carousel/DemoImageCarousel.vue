<script setup lang="ts">
import { ImageCarousel } from "comp-vue-lib";
import type { ComponentApi } from "../../type/types";
import ApiTable from "../ApiTable.vue";
import DemoWidgetTabs from "../DemoWidgetTabs.vue";
import { demoCodes } from "../demoCodes";

const urls = [
  "https://picsum.photos/seed/c1/400/300",
  "https://picsum.photos/seed/c2/400/300",
  "https://picsum.photos/seed/c3/400/300",
  "https://picsum.photos/seed/c4/400/300",
  "https://picsum.photos/seed/c5/400/300",
];

const api: ComponentApi = {
  props: [
    { name: "imageUrls", type: "string[]", default: "—", required: true, desc: "图片地址列表" },
    { name: "defaultIndex", type: "number", default: "0", required: false, desc: "默认选中下标" },
  ],
};
</script>

<template>
  <div class="doc-content__header">
    <h2>ImageCarousel 3D 轮播</h2>
    <p>带透视旋转效果的图片轮播组件</p>
  </div>

  <DemoWidgetTabs :code="demoCodes.imageCarousel">
    <ImageCarousel :image-urls="urls" :default-index="2" />
  </DemoWidgetTabs>

  <div class="api-section">
    <h3 class="api-section__title">ImageCarousel Props</h3>
    <ApiTable type="props" :rows="api.props" />
  </div>
</template>

<style scoped lang="scss">
@use "../../style/variables" as *;
@use "../../style/demo";
</style>
