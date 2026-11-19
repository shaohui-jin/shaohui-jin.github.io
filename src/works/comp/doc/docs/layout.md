---
title: 布局
groupTitle: 布局
order: 170
---

# 布局

## SplitPane

可拖拽调整左右面板比例的分割布局，双击分隔条可还原默认比例。

::: comp-preview split-pane

```vue
<script setup lang="ts">
import { ref } from "vue";
import { SplitPane } from "@/works/comp";

const ratio = ref(0.5);
</script>

<template>
  <SplitPane v-model:ratio="ratio">
    <template #left>左侧面板</template>
    <template #right>右侧面板</template>
  </SplitPane>
</template>
```

:::

### Props

| 名称                  | 类型     | 默认值 | 必填 | 说明                |
| --------------------- | -------- | ------ | ---- | ------------------- |
| ratio / v-model:ratio | `number` | `0.5`  | 否   | 左侧面板占比（0~1） |
| minRatio              | `number` | `0.2`  | 否   | 最小占比            |
| maxRatio              | `number` | `0.8`  | 否   | 最大占比            |

### Events

| 名称         | 参数              | 说明                     |
| ------------ | ----------------- | ------------------------ |
| update:ratio | `(ratio: number)` | v-model:ratio 更新       |
| change       | `(ratio: number)` | 拖拽或双击还原后比例变化 |
