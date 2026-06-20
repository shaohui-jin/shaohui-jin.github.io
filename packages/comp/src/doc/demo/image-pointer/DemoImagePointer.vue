<script setup lang="ts">
import { ref } from "vue";
import { ImagePointer } from "jsh-comp";
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

const eventLog = ref("—");

function onHover(index: number) {
  eventLog.value = `hover → index: ${index}`;
}

function onClick(index: number) {
  eventLog.value = `click → index: ${index}`;
}

function onLeave() {
  eventLog.value = "leave";
}

const gapDemoCode = `<ImagePointer
  :image-urls="urls"
  :gap="12"
  pointer-color="#409eff"
  @hover="onHover"
  @click="onClick"
/>`;

const api: ComponentApi = {
  props: [
    { name: "imageUrls", type: "string[]", default: "—", required: true, desc: "图片地址列表" },
    { name: "index / v-model:index", type: "number", default: "—", required: false, desc: "当前高亮下标（受控）" },
    { name: "gap", type: "number", default: "20", required: false, desc: "图片间距（px）" },
    { name: "pointerColor", type: "string", default: "currentColor", required: false, desc: "指针边框颜色" },
  ],
  events: [
    { name: "hover", payload: "(index: number)", desc: "鼠标悬停某张图" },
    { name: "click", payload: "(index: number)", desc: "点击图片" },
    { name: "leave", payload: "—", desc: "鼠标离开容器" },
    { name: "update:index", payload: "(index: number)", desc: "v-model:index 更新" },
  ],
};
</script>

<template>
  <div class="doc-content__header">
    <h2>ImagePointer 图片指针</h2>
    <p>鼠标悬停时显示四角线框选中效果，支持点击与受控高亮</p>
  </div>

  <DemoWidgetTabs :code="demoCodes.imagePointer">
    <div style="padding: 24px">
      <ImagePointer
        :image-urls="urls"
        @hover="onHover"
        @click="onClick"
        @leave="onLeave"
      />
      <p class="widget-hint">最近事件：{{ eventLog }}</p>
    </div>
  </DemoWidgetTabs>

  <h3 class="demo-subsection__title">自定义间距与颜色</h3>
  <DemoWidgetTabs :code="gapDemoCode">
    <div style="padding: 24px">
      <ImagePointer :image-urls="urls" :gap="12" pointer-color="#409eff" />
    </div>
  </DemoWidgetTabs>

  <div class="api-section">
    <h3 class="api-section__title">ImagePointer Props</h3>
    <ApiTable type="props" :rows="api.props" />
  </div>

  <div class="api-section">
    <h3 class="api-section__title">ImagePointer Events</h3>
    <ApiTable type="events" :rows="api.events" />
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
