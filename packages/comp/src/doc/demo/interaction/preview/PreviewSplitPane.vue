<script setup lang="ts">
import { ref, onBeforeUnmount } from "vue";

const ratio = ref(0.5);
const dragging = ref(false);
const wrapRef = ref<HTMLDivElement>();

function onDown(e: PointerEvent) {
  dragging.value = true;
  (e.target as HTMLElement).setPointerCapture(e.pointerId);
}

function onMove(e: PointerEvent) {
  if (!dragging.value || !wrapRef.value) return;
  const rect = wrapRef.value.getBoundingClientRect();
  ratio.value = Math.min(0.8, Math.max(0.2, (e.clientX - rect.left) / rect.width));
}

function onUp(e: PointerEvent) {
  dragging.value = false;
  (e.target as HTMLElement).releasePointerCapture(e.pointerId);
}

function onDblClick() {
  ratio.value = 0.5;
}

onBeforeUnmount(() => {
  dragging.value = false;
});
</script>

<template>
  <div ref="wrapRef" class="split-pane" :class="{ 'split-pane--dragging': dragging }">
    <div class="split-pane__left" :style="{ width: `${ratio * 100}%` }">
      <div class="split-pane__panel">左侧面板 — 拖拽中间分隔条调整比例，双击还原</div>
    </div>
    <div
      class="split-pane__handle"
      @pointerdown="onDown"
      @pointermove="onMove"
      @pointerup="onUp"
      @pointercancel="onUp"
      @dblclick="onDblClick"
    />
    <div class="split-pane__right">
      <div class="split-pane__panel">右侧面板 — 适用于主从布局、配置页</div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.split-pane {
  display: flex;
  height: 200px;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  overflow: hidden;
  user-select: none;

  &--dragging {
    cursor: col-resize;
  }

  &__left {
    flex-shrink: 0;
    overflow: auto;
  }

  &__right {
    flex: 1;
    overflow: auto;
  }

  &__panel {
    padding: 16px;
    font-size: 13px;
    color: #606266;
    height: 100%;
    box-sizing: border-box;
  }

  &__left .split-pane__panel {
    background: #f0f9ff;
  }

  &__right .split-pane__panel {
    background: #fef9f0;
  }

  &__handle {
    width: 6px;
    flex-shrink: 0;
    background: #e4e7ed;
    cursor: col-resize;
    touch-action: none;

    &:hover {
      background: var(--el-color-primary, #409eff);
    }
  }
}
</style>
