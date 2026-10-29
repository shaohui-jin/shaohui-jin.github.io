---
title: 表单相关
lang: zh-CN
date: 2024-04-12 22:07:31
permalink: /Tips/CSS/Form/
category:
  - CSS
tag:
  - Tips
---

### 元素深度聚焦捕获

> `focus-within`: 当前元素以及后代元素的聚焦事件 

::: normal-demo 演示
```html
<div class="focus-within-demo">
  <div class="line">
    <label class="label">
      <span>姓名</span>
      <input class="input">
    </label>
  </div>
  <div class="line">
    <label class="label">
      <span>身份证号</span>
      <input class="input">
    </label>
  </div>
</div>
```

```css {4-6,10-12}
.focus-within-demo {
  width: 100%;
}
.focus-within-demo input:focus {
  border-color: #409eff;
}
.line {
  transition: 0.5s;
}
.line:focus-within {
  background-color: #eee;
}
```
:::


### 元素必填项

> `has`: 表示满足一定条件后，就会匹配该元素

::: normal-demo 演示
```html
<div class="has-data-required-demo">
  <div class="line">
    <label class="label">
      <span>姓名</span>
      <input data-required class="input">
    </label>
  </div>
  <div class="line">
    <label class="label">
      <span>身份证号</span>
      <input class="input">
    </label>
  </div>
</div>
```

```css {4-7}
.has-data-required-demo {
  width: 100%;
}
.has-data-required-demo .label span:has(+ input[data-required])::after {
  content: '*';
  color: red; 
}
```
:::
