---
title: canvas相关
lang: zh-CN
date: 2024-04-12 22:07:31
permalink: /Tips/CSS/Canvas/
category:
  - CSS
tag:
  - Tips
---


### 图标描边

::: vue-playground 演示

@file App.vue

```vue
<template>
  <div class="canvas-001-demo">
    <svg class="icon" t="1719560846677" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="18687" width="220" height="200">
      <path class="p" d="M867.2 502.4c-3.2-16-16-25.6-32-25.6h-124.8l-128-176-3.2-3.2c-16-16-44.8-9.6-54.4 12.8l-89.6 316.8-83.2-137.6v-3.2c-6.4-6.4-16-9.6-22.4-9.6H185.6c-12.8 3.2-25.6 16-25.6 32v3.2c3.2 16 16 25.6 32 25.6h118.4l112 182.4 3.2 3.2c16 19.2 48 12.8 54.4-12.8l92.8-323.2 99.2 134.4 3.2 3.2c6.4 6.4 12.8 9.6 22.4 9.6H844.8c16-3.2 25.6-16 25.6-32h-3.2z" fill="#666666" p-id="18688"></path>
      <path class="p" d="M512 0C230.4 0 0 230.4 0 512s230.4 512 512 512 512-230.4 512-512S793.6 0 512 0z m0 960C265.6 960 64 758.4 64 512S265.6 64 512 64s448 201.6 448 448-201.6 448-448 448z" fill="#666666" p-id="18689"></path></svg>
  </div>
</template>
<script>
export default {
  mounted() {
    const paths = document.querySelectorAll('.icon .p')
    paths.forEach(path => {
      const len = path.getTotalLength()
      path.style.setProperty('--l', len + 1)
    })
  }
}
</script>
<style scoped>
.p {
  fill: none;
  stroke: #f40;
  stroke-width: 2;
  stroke-dasharray: var(--l);
  stroke-dashoffset: var(--l);
  stroke-linecap: round;
  animation: stroke 2s forwards ;
}
@keyframes stroke {
  to {
    stroke-dashoffset: 0;
  }
}
</style>
```
:::
