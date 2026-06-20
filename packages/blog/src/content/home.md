# 博客模块（MVP）

这是 `jsh-blog` 的第一版内容页，用于验证 Markdown 解析与渲染流程。

## 当前支持

- 标题锚点（自动生成 `id`）
- 基础段落、列表、链接
- 代码块渲染
- 通过 `MarkdownRenderer` 插槽扩展头尾区域

## 示例代码

```ts
import { renderMarkdown } from "jsh-blog";

const html = renderMarkdown("# Hello");
```
