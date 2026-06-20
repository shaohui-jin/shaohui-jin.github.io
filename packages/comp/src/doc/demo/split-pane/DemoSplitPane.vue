<script setup lang="ts">
import { ref } from "vue";
import { SplitPane } from "jsh-comp";
import type { ComponentApi } from "../../type/types";
import ApiTable from "../ApiTable.vue";
import DemoWidgetTabs from "../DemoWidgetTabs.vue";
import { demoCodes } from "../demoCodes";

const ratio = ref(0.5);
const eventLog = ref("—");

function onChange(value: number) {
  eventLog.value = `change → ratio: ${value.toFixed(2)}`;
}

const api: ComponentApi = {
  props: [
    { name: "ratio / v-model:ratio", type: "number", default: "0.5", required: false, desc: "左侧面板占比（0~1）" },
    { name: "minRatio", type: "number", default: "0.2", required: false, desc: "最小占比" },
    { name: "maxRatio", type: "number", default: "0.8", required: false, desc: "最大占比" },
  ],
  events: [
    { name: "update:ratio", payload: "(ratio: number)", desc: "v-model:ratio 更新" },
    { name: "change", payload: "(ratio: number)", desc: "拖拽或双击还原后比例变化" },
  ],
};
</script>

<template>
  <div class="doc-content__header">
    <h2>SplitPane 分割面板</h2>
    <p>可拖拽调整左右面板比例的分割布局，双击分隔条可还原默认比例</p>
  </div>

  <DemoWidgetTabs :code="demoCodes.splitPane">
    <SplitPane v-model:ratio="ratio" class="split-pane-demo" @change="onChange">
      <template #left>
        <div class="split-pane-demo__panel split-pane-demo__panel--left">
          左侧面板 — 拖拽中间分隔条调整比例，双击还原
        </div>
      </template>
      <template #right>
        <div class="split-pane-demo__panel split-pane-demo__panel--right">
          右侧面板 — 适用于主从布局、配置页
        </div>
      </template>
    </SplitPane>
    <p class="widget-hint">当前比例：{{ ratio.toFixed(2) }}，最近事件：{{ eventLog }}</p>
  </DemoWidgetTabs>

  <div class="api-section">
    <h3 class="api-section__title">SplitPane Props</h3>
    <ApiTable type="props" :rows="api.props" />
  </div>

  <div class="api-section">
    <h3 class="api-section__title">SplitPane Events</h3>
    <ApiTable type="events" :rows="api.events" />
  </div>
</template>

<style scoped lang="scss">
@use "../../style/demo";

.split-pane-demo {
  height: 200px;
}

.split-pane-demo__panel {
  padding: 16px;
  font-size: 13px;
  color: #606266;
  height: 100%;
  box-sizing: border-box;

  &--left {
    background: #f0f9ff;
  }

  &--right {
    background: #fef9f0;
  }
}
</style>
