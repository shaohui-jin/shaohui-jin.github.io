<script setup lang="ts">
import { CanvasTime } from "jsh-comp";
import type { ComponentApi } from "../../type/types";
import ApiTable from "../ApiTable.vue";
import DemoWidgetTabs from "../DemoWidgetTabs.vue";
import { demoCodes } from "../demoCodes";

const api: ComponentApi = {
  props: [
    { name: "color", type: "string", default: '"#000000"', required: false, desc: "粒子颜色" },
    { name: "bgColor", type: "string", default: '"#ffffff"', required: false, desc: "画布背景色" },
  ],
};
</script>

<template>
  <div class="doc-content__header">
    <h2>CanvasTime 粒子时钟</h2>
    <p>Canvas 粒子动画实时时钟，粒子从四周汇聚成当前时间</p>
  </div>

  <DemoWidgetTabs :code="demoCodes.canvasTime">
    <div class="canvas-time-wrapper">
      <CanvasTime color="#333333" bg-color="#f9f9fb" />
    </div>
  </DemoWidgetTabs>

  <div class="api-section">
    <h3 class="api-section__title">CanvasTime Props</h3>
    <ApiTable type="props" :rows="api.props" />
  </div>
</template>

<style scoped lang="scss">
@use "../../style/variables" as *;
@use "../../style/demo";

.canvas-time-wrapper {
  height: 280px;
}

@media (max-width: $doc-bp-tablet) {
  .canvas-time-wrapper {
    height: 200px;
  }
}

@media (max-width: $doc-bp-mobile) {
  .canvas-time-wrapper {
    height: 160px;
  }
}
</style>
