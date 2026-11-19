<script setup lang="ts">
import { ref } from "vue";
import { Image3D, ImageCarousel, ImageLightbox, ImagePointer } from "@/works/comp";

defineProps<{ name: string }>();

const carouselUrls = [
  "https://picsum.photos/seed/c1/400/300",
  "https://picsum.photos/seed/c2/400/300",
  "https://picsum.photos/seed/c3/400/300",
  "https://picsum.photos/seed/c4/400/300",
  "https://picsum.photos/seed/c5/400/300",
];
const pointerUrls = [
  "https://picsum.photos/seed/p1/150/120",
  "https://picsum.photos/seed/p2/180/120",
  "https://picsum.photos/seed/p3/120/120",
  "https://picsum.photos/seed/p4/160/120",
  "https://picsum.photos/seed/p5/140/120",
  "https://picsum.photos/seed/p6/170/120",
];
const lightboxUrls = [
  "https://picsum.photos/seed/lb1/800/600",
  "https://picsum.photos/seed/lb2/800/600",
  "https://picsum.photos/seed/lb3/800/600",
  "https://picsum.photos/seed/lb4/800/600",
];

const carouselIndex = ref(2);
const lightboxIndex = ref(0);
const carouselEvent = ref("—");
const pointerEvent = ref("—");
const lightboxEvent = ref("—");
</script>

<template>
  <div v-if="name === 'image-3d'" class="image-preview__center">
    <Image3D src="https://picsum.photos/seed/lib-img/300/200" />
  </div>

  <div v-else-if="name === 'image-carousel'">
    <ImageCarousel
      v-model:index="carouselIndex"
      :image-urls="carouselUrls"
      @change="carouselEvent = `change → index: ${$event}`"
    />
    <p class="widget-hint">当前下标：{{ carouselIndex }}，最近事件：{{ carouselEvent }}</p>
  </div>

  <ImageCarousel
    v-else-if="name === 'image-carousel-autoplay'"
    :image-urls="carouselUrls"
    loop
    autoplay
    :interval="2000"
  />

  <div v-else-if="name === 'image-pointer'" class="image-preview__pad">
    <ImagePointer
      :image-urls="pointerUrls"
      @hover="pointerEvent = `hover → index: ${$event}`"
      @click="pointerEvent = `click → index: ${$event}`"
      @leave="pointerEvent = 'leave'"
    />
    <p class="widget-hint">最近事件：{{ pointerEvent }}</p>
  </div>

  <div v-else-if="name === 'image-pointer-gap'" class="image-preview__pad">
    <ImagePointer :image-urls="pointerUrls" :gap="12" pointer-color="#409eff" />
  </div>

  <div v-else-if="name === 'image-lightbox'">
    <ImageLightbox
      v-model:index="lightboxIndex"
      :urls="lightboxUrls"
      @change="lightboxEvent = `change → index: ${$event}`"
      @open="lightboxEvent = `open → index: ${$event}`"
      @close="lightboxEvent = 'close'"
    />
    <p class="widget-hint">当前索引：{{ lightboxIndex }}，最近事件：{{ lightboxEvent }}</p>
  </div>
</template>

<style scoped lang="scss">
@use "../style/variables" as *;
@use "../style/demo";

.image-preview__center,
.image-preview__pad {
  display: flex;
  flex-direction: column;
  padding: 24px;
}

.image-preview__center {
  align-items: center;
}

:deep(.pointer-img) {
  max-width: 100%;
  height: auto;
}

@media (max-width: $doc-bp-mobile) {
  :deep(.pointer-img) {
    width: calc(50% - 20px);
  }
}
</style>
