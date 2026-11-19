---
title: Canvas
groupTitle: Canvas
order: 150
---

# Canvas

## CanvasTime

Canvas 粒子动画实时时钟，粒子从四周汇聚成当前时间。

::: comp-preview canvas-time

```vue
<script setup lang="ts">
import { CanvasTime } from "@/works/comp";
</script>

<template>
  <CanvasTime color="#333333" bg-color="#f9f9fb" />
</template>
```

:::

### Props

| 名称    | 类型     | 默认值      | 必填 | 说明       |
| ------- | -------- | ----------- | ---- | ---------- |
| color   | `string` | `"#000000"` | 否   | 粒子颜色   |
| bgColor | `string` | `"#ffffff"` | 否   | 画布背景色 |

## CanvasCountUp

数字递增动画组件，适用于数据大屏、统计卡片等场景。

::: comp-preview canvas-count-up

```vue
<script setup lang="ts">
import { ref } from "vue";
import { CanvasCountUp } from "@/works/comp";

const countUpRef = ref<InstanceType<typeof CanvasCountUp>>();
</script>

<template>
  <CanvasCountUp ref="countUpRef" :value="98765" :duration="2000" />
  <el-button @click="countUpRef?.restart()">重播</el-button>
</template>
```

:::

### Props

| 名称     | 类型     | 默认值 | 必填 | 说明           |
| -------- | -------- | ------ | ---- | -------------- |
| value    | `number` | —      | 是   | 目标数值       |
| duration | `number` | `2000` | 否   | 动画时长（ms） |

### Events

| 名称   | 参数 | 说明             |
| ------ | ---- | ---------------- |
| finish | —    | 数字滚动动画完成 |

### 特殊说明

- 通过 ref 调用 restart() 重新播放动画
