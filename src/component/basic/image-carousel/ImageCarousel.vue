<script setup lang="ts">
import { ref, onMounted, nextTick } from "vue";
import type { ImageCarouselProps } from "@/type/basic";

defineOptions({ name: "ImageCarousel" });

const props = withDefaults(defineProps<ImageCarouselProps>(), {
  defaultIndex: 0,
});

const index = ref(0);
const listRef = ref<HTMLDivElement>();

function layout() {
  const container = listRef.value;
  if (!container) return;
  const items = container.querySelectorAll<HTMLImageElement>(".carousel-item");
  const offsetStep = 100;
  const scaleStep = 0.6;
  const opacityStep = 0.6;

  items.forEach((item, i) => {
    const dis = i - index.value;
    const sign = Math.sign(dis);
    let xOffset = dis * offsetStep;
    let rotate = 0;
    if (i !== index.value) {
      xOffset += sign * 100;
      rotate = -sign * 45;
    }
    const scale = scaleStep ** Math.abs(dis);
    const opacity = opacityStep ** Math.abs(dis);
    const zIndex = props.imageUrls.length - Math.abs(dis);
    item.style.transform = `translateX(${xOffset}px) scale(${scale}) rotateY(${rotate}deg)`;
    item.style.zIndex = String(zIndex);
    item.style.opacity = String(opacity);
  });
}

function prev() {
  if (index.value > 0) {
    index.value--;
    layout();
  }
}

function next() {
  if (index.value < props.imageUrls.length - 1) {
    index.value++;
    layout();
  }
}

function clickItem(i: number) {
  index.value = i;
  layout();
}

onMounted(() => {
  index.value = props.defaultIndex;
  nextTick(layout);
});
</script>

<template>
  <div class="lib-image-carousel">
    <div ref="listRef" class="carousel-list">
      <img
        v-for="(url, i) in imageUrls"
        :key="i"
        :src="url"
        class="carousel-item"
        :class="{ active: index === i }"
        @click="clickItem(i)"
      />
    </div>
    <button class="carousel-prev" @click="prev">&lt;</button>
    <button class="carousel-next" @click="next">&gt;</button>
  </div>
</template>

<style scoped lang="scss">
.lib-image-carousel {
  width: 100%;
  position: relative;
  height: 300px;
  overflow: hidden;

  .carousel-list {
    width: 100%;
    height: 100%;
    position: relative;
    perspective: 1000px;

    .carousel-item {
      position: absolute;
      user-select: none;
      transition: 0.4s;
      left: 50%;
      top: 0;
      margin-left: -200px;
      max-width: 80%;
      height: auto;
      cursor: pointer;
    }
  }

  .carousel-prev,
  .carousel-next {
    position: absolute;
    z-index: 100;
    top: 50%;
    transform: translateY(-50%);
    background: rgb(0 0 0 / 40%);
    color: #fff;
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    cursor: pointer;
    font-size: 16px;
  }

  .carousel-prev {
    left: 8px;
  }

  .carousel-next {
    right: 8px;
  }
}

@media (max-width: 768px) {
  .lib-image-carousel {
    height: 200px;

    .carousel-list .carousel-item {
      margin-left: -120px;
    }

    .carousel-prev,
    .carousel-next {
      width: 36px;
      height: 36px;
    }
  }
}
</style>
