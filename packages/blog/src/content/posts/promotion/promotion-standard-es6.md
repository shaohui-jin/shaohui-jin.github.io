---
title: ECMAScript 6
lang: zh-CN
date: 2022-06-01 11:21:30
permalink: /Promotion/Standard/ES6/
category: 
  - Standard
tag: 
  - ECMAScript
---

ECMAScript 6（以下简称ES6）是JavaScript语言的下一代标准。因为当前版本的ES6是在2015年发布的，所以又称ECMAScript 2015。

Node.js 是 JavaScript 的服务器运行环境（runtime）。它对 ES6 的支持度更高。除了那些默认打开的功能，还有一些语法功能已经实现了，但是默认没有打开。使用下面的命令，可以查看 Node.js 默认没有打开的 ES6 实验性语法。

```shell script
// Linux & Mac
$ node --v8-options | grep harmony
// Windows
$ node --v8-options | findstr harmony
```

<!-- more -->

## Babel 转码器

在讲ES6特性前，需要知道一下什么是Babel转码器。Babel 是 **一个广泛使用的 ES6 转码器，可以将 ES6 代码转为 ES5 代码，从而在老版本的浏览器执行** 。这意味着，你可以用 ES6 的方式编写程序，又不用担心现有环境是否支持。下面是一个例子。

```javascript
// 转码前
input.map(item => item + 1)
// 转码后
input.map(function (item) {
return item + 1
})
```

上面的原始代码用了箭头函数，Babel将其转为普通函数，就能在不支持箭头函数的 JavaScript 环境执行了。

### 安装 @Babel/core

下面的命令在项目目录中，安装 Babel。

```shell script
$ npm install --save-dev @babel/core
```

Babel 的配置文件是.babelrc，存放在项目的根目录下。使用 Babel 的第一步，就是配置这个文件。该文件用来 **设置转码规则和插件** ，基本格式如下：

```json5
{
"presets": [], // 转码规则
"plugins": []
}
```

presets字段设定转码规则，官方提供以下的规则集，你可以根据需要安装。

```shell script
# 最新转码规则
$ npm install --save-dev @babel/preset-env
# react 转码规则
$ npm install --save-dev @babel/preset-react
```

然后，将这些规则加入.babelrc

```json5
{
  "presets": [
    "@babel/env",
    "@babel/preset-react"
  ],
  "plugins": []
}
```

### 安装 @Babel/cli 

Babel 提供命令行工具@babel/cli，用于命令行转码。它的安装命令如下。

```shell script
$ npm install --save-dev @babel/cli
```

基本用法如下：

```shell script
# 转码结果输出到标准输出
$ npx babel example.js

# 转码结果写入一个文件
# --out-file 或 -o 参数指定输出文件
$ npx babel example.js --out-file compiled.js
# 或者
$ npx babel example.js -o compiled.js

# 整个目录转码
# --out-dir 或 -d 参数指定输出目录
$ npx babel src --out-dir lib
# 或者
$ npx babel src -d lib

# -s 参数生成source map文件
$ npx babel src -d lib -s
```

### 安装 @Babel/node

@babel/node模块的babel-node命令， **提供一个支持 ES6 的 REPL 环境。它支持 Node 的 REPL 环境的所有功能，而且可以直接运行 ES6 代码** 。

首先，安装这个模块。

```shell script
$ npm install --save-dev @babel/node
```

然后，执行babel-node就进入 REPL 环境。

```shell script
$ npx babel-node
(x => x * 2)(1)  // 2
```

babel-node命令可以直接运行 ES6 脚本。将上面的代码放入脚本文件es6.js，然后直接运行。

```shell script
# es6.js 的代码
# console.log((x => x * 2)(1))
$ npx babel-node es6.js
```

### 安装 @babel/register

@babel/register模块改写require命令，为它加上一个钩子。此后， **每当使用require加载.js、.jsx、.es和.es6后缀名的文件，就会先用 Babel 进行转码**。

```shell script
$ npm install --save-dev @babel/register
```

使用时，必须首先加载@babel/register。

```javascript
// index.js
require('@babel/register')
require('./es6.js')
```

然后，就不需要手动对index.js转码了。

```shell script
$ node index.js
```

需要注意的是，@babel/register只会对require命令加载的文件转码，而不会对当前文件转码。另外，由于它是实时转码，所以只适合在开发环境使用。

### polyfill

Babel 默认只转换新的 JavaScript 句法（syntax），而不转换新的 API，比如 **Iterator、Generator、Set、Map、Proxy、Reflect、Symbol、Promise等全局对象，以及一些定义在全局对象上的方法（比如Object.assign）都不会转码** 。

举例来说，ES6 在Array对象上新增了Array.from方法。Babel 就不会转码这个方法。如果想让这个方法运行，可以 **使用core-js和regenerator-runtime(后者提供generator函数的转码)，为当前环境提供一个垫片** 。

安装命令如下：

```shell script
$ npm install --save-dev core-js regenerator-runtime
```

然后，在脚本头部，加入如下两行代码：

```javascript
import 'core-js'
import 'regenerator-runtime/runtime'
// 或者
require('core-js')
require('regenerator-runtime/runtime')
```

Babel 默认不转码的 API 非常多，详细清单可以查看babel-plugin-transform-runtime模块的 **definitions.js** 文件。

### 浏览器环境

Babel 也可以用于浏览器环境，使用@babel/standalone模块提供的浏览器版本，将其插入网页。

```html
<script src="https://unpkg.com/@babel/standalone/babel.min.js" />
<script type="text/babel">
// Your ES6 code
</script>
```

注意，网页实时将 ES6 代码转为 ES5，对性能会有影响。生产环境需要加载已经转码完成的脚本。

Babel 提供一个REPL 在线编译器，可以在线将 ES6 代码转为 ES5 代码。转换后的代码，可以直接作为 ES5 代码插入网页运行。

## 最常用的ES6特性

**let, const, class, extends, super, arrow function, template string, destructuring, default, rest arguments**

这些是ES6最常用的几个语法，基本上学会它们，我们就可以走遍天下都不怕啦！我会用最通俗易懂的语言和例子来讲解它们，保证一看就懂，一学就会。

## let, const

实例展示

这两个的用途与var类似，都是用来声明变量的，但在实际运用中他俩都有各自的特殊用途。首先来看下面这个例子：

```javascript
var name = 'zach'
while (true) {
  var name = 'obama'
  console.log(name)  //obama
  break
}
console.log(name)  //obama
```

使用var 两次输出都是obama，这是因为 **ES5只有全局作用域和函数作用域，没有块级作用域** ，这带来很多不合理的场景。

第一种场景就是你现在看到的内层变量覆盖外层变量。而 **let则实际上为JavaScript新增了块级作用域** 。用它所声明的变量，只在 **let命令所在的代码块内有效**。

```javascript
let name = 'zach'
while (true) {
  let name = 'obama'
  console.log(name)  //obama
  break
}
console.log(name)  //zach
```

另外一个var带来的不合理场景就是用来计数的循环变量泄露为全局变量，看下面的例子：

```javascript
var a = []
for (var i = 0; i < 10; i++) {
  a[i] = function () {
    console.log(i)
  }
}
a[6]() // 10
```

上面代码中，变量i是var声明的，在全局范围内都有效。所以每一次循环，新的i值都会覆盖旧值，导致最后输出的是最后一轮的i的值。而使用let则不会出现这个问题。

```javascript
var a = []
for (let i = 0; i < 10; i++) {
  a[i] = function () {
    console.log(i)
  }
}
a[6]() // 6
```

再来看一个更常见的例子，了解下如果不用ES6，而用闭包如何解决这个问题。

```javascript
var clickBoxs = document.querySelectorAll('.clickBox')
for (var i = 0; i < clickBoxs.length; i++){
  clickBoxs[i].onclick = function(){
    console.log(i)
  }
}
```

我们本来希望的是点击不同的clickBox，显示不同的i，但事实是无论我们点击哪个clickBox，输出的都是5。下面我们来看下，如何用闭包搞定它。

```javascript
function iteratorFactory(i){
  var onclick = function(e){
    console.log(i)
  }
  return onclick
}
var clickBoxs = document.querySelectorAll('.clickBox')
for (var i = 0; i < clickBoxs.length; i++){
  clickBoxs[i].onclick = iteratorFactory(i)
}
```

const也用来声明变量，但是声明的是常量。一旦声明，**常量的值就不能改变**。

```javascript
const PI = Math.PI
PI = 23 //Module build failed: SyntaxError: /es6/app.js: "PI" is read-only
//Attempt to assign to const or readonly variable 
//Inspection info: Checks that constant or readonly variable is being reassigned
```

当我们尝试去改变用const声明的常量时，浏览器就会报错。const有一个很好的应用场景，就是当我们引用第三方库的时声明的变量，用const来声明可以避免未来不小心重命名而导致出现bug：

```javascript
const monent = require('moment')
```

#### 概念概述

- 不存在变量提升

var命令会发生“变量提升”现象，即 **变量可以在声明之前使用，值为undefined** 。这种现象多多少少是有些奇怪的，按照一般的逻辑，变量应该在声明语句之后才可以使用。为了纠正这种现象， **let命令改变了语法行为，它所声明的变量一定要在声明后使用，否则报错** 。

```javascript
// var 的情况
console.log(foo) // 输出undefined
var foo = 2 // 浏览器console不打印错误信息

// let 的情况
console.log(bar) // 报错ReferenceError
let bar = 2 // 浏览器报错信息：Cannot access 'bar' before initialization
```

上面代码中，变量foo用var命令声明，会发生变量提升，即脚本开始运行时，变量foo已经存在了，但是没有值，所以会输出undefined。变量bar用let命令声明，不会发生变量提升。这表示在声明它之前，变量bar是不存在的，这时如果用到它，就会抛出一个错误。

- 暂时性死区

只要块级作用域内存在let命令，它所声明的变量就“绑定”（binding）这个区域，不再受外部的影响。

```javascript
var tmp = 123
if (true) {
  tmp = 'abc' // ReferenceError
  let tmp
}
```

上面代码中，存在全局变量tmp，但是块级作用域内let又声明了一个局部变量tmp，导致后者绑定这个块级作用域，所以在let声明变量前，对tmp赋值会报错。

ES6明确规定，如果区块中存在let和const命令，这个区块对这些命令声明的变量，从一开始就形成了封闭作用域。凡是在声明之前就使用这些变量，就会报错。

总之，在代码块内，使用let命令声明变量之前，该变量都是不可用的。这在语法上，称为“ **暂时性死区** ”（temporal dead zone，简称 TDZ）。

```javascript
var tmp = '1'
if (true) {
  // TDZ开始
  tmp = 'abc' // ReferenceError
  console.log(tmp) // ReferenceError

  let tmp // TDZ结束
  console.log(tmp) // undefined

  tmp = 123
  console.log(tmp) // 123
}
```

上面代码中，在let命令声明变量tmp之前，都属于变量tmp的“死区”。 **“暂时性死区”也意味着typeof不再是一个百分之百安全的操作** 。

```javascript
console.log( typeof x )// ReferenceError
let x = 1// Cannot access 'x' before initialization
```

上面代码中，变量x使用let命令声明，所以在声明之前，都属于x的“死区”，只要用到该变量就会报错。因此，typeof运行时就会抛出一个ReferenceError。

作为比较，如果一个变量根本没有被声明，使用typeof反而不会报错。

```javascript
console.log(typeof undeclared_variable)// undefined
```

上面代码中，undeclared_variable是一个不存在的变量名，结果返回“undefined”。所以， **在没有let之前，typeof运算符是百分之百安全的** ，永远不会报错
。
现在这一点不成立了。这样的设计是为了让大家养成良好的编程习惯，变量一定要在声明之后使用，否则就报错。有些“死区”比较隐蔽，不太容易发现。

```javascript
function bar(x = y, y = 2) {
  console.log([x, y])
}
bar() // 控制台报错Cannot access 'y' before initialization
```

上面代码中，调用bar函数之所以报错（某些实现可能不报错），是因为参数x默认值等于另一个参数y，而此时y还没有声明，属于“死区”。如果y的默认值是x，就不会报错，因为此时x已经声明了。

```javascript
function bar(x = 2, y = x) {
  console.log([x, y])
}
bar() // [2, 2]
```

另外，下面的代码也会报错，与var的行为不同。

```javascript
// 不报错
var x = x
// 报错
let x = x
// Cannot access 'x' before initialization
```

上面代码报错，也是因为暂时性死区。使用let声明变量时，只要变量在还没有声明完成前使用，就会报错。上面这行就属于这个情况，在变量x的声明语句还没有执行完成前，就去取x的值，导致报错”x 未定义“。

ES6 规定暂时性死区和let、const语句不出现变量提升，主要是为了减少运行时错误，防止在变量声明前就使用这个变量，从而导致意料之外的行为。这样的错误在 ES5是很常见的，现在有了这种规定，避免此类错误就很容易了。

总之， **暂时性死区的本质就是，只要一进入当前作用域，所要使用的变量就已经存在了，但是不可获取，只有等到声明变量的那一行代码出现，才可以获取和使用该变量** 。

- 不允许重复声明

let不允许在相同作用域内，重复声明同一个变量。

```javascript
// 报错
function func() {
  let a = 10
  var a = 1 // 控制台报错 Identifier 'a' has already been declared
}

// 报错
function func() {
  let a = 10
  let a = 1 // 控制台报错 Identifier 'a' has already been declared
}
```

因此，不能在函数内部重新声明参数。

```javascript
function func(arg) {
  let arg // 报错 Identifier 'arg' has already been declared
}
func()

function func(arg) {
  {
    let arg// 不报错
  }
}
func()
```

- 块级作用域

为什么需要块级作用域？

ES5 只有全局作用域和函数作用域，没有块级作用域，这带来很多不合理的场景。第一种场景，内层变量可能会覆盖外层变量。

```javascript
var tmp = new Date()
function f() {
  console.log(tmp)
  if (false) {
    var tmp = 'hello world'
  }
}
f() // undefined
```

上面代码的原意是，if代码块的外部使用外层的tmp变量，内部使用内层的tmp变量。但是，函数if执行后，输出结果为undefined，原因在于变量提升，导致内层的tmp变量覆盖了外层的tmp变量。

第二种场景，用来计数的循环变量泄露为全局变量。

```javascript
var s = 'hello'

for (var i = 0; i < s.length; i++) {
  console.log(s[i])
}

console.log(i) // 5
```

上面代码中，变量i只用来控制循环，但是循环结束后，它并没有消失，泄露成了全局变量。

- ES6 的块级作用域

let实际上为 JavaScript 新增了块级作用域。

```javascript
function f1() {
  let n = 5
  if (true) {
    let n = 10
  }
  console.log(n) // 5
}
```

上面的函数有两个代码块，都声明了变量n，运行后输出 5。这表示外层代码块不受内层代码块的影响。如果两次都使用var定义变量n，最后输出的值才是 10。

ES6 允许块级作用域的任意嵌套。

```javascript
{{{{
  {
    const insane = 'Hello World'
  }
  console.log(insane) // 报错
}}}}
```

上面代码使用了一个五层的块级作用域，每一层都是一个单独的作用域。第四层作用域无法读取第五层作用域的内部变量。

内层作用域可以定义外层作用域的同名变量。

```javascript
{{{{
  let insane = 'Hello World'
  {
    let insane = 'Hello World'
  }
}}}}
```

块级作用域的出现，实际上使得获得广泛应用的匿名立即执行函数表达式（匿名 IIFE）不再必要了。

```javascript
run() {
  // IIFE 写法
  (function () {
    var tmp = ...
  	 ...
  }())

  // 块级作用域写法
  {
    let tmp = ...
  	 ...
  }
}
```

- 块级作用域与函数声明

函数能不能在块级作用域之中声明？这是一个相当令人混淆的问题。

ES5 规定，函数只能在顶层作用域和函数作用域之中声明，不能在块级作用域声明。

```javascript
// 情况一
if (true) {
  function f() {}
}

// 情况二
try {
  function f() {}
} catch(e) {
  // ...
}
```

上面两种函数声明，根据 ES5 的规定都是非法的。

但是，浏览器没有遵守这个规定，为了兼容以前的旧代码，还是支持在块级作用域之中声明函数，因此上面两种情况实际都能运行，不会报错。

ES6 引入了块级作用域，明确允许在块级作用域之中声明函数。ES6 规定， **块级作用域之中，函数声明语句的行为类似于let，在块级作用域之外不可引用** 。

```javascript
function f() {
  console.log('I am outside!')
}
(function () {
  if (false) {
    // 重复声明一次函数f
    function f() {
      console.log('I am inside!')
    }
  }
  f()
}())
```

上面代码在 ES5 中运行，会得到“I am inside!”，因为在if内声明的函数f会被提升到函数头部，实际运行的代码如下。

```javascript
// ES5 环境
function f() {
  console.log('I am outside!')
}
(function () {
  function f() {
    console.log('I am inside!')
  }
  if (false) {
  }
  f()
}())
```

ES6 就完全不一样了，理论上会得到“I am outside!”。因为块级作用域内声明的函数类似于let，对作用域之外没有影响。但是，如果你真的在 ES6 浏览器中运行一下上面的代码，是会报错的，这是为什么呢？

```javascript
// 浏览器的 ES6 环境
function f() {
  console.log('I am outside!')
}
(function() {
  if (false) {
    // 重复声明一次函数f
    function f() {
      console.log('I am inside!')
    }
  }
  f()
}())
// Uncaught TypeError: f is not a function
```

上面的代码在 ES6 浏览器中，都会报错。

原来，如果改变了块级作用域内声明的函数的处理规则，显然会对老代码产生很大影响。为了减轻因此产生的不兼容问题，ES6 在附录 B里面规定，浏览器的实现可以不遵守上面的规定，有自己的行为方式。

1. 允许在块级作用域内声明函数。
2. 函数声明类似于var，即会提升到全局作用域或函数作用域的头部。
3. 同时，函数声明还会提升到所在的块级作用域的头部。

注意，上面三条规则只对 ES6 的浏览器实现有效，其他环境的实现不用遵守，还是将块级作用域的函数声明当作let处理。

根据这三条规则，浏览器的 ES6 环境中，块级作用域内声明的函数，行为类似于var声明的变量。上面的例子实际运行的代码如下。

```javascript
// 浏览器的 ES6 环境
function f() {
  console.log('I am outside!')
}
(function () {
  var f = undefined
  if (false) {
    function f() {
      console.log('I am inside!')
    }
  }
  f()
}())
// Uncaught TypeError: f is not a function
```

考虑到环境导致的行为差异太大，应该避免在块级作用域内声明函数。如果确实需要，也应该写成函数表达式，而不是函数声明语句。

```javascript
// 块级作用域内部的函数声明语句，建议不要使用
{
  let a = 'secret'
  function f() {
    return a
  }
}

// 块级作用域内部，优先使用函数表达式
{
  let a = 'secret'
  let f = function () {
    return a
  }
}
```

另外，还有一个需要注意的地方。ES6 的块级作用域必须有大括号，如果没有大括号，JavaScript 引擎就认为不存在块级作用域。

```javascript
// 第一种写法，报错
if (true) let x = 1

// 第二种写法，不报错
if (true) {
  let x = 1
}
```

上面代码中，第一种写法没有大括号，所以不存在块级作用域，而let只能出现在当前作用域的顶层，所以报错。第二种写法有大括号，所以块级作用域成立。

函数声明也是如此，严格模式下，函数只能声明在当前作用域的顶层。

```javascript
// 不报错
'use strict';
if (true) {
  function f() {}
}

// 报错
'use strict';
if (true)
  function f() {}
```

## class, extends, super

这三个特性涉及了ES5中最令人头疼的几个部分：原型、构造函数，继承...你还在为它们复杂难懂的语法而烦恼吗？你还在为指针到底指向哪里而纠结万分吗？有了ES6我们不再烦恼！

ES6提供了更接近传统语言的写法，引入了Class（类）这个概念。新的class写法让对象原型的写法更加清晰、更像面向对象编程的语法，也更加通俗易懂。

```javascript
class Animal {
  constructor(){
    this.type = 'animal'
  }
  says(say) {
    console.log(this.type + ' says ' + say)
  }
}
const animal = new Animal()
animal.says('hello') // animal says hello

class Cat extends Animal {
  constructor() {
    super()
    this.type = 'cat'
  }
}
const cat = new Cat()
cat.says('hello') // cat says hello
```

上面代码首先用class定义了一个“类”，可以看到里面有一个constructor方法，这就是构造方法，而this关键字则代表实例对象。简单地说， **constructor内定义的方法和属性是实例对象自己的，而constructor外定义的方法和属性则是所有实例对象可以共享的**。

Class之间可以通过extends关键字实现继承，这比ES5的通过修改原型链实现继承，要清晰和方便很多。上面定义了一个Cat类，该类通过extends关键字，继承了Animal类的所有属性和方法。

super关键字，它指代父类的实例（即父类的this对象）。子类必须在constructor方法中调用super方法，否则新建实例时会报错。这是因为 **子类没有自己的this对象，而是继承父类的this对象，然后对其进行加工。如果不调用super方法，子类就得不到this对象** 。

ES6的继承机制，实质是先创造父类的实例对象this（所以必须先调用super方法），然后再用子类的构造函数修改this。

P.S 如果你写react的话，就会发现以上三个东西在最新版React中出现得很多。创建的每个component都是一个继承React.Component的类。详见react文档

## arrow function

这个恐怕是ES6最最常用的一个新特性了，用它来写function比原来的写法要简洁清晰很多:

```javascript
function(i) { return i + 1; } //ES5
(i) => i + 1 //ES6
```

简直是简单的不像话对吧...

如果方程比较复杂，则需要用{}把代码包起来：

```javascript
function(x, y) {
  x++;
  y--;
  return x + y;
}

(x, y) =>{
  x++;
  y--;
  return x + y
}
```

除了看上去更简洁以外，arrow function还有一项超级无敌的功能！长期以来，JavaScript语言的this对象一直是一个令人头痛的问题，在对象方法中使用this，必须非常小心。例如：

```javascript
class Animal {
  constructor(){
    this.type = 'animal'
  }
  says(say){
    setTimeout(function(){
      console.log(this.type + ' says ' + say)
    }, 1000)
  }
}
var animal = new Animal()
animal.says('hi')  // undefined says hi
```

运行上面的代码会报错，这是因为setTimeout中的this指向的是全局对象。所以为了让它能够正确的运行，传统的解决方法有两种：

第一种是将this传给self,再用self来指代this

```javascript
says(say){
  var self = this
  setTimeout(function(){
    console.log(self.type + ' says ' + say)
  }, 1000)
}
```

第二种方法是用bind(this),即

```javascript
says(say){
  setTimeout(function(){
    console.log(this.type + ' says ' + say)
  }.bind(this), 1000)
}
```

但现在我们有了箭头函数，就不需要这么麻烦了：

```javascript
class Animal {
  constructor(){
    this.type = 'animal'
  }
  says(say){
    setTimeout(() => {
      console.log(this.type + ' says ' + say)
    }, 1000)
  }
}
var animal = new Animal()
animal.says('hi')  // animal says hi
```

当我们使用箭头函数时，函数体内的this对象，就是定义时所在的对象，而不是使用时所在的对象。并不是因为箭头函数内部有绑定this的机制，实际原因是箭头函数根本没有自己的this，它的this是继承外面的，因此内部的this就是外层代码块的this。

## template string

这个东西也是非常有用，当我们要插入大段的html内容到文档中时，传统的写法非常麻烦，所以之前我们通常会引用一些模板工具库，比如mustache等等。

大家可以先看下面一段代码：

```javascript
$('#result').append(
  "There are <b>" + model.count + "</b> " +
  "items in your basket, " +
  "<em>" + model.onSale +
  "</em> are on sale!"
)
```

我们要用一堆的’+’号来连接文本与变量，而使用ES6的新特性模板字符串``后，我们可以直接这么来写：

```javascript
$('#result').append(
  `
      There are <b>${model.count}</b>
      items in your basket,<em>${model.onSale}</em> are on sale!
  `
)
```

用反引号（`）来标识始末，用${}来引用变量，而且所有的空格和缩进都会被保留在输出之中，是不是非常爽？！

React Router从第1.0.3版开始也使用ES6语法了，比如这个例子：

```vue
<Link to={`/taco/${taco.name}`}>{taco.name}</Link>
```

## destructuring

ES6允许按照一定模式，从数组和对象中提取值，对变量进行赋值，这被称为解构（Destructuring）。

看下面的例子：

```javascript
let cat = 'ken'
let dog = 'lili'
let zoo = { cat: cat, dog: dog }
console.log(zoo)  //Object {cat: "ken", dog: "lili"}
```

用ES6完全可以像下面这么写：

```javascript
let cat = 'ken'
let dog = 'lili'
let zoo = { cat, dog }
console.log(zoo)  //Object {cat: "ken", dog: "lili"}
```

反过来可以这么写：

```javascript
let dog = { type: 'animal', many: 2 }
let { type, many } = dog
console.log(type, many)   //animal 2
```

## default

default很简单，意思就是默认值。大家可以看下面的例子，调用animal()方法时忘了传参数，传统的做法就是加上这一句type = type || 'cat' 来指定默认值。

```javascript
function animal(type){
  type = type || 'cat'
  console.log(type)
}
animal()
```

如果用ES6我们而已直接这么写：

```javascript
function animal(type = 'cat'){
  console.log(type)
}
animal()
```

## rest arguments

rest语法也很简单，直接看例子：

```javascript
function animals(...types){
  console.log(types)
}
animals('cat', 'dog', 'fish') //["cat", "dog", "fish"]
```

而如果不用ES6的话，我们则得使用ES5的arguments。

```javascript
function func1(a, b, c) {
  console.log(arguments[0])// expected output: 1
  console.log(arguments[1])// expected output: 2
  console.log(arguments[2])// expected output: 3
}
func1(1, 2, 3)
```


## import export

这两个家伙对应的就是es6自己的module功能。

之前写的Javascript一直都没有模块化的体系，无法将一个庞大的js工程拆分成一个个功能相对独立但相互依赖的小工程，再用一种简单的方法把这些小工程连接在一起。

这有可能导致两个问题：一方面js代码变得很臃肿，难以维护另一方面我们常常得很注意每个script标签在html中的位置，因为它们通常有依赖关系，顺序错了可能就会出bug。在es6之前为解决上面提到的问题，我们得利用第三方提供的一些方案，主要有两种CommonJS(服务器端)和AMD（浏览器端，如require.js）。

如果想了解更多AMD，尤其是require.js，可以参看这个教程：why modules on the web are useful and the mechanisms that can be used on the web today to enable them 

而现在我们有了es6的module功能，它实现非常简单，可以成为服务器和浏览器通用的模块解决方案。ES6模块的设计思想，是尽量的静态化，使得编译时就能确定模块的依赖关系，以及输入和输出的变量。CommonJS和AMD模块，都只能在运行时确定这些东西。

上面的设计思想看不懂也没关系，咱先学会怎么用，等以后用多了、熟练了再去研究它背后的设计思想也不迟！好，那我们就上代码...

- 传统的写法

假设我们有两个js文件: index.js和content.js,现在我们想要在index.js中使用content.js返回的结果，我们要怎么做呢？

**require.js的写法**

```javascript
//content.js
define('content.js', function(){
  return 'A cat';
})

//index.js
require(['./content.js'], function(animal){
  console.log(animal);   //A cat
})
```

**CommonJS的写法**

```javascript
//index.js
var animal = require('./content.js')

//content.js
module.exports = 'A cat'
```

**ES6的写法**

```javascript
//index.js
import animal from './content'

//content.js
export default 'A cat'
```

以上我把三者都列出来了，妈妈再也不用担心我写混淆了...

**ES6 module的其他高级用法**

**输出输入多个变量**

```javascript
//content.js
export default 'A cat'
export function say(){
  return 'Hello!'
}
export const type = 'dog'
```

上面可以看出，export命令除了输出变量，还可以输出函数，甚至是类（react的模块基本都是输出类）

```javascript
//index.js
import { say, type } from './content'
let says = say()
console.log(`The ${type} says ${says}`)  //The dog says Hello
```

这里输入的时候要注意：大括号里面的变量名，必须与被导入模块（content.js）对外接口的名称相同。如果还希望输入content.js中输出的默认值(default), 可以写在大括号外面。

```javascript
//index.js
import animal, { say, type } from './content'
let says = say()
console.log(`The ${type} says ${says} to ${animal}`)
//The dog says Hello to A cat
```

**修改变量名**

此时我们不喜欢type这个变量名，因为它有可能重名，所以我们需要修改一下它的变量名。在es6中可以用as实现一键换名。

```javascript
//index.js
import animal, { say, type as animalType } from './content'
let says = say()
console.log(`The ${animalType} says ${says} to ${animal}`)
//The dog says Hello to A cat
```

**模块的整体加载**

除了指定加载某个输出值，还可以使用整体加载，即用星号（*）指定一个对象，所有输出值都加载在这个对象上面。

```javascript
//index.js
import animal, * as content from './content'
let says = content.say()
console.log(`The ${content.type} says ${says} to ${animal}`)
//The dog says Hello to A cat
```

通常星号*结合as一起使用比较合适。

**终极秘籍**

考虑下面的场景：上面的content.js一共输出了三个变量（default, say, type）,假如我们的实际项目当中只需要用到type这一个变量，其余两个我们暂时不需要。我们可以只输入一个变量：

```javascript
import { type } from './content'
```

由于其他两个变量没有被使用，我们希望代码打包的时候也忽略它们，抛弃它们，这样在大项目中可以显著减少文件的体积。

ES6帮我们实现了！

不过，目前无论是webpack还是browserify都还不支持这一功能...

如果你现在就想实现这一功能的话，可以尝试使用rollup.js

他们把这个功能叫做Tree-shaking，哈哈哈，意思就是打包前让整个文档树抖一抖，把那些并未被依赖或使用的东西统统抖落下去。。。

看看他们官方的解释吧：

> Normally if you require a module, you import the whole thing. ES2015 lets you just import the bits you need, without mucking around with custom builds. It's a revolution in how we use libraries in JavaScript, and it's happening right now.
>

