---
title: 文档
groupTitle: 文档
order: 130
---

# 文档

## CodeBlock

代码展示组件，支持语法高亮和一键复制。通过 CSS 变量可自定义主题。

### 基础用法

::: comp-preview code-block

```vue
<script setup lang="ts">
import { computed } from "vue";
import { CodeBlock } from "@/works/comp";
import { highlightTsCode } from "@/works/comp/doc/demo/demoCodeHighlight";

const code = `function greet(name: string) {\n  return name;\n}`;
const highlighted = computed(() => highlightTsCode(code));
</script>

<template>
  <CodeBlock :code="code" :highlighted="highlighted" />
</template>
```

:::

### 纯文本模式

不传 `highlighted` 和 `lang` 时展示转义后的原文，仍然带行号。

::: comp-preview code-block-plain

```vue
<script setup lang="ts">
import { CodeBlock } from "@/works/comp";

const code = `function greet(name: string) {\n  return name;\n}`;
</script>

<template>
  <CodeBlock :code="code" />
</template>
```

:::

### 自定义主题

通过 CSS 变量覆盖外观。

::: comp-preview code-block-theme

```vue
<template>
  <div style="--code-block-bg: #1e1e2e; --code-block-text: #cdd6f4; --code-block-comment: #6c7086">
    <CodeBlock :code="code" :highlighted="highlighted" />
  </div>
</template>
```

:::

### Props

| 名称           | 类型       | 默认值 | 必填 | 说明                                           |
| -------------- | ---------- | ------ | ---- | ---------------------------------------------- |
| code           | `string`   | —      | 是   | 需要复制的原始代码文本                         |
| highlighted    | `string`   | —      | 否   | 经 highlight 处理后的 HTML，不传则按 lang 着色 |
| lang           | `string`   | —      | 否   | 语法名，未传 highlighted 时用于着色            |
| highlightLines | `number[]` | —      | 否   | 从 1 开始的行号，这些行加高亮                  |

## WidgetTabs

预览 / 代码切换容器，代码 Tab 内置 CodeBlock 提供复制功能。

### 基础用法

::: comp-preview widget-tabs

```vue
<script setup lang="ts">
import { computed } from "vue";
import { WidgetTabs } from "@/works/comp";
import { highlightDemoCode } from "@/works/comp/doc/demo/demoCodeHighlight";

const code = `<div>这是预览区域</div>`;
const highlighted = computed(() => highlightDemoCode(code));
</script>

<template>
  <WidgetTabs :code="code" :highlighted="highlighted">
    <div style="padding: 24px; text-align: center">这是预览区域，放置组件实际效果</div>
  </WidgetTabs>
</template>
```

:::

### 贴边模式

设置 `flush`，预览区去除内边距。

::: comp-preview widget-tabs-flush

```vue
<template>
  <WidgetTabs :code="code" :highlighted="highlighted" flush>
    <div>全宽内容区</div>
  </WidgetTabs>
</template>
```

:::

### Props

| 名称        | 类型      | 默认值 | 必填 | 说明                                               |
| ----------- | --------- | ------ | ---- | -------------------------------------------------- |
| code        | `string`  | —      | 是   | 代码 Tab 展示的源代码文本                          |
| highlighted | `string`  | —      | 否   | 经 highlight 处理后的代码 HTML，不传则按 lang 着色 |
| lang        | `string`  | —      | 否   | 语法名，未传 highlighted 时用于着色                |
| flush       | `boolean` | `true` | 否   | 预览区去除内边距                                   |
