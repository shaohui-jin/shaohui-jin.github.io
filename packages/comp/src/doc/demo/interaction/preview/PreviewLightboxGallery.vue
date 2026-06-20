<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";

const urls = [
  "https://picsum.photos/seed/lb1/800/600",
  "https://picsum.photos/seed/lb2/800/600",
  "https://picsum.photos/seed/lb3/800/600",
  "https://picsum.photos/seed/lb4/800/600",
];

const open = ref(false);
const index = ref(0);

function show(i: number) {
  index.value = i;
  open.value = true;
}

function close() {
  open.value = false;
}

function prev() {
  index.value = (index.value - 1 + urls.length) % urls.length;
}

function next() {
  index.value = (index.value + 1) % urls.length;
}

function onKey(e: KeyboardEvent) {
  if (!open.value) return;
  if (e.key === "Escape") close();
  if (e.key === "ArrowLeft") prev();
  if (e.key === "ArrowRight") next();
}

onMounted(() => window.addEventListener("keydown", onKey));
onBeforeUnmount(() => window.removeEventListener("keydown", onKey));
</script>

<template>
  <div class="lightbox">
    <div class="lightbox__thumbs">
      <img
        v-for="(url, i) in urls"
        :key="url"
        :src="url.replace('800/600', '120/90')"
        @click="show(i)"
      />
    </div>
    <Teleport to="body">
      <Transition name="lb-fade">
        <div v-if="open" class="lightbox__overlay" @click.self="close">
          <button class="lightbox__close" @click="close">✕</button>
          <button class="lightbox__nav lightbox__nav--prev" @click="prev">‹</button>
          <img :src="urls[index]" class="lightbox__img" />
          <button class="lightbox__nav lightbox__nav--next" @click="next">›</button>
          <span class="lightbox__counter">{{ index + 1 }} / {{ urls.length }}</span>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped lang="scss">
.lightbox {
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

      &:hover {
        transform: scale(1.05);
      }
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

    &--prev {
      left: 16px;
    }
    &--next {
      right: 16px;
    }
  }

  &__counter {
    position: absolute;
    bottom: 20px;
    color: #fff;
    font-size: 14px;
  }
}

.lb-fade-enter-active,
.lb-fade-leave-active {
  transition: opacity 0.25s;
}

.lb-fade-enter-from,
.lb-fade-leave-to {
  opacity: 0;
}
</style>
