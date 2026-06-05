<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from "vue";
import type { CanvasCountUpProps, CanvasCountUpEmits } from "@/type/interaction";

defineOptions({ name: "CanvasCountUp" });

const props = withDefaults(defineProps<CanvasCountUpProps>(), {
  duration: 2000,
});

const emit = defineEmits<CanvasCountUpEmits>();

const display = ref(0);
let startTime = 0;
let animId = 0;

function easeOut(t: number) {
  return 1 - (1 - t) ** 3;
}

function tick(now: number) {
  if (!startTime) startTime = now;
  const progress = Math.min(1, (now - startTime) / props.duration);
  display.value = Math.floor(easeOut(progress) * props.value);
  if (progress < 1) {
    animId = requestAnimationFrame(tick);
  } else {
    emit("finish");
  }
}

function start() {
  cancelAnimationFrame(animId);
  startTime = 0;
  display.value = 0;
  animId = requestAnimationFrame(tick);
}

watch(() => props.value, start);

onMounted(start);
onBeforeUnmount(() => cancelAnimationFrame(animId));

defineExpose({ restart: start });
</script>

<template>
  <div class="canvas-count-up">
    <div class="canvas-count-up__value">{{ display.toLocaleString() }}</div>
    <slot />
  </div>
</template>

<style scoped lang="scss">
.canvas-count-up {
  &__value {
    font-size: 36px;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
    line-height: 1.2;
  }
}
</style>
