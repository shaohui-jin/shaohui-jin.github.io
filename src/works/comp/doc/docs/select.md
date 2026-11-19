---
title: 选择
groupTitle: 选择
order: 200
---

# 选择

## TreeTransfer

左右两栏树形结构穿梭选择，适用于权限分配、组织架构选择等场景。

::: comp-preview tree-transfer

```vue
<script setup lang="ts">
import { ref } from "vue";
import { TreeTransfer } from "@/works/comp";

const treeData = [
  {
    id: "1",
    label: "系统管理",
    children: [
      { id: "1-1", label: "用户管理" },
      { id: "1-2", label: "角色管理" },
    ],
  },
];

const checkedKeys = ref<string[]>(["1-2"]);
</script>

<template>
  <TreeTransfer v-model="checkedKeys" :data="treeData" />
</template>
```

:::

### Props

| 名称                 | 类型                 | 默认值 | 必填 | 说明             |
| -------------------- | -------------------- | ------ | ---- | ---------------- |
| data                 | `TreeTransferNode[]` | —      | 是   | 树形数据源       |
| modelValue / v-model | `string[]`           | —      | 是   | 已选节点 id 列表 |

### Events

| 名称              | 参数              | 说明               |
| ----------------- | ----------------- | ------------------ |
| update:modelValue | `(ids: string[])` | v-model 更新       |
| change            | `(ids: string[])` | 穿梭后已选节点变化 |
