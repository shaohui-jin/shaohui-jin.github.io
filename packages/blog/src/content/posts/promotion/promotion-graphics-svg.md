---
title: Svg 入门
lang: zh-CN
date: 2022-08-19 11:33:25
permalink: /Promotion/Graphics/Svg/
isOriginal: true # 当前文章是否为原创
sticky: true  # 是否在列表中置顶 ，数字越大，排名越靠前
star: true # 是否收藏在博客主题的文章列表中。数字越大，排名越靠前
category: 
  - Svg
tag: 
  - Svg
---

## 简介

SVG 是 `Scalable Vector Graphics` 的缩写，意为`可缩放矢量图形`。于 2003年1月14日 SVG 1.1 被Sun公司（已被Oracle公司收购）、Adobe、苹果公司、IBM 以及柯达共同确立成为`W3C`推荐标准。

### 概念

1. SVG是 `Scalable Vector Graphics` 的缩写 意为`可缩放矢量图形`
2. SVG是一个基于`文本`的`开放网络标准`，用来定义用于`网络`的`矢量图形`
3. SVG图像在`放大`或`改变尺寸`的情况下其图形`质量不会有所损失`，因此能够优雅而简洁地渲染不同大小的图形，并和`CSS`，`DOM`，`JavaScript`和`SMIL`等其他网络标准无缝衔接
4. SVG 使用 `XML` 格式定义图形
5. SVG是万维网联盟的标准与诸如 `DOM` 和 `XSL` 之类的 `W3C` 标准是一个整体

<!-- more -->

### 优势

1. `SVG` 与 `JPEG` 和 `GIF` 图像比起来，`尺寸更小`，且`可压缩性更强`。
2. SVG图像中的文本是`可选`的，同时也是`可搜索`的，且可以与 `JavaScript` 技术一起运行
3. SVG可在图像`质量不下降`的情况下被`放大`和`缩小`
4. SVG可被非常多的工具`读取`和`修改`（比如文本编辑器）
5. SVG图像`不依赖分辨率`，可在任何的分辨率下被`高质量`地打印
6. SVG文件是纯粹的`XML`
7. SVG是`开放的标准`

### 缺点

1. SVG`复杂度`越`高`渲染速度就会越`慢`（任何过度使用DOM的应用都不快）
2. SVG`不适合游戏`应用，只能结合`Canvas`来实现
3. SVG不能动态的`修改动画`内容

**PS**: 需要注意的是因为`XML`和`HTML`不同，`XML`是区分大小写的，而`SVG`是使用`XML`格式来定义图形，所以在编写SVG的的时候`元素`和`属性`必须按`标准格式`书写。

### 浏览器兼容性

这里直接放一张 Can I Use 的详细兼容表。

![](https://shaohui-jin.github.io/picx-images-hosting/blog/CanIUse/svg.8ad0qqnzlg.webp " " =800x)

## 语法

SVG的语法如下：

```vue
<template>
  <svg>
    <circle cx="100" cy="100" r="50"/>
  </svg>
</template>
```

如上面的语法所示，SVG的`绘制`其实就是一个`SVG标签`，然后在标签内绘制要绘制的内容，比如上面的语法是在SVG标签中绘制了一个圆形`(cx、cy为圆的坐标，r为圆的半径)`。

### 属性

#### width、height `SVG`的`宽高`

:::vue-demo
```vue
<template>
  <svg width="300" height="300">
    <circle cx="100" cy="100" r="100"/>
  </svg>
</template>
```
:::

:::info Tips
注意：在`不设置`宽高的情况下，默认为`300 * 150`，当`内部元素`大于`300 * 150`时，大于部分会被隐藏。
:::

在坐标为`（100， 100）`的地方绘制一个`半径`为`100`的`圆`

:::vue-demo
```vue
<template>
  <svg>
    <circle cx="100" cy="100" r="100"/>
  </svg>
</template>
```
:::

#### viewBox 可以`显示`的`区域`。

**语法：** `viewBox="x y w h"`

**参数：**
- x、y为`起始点`
- w、h为`显示区域`的`宽高`

:::vue-demo
```vue
<template>
  <svg width="300" height="300" viewBox="0 0 100 100">
    <circle cx="100" cy="100" r="100"/>
  </svg>
</template>
```
:::

如图SVG里面的圆只显示了一部份，原因是`viewBox`定义了一个：从·点开始，宽高为`100 * 100`的显示区域。而这个`100 * 100`的显示区域会放到`300 * 300(svg宽高)`的SVG中去显示，整体就`放大`了`3`倍。

#### version 指明SVG的版本

version属性纯粹就是一个`说明`，对`渲染`或`处理`没有任何影响。且目前只有 `1.0` 和 `1.1` 这两个版本。

**语法：** `version="1.1"`

:::info Tips
下面是来自维基百科的一些版本信息：

- 版本 1.x
1. `SVG 1.0`于 2001 年 9 月 4 日成为 `W3C` 推荐标准。
2. `SVG 1.1` 于 2003 年 1 月 14 日成为 `W3C` 推荐标准。SVG 1.1 规范是`模块化`的，以便允许将`子集`定义为`配置文件`。除此之外，SVG 1.1 和 SVG 1.0 之间几乎没有区别。
3. `SVG Tiny` 和 `SVG Basic`（移动 SVG 配置文件）于 2003 年 1 月 14 日成为 `W3C` 推荐标准。这些被描述为 SVG 1.1 的`配置文件`。
4. `SVG Tiny 1.2` 于 2008 年 12 月 22 日成为 `W3C` 推荐标准。它最初是作为计划中的 `SVG Full 1.2` 的配置文件（后来被 SVG 2 放弃），但后来被重构为`独立规范`。它通常得不到很好的支持。
5. `SVG 1.1 第二版`，包括所有勘误表和说明，但在 2011 年 8 月 16 日发布的原始 `SVG 1.1` 没有新功能。
6. `SVG Tiny 1.2 Portable/Secure`，`SVG Tiny 1.2` 配置文件的`更安全`子集，于 2020 年 7 月 29 日作为 `IETF` 草案标准引入。也称为 `SVG Tiny P/S`。`SVG Tiny 1.2 Portable/Secure` 是`BIMI`草案标准的要求。

- 版本 2

1. `SVG 2` 删除了几个`字体元素`，例如`glyph`和altGlyph（由 `WOFF` 字体格式替换）。
2. 不推荐使用该`xml:space`属性以支持 CSS。
3. 添加了 `HTML5` 功能，例如 `translate` 和 `data-*` 属性。
4. `SVG Tiny 1.2` 中的`文本处理功能`被注释为包含在内，但`尚未`在文本中`正式化`。其他一些 `1.2` 特性是`精选`的。但 `SVG 2` 通常 `不是` `SVG tiny 1.2` 的`超集`。
5. `SVG 2` 于 2016 年 9 月 15 日进入候选推荐阶段，修订版于 2018 年 8 月 7 日和 2018 年 10 月 4 日发布。最新草案于 2022 年 3 月 21 日发布。
:::

#### xmlns 和 xmlns:xlink

上面我们说过SVG使用XML格式定义图形，SVG文件是纯粹的XML文件。

在XML中，`标签`和`属性`属于`命名空间`，这是为了防止来自不同技术的`标签`和`属性`发生`冲突`。

- 案例

```html
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    // ......
</svg>
```

:::info Tips
在`SVG`中存在`a标签`，在`HTML`中也存在`a标签`，那么怎么区分这个a标签属于哪一种技术，这就需要使用`命名空间`了。

加入命名空间以后就能知道哪一个是`svg:a`，哪一个又是`html:a`，这样就可以区分出不同的`标签`和`属性`。
:::

##### xmlns

xmlns用于声明`命名空间`（`namespace`），在此声明之下的所有`子标签`都属于这个空间内。这里看起来是一个`url`，但实际上仅仅是一个字符串，这样使用只是惯例。因此很多时候都会被称为 `namespace url` 而不是 `namespace name`。

在SVG中加入xmlns时，因为它定义了`默认命名空间`，因此不需要前缀，直接在SVG标签中写一个a标签，`a标签`和`UA`就知道它是SVG的a标签而不是HTML的a标签

##### xmlns:xlink

`xmlns:xlink` 表示前缀为`xlink`的`标签`和`属性`，应该由理解该规范的 `UA` 使用 `xlink` 规范 来解释。

注解：UA是`User Agent`的简称。`User Agent`是`Http`协议中的一部分，属于`头域`的组成部分。通俗地讲`UA`是一种向`访问网站`提供你所使用的`浏览器类型`、`操作系统`、`浏览器内核`等信息的`标识`。通过这个标识，用户所访问的网站可以显示不同的排版，从而为用户提供更好的`体验`或者进行`信息统计`。


### 基本图形

#### 圆形（circle）

**语法：** `<circle cx="100" cy="100" r="100"/>`

**参数：**
- `cx`、`cy`为圆的坐标
- `r`为圆的半径

:::vue-demo
```vue
<template>
  <svg width="300" height="300">
    <circle cx="100" cy="100" r="100"/>
  </svg>
</template>
```
:::

#### 矩形（rect）

**语法：** `<rect x="0" y="0" rx="5" ry="5" width="300" height="200"/>`

**参数：**
- x、y为矩形的起`始点坐标`
- rx、ry为圆角x、y轴方向的半径
- width、height为矩形的宽高

:::vue-demo
```vue
<template>
  <svg width="300" height="300">
    <rect x="0" y="0" rx="5" ry="5" width="300" height="200"/>
  </svg>
</template>
```
:::

#### 椭圆（ellipse）

`ellipse`标签比`circle`标签功能更强大，`ellipse`标签也可以实现`圆形`的绘制，并且还可以分别缩放圆形的`长轴半径`和`短轴半径`，从而达到`椭圆`的效果。

**语法：** `<ellipse cx="100" cy="100" rx="100" ry="50"/>`

**参数：**
- `cx`、`cy`为椭圆的坐标
- `rx`为椭圆的x轴半径
- `ry`为椭圆的y轴半径

:::vue-demo
```vue
<template>
  <svg width="600" height="200">
    <ellipse cx="100" cy="100" rx="100" ry="50"/>
    <ellipse cx="400" cy="100" rx="100" ry="100"/>
  </svg>
</template>
```
:::

#### 线条（line）

**语法：** `<line x1="10" x2="50" y1="110" y2="150"/>`

**参数：**
- `x1`、`y1`为`起点`的坐标
- `x2`、`y2`为`终点`的坐标

:::vue-demo
```vue
<template>
  <svg width="300" height="200">
    <!-- 不设置样式属性 style 是看不出效果的 -->
    <line x1="50" x2="50" y1="200" y2="50" style="stroke: #000000;"/>
  </svg>
</template>
```
:::

#### 折线（polyline）

**语法：** `<polyline points="0 0, 20 40, 70 80, 100 90, 200 30, 250 50" />`

**参数：**
- `points`为`点集数列`，其中每个点都必须包含`2个数字`，一个是`x坐标`，一个是`y坐标`。

:::vue-demo
```vue
<template>
  <svg width="300" height="100">
    <!-- 不设置样式属性style是看不出效果的 并且polyline默认为填充需要把fill属性设置为none -->
    <polyline points="0 0, 20 40, 70 80, 100 90, 200 30, 250 50" fill="none" style="stroke: #000000;" />
  </svg>
</template>
```
:::

#### 多边形（polygon）

`polygon`标签和`polyline`标签类似，都是由很多个点链接在一起的。但不同的是`polygon`路径中的`最后一个点`和`第一个点`是默认闭合的。

**语法：** `<polygon points="0 0, 20 40, 70 80, 100 90, 200 30, 250 50" />`

**参数：**
- `points`为`点集数列`，其中每个点都必须包含`2个数字`，一个是`x坐标`，一个是`y坐标`。

:::vue-demo
```vue
<template>
  <svg width="300" height="300">
    <!-- 不设置样式属性style是看不出效果的 并且polygon默认为填充需要把fill属性设置为none -->
    <polygon points="0 0, 20 40, 70 80, 100 90, 200 30, 250 50" fill="none" style="stroke: #000000;" />
  </svg>
</template>
```
:::

#### 路径（path）

path标签是所有图形中最复杂的，但他也是最强大的。在SVG中最常用的图形就是path标签，他可以绘制圆形、椭圆、矩形、线条、折线、多边形、贝塞尔曲线等。

**语法：** `<path d="M50 50 H 200 V 200 H 50 L 50 50"/>`

**参数：**
- d为一个`点集数列`以及其它`绘制路径`的`信息`。

:::vue-demo
```vue
<tempalte>
  <svg width="200" height="200">
    <path d="M50 50 H 200 V 200 H 50 L 50 50" fill="none" style="stroke: #000000;"/>
  </svg>
</tempalte>
```
:::

##### 命令

`path标签`的图形形状是通过`属性d`来定义的，属性d的值是以：`命令 + 参数` 的形式进行组合的，命令又是通过`关键字`来表示的。

那么究竟有哪些命令呢？总结了一下概括为以下`10`个命令：

- M = Move to
- L = Line to
- H = Horizontal Line to
- V = Vertical Line to
- Q = Quadratic Bezier Curve to
- T = Smooth Quadratic Bezier Curve to
- C = Curve to
- S = Smooth Curve to
- A = Elliptical Arc
- Z = close path

:::info Tips
所有命令中，`大写`为`绝对定位`，`小写`为`相对定位`。
:::

##### 直线命令

###### M（Move to）

`M`命令其实就是把画笔`移动`到`某个点`，就好像画笔提起来以后移动到一个新的位置准备开始绘制。但因为仅仅是`移动`画笔而`没有绘制`，所以M命令经常出现在路径的`起始点`，用来`指明`画笔应该从`何处`开始`绘制`。

每一段路径都`必须`以`M`命令`开头`，如果有`多个`M命令则表示`新路径`的`开始`。

**语法：** M x y 或者 m x y

**参数：**
- x、y为坐标

###### L（Line to）

`L`命令会`绘制一点`并且和之前的点（也就是L命令`前面的点`）连成一条`直线`。

**语法：** L x y 或者 l x y

**参数：**
- x、y为坐标

:::vue-demo
```vue
<template>
  <svg width="300" height="300">
    <!-- 从起始点（50， 20）画一条到（250， 20）的直线 -->
    <path d="M50 20 L250 20" style="stroke: #000000;"/>
    <!-- 从起始点（50， 50）画一条到（250， 50）的直线 和 从起始点（50， 100）画一条到（250， 100）的直线 -->
    <!-- M命令为多个时，后面的M命令为先线段的起始点 -->
    <path d="M50 50 L250 50 M50 100 L250 100" style="stroke: #ff0000;"/>
    <!-- 从起始点（50， 150）画一条到（250， 150）的直线 -->
    <!-- M命令后面连续跟着多个坐标点，除了第一个坐标点，后面的全部默认为隐式的L命令 -->
    <path d="M50 150 250 150" style="stroke: #00ff00;"/>
    <!-- 从起始点（50， 200）画一条到（250， 200）又到（250，250）的折线 -->
    <!-- 多个L命令连续可以省略后面的L命令 -->
    <path d="M50 200 L250 200 250 250 " fill="none" style="stroke: #0000ff;"/>
  </svg>
</template>
```
:::

###### H（Horizontal Line to）

`H`命令可以从之前的点绘制一条`水平`的`直线`，`H`命令可以等价于`y值`和`之前点`相同的`L`命令

**语法：** H x 或者 h x

**参数：**
- x 为X轴坐标

:::vue-demo
```vue
<template>
  <svg width="300" height="100">
    <!-- 从起始点（50， 20）画一条X轴为250的水平直线 -->
    <path d="M50 20 H250" style="stroke: #000000;"/>
  </svg>
</template>
```
:::

###### V（Vertical Line to）

`V`命令可以从之前的点绘制一条`垂直`的`直线`，`V`命令可以等价于`x值`和`之前点`相同的`L`命令

**语法：** V y 或者 v y

**参数：**
- y 为Y轴坐标

:::vue-demo
```vue
<template>
  <svg width="300" height="250">
    <!-- 从起始点（50， 20）画一条Y轴为250的垂直直线 -->
    <path d="M50 20 V250" style="stroke: #000000;"/>
  </svg>
</template>
```
:::

:::info Tips
PS：注意连续的`H`命令和`V`命令取`大值`
:::

:::vue-demo
```vue
<template>
  <svg width="300" height="300">
    <path d="M50 20 H200 100" style="stroke: #000000;"/>
    <path d="M50 20 V200 100" style="stroke: #ff0000;"/>
  </svg>
</template>
```
:::

###### Z（Close path）

`Z`命令是一个`闭合命令`，会从`当前点`画一条直线到路径的`起始点`。`Z`命令因为`没有参数`所以`Z`和`z`效果一样，所以不区分大小写，

**语法：** Z 或者 z

:::vue-demo
```vue
<template>
  <svg width="300" height="300">
    <path d="M50 20 H200 V200 Z" fill="none" style="stroke: #000000;"/>
  </svg>
</template>
```
:::

##### 曲线命令

###### Q（Quadratic Bezier Curve to）

`Q`命令可以用来绘制一条`二次贝塞尔曲线`，`二次贝塞尔曲线`需要一个`控制点`，用来确定`起点`和`终点`的`曲线斜率`。

**语法：** Q x1 y1, x y 或者 q x1 y1, x y

**参数：**
- x、y为`终点位置`
- x1、y1为`控制点`

:::vue-demo
```vue
<template>
  <svg width="300px" height="200px">
    <path d="M50 100 Q 175 200 300 100" fill="none" style="stroke: #ff0000"/>
  </svg>
</template>
```
:::

###### T（Smooth Quadratic Bezier Curve to）

`T`命令是一个 `延长` `二次贝塞尔曲线`的简化命令，`T`命令可以通过`前一个控制点`推断出`后一个控制点`，这也就是为什么`T`命令只需要`一个坐标`的原因。

需要注意的是`T`命令的的前面必须有一个`Q`命令或者其他的`T`命令。如果`T`命令单独使用，那么`控制点`就会被认为和`终点`是同一个点，所以画出来的将是`一条直线`

**语法：** T x y 或者 t x y

**参数：**
- x、y为终点位置

:::vue-demo
```vue
<template>
  <svg width="600px" height="300px">
    <path d="M50 100 Q 175 200 300 100 T 600 100 " fill="none" style="stroke: #ff0000;"/>
    <!--上下等同-->
    <path d="M50 150 Q 175 250 300 150 Q 425 50 600 150 " fill="none" style="stroke: #002aff;"/>
  </svg>
</template>
```
:::

###### C（Curve to）

`C`命令可用来绘制一条`三次贝塞尔曲线`，相对于`二次贝塞尔曲线`多了`一个控制点`。

**语法：** C x1 y1, x2 y2, x y 或者 c x1 y1, x2 y2, x y

**参数：**
- x、y为`终点位置`
- x1、y1为曲线`起始点`的`控制点`
- x2、y2为`曲线终止`的`控制点`。

:::vue-demo
```vue
<template>
  <svg width="300" height="300">
    <path d="M50 50 C 100 100, 200 100, 250 50" fill="none" style="stroke: #000000;"/>
    <path d="M50 200 C 100 250, 200 150, 250 200" fill="none" style="stroke: #ff0000;"/>
  </svg>
</template>
```
:::

###### S（Smooth Curve to）

`三次贝塞尔曲线`的`S`命令和`二次贝塞尔曲线`的`T`命令比较相似。`S`命令也可以用来创建与前面一样的`贝塞尔曲线`，但如果`S`命令跟在一个`C`命令或者另一个`S`命令的后面，那么它的第一个`控制点`，就会被假设成前一个`控制点`的`对称点`。

如果S命令单独使用，前面没有`C`命令或者另一个`S`命令，那么它的`两个控制点`就会被假设为`同一个点`。

**语法：** S x2 y2, x y 或者 s x2 y2, x y

**参数：**
- x、y为终点位置
- x2、y2为曲线终止的控制点

:::vue-demo
```vue
<template>
  <svg width="300px" height="300px">
    <path d="M10 100 C 40 10, 65 10, 95 100" fill="none" style="stroke: #ff0000;"/>
    <path d="M10 200 C 40 110, 65 110, 95 200 S 150 290, 180 200" fill="none" style="stroke: #ff0000;"/>
    <!--上下等同-->
    <path d="M10 210 C 40 120, 65 120, 95 210 M95 210 C 125 300, 150 300, 180 210" fill="none" style="stroke: #ff0000;"/>
  </svg>
</template>
```
:::

`三次贝塞尔曲线`相对于`二次贝塞尔曲线`拥有更大的自由度，但两种曲线能达到的`效果`是差不多的。最终选择使用哪种贝塞尔曲线，通常取决于需求，以及对曲线对称性的依赖程度。

###### A（Elliptical Arc）

`A`命令用于画`弧形`，它可以截取`圆`或`椭圆`的`弧形`成的曲线

**语法：** A rx ry x-axis-rotation large-arc-flag sweep-flag x y 或者 a rx ry x-axis-rotation large-arc-flag sweep-flag x y

**参数：**
- rx、ry 分别为`X`轴的半径和`Y`轴的半径
- x-axis-rotation 为弧度在`X`轴的`旋转角度`
- large-arc-flag 决定弧线是`大于`还是`小于`180度，`0`表示`小角度弧`，`1`表示`大角度弧`
- sweep-flag 为`弧`的`方向`，`0`表示从起点到终点沿`逆时针`画弧，1表示从起点到终点沿`顺时针`画弧
- x、y 为弧形的`终点`

:::vue-demo
```vue
<template>
  <svg width="300px" height="500px">
    <path d="M10 100 50 100  A 30 50 0 0 1 150 100 L 200 100" fill="none" style="stroke: #ff0000"/>
    <!-- 旋转45度的弧（第三个参数） -->
    <path d="M10 200 50 200  A 30 50 45 0 1 150 200 L 200 200" fill="none" style="stroke: #ff0000"/>
    <!-- 1表示大角度弧（第四个参数） -->
    <path d="M10 300 50 300  A 30 50 -45 1 1 150 300 L 200 300" fill="none" style="stroke: #ff0000"/>
    <!-- 0逆时针（第五个参数） -->
    <path d="M10 400 50 400  A 30 50 0 1 0 150 400 L 200 400" fill="none" style="stroke: #ff0000"/>
  </svg>
</template>
```
:::

##### 填充和轮廓

###### fill

`fill`属性用于`填充`图形的`颜色`

**语法：**` fill= "color"` 或者 `style="fill: color"`

:::vue-demo
```vue
<template>
  <svg>
    <circle cx="80" cy="50" r="50" />
    <circle cx="200" cy="50" r="50" fill="#ff0000"/>
  </svg>
</template>
```
:::

从上面的示例中可以看出，在`不设置`fill属性的时候，其实`默认`是`黑色`的填充，这也就是为什么上面的很多例子设置了 `fill='none'` 其实就是去掉默认填充。

fill属性其实还有一些延伸属性：

###### fill-opacity

`fill-opacity`属性用于设置填充颜色的`透明度`

:::vue-demo
```vue
<template>
  <svg width="400" height="250">
    <circle cx="80" cy="50" r="50" />
    <circle cx="200" cy="50" r="50" fill="#ff0000"/>

    <circle cx="80" cy="130" r="50" fill="#00ff00"/>
    <circle cx="200" cy="130" r="50" fill="#00ff00" fill-opacity="0.5"/>
  </svg>
</template>
```
:::

###### fill-rule

`fill-rule`属性用来设置`复杂形状`的`填充规则`。它有两种填充方式：`nonzero` 和 `evenodd`。该属性简单说就是判断某点属于该形状的`内部`还是`外部`。那么判断的规则是什么呢？

- nonzero

nonzero为`默认值`，

规则为：要判断一个点是否在图形内，从该点作`任意方向`的一条射线，然后检测`射线`与`图形路径`的`交点`情况。从0开始计数，路径从左向右（`顺时针`）穿过射线则计数`加1`，
从右向左（`逆时针`）穿过射线则计数`减1`。得出计数结果后，如果结果是`0`，则认为点在图形`外部`，否则认为在`内部`。

:::vue-demo
```vue
<template>
  <svg width="12cm" height="4cm" viewBox="0 0 1200 400">
    <defs>
      <path id="Triangle" d="M 16,0 L -8,9 v-18 z" fill="#66ff66" stroke="none" />
    </defs>
    <g fill-rule="nonzero" fill="#6666ff" stroke="#ff6666" stroke-width="3" >
      <path d="M 250,75 L 323,301 131,161 369,161 177,301 z" />
      <use xlink:href="#Triangle" transform="translate(306.21 249) rotate(72)"  />
      <use xlink:href="#Triangle" transform="translate(175.16,193.2) rotate(216)"  />
      <use xlink:href="#Triangle" transform="translate(314.26,161) rotate(0)"  />
      <use xlink:href="#Triangle" transform="translate(221.16,268.8) rotate(144)"  />
      <use xlink:href="#Triangle" transform="translate(233.21,126.98) rotate(288)"  />
      <path d="M 600,81 A 107,107 0 0,1 600,295 A 107,107 0 0,1 600,81 z
              M 600,139 A 49,49 0 0,1 600,237 A 49,49 0 0,1 600,139 z" />
      <use xlink:href="#Triangle" transform="translate(600,188) rotate(0) translate(107,0) rotate(90)" overflow="visible"  />
      <use xlink:href="#Triangle" transform="translate(600,188) rotate(120) translate(107,0) rotate(90)" overflow="visible"  />
      <use xlink:href="#Triangle" transform="translate(600,188) rotate(240) translate(107,0) rotate(90)" overflow="visible"  />
      <use xlink:href="#Triangle" transform="translate(600,188) rotate(60) translate(49,0) rotate(90)" overflow="visible"  />
      <use xlink:href="#Triangle" transform="translate(600,188) rotate(180) translate(49,0) rotate(90)" overflow="visible"  />
      <use xlink:href="#Triangle" transform="translate(600,188) rotate(300) translate(49,0) rotate(90)" overflow="visible"  />
      <path d="M 950,81 A 107,107 0 0,1 950,295 A 107,107 0 0,1 950,81 z
              M 950,139 A 49,49 0 0,0 950,237 A 49,49 0 0,0 950,139 z" />
      <use xlink:href="#Triangle" transform="translate(950,188) rotate(0) translate(107,0) rotate(90)" overflow="visible"  />
      <use xlink:href="#Triangle" transform="translate(950,188) rotate(120) translate(107,0) rotate(90)" overflow="visible"  />
      <use xlink:href="#Triangle" transform="translate(950,188) rotate(240) translate(107,0) rotate(90)" overflow="visible"  />
      <use xlink:href="#Triangle" transform="translate(950,188) rotate(60) translate(49,0) rotate(-90)" overflow="visible"  />
      <use xlink:href="#Triangle" transform="translate(950,188) rotate(180) translate(49,0) rotate(-90)" overflow="visible"  />
      <use xlink:href="#Triangle" transform="translate(950,188) rotate(300) translate(49,0) rotate(-90)" overflow="visible"  />
    </g>
  </svg>
</template>
```
:::

:::info Tips
PS：示例中的`绿色三角形`只是用来辅助理解的，可以忽略，只需要了解规则是`如何填充`的就行。
:::

- evenodd

规则为：要判断一个点是否在图形内，从该点作`任意方向`的一条射线，然后检测`射线`与`图形路径`的`交点`的`数量`。如果结果是`奇数`则认为点在`内部`，是`偶数`则认为点在`外部`。

:::vue-demo
```vue
<template>
  <svg width="12cm" height="4cm" viewBox="0 0 1200 400">
    <defs>
      <path id="Triangle2" d="M 16,0 L -8,9 v-18 z" fill="#66ff66" stroke="none" />
    </defs>
    <g fill-rule="evenodd" fill="#6666ff" stroke="#ff6666" stroke-width="3" >
      <path d="M 250,75 L 323,301 131,161 369,161 177,301 z" />
      <use xlink:href="#Triangle2" transform="translate(306.21 249) rotate(72)" overflow="visible"  />
      <use xlink:href="#Triangle2" transform="translate(175.16,193.2) rotate(216)" overflow="visible"  />
      <use xlink:href="#Triangle2" transform="translate(314.26,161) rotate(0)" overflow="visible"  />
      <use xlink:href="#Triangle2" transform="translate(221.16,268.8) rotate(144)" overflow="visible"  />
      <use xlink:href="#Triangle2" transform="translate(233.21,126.98) rotate(288)" overflow="visible"  />
      <path d="M 600,81 A 107,107 0 0,1 600,295 A 107,107 0 0,1 600,81 z
                M 600,139 A 49,49 0 0,1 600,237 A 49,49 0 0,1 600,139 z" />
      <use xlink:href="#Triangle2" transform="translate(600,188) rotate(0) translate(107,0) rotate(90)" overflow="visible"  />
      <use xlink:href="#Triangle2" transform="translate(600,188) rotate(120) translate(107,0) rotate(90)" overflow="visible"  />
      <use xlink:href="#Triangle2" transform="translate(600,188) rotate(240) translate(107,0) rotate(90)" overflow="visible"  />
      <use xlink:href="#Triangle2" transform="translate(600,188) rotate(60) translate(49,0) rotate(90)" overflow="visible"  />
      <use xlink:href="#Triangle2" transform="translate(600,188) rotate(180) translate(49,0) rotate(90)" overflow="visible"  />
      <use xlink:href="#Triangle2" transform="translate(600,188) rotate(300) translate(49,0) rotate(90)" overflow="visible"  />
      <path d="M 950,81 A 107,107 0 0,1 950,295 A 107,107 0 0,1 950,81 z
                M 950,139 A 49,49 0 0,0 950,237 A 49,49 0 0,0 950,139 z" />
      <use xlink:href="#Triangle2" transform="translate(950,188) rotate(0) translate(107,0) rotate(90)" overflow="visible"  />
      <use xlink:href="#Triangle2" transform="translate(950,188) rotate(120) translate(107,0) rotate(90)" overflow="visible"  />
      <use xlink:href="#Triangle2" transform="translate(950,188) rotate(240) translate(107,0) rotate(90)" overflow="visible"  />
      <use xlink:href="#Triangle2" transform="translate(950,188) rotate(60) translate(49,0) rotate(-90)" overflow="visible"  />
      <use xlink:href="#Triangle2" transform="translate(950,188) rotate(180) translate(49,0) rotate(-90)" overflow="visible"  />
      <use xlink:href="#Triangle2" transform="translate(950,188) rotate(300) translate(49,0) rotate(-90)" overflow="visible"  />
    </g>
  </svg>
</template>
```
:::

:::info Tips
PS：上面示例中的绿色三角形只是用来辅助理解的，可以忽略，咱们只需要了解规则是如何填充的就行。
:::

###### stroke

stroke属性用来定义`线条`、`文本`或`元素` `轮廓` 的颜色。

**语法：** `stroke="color"` 或者 `style="stroke: color"`

:::vue-demo
```vue
<template>
  <svg>
    <circle cx="80" cy="50" r="50" />
    <circle cx="200" cy="50" r="50" stroke="#ff6666"/>
  </svg>
</template>
```
:::

###### stroke-width

`stroke-width`属性定义了轮廓的`宽度`

:::vue-demo
```vue
<template>
  <svg width="300" height="300">
    <circle cx="80" cy="50" r="50" />
    <circle cx="200" cy="50" r="50" stroke="#ff6666" />
    <circle cx="80" cy="200" r="50" stroke="#ff6666" stroke-width="5" />
    <circle cx="200" cy="200" r="50" stroke="#ff6666" stroke-width="10"/>
  </svg>
</template>
```
:::

###### stroke-opacity

`stroke-opacity`属性用于设置轮廓的`透明度`

:::vue-demo
```vue
<template>
  <svg width="300" height="300">
    <circle cx="80" cy="50" r="50" />
    <circle cx="200" cy="50" r="50" stroke="#ff6666" />
    <circle cx="80" cy="100" r="10" stroke="#ff6666" stroke-width="50" />
    <circle cx="200" cy="100" r="10" stroke="#ff6666" fill="none" stroke-width="50" stroke-opacity="0.5"/>
  </svg>
</template>
```
:::

###### stroke-linecap

`stroke-linecap`属性定义了轮廓`终点`的`形状`，该属性有三个值：

- butt：默认值，以`直边`结束线段
- round：以`圆角`结束线段，圆角的半径由`stroke-width（轮廓宽度）`控制的
- square：也是以`直边`结束线段，但和`butt`不同的是会在结束位置多出一段由`stroke-width（轮廓宽度）`大小控制的长度。

:::vue-demo
```vue
<template>
  <svg width="300" height="200">
    <g fill="#ffff00" stroke="#ff0000" stroke-width="10">
      <path stroke-linecap="butt" d="M20 50 l200 0" />
      <path stroke-linecap="round" d="M20 100 l200 0" />
      <path stroke-linecap="square" d="M20 150 l200 0" />
    </g>
  </svg>
</template>
```
:::

###### stroke-linejoin

`stroke-linejoin`属性定义了轮廓`连接处`的`样式`。样式有三种类型：

- miter：默认值，表示用方形画笔在连接处形成`尖角`
- round：用`圆角`连接，实现`平滑`效果
- bevel：连接处会形成一个`斜面`

:::vue-demo
```vue
<template>
  <svg width="160" height="280">
    <g fill="none" stroke="#ff0000" stroke-width="20">
      <path d="M40 60 80 20 120 60" stroke-linecap="butt"  stroke-linejoin="miter" />
      <path d="M40 140 80 100 120 140" stroke-linecap="round"  stroke-linejoin="round" />
      <path d="M40 220 80 180 120 220" stroke-linecap="square"  stroke-linejoin="bevel" />
    </g>
  </svg>
</template>
```
:::

###### stroke-dasharray

`stroke-dasharray`属性可以定义轮廓为`虚线`

**语法：** `stroke-dasharray="xxx"`

**参数：**
- xxx 为一列数字字符串，对应的是：线段 空格 线段 空格......

:::vue-demo
```vue
<template>
  <svg width="300" height="300">
    <g fill="#ffff00" stroke="#ff0000" stroke-width="5">
      <path d="M20 50 l200 0" />
      <path stroke-dasharray="5, 10" d="M20 100 l200 0" />
      <path stroke-dasharray="5, 10, 5" d="M20 150 l200 0" />
      <path stroke-dasharray="10, 5, 20" d="M20 200 l200 0" />
    </g>
  </svg>
</template>
```
:::

###### stroke-dashoffset

`stroke-dashoffset` 属性用于指定路径`开始`的`距离`。值可为`正值`、`负值`、`百分比`。

:::vue-demo
```vue
<template>
  <svg width="300" height="300">
    <g fill="#ffff00" stroke="#ff0000" stroke-width="5" stroke-dasharray="20">
      <path d="M50 50 l200 0" />
      <path d="M50 100 l200 0" stroke-dashoffset="10" />
      <path d="M50 150 l200 0"  stroke-dashoffset="1%" />
      <path d="M50 200 l200 0" stroke-dashoffset="-10" />
    </g>
  </svg>
</template>
```
:::

###### stroke-miterlimit

如果两条线交汇在一起形成一个`尖角`，而且属性 `stroke-linejoin` 指定了 `miter`，斜接有可能扩展到远远超过路径轮廓线的线宽。属性 stroke-miterlimit` 对斜接长度和stroke-width的比率强加了一个极限。当极限到达时，交汇处由斜接变成倒角。

:::vue-demo
```vue
<template>
  <svg width="200" height="400">
    <g fill="none" stroke="#ff0000" stroke-width="20">
      <path d="M40 60 80 20 120 60 120 20 150 70" stroke-linejoin="miter" stroke-miterlimit="1" />
      <path d="M40 140 80 100 120 140 120 100 150 150" stroke-linejoin="miter" stroke-miterlimit="2" />
      <path d="M40 220 80 180 120 220 120 180 150 230" stroke-linejoin="miter" stroke-miterlimit="3" />
      <path d="M40 300 80 260 120 300 120 260 150 310" stroke-linejoin="miter" stroke-miterlimit="4" />
      <path d="M40 380 80 340 120 380 120 340 150 390" stroke-linejoin="miter" stroke-miterlimit="5" />
    </g>
  </svg>
</template>
```
:::

#### 文字

##### text

通过`text`标签可以在SVG中`添加文字`，

:::vue-demo
```vue
<template>
  <svg width="300" height="80">
    <text x="50" y="50">Hello Svg !</text>
  </svg>
</template>
```
:::

###### x 和 y

`x`和`y`属性决定了文字的`绘制起点`。

但需要注意的是`x`和`y`的值可以是一个`数列`。如果设置为了一个数列则会应用到`每一个字符`上

:::vue-demo
```vue
<template>
  <svg width="300" height="300">
    <text 
      x="30 60 90 120 150 180 210 240 270" 
      y="60 90 120 150 180 150 120 90 60"
      fill="#f00" 
      stroke="#0f0" 
      font-size="50"
      font-weight="bold" >
      Hello Svg !
    </text>
  </svg>
</template>
```
:::

###### dx 和 dy

`dx`和`dy`属性与`x`和`y`属性不同的是，`x`和`y`属性是`绝对的坐标`，而`dx`和`dy`属性是相对于当前位置的`偏移量`。

参数也可以是一个`数列`。如果设置为了一个数列则会应用到`每一个字符`上

:::vue-demo
```vue
<template>
  <svg width="500" height="80">
    <text 
      dx="50 10 10 10 10 10 10 10 10" 
      dy="50 20 -20 20 -20 20 -20 20 -20" 
      fill="#f00" 
      stroke="#0f0" 
      font-size="50"
      font-weight="bold" >
      Hello Svg !
    </text>
  </svg>
</template>
```
:::

###### rotate

`rotate`属性可以把文字`旋转`一个`角度`。

同样的参数也可以是一个`数列`。如果设置为了一个数列则会应用到`每一个字符`上

:::vue-demo
```vue
<template>
  <svg width="500" height="150">
    <text 
      x="50" 
      y="50" 
      rotate="10"
      fill="#f00" 
      stroke="#0f0" 
      font-size="50"
      font-weight="bold" >
      Hello Svg !
    </text>
    <text
        dx="50 20 20 20 20 20 20 20 20 20 20"
        y="100"
        rotate="0 20 40 60 80 100 120 140 160 180 200"
        fill="#f00"
        stroke="#0f0"
        font-size="50"
        font-weight="bold" >
      Hello Svg !
    </text>
  </svg>
</template>
```
:::

###### textLength

`textLength`属性给定了一个`字符串`的`计算长度`。在文字的`长度`和`textLength`属性给定的长度`不一致`的情况下渲染引擎会精细`调整字型的位置`。

:::vue-demo
```vue
<template>
  <svg width="550" height="200">
    <text x="50" y="50" fill="#f00" stroke="#0f0" font-size="50" font-weight="bold" >
      Hello Svg !
    </text>
    <text x="50" y="110" textLength="150" fill="#f00" stroke="#0f0" font-size="50" font-weight="bold" >
      Hello Svg !
    </text>
    <text  x="50" y="170" textLength="500" fill="#f00" stroke="#0f0" font-size="50" font-weight="bold" >
      Hello Svg !
    </text>
  </svg>
</template>
```
:::

###### lengthAdjust

`lengthadjust`属性可以控制文本以`什么方式`伸展到由`_textLength_`属性定义的长度。

**参数：**
- spacing：只`拉伸`或`压缩间距`（文字`不变形`）
- spacingAndGlyphs：同时`拉伸`或`压缩间距`和`文字本身`（文字变形）

:::vue-demo
```vue
<template>
  <svg width="500" height="250">
    <text  x="50" y="50" textLength="200" lengthadjust="spacing" fill="#f00" stroke="#0f0" font-size="50" font-weight="bold" >
      Welcome to the world of svg ! 
    </text>
    <text  x="50" y="100" textLength="200" lengthadjust="spacingAndGlyphs" fill="#f00" stroke="#0f0" font-size="50" font-weight="bold" >
      Welcome to the world of svg ! 
    </text>
    <text  x="50" y="150" textLength="400" lengthadjust="spacing" fill="#f00" stroke="#0f0" font-size="50" font-weight="bold" >
      Hi svg ! 
    </text>
    <text  x="50" y="200" textLength="400" lengthadjust="spacingAndGlyphs" fill="#f00" stroke="#0f0" font-size="50" font-weight="bold" >
      Hi svg ! 
    </text>
  </svg>
</template>
```
:::

###### fill 和 stroke

`填充`和`轮廓`也都可以应用于文字

:::vue-demo
```vue
<template>
  <svg width="300" height="100">
    <text x="50" y="50" fill="#f00" stroke="#0f0" font-weight="bold">Hello Svg !</text>
  </svg>
</template>
```
:::

###### CSS文字属性

一些`CSS`中的文字样式属性同样也可以应用于SVG的文字中。

**例如**：`font-size`、`font-family`、`font-style`、`font-variant`、`font-stretch`、`font-size-adjust`、`kerning`、`letter-spacing`、`word-spacing`、`text-decoration`等。

:::vue-demo
```vue
<template>
  <svg width="400" height="100">
    <text x="50" y="50" fill="#f00" stroke="#0f0" font-weight="bold" font-size="50" font-family="arial">Hello Svg !</text>
  </svg>
</template>
```
:::

##### tspan

`tspan`标签和`text`标签一样都可以用来`添加文字`，但不同的是`tspan标`签的作用为标记`大块文本`内的`部分内容`。比如一段文本其中某个字需要`加粗`或者`颜色`不一致，就可以用到`tspan`标签。

`tspan`标签的属性和`text`标签一致，上面说到的text标签的`属性`在tspan标签中也`适用`。

需注意的是`tspan`标签`必须`是一个text`元素的`子元素`或别的`子元素tspan`的`子元素`。

:::vue-demo
```vue
<template>
  <svg width="550" height="100">
    <text x="50" y="50" fill="#f00" stroke="#0f0" font-size="50" >
      Hello <tspan fill="#f0f" font-weight="bold"> 小 </tspan> Svg !
    </text>
  </svg>
</template>
```
:::

需要注意的是`tspan`标签的`x`、`y` 和 `dx`、`dy` 会对标签后面的内容造成影响

:::vue-demo
```vue
<template>
  <svg width="550" height="150">
    <text x="50" y="50" fill="#f00" stroke="#0f0" font-size="50" >
      Hello <tspan x="150" dy="70" fill="#f0f" font-weight="bold"> 小 </tspan> Svg !
    </text>
  </svg>
</template>
```
:::

##### tref

`tref`标签配合`xlink:href`属性能`引用`已经`定义的文本`，实现`复制`的效果。并且引用之后还可以单独定义样式。

但遗憾的是`tref`标签是`SVG 1.1`规范的内容，它已经从`SVG 2.0`规范中`删除`了。

因此此处可以使用`use`标签来代替它，这里说明一下：

`defs`标签可以定义一些之后绘制中需要`重复使用`的图形元素，`defs`是`definitions`的缩写。 `use`标签可以在SVG文档内`读取目标节点`，并在别的地方`复制使用`。

:::vue-demo
```html
<template>
  <svg width="500" height="200">
    <defs>  
      <text x="50" y="50" id="tref-demo" stroke="#000" font-size="30" >今天天气不错！</text>
    </defs>
    <!-- tref 已废弃 -->
    <!-- <tref x="50" y="100" fill="#f00" xlink:href="#text" /> -->
    <use x="50" y="50" fill="#0f0" xlink:href="#tref-demo" />
    <use x="50" y="100" fill="#0f0" rotate="45" xlink:href="#tref-demo" />
  </svg>
</template>
```
:::

##### textPath

`textPath`标签可以利用它的`xlink:href`属性取得一个`任意路径`，并且可以让字符顺着路径渲染。

:::vue-demo
```vue
<template>
  <svg width="600" height="200">
    <path id="pathM" d="M 50 50 100 100 200 50 300 100" fill="none" />
    <path id="pathQ" d="M50 100 Q 175 200 300 100 T 600 100" fill="none" />
    <text>
      <textPath xlink:href="#pathM"> Welcome to the world of SVG ! </textPath>
    </text>
    <text>
      <textPath xlink:href="#pathQ"> Welcome to the world of SVG ! Welcome to the world of SVG ! </textPath>
    </text>
  </svg>
</template>
```
:::

### 渐变

渐变就是从一个颜色`过渡`到另一个颜色，且渐变都分为`两种`渐变：`线性渐变`和`径向渐变`

但需要注意的是这里我们需要接触两个新的标签：

- `defs`标签用来定义渐变
- `stop`标签用来定义渐变的颜色坡度，具有三个属性：`offset`定义渐变开始和结束的位置、`stop-color`（定义颜色）和`stop-opacity`（定义透明度）

#### 线性渐变（linearGradient）

**语法：** `<linearGradient x1="" y1="" x2="" y2="">`

**参数：**
- `x1`、`y1`定义线性渐变的`起点`
- `x2`、`y2`定义渐变的`终点`。

:::vue-demo
```vue
<template>
  <svg width="700" height="200">
    <defs>
      <linearGradient id="linearGradient" x1="0" y1="0" x2="100%" y2="0">
        <stop offset="0%" stop-color="rgb(255,255,0)"  />
        <stop offset="100%" stop-color="rgb(255,0,0)" />
      </linearGradient>
      <linearGradient id="linearGradient1" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="rgb(255,255,0)"  />
        <stop offset="100%" stop-color="rgb(255,0,0)" />
      </linearGradient>
      <linearGradient id="linearGradient2" x1="100%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="rgb(255,255,0)"  />
        <stop offset="100%" stop-color="rgb(255,0,0)" />
      </linearGradient>
    </defs>
    <ellipse cx="100" cy="70" rx="100" ry="50" fill="url(#linearGradient)" />
    <ellipse cx="350" cy="70" rx="100" ry="50" fill="url(#linearGradient1)" />
    <ellipse cx="600" cy="70" rx="100" ry="50" fill="url(#linearGradient2)" />
  </svg>
</template>
```
:::

#### 径向渐变（radialGradient）

**语法：** `<radialGradient cx="" cy="" r="" fx="" fy="">`

**参数：**
- `cx`、`cy`、`r`分别为圆的`坐标`和`半径`，也就是渐变的`范围`
- `fx`、`fy`定义渐变的`中心点`，也叫渐变的焦点

:::vue-demo
```vue
<template>
  <svg width="700" height="200">
    <defs>
      <radialGradient id="radialGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
        <stop offset="0%" stop-color="rgb(255, 255, 0)" />
        <stop offset="100%" stop-color="rgb(255, 0, 0)" />
      </radialGradient>
      <radialGradient id="radialGradient1" cx="50%" cy="50%" r="50%" fx="50%" fy="0%">
        <stop offset="0%" stop-color="rgb(255, 255, 0)" />
        <stop offset="100%" stop-color="rgb(255, 0, 0)" />
      </radialGradient>
      <radialGradient id="radialGradient2" cx="50%" cy="50%" r="50%" fx="0%" fy="50%">
        <stop offset="0%" stop-color="rgb(255, 255, 0)" />
        <stop offset="100%" stop-color="rgb(255, 0, 0)" />
      </radialGradient>
    </defs>
    <ellipse cx="100" cy="100" rx="100" ry="50" fill="url(#radialGradient)" />
    <ellipse cx="350" cy="100" rx="100" ry="50" fill="url(#radialGradient1)" />
    <ellipse cx="600" cy="100" rx="100" ry="50" fill="url(#radialGradient2)" />
  </svg>
</template>
```
:::

#### 文字的渐变

:::vue-demo
```vue
<template>
  <svg width="600" height="250">
    <defs>
      <linearGradient id="linearGradient3" x1="0" y1="0" x2="100%" y2="0">
        <stop offset="0%" stop-color="rgb(255,255,0)"  />
        <stop offset="100%" stop-color="rgb(255,0,0)" />
      </linearGradient>
      <radialGradient id="radialGradient3" cx="50%" cy="50%" r="50%" fx="50%" fy="100%">
        <stop offset="0%" stop-color="rgb(255, 255, 0)" />
        <stop offset="100%" stop-color="rgb(255, 0, 0)" />
      </radialGradient>
    </defs>
    <text fill="url(#linearGradient3)" font-size="100" font-family="Verdana" x="50" y="100">SVG</text>
    <text stroke="url(#linearGradient3)" stroke-width="5" fill="none" font-size="100" font-family="Verdana" x="50" y="200">SVG</text>
    <text fill="url(#radialGradient3)" font-size="100" font-family="Verdana" x="300" y="100">SVG</text>
    <text stroke="url(#radialGradient3)" stroke-width="5" fill="none" font-size="100" font-family="Verdana" x="300" y="200">SVG</text>
  </svg>
</template>
```
:::

### 裁剪和蒙层

#### 裁剪

使用`clipPath`标签定义一条裁剪路径，用来裁`剪掉元素的部分内容`。且任何`透明度`的效果都是`无效的`，它只能要么裁剪掉要么不裁剪。

:::vue-demo
```vue
<template>
  <svg width="300" height="200">
    <defs>
      <clipPath id="clipPath">
        <path d="M10 50 A50 50 0 0 1 100 50 A50 50 0 0 1 190 50 Q210 100 100 200  Q-5 100 10 50 Z" />
      </clipPath>
    </defs>
    <rect x="0" y="0" width="200" height="200" fill="#fa0" clip-path="url(#clipPath)"  />
  </svg>
</template>
```
:::

#### 蒙层

蒙层的功能主要实现标签就是`mask`标签，他的功能和名字正好相反，他`不是`用来`遮住元素`的部分内容，而是用来`显示元素`中`mask`标签`遮住的内容`。他和`clipPath`标签`不同`的是允许使用`透明度`（`透明度为0则无蒙层效果`）和`灰度值遮罩`计算得的`软边缘`。

:::vue-demo
```vue
<template>
   <svg width="300" height="200">
     <defs>
       <mask id="Mask">
         <path d="M10 50 A50 50 0 0 1 100 50 A50 50 0 0 1 190 50 Q210 100 100 200  Q-5 100 10 50 Z" fill="#fff" fill-opacity="0.5" />
       </mask>
     </defs>
     <rect x="0" y="0" width="200" height="200" fill="#f00" mask="url(#Mask)" />
   </svg>
</template>
```
:::

### 动画

#### 基础动画

##### translate（平移）

**语法：** `transform="translate(x, y)"`
**参数：**
- x为`X轴`上的平移距离
- y为`Y轴`上的平移距离

:::vue-demo
```vue
<template>
  <svg width="500" height="150">
    <rect x="0" y="0" width="100" height="50" fill="#ff770f"/>
    <rect x="0" y="0"  width="100" height="50" fill="#ff770f" transform="translate(100, 50)"/>
    <rect x="0" y="0"  width="100" height="50" fill="#ff770f" transform="translate(200, 100)"/>
  </svg>
</template>
```
:::

##### scale（缩放）

**语法：**  `transform="scale(x, y)"`
**参数：** 
- x为`X轴`上的缩放大小
- y为`Y轴`上的缩放大小

:::vue-demo
```vue
<template>
  <svg width="500" height="300">
    <rect x="0" y="0" width="100" height="100" fill="#ff770f"/>
    <rect x="0" y="200"  width="100" height="100" fill="#7e9178" transform="scale(0.5)"/>
    <rect x="0" y="100"  width="100" height="100" fill="#183c78"  transform="scale(1.5)"/>
    <rect x="200" y="100"  width="100" height="100" fill="#cccccc"  transform="scale(1, 0.5)"/>
  </svg>
</template>
```
:::

##### rotate（旋转）

**语法：** `transform="rotate(deg)"`

**参数：** `deg`为旋转的角度。

:::vue-demo
```vue
<template>
  <svg width="500" height="320">
    <rect x="200" y="0" width="100" height="100" fill="#ff770f"/>
    <rect x="200" y="0" width="100" height="100" fill="#cccccc" transform="rotate(20)"/>
    <rect x="200" y="0" width="100" height="100" fill="#7e9178" transform="rotate(40)"/>
    <rect x="200" y="0" width="100" height="100" fill="#183c78"  transform="rotate(60)"/>
  </svg>
</template>
```
:::

##### transform-origin（旋转中心点）

:::info Tips
元素的`旋转中心点`是`(0, 0)`。如果想要`只是旋转而不位移`，那么就需要把旋转的中心点设置在`元素`的`中心点`。

以上面的例子为例，
元素的x坐标为`200`，本身宽度为`100`，则`x轴元素`的中心点就为`250`。
元素的y坐标为`0`，高度为`100`，则`y轴元素`的中心点为`50`。
因此元素的中心点就为`(250, 50)`。
但是原地旋转导致部分遮挡，所以稍微调整`初始y坐标`及`中心点y坐标`。
:::

:::vue-demo
```vue
<template>
  <svg width="500" height="160">
    <rect x="200" y="30" width="100" height="100" fill="#ff770f"/>
    <rect x="200" y="30" width="100" height="100" fill="#cccccc" transform-origin="250 65" transform="rotate(20)"/>
    <rect x="200" y="30" width="100" height="100" fill="#7e9178" transform-origin="250 65" transform="rotate(40)"/>
    <rect x="200" y="30" width="100" height="100" fill="#183c78" transform-origin="250 65" transform="rotate(60)"/>
  </svg>
</template>
```
:::

##### skew（倾斜）

**语法：** `transform="skewX(x) skewY(y)"`

**参数：** x为X轴上的`倾斜度`，y为Y轴上的`倾斜度`。

在SVG中`skew`属性需要分开设置，x轴设置为`skewX`，y轴设置为`skewY`，不能合并起来用，写成 `skew(x, y)` 是**不生效**的。

:::vue-demo
```vue
<template>
  <svg width="700" height="200">
    <rect x="0" y="0" width="100" height="100" fill="#ff770f"/>
    <rect x="150" y="0" width="100" height="100" fill="#cccccc" transform="skewX(10)"/>
    <rect x="300" y="0" width="100" height="100" fill="#7e9178" transform="skewY(10)"/>
    <rect x="450" y="0" width="100" height="100" fill="#183c78" transform="skewX(10) skewY(10)"/>
  </svg>
</template>
```
:::

#### JS动画

在文章最开始的时候就说过：SVG `不能` `动态` 的 `修改` 动画 `内容`。

所以CSS3的过渡属性就不好使了，那么想实现动画就只能使用js的定时器（setInterval）来实现。

:::vue-demo
```vue
<template>
  <svg width="500" height="500">
    <rect id="transform-svg" x="0" y="0" width="100" height="100" fill="#ff770f"/>
  </svg>
</template>
<script>
  export default {
    mounted() {
      const svgEl = document.getElementById('transform-svg')
      let x = 0, y = 0, add = true
      setInterval(() => {
        if(x < 400) {
          x += 1
        } else {
          x = 0
        }
        if(y < 400) {
          y += 1
        } else {
          y = 0
        }
        svgEl.setAttribute('transform', `translate(${x}, ${y})`)
      }, 10)
    }
  }
</script>
```
:::

那么SVG最拿得出手的`线条动画`又如何用js来实现呢？

比如需要变换图形：

:::vue-demo
```vue
<template>
  <svg width="500" height="200" fill="orange">
    <path id="svgPath" />
  </svg>
</template>
<script>
export default {
  mounted() {
    const svgPath = document.getElementById('svgPath')
    let x = 250, x1 = 250, y = 100
    setInterval(() => {
      if(x < 350) {
        x += 0.1
      } else {
        x1 = 300
        if(y < 200 ) y += 0.1
      }
      svgPath.setAttribute('d', `M 250 100 300 0 ${x} 100 ${x1} ${y} z`)
    }, 0)
  }
}
</script>
```
:::

#### CSS动画

这里需要用上三个属性：分别是 `stroke`、`stroke-dasharray`、`stroke-dashoffset`。

:::vue-demo
```vue
<template>
  <svg id="css-demo-svg" width="500" height="50" xmlns="http://www.w3.org/2000/svg" version="1.1">
    <line id="css-svg-demo-line" x1="0" x2="500" y1="0" y2="0" stroke="orange" stroke-width="10" />
  </svg>
</template>
<style>
  #css-demo-svg {
    display: block;
    margin: 50px auto;
  }
  #css-demo-svg-line {
    stroke-dasharray: 500;
    stroke-dashoffset: 500;
    animation: animation 2s linear infinite;
  }
  @keyframes animation {
    to {
      stroke-dashoffset: 0;
    }
  }
</style>
```
:::

按照这个逻辑搞一个按钮的线条动画吧。

:::vue-demo
```vue
<template>
  <div id="css-demo-svg-body">
    <div id="css-demo-svg-div">
      <svg height="60" width="320" xmlns="http://www.w3.org/2000/svg">
        <text x="80" y="40" class="text"  font-size="30" fill="#fff">Hello SVG</text>
        <rect id="css-demo-svg-rect" height="60" width="320" stroke="#fff" />
      </svg>
    </div>
  </div>
</template>
<style>
  #css-demo-svg-body {
    background: #000000;
    /*margin-top: 100px;*/
    height: 100px;
  }
  #css-demo-svg-div {
    height: 50px;
    margin: 0 auto;
    position: relative;
    top: 50%;
    transform: translateY(-50%);
    width: 320px;
  }

  #css-demo-svg-rect {
    fill: transparent;
    stroke-dasharray: 200 540;
    stroke-dashoffset: -445;
    stroke-width: 8px;
  }
  @keyframes draw {
    0% {
      stroke-dasharray: 200 540;
      stroke-dashoffset: -445;
      stroke-width: 8px;
    }
    100% {
      stroke-dasharray: 760;
      stroke-dashoffset: 0;
      stroke-width: 2px;
    }
  }

  #css-demo-svg-div:hover #css-demo-svg-rect {
    -webkit-animation: 0.5s draw linear forwards;
    animation: 0.5s draw linear forwards;
  }
</style>
```
:::

把`填充`和`轮廓`弄一些填充，效果就更好看了

:::vue-demo
```vue
<template>
  <div id="css-demo-svg-body2">
    <div id="css-demo-svg-div2">
      <svg height="60" width="320" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="linearGradient" x1="0" y1="0" x2="100%" y2="0">
            <stop offset="0%" stop-color="rgb(255,255,0)"  />
            <stop offset="100%" stop-color="rgb(255,0,0)" />
          </linearGradient>
        </defs>
        <text x="80" y="40" class="text"  font-size="30" fill="url(#linearGradient)">Hello SVG</text>
        <rect id="css-demo-svg-rect2" height="60" width="320" stroke="url(#linearGradient)" />
      </svg>
    </div>
  </div>
</template>
<style>
#css-demo-svg-body2 {
  background: #000000;
  height: 100px;
}

#css-demo-svg-div2 {
  height: 60px;
  margin: 0 auto;
  position: relative;
  top: 50%;
  transform: translateY(-50%);
  width: 320px;
}

#css-demo-svg-rect2 {
  fill: transparent;
  stroke-dasharray: 200 540;
  stroke-dashoffset: -445;
  stroke-width: 8px;
}
@keyframes draw2 {
  0% {
    stroke-dasharray: 200 540;
    stroke-dashoffset: -445;
    stroke-width: 8px;
  }
  100% {
    stroke-dasharray: 760;
    stroke-dashoffset: 0;
    stroke-width: 2px;
  }
}

#css-demo-svg-div2:hover #css-demo-svg-rect2 {
  -webkit-animation: 0.5s draw2 linear forwards;
  animation: 0.5s draw2 linear forwards;
}
</style>
```
:::

:::info Tips
到此就看完了SVG分别用`js`和`css`来实现`动画`的方法。

那是不是觉得都比较`繁琐`呢？首先想绘制一个复杂的SVG就很复杂，其次用`js`去`变化坐标`也很复杂，用`css`去做`动画`简单点，但实现的动画也相对简单。

那么有没有什么`捷径`可以走呢？那回答肯定是：必须有啊！**`GreenSock`** 这里就不多介绍了
:::




