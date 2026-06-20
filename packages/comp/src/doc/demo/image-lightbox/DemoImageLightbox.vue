<script setup lang="ts">
import { ref } from "vue";
import { ImageLightbox } from "jsh-comp";
import type { ComponentApi } from "../../type/types";
import ApiTable from "../ApiTable.vue";
import DemoWidgetTabs from "../DemoWidgetTabs.vue";
import { demoCodes } from "../demoCodes";

const urls = [
  "https://picsum.photos/seed/lb1/800/600",
  "https://picsum.photos/seed/lb2/800/600",
  "https://picsum.photos/seed/lb3/800/600",
  "https://picsum.photos/seed/lb4/800/600",
];

const currentIndex = ref(0);
const eventLog = ref("—");

function onChange(index: number) {
  eventLog.value = `change → index: ${index}`;
}

function onOpen(index: number) {
  eventLog.value = `open → index: ${index}`;
}

function onClose() {
  eventLog.value = "close";
}

const api: ComponentApi = {
  props: [
    { name: "urls", type: "string[]", default: "—", required: true, desc: "图片地址列表" },
    { name: "index / v-model:index", type: "number", default: "0", required: false, desc: "当前预览索引" },
  ],
  events: [
    { name: "update:index", payload: "(index: number)", desc: "v-model:index 更新" },
    { name: "change", payload: "(index: number)", desc: "预览索引变化" },
    { name: "open", payload: "(index: number)", desc: "打开灯箱" },
    { name: "close", payload: "—", desc: "关闭灯箱" },
  ],
};
</script>

<template>
  <div class="doc-content__header">
    <h2>ImageLightbox 图片灯箱</h2>
    <p>缩略图网格 + 全屏灯箱预览，支持键盘左右切换与 Esc 关闭</p>
  </div>

  <DemoWidgetTabs :code="demoCodes.imageLightbox">
    <ImageLightbox
      v-model:index="currentIndex"
      :urls="urls"
      @change="onChange"
      @open="onOpen"
      @close="onClose"
    />
    <p class="widget-hint">当前索引：{{ currentIndex }}，最近事件：{{ eventLog }}</p>
  </DemoWidgetTabs>

  <div class="api-section">
    <h3 class="api-section__title">ImageLightbox Props</h3>
    <ApiTable type="props" :rows="api.props" />
  </div>

  <div class="api-section">
    <h3 class="api-section__title">ImageLightbox Events</h3>
    <ApiTable type="events" :rows="api.events" />
  </div>
</template>

<style scoped lang="scss">
@use "../../style/demo";
</style>
