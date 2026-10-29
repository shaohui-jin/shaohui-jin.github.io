---
title: 面试题汇总
lang: zh-CN
date: 2024-05-05 16:59:31
permalink: /InterviewQuestion/
headerDepth: 3
---

## CSS


### rem、px、em 字体大小

> **px**是相对于显示器屏幕分辨率的存在，是一个 **绝对单位**，不随页面缩放而变化。计算方式为：`1px = 1/96英寸`。
> 
> **em**是相对于 **元素自身** 的字体大小的存在，如果元素没有设置字体大小，则相对于父元素的字体大小。
> 
> **rem**是相对于 **根元素（即html元素）** 的字体大小的存在，它不受 **元素字体大小** 和 **父元素字体大小** 的影响，只受根元素字体大小的影响。

###  CSS 选择器特性: 继承性、 层叠性、优先级

> **继承性**
> - **字体系列** 属性
> - **文本相关** 属性
> - **元素可见性** 属性
> - **列表相关** 属性
> - **表格相关** 属性
> - **其他** 属性，如：cursor **（光标样式）**、direction **（文本方向）**、unicode-bidi **（双向文本处理）**、outline **（轮廓线）**、quotes **（引用样式）**、pointer-events **（指针事件）**。
>
> 优先级
> 写 CSS 样式的时候，会给同一个元素添加多个样式，此时谁的权重高就显示谁的样式
> 其中 **!important** > **行内样式** > **id** > **类/伪类/属性** > **标签** > **全局选择器** > **浏览器默认样式**

### transform、 translate、transition

> **Transform 变形**， rotate旋转、skew扭曲、scale缩放、translate移动、matrix 2D转换方法
>
> **Translate 平移**
>
> **Transition 过渡**， property运动 duration持续时间 timing-function delay延迟

### BFC的布局规则

> 1. 内部的 box 会在垂直方向上，一个接一个的放置
> 2. box 垂直方向 的距离由 margin 决定，属于同一个BFC的两个相邻 box 的 margin 会发生重叠
> 3. BFC 的区域不会与浮动元素区域重叠
> 4. BFC 就是页面上一个独立容器，容器内的子元素不会影响到外面的元素
> 5. 计算 BFC 的高度时，浮动元素也参与计算


## JS


### 数据类型

> 基本数据类型： number，bigInt， boolean， null，undefined，string，symbol，
> 基本数据类型保存在栈内存中，保存的就是一个具体的值
>
> 引用数据类型：object (后面不算)     date，RegExp，function，array，
> 保存在堆内存当中，声明一个引用类型的变量，他保存的就是引用数据类型的地址
> 
> 假如声明两个引用类型同时指向一个地址的时候，修改其中一个那么另一个也发生改变

### 类型转换优先级

> **[Symbol.toPrimitive] -> valueOf -> toString**

```js
let a = {}
console.log(a + 2) // [object Object]2

a.toString = () => {
  return 'toString'
}
console.log(a + 2) // toString2

a.valueOf = () => {
  return 'valueOf'
}
console.log(a + 2) // valueOf2

a[Symbol.toPrimitive] = () => {
  return '[Symbol.toPrimitive]'
}
console.log(a + 2) // [Symbol.toPrimitive]2
```

### 闭包


    
`描述`： 函数嵌套函数，内部函数被外部函数返回并保存下来，就会产生闭包

`特点`： 可以重复利用变量，并且这个变量不会污染全局；这个变量一直保存在内存中，不会被垃圾回收机制回收

`缺点`： 闭包较多的时候，会消耗内存，导致页面性能下降，在IE浏览器中会导致内存泄露

`使用`： 防抖，节流，函数嵌套函数避免全局污染

> **高级描述：**
> 1. `函数` + `其定义时所处的词法环境`
> 2. `函数本身` + `内部属性[Environment]`
>    
> **内存泄漏条件：**
> 1. **持有了不再需要的函数引用，会导致函数关联的 `词法环境` 无法销毁，从而导致内存泄露**
> 2. **当多个函数 `共享词法环境` 时，会导致词法环境膨胀，从而导致出现 `无法触达` 也 `无法回收` 的内存空间，导致内存泄漏**


### 作用域

`描述`：作用域是指在运行时，代码中的某些特定部分中变量、函数和对象的可访问性

作用域是分层的，内层作用域可以访问外层作用域的变量，反之则不行。

ES6 之前 JavaScript 没有块级作用域，只有全局作用域和函数作用域。

ES6 提出了 **块级作用域** 所声明的变量在指定块的作用域外无法被访问。

> **高级描述：** 执行上下文中的词法环境

### 作用域链

由词法环境中的 **outerEnv指针** 形成的链条

当前作用域没有定义的变量，这成为 自由变量 。自由变量的值如何得到 —— 向父级作用域寻找。

如果父级也没呢？再一层一层向上寻找，直到找到全局作用域还是没找到，就宣布放弃。

这种一层一层的关系，就是 作用域链 。

> **高级描述：** 词法环境形成的链条

### Typeof、instanceof、constructor、Object.prototype.toString.call

```js 
// Typeof
typeof 1;
// 'number' 只能检测基本数据类型

// Instanceof
[] instanceof Array;
// true 只能检测引用数据类型

// Constructor
('123').constructor === String; 
// true 基本能够检测基本类型和引用类型，但是如果声明构造函数，并把它的原型换指向Array，就不对了

// Object.prototype.toString.call  
Object.prototype.toString.call(2)
// '[object Number]' 能够完全检测基本类型和引用类型
```

### 事件委托

> 事件委托又叫事件代理，原理是利用事件冒泡的机制来实现，也就是说把子元素的事件绑定到了父元素的身上，
> 
> 如果子元素阻止了事件冒泡(Event.stopPropagation)，那么委托也就不成立
> 
``` js 
addEventListener('click', () => {}, true || false )  // True 事件捕获， false 事件冒泡
```

### this 指向

> 全局对象中的 this 指向 window

```js
console.dir(this) // Window
```

> 全局作用域 或 普通函数的 this 指向 window

```js
function fn() {
  console.dir(this) // Window
}
fn()
```

> this 指向为最后调用方法的对象

```js
String.prototype.fn = function() {
  console.log(this)
}
'123'.fn() // String {'123'}
```

> New 关键字改变了 this 指向 (二义性导致的)

```js
function aa() {
  console.dir(this)
}
aa(); // Window
const a = new aa(); // aa
```

> apply，call，bind 改变 this 的指向（非箭头函数）

```js
function a() {
  console.log(this)
}
a(); // Window
a.apply("123") // String {'123'}
a.call(123) // Number {123}
a.bind(1234)() // Number {1234}
```

> 箭头函数中的this，它在定义的时候就已经确定好了，如果外层有函数，则是外层函数的this，没有的话就是window

```js
const fn = function () {
  console.log(this)
  const fn = function () {
    console.log('内部非箭头函数', this)
  }
  fn()
  const fn1 = () => {
    console.log('内部箭头函数', this)
  }
  fn1()
}
fn()
// Window
// 内部非箭头函数 Window
// 内部箭头函数 Window

fn.bind(123)()
// 123
// 内部非箭头函数 Window
// 内部箭头函数 123
```

> 匿名函数中的this永远指向window，匿名函数的执行环境具有全局性，因此指向window

### call、apply、bind 的区别

> 都会改变this的指向，call、apply功能类似，只是传参方式不同
> - call 方法是传的一个`参数列表`
> - apply 方法传递的是`一个数组`
> - bind 传参后不会立刻执行，会`返回一个改变了this指向的函数`，这个函数是可以传参的

### new 操作符做了什么

```js
function newFun(fn, ...args) {
  // 1.先创建一个空对象
  let newObj = {}
  // 2.把空对象和构造函数通过原型链进行链接
  newObj.__proto__ = fn.prototype
  // 3.把构造函数的this绑定到新的空对象上
  const result = fn.apply(newObj, args)
  // 4.根据构造函数返回的类型进行判断，如果是引用数据类型，则返回这个引用类型，如果是值类型，则返回对象
  return result instanceof Object ? result : newObj
}
```

### 深克隆

1. 解构 `{...xxx}` 只能实现第一层，当有多层的时候还是浅拷贝
2. `JSON.parse(JSON.stringify(xxx))`,该方法不会拷贝`内部函数`，同时如果循环引用就会报错
3. 利用`递归`实现函数
4. `structuredClone`
5. `MessageChannel` 广播实现`异步`克隆

### 文档碎片

> **Document.createDocumentFragment()** 创建一个新的空白的文档片段，利用不是主Dom节点特性，将元素附加到文档片段，然后将文档片段附加到 DOM 树，从而减少回流次数。

```javascript
const list = document.getElementById('list')

// 文档碎片
const fragment = document.createDocumentFragment()

for (let i = 0; i < 5; i++) {
    const item = document.createElement('li')
    item.innerHTML = `项目${i}`
    // list.appendChild(item) // 操作5次dom
    fragment.appendChild(item)
}

list.appendChild(fragment) // 操作1次dom
```

### [浏览器渲染原理](/my-blog/Promotion/JavaScript/BrowserRenderingPrinciples/)


整个渲染流程分为多个阶段，分别是： `HTML 解析`、`样式计算`、`布局`、`分层`、`绘制`、`分块`、`光栅化`、`画`

每个阶段都有明确的输入输出，「**上一个阶段的输出**」 会成为 「**下一个阶段的输入**」。

这样，整个渲染流程就形成了一套组织严密的生产流水线。

![](https://shaohui-jin.github.io/picx-images-hosting/blog/EventLoop/渲染流水线.41xtnyj74g.webp "渲染流水线" =800x)


### Object.definedProperty 属性

> - **obj**：要定义属性的对象。
> - **prop**：要定义的属性名。
> - **descriptor**：指定属性的特性。
>   - **value**：属性的值。默认是 undefined。
>   - **writable**：布尔值，表示属性`是否可以被修改`。默认是 false。
>   - **enumerable**：布尔值，表示属性是否会出现在 `for...in` 循环中以及 `Object.keys` 方法中。默认是 false。
>   - **configurable**：布尔值，表示属性`是否可以被删除或修改其特性`。默认是 false。
>   - **get**：一个函数，表示当`访问属性值`时要执行的函数。默认是 undefined。
>   - **set**：一个函数，表示当`设置属性值`时要执行的函数。默认是 undefined。

### Object 静态方法 freeze()，seal(), preventExtension()的区别

> **Object.freeze()**: **`冻结`** 一个对象。对象不能被修改，**不能进行`增删改`**，**不能修改该对象已有属性的`可枚举性`、`可配置性`、`可写性`**。
> 
> **Object.seal()**: **`封闭`**一个对象。**阻止`添加新属性`** 并将**所有现有属性标记为`不可配置`**。当前属性的值只要原来是可写的就可以改变。
> 
> **Object.preventExtensions()**: **阻止`添加新属性`** 同时**防止对象的`原型被重新指定`**。

### [事件循环](/my-blog/Promotion/JavaScript/BrowserProcessModel/)


事件循环又叫做消息循环，是浏览器 **渲染主线程** 的工作方式。

在 Chrome 的源码中，它开启一个不会结束的 for 循环，每次循环从消息队列中取出 **第一个任务**执行，而其他线程只需要在合适的时候将任务加入到 **队列末尾** 即可。

过去把消息队列简单分为 **宏队列** 和 **微队列**，这种说法目前已无法满足复杂的浏览器环境，取而代之的是一种更加灵活多变的处理方式。

根据 W3C 官方的解释，每个任务有不同的类型，**同类型的任务必须在同一个队列**，**不同的任务可以属于不同的队列**。

不同任务队列有 **不同的优先级**，在一次事件循环中，由浏览器自行决定取哪一个队列的任务。

但浏览器 **必须** 有一个**微队列**，微队列的任务一定具有 **最高的优先级**，必须优先调度执行。


### setTimeout最小执行时间

> HTML规定最小时间为4ms

### setInterval最小执行时间

> HTML规定最小时间为10ms


## ES


### ES6新特性
1. 块级作用域（let const）
> 不存在变量提升、存在暂时性死区、块级作用域、不能在同一个作用域重复声明
2. 新增语法糖 class
3. 基本数据类型 symbol
4. 新增解构赋值
5. 新增箭头函数
不能作为构造函数使用，不能使用new、箭头函数没有原型、箭头函数没有arguments、箭头函数不能使用call、bind、apply改变this的指向、this指向 外层第一个函数的this
6. 新增了函数参数的默认值
7. 数组新增了api
8. 对象数组新增了拓展运算符
console.log(1, ...[2, 3, 4], 5)
9. Promise
10. 模块化 import export
11. 新增set(不重复) map(key类型不受限制)数据结构
12. 新增generator
```js
function* xxfn(){
  yield 'a';
  yield 'b';
  yield 'c';
  return 'd end...'
}
var _xxfn = xxfn()

//第一个yield语句
console.log(_xxfn.next())//{value: 'a', done: false}
```

### 继承

1. 原型链的继承

让一个构造函数的原型是另一个类型的实例，那么这个构造函数new出来的实例就具有该实例的属性

`优点`：写法方便简洁，容易理解

`缺点`： 对象实例共享所有继承的属性和方法，无法向父类构造函数传值

2. 借用构造函数继承

在子类型构造函数的内部调用父类型的构造函数，使用 apply或call将父对象的构造函数绑定在子对象上

`优点`： 解决了原型链实现继承的不能传参的问题以及父类的原型共享问题

`缺点`：借用构造函数的缺点是方法都在构造函数中定义，因此无法实现函数复用。在父类型的原型中定义的方法，对子类型而言是不可见的

3. 组合继承

使用原型链实现对原型属性和方法的继承
通过借用构造函数进来实现对实例属性的继承
既通过在原型上定义方法，实现了函数复用，又能保证每个实例都有自己的属性

### Es6 的 class

Class通过extends关键字来实现继承，其本质是
1. 先创造出父类的this对象
2. 然后用子类的构造函数修改this
3. 子类的构造函数中必须调用super方法，且只有在调用了super之后才能使用this，因为子类的this对象是继承父类的this对象，然后对其进行加工，而super方法表示的是父类的构造函数，用来新建父类的this对象

### ES6 的 Promise

1. 解决了回调地狱的问题
2. 自身有all、reject、resolve、race方法
3. 原型上有then、catch方法
4. 把异步队列化
5. 三种状态：pending 初始状态、rejected 操作失败、fulfilled 操作成功


## 网络


### ajax


- 「**AJAX 全称 Asynchronous Javascript And XML**」：异步JavaScript和xml，是一种技术的统称
  - 「**XHR 全称 XmlHttpRequest**」：HTML源生实现Ajax的一种技术
  - 「**Fetch**」：基于 Promise 的一种api，在es6时提出，用于代替 XHR 实现 AJAX 的一种技术
- 「**axios**」 是一种 使用 Promise + xhr 封装的第三方库
- 「**umi-request**」： 基于 fetch 封装的第三方库

> **上传下载进度：**
> 1. xhr `支持上传、下载进度展示`
> 2. fetch 不支持上传进度，`支持下载进度展示`
> 
> **Abort 取消机制：**
> 1. xhr `支持终止请求`
> 2. fetch `本身不支持`，可使用 `信号控制器 AbortController` 实现
>
> **Timeout 超时机制:** 
> 1. xhr `支持超时机制`
> 2. fetch **本身不支持**，可使用 `信号控制器 AbortController` 以及 `Promise` 实现


### 地址栏输入url按下回车会发生什么事

> 1. **url检测**：`检查`/`纠错`
> 2. **Dns解析**
> 3. **TCP三次握手**(SSL握手)
> 4. 准备请求(请求头： cookies + ...)
> 5. **发送请求**(GET)
> 6. 服务器处理请求
> 7. **服务器响应**
> 8. 浏览器收到响应头
> 9. 处理响应头(`set-cookie`、`content-type`、`缓存`、`状态码`、`connection: keep-alive`)
> 10. 收响应体
> 11. **渲染**
>     - 解析(预处理线程，资源加载、资源描述符 async defer preload prefetch) 生成DOM树和CSSOM树
>     - 样式计算
>     - Layout布局
>     - layer 分层
>     - paint 绘制(主线程结束、合成线程开始)
>     - tiles 分块
>     - 光栅化
>     - draw 画
> 12. **根据情况是否需要关闭连接，四次挥手**

### preload、prefetch、async、defer的区别

> preload 和 prefetch：用于资源提前加载，分别适用当前页面和未来可能需要的资源。
> - **Preload**：用于告诉浏览器在页面加载过程中需要高优先级加载的资源。
> - **Prefetch**：用于告诉浏览器资源之后可能会在未来使用，因此可以在空闲时间提前下载。
>
> **async** 和 **defer**：用于控制脚本的加载与执行时机，async最适合独立脚本，defer适合需要按顺序执行且依赖DOM的脚本。
> - **Async**：async用于异步加载JavaScript，脚本下载完成后立即执行，不会影响dom脚本解析。
> - **Defer**：defer用于延迟执行JavaScript，直到HTML解析完毕之后再执行。

### async、defer、load、DOMContentLoaded 先后顺序

> defer -> DOMContentLoaded -> window.onload -> load
> 
> async -> window.onload -> load

- **DOMContentLoaded** —— 浏览器已完全加载HTML，并构建了DOM树，但像**img标签**和**样式表之类**的外部资源可能尚未加载完成。
- **load** —— 浏览器不仅加载完成了 HTML，还加载完成了所有外部资源：图片，样式等
- **async** —— async脚本的加载是异步的，不会阻塞HTML解析。脚本一旦下载完成，会立即执行，此时可能会中断HTML解析（若解析尚未完成）。由于浏览器并行下载脚本和其他资源，因此其执行时机取决于下载完成的时间。
- **window.onload** —— window.onload事件会在页面所有资源（包括图片、样式表、异步脚本等）加载完成后触发。这意味着浏览器会等待async脚本的下载完成，即使它们的执行已经结束。

### http 1.0 2.0 区别

|   | http 1.0 | http 2.0 |
|---|----------|----------|
| 连接方式  |  默认使用`短连接`，每个请求需要单独建立一次TCP连接，请求完成后立即关闭。会导致频繁的TCP握手和断开，增加了网络延迟和开销‌。       |  采用`长连接`，默认复用同一个TCP连接，可以在一个连接上并发处理多个请求和响应，减少了TCP连接的建立和断开次数，提高性能和效率‌‌。        |
| 数据格式  |  基于`文本`的协议，请求和响应以纯文本形式传输，解析效率低且容易出错‌。        |   采用`二进制分帧`，将数据分割为更小的二进制帧进行传输，提高了传输效率和错误率低‌。       |
| 头部压缩  |  `不支持`头部压缩，每次请求需要重复发送完整的头部信息，浪费带宽‌        |   使用`HPACK算法`对头部进行压缩，减少了冗余数据传输，典型压缩率可达50%-90%。       |
| ‌多路复用‌  |  `不支持`多路复用，请求需要按顺序发送和接收，存在“队头阻塞”问题        |   `支持`多路复用，单个TCP连接可以并发处理多个请求和响应，解决了队头阻塞问题，提高了并发处理能力‌       |
| 服务器推送  |  `不支持`服务器推送功能，客户端必须主动请求每个资源‌。        |   服务器可以`主动向客户端推送资源`。       |

### [浏览器缓存 与 http缓存](/my-blog/Promotion/JavaScript/BrowserCache/)

> `localStorage(5M)`、`sessionStorage(5M)`、`cookie(4k)`


## Vue


### 为什么要虚拟DOM

1. 框架设计： 渲染页面运行render函数，组件化开发的时候属性一旦改变只能全量渲染，直接操作DOM代价过高，使用虚拟DOM代替
2. 跨平台：除了浏览器环境，其他环境都不存在dom，打包其他环境的时候可以用虚拟dom做中间转换


### Proxy 和 DefineProperty 的区别

> **Proxy** 可以重定义对象的所有基本方法
> 
> **DefineProperty** 只是基本方法之一

### v-if 和 v-for优先级

> 在 Vue 2 中，v-for 的优先级高于 v-if，也就是说，Vue 2 在渲染时，会先处理 v-for 生成列表项，再对子项判断 v-if 是否渲染。
> 
> 在 Vue3 中，v-if 的优先级高于 v-for，也就是说， v-if 的条件将无法访问到 v-for 作用域内定义的变量别名，所以会报错。

### extend(s)与mixins差异

> **Mixins** 选项接收一个混入对象的数组（即可以多个）。 
> - 当值为对象的选项，如 **methods,components** 等，选项会被合并，键冲突的时候组件会覆盖混入对象 
> - 当值为函数的选项，如 **created,mounted** 等，就会被合并调用，混入对象钩子函数会比组件里的钩子函数先调用
> 
> **Extends** 只能暴露一个extends对象。
> - extends会比Mixins先执行。执行顺序：extends > Mixins> 组件

### [生命周期](/my-blog/Promotion/Vue/LifeCycle/)

![](https://shaohui-jin.github.io/picx-images-hosting/blog/Vue/生命周期.5fkdt6fcci.webp "vueLifecycle" =x800)

### created与activated差异

> 页面第一次进入，钩子的触发顺序 **created -> mounted-> activated**，退出时触发 **deactivated**
> 
> 当再次进入（前进或者后退）时，只触发 **activated**
>
> 被包含在 <**keep-alive**> 中创建的组件，会多出两个生命周期的钩子: activated 与 deactivated
> - **activated**：在组件第一次渲染时也会被调用，之后每次keep-alive激活时被调用。 
> - **deactivated**：在组件被停用时调用。

### 通讯方式

> - 父子组件通信: `props/$emit`、`$parent/$children`、`provide/inject`、`ref`、`$attrs/$listeners`
> - 兄弟组件通信: `eventBus`、`Vuex`
> - 跨级通信: `eventBus`、`Vuex`、`provide/inject`、`$attrs/$listeners`


## node


### node的模块查找策略

> **`./`** 或 **`../`** 作为前缀 -> `文件查找` -> `文件夹查找`
>
> 其他情况 -> `内置模块查找` -> `第三方模块查找`

```javascript
/***
 * 1.文件查找
 *  1.1 ./a.js
 *  1.2 ./a.json
 * 2.文件夹查找
 *  2.1 ./a/package.json main字段
 *  2.2 ./a/index.js
 *  2.3 ./a/index.json
 */
require('./a')

/***
 * 1. 内置模块查找
 * 2. 第三方模块查找(node_modules中存在时，回到文件查找、文件夹查找)
 *  2.1 ./node_modules/a
 *  2.2 ../node_modules/a
 *  2.3 ../../node_modules/a
 *  2.4 ../../../node_modules/a
 *  2.5 ../../../../
 */
require('a')
```


## 未整理


## 后续暂未整理


### vue的computed跟普通的函数有什么区别吗，computed怎么实现缓存的，有看过源码吗

### vue-router实现原理的 history 相关的api

## webpack模块

### webpack中 bundle chunk module 有什么区别

### webpack中 plugin loader 有什么区别


### 同源与跨域

#### 同源策略限制了什么

1. DOM层面：同源策略限制了不同源的js对当前DOM对象的读写操作
2. 数据层面：同源策略限制了不同源站点读取当前站点的Cookies、IndexDB、LocalStorage等数据
3. 网络层面：同源策略限制了数据发送给非同源站点（比如XML HttpRequest、Fetch等无法请求不同源站点

#### 跨域三要素

浏览器限制：即浏览器对跨域行为进行检测和阻止
触发跨域的三要素之一：协议、域名、端口
发起的是xhr请求：即XMLHttpRequest

#### 如何解决跨域

被调用方解决跨域设置 访问控制允许来源
response.addHeader(‘Access-Control-Allow-Origin’,’*’ )
调用方使用Nginx 代理调用方请求，目的是为了和被调用方的域名端口保持一致
jsonp


#### a.com -> b.com 跨域发生在一步

### get请求跨域吗

### 什么时候会发送预检请求

### 网络策略

#### CORS 跨源资源共享


#### CSP 内容安全策略

同源策略是期望让我们的页面引用的资源都来自一个源，对于不是同源的文件，我们默认就是不安全的
CSP的核心思想就是让服务器决定浏览器可以加载那些资源，让服务器决定浏览器是否能够执行加载的JS代码。
Content-Security-Policy: default-src 'self'; img-src *; media-src media1.com media2.com; script-src userscripts.example.com


## Vue3

### ref 和 reactive的用法
### reactive的响应式

## React

### 类组件 和 函数组件 的区别
### useState 和 useRef
### useLayoutEffect


## 代码测试 

## 灵活

### 长列表问题

1. 帧动画加载
2. 冻结数组
3. 触底加载
4. 文档碎片Fragment

