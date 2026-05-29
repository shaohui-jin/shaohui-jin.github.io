<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { Image3DProps } from "@/type/basic";

defineOptions({ name: "Image3D" });

const props = withDefaults(defineProps<Image3DProps>(), {});

const imageRef = ref<HTMLImageElement>();
const range: [number, number] = [-10, 10];

function getRotation(r: [number, number], mousePos: number, length: number) {
  return r[0] + (r[1] - r[0]) * (mousePos / length);
}

onMounted(() => {
  const el = imageRef.value;
  if (!el) return;
  el.addEventListener("mousemove", (e) => {
    const { offsetX, offsetY } = e;
    const { width, height } = el.getBoundingClientRect();
    const rx = getRotation(range, offsetY, height);
    const ry = -getRotation(range, offsetX, width);
    el.style.setProperty("--rx", `${rx}deg`);
    el.style.setProperty("--ry", `${ry}deg`);
  });
  el.addEventListener("mouseleave", () => {
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  });
});
</script>

<template>
  <img ref="imageRef" class="lib-image" :src="props.src" />
</template>

<style scoped lang="scss">
.lib-image {
  border-radius: 10px;
  max-width: 100%;
  height: auto;
  transition: all 0.1s ease;

  &:hover {
    transform: perspective(500px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg));
    box-shadow: 0 4px 8px rgb(0 0 0 / 20%);
  }
}
</style>
