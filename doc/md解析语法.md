# Markdown 解析语法

自定义块的写法都是：

```markdown
::: 名称 可选标题
内容
:::
```

名称以字母开头，后面可以是字母、数字、`-`。结束行只能是 `:::`，前后不要再写字。容器可以嵌套。名称不在下面的名单里时，整段按普通段落显示。

## 组件预览

组件文档用。预览键对应页面上的预览组件，里面第一个围栏的正文进代码 Tab。组件示例的围栏语言写 `vue`，才会按 Vue 着色。

````markdown
::: comp-preview tag
```vue
<script setup lang="ts">
import { Tag } from "@/works/comp";
</script>

<template>
  <Tag label="成功" type="success" />
</template>
```
:::
````

## 博客演示

这三种用在博客。名称后面的文字不会显示，写不写都不影响预览。

### vue-demo

渲染一段单文件组件。第一个 `vue` 围栏当作 `App.vue`。要拆成多个文件时，每个围栏前写一行 `@file 路径`。

````markdown
::: vue-demo
@file src/Directory.vue
```vue
<template>
  <div>目录</div>
</template>
```

@file src/App.vue
```vue
<script setup lang="ts">
import Directory from "./Directory.vue";
</script>

<template>
  <Directory />
</template>
```
:::
````

### vue-playground

和 `vue-demo` 的文件规则相同，预览区可以改代码再运行。

````markdown
::: vue-playground
```vue
<template>
  <p>{{ count }}</p>
</template>
```
:::
````

### normal-demo

静态页面。`html` 围栏是页面内容，`css` 围栏会并进页面样式。

````markdown
::: normal-demo
```html
<div class="drop">段落</div>
```

```css
.drop:first-letter {
  font-size: 2em;
}
```
:::
````

## 提示块

名称后面的文字是标题。不写标题时，用下表里的默认标题。里面可以写普通 Markdown，也可以再嵌容器和围栏。

| 名称 | 默认标题 |
| --- | --- |
| info | 提示 |
| tip | 技巧 |
| warning | 注意 |
| danger | 警告 |
| important | 重要 |
| note | 说明 |
| theorem | 定理 |
| right | 补充 |
| cxt | 上下文 |
| details | 详情 |

```markdown
::: warning 缓存不会自动更新
改完文件后需要重新构建。
:::
```

## 围栏

容器外面的围栏渲染成代码块。语言决定着色：组件示例写 `vue`，工具示例写 `typescript`。不写语言时只显示原文。

行号从 1 开始。`{4,10}` 高亮第 4 行和第 10 行，`{4-6}` 高亮连续行，可以混写。

````markdown
```vue {4,10}
<template>
  <Tag label="成功" type="success" />
</template>
```
````

` ```mermaid ` 渲染成图，不是代码块。

## 参数表

组件文档和工具文档里，表头完全符合下面三种之一时，渲染成参数表。博客里的表格仍是普通 Markdown 表格。

| 表头 | 用途 |
| --- | --- |
| 名称、类型、默认值、必填、说明 | Props，以及字段配置 |
| 名称、参数、说明 | Events |
| 名称、说明 | Slots |

单元格里的 `|` 要写成 `\|`，否则会被当成列分隔。必填列写 `是` 或 `否`。
