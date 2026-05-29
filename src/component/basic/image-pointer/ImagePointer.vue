<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { ImagePointerProps } from "@/type/basic";

defineOptions({ name: "ImagePointer" });

defineProps<ImagePointerProps>();

const containerRef = ref<HTMLDivElement>();
const showPointer = ref(false);
const pointerStyle = ref({ "--x": "0px", "--y": "0px", "--w": "0px", "--h": "0px" });

onMounted(() => {
  const container = containerRef.value;
  if (!container) return;
  const items = container.querySelectorAll<HTMLElement>(".pointer-img");
  items.forEach((item) => {
    item.addEventListener("mouseenter", () => {
      pointerStyle.value = {
        "--x": `${item.offsetLeft}px`,
        "--y": `${item.offsetTop}px`,
        "--w": `${item.offsetWidth}px`,
        "--h": `${item.offsetHeight}px`,
      };
      showPointer.value = true;
    });
  });
});
</script>

<template>
  <div ref="containerRef" class="lib-image-pointer">
    <div v-show="showPointer" class="pointer" :style="pointerStyle" />
    <img v-for="(url, i) in imageUrls" :key="i" :src="url" class="pointer-img" />
  </div>
</template>

<style scoped lang="scss">
.lib-image-pointer {
  --gap: 20px;
  position: relative;
  display: flex;
  flex-wrap: wrap;

  .pointer-img {
    margin-right: var(--gap, 20px);
    margin-bottom: var(--gap, 20px);
    object-fit: cover;
    cursor: pointer;
    display: block;
  }

  .pointer {
    --l: 30px;
    --t: 3px;
    --g: calc(var(--gap) / 2);
    --w: 0px;
    --h: 0px;
    --x: 0px;
    --y: 0px;
    position: absolute;
    cursor: pointer;
    width: calc(var(--w) + var(--g) * 2);
    height: calc(var(--h) + var(--g) * 2);
    border: 3px solid currentcolor;
    left: calc(var(--x) - var(--g));
    top: calc(var(--y) - var(--g));
    box-sizing: border-box;
    transition: all 0.1s ease;
    mask: conic-gradient(at var(--l) var(--l), #0000 75%, red 75%) left top /
      calc(100% - var(--l)) calc(100% - var(--l)) repeat;
  }
}
</style>
