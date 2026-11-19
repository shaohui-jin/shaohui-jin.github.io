---
title: 列表操作
groupTitle: 列表操作
order: 180
---

# 列表操作

## DragSortList

支持 HTML5 拖拽的列表排序组件，适用于菜单排序、优先级调整等场景。

::: comp-preview drag-sort-list

```vue
<script setup lang="ts">
import { ref } from "vue";
import { DragSortList, type DragSortItem } from "@/works/comp";

const items = ref<DragSortItem[]>([
  { id: 1, label: "首页菜单" },
  { id: 2, label: "用户管理" },
]);
</script>

<template>
  <DragSortList v-model="items" />
</template>
```

:::

### Props

| 名称                 | 类型             | 默认值 | 必填 | 说明               |
| -------------------- | ---------------- | ------ | ---- | ------------------ |
| modelValue / v-model | `DragSortItem[]` | —      | 是   | 可拖拽排序的列表项 |

### Events

| 名称              | 参数                      | 说明               |
| ----------------- | ------------------------- | ------------------ |
| update:modelValue | `(items: DragSortItem[])` | v-model 更新       |
| change            | `(items: DragSortItem[])` | 排序完成后列表变化 |

## FloatingToolbar

批量操作场景的底部浮动工具栏，选中项大于 0 时滑入显示。

::: comp-preview floating-toolbar

```vue
<script setup lang="ts">
import { ref } from "vue";
import { FloatingToolbar } from "@/works/comp";

const selected = ref(2);
</script>

<template>
  <FloatingToolbar :count="selected" @action="(action) => console.log(action)">
    <template #default="{ onAction }">
      <button type="button" @click="onAction('导出')">导出</button>
      <button type="button" @click="onAction('删除')">删除</button>
    </template>
  </FloatingToolbar>
</template>
```

:::

### Props

| 名称  | 类型     | 默认值 | 必填 | 说明                          |
| ----- | -------- | ------ | ---- | ----------------------------- |
| count | `number` | —      | 是   | 选中数量，大于 0 时显示工具栏 |

### Events

| 名称   | 参数               | 说明                 |
| ------ | ------------------ | -------------------- |
| action | `(action: string)` | 点击工具栏按钮时触发 |
