<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount, type CSSProperties } from "vue";
import type { ImagePointerProps, ImagePointerEmits } from "@/works/comp/type/basic";

defineOptions({ name: "ImagePointer" });

const props = withDefaults(defineProps<ImagePointerProps>(), {
  gap: 20,
  pointerColor: "currentColor",
});

const emit = defineEmits<ImagePointerEmits>();

const containerRef = ref<HTMLDivElement>();
const imgRefs = ref<(HTMLImageElement | null)[]>([]);
const innerIndex = ref<number | null>(null);
const activeStyle = ref<CSSProperties>({});

const gapStyle = computed(() => `${props.gap}px`);

function setImgRef(el: unknown, i: number) {
  imgRefs.value[i] = el as HTMLImageElement | null;
}

function updatePointer(el: HTMLElement, index: number) {
  const container = containerRef.value;
  if (!container) return;
  const cRect = container.getBoundingClientRect();
  const eRect = el.getBoundingClientRect();
  activeStyle.value = {
    "--x": `${eRect.left - cRect.left + container.scrollLeft}px`,
    "--y": `${eRect.top - cRect.top + container.scrollTop}px`,
    "--w": `${eRect.width}px`,
    "--h": `${eRect.height}px`,
    color: props.pointerColor,
  };
  innerIndex.value = index;
  emit("update:index", index);
  emit("hover", index);
}

function onEnter(index: number) {
  const el = imgRefs.value[index];
  if (el) updatePointer(el, index);
}

function onClick(index: number) {
  onEnter(index);
  emit("click", index);
}

function onLeave() {
  innerIndex.value = null;
  emit("leave");
}

function onImgLoad(index: number) {
  if (innerIndex.value === index) {
    const el = imgRefs.value[index];
    if (el) updatePointer(el, index);
  }
}

function syncControlledIndex(index: number) {
  const el = imgRefs.value[index];
  if (el) updatePointer(el, index);
}

function onDocumentTouch(e: TouchEvent) {
  const target = e.target as Node;
  if (containerRef.value && !containerRef.value.contains(target)) {
    onLeave();
  }
}

let resizeObserver: ResizeObserver | null = null;

watch(
  () => props.index,
  (val) => {
    if (val !== undefined) syncControlledIndex(val);
  },
);

watch(
  () => props.pointerColor,
  () => {
    if (innerIndex.value !== null) onEnter(innerIndex.value);
  },
);

onMounted(() => {
  if (props.index !== undefined) {
    syncControlledIndex(props.index);
  }
  if (containerRef.value) {
    resizeObserver = new ResizeObserver(() => {
      if (innerIndex.value !== null) onEnter(innerIndex.value);
    });
    resizeObserver.observe(containerRef.value);
  }
  document.addEventListener("touchstart", onDocumentTouch, { passive: true });
});

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
  document.removeEventListener("touchstart", onDocumentTouch);
});
</script>

<template>
  <div
    ref="containerRef"
    class="lib-image-pointer"
    :style="{ '--gap': gapStyle }"
    @mouseleave="onLeave"
  >
    <div v-show="innerIndex !== null" class="pointer" :style="activeStyle" />
    <img
      v-for="(url, i) in imageUrls"
      :key="url"
      :ref="(el) => setImgRef(el, i)"
      :src="url"
      class="pointer-img"
      @mouseenter="onEnter(i)"
      @touchstart.passive="onEnter(i)"
      @click="onClick(i)"
      @load="onImgLoad(i)"
    />
  </div>
</template>

<style scoped lang="scss">
.lib-image-pointer {
  position: relative;
  display: flex;
  flex-wrap: wrap;

  .pointer-img {
    margin-right: var(--gap, 20px);
    margin-bottom: var(--gap, 20px);
    object-fit: cover;
    cursor: pointer;
    display: block;
    touch-action: manipulation;
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
    pointer-events: none;
    width: calc(var(--w) + var(--g) * 2);
    height: calc(var(--h) + var(--g) * 2);
    border: 3px solid currentcolor;
    left: calc(var(--x) - var(--g));
    top: calc(var(--y) - var(--g));
    box-sizing: border-box;
    transition: all 0.1s ease;
    mask: conic-gradient(at var(--l) var(--l), #0000 75%, red 75%) left top / calc(100% - var(--l))
      calc(100% - var(--l)) repeat;
  }
}
</style>
