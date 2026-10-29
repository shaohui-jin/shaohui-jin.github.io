---
title: 格式化上下文模型 FC
lang: zh-CN
date: 2024-04-08 10:51:31
permalink: /Promotion/BFC/
headerDepth:
  6
category: 
  - CSS
tag: 
  - CSS
---

## 何为 box

Box 是 CSS 布局的 **对象** 和 **基本单位**， 一个页面是由很多个 Box 组成的。

```javascript
[].forEach.call(document.querySelectorAll('*') , (dom) => dom.style.outline = '1px solid red')
```

![](https://shaohui-jin.github.io/picx-images-hosting/blog/CSS/百度首页box.7awyiko50q.webp "百度首页box")

### 盒类型

Box 的类型：由元素的 **类型** 和 **display** 属性决定。

不同类型的 Box，会参与不同的 Formatting Context **（一个决定如何渲染文档的容器）**，因此 Box 内的元素会以不同的方式渲染。

| 盒子类型      | 属性及特性                                             | 参与FC                            |
|--------------|---------------------------------------------------|---------------------------------|
| block-level  | display: block / list-item / table 的元素            | block formatting context  (BFC) |
| inline-level | display: inline / inline-block / inline-table 的元素 | inline formatting context (IFC) |

### 盒模型

盒子的组成： **内容 content**、**内边距 padding**、 **边框 border**、 **外边距 margin**

盒模型标准：

- 标准盒模型： margin + border + padding + content
- IE盒模型： margin + content(border + padding + content)

控制盒模型的模式：

- box-sizing: content-box; (默认值，标准盒模型)
- box-sizing: border-box; (IE盒模型)

::: vue-playground
@file App.vue

```vue
<template>
  <div class="BoxModel_demo_box">
    <div class="content">标准盒模型</div>
    <div class="border">IE盒模型</div>
  </div>
</template>
<style scoped>
.BoxModel_demo_box {
  display: flex;
  justify-content: space-around;
  color: yellow;
  .content {
    box-sizing: content-box;
    width: 100px;
    height: 100px;
    background-color: blue;
    border: 10px red solid;
    margin: 4px;
    padding: 10px;
  }
  .border {
    box-sizing: border-box;
    width: 100px;
    height: 100px;
    background-color: blue;
    border: 10px red solid;
    margin: 4px;
    padding: 10px;
  }
}
</style>
```
:::

## 包含块

元素 最近 的 **祖先块元素(inline-block, block 或 list-item 元素)** 的内容区

### 作用

为它里面包含的元素提供一个 **参考**，元素的 **尺寸** 和 **位置** 的计算往往是由该元素所在的包含块决定的。

`简单的说谁是谁的包含块，谁是谁的参照系`

### 如何确定一个元素的包含块

包含块可能是 box 的 **content** 包含块，也可能是 box 的 **padding** 包含块。

这取决于被包含块所包含的元素的 **position** 属性：

- 为 **static** 、 **relative** 或 **sticky**，包含块可能由它的 **最近的祖先块元素（比如说inline-block, block 或 list-item元素）** 的内容区的边缘组成，也可能会建立格式化上下文。 
- 如果 position 属性是 **fixed**，包含块是 **视口viewport**。
- 如果 position 属性为 **absolute** ，包含块就是由它的 最近的 且 position不是static 的祖先元素的 内边距区 的边缘组成。
- 如果 position 属性是 **absolute 或 fixed**，包含块也可能是由满足以下条件的最近父级元素的内边距区的边缘组成的：
  - transform 或 perspective 的值不是 none
  - will-change 的值是 transform 或 perspective
  - filter 的值不是 none 或 will-change 的值是 filter(只在 Firefox下生效)
  - contain 的值是 paint (例如: contain: paint;)

::: vue-playground
@file App.vue

```vue
<template>
  <div class="include-block_demo_box">
    <p>This is a paragraph!</p>
  </div>
</template>
<style scoped>
.include-block_demo_box {
  margin: 0;
  position: absolute;
  width: 400px;
  height: 200px;
  color: yellow;
  border: 1px solid black;
  p {
    margin: 0;
    position: absolute;
    width: 50%;   /* == (400px) * .5 = 200px */
    height: 25%;  /* == (200px) * .25 = 50px */
    background: blue;
  }
}
</style>
```
:::

这个例子中 p 的 position 为 **absolute**，所以应 **从内向外** 找到最近的 position 不为static的元素，这里找到了父级盒子div，其 position 值为 absolute，故 p 的包含块为 div

## FC（Formatting Context）

格式化上下文，是页面中的一块渲染区域，并且有一套渲染规则，它决定了子元素如何定位，以及与其他元素的关系及相互作用。

存在四种类型的FC：

- 「**BFC**」全称「**块级 Block**格式化上下文」，是用于 **布局块级盒子** 的一块 渲染区域。
- 「**IFC**」全称「**内联 Inline**格式化上下文」，是用于 **布局内联元素盒子** 的一块 渲染区域。
- 「**GFC**」全称「**网格 Grid**布局格式上下文」，是用于 **布局网格容器** 的一块 渲染区域。
- 「**FFC**」全称「**弹性 Flexible**格式化上下文」，是用于 **布局弹性容器** 的一块 渲染区域。

### BFC 块级格式化上下文

只有 **Block-level box** 参与， 它规定了内部的 **Block-level Box** 如何布局。

##### BFC的形成条件

- <span style="color: red"> **浮动元素 float** </span> 的值不为 <span style="color: red"> **left / right / inherit** </span> 中的任何⼀个
- <span style="color: red"> **溢出元素 overflow** </span> 的值为 <span style="color: red"> **hidden / scroll / auto / inherit** </span> 中的任何⼀个
- <span style="color: red"> **定位元素 position** </span> 的值为 <span style="color: red"> **absolute / fixed** </span> 中的任何⼀个
- <span style="color: red"> **显示元素 display** </span> 的值为 <span style="color: red"> **inline-block / table-caption / table-cell </span> 中的任何⼀个

##### BFC的布局规则

1. 内部的 box(块级元素) 会在 **垂直方向** 上，一个接一个的放置(BFC中的子元素之间)
2. box 垂直方向 的距离由 margin 决定，属于 **同一个BFC的两个相邻 box 的 margin 会发生重叠**(BFC中的子元素之间)
3. BFC 的区域 **不会与浮动元素区域重叠**(BFC中的浮动元素同级之间)
4. BFC 就是页面上一个 **独立容器**，容器内的子元素不会影响到外面的元素(BFC和其他元素同级之间)
5. 计算 BFC 的高度时，**浮动元素也参与计算**(BFC中的浮动元素父子之间)

###### BFC的布局规则 1 解析

`内部的 box(块级元素) 会在 垂直方向 上，一个接一个的放置(BFC中的子元素之间)`

不在BFC里，块级 Box 也会 **垂直排列**

###### BFC的布局规则 2 解析

块级元素 margin 会重叠，即由 **margin** 较大的为准。

案例中 蓝色盒子 的 **margin-bottom** 是 **10px**，而橘色盒子的 margin-top 为 **20px**， 则 橘黄色盒子 的 **margin-top** 最终取得 **20px**

> box 垂直方向 的距离由 margin 决定，属于 同一个BFC的两个相邻 box 的 margin 会发生重叠(BFC中的子元素之间)

::: vue-playground 
@file App.vue
```vue
<template>
  <div class="BFC_rule_2_demo_box">
    <div class="box1"></div>
    <div class="box2"></div>
  </div>
</template>
<style scoped>
.BFC_rule_2_demo_box {
  float: left;
  width: 400px;
  height: 250px;
  background-color: yellow;
  .box1 {
    height: 20px;
    margin: 10px 0;
    background-color: deepskyblue;
  }
  .box2 {
    height: 20px;
    margin: 20px 0;
    background-color: orangered;
  }
}
</style>
```
:::

###### BFC的布局规则 3 解析

浮动元素固定宽度，BFC元素不设置宽度，则宽度会自适应

案例中 红色盒子设置 **浮动(同时也是BFC)**，设置宽度 **250px**，蓝色盒子设置 溢出元素属性 **overflow为 hidden(触发BFC)**，不设置宽度，则自适应填充剩余宽度

> BFC 的区域 不会与浮动元素区域重叠(BFC中的浮动元素同级之间)

::: vue-playground 
@file App.vue
```vue
<template>
  <div class="BFC_rule_3_demo_box">
    <div class="box1"></div>
    <div class="box2"></div>
  </div>
</template>
<style scoped>
.BFC_rule_3_demo_box {
  width: 400px;
  height: 250px;
  background-color: yellow;
  .box1 {
    float: left; /*既是浮动元素，也是BFC*/
    width: 200px;
    height: 250px;
    margin-right: 10px;
    background-color: red;
  }

  .box2 {
    overflow: hidden; /*设置BFC，不被浮动元素覆盖*/
    height: 250px;
    background-color: blue;
  }
}
</style>
```
:::

###### BFC的布局规则 4 解析

案例中 蓝色盒子作为 BFC容器子元素，**height + margin(20 + 10)** 大于了 **BFC 的高度(20)**，但是并未影响 BFC容器 外部 红色盒子 的布局

> BFC 就是页面上一个 独立容器，容器内的子元素不会影响到外面的元素(BFC和其他元素同级之间)

::: vue-playground 
@file App.vue
```vue
<template>
  <div class="BFC_rule_4_demo_box">
    <div class="wrapper">
      <div class="box1"></div>
    </div>
    <div class="box2"></div>
  </div>
</template>
<style scoped>
.BFC_rule_4_demo_box {
  float: left;
  width: 400px;
  height: 250px;
  background-color: yellow;
  .wrapper {
    overflow: hidden;
    height: 20px;
    .box1 {
      height: 20px;
      margin: 10px 0;
      background-color: blue;
    }
  }
  .box2 {
    height: 20px;
    margin: 20px 0;
    background-color: red;
  }
}
</style>
```
:::

###### BFC的布局规则 5 解析

> 计算 BFC 的高度时，浮动元素也参与计算(BFC中的浮动元素父子之间)

::: vue-playground
@file App.vue
```vue
<template>
  <div class="BFC_rule_5_demo_box">
    <div class="box"></div>
  </div>
</template>
<style scoped>
.BFC_rule_5_demo_box {
  padding: 5px;
  overflow: hidden;
  background-color: yellow;
  .box {
    float: left;
    height: 20px;
    width: 20px;
    margin: 20px 0;
    background-color: blue;
  }
}
</style>
```
:::

### IFC 内联格式化上下文

##### IFC的形成条件

块级元素中 **仅** 包含 **内联级别元素**

##### IFC的布局规则

1. 盒是从包含块的顶部开始 **水平方向**，一个接一个的放置
2. 水平 **padding、border、margin** 都有效，**垂直方向不被计算**。
3. 在垂直方向上，子元素会以不同 **对齐方式(vertical-align)**，可能会使用 **底部** 或 **顶部** 对齐，也可能通过其内部的 **文本基线(baseline)** 对齐
4. 能把在一行上的框都完全包含进去的一个矩形区域，被称为该行的 **行框(line box)**。行框的宽度是由 **包含块(containing box)** 和存在的 **浮动** 来决定。
5. IFC 中的 **行框(line box)** 一般左右边贴紧其 **包含块**，但 float 元素会 **优先排列**。
6. IFC 中的 **行框(line box)** 高度由 CSS 行高计算规则来确定，同个 IFC 下的多个 **行框(line box)** 高度可能会不同(比如一行包含了较高的图片，而另一行只有文本)。
7. 当 **inline-level boxes** 的 总宽度 少于包含它们的 line box 时，其水平渲染规则由 **text-align** 属性值来决定，<span style="color: red">**如果取值为 justify，那么浏览器会对 inline-boxes(注意不是 inline-table 和 inline-block boxes)中的文字和空格做出拉伸**</span>
8. 当一个 inline box 超过  **行框(line box)** 的宽度时，它会被分割成多个 boxes，这些 boxes 分布在多个 **行框(line box)** 中。 <span style="color: red">**如果一个 inline box 不能被分割，比如只包含单个字符，或 word-breaking 机制被禁用，或该行内框受 white-space 属性值为 nowrap 或 pre 的影响，那么这个 inline box 将溢出这个 line box**</span>

###### IFC的布局规则 1 解析

> 盒是从包含块的顶部开始 水平方向，一个接一个的放置

::: vue-playground 
@file App.vue
```vue
<template>
  <div class="IFC_rule_1_demo_box">
    <span class="text">文本一</span>
    <span class="text">文本二</span>
  </div>
</template>
<style scoped>
.IFC_rule_1_demo_box {
  border: 1px solid black;
  display: inline-block;
  .text {
    background: yellow;
  }
}
</style>
```
:::

###### IFC的布局规则 2 解析

案例中，给文本增加了margin，只有水平方向有效果，垂直方向无效

> 水平 padding、border、margin 都有效，垂直方向不被计算

::: vue-playground
@file App.vue
```vue
<template>
  <div class="IFC_rule_2_demo_box">
    <span class="text">文本一</span>
    <span class="text">文本二</span>
  </div>
</template>
<style scoped>
.IFC_rule_2_demo_box {
  border: 1px solid black;
  display: inline-block;
  .text {
    background: yellow;
    margin: 30px; 
  }
}
</style>
```
:::

###### IFC的布局规则 3 解析

> 在垂直方向上，子元素会以不同对齐方式，可能会使用 底部或顶部 对齐，也可能通过其内部的 文本基线(baseline) 对齐

::: vue-playground 
@file App.vue
```vue
<template>
  <div class="IFC_rule_3_demo_box">
    <img class="pic" src="https://shaohui-jin.github.io/picx-images-hosting/blog/Logo/User.73tpi84jwb.gif" />
    <span class="text">文本一</span>
  </div>
</template>
<style scoped>
.IFC_rule_3_demo_box {
  border: 1px solid black;
  display: inline-block;
  .pic {
    height: 150px;
    //vertical-align: baseline; /* 默认值 */
    vertical-align: middle;
  }
}
</style>
```
:::

###### IFC的布局规则 4 解析

> 能把在一行上的框都完全包含进去的一个矩形区域，被称为该行的 行框(line box)。行框的宽度是由 包含块 和存在的 浮动 来决定。

::: vue-playground 
@file App.vue
```vue
<template>
  <div class="IFC_rule_4_demo_box">
    <img class="pic" src="https://shaohui-jin.github.io/picx-images-hosting/blog/Logo/User.73tpi84jwb.gif" />
    <span class="text">文本一</span>
    <img class="pic1" src="https://shaohui-jin.github.io/picx-images-hosting/blog/Logo/User.73tpi84jwb.gif" />
  </div>
</template>
<style scoped>
.IFC_rule_4_demo_box {
  border: 1px solid black;
  display: inline-block;
  .pic {
    height: 100px;
    width: 150px;
  }
  .pic1 {
    float: left;
    height: 100px;
    width: 100px;
  }
}
</style>
```
:::

###### IFC的布局规则 6 解析

> IFC 中的 行框 高度由 CSS 行高计算规则来确定，同个 IFC 下的多个行框高度可能会不同。

::: vue-playground
@file App.vue
```vue
<template>
  <div class="IFC_rule_6_demo_box">
    <img class="pic" src="https://shaohui-jin.github.io/picx-images-hosting/blog/Logo/User.73tpi84jwb.gif" />
    <span class="text">文本一</span>
    <img class="pic1" src="https://shaohui-jin.github.io/picx-images-hosting/blog/Logo/User.73tpi84jwb.gif" />
  </div>
</template>
<style scoped>
.IFC_rule_6_demo_box {
  border: 1px solid black;
  display: inline-block;
  .pic {
    height: 100px;
    width: 150px;
  }
  .pic1 {
    height: 100px;
    width: 100px;
  }
}
</style>
```
:::

###### IFC的布局规则 7 解析

> 当 inline-level boxes 的 总宽度 少于包含它们的 line box 时，其水平渲染规则由 text-align 属性值来决定

::: vue-playground
@file App.vue
```vue
<template>
  <div class="IFC_rule_7_demo_box">
    <span class="text">文本一</span>
    <span class="text">文本二</span>
  </div>
</template>
<style scoped>
.IFC_rule_7_demo_box {
  border: 1px solid black;
  width: 200px;
  text-align: right;
  .text {
    background: yellow;
  }
}
</style>
```
:::

#### GFC 网格格式化上下文

##### GFC的形成条件

**display: gird / inline-grid** 的容器

##### GFC的布局规则

通过在 **网格容器(grid container)**上 定义 **网格定义行(grid definition rows)** 和 **网格定义列(grid definition columns)** 属性，
在 **网格项目(grid item)** 上 **定义网格行(grid row)** 和 **网格列(grid columns)** 为每一个 **网格项目(grid item)** 定义位置和空间

###### GFC的布局规则解析

::: vue-playground 
@file App.vue
```vue
<template>
  <div class="GFC_rule_demo_box">
    <div class="header">头部</div>
    <div class="aside">侧边栏</div>
    <div class="main">内容</div>
    <div class="footer">底部</div>
  </div>
</template>
<style scoped>
.GFC_rule_demo_box {
  display: grid;
  width: 500px;
  height: 300px;
  grid-template-areas:
	"header header header"
	"sidebar content content"
	"footer footer footer";
  .header {
    grid-area: header;
    background: yellow;
  }
  .aside {
    grid-area: sidebar;
    background: deepskyblue;
  }
  .main {
    grid-area: content;
    background: greenyellow;
  }
  .footer {
    grid-area: footer;
    background: orangered;
  }
}
</style>
```
:::

#### FFC 弹性格式化上下文

##### FFC的形成条件

**display: flex / inline-flex** 的容器

##### FFC的布局规则

1. 设置为 **flex** 的容器被渲染为一个 **块级元素**
2. 设置为 **inline-flex** 的容器则渲染为一个 **行内元素**
3. 弹性容器中的每一个子元素都是一个弹性项目

