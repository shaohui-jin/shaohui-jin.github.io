<script setup lang="ts">
import { ref } from "vue";
import type { Image3DProps } from "@/works/comp/type/basic";

defineOptions({ name: "Image3D" });

const props = withDefaults(defineProps<Image3DProps>(), {});

const imageRef = ref<HTMLImageElement>();
const isActive = ref(false);
const range: [number, number] = [-10, 10];

function getRotation(r: [number, number], pos: number, length: number) {
  return r[0] + (r[1] - r[0]) * (pos / length);
}

function applyRotation(clientX: number, clientY: number) {
  const el = imageRef.value;
  if (!el) return;
  const rect = el.getBoundingClientRect();
  const offsetX = clientX - rect.left;
  const offsetY = clientY - rect.top;
  const rx = getRotation(range, offsetY, rect.height);
  const ry = -getRotation(range, offsetX, rect.width);
  el.style.setProperty("--rx", `${rx}deg`);
  el.style.setProperty("--ry", `${ry}deg`);
  isActive.value = true;
}

function resetRotation() {
  const el = imageRef.value;
  if (!el) return;
  el.style.setProperty("--rx", "0deg");
  el.style.setProperty("--ry", "0deg");
  isActive.value = false;
}

function onMouseMove(e: MouseEvent) {
  applyRotation(e.clientX, e.clientY);
}

function onTouchMove(e: TouchEvent) {
  const touch = e.touches[0];
  if (touch) applyRotation(touch.clientX, touch.clientY);
}

function onTouchStart(e: TouchEvent) {
  const touch = e.touches[0];
  if (touch) applyRotation(touch.clientX, touch.clientY);
}
</script>

<template>
  <img
    ref="imageRef"
    class="lib-image"
    :class="{ 'is-active': isActive }"
    :src="props.src"
    @mousemove="onMouseMove"
    @mouseleave="resetRotation"
    @touchstart.passive="onTouchStart"
    @touchmove.passive="onTouchMove"
    @touchend="resetRotation"
    @touchcancel="resetRotation"
  />
</template>

<style scoped lang="scss">
.lib-image {
  border-radius: 10px;
  max-width: 100%;
  height: auto;
  transition:
    transform 0.1s ease,
    box-shadow 0.1s ease;
  transform: perspective(500px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg));

  &.is-active,
  &:hover {
    box-shadow: 0 4px 8px rgb(0 0 0 / 20%);
  }
}
</style>
