<script setup lang="ts">
import { ref } from "vue";
import { CanvasCountUp } from "jsh-comp";
import type { ComponentApi } from "../../type/types";
import ApiTable from "../ApiTable.vue";
import DemoWidgetTabs from "../DemoWidgetTabs.vue";
import { demoCodes } from "../demoCodes";

const countUpRef = ref<InstanceType<typeof CanvasCountUp>>();
const eventLog = ref("—");

function onFinish() {
  eventLog.value = "finish → 动画完成";
}

function replay() {
  countUpRef.value?.restart();
  eventLog.value = "—";
}

const api: ComponentApi = {
  props: [
    { name: "value", type: "number", default: "—", required: true, desc: "目标数值" },
    { name: "duration", type: "number", default: "2000", required: false, desc: "动画时长（ms）" },
  ],
  events: [
    { name: "finish", payload: "—", desc: "数字滚动动画完成" },
  ],
  notes: [
    "通过 ref 调用 restart() 重新播放动画",
  ],
};
</script>

<template>
  <div class="doc-content__header">
    <h2>CanvasCountUp 数字滚动</h2>
    <p>数字递增动画组件，适用于数据大屏、统计卡片等场景</p>
  </div>

  <DemoWidgetTabs :code="demoCodes.canvasCountUp">
    <div class="canvas-count-up-demo">
      <CanvasCountUp ref="countUpRef" :value="98765" :duration="2000" @finish="onFinish">
        <div class="canvas-count-up-demo__meta">
          <span class="canvas-count-up-demo__trend">↑ 12.5%</span>
          <span class="canvas-count-up-demo__label">总访问量</span>
        </div>
      </CanvasCountUp>
      <el-button size="small" class="canvas-count-up-demo__replay" @click="replay">重播</el-button>
    </div>
    <p class="widget-hint">最近事件：{{ eventLog }}</p>
  </DemoWidgetTabs>

  <div class="api-section">
    <h3 class="api-section__title">CanvasCountUp Props</h3>
    <ApiTable type="props" :rows="api.props" />
  </div>

  <div class="api-section">
    <h3 class="api-section__title">CanvasCountUp Events</h3>
    <ApiTable type="events" :rows="api.events" />
    <ul v-if="api.notes?.length" class="api-notes-list">
      <li v-for="note in api.notes" :key="note">{{ note }}</li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
@use "../../style/demo";

.canvas-count-up-demo {
  text-align: center;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  color: #fff;

  &__meta {
    margin-top: 8px;
    font-size: 13px;
    opacity: 0.9;
  }

  &__trend {
    margin-right: 12px;
    color: #a8f0c6;
  }

  &__replay {
    margin-top: 12px;
  }

  :deep(.canvas-count-up__value) {
    color: #fff;
  }
}
</style>
