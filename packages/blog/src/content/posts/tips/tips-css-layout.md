---
title: 布局排版相关
lang: zh-CN
date: 2024-04-08 15:52:31
permalink: /Tips/CSS/Layout/
category: 
  - CSS
tag: 
  - Tips
---

### 居中定位

#### absolute + margin

::: vue-playground
@file App.vue
```vue
<template>
  <div class="Center-absolute-margin-demo">
    <div class="child"></div>
  </div>
</template>
<style>
html {
  padding: 0;
  margin: 0;
  body {
    margin: 0;
  }
}
.Center-absolute-margin-demo {
  width: 280px;
  height: 280px;
  position: relative;
  border: 1px solid;
  .child {
    position: absolute;
    width: 100px;
    height: 100px;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    margin: auto;
    background-color: yellow;
  }
}
</style>
```
:::

#### absolute + transform

::: vue-playground
@file App.vue
```vue
<template>
  <div class="Center-absolute-transform-demo">
    <div class="child"></div>
  </div>
</template>
<style>
html {
  padding: 0;
  margin: 0;
  body {
    margin: 0;
  }
}
.Center-absolute-transform-demo {
  width: 280px;
  height: 280px;
  position: relative;
  border: 1px solid;
  .child {
    position: absolute;
    width: 100px;
    height: 100px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);  
    background-color: yellow;
  }
}
</style>
```
:::

#### flex

::: vue-playground
@file App.vue
```vue
<template>
  <div class="Center-flex-demo">
    <div class="child"></div>
  </div>
</template>
<style>
html {
  padding: 0;
  margin: 0;
  body {
    margin: 0;
  }
}
.Center-flex-demo {
  width: 280px;
  height: 280px;
  border: 1px solid;
  display: flex;
  align-items: center;
  justify-content: center;
  .child {
    width: 100px;
    height: 100px;
    background-color: yellow;
  }
}
</style>
```
:::

#### grid

::: vue-playground
@file App.vue
```vue
<template>
  <div class="Center-grid-demo">
    <div class="child"></div>
  </div>
</template>
<style>
html {
  padding: 0;
  margin: 0;
  body {
    margin: 0;
  }
}
.Center-grid-demo {
  width: 280px;
  height: 280px;
  border: 1px solid;
  display: grid;
  align-items: center;
  //justify-content: center;
  justify-items: center;
  .child {
    width: 100px;
    height: 100px;
    background-color: yellow;
  }
}
</style>
```
:::

#### table

::: vue-playground
@file App.vue
```vue
<template>
  <div class="Center-table-demo">
    <div class="child"><div>检测居中效果</div>
      <p>检测居中效果</p>
      <input type="text" value="检测居中效果"></div>
  </div>
</template>
<style>
html {
  padding: 0;
  margin: 0;
  body {
    margin: 0;
  }
}
.Center-table-demo {
  width: 280px;
  height: 280px;
  border: 1px solid;
  display: table;
  .child {
    display: table-cell;
    text-align: center;
    vertical-align: middle;
    //width: 100px;
    //height: 100px;
    background-color: yellow;
  }
}
</style>
```
:::


### 隐藏元素

#### display

> 元素在页面上消失，**不占据空间**。

::: vue-playground

@file App.vue
```vue
<template>
  <div class="HiddenElements_display_box">
    <div class="display-box">
      左边内容
      <div class="left">unset</div>
      右边内容
    </div>
    <div class="display-box"> 
      左边内容
      <div class="right">none</div>
      右边内容
    </div>
  </div>
</template>
<style>
html {
  padding: 0;
  margin: 0;
  body {
    margin: 0;
  }
}
.HiddenElements_display_box {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: space-around;
  color: black;
  .display-box {
    width: 100px;
    height: 100px;
    border: 1px red solid;
    div {
      width: 100px;
      height: 50px;
      background-color: yellow;
    }
    .left {
      //display: unset;
    }
    .right {
      display: none;
    }
  }
}
</style>
```
:::


#### opacity

> 元素在页面上消失，**占据空间**。

::: vue-playground
@file App.vue
```vue
<template>
  <div class="HiddenElements_opacity_box">
    <div class="opacity-box">
      左边内容
      <div class="left">unset</div>
      右边内容
    </div>
    <div class="opacity-box"> 
      左边内容
      <div class="right">0</div>
      右边内容
    </div>
  </div>
</template>
<style>
html {
  padding: 0;
  margin: 0;
  body {
    margin: 0;
  }
}
.HiddenElements_opacity_box {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: space-around;
  color: black;
  .opacity-box {
    width: 100px;
    height: 100px;
    border: 1px red solid;
    div {
      width: 100px;
      height: 50px;
      background-color: yellow;
    }
    .left {
      opacity: unset;
    }
    .right {
      opacity: 0;
    }
  }
}
</style>
```
:::

#### visibility

> 元素在页面上消失，**占据空间**。

::: vue-playground
@file App.vue
```vue
<template>
  <div class="HiddenElements_visibility_box">
    <div class="visibility-box">
      左边内容
      <div class="left">unset</div>
      右边内容
    </div>
    <div class="visibility-box"> 
      左边内容
      <div class="right">hidden</div>
      右边内容
    </div>
  </div>
</template>
<style>
html {
  padding: 0;
  margin: 0;
  body {
    margin: 0;
  }
}
.HiddenElements_visibility_box {
  display: flex;
  height: 100vh;
  align-items: center;
  justify-content: space-around;
  color: black;
  .visibility-box {
    width: 100px;
    height: 100px;
    border: 1px red solid;
    div {
      width: 100px;
      height: 50px;
      background-color: yellow;
    }
    .left {
      visibility: unset;
    }
    .right {
      visibility: hidden;
    }
  }
}
</style>
```
:::

#### position

> 元素在页面上消失，**不占据空间**。

::: vue-playground
@file App.vue
```vue
<template>
  <div class="HiddenElements_visibility_box">
    <div class="position-box">
      左边内容
      <div class="left">unset;</div>
      右边内容
    </div>
    <div class="position-box"> 
      左边内容
      <div class="right">absolute</div>
      右边内容
    </div>
  </div>
</template>
<style>
html {
  padding: 0;
  margin: 0;
  body {
    margin: 0;
  }
}
.HiddenElements_visibility_box {
  display: flex;
  height: 100vh;
  align-items: center;
  justify-content: space-around;
  color: black;
  .position-box {
    width: 100px;
    height: 100px;
    border: 1px red solid;
    //position: relative;
    z-index: 1;
    div {
      width: 100px;
      height: 50px;
      background-color: yellow;
    }
    .left {
      position: unset;
    }
    .right {
      position: absolute;
      right: 0;
    }
  }
}
</style>
```
:::

#### transform

> 元素在页面上消失，**占据空间**。

::: vue-playground
@file App.vue
```vue
<template>
  <div class="HiddenElements_transform_box">
    <div class="transform-box">
      左边内容
      <div class="left">scale(1)</div>
      右边内容
    </div>
    <div class="transform-box"> 
      左边内容
      <div class="right">scale(0)</div>
      右边内容
    </div>
  </div>
</template>
<style>
html {
  padding: 0;
  margin: 0;
  body {
    margin: 0;
  }
}
.HiddenElements_transform_box {
  display: flex;
  height: 100vh;
  align-items: center;
  justify-content: space-around;
  color: black;
  .transform-box {
    width: 100px;
    height: 100px;
    border: 1px red solid;
    z-index: 1;
    div {
      width: 100px;
      height: 50px;
      background-color: yellow;
    }
    .left {
      transform: scale(1)
    }
    .right {
      transform: scale(0)
    }
  }
}
</style>
```
:::

#### clip-path

> 元素在页面上消失，**占据空间**。

::: vue-playground
@file App.vue
```vue
<template>
  <div class="HiddenElements_clip-path_box">
    <div class="clip-path-box">
      左边内容
      <div class="left">unset</div>
      右边内容
    </div>
    <div class="clip-path-box"> 
      左边内容
      <div class="right">circle(10%)</div>
      右边内容
    </div>
  </div>
</template>
<style>
html {
  padding: 0;
  margin: 0;
  body {
    margin: 0;
  }
}
.HiddenElements_clip-path_box {
  display: flex;
  height: 100vh;
  align-items: center;
  justify-content: space-around;
  color: black;
  .clip-path-box {
    width: 100px;
    height: 100px;
    border: 1px red solid;
    z-index: 1;
    div {
      width: 100px;
      height: 50px;
      background-color: yellow;
    }
    .left {}
    .right {
      clip-path: circle(10%);
    }
  }
}
</style>
```
:::


### 瀑布流


#### column-count

> `column-count`: 元素内容将被划分的最佳列数

::: normal-demo column-count 演示

```html
<div class="waterfall-flow-demo">
  <img src="https://picsum.photos/200/300">
  <img src="https://picsum.photos/200/145">
  <img src="https://picsum.photos/200/266">
  <img src="https://picsum.photos/200/234">
  <img src="https://picsum.photos/200/146">
  <img src="https://picsum.photos/200/235">
  <img src="https://picsum.photos/200/127">
  <img src="https://picsum.photos/200/116">
  <img src="https://picsum.photos/200/109">
</div>
```
```css {2}
.waterfall-flow-demo {
  column-count: 4;
}
```
:::

#### grid-template-rows(严重兼容性问题)

> `grid-template-rows: masonry` 是 firefox 在 firefox 87 开始支持的一种基于 grid 布局快速创建瀑布流布局的方式。

![](https://shaohui-jin.github.io/picx-images-hosting/blog/CanIUse/masonry.54xlih6zhm.webp " " =800x)

::: normal-demo column-count 演示

```html
<div class="waterfall-flow-demo">
  <img src="https://picsum.photos/200/300">
  <img src="https://picsum.photos/200/145">
  <img src="https://picsum.photos/200/266">
  <img src="https://picsum.photos/200/234">
  <img src="https://picsum.photos/200/146">
  <img src="https://picsum.photos/200/235">
  <img src="https://picsum.photos/200/127">
  <img src="https://picsum.photos/200/116">
  <img src="https://picsum.photos/200/109">
</div>
```

```css {4}
.waterfall-flow-demo {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: masonry;
  grid-gap: 10px;
}
```
:::


### 左右定宽-中自适应方案


#### flex

::: vue-playground
@file App.vue
```vue
<template>
  <div class="left-right-fixed-width-center-self-adaption-flex-demo">
    <div class="left">left</div>
    <div class="center">center</div>
    <div class="right">right</div>
  </div>
</template>
<style scoped>
.left-right-fixed-width-center-self-adaption-flex-demo {
  width: 100%;
  height: 250px;
  border: 1px solid;
  display: flex;
  flex-direction: row;
  & > div {
    height: 100%;
  }
  .left {
    width: 100px;
    background-color: cornflowerblue;
  }
  .right {
    width: 100px;
    background-color: cornflowerblue;
  }
  .center {
    flex: 1 1 0;
    background-color: greenyellow;
  }
}
</style>
```
:::

#### float

##### float + margin(有注意事项)

> 需调整 中间元素 和 右边元素 位置
>
::: vue-playground
@file App.vue
```vue
<template> 
  <div class="left-right-fixed-width-center-self-adaption-float-margin-demo">
    <div class="left">left</div>
    <div class="right">right</div>
    <div class="center">center</div>
  </div>
</template>
<style scoped>
.left-right-fixed-width-center-self-adaption-float-margin-demo {
  width: 100%;
  height: 250px;
  border: 1px solid;
  & > div {
    height: 100%;
  }
  .left {
    width: 100px;
    float: left;
    background-color: cornflowerblue;
  }
  .center {
    margin: 0 100px;
    background-color: greenyellow;
  }
  .right {
    width: 100px;
    float: right;
    background-color: cornflowerblue;
  }
}
</style>
```
:::

##### float + calc

::: vue-playground
@file App.vue
```vue
<template> 
  <div class="left-right-fixed-width-center-self-adaption-float-calc-demo">
    <div class="left">left</div>
    <div class="center">center</div>
    <div class="right">right</div>
  </div>
</template>
<style scoped>
.left-right-fixed-width-center-self-adaption-float-calc-demo {
  width: 100%;
  height: 250px;
  border: 1px solid;
  & > div {
    height: 100%;
    float: left;
  }
  .left {
    width: 100px;
    background-color: cornflowerblue;
  }
  .right {
    width: 100px;
    background-color: cornflowerblue;
  }
  .center {
    width: calc(100% - 100px - 100px);
    background-color: greenyellow;
  }
}
</style>
```
:::


### 左定宽-右自适应方案


#### flex

::: vue-playground
@file App.vue
```vue
<template>
  <div class="left-fixed-width-right-self-adaption-flex-demo">
    <div class="left">left</div>
    <div class="right">right</div>
  </div>
</template>
<style scoped>
.left-fixed-width-right-self-adaption-flex-demo {
  width: 100%;
  height: 250px;
  border: 1px solid;
  display: flex;
  flex-direction: row;
  & > div {
    height: 100%;
  }
  .left {
    width: 100px;
    background-color: cornflowerblue;
  }
  .right {
    flex: 1 1 0;
    background-color: greenyellow;
  }
}
</style>
```
:::

#### float

##### float + margin

::: vue-playground
@file App.vue
```vue
<template>
  <div class="left-fixed-width-right-self-adaption-float-margin-demo">
    <div class="left">left</div>
    <div class="right">right</div>
  </div>
</template>
<style scoped>
.left-fixed-width-right-self-adaption-float-margin-demo {
  width: 100%;
  height: 250px;
  border: 1px solid;
  & > div {
    height: 100%;
  }
  .left {
    float: left;
    width: 100px;
    background-color: cornflowerblue;
  }
  .right {
    margin-left: 100px;
    background-color: greenyellow;
  }
}
</style>
```
:::

##### float + calc

::: vue-playground
@file App.vue
```vue
<template>
  <div class="left-fixed-width-right-self-adaption-float-calc-demo">
    <div class="left">left</div>
    <div class="right">right</div>
  </div>
</template>
<style scoped>
.left-fixed-width-right-self-adaption-float-calc-demo {
  width: 100%;
  height: 250px;
  border: 1px solid;
  & > div {
    height: 100%;
  }
  .left {
    float: left;
    width: 100px;
    background-color: cornflowerblue;
  }
  .right {
    float: left;
    width: calc(100% - 100px);
    background-color: greenyellow;
  }
}
</style>
```
:::
