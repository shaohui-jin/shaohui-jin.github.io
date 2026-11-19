---
title: 流程
groupTitle: 流程
order: 210
---

# 流程

## StepWizard

分步表单向导组件，内置步骤条与上一步 / 下一步导航。

::: comp-preview step-wizard

```vue
<script setup lang="ts">
import { ref } from "vue";
import { StepWizard } from "@/works/comp";

const step = ref(0);
const steps = [
  { title: "基本信息", description: "填写姓名和邮箱" },
  { title: "角色分配", description: "选择用户角色" },
  { title: "确认提交", description: "核对信息并提交" },
];
</script>

<template>
  <StepWizard v-model:step="step" :steps="steps">
    <template #default="{ step: currentStep }">第 {{ currentStep + 1 }} 步</template>
  </StepWizard>
</template>
```

:::

### Props

| 名称                | 类型               | 默认值 | 必填 | 说明         |
| ------------------- | ------------------ | ------ | ---- | ------------ |
| steps               | `StepWizardStep[]` | —      | 是   | 步骤配置列表 |
| step / v-model:step | `number`           | `0`    | 否   | 当前步骤索引 |

### Events

| 名称        | 参数             | 说明              |
| ----------- | ---------------- | ----------------- |
| update:step | `(step: number)` | v-model:step 更新 |
| change      | `(step: number)` | 步骤切换          |
| finish      | —                | 最后一步点击完成  |
