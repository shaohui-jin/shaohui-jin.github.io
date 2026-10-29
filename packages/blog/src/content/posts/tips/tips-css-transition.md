---
title: 过渡动画相关
lang: zh-CN
date: 2024-06-19 16:05:21
permalink: /Tips/CSS/Transition/
category:
  - CSS
tag:
  - Tips
---


### 高度过渡

当想实现一个 `height:0` 到 `auto` 的平滑过渡，一般有以下几种思路：

1. 使用 `transition: 500ms height ease;`，但是 **auto** 并`不是一个确定的值`，导致 **transition** 是无效的
2. 使用 `transition: 500ms max-height ease;`，但是过渡动画会不准确，有延迟
3. 使用 `transform: scaleY()`，但是会导致元素被压缩
4. 使用 JavaScript 解决
5. 使用 Grid 布局，`当前最优解`

::: normal-demo 演示

```html
  <div class="transition-001-demo">
    <div class="btn">
      hover me
      <div class="detail">
        <div>
          这是文本<br>
        </div>
      </div>
    </div>
  </div>
```

```css
.detail {
  display: grid;
  grid-template-rows: 0fr;
  transition: 0.5s;
}
.detail > div {
  overflow: hidden;
}
.btn:hover .detail {
  grid-template-rows: 1fr;
}
```
:::


