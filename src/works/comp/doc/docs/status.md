---
title: 状态标记
groupTitle: 状态标记
order: 70
---

# 状态标记

## Tag

用于显示状态的圆角标签

::: comp-preview tag

```vue
<script setup lang="ts">
import { Tag } from "@/works/comp";
</script>

<template>
  <Tag label="成功" type="success" />
  <Tag label="警告" type="warning" />
  <Tag label="信息" type="info" />
  <Tag label="危险" type="danger" />
</template>
```

:::

### Props

| 名称  | 类型                                           | 默认值   | 必填 | 说明     |
| ----- | ---------------------------------------------- | -------- | ---- | -------- |
| label | `string`                                       | —        | 是   | 标签文案 |
| type  | `"success" \| "warning" \| "info" \| "danger"` | `"info"` | 否   | 视觉类型 |

## Dot

彩色圆点状态指示器，用于在行内以圆点 + 文字标识状态

### 基础用法

::: comp-preview dot

```vue
<script setup lang="ts">
import { Dot } from "@/works/comp";
</script>

<template>
  <Dot color="#67c23a" text="运行中" />
  <Dot color="#e6a23c" text="待审核" />
  <Dot color="#f56c6c" text="已停止" />
</template>
```

:::

### 使用插槽

::: comp-preview dot-slot

```vue
<script setup lang="ts">
import { Dot } from "@/works/comp";
</script>

<template>
  <Dot color="#409eff">
    <span style="margin-left: 6px; font-weight: 600">自定义内容</span>
  </Dot>
</template>
```

:::

### Props

| 名称  | 类型     | 默认值                  | 必填 | 说明                      |
| ----- | -------- | ----------------------- | ---- | ------------------------- |
| color | `string` | `"rgba(203,206,212,1)"` | 否   | 圆点颜色，任意 CSS 颜色值 |
| text  | `string` | `""`                    | 否   | 显示文本                  |

### Slots

| 名称    | 说明                                     |
| ------- | ---------------------------------------- |
| default | 未传 text 时，使用默认插槽自定义右侧内容 |

### 特殊说明

- 与 Tag 的区别：Tag 使用 Element Plus 的 ElTag 以标签形式展示预设状态类型（success / warning / info / danger）；Dot 使用纯色圆点 + 文字，颜色完全自定义，适用于表格行状态、列表指示器等场景。
- BaseTable 的 status-custom 列类型内部已使用 Dot 渲染。
