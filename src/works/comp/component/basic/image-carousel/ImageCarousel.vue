<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount, nextTick, type CSSProperties } from "vue";
import type {
  ImageCarouselProps,
  ImageCarouselEmits,
  ImageCarouselExpose,
} from "@/works/comp/type/basic";

defineOptions({ name: "ImageCarousel" });

const props = withDefaults(defineProps<ImageCarouselProps>(), {
  defaultIndex: 0,
  loop: false,
  autoplay: false,
  interval: 3000,
  showArrows: true,
});

const emit = defineEmits<ImageCarouselEmits>();

const innerIndex = ref(props.index ?? props.defaultIndex);

function getItemStyle(i: number): CSSProperties {
  const dis = i - innerIndex.value;
  const sign = Math.sign(dis) || 1;
  const offsetStep = 100;
  const scaleStep = 0.6;
  const opacityStep = 0.6;
  let xOffset = dis * offsetStep;
  let rotate = 0;
  if (dis !== 0) {
    xOffset += sign * 100;
    rotate = -sign * 45;
  }
  return {
    transform: `translateX(${xOffset}px) scale(${scaleStep ** Math.abs(dis)}) rotateY(${rotate}deg)`,
    zIndex: props.imageUrls.length - Math.abs(dis),
    opacity: opacityStep ** Math.abs(dis),
  };
}

function setIndex(i: number) {
  if (i === innerIndex.value) return;
  innerIndex.value = i;
  emit("update:index", i);
  emit("change", i);
}

function prev() {
  if (innerIndex.value > 0) {
    setIndex(innerIndex.value - 1);
  } else if (props.loop && props.imageUrls.length > 0) {
    setIndex(props.imageUrls.length - 1);
  }
}

function next() {
  if (innerIndex.value < props.imageUrls.length - 1) {
    setIndex(innerIndex.value + 1);
  } else if (props.loop && props.imageUrls.length > 0) {
    setIndex(0);
  }
}

function goTo(i: number) {
  if (i >= 0 && i < props.imageUrls.length) {
    setIndex(i);
  }
}

function clickItem(i: number) {
  setIndex(i);
  emit("click-item", i);
}

let timer: ReturnType<typeof setInterval> | null = null;

function startAutoplay() {
  stopAutoplay();
  if (!props.autoplay || props.imageUrls.length <= 1 || document.hidden) return;
  timer = setInterval(next, props.interval);
}

function stopAutoplay() {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
}

function onVisibilityChange() {
  if (document.hidden) stopAutoplay();
  else startAutoplay();
}

watch(
  () => props.index,
  (val) => {
    if (val !== undefined && val !== innerIndex.value) {
      innerIndex.value = val;
    }
  },
);

watch(
  () => props.imageUrls.length,
  () => {
    if (innerIndex.value >= props.imageUrls.length) {
      innerIndex.value = Math.max(0, props.imageUrls.length - 1);
    }
    startAutoplay();
  },
);

watch(
  () => props.autoplay,
  (val) => {
    if (val) startAutoplay();
    else stopAutoplay();
  },
);

watch(
  () => props.interval,
  () => {
    if (props.autoplay) startAutoplay();
  },
);

defineExpose<ImageCarouselExpose>({ prev, next, goTo });

onMounted(() => {
  nextTick(startAutoplay);
  document.addEventListener("visibilitychange", onVisibilityChange);
});

onBeforeUnmount(() => {
  stopAutoplay();
  document.removeEventListener("visibilitychange", onVisibilityChange);
});
</script>

<template>
  <div class="lib-image-carousel" @mouseenter="stopAutoplay" @mouseleave="startAutoplay">
    <div class="carousel-list">
      <img
        v-for="(url, i) in imageUrls"
        :key="url"
        :src="url"
        class="carousel-item"
        :class="{ active: innerIndex === i }"
        :style="getItemStyle(i)"
        @click="clickItem(i)"
      />
    </div>
    <button v-if="showArrows" class="carousel-prev" @click="prev">&lt;</button>
    <button v-if="showArrows" class="carousel-next" @click="next">&gt;</button>
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
