<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from "vue";
import type { ImageLightboxProps, ImageLightboxEmits } from "@/type/basic";

defineOptions({ name: "ImageLightbox" });

const props = withDefaults(defineProps<ImageLightboxProps>(), {
  index: 0,
});

const emit = defineEmits<ImageLightboxEmits>();

const open = ref(false);
const innerIndex = ref(props.index);

watch(() => props.index, (v) => { innerIndex.value = v; });

function setIndex(i: number) {
  innerIndex.value = i;
  emit("update:index", i);
  emit("change", i);
}

function show(i: number) {
  setIndex(i);
  open.value = true;
  emit("open", i);
}

function close() {
  open.value = false;
  emit("close");
}

function prev() {
  setIndex((innerIndex.value - 1 + props.urls.length) % props.urls.length);
}

function next() {
  setIndex((innerIndex.value + 1) % props.urls.length);
}

function onKey(e: KeyboardEvent) {
  if (!open.value) return;
  if (e.key === "Escape") close();
  if (e.key === "ArrowLeft") prev();
  if (e.key === "ArrowRight") next();
}

onMounted(() => window.addEventListener("keydown", onKey));
onBeforeUnmount(() => window.removeEventListener("keydown", onKey));

defineExpose({ open: show, close });
</script>

<template>
  <div class="image-lightbox">
    <div class="image-lightbox__thumbs">
      <img
        v-for="(url, i) in urls"
        :key="url"
        :src="url"
        loading="lazy"
        @click="show(i)"
      />
    </div>
    <Teleport to="body">
      <Transition name="image-lightbox-fade">
        <div v-if="open" class="image-lightbox__overlay" @click.self="close">
          <button class="image-lightbox__close" @click="close">✕</button>
          <button class="image-lightbox__nav image-lightbox__nav--prev" @click="prev">‹</button>
          <img :src="urls[innerIndex]" class="image-lightbox__img" alt="" />
          <button class="image-lightbox__nav image-lightbox__nav--next" @click="next">›</button>
          <span class="image-lightbox__counter">{{ innerIndex + 1 }} / {{ urls.length }}</span>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped lang="scss">
.image-lightbox {
  &__thumbs {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;

    img {
      width: 80px;
      height: 60px;
      object-fit: cover;
      border-radius: 4px;
      cursor: pointer;
      transition: transform 0.15s;

      &:hover { transform: scale(1.05); }
    }
  }

  &__overlay {
    position: fixed;
    inset: 0;
    z-index: 9999;
    background: rgb(0 0 0 / 85%);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__img {
    max-width: 90vw;
    max-height: 80vh;
    border-radius: 4px;
  }

  &__close {
    position: absolute;
    top: 16px;
    right: 16px;
    width: 36px;
    height: 36px;
    border: none;
    border-radius: 50%;
    background: rgb(255 255 255 / 15%);
    color: #fff;
    font-size: 18px;
    cursor: pointer;
  }

  &__nav {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 44px;
    height: 44px;
    border: none;
    border-radius: 50%;
    background: rgb(255 255 255 / 15%);
    color: #fff;
    font-size: 28px;
    cursor: pointer;

    &--prev { left: 16px; }
    &--next { right: 16px; }
  }

  &__counter {
    position: absolute;
    bottom: 20px;
    color: #fff;
    font-size: 14px;
  }
}

.image-lightbox-fade-enter-active,
.image-lightbox-fade-leave-active { transition: opacity 0.25s; }

.image-lightbox-fade-enter-from,
.image-lightbox-fade-leave-to { opacity: 0; }
</style>
