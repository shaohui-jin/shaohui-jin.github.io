---
title: 菜单
groupTitle: 菜单
order: 220
---

# 菜单

## ContextMenu

在触发区域右键弹出上下文菜单，支持快捷键提示与危险项样式。

::: comp-preview context-menu

```vue
<script setup lang="ts">
import { ContextMenu, type ContextMenuItem } from "@/works/comp";

const items: ContextMenuItem[] = [
  { label: "编辑", shortcut: "Ctrl+E" },
  { label: "复制", shortcut: "Ctrl+C" },
  { label: "删除", shortcut: "Del", danger: true },
];
</script>

<template>
  <ContextMenu :items="items">
    <div>在此区域右键打开菜单</div>
  </ContextMenu>
</template>
```

:::

### Props

| 名称  | 类型                | 默认值 | 必填 | 说明       |
| ----- | ------------------- | ------ | ---- | ---------- |
| items | `ContextMenuItem[]` | —      | 是   | 菜单项列表 |

### Events

| 名称   | 参数                      | 说明       |
| ------ | ------------------------- | ---------- |
| select | `(item: ContextMenuItem)` | 选中菜单项 |
