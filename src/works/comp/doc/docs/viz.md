---
title: 数据可视化
groupTitle: 数据可视化
order: 230
---

# 数据可视化

## HeatmapCalendar

类似 GitHub 贡献图的热力日历，通过颜色深浅展示数值密度。

::: comp-preview heatmap-calendar

```vue
<script setup lang="ts">
import { HeatmapCalendar, type HeatmapCell } from "@/works/comp";

const data: HeatmapCell[] = Array.from({ length: 84 }, (_, i) => ({
  date: `Day ${i + 1}`,
  count: (i * 7 + 3) % 10,
}));
</script>

<template>
  <HeatmapCalendar :data="data" />
</template>
```

:::

### Props

| 名称 | 类型            | 默认值 | 必填 | 说明                             |
| ---- | --------------- | ------ | ---- | -------------------------------- |
| data | `HeatmapCell[]` | —      | 是   | 热力图单元格数据（date + count） |

### Events

| 名称       | 参数                  | 说明       |
| ---------- | --------------------- | ---------- |
| cell-click | `(cell: HeatmapCell)` | 点击单元格 |
