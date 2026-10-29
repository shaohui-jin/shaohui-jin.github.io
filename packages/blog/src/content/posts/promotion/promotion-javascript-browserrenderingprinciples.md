---
title: 浏览器渲染原理
lang: zh-CN
date: 2024-03-27 16:04:31
permalink: /Promotion/JavaScript/BrowserRenderingPrinciples/
category: 
  - JavaScript
tag: 
  - JavaScript
---

当浏览器的 「**网络线程**」 收到 「**HTML 文档**」后，会产生一个 **渲染任务**，并将其传递 「**渲染主线程**」 的消息队列。

在事件循环机制的作用下，渲染主线程取出消息队列中的渲染任务，开启渲染流程。

![](https://shaohui-jin.github.io/picx-images-hosting/blog/EventLoop/渲染时间点.1hrzbay7up.webp "渲染时间点" =800x)

## 渲染流水线

<!-- #region info -->

整个渲染流程分为多个阶段，分别是： `HTML 解析`、`样式计算`、`布局`、`分层`、`绘制`、`分块`、`光栅化`、`画`

每个阶段都有明确的输入输出，「**上一个阶段的输出**」 会成为 「**下一个阶段的输入**」。

这样，整个渲染流程就形成了一套组织严密的生产流水线。

![](https://shaohui-jin.github.io/picx-images-hosting/blog/EventLoop/渲染流水线.41xtnyj74g.webp "渲染流水线" =800x)

<!-- #endregion info -->

### 「**解析 HTML**」 Parse HTML

解析过程中遇到 CSS 解析 CSS，遇到 JS 执行 JS。

为了提高解析效率，浏览器在开始解析前，会启动一个 **预解析** 的线程，率先下载 HTML 中的 **外部CSS** 文件和 **外部的 JS 文件**。

如果主线程解析到 **link** 位置，此时外部的 CSS 文件还没有下载解析好，主线程不会等待，继续解析后续的HTML。

这是因为 **下载** 和 **解析 CSS** 的工作是在 **预解析线程** 中进行的。这就是CSS不会阻塞 HTML 解析的根本原因。

![](https://shaohui-jin.github.io/picx-images-hosting/blog/EventLoop/预解析CSS.969ifq9lxi.webp "预解析CSS" =800x)

如果主线程解析到 **script** 位置，会停止解析 HTML，转而等待 JS 文件下载好，并将全局代码解析执行完成后，才能继续解析 HTML。

这是因为 JS 代码的执行过程可能会修改当前的 DOM 树，所以 DOM 树的生成**必须暂停**。这就是 JS 会阻塞 HTML 解析的根本原因。

![](https://shaohui-jin.github.io/picx-images-hosting/blog/EventLoop/预解析JS.5fkcuhgqjb.webp "预解析JS" =800x)


![](https://shaohui-jin.github.io/picx-images-hosting/blog/EventLoop/Document-Object-Model.7zq74q3yr3.webp "Document-Object-Model" =800x)

![](https://shaohui-jin.github.io/picx-images-hosting/blog/EventLoop/CSS-Object-Model.2a4ut48dpd.webp "CSS-Object-Model" =800x)

### 「**样式计算**」 Recalculate Style

主线程会遍历得到的 DOM 树， 依次为树中的每个节点计算出它最终的样式，称之为 「**Computed Style**」。

在这一过程中，很多 **预设值**会变成 **绝对值**，比如 `red` 会变成 `rgb(255,0,0)`；**相对单位** 会变成 **绝对单位**，比如 `em` 会变成 `px`

![](https://shaohui-jin.github.io/picx-images-hosting/blog/EventLoop/样式计算.3nrdzlzvb8.webp "样式计算" =800x)


### 「**布局**」 Layout

布局阶段会依次遍历 DOM 树的每一个节点，计算每个节点的「**几何信息**」。 例如节点的 **宽高**、**相对包含块**的位置。

大部分时候，DOM 树和布局树 「**并非一一对应**」。

比如 `display:none` 的节点 **没有几何信息**，因此不会生成到布局树；又比如使用了 **伪元素选择器**，虽然 DOM树 中不存在这些伪元素节点，但它们拥有几何信息，所以会生成到布局树中。

还有 **匿名行盒**、**匿名块盒** 等等都会导致 DOM 树和布局树无法一一对应。

![](https://shaohui-jin.github.io/picx-images-hosting/blog/EventLoop/布局(DOM转Layout).6pna10bp9v.webp "布局(DOM转Layout)" =800x)

### 「**分层**」 Layer

主线程会使用一套复杂的策略对整个 **布局树** 中进行分层。

分层的好处在于，将来某一个层改变后，仅会对该层进行后续处理，从而提升效率。

**滚动条**、**堆叠上下文**、**transform**、**opacity** 等样式都会或多或少的影响分层结果，也可以通过 **will-change** 属性更大程度的影响分层结果。

> 观察方式： 谷歌浏览器 F12 打开控制台，右上角的 **三个点** 中的更多工具中有 Layers



### 「**绘制**」 Paint

**主线程** 会为 **每个层** 单独产生 「**绘制指令集**」，用于描述这一层的内容该如何画出来。

渲染主线程的工作到此为止，剩余步骤交给其他线程完成。

![](https://shaohui-jin.github.io/picx-images-hosting/blog/EventLoop/渲染主线程任务.3k7s23yr7b.webp "渲染主线程任务" =800x)

### 「**分块**」 Tiling

主线程将 **每个图层的绘制信息** 提交给 **合成线程**，剩余工作将由合成线程完成。

**合成线程** 首先对 **每个图层** 进行 **分块**，将其划分为更多的小区域。

它会从线程池中拿取多个线程来完成分块工作。

![](https://shaohui-jin.github.io/picx-images-hosting/blog/EventLoop/分块.8hg8w018nx.webp "分块" =800x)

### 「**光栅化**」 Raster

合成线程会将块信息交给 **GPU** 进程，以极高的速度完成光栅化。

**GPU 进程** 会开启 **多个线程** 来完成光栅化，并且优先处理靠近视口区域的块。

光栅化的结果，就是一块一块的位图。

![](https://shaohui-jin.github.io/picx-images-hosting/blog/EventLoop/光栅化.6m3o3ezhbp.webp "光栅化" =800x)

### 「**画**」 Draw

**合成线程** 拿到 每个层、每个块的位图 后，生成一个个 「**指引(quad)**」 信息。指引会标识出每个位图应该画到屏幕的哪个位置，以及会考虑到旋转、缩放等变形。

**变形发生** 在 **合成线程**，与 **渲染主线程** 无关，这就是 **transform** 效率高的本质原因。

合成线程会把 「**quad**」 提交给 「**GPU 进程**」，由 GPU 进程产生系统调用，提交给 GPU 硬件，完成最终的屏幕成像。

![](https://shaohui-jin.github.io/picx-images-hosting/blog/EventLoop/画.4uap8jprpt.webp "画" =800x)

## 知识延伸

### 为何 Script、meta等元素都是不显示的

在浏览器的默认样式中，默认了样式 `display: none`

### CSS 属性值的计算过程

- 叠层
- 继承

视觉格式化模型
- 盒模型
- 包含块


### 什么是 reflow(重排)

reflow 的本质就是 重新计算 **layout 树**。

当进行了会影响 **布局树** 的操作后，需要重新计算布局树，会引发 **layout**。

为了避免连续的多次操作导致布局树反复计算，浏览器会合并这些操作，当 JS 代码 **全部完成后** 再进行统一计算。 所以，改动属性造成的 **reflow** 是 **异步**完成的。

也同样因为如此，当 JS 获取布局属性时，**`就可能造成无法获取到最新的布局信息`**。

浏览器在反复权衡下，最终决定 **`获取属性立即 reflow`**。

###  什么是 repaint(重绘)

repaint 的本质就是重新根据 **分层信息** 计算了 **绘制指令**。

当改动了可见样式后，就需要重新计算，会引发repaint。

由于元素的 **布局信息** 也属于可见样式，所以 **`reflow 一定会引起 repaint`**。

### 为什么 transform 的效率高

因为 **transform** 既不会影响 **布局** 也不会影响 **绘制指令**，

它影响的只是 **渲染流程** 的 最后一个「**draw**」阶段， 由于 draw 阶段在 **合成线程** 中，所以 **transform** 的变化几乎不会影响 **渲染主线程**。

反之，渲染主线程无论如何忙碌，也不会影响 **transform** 的变化。
