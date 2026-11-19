---
title: 图片
groupTitle: 图片
order: 90
---

# 图片

## Image3D

鼠标悬停时产生 3D 透视旋转效果。

::: comp-preview image-3d

```vue
<script setup lang="ts">
import { Image3D } from "@/works/comp";
</script>

<template>
  <Image3D src="https://picsum.photos/seed/lib-img/300/200" />
</template>
```

:::

### Props

| 名称 | 类型     | 默认值 | 必填 | 说明     |
| ---- | -------- | ------ | ---- | -------- |
| src  | `string` | —      | 是   | 图片地址 |

## ImageCarousel

带透视旋转效果的图片轮播组件，支持受控下标、循环与自动播放。

### 受控下标

::: comp-preview image-carousel

```vue
<script setup lang="ts">
import { ref } from "vue";
import { ImageCarousel } from "@/works/comp";

const urls = ["https://picsum.photos/seed/c1/400/300", "https://picsum.photos/seed/c2/400/300"];
const index = ref(0);
</script>

<template>
  <ImageCarousel v-model:index="index" :image-urls="urls" />
</template>
```

:::

### 自动轮播

::: comp-preview image-carousel-autoplay

```vue
<script setup lang="ts">
import { ImageCarousel } from "@/works/comp";

const urls = ["https://picsum.photos/seed/c1/400/300", "https://picsum.photos/seed/c2/400/300"];
</script>

<template>
  <ImageCarousel :image-urls="urls" loop autoplay :interval="2000" />
</template>
```

:::

### Props

| 名称                  | 类型       | 默认值  | 必填 | 说明                   |
| --------------------- | ---------- | ------- | ---- | ---------------------- |
| imageUrls             | `string[]` | —       | 是   | 图片地址列表           |
| index / v-model:index | `number`   | —       | 否   | 当前选中下标（受控）   |
| defaultIndex          | `number`   | `0`     | 否   | 默认选中下标（非受控） |
| loop                  | `boolean`  | `false` | 否   | 首尾循环               |
| autoplay              | `boolean`  | `false` | 否   | 自动轮播               |
| interval              | `number`   | `3000`  | 否   | 自动轮播间隔（ms）     |
| showArrows            | `boolean`  | `true`  | 否   | 显示左右箭头           |

### Events

| 名称         | 参数              | 说明               |
| ------------ | ----------------- | ------------------ |
| change       | `(index: number)` | 当前下标变化       |
| update:index | `(index: number)` | v-model:index 更新 |
| click-item   | `(index: number)` | 点击图片           |

## ImagePointer

鼠标悬停时显示四角线框选中效果，支持点击与受控高亮。

### 基础用法

::: comp-preview image-pointer

```vue
<script setup lang="ts">
import { ImagePointer } from "@/works/comp";

const urls = ["https://picsum.photos/seed/p1/150/120", "https://picsum.photos/seed/p2/180/120"];
</script>

<template>
  <ImagePointer :image-urls="urls" />
</template>
```

:::

### 自定义间距与颜色

::: comp-preview image-pointer-gap

```vue
<script setup lang="ts">
import { ImagePointer } from "@/works/comp";

const urls = ["https://picsum.photos/seed/p1/150/120", "https://picsum.photos/seed/p2/180/120"];
</script>

<template>
  <ImagePointer :image-urls="urls" :gap="12" pointer-color="#409eff" />
</template>
```

:::

### Props

| 名称                  | 类型       | 默认值         | 必填 | 说明                 |
| --------------------- | ---------- | -------------- | ---- | -------------------- |
| imageUrls             | `string[]` | —              | 是   | 图片地址列表         |
| index / v-model:index | `number`   | —              | 否   | 当前高亮下标（受控） |
| gap                   | `number`   | `20`           | 否   | 图片间距（px）       |
| pointerColor          | `string`   | `currentColor` | 否   | 指针边框颜色         |

### Events

| 名称         | 参数              | 说明               |
| ------------ | ----------------- | ------------------ |
| hover        | `(index: number)` | 鼠标悬停某张图     |
| click        | `(index: number)` | 点击图片           |
| leave        | —                 | 鼠标离开容器       |
| update:index | `(index: number)` | v-model:index 更新 |

## ImageLightbox

缩略图网格 + 全屏灯箱预览，支持键盘左右切换与 Esc 关闭。

::: comp-preview image-lightbox

```vue
<script setup lang="ts">
import { ref } from "vue";
import { ImageLightbox } from "@/works/comp";

const urls = ["https://picsum.photos/seed/lb1/800/600", "https://picsum.photos/seed/lb2/800/600"];
const index = ref(0);
</script>

<template>
  <ImageLightbox v-model:index="index" :urls="urls" />
</template>
```

:::

### Props

| 名称                  | 类型       | 默认值 | 必填 | 说明         |
| --------------------- | ---------- | ------ | ---- | ------------ |
| urls                  | `string[]` | —      | 是   | 图片地址列表 |
| index / v-model:index | `number`   | `0`    | 否   | 当前预览索引 |

### Events

| 名称         | 参数              | 说明               |
| ------------ | ----------------- | ------------------ |
| update:index | `(index: number)` | v-model:index 更新 |
| change       | `(index: number)` | 预览索引变化       |
| open         | `(index: number)` | 打开灯箱           |
| close        | —                 | 关闭灯箱           |
