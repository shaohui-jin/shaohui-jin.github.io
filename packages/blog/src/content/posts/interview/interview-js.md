---
headerDepth: 3
---

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
