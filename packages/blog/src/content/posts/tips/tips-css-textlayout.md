---
title: 段落首字母
lang: zh-CN
date: 2024-04-12 22:07:31
permalink: /Tips/CSS/TextLayout/
category:
  - CSS
tag:
  - Tips
---

### 段落首字母

> `first-letter`: 当前元素的第一个字母

::: normal-demo 演示

```html
<div class="textLayout-001-demo">
  this is something text;this is something text;this is something text;
  this is something text;this is something text;this is something text;
  this is something text;this is something text;this is something text;
</div>
```

```css {4,10}
.textLayout-001-demo {
  width: 100%;
}
.textLayout-001-demo:first-letter {
   font-size: 2em;
   text-transform: uppercase;
   float: left;
   line-height: 1;
   margin-right: 10px;
 }
```
:::

### 段落高亮样式

> `selection`：文本选中样式选择器

::: normal-demo 演示
```html
<div class="textLayout-002-demo">
  this is something text;this is something text;this is something text;
  this is something text;this is something text;this is something text;
  this is something text;this is something text;this is something text;
</div>
```

```css {4,7}
.textLayout-002-demo {
  width: 100%;
}
.textLayout-002-demo::selection {
   background-color: #333;
   color: #fff;
}
```
:::

### 段落文本高亮


> `box-decoration-break`：块状盒子片段，clone 能使得每个片段都具有相同的 border、box-shadow 和 background

::: normal-demo 演示
```html
<div class="textLayout-003-demo">
  this is something text;this is something text;this is something text;
  <span class="highlight">
    this is something text;this is something text;this is something text;
    this is something text;this is something text;this is something text;
    this is something text;this is something text;this is something text;
  </span>
  this is something text;this is something text;this is something text;
</div>
```

```css {9,10}
.textLayout-003-demo {
  width: 100%;
}
.textLayout-003-demo .highlight {
  background: linear-gradient(#d5e8b7, #bad6b3);
  border: 1px solid #a1ad86;
  padding: 0 0.5em;
  border-radius: 5px;
  box-decoration-break: clone;
  -webkit-box-decoration-break: clone;
}
```
:::


### 段落文本拼音

> `pinyin.js` 用于生成拼音， `<ruby><rt></rt></ruby>` 用于渲染元素

::: normal-demo 演示
```html
<div class="textLayout-004-demo">
  <ruby>段<rt>duàn</rt></ruby>
  <ruby>落<rt>luò</rt></ruby>
  <ruby>文<rt>wén</rt></ruby>
  <ruby>本<rt>běn</rt></ruby>
  <ruby>拼<rt>pīn</rt></ruby>
  <ruby>音<rt>yīn</rt></ruby>
</div>
```
:::

### 段落文字下划线

实现思路如下：
> 1. 采用`背景图`的`过渡动画`实现功能
> 2. 默认在`右下角`，hover时设置为`左下角`，实现**左侧进右侧出**，
> 3. 默认背景长度为 **0**，hover时长度为文本宽度 **100%**
> 4. 增加基于背景图尺寸的过渡动画

::: normal-demo 演示

```html
  <div class="textLayout-005-demo">
    <h2 class="title">
      <span>十年后，你会发现CSS才是你永远也学不会的语言</span>
    </h2>
  </div>
```

```css
.title span {
  background: linear-gradient(to right, #ec695c, #61c454) no-repeat right bottom;
  background-size: 0 2px;
  transition: background-size 1000ms;
}
.title:hover span {
  background-position-x: left;
  background-size: 100% 2px;
}
```
:::

### 段落文字阴影

::: normal-demo 演示

```html
<div class="textLayout-006-demo">
  <h1>shadow text effect</h1>
</div>
```

```css
@import url('https://fonts.googleapis.com/css2?family=Luckiest+Guy&display=swap');

.textLayout-006-demo {
  height: 30vh;
  background: linear-gradient(45deg, #bfbfbf, #e6e6e6);
  display: flex;
  justify-content: center;
  align-items: center;
}
.textLayout-006-demo h1 {
  font-size: 8vmin;
  line-height: 1;
  margin: 0;
  letter-spacing: 5px;
  color: #e6e6e6;
  text-align: center;
  text-shadow: 1px -1px #fff, -1px 1px #999, -4px 4px 2px #808080;
}
```
:::


