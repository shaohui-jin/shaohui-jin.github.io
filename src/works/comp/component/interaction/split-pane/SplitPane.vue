<script setup lang="ts">
import { ref, watch, onBeforeUnmount } from "vue";
import type { SplitPaneProps, SplitPaneEmits } from "@/works/comp/type/interaction";

defineOptions({ name: "SplitPane" });

const props = withDefaults(defineProps<SplitPaneProps>(), {
  ratio: 0.5,
  minRatio: 0.2,
  maxRatio: 0.8,
});

const emit = defineEmits<SplitPaneEmits>();

const innerRatio = ref(props.ratio);
const dragging = ref(false);
const wrapRef = ref<HTMLDivElement>();

watch(
  () => props.ratio,
  (v) => {
    innerRatio.value = v;
  },
);

function setRatio(v: number) {
  const clamped = Math.min(props.maxRatio, Math.max(props.minRatio, v));
  innerRatio.value = clamped;
  emit("update:ratio", clamped);
  emit("change", clamped);
}

function onDown(e: PointerEvent) {
  dragging.value = true;
  (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
}

function onMove(e: PointerEvent) {
  if (!dragging.value || !wrapRef.value) return;
  const rect = wrapRef.value.getBoundingClientRect();
  setRatio((e.clientX - rect.left) / rect.width);
}

function onUp(e: PointerEvent) {
  dragging.value = false;
  (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
}

function onDblClick() {
  setRatio(0.5);
}

onBeforeUnmount(() => {
  dragging.value = false;
});
</script>

<template>
  <div ref="wrapRef" class="split-pane" :class="{ 'split-pane--dragging': dragging }">
    <div class="split-pane__left" :style="{ width: `${innerRatio * 100}%` }">
      <slot name="left" />
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
      <slot name="right" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.split-pane {
  display: flex;
  height: 100%;
  min-height: 120px;
  border: 1px solid var(--comp-border-color, #e4e7ed);
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

  &__handle {
    width: 6px;
    flex-shrink: 0;
    background: var(--comp-border-color, #e4e7ed);
    cursor: col-resize;
    touch-action: none;

    &:hover {
      background: var(--el-color-primary, #409eff);
    }
  }
}
</style>
