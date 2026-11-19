<script setup lang="ts">
import { ref } from "vue";
import { CanvasCountUp, CanvasTime } from "@/works/comp";

defineProps<{ name: string }>();

const countUpRef = ref<InstanceType<typeof CanvasCountUp>>();
const eventLog = ref("—");

function replay() {
  countUpRef.value?.restart();
  eventLog.value = "—";
}
</script>

<template>
  <div v-if="name === 'canvas-time'" class="canvas-time-wrapper">
    <CanvasTime color="#333333" bg-color="#f9f9fb" />
  </div>

  <div v-else-if="name === 'canvas-count-up'">
    <div class="canvas-count-up-demo">
      <CanvasCountUp
        ref="countUpRef"
        :value="98765"
        :duration="2000"
        @finish="eventLog = 'finish → 动画完成'"
      >
        <div class="canvas-count-up-demo__meta">
          <span class="canvas-count-up-demo__trend">↑ 12.5%</span>
          <span>总访问量</span>
        </div>
      </CanvasCountUp>
      <el-button size="small" class="canvas-count-up-demo__replay" @click="replay">重播</el-button>
    </div>
    <p class="widget-hint">最近事件：{{ eventLog }}</p>
  </div>
</template>

<style scoped lang="scss">
@use "../style/variables" as *;
@use "../style/demo";

.canvas-time-wrapper {
  height: 280px;
}

.canvas-count-up-demo {
  padding: 20px;
  text-align: center;
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
