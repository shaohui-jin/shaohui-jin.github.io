<script setup lang="ts">
import { ref } from "vue";
import { ImageCarousel } from "jsh-comp";
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

const currentIndex = ref(2);
const eventLog = ref("—");

function onChange(index: number) {
  eventLog.value = `change → index: ${index}`;
}

const autoplayDemoCode = `<ImageCarousel
  :image-urls="urls"
  loop
  autoplay
  :interval="2000"
  @change="onChange"
/>`;

const api: ComponentApi = {
  props: [
    { name: "imageUrls", type: "string[]", default: "—", required: true, desc: "图片地址列表" },
    { name: "index / v-model:index", type: "number", default: "—", required: false, desc: "当前选中下标（受控）" },
    { name: "defaultIndex", type: "number", default: "0", required: false, desc: "默认选中下标（非受控）" },
    { name: "loop", type: "boolean", default: "false", required: false, desc: "首尾循环" },
    { name: "autoplay", type: "boolean", default: "false", required: false, desc: "自动轮播" },
    { name: "interval", type: "number", default: "3000", required: false, desc: "自动轮播间隔（ms）" },
    { name: "showArrows", type: "boolean", default: "true", required: false, desc: "显示左右箭头" },
  ],
  events: [
    { name: "change", payload: "(index: number)", desc: "当前下标变化" },
    { name: "update:index", payload: "(index: number)", desc: "v-model:index 更新" },
    { name: "click-item", payload: "(index: number)", desc: "点击图片" },
  ],
};
</script>

<template>
  <div class="doc-content__header">
    <h2>ImageCarousel 3D 轮播</h2>
    <p>带透视旋转效果的图片轮播组件，支持受控下标、循环与自动播放</p>
  </div>

  <DemoWidgetTabs :code="demoCodes.imageCarousel">
    <ImageCarousel
      v-model:index="currentIndex"
      :image-urls="urls"
      @change="onChange"
    />
    <p class="widget-hint">当前下标：{{ currentIndex }}，最近事件：{{ eventLog }}</p>
  </DemoWidgetTabs>

  <h3 class="demo-subsection__title">自动轮播</h3>
  <DemoWidgetTabs :code="autoplayDemoCode">
    <ImageCarousel :image-urls="urls" loop autoplay :interval="2000" />
  </DemoWidgetTabs>

  <div class="api-section">
    <h3 class="api-section__title">ImageCarousel Props</h3>
    <ApiTable type="props" :rows="api.props" />
  </div>

  <div class="api-section">
    <h3 class="api-section__title">ImageCarousel Events</h3>
    <ApiTable type="events" :rows="api.events" />
  </div>
</template>

<style scoped lang="scss">
@use "../../style/demo";
</style>
