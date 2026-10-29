---
title:  HTML规范指南
date: 2022-06-22 10:28:05
permalink: /Promotion/Standard/HTML/
category:
  - Standard
tag:
  - Standard
---


*HTML 作为描述网页结构的超文本标记语言，本文档的目标是使 HTML 代码风格保持一致，容易被理解和被维护。*

<!-- more -->

## 通用

### `【强制】` 使用 HTML5 的 doctype 来启用标准模式，建议使用大写的 DOCTYPE。

```html
<!DOCTYPE html>
```

### `【推荐】`在 html 标签上设置正确的 **lang** 属性。

> 为什么？有助于提高页面的可访问性，如：让语音合成工具确定其所应该采用的发音，令翻译工具确定其翻译语言等。

```html
<html lang="zh-CN">
```

  
### `【强制】` 页面必须使用精简形式，明确指定字符编码。指定字符编码的 `meta` 必须是 `head` 的第一个直接子元素。

> 为什么？见 [HTML5 Charset能用吗](https://www.w3school.com.cn/html5/att_script_charset.asp)一文。

```html
<html>
  <head>
    <meta charset="UTF-8">
    ......
  </head>
  <body>
    ......
  </body>
</html>
```


### `【强制】` CSS 和 JavaScript 引入

```html
<link rel="stylesheet" href="page.css">
```

### `【建议】` 引入 CSS 和 JavaScript 时无须指明 type 属性。

> 为什么？text/css 和 text/javascript 是 type 的默认值。


### `【建议】` JavaScript 应当放在页面末尾，或采用异步加载。

> 为什么？将 `script` 放在页面中间将阻断页面的渲染。出于性能方面的考虑，如非必要，请遵守此条建议。

```html
 <body>
   <!-- a lot of elements -->
   <script src="init-behavior.js"></script>
 </body>
```

### `【建议】` 移动环境或只针对现代浏览器设计的 Web 应用，如果引用外部资源的 URL 协议部分与页面相同，建议省略协议前缀。

```html
 <script src="//s1.bdstatic.com/cache/static/jquery-1.10.2.min_f2fb5194.js"></script>
 <script src="/cache/static/jquery-1.10.2.min_f2fb5194.js"></script>
```

### `【强制】` 页面必须包含 title 标签声明标题。且 title 必须作为 head 的直接子元素，并紧随 charset 声明之后。

> title 中如果包含 ASCII 之外的字符，浏览器需要知道字符编码类型才能进行解码，否则可能导致乱码。

```html
 <head>
   <meta charset="UTF-8">
   <title>页面标题</title>
 </head>

```

### `【强制】` 保证 favicon 可访问。

> 在未指定 favicon 时，大多数浏览器会请求 Web Server 根目录下的 `favicon.ico` 。为了保证 favicon 可访问，避免 404，必须遵循以下两种方法之一：
>
> 1. 在 Web Server 根目录放置 `favicon.ico` 文件。
> 2. 使用 `link` 指定 favicon。

```html
 <link rel="shortcut icon" href="path/to/favicon.ico">
```

### `【建议】` 若页面欲对移动设备友好，需指定页面的 `viewport`。

> viewport meta tag 可以设置可视区域的宽度和初始缩放大小，避免在移动设备上出现页面展示不正常。 
>比如，在页面宽度小于 `980px` 时，若需 iOS 设备友好，应当设置 viewport 的 `width` 值来适应你的页面宽度。
>
>同时因为不同移动设备分辨率不同，在设置时，应当使用 `device-width` 和 `device-height` 变量。
>
>另外，为了使 viewport 正常工作，在页面内容样式布局设计上也要做相应调整，如避免绝对定位等。关于 viewport 的更多介绍，
>可以参见 [Safari Web Content Guide的介绍](https://developer.apple.com/library/mac/documentation/AppleApplications/Reference/SafariWebContent/UsingtheViewport/UsingtheViewport.html#//apple_ref/doc/uid/TP40006509-SW26)。


## JavaScript规范指南

*使用 JavaScript 最合理的方式。基于Airbnb JavaScript Style Guide 结合实际研发情况，做相应改写而成。*

> **注意**: 这个指南假定你正在使用 [Babel](https://babeljs.io/)，并且需要你使用 [babel-preset-airbnb](https://npmjs.com/babel-preset-airbnb)或与其等效的预设。同时假定你在你的应用里安装了 带有 [airbnb-browser-shims](https://npmjs.com/airbnb-browser-shims)或与其等效的插件的 `shims/polyfills`。

> **提示**: 基于babel-preset-airbnb 二次修改的预设还没完成，仅限与初版文档阶段。

### 引用

#### `【强制】` 所有的赋值都用 `const`，避免使用 `var`。eslint: [`prefer-const`](http://eslint.org/docs/rules/prefer-const.html), [`no-const-assign`](http://eslint.org/docs/rules/no-const-assign.html)

> 为什么？因为这个能确保你不会改变你的初始值，重复引用会导致 bug 并且使代码变得难以理解。

```js
// bad
var a = 1;
var b = 2;

// good
const a = 1;
const b = 2;
```

#### `【强制】` 如果你一定要对参数重新赋值，使用 `let`，而不是 `var`。eslint: [`no-var`](http://eslint.org/docs/rules/no-var.html)

> 为什么？因为 `let` 是块级作用域，而 `var` 是函数级作用域。

```js
// bad
var count = 1;
if (true) {
  count += 1;
}

// good, use the let.
let count = 1;
if (true) {
  count += 1;
}
```

#### 注意：`let` 和 `const` 都是块级作用域。

```js
// const 和 let 都只存在于它被定义的那个块级作用域。
{
  let a = 1;
  const b = 1;
}
console.log(a); // ReferenceError
console.log(b); // ReferenceError
```

### 对象

#### `【强制】` 使用字面值创建对象。eslint: [`no-new-object`](http://eslint.org/docs/rules/no-new-object.html)

```js
// bad
const item = new Object();

// good
const item = {};
```

#### `【强制】` 使用计算属性名创建一个带有动态属性名的对象。

> 为什么？因为这可以使你在同一个地方定义所有对象属性。

```js
function getKey(k) {
  return `a key named ${k}`;
}

// bad
const obj = {
  id: 5,
  name: 'San Francisco',
};
obj[getKey('enabled')] = true;

// good
const obj = {
  id: 5,
  name: 'San Francisco',
  [getKey('enabled')]: true,
};
```

#### `【强制】` 用对象方法简写。eslint: [`object-shorthand`](http://eslint.org/docs/rules/object-shorthand.html)

```js
// bad
const atom = {
  value: 1,

  addValue: function (value) {
    return atom.value + value;
  },
};

// good
const atom = {
  value: 1,

  // 对象的方法
  addValue(value) {
    return atom.value + value;
  },
};
```

#### `【强制】` 用属性值缩写。eslint: [`object-shorthand`](http://eslint.org/docs/rules/object-shorthand.html)

> 为什么？因为这样写的更少且可读性更高。

```js
const lukeSkywalker = 'Luke Skywalker';

// bad
const obj = {
  lukeSkywalker: lukeSkywalker,
};

// good
const obj = {
  lukeSkywalker,
};
```

#### `【推荐】`将你的所有缩写放在对象声明的前面。

> 为什么？因为这样能更方便地知道有哪些属性用了缩写。

```js
const anakinSkywalker = 'Anakin Skywalker';
const lukeSkywalker = 'Luke Skywalker';

// bad
const obj = {
  episodeOne: 1,
  twoJediWalkIntoACantina: 2,
  lukeSkywalker,
  episodeThree: 3,
  mayTheFourth: 4,
  anakinSkywalker,
};

// good
const obj = {
  lukeSkywalker,
  anakinSkywalker,
  episodeOne: 1,
  twoJediWalkIntoACantina: 2,
  episodeThree: 3,
  mayTheFourth: 4,
};
```

#### `【强制】` 只对那些无效的标示使用引号 `''`。eslint: [`quote-props`](http://eslint.org/docs/rules/quote-props.html)

> 为什么？通常我们认为这种方式主观上更易读。不仅优化了代码高亮，而且也更容易被许多 JS 引擎优化。

```js
// bad
const bad = {
  'foo': 3,
  'bar': 4,
  'data-blah': 5,
};

// good
const good = {
  foo: 3,
  bar: 4,
  'data-blah': 5,
};
```

#### `【强制】` 不要直接调用 `Object.prototype`上的方法，如 `hasOwnProperty`、`propertyIsEnumerable`、`isPrototypeOf`。

> 为什么？在一些有问题的对象上，这些方法可能会被屏蔽掉，如：`{ hasOwnProperty: false }` 或空对象 `Object.create(null)`

```js
// bad
console.log(object.hasOwnProperty(key));

// good
console.log(Object.prototype.hasOwnProperty.call(object, key));

// best
const has = Object.prototype.hasOwnProperty; // 在模块作用域内做一次缓存。
console.log(has.call(object, key));
/* or */
import has from 'has'; // https://www.npmjs.com/package/has
console.log(has(object, key));
```

#### `【强制】` 对象浅拷贝时，更推荐使用扩展运算符（即 `...` 运算符），而不是 [`Object.assign` ](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)。获取对象指定的几个属性时，用对象的 rest 解构运算符（即 `...` 运算符）更好。eslint: [`prefer-object-spread`](https://eslint.org/docs/rules/prefer-object-spread)

```js
// very bad
const original = { a: 1, b: 2 };
const copy = Object.assign(original, { c: 3 }); // this mutates `original` ಠ_ಠ
delete copy.a; // so does this

// bad
const original = { a: 1, b: 2 };
const copy = Object.assign({}, original, { c: 3 }); // copy => { a: 1, b: 2, c: 3 }

// good es6 扩展运算符 ...
const original = { a: 1, b: 2 };
// 浅拷贝
const copy = { ...original, c: 3 }; // copy => { a: 1, b: 2, c: 3 }

// rest 解构运算符
const { a, ...noA } = copy; // noA => { b: 2, c: 3 }
```

### 数组

#### `【强制】` 用字面量创建数组。eslint: [`no-array-constructor`](http://eslint.org/docs/rules/no-array-constructor.html)

```js
// bad
const items = new Array();

// good
const items = [];
```

#### `【强制】` 用 [Array#push](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/push)代替直接向数组中添加一个值。

```js
const someStack = [];

// bad
someStack[someStack.length] = 'abracadabra';

// good
someStack.push('abracadabra');
```

#### `【强制】` 用扩展运算符做数组浅拷贝，类似上面的对象浅拷贝。

```js
// bad
const len = items.length;
const itemsCopy = [];
let i;

for (i = 0; i < len; i += 1) {
  itemsCopy[i] = items[i];
}

// good
const itemsCopy = [...items];
```

#### `【强制】` 用 `...` 运算符而不是 [`Array.from`](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/from)来将一个可迭代的对象转换成数组。

```js
const foo = document.querySelectorAll('.foo');

// good
const nodes = Array.from(foo);

// best
const nodes = [...foo];
```

#### `【强制】` 用 [`Array.from`](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/from)将一个类数组对象转成一个数组。

```js
const arrLike = { 0: 'foo', 1: 'bar', 2: 'baz', length: 3 };

// bad
const arr = Array.prototype.slice.call(arrLike);

// good
const arr = Array.from(arrLike);
```

#### `【强制】` 用 [`Array.from`](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/from)而不是 `...` 运算符去做 map 遍历。 因为这样可以避免创建一个临时数组。

```js
// bad
const baz = [...foo].map(bar);

// good
const baz = Array.from(foo, bar);
```

#### `【强制】` 在数组方法的回调函数中使用 return 语句。如果函数体由一条返回一个表达式的语句组成，并且这个表达式没有副作用， 这个时候可以忽略 return，详见 [7.2](http://fe.dev.kdshc.com/docs.html#arrows--implicit-return)。eslint: [`array-callback-return`](http://eslint.org/docs/rules/array-callback-return)

```js
// good
[1, 2, 3].map((x) => {
  const y = x + 1;
  return x * y;
});

// good 函数只有一个语句
[1, 2, 3].map(x => x + 1);

// bad - 没有返回值， 因为在第一次迭代后 acc 就变成 undefined 了
[[0, 1], [2, 3], [4, 5]].reduce((acc, item, index) => {
  const flatten = acc.concat(item);
  acc[index] = flatten;
});

// good
[[0, 1], [2, 3], [4, 5]].reduce((acc, item, index) => {
  const flatten = acc.concat(item);
  acc[index] = flatten;
  return flatten;
});

// bad
inbox.filter((msg) => {
  const { subject, author } = msg;
  if (subject === 'Mockingbird') {
    return author === 'Harper Lee';
  } else {
    return false;
  }
});

// good
inbox.filter((msg) => {
  const { subject, author } = msg;
  if (subject === 'Mockingbird') {
    return author === 'Harper Lee';
  }

  return false;
});
```

#### `【强制】` 如果一个数组有很多行，在数组的 `[` 后和 `]` 前断行。请看下面示例：

```js
// bad
const arr = [
  [0, 1], [2, 3], [4, 5],
];

const objectInArray = [{
  id: 1,
}, {
  id: 2,
}];

const numberInArray = [
  1, 2,
];

// good
const arr = [[0, 1], [2, 3], [4, 5]];

const objectInArray = [
  {
    id: 1,
  },
  {
    id: 2,
  },
];

const numberInArray = [
  1,
  2,
];
```

### 解构

#### `【强制】` 用对象的解构赋值来获取和使用对象某个或多个属性值。eslint: [`prefer-destructuring`](https://eslint.org/docs/rules/prefer-destructuring)

> 为什么？解构使您不必为这些属性创建临时引用，并且避免重复引用对象。重复引用对象将造成代码重复、增加阅读次数、提高犯错概率。
>Destructuring objects also provides a single site of definition of the object structure that is used in the block, rather than requiring reading the entire block to determine what is used.

```js
// bad
function getFullName(user) {
  const firstName = user.firstName;
  const lastName = user.lastName;

  return `${firstName} ${lastName}`;
}

// good
function getFullName(user) {
  const { firstName, lastName } = user;
  return `${firstName} ${lastName}`;
}

// best
function getFullName({ firstName, lastName }) {
  return `${firstName} ${lastName}`;
}
```

#### `【强制】` 用数组解构。eslint: [`prefer-destructuring`](https://eslint.org/docs/rules/prefer-destructuring)

```js
const arr = [1, 2, 3, 4];

// bad
const first = arr[0];
const second = arr[1];

// good
const [first, second] = arr;
```

#### `【强制】` 多个返回值用对象的解构，而不是数组解构。

> 为什么？你可以在后期添加新的属性或者变换变量的顺序而不会破坏原有的引用。

```js
// bad
function processInput(input) {
  // 然后就是见证奇迹的时刻
  return [left, right, top, bottom];
}

// 调用者需要想一想返回值的顺序
const [left, __, top] = processInput(input);

// good
function processInput(input) {
  // oops，奇迹又发生了
  return { left, right, top, bottom };
}

// 调用者只需要选择他想用的值就好了
const { left, top } = processInput(input);
```

### 字符串

#### `【强制】` 字符串应使用单引号 `''` 。eslint: [`quotes`](https://eslint.org/docs/rules/quotes.html)

```js
// bad
const name = "Capt. Janeway";

// good
const name = `Capt. Janeway`;
const name = 'Capt. Janeway';
```

#### `【强制】` 超过 100 个字符的字符串不应该用字符串连接成多行。

> 为什么？字符串折行增加编写难度且不易被搜索。

```js
// bad
const errorMessage = 'This is a super long error that was thrown because \
    of Batman. When you stop to think about how Batman had anything to do \
    with this, you would get nowhere \
fast.';

// bad
const errorMessage = 'This is a super long error that was thrown because ' +
    'of Batman. When you stop to think about how Batman had anything to do ' +
'with this, you would get nowhere fast.';

// good
const errorMessage = 'This is a super long error that was thrown because of Batman. When you stop to think about how Batman had anything to do with this, you would get nowhere fast.';
```

#### `【推荐】`当需要动态生成字符串时，使用模板字符串而不是字符串拼接。eslint: [`prefer-template`](https://eslint.org/docs/rules/prefer-template.html)[`template-curly-spacing`](https://eslint.org/docs/rules/template-curly-spacing)

> 为什么？模板字符串更具可读性、多行语法更简洁以及更方便插入变量到字符串里头。

```js
// bad
function sayHi(name) {
  return 'How are you, ' + name + '?';
}

// bad
function sayHi(name) {
  return ['How are you, ', name, '?'].join();
}

// bad
function sayHi(name) {
  return `How are you, ${ name }?`;
}

// good
function sayHi(name) {
  return `How are you, ${name}?`;
}
```

#### 永远不要使用 `eval()`，该方法有太多漏洞。eslint: [`no-eval`](https://eslint.org/docs/rules/no-eval)

#### 不要使用不必要的转义字符。eslint: [`no-useless-escape`](http://eslint.org/docs/rules/no-useless-escape)

> 为什么？反斜线可读性差，因此仅当必要时才使用它。

```js
// bad
const foo = '\'this\' \i\s \"quoted\"';

// good
const foo = '\'this\' is "quoted"';

//best
const foo = `my name is '${name}'`;
```

### 函数

#### `【推荐】`使用命名函数表达式而不是函数声明。eslint: [`func-style`](http://eslint.org/docs/rules/func-style)

> 函数表达式： const func = function () {}

> 函数声明： function func () {}

> 为什么？函数声明会发生提升，这意味着在一个文件里函数很容易在其被定义之前就被引用了。这样伤害了代码可读性和可维护性。如果你发现一个函数又大又复杂，且这个函数妨碍了这个文件其他部分的理解性，你应当单独把这个函数提取成一个单独的模块。不管这个名字是不是由一个确定的变量推断出来的，别忘了给表达式清晰的命名（这在现代浏览器和类似 babel 编译器中很常见）。这消除了由匿名函数在错误调用栈产生的所有假设。 ([讨论 ](https://github.com/airbnb/javascript/issues/794))

```
> 译者注：这一段可能不是很好理解，简单来说就是使用函数声明会发生提升（即在函数被声明之前就可以使用），使用匿名函数会导致难以追踪错误。[这一段英文原文在这](https://github.com/airbnb/javascript#functions)。
```

```js
// bad
function foo() {
  // ...
}

// bad
const foo = function () {
  // ...
};

// good
// lexical name distinguished from the variable-referenced invocation(s)
// 函数表达式名和声明的函数名是不一样的
const short = function longUniqueMoreDescriptiveLexicalFoo() {
  // ...
};
```

#### `【强制】` 把立即执行函数包裹在圆括号里。eslint: [`wrap-iife`](http://eslint.org/docs/rules/wrap-iife.html)

> 立即执行函数：Immediately Invoked Function expression = IIFE。 为什么？一个立即调用的函数表达式是一个单元 - 把它和它的调用者（圆括号）包裹起来，使代码读起来更清晰。 另外，在模块化世界里，你几乎用不着 IIFE。

```js
// immediately-invoked function expression (IIFE)
(function () {
  console.log('Welcome to the Internet. Please follow me.');
}());
```

#### `【强制】` 不要在非函数块（`if`、`while` 等）内声明函数。把这个函数分配给一个变量。浏览器会允许你这样做，但不同浏览器的解析方式不同，这是一个坏消息。eslint: [`no-loop-func`](http://eslint.org/docs/rules/no-loop-func.html)

*注意**：ECMA-262 中对块（`block`）的定义是： 一系列的语句。但是函数声明不是一个语句， 函数表达式是一个语句。

```js
// bad
if (currentUser) {
  function test() {
    console.log('Nope.');
  }
}

// good
let test;
if (currentUser) {
  test = () => {
    console.log('Yup.');
  };
}
```

#### `【强制】` 不要用 `arguments` 命名参数。他的优先级高于每个函数作用域自带的 `arguments` 对象，这会导致函数自带的 `arguments` 值被覆盖。

```js
// bad
function foo(name, options, arguments) {
  // ...
}

// good
function foo(name, options, args) {
  // ...
}
```

#### `【强制】` 不要使用 `arguments`，用收集参数语法 `...` 代替。eslint: [`prefer-rest-params`](http://eslint.org/docs/rules/prefer-rest-params)

> 为什么？`...` 明确你想用哪个参数。而且收集参数是真数组，而不是类似数组的 `arguments`。

```js
// bad
function concatenateAll() {
  const args = Array.prototype.slice.call(arguments);
  return args.join('');
}

// good
function concatenateAll(...args) {
  return args.join('');
}
```

#### `【推荐】`用默认参数语法而不是在函数里对参数重新赋值。

```js
// really bad
function handleThings(opts) {
  // 不！我们不该修改 arguments
  // 第二：如果 opts 的值为 false, 它会被赋值为 {}
  // 虽然你想这么写，但是这个会带来一些微妙的 bug。
  opts = opts || {};
  // ...
}

// still bad
function handleThings(opts) {
  if (opts === void 0) {
    opts = {};
  }
  // ...
}

// good
function handleThings(opts = {}) {
  // ...
}
```

#### `【强制】` 避免默认参数的副作用。

> 为什么？他会令人迷惑不解，比如下面这个，a 到底等于几，这个需要想一下。

```js
var b = 1;
// bad
function count(a = b++) {
  console.log(a);
}
count();  // 1
count();  // 2
count(3); // 3
count();  // 3
```

#### `【推荐】`把默认参数赋值放在最后。eslint: [`default-param-last`](https://eslint.org/docs/rules/default-param-last)

```js
// bad
function handleThings(opts = {}, name) {
  // ...
}

// good
function handleThings(name, opts = {}) {
  // ...
}
```

#### `【强制】` 不要用函数构造器创建函数。eslint: [`no-new-func`](http://eslint.org/docs/rules/no-new-func)

> 为什么？以这种方式创建函数将类似于字符串 eval()，存在漏洞。

```js
// bad
var add = new Function('a', 'b', 'return a + b');

// still bad
var subtract = Function('a', 'b', 'return a - b');
```

#### `【强制】` 函数定义部分要有空格。eslint: [`space-before-function-paren`](http://eslint.org/docs/rules/space-before-function-paren)[`space-before-blocks`](http://eslint.org/docs/rules/space-before-blocks)

> 为什么？统一性好，而且在你添加/删除一个名字的时候不需要添加/删除空格。

```js
// bad
const f = function(){};
const g = function (){};
const h = function() {};

// good
const x = function () {};
const y = function a() {};
```

#### `【强制】` 不要修改参数. eslint: [`no-param-reassign`](http://eslint.org/docs/rules/no-param-reassign.html)

> 为什么？操作参数对象对原始调用者会导致意想不到的副作用。就是不要改参数的数据结构，保留参数原始值和数据结构。

```js
// bad
function f1(obj) {
  obj.key = 1;
};

// good
function f2(obj) {
  const key = Object.prototype.hasOwnProperty.call(obj, 'key') ? obj.key : 1;
};
```

#### `【推荐】`不要对参数重新赋值。eslint: [`no-param-reassign`](http://eslint.org/docs/rules/no-param-reassign.html)

> 为什么？参数重新赋值会导致意外行为，尤其是对 `arguments`。这也会导致优化问题，特别是在 V8 引擎里。

```js
// bad
function f1(a) {
  a = 1;
  // ...
}

function f2(a) {
  if (!a) { a = 1; }
  // ...
}

// good
function f3(a) {
  const b = a || 1;
  // ...
}

function f4(a = 1) {
  // ...
}
```

#### `【强制】` 使用拓展运算符调用多参数的函数。eslint: [`prefer-spread`](http://eslint.org/docs/rules/prefer-spread)

> 为什么？这样更清晰，你不必提供上下文（即指定 this 值），而且你不能轻易地用 `apply` 来组成 `new`。

```js
// bad
const x = [1, 2, 3, 4, 5];
console.log.apply(console, x);

// good
const x = [1, 2, 3, 4, 5];
console.log(...x);

// bad
new (Function.prototype.bind.apply(Date, [null, 2016, 8, 5]));

// good
new Date(...[2016, 8, 5]);
```

#### `【强制】` 调用或者编写一个包含多个参数的函数的缩进，应该像这个指南里的其他多行代码写法一样——即每行只包含一个参数，每行逗号结尾。

```js
// bad
function foo(bar,
             baz,
             quux) {
  // ...
}

// good 缩进不要太过分
function foo(
  bar,
  baz,
  quux,
) {
  // ...
}

// bad
console.log(foo,
  bar,
  baz);

// good
console.log(
  foo,
  bar,
  baz,
);
```

### 箭头函数

#### `【强制】` 当你一定要用函数表达式（在回调函数里）的时候，使用箭头函数。 eslint: [`prefer-arrow-callback`](http://eslint.org/docs/rules/prefer-arrow-callback.html), [`arrow-spacing`](http://eslint.org/docs/rules/arrow-spacing.html)

> 为什么？箭头函数中的 `this` 与定义该函数的上下文中的 `this` 一致，这通常才是你想要的。而且箭头函数是更简洁的语法。

> 什么时候不用箭头函数：如果你的函数逻辑较复杂，你应该把它单独写入一个命名函数里头。

```js
// bad
[1, 2, 3].map(function (x) {
  const y = x + 1;
  return x * y;
});

// good
[1, 2, 3].map((x) => {
  const y = x + 1;
  return x * y;
});
```

#### `【强制】` 如果函数体由一个没有副作用的 [表达式](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_Operators#Expressions)语句组成，删除大括号和 return。否则，使用大括号和 `return` 语句。 eslint: [`arrow-parens` ](https://eslint.org/docs/rules/arrow-parens.html), [`arrow-body-style`](https://eslint.org/docs/rules/arrow-body-style.html)

> 为什么？语法糖，当多个函数链在一起的时候好读。

```js
// bad
[1, 2, 3].map((number) => {
  const nextNumber = number + 1;
  `A string containing the ${nextNumber}.`;
});

// good
[1, 2, 3].map((number) => `A string containing the ${number + 1}.`);

// good
[1, 2, 3].map((number) => {
  const nextNumber = number + 1;
  return `A string containing the ${nextNumber}.`;
});

// good
[1, 2, 3].map((number, index) => ({
  [index]: number,
}));

// 没有明显的 return 语句，可能存在副作用。
function foo(callback) {
  const val = callback();
  if (val === true) {
    // 当 callback 返回 true 时...
  }
}

let bool = false;

// bad
foo(() => bool = true);


// good
foo(() => {
  bool = true;
});
```

#### `【强制】` 如果表达式涉及多行，把他包裹在圆括号里以提高可读性。

> 为什么？这样能清晰地显示函数的开始位置和结束位置。

```js
// bad
['get', 'post', 'put'].map(httpMethod => Object.prototype.hasOwnProperty.call(
    httpMagicObjectWithAVeryLongName,
    httpMethod
  )
);

// good
['get', 'post', 'put'].map(httpMethod => (
  Object.prototype.hasOwnProperty.call(
    httpMagicObjectWithAVeryLongName,
    httpMethod
  )
));
```

#### `【推荐】`在箭头函数参数两头，总是使用小括号包裹住参数，这样做使代码更清晰且一致. eslint: [`arrow-parens`](https://eslint.org/docs/rules/arrow-parens.html)

> 为什么？当你想要添加或删除参数时能比较省事。

```js
// bad
[1, 2, 3].map(x => x * x);

// good
[1, 2, 3].map((x) => x * x);

// bad
[1, 2, 3].map(number => (
  `A long string with the ${number}. It’s so long that we don’t want it to take up space on the .map line!`
));

// good
[1, 2, 3].map((number) => (
  `A long string with the ${number}. It’s so long that we don’t want it to take up space on the .map line!`
));


// bad
[1, 2, 3].map(x => {
  const y = x + 1;
  return x * y;
});

// good
[1, 2, 3].map((x) => {
  const y = x + 1;
  return x * y;
});
```

#### `【推荐】`避免箭头函数（`=>`）和比较操作符（`<=`, `>=`）混淆. eslint: [`no-confusing-arrow`](http://eslint.org/docs/rules/no-confusing-arrow)

```js
// bad
const itemHeight = (item) => item.height <= 256 ? item.largeSize : item.smallSize;

// bad
const itemHeight = (item) => item.height >= 256 ? item.largeSize : item.smallSize;

// good
const itemHeight = (item) => (item.height <= 256 ? item.largeSize : item.smallSize);

// good
const itemHeight = (item) => {
  const { height, largeSize, smallSize } = item;
  return height <= 256 ? largeSize : smallSize;
};
```

#### `【推荐】`使箭头函数体有一个清晰的返回。 eslint: [`implicit-arrow-linebreak`](https://eslint.org/docs/rules/implicit-arrow-linebreak)

```js
// bad
(foo) =>
  bar;

(foo) =>
  (bar);

// good
(foo) => bar;
(foo) => (bar);
(foo) => (
   bar
)
```

### 类与构造函数

#### `【推荐】`使用 `class` 语法。避免直接操作 `prototype`。

> 为什么？`class` 语法更简洁更易理解。

```js
// bad
function Queue(contents = []) {
  this.queue = [...contents];
}
Queue.prototype.pop = function () {
  const value = this.queue[0];
  this.queue.splice(0, 1);
  return value;
};

// good
class Queue {
  constructor(contents = []) {
    this.queue = [...contents];
  }
  pop() {
    const value = this.queue[0];
    this.queue.splice(0, 1);
    return value;
  }
}
```

#### `【强制】` 用 `extends` 实现继承。

> 为什么？它是一种内置的方法来继承原型功能而不破坏 `instanceof`。

```js
// bad
const inherits = require('inherits');
function PeekableQueue(contents) {
  Queue.apply(this, contents);
}
inherits(PeekableQueue, Queue);
PeekableQueue.prototype.peek = function () {
  return this.queue[0];
}

// good
class PeekableQueue extends Queue {
  peek() {
    return this.queue[0];
  }
}
```

#### `【推荐】`方法可以返回 `this` 来实现链式调用。

```js
// bad
Jedi.prototype.jump = function () {
  this.jumping = true;
  return true;
};

Jedi.prototype.setHeight = function (height) {
  this.height = height;
};

const luke = new Jedi();
luke.jump(); // => true
luke.setHeight(20); // => undefined

// good
class Jedi {
  jump() {
    this.jumping = true;
    return this;
  }

  setHeight(height) {
    this.height = height;
    return this;
  }
}

const luke = new Jedi();

luke.jump()
  .setHeight(20);
```

#### `【强制】` 自己写 `toString()` 方法是可以的，但需要保证它可以正常工作且没有副作用。

```js
class Jedi {
  constructor(options = {}) {
    this.name = options.name || 'no name';
  }

  getName() {
    return this.name;
  }

  toString() {
    return `Jedi - ${this.getName()}`;
  }
}
```

#### `【强制】` 如果没有特别定义，类有默认的构造方法。一个空的构造函数或只是代表父类的构造函数是不需要写的。 eslint: [`no-useless-constructor`](http://eslint.org/docs/rules/no-useless-constructor)

```js
// bad
class Jedi {
  constructor() {}

  getName() {
    return this.name;
  }
}

// bad
class Rey extends Jedi {
  // 这种构造函数是不需要写的
  constructor(...args) {
    super(...args);
  }
}

// good
class Rey extends Jedi {
  constructor(...args) {
    super(...args);
    this.name = 'Rey';
  }
}
```

#### `【强制】` 避免重复定义类成员。eslint: [`no-dupe-class-members`](http://eslint.org/docs/rules/no-dupe-class-members)

> 为什么？重复定义类成员只会使用最后一个被定义的 —— 重复本身也是一个 bug.

```js
// bad
class Foo {
  bar() { return 1; }
  bar() { return 2; }
}

// good
class Foo {
  bar() { return 1; }
}

// good
class Foo {
  bar() { return 2; }
}
```

#### `【推荐】`除非外部库或框架需要使用特定的非静态方法，否则类方法应该使用 `this` 或被写成静态方法。 作为一个实例方法表明它应该根据实例的属性有不同的行为。eslint: [`class-methods-use-this`](https://eslint.org/docs/rules/class-methods-use-this)

```js
// bad
class Foo {
  bar() {
    console.log('bar');
  }
}

// good - this 被使用了
class Foo {
  bar() {
    console.log(this.bar);
  }
}

// good - constructor 不一定要使用 this
class Foo {
  constructor() {
    // ...
  }
}

// good - 静态方法不需要使用 this
class Foo {
  static bar() {
    console.log('bar');
  }
}
```

### 模块

#### `【推荐】`使用（`import`/`export`）模块而不是非标准的模块系统。你可以随时转到你喜欢的模块系统。

> 为什么？模块化是未来，让我们现在就开启未来吧。

```js
// bad
const AirbnbStyleGuide = require('./AirbnbStyleGuide');
module.exports = AirbnbStyleGuide.es6;

// ok
import AirbnbStyleGuide from './AirbnbStyleGuide';
export default AirbnbStyleGuide.es6;

// best
import { es6 } from './AirbnbStyleGuide';
export default es6;
```

#### `【推荐】`不要用 `import` 通配符， 即 `*` 这种方式。

> 为什么？这确保你有单个默认的导出。

```js
// bad
import * as AirbnbStyleGuide from './AirbnbStyleGuide';

// good
import AirbnbStyleGuide from './AirbnbStyleGuide';
```

#### `【推荐】`不要直接从 `import` 中直接 `export`。

> 为什么？虽然只写一行很简洁，但是使用明确 `import` 和明确的 `export` 来保证一致性。

```js
// bad
// filename es6.js
export { es6 as default } from './AirbnbStyleGuide';

// good
// filename es6.js
import { es6 } from './AirbnbStyleGuide';
export default es6;
```

#### `【强制】` 一个路径只 `import` 一次。eslint: [`no-duplicate-imports`](http://eslint.org/docs/rules/no-duplicate-imports)

> 为什么？多行导入同一路径将使代码变得难以维护。

```js
// bad
import foo from 'foo';
// … 其他导入 … //
import { named1, named2 } from 'foo';

// good
import foo, { named1, named2 } from 'foo';

// good
import foo, {
  named1,
  named2,
} from 'foo';
```

#### `【强制】` 不要导出可变的东西。eslint: [`import/no-mutable-exports`](https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-mutable-exports.md)

> 为什么？变化通常都是需要避免，特别是当你要输出可变的绑定。虽然在某些场景下可能需要这种技术，但总的来说应该导出常量。

```js
// bad
let foo = 3;
export { foo }

// good
const foo = 3;
export { foo }
```

#### `【推荐】`在一个单一导出模块里，用 `export default` 更好。eslint: [`import/prefer-default-export`](https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/prefer-default-export.md)

> 为什么？鼓励使用更多文件，每个文件只导出一次，这样可读性和可维护性更好。

```js
// bad
export function foo() {}

// good
export default function foo() {}
```

#### `【强制】` 把 `import` 放在其他所有语句之前。eslint: [`import/first`](https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/first.md)

> 为什么？因为 `import` 会被提升到代码最前面运行，因此将他们放在最前面以防止发生意外行为。

```js
// bad
import foo from 'foo';
foo.init();

import bar from 'bar';

// good
import foo from 'foo';
import bar from 'bar';

foo.init();
```

#### `【强制】` 多行 `import` 应该缩进，就像多行数组和对象字面量一样。

> 为什么？花括号与样式指南中每个其他花括号块遵循相同的缩进规则，逗号也是。

```js
// bad
import {longNameA, longNameB, longNameC, longNameD, longNameE} from 'path';

// good
import {
  longNameA,
  longNameB,
  longNameC,
  longNameD,
  longNameE,
} from 'path';
```

#### `【强制】` 在 `import` 语句里不允许 Webpack loader 语法。eslint: [`import/no-webpack-loader-syntax`](https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-webpack-loader-syntax.md)

> 为什么？一旦用 Webpack 语法在 import 里会把代码耦合到模块绑定器。最好是在 `webpack.config.js` 里写 webpack loader 语法

```js
// bad
import fooSass from 'css!sass!foo.scss';
import barCss from 'style!css!bar.css';

// good
import fooSass from 'foo.scss';
import barCss from 'bar.css';
```

### 迭代器与生成器

#### `【强制】` 不要用迭代器。使用 JavaScript 高级函数代替 `for-in`、 `for-of`。eslint: [`no-iterator` ](http://eslint.org/docs/rules/no-iterator.html)[`no-restricted-syntax`](http://eslint.org/docs/rules/no-restricted-syntax)

> 为什么？这强调了我们不可变的规则。 处理返回值的纯函数比处理副作用更容易。

> 用数组的这些迭代方法： `map()` / `every()` / `filter()` / `find()` / `findIndex()` / `reduce()` / `some()` / ... , 用对象的这些方法 `Object.keys()` / `Object.values()` / `Object.entries()` 去产生一个数组，这样你就能去遍历对象了。

```js
const numbers = [1, 2, 3, 4, 5];

// bad
let sum = 0;
for (let num of numbers) {
  sum += num;
}
sum === 15;

// good
let sum = 0;
numbers.forEach(num => sum += num);
sum === 15;

// best (use the functional force)
const sum = numbers.reduce((total, num) => total + num, 0);
sum === 15;

// bad
const increasedByOne = [];
for (let i = 0; i < numbers.length; i++) {
  increasedByOne.push(numbers[i] + 1);
}

// good
const increasedByOne = [];
numbers.forEach(num => increasedByOne.push(num + 1));

// best (keeping it functional)
const increasedByOne = numbers.map(num => num + 1);
```

#### `【强制】` 现在暂时不要使用生成器。

> 为什么？生成器目前不能很好地转换为 ES5 语法。

#### `【强制】` 如果你一定要用生成器，或者你忽略我们的建议，请确保它们的函数标志空格是得当的。eslint: [`generator-star-spacing`](http://eslint.org/docs/rules/generator-star-spacing)

> 为什么？`function` 和 `*` 是同一概念关键字 - `*`不是`function`的修饰符，`function*` 是一个和`function` 不一样的独特结构。

```js
// bad
function * foo() {
  // ...
}

// bad
const bar = function * () {
  // ...
}

// bad
const baz = function *() {
  // ...
}

// bad
const quux = function*() {
  // ...
}

// bad
function*foo() {
  // ...
}

// bad
function *foo() {
  // ...
}

// very bad
function
*
foo() {
  // ...
}

// very bad
const wat = function
*
() {
  // ...
}

// good
function* foo() {
  // ...
}

// good
const foo = function* () {
  // ...
}
```

### 属性

#### `【强制】` 访问属性时使用点符号。eslint: [`dot-notation`](http://eslint.org/docs/rules/dot-notation.html)

```js
const luke = {
  jedi: true,
  age: 28,
};

// bad
const isJedi = luke['jedi'];

// good
const isJedi = luke.jedi;
```

#### `【强制】` 当使用变量获取属性时用方括号 `[]`。

```js
const luke = {
  jedi: true,
  age: 28,
};

function getProp(prop) {
  return luke[prop];
}

const isJedi = getProp('jedi');
```

#### `【强制】` 做幂运算时用幂操作符 `**` 。eslint: [`no-restricted-properties` ](https://eslint.org/docs/rules/no-restricted-properties).

```js
// bad
const binary = Math.pow(2, 10);

// good
const binary = 2 ** 10;
```

### 变量

#### `【强制】` 使用 `const` 或 `let` 声明变量。不这样做会导致全局变量。我们想要避免污染全局命名空间。地球超人也这样警告我们（译者注：可能是一个冷笑话）。 eslint: [`no-undef` ](http://eslint.org/docs/rules/no-undef)[`prefer-const`](http://eslint.org/docs/rules/prefer-const)

```js
// bad
superPower = new SuperPower();

// good
const superPower = new SuperPower();
```

#### `【推荐】`为每个变量声明都用一个 `const` 或 `let`。eslint: [`one-var`](http://eslint.org/docs/rules/one-var.html)

> 为什么？这种方式很容易去声明新的变量，你不用去考虑把 `;` 调换成 `,`，或者引入一个只有标点的不同的变化（译者注：这里说的应该是在 Git 提交代码时显示的变化）。这种做法也可以是你在调试的时候单步每个声明语句，而不是一下跳过所有声明。

```js
// bad
const items = getItems(),
    goSportsTeam = true,
    dragonball = 'z';

// bad
// （与前面的比较，找一找错误）
const items = getItems(),
    goSportsTeam = true;
    dragonball = 'z';

// good
const items = getItems();
const goSportsTeam = true;
const dragonball = 'z';
```

#### `【推荐】`把`const` 和 `let` 分别放一起。

> 为什么？在你需要分配一个新的变量，而这个变量依赖之前分配过的变量的时候，这种做法是有帮助的。

```js
// bad
let i, len, dragonball,
    items = getItems(),
    goSportsTeam = true;

// bad
let i;
const items = getItems();
let dragonball;
const goSportsTeam = true;
let len;

// good
const goSportsTeam = true;
const items = getItems();
let dragonball;
let i;
let length;
```

#### `【强制】` 在你需要的地方声明变量，但是要放在合理的位置。

> 为什么？`let` 和 `const` 都是块级作用域而不是函数级作用域。

```js
// bad - 不必要的函数调用。
function checkName(hasName) {
  const name = getName();

  if (hasName === 'test') {
    return false;
  }

  if (name === 'test') {
    this.setName('');
    return false;
  }

  return name;
}

// good
function checkName(hasName) {
  if (hasName === 'test') {
    return false;
  }

  // 在需要的时候分配
  const name = getName();

  if (name === 'test') {
    this.setName('');
    return false;
  }

  return name;
}
```

#### `【强制】` 不要使用链式声明变量。 eslint: [`no-multi-assign`](https://eslint.org/docs/rules/no-multi-assign)

> 为什么？链式声明变量会创建隐式全局变量。

```js
// bad
(function example() {
  // JavaScript 将这一段解释为
  // let a = ( b = ( c = 1 ) );
  // let 只对变量 a 起作用; 变量 b 和 c 都变成了全局变量
  let a = b = c = 1;
}());

console.log(a); // undefined
console.log(b); // 1
console.log(c); // 1

// good
(function example() {
  let a = 1;
  let b = a;
  let c = a;
}());

console.log(a); // undefined
console.log(b); // undefined
console.log(c); // undefined

// `const` 也是如此
```

#### `【强制】` 不要使用一元自增自减运算符（`++`， `--`）. eslint [`no-plusplus`](http://eslint.org/docs/rules/no-plusplus)

> 为什么？根据 eslint 文档，一元增量和减量语句受到自动分号插入的影响，并且可能会导致应用程序中的值递增或递减的静默错误。 使用 `num + = 1` 而不是 `num ++` 。 禁止一元增量和减量语句还会阻止您无意地预增/预减值，这也会导致程序出现意外行为。

```js
  // bad

  const array = [1, 2, 3];
  let num = 1;
  num++;
  --num;

  let sum = 0;
  let truthyCount = 0;
  for (let i = 0; i < array.length; i++) {
    let value = array[i];
    sum += value;
    if (value) {
      truthyCount++;
    }
  }

  // good

  const array = [1, 2, 3];
  let num = 1;
  num += 1;
  num -= 1;

  const sum = array.reduce((a, b) => a + b, 0);
  const truthyCount = array.filter(Boolean).length;
```

#### `【推荐】`在赋值的时候避免在 `=` 前/后换行。 如果你的赋值语句超出 [`max-len` ](https://eslint.org/docs/rules/max-len.html)，那就用小括号把这个值包起来再换行。eslint [`operator-linebreak` ](https://eslint.org/docs/rules/operator-linebreak.html).

> 为什么？在 `=` 附近换行容易混淆这个赋值语句。

```js
// bad
const foo =
  superLongLongLongLongLongLongLongLongFunctionName();

// bad
const foo
  = 'superLongLongLongLongLongLongLongLongString';

// good
const foo = (
  superLongLongLongLongLongLongLongLongFunctionName()
);

// good
const foo = 'superLongLongLongLongLongLongLongLongString';
```

#### `【强制】` 不允许有未使用的变量。eslint: [`no-unused-vars`](https://eslint.org/docs/rules/no-unused-vars)

> 为什么？一个声明了但未使用的变量更像是由于重构未完成产生的错误。这种在代码中出现的变量会使阅读者迷惑。

```js
// bad

var some_unused_var = 42;

// 写了没用
var y = 10;
y = 5;

// 变量改了自己的值，也没有用这个变量
var z = 0;
z = z + 1;

// 参数定义了但未使用
function getX(x, y) {
    return x;
}

// good
function getXPlusY(x, y) {
  return x + y;
}

var x = 1;
var y = a + 2;

alert(getXPlusY(x, y));

// 'type' 即使没有使用也可以可以被忽略， 因为这个有一个 rest 取值的属性。
// 这是从对象中抽取一个忽略特殊字段的对象的一种形式
var { type, ...coords } = data;
// 'coords' 现在就是一个没有 'type' 属性的 'data' 对象
```

### 提升

#### `var` 声明会被提前到离他最近的作用域的最前面，但是它的赋值语句并没有提前。`const` 和 `let` 被赋予了新的概念 [暂时性死区 ](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let#Temporal_dead_zone_and_errors_with_let)。 重要的是要知道为什么 [typeof 不再安全 ](http://es-discourse.com/t/why-typeof-is-no-longer-safe/15).

```js
// 我们知道这个不会工作，假设没有定义全局的 notDefined
function example() {
  console.log(notDefined); // => throws a ReferenceError
}

// 在你引用的地方之后声明一个变量，他会正常输出是因为变量提升。
// 注意： declaredButNotAssigned 的值 true 没有被提升。
function example() {
  console.log(declaredButNotAssigned); // => undefined
  var declaredButNotAssigned = true;
}

// 解释器把变量声明提升到作用域最前面，
// 可以重写成如下例子， 二者意义相同。
function example() {
  let declaredButNotAssigned;
  console.log(declaredButNotAssigned); // => undefined
  declaredButNotAssigned = true;
}

// 用 const，let就不一样了。
function example() {
  console.log(declaredButNotAssigned); // => throws a ReferenceError
  console.log(typeof declaredButNotAssigned); // => throws a ReferenceError
  const declaredButNotAssigned = true;
}
```

#### `【强制】` 匿名函数表达式和 `var` 情况相同。

```js
function example() {
  console.log(anonymous); // => undefined

  anonymous(); // => TypeError anonymous is not a function

  // 译者注，不管后面是函数、数字还是字符串，都是一样的，总结就是实际代码中最好不要用 var。
  var anonymous = function () {
    console.log('anonymous function expression');
  };
}
```

#### 已命名函数表达式提升他的变量名，不是函数名或函数体。

```js
function example() {
  console.log(named); // => undefined

  named(); // => TypeError named is not a function

  superPower(); // => ReferenceError superPower is not defined

  var named = function superPower() {
    console.log('Flying');
  };
}

// 函数名和变量名一样是也如此。
function example() {
  console.log(named); // => undefined

  named(); // => TypeError named is not a function

  var named = function named() {
    console.log('named');
  };
}
```

#### 函数声明则提升了函数名和函数体。

```js
function example() {
  superPower(); // => Flying

  function superPower() {
    console.log('Flying');
  }
}
```

详情请见 [JavaScript Scoping & Hoisting ](http://www.adequatelygood.com/2010/2/JavaScript-Scoping-and-Hoisting/)by [Ben Cherry](http://www.adequatelygood.com/).

### 比较运算符与相等

#### `【强制】` 用 `===` 和 `!==` 而不是 `==` 和 `!=`. eslint: [`eqeqeq`](http://eslint.org/docs/rules/eqeqeq.html)

#### `【强制】` 条件语句如 `if` 语句使用强制 `ToBoolean` 抽象方法来计算它们的表达式，并且始终遵循以下简单规则：

- **Objects** 计算成 **true**

- **Undefined** 计算成 **false**

- **Null** 计算成 **false**

- **Booleans** 计算成 **the value of the boolean**

- **Numbers**

  - **+0, -0, or NaN** 计算成 **false**
  - 其他 **true**

- **Strings**

  - `''` 计算成 **false**
  - 其他 **true**

```js
if ([0] && []) {
  // true
  // 数组（即使是空数组）是对象，对象会计算成 true
}
```

#### `【推荐】`布尔值要用缩写，而字符串和数字要明确使用比较操作符。

```js
// bad
if (isValid === true) {
  // ...
}

// good
if (isValid) {
  // ...
}

// bad
if (name) {
  // ...
}

// good
if (name !== '') {
  // ...
}

// bad
if (collection.length) {
  // ...
}

// good
if (collection.length > 0) {
  // ...
}
```

更多信息请见 Angus Croll 的 [Truth Equality and JavaScript](https://javascriptweblog.wordpress.com/2011/02/07/truth-equality-and-javascript/#more-2108)。

#### `【推荐】`在 `case` 和 `default` 分句里用大括号创建一块包含词法声明的区域（例如：`let`、`const`、`function` 和 `class`）。eslint rules: [`no-case-declarations`](http://eslint.org/docs/rules/no-case-declarations.html).

> 为什么？词法声明在整个 `switch` 的代码块里都可见，但是只有当其被分配后才会初始化，仅当这个 `case` 被执行时才被初始化。当多个 `case` 分句试图定义同一个对象时就会出现问题。

```js
// bad
switch (foo) {
  case 1:
    let x = 1;
    break;
  case 2:
    const y = 2;
    break;
  case 3:
    function f() {
      // ...
    }
    break;
  default:
    class C {}
}

// good
switch (foo) {
  case 1: {
    let x = 1;
    break;
  }
  case 2: {
    const y = 2;
    break;
  }
  case 3: {
    function f() {
      // ...
    }
    break;
  }
  case 4:
    bar();
    break;
  default: {
    class C {}
  }
}
```

#### `【强制】` 三元表达式不应该嵌套，通常是单行表达式。eslint rules: [`no-nested-ternary`](http://eslint.org/docs/rules/no-nested-ternary.html)

```js
// bad
const foo = maybe1 > maybe2
  ? "bar"
  : value1 > value2 ? "baz" : null;

// better
const maybeNull = value1 > value2 ? 'baz' : null;

const foo = maybe1 > maybe2
? 'bar'
  : maybeNull;

// best
const maybeNull = value1 > value2 ? 'baz' : null;

const foo = maybe1 > maybe2 ? 'bar' : maybeNull;
```

#### `【强制】` 避免不必要的三元表达式。eslint rules: [`no-unneeded-ternary`](http://eslint.org/docs/rules/no-unneeded-ternary.html)

```js
// bad
const foo = a ? a : b;
const bar = c ? true : false;
const baz = c ? false : true;

// good
const foo = a || b;
const bar = !!c;
const baz = !c;
```

#### `【强制】` 用圆括号来组合操作符。 只有当标准的算术运算符（`+`, `-`, `*`, 和 `/`）， 并且它们的优先级显而易见时，才可以不用圆括号括起来。eslint: [`no-mixed-operators`](https://eslint.org/docs/rules/no-mixed-operators.html)

> 为什么？这提高了可读性，并且明确了开发者的意图。

```js
// bad
const foo = a && b < 0 || c > 0 || d + 1 === 0;

// bad
const bar = a ** b - 5 % d;

// bad
// 别人会陷入(a || b) && c 的迷惑中
if (a || b && c) {
  return d;
}

// good
const foo = (a && b < 0) || c > 0 || (d + 1 === 0);

// good
const bar = (a ** b) - (5 % d);

// good
if (a || (b && c)) {
  return d;
}

// good
const bar = a + b / c * d;
```

### 块

#### `【强制】` 用大括号包裹多行代码块。 eslint: [`nonblock-statement-body-position`](https://eslint.org/docs/rules/nonblock-statement-body-position)

```js
// bad
if (test)
  return false;

// good
if (test) return false;

// good
if (test) {
  return false;
}

// bad
function foo() { return false; }

// good
function bar() {
  return false;
}
```

#### `【强制】` `if` 表达式的 `else`和 `if` 的右大括号在一行。eslint: [`brace-style`](http://eslint.org/docs/rules/brace-style.html)

```js
// bad
if (test) {
  thing1();
  thing2();
}
else {
  thing3();
}

// good
if (test) {
  thing1();
  thing2();
} else {
  thing3();
}
```

#### `【强制】` 如果 `if` 语句中总是需要用 `return` 返回，那后续的 `else` 就不需要写了。 `if` 块中包含 `return`， 它后面的 `else if` 块中也包含了 `return`， 这个时候就可以把 `return` 分到多个 `if` 语句块中。 eslint: [`no-else-return`](https://eslint.org/docs/rules/no-else-return)

```js
// bad
function foo() {
  if (x) {
    return x;
  } else {
    return y;
  }
}

// bad
function cats() {
  if (x) {
    return x;
  } else if (y) {
    return y;
  }
}

// bad
function dogs() {
  if (x) {
    return x;
  } else {
    if (y) {
      return y;
    }
  }
}

// good
function foo() {
  if (x) {
    return x;
  }
  return y;
}

// good
function cats() {
  if (x) {
    return x;
  }

  if (y) {
    return y;
  }
}

// good
function dogs(x) {
  if (x) {
    if (z) {
      return y;
    }
  } else {
    return z;
  }
}
```

### 控制语句

当你的控制语句（`if`, `while` 等）太长或者超过最大长度限制的时候，把每一个（组）判断条件放在单独一行里。逻辑操作符放在行首。

> 为什么？把逻辑操作符放在行首是让操作符的对齐方式和链式函数保持一致。这提高了可读性，也让复杂逻辑更清晰。

```js
// bad
if ((foo === 123 || bar === 'abc') && doesItLookGoodWhenItBecomesThatLong() && isThisReallyHappening()) {
  thing1();
}

// bad
if (foo === 123 &&
  bar === 'abc') {
  thing1();
}

// bad
if (foo === 123
  && bar === 'abc') {
  thing1();
}

// bad
if (
  foo === 123 &&
  bar === 'abc'
) {
  thing1();
}

// good
if (
  foo === 123
  && bar === 'abc'
) {
  thing1();
}

// good
if (
  (foo === 123 || bar === 'abc')
  && doesItLookGoodWhenItBecomesThatLong()
  && isThisReallyHappening()
) {
  thing1();
}

// good
if (foo === 123 && bar === 'abc') {
  thing1();
}
```

#### `【推荐】`不要用选择操作符代替控制语句。

```js
// bad
!isRunning && startRunning();

// good
if (!isRunning) {
  startRunning();
}
```

### 注释

#### `【强制】` 多行注释用 `/** ... */`。

```js
// bad
// make() returns a new element
// based on the passed in tag name
//
// @param {String} tag
// @return {Element} element
function make(tag) {

  // ...

  return element;
}

// good
/**
 * make() returns a new element
 * based on the passed-in tag name
 */
function make(tag) {

  // ...

  return element;
}
```

#### `【强制】` 单行注释用 `//`，将单行注释放在被注释区域上面。如果注释不是在第一行，那么注释前面就空一行。

```js
// bad
const active = true;  // is current tab

// good
// is current tab
const active = true;

// bad
function getType() {
  console.log('fetching type...');
  // set the default type to 'no type'
  const type = this._type || 'no type';

  return type;
}

// good
function getType() {
  console.log('fetching type...');

  // set the default type to 'no type'
  const type = this._type || 'no type';

  return type;
}

// also good
function getType() {
  // set the default type to 'no type'
  const type = this._type || 'no type';

  return type;
}
```

#### `【强制】` 所有注释开头空一格，方便阅读。eslint: [`spaced-comment`](http://eslint.org/docs/rules/spaced-comment)

```js
// bad
//is current tab
const active = true;

// good
// is current tab
const active = true;

// bad
/**
 *make() returns a new element
 *based on the passed-in tag name
 */
function make(tag) {

  // ...

  return element;
}

// good
/**
 * make() returns a new element
 * based on the passed-in tag name
 */
function make(tag) {

  // ...

  return element;
}
```

#### `【强制】` 在你的注释前使用 `FIXME` 或 `TODO` 前缀，这有助于其他开发人员快速理解你指出的需要修复的问题， 或者您建议需要实现的问题的解决方案。 这些不同于常规注释，它们是有明确含义的。`FIXME：需要修复这个问题`或`TODO：需要实现的功能`。

#### `【强制】` 用 `// FIXME:` 给问题做注释。

```js
class Calculator extends Abacus {
  constructor() {
    super();

    // FIXME: shouldn't use a global here
    total = 0;
  }
}
```

#### `【强制】` 用 `// TODO:` 去注释问题的解决方案。

```js
class Calculator extends Abacus {
  constructor() {
    super();

    // TODO: total should be configurable by an options param
    this.total = 0;
  }
}
```

### 空格

#### `【强制】` 一个缩进使用两个空格。eslint: [`indent`](http://eslint.org/docs/rules/indent.html)

```js
// bad
function foo() {
∙∙∙∙const name;
}

// bad
function bar() {
∙const name;
}

// good
function baz() {
∙∙const name;
}
```

#### `【推荐】`在大括号前空一格。eslint: [`space-before-blocks`](http://eslint.org/docs/rules/space-before-blocks.html)

```js
// bad
function test(){
  console.log('test');
}

// good
function test() {
  console.log('test');
}

// bad
dog.set('attr',{
  age: '1 year',
  breed: 'Bernese Mountain Dog',
});

// good
dog.set('attr', {
  age: '1 year',
  breed: 'Bernese Mountain Dog',
});
```

#### `【推荐】`在控制语句（`if`, `while` 等）的圆括号前空一格。在函数调用和定义时，参数列表和函数名之间不空格。 eslint: [`keyword-spacing`](http://eslint.org/docs/rules/keyword-spacing.html)

```js
// bad
if(isJedi) {
  fight ();
}

// good
if (isJedi) {
  fight();
}

// bad
function fight () {
  console.log ('Swooosh!');
}

// good
function fight() {
  console.log('Swooosh!');
}
```

#### `【推荐】`用空格来隔开运算符。eslint: [`space-infix-ops`](http://eslint.org/docs/rules/space-infix-ops.html)

```js
// bad
const x=y+5;

// good
const x = y + 5;
```

#### `【推荐】`文件结尾空一行。eslint: [`eol-last`](https://github.com/eslint/eslint/blob/master/docs/rules/eol-last.md)

```js
// bad
import { es6 } from './AirbnbStyleGuide';
  // ...
export default es6;
```

```js
// bad
import { es6 } from './AirbnbStyleGuide';
  // ...
export default es6;
```

```js
// good
import { es6 } from './AirbnbStyleGuide';
  // ...
export default es6;
```

#### `【强制】` 当出现长的方法链式调用时（>2个）用缩进。用点开头强调该行是一个方法调用，而不是一个新的语句。eslint: [`newline-per-chained-call`](http://eslint.org/docs/rules/newline-per-chained-call)[`no-whitespace-before-property`](http://eslint.org/docs/rules/no-whitespace-before-property)

```js
// bad
$('#items').find('.selected').highlight().end().find('.open').updateCount();

// bad
$('#items').
  find('.selected').
    highlight().
    end().
  find('.open').
    updateCount();

// good
$('#items')
  .find('.selected')
    .highlight()
    .end()
  .find('.open')
    .updateCount();

// bad
const leds = stage.selectAll('.led').data(data).enter().append('svg:svg').classed('led', true)
    .attr('width', (radius + margin) * 2).append('svg:g')
    .attr('transform', `translate(${radius + margin},${radius + margin})`)
    .call(tron.led);

// good
const leds = stage.selectAll('.led')
    .data(data)
  .enter().append('svg:svg')
    .classed('led', true)
    .attr('width', (radius + margin) * 2)
  .append('svg:g')
    .attr('transform', `translate(${radius + margin},${radius + margin})`)
    .call(tron.led);

// good
const leds = stage.selectAll('.led').data(data);
```

#### `【推荐】`在一个代码块后下一条语句前空一行。

```js
// bad
if (foo) {
  return bar;
}
return baz;

// good
if (foo) {
  return bar;
}

return baz;

// bad
const obj = {
  foo() {
  },
  bar() {
  },
};
return obj;

// good
const obj = {
  foo() {
  },

  bar() {
  },
};

return obj;

// bad
const arr = [
  function foo() {
  },
  function bar() {
  },
];
return arr;

// good
const arr = [
  function foo() {
  },

  function bar() {
  },
];

return arr;
```

#### `【强制】` 不要用空白行填充块。eslint: [`padded-blocks`](http://eslint.org/docs/rules/padded-blocks.html)

```js
// bad
function bar() {

  console.log(foo);

}

// also bad
if (baz) {

  console.log(qux);
} else {
  console.log(foo);

}

// good
function bar() {
  console.log(foo);
}

// good
if (baz) {
  console.log(qux);
} else {
  console.log(foo);
}
```

#### `【强制】` 不要在代码之间使用多个空白行填充。eslint: [`no-multiple-empty-lines`](https://eslint.org/docs/rules/no-multiple-empty-lines)

```js
// bad
class Person {
  constructor(fullName, email, birthday) {
    this.fullName = fullName;


    this.email = email;


    this.setAge(birthday);
  }


  setAge(birthday) {
    const today = new Date();


    const age = this.getAge(today, birthday);


    this.age = age;
  }


  getAge(today, birthday) {
  // ..
  }
}

// good
class Person {
  constructor(fullName, email, birthday) {
    this.fullName = fullName;
    this.email = email;
    this.setAge(birthday);
  }

  setAge(birthday) {
    const today = new Date();
    const age = getAge(today, birthday);
    this.age = age;
  }

  getAge(today, birthday) {
    // ..
  }
}
```

#### `【强制】` 圆括号里不要加空格。eslint: [`space-in-parens`](http://eslint.org/docs/rules/space-in-parens.html)

```js
// bad
function bar( foo ) {
  return foo;
}

// good
function bar(foo) {
  return foo;
}

// bad
if ( foo ) {
  console.log(foo);
}

// good
if (foo) {
  console.log(foo);
}
```

#### `【强制】` 方括号里不要加空格。 eslint: [`array-bracket-spacing`](http://eslint.org/docs/rules/array-bracket-spacing.html)

```js
// bad
const foo = [ 1, 2, 3 ];
console.log(foo[ 0 ]);

// good，逗号分隔符后还是要空格的。
const foo = [1, 2, 3];
console.log(foo[0]);
```

#### `【强制】` 花括号里加空格 。eslint: [`object-curly-spacing`](http://eslint.org/docs/rules/object-curly-spacing.html)

```js
// bad
const foo = {clark: 'kent'};

// good
const foo = { clark: 'kent' };
```

#### `【强制】` 避免一行代码超过100个字符（包含空格）。注意：对于 [上面](http://fe.dev.kdshc.com/docs.html#strings--line-length)，长字符串不受此规则限制，不应换行。 eslint: [`max-len`](http://eslint.org/docs/rules/max-len.html)

> 为什么？这样确保可读性和可维护性。

```js
// bad
const foo = jsonData && jsonData.foo && jsonData.foo.bar && jsonData.foo.bar.baz && jsonData.foo.bar.baz.quux && jsonData.foo.bar.baz.quux.xyzzy;

// bad
$.ajax({ method: 'POST', url: 'https://airbnb.com/', data: { name: 'John' } }).done(() => console.log('Congratulations!')).fail(() => console.log('You have failed this city.'));

// good
const foo = jsonData
  && jsonData.foo
  && jsonData.foo.bar
  && jsonData.foo.bar.baz
  && jsonData.foo.bar.baz.quux
  && jsonData.foo.bar.baz.quux.xyzzy;

// good
$.ajax({
  method: 'POST',
  url: 'https://airbnb.com/',
  data: { name: 'John' },
})
  .done(() => console.log('Congratulations!'))
  .fail(() => console.log('You have failed this city.'));
```

#### `【强制】` 作为语句的花括号内也要加空格 —— `{` 后和 `}` 前都需要空格。 eslint: [`block-spacing`](https://eslint.org/docs/rules/block-spacing)

```js
// bad
function foo() {return true;}
if (foo) { bar = 0;}

// good
function foo() { return true; }
if (foo) { bar = 0; }
```

#### `【强制】` `,` 前不要空格， `,` 后需要空格。 eslint: [`comma-spacing`](https://eslint.org/docs/rules/comma-spacing)

```js
// bad
var foo = 1,bar = 2;
var arr = [1 , 2];

// good
var foo = 1, bar = 2;
var arr = [1, 2];
```

#### `【强制】` 计算属性内要空格。参考上述花括号和中括号的规则。 eslint: [`computed-property-spacing`](https://eslint.org/docs/rules/computed-property-spacing)

```js
// bad
obj[foo ]
obj[ 'foo']
var x = {[ b ]: a}
obj[foo[ bar ]]

// good
obj[foo]
obj['foo']
var x = { [b]: a }
obj[foo[bar]]
```

#### `【强制】` 调用函数时，函数名和小括号之间不要空格。 eslint: [`func-call-spacing`](https://eslint.org/docs/rules/func-call-spacing)

```js
// bad
func ();

func
();

// good
func();
```

#### `【推荐】`在对象的字面量属性中， `key` 和 `value` 之间要有空格。 eslint: [`key-spacing`](https://eslint.org/docs/rules/key-spacing)

```js
// bad
var obj = { "foo" : 42 };
var obj2 = { "foo":42 };

// good
var obj = { "foo": 42 };
```

#### `【强制】` 行末不要空格。 eslint: [`no-trailing-spaces`](https://eslint.org/docs/rules/no-trailing-spaces)

#### `【强制】` 避免出现多个空行。 在文件末尾只允许空一行。避免在文件开始处出现空行。eslint: [`no-multiple-empty-lines`](https://eslint.org/docs/rules/no-multiple-empty-lines)

```js
// bad - multiple empty lines
var x = 1;


var y = 2;

// bad - 2+ newlines at end of file
var x = 1;
var y = 2;


// bad - 1+ newline(s) at beginning of file

var x = 1;
var y = 2;

// good
var x = 1;
var y = 2;
```

### 逗号

#### `【强制】` 不要前置逗号。eslint: [`comma-style`](http://eslint.org/docs/rules/comma-style.html)

```js
// bad
const story = [
    once
  , upon
  , aTime
];

// good
const story = [
  once,
  upon,
  aTime,
];

// bad
const hero = {
    firstName: 'Ada'
  , lastName: 'Lovelace'
  , birthYear: 1815
  , superPower: 'computers'
};

// good
const hero = {
  firstName: 'Ada',
  lastName: 'Lovelace',
  birthYear: 1815,
  superPower: 'computers',
};
```

#### `【强制】` 额外结尾逗号: **要** eslint: [`comma-dangle`](http://eslint.org/docs/rules/comma-dangle.html)

> 为什么？这使 git diffs 更简洁。此外，像Babel这样的转换器会删除转换代码中的额外的逗号，这意味着你不必担心旧版浏览器中的 [结尾逗号问题 ](https://github.com/airbnb/javascript/blob/es5-deprecated/es5/README.md#commas)。

```
// bad - 没有结尾逗号的 git diff
const hero = {
     firstName: 'Florence',
-    lastName: 'Nightingale'
+    lastName: 'Nightingale',
+    inventorOf: ['coxcomb chart', 'modern nursing']
};

// good - 有结尾逗号的 git diff
const hero = {
     firstName: 'Florence',
     lastName: 'Nightingale',
+    inventorOf: ['coxcomb chart', 'modern nursing'],
};
```

```js
// bad
const hero = {
  firstName: 'Dana',
  lastName: 'Scully'
};

const heroes = [
  'Batman',
  'Superman'
];

// good
const hero = {
  firstName: 'Dana',
  lastName: 'Scully',
};

const heroes = [
  'Batman',
  'Superman',
];

// bad
function createHero(
  firstName,
  lastName,
  inventorOf
) {
  // does nothing
}

// good
function createHero(
  firstName,
  lastName,
  inventorOf,
) {
  // does nothing
}

// good (注意，逗号不应出现在使用了 ... 操作符后的参数后面)
function createHero(
  firstName,
  lastName,
  inventorOf,
  ...heroArgs
) {
  // does nothing
}

// bad
createHero(
  firstName,
  lastName,
  inventorOf
);

// good
createHero(
  firstName,
  lastName,
  inventorOf,
);

// good  (注意，逗号不应出现在使用了 ... 操作符后的参数后面)
createHero(
  firstName,
  lastName,
  inventorOf,
  ...heroArgs
)
```

### 类型转换与强制转换

#### `【强制】` 在语句开始执行强制类型转换。

#### `【强制】` 字符串: eslint: [`no-new-wrappers`](https://eslint.org/docs/rules/no-new-wrappers)

```js
// => this.reviewScore = 9;

// bad
const totalScore = new String(this.reviewScore); // typeof totalScore is "object" not "string"

// bad
const totalScore = this.reviewScore + ''; // 将会执行 this.reviewScore.valueOf()

// bad
const totalScore = this.reviewScore.toString(); // 不保证返回 string

// good
const totalScore = String(this.reviewScore);
```

#### `【强制】` 数字: 用 `Number` 做类型转换，`parseInt` 转换 `string` 应总是带上基数。 eslint: [`radix`](http://eslint.org/docs/rules/radix)

> 为什么？函数 `parseInt` 会根据指定的基数将字符串转换为数字。字符串开头的空白字符将会被忽略，如果参数基数（第二个参数）为 `undefined` 或者 `0` ，除非字符串开头为 `0x` 或 `0X`（十六进制），会默认假设为 `10`。这个差异来自 ECMAScript 3，它不鼓励（但是允许）解释八进制。在 2013 年之前，一些实现不兼容这种行为。因为我们需要支持旧浏览器，所以应当始终指定进制。

```js
const inputValue = '4';

// bad
const val = new Number(inputValue);

// bad
const val = +inputValue;

// bad
const val = inputValue >> 0;

// bad
const val = parseInt(inputValue);

// good
const val = Number(inputValue);

// good
const val = parseInt(inputValue, 10);
```

#### `【强制】` 请在注释中解释为什么要用移位运算和你在做什么。无论你做什么狂野的事，比如由于 `parseInt` 是你的性能瓶颈导致你一定要用移位运算。说明这个是因为 [性能原因 ](https://jsperf.com/coercion-vs-casting/3)。

```js
// good
/**
 * parseInt 是代码运行慢的原因
 * 用 Bitshifting 将字符串转成数字使代码运行效率大幅提升
 */
const val = inputValue >> 0;
```

#### `【强制】` **注意:** 用移位运算要小心。数字是用 [64-位 ](https://es5.github.io/#x4.3.19)表示的，但移位运算常常返回的是32为整形[source ](https://es5.github.io/#x11.7))。移位运算对大于 32 位的整数会导致意外行为。[Discussion ](https://github.com/airbnb/javascript/issues/109). 最大的 32 位整数是 2,147,483,647:

```js
2147483647 >> 0 //=> 2147483647
2147483648 >> 0 //=> -2147483648
2147483649 >> 0 //=> -2147483647
```

#### `【强制】` 布尔: eslint: [`no-new-wrappers`](https://eslint.org/docs/rules/no-new-wrappers)

```js
const age = 0;

// bad
const hasAge = new Boolean(age);

// good
const hasAge = Boolean(age);

// best
const hasAge = !!age;
```

### 命名规范

#### `【强制】` 避免用一个字母命名，让你的命名有意义。eslint: [`id-length`](http://eslint.org/docs/rules/id-length)

```js
// bad
function q() {
  // ...
}

// good
function query() {
  // ...
}
```

#### `【强制】` 用小驼峰命名法来命名你的对象、函数、实例。eslint: [`camelcase`](http://eslint.org/docs/rules/camelcase.html)

```js
// bad
const OBJEcttsssss = {};
const this_is_my_object = {};
function c() {}

// good
const thisIsMyObject = {};
function thisIsMyFunction() {}
```

#### `【强制】` 用大驼峰命名法来命名类。eslint: [`new-cap`](http://eslint.org/docs/rules/new-cap.html)

```js
// bad
function user(options) {
  this.name = options.name;
}

const bad = new user({
  name: 'nope',
});

// good
class User {
  constructor(options) {
    this.name = options.name;
  }
}

const good = new User({
  name: 'yup',
});
```

#### `【推荐】`不要用前置或后置下划线。eslint: [`no-underscore-dangle`](http://eslint.org/docs/rules/no-underscore-dangle.html)

> 为什么？JavaScript 没有私有属性或私有方法的概念。尽管前置下划线通常的概念上意味着私有，事实上，这些属性是完全公有的，因此这部分也是你的 API 的内容。这一概念可能会导致开发者误以为更改这个不会导致崩溃或者不需要测试。如果你想要什么东西变成私有，那就不要让它在这里出现。

```js
// bad
this.__firstName__ = 'Panda';
this.firstName_ = 'Panda';
this._firstName = 'Panda';

// good
this.firstName = 'Panda';
```

#### `【强制】` 不要保存引用 `this`，用箭头函数或 [函数绑定——Function#bind](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind)。

```js
// bad
function foo() {
  const self = this;
  return function () {
    console.log(self);
  };
}

// bad
function foo() {
  const that = this;
  return function () {
    console.log(that);
  };
}

// good
function foo() {
  return () => {
    console.log(this);
  };
}
```

#### `【强制】` `export default` 导出模块A，则这个文件名也叫 `A.*`， `import` 时候的参数也叫 `A`。 大小写完全一致。

```js
// file 1 contents
class CheckBox {
  // ...
}
export default CheckBox;

// file 2 contents
export default function fortyTwo() { return 42; }

// file 3 contents
export default function insideDirectory() {}

// in some other file
// bad
import CheckBox from './checkBox'; // PascalCase import/export, camelCase filename
import FortyTwo from './FortyTwo'; // PascalCase import/filename, camelCase export
import InsideDirectory from './InsideDirectory'; // PascalCase import/filename, camelCase export

// bad
import CheckBox from './check_box'; // PascalCase import/export, snake_case filename
import forty_two from './forty_two'; // snake_case import/filename, camelCase export
import inside_directory from './inside_directory'; // snake_case import, camelCase export
import index from './inside_directory/index'; // requiring the index file explicitly
import insideDirectory from './insideDirectory/index'; // requiring the index file explicitly

// good
import CheckBox from './CheckBox'; // PascalCase export/import/filename
import fortyTwo from './fortyTwo'; // camelCase export/import/filename
import insideDirectory from './insideDirectory'; // camelCase export/import/directory name/implicit "index"
// ^ supports both insideDirectory.js and insideDirectory/index.js
```

#### `【强制】`  当你 export-default 一个函数时，函数名用小驼峰，文件名需要和函数名一致。

```js
function makeStyleGuide() {
  // ...
}

export default makeStyleGuide;
```

#### `【推荐】`当你 export 一个结构体/类/单例/函数库/对象 时用大驼峰。

```js
const AirbnbStyleGuide = {
  es6: {
  }
};

export default AirbnbStyleGuide;
```

#### `【强制】` 简称和缩写应该全部大写或全部小写。

> 为什么？名字都是给人读的，不是为了去适应计算机算法。

```js
// bad
import SmsContainer from './containers/SmsContainer';

// bad
const HttpRequests = [
  // ...
];

// good
import SMSContainer from './containers/SMSContainer';

// good
const HTTPRequests = [
  // ...
];

// also good
const httpRequests = [
  // ...
];

// best
import TextMessageContainer from './containers/TextMessageContainer';

// best
const requests = [
  // ...
];
```

#### `【强制】` 你可以用全大写字母设置静态变量，他需要满足三个条件。

1. 导出变量；
2. 是 `const` 定义的， 保证不能被改变；
3. 这个变量是可信的，他的子属性都是不能被改变的。

> 为什么？这是一个附加工具，帮助开发者去辨识一个变量是不是不可变的。UPPERCASE_VARIABLES 能让开发者知道他能确信这个变量（以及他的属性）是不会变的。


- 对于所有的 `const` 变量呢？ —— 这个是不必要的。大写变量不应该在同一个文件里定义并使用， 它只能用来作为导出变量。

- 那导出的对象呢？ —— 大写变量处在 `export` 的最高级(例如：`EXPORTED_OBJECT.key`) 并且他包含的所有子属性都是不可变的。（译者注：即导出的变量是全大写的，但他的属性不用大写）

```js
// bad
const PRIVATE_VARIABLE = 'should not be unnecessarily uppercased within a file';

// bad
export const THING_TO_BE_CHANGED = 'should obviously not be uppercased';

// bad
export let REASSIGNABLE_VARIABLE = 'do not use let with uppercase variables';


// ---

// 允许但不够语义化
export const apiKey = 'SOMEKEY';

// 在大多数情况下更好
export const API_KEY = 'SOMEKEY';

// ---

// bad - 不必要的大写键，没有增加任何语义
export const MAPPING = {
  KEY: 'value'
};

// good
export const MAPPING = {
  key: 'value'
};
```

### Get-Set 访问器

#### `【强制】` 不需要使用属性的访问器函数。

#### `【强制】` 不要使用 JavaScript 的 getters/setters，因为他们会产生副作用，并且难以测试、维护和理解。相反的，你可以用 `getVal()` 和 `setVal('hello')` 去创造你自己的访问器函数。

```js
// bad
class Dragon {
  get age() {
    // ...
  }

  set age(value) {
    // ...
  }
}

// good
class Dragon {
  getAge() {
    // ...
  }

  setAge(value) {
    // ...
  }
}
```

#### `【推荐】`如果属性/方法是 `boolean`， 用 `isVal()` 或 `hasVal()`。

```js
// bad
if (!dragon.age()) {
  return false;
}

// good
if (!dragon.hasAge()) {
  return false;
}
```

#### `【推荐】`用 `get()` 和 `set()` 函数是可以的，但是要一起用。

```js
class Jedi {
  constructor(options = {}) {
    const lightsaber = options.lightsaber || 'blue';
    this.set('lightsaber', lightsaber);
  }

  set(key, val) {
    this[key] = val;
  }

  get(key) {
    return this[key];
  }
}
```

### 事件

#### `【强制】` 当传递数据载荷给事件时（不论是 DOM 还是像 Backbone 这样有很多属性的事件）。这使得后续的贡献者（程序员）向这个事件添加更多的数据时不用去找或者更新每个处理器。例如：

```js
// bad
$(this).trigger('listingUpdated', listing.id);

// ...

$(this).on('listingUpdated', (e, listingID) => {
  // do something with listingID
});


// good
$(this).trigger('listingUpdated', { listingID: listing.id });

// ...

$(this).on('listingUpdated', (e, data) => {
  // do something with data.listingID
});
```

### 标准库

[标准库](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects)中包含一些功能受损但是由于历史原因遗留的工具类

#### `【强制】` 用 `Number.isNaN` 代替全局的 `isNaN`。 eslint: [`no-restricted-globals`](https://eslint.org/docs/rules/no-restricted-globals)

> 为什么？全局 `isNaN` 强制把非数字转成数字， 然后对于任何强转后为 `NaN` 的变量都返回 `true` 如果你想用这个功能，就显式的用它。

```js
// bad
isNaN('1.2'); // false
isNaN('1.2.3'); // true

// good
Number.isNaN('1.2.3'); // false
Number.isNaN(Number('1.2.3')); // true
```

#### `【强制】` 用 `Number.isFinite` 代替 `isFinite`. eslint: [`no-restricted-globals`](https://eslint.org/docs/rules/no-restricted-globals)

> Why? 理由同上，会把一个非数字变量强转成数字，然后做判断。

```js
// bad
isFinite('2e3'); // true

// good
Number.isFinite('2e3'); // false
Number.isFinite(parseInt('2e3', 10)); // true
```

## CSS规范指南

*BEM的意思就是块（block）、元素（element）、修饰符（modifier）,是由Yandex团队提出的一种前端命名方法论。这种巧妙的命名方法让你的CSS类对其他开发者来说更加透明而且更有意义。BEM命名约定更加严格，而且包含更多的信息，它们用于一个团队开发一个耗时的大项目*

### 命名约定的模式

#### `【强制】` 命名约定的模式如下

```css
  .block {
     /*styles*/ 
  } 
  
  .block__element { 
    /* styles */ 
  
  }

  .block--modifier {
     /* styles */ 
  }
```

### 块

#### `【强制】` 一个块就是一个组件，如：

```html
  <form class="form">
      <!-- innerhtml -->
  </form>
```

对应的css

```css
  .form {
    display:block;
  } 
```

### 修饰符

#### `【强制】` 修饰符是改变某个块的外观的标志。要使用修饰符，可以将 --modifier 添加到块中。从上面的form示例继续命名

```html
  <form  class="form form--red">
      <!-- innerhtml -->
  </form>
```

对应的css

```css
  .form {
    display:block;
  } 

  .form--red{
    color:red;
  }
```


### 元素

#### `【强制】` 元素是块的子节点。为了表明某个东西是一个元素，你需要在块名后添加 __element。所以，如果你看到一个像那样的名字，比如 form__row ，你将立即知道 .form 块中有一个 row 元素。

> BEM 元素有两个优点：
>
> 1. 你可以让 CSS 的优先级保持相对扁平
> 2. 你能立即知道哪些东西是一个子元素。

```html
  <form  class="form form--red">
      <div class="form__row">form__row</div>
  </form>
```

对应的css

```css
  .form {
    display:block;
  } 

  .form--red{
    color:red;
  }

  .form__row{
    width:100%
  }
```

#### `【强制】` 永远不应该链式命名 BEM 元素。通过以下两种方式绕过长长的 BEM 链式命名：

:::danger
1. 只把子子元素链接到有意义的

2. 创建新的块来保存元素
:::

```html
  <!-- bad -->
  <form  class="form">
      <div class="form__row">
        <div class="form__row__input"></div>
      </div>
  </form>

  <!-- good 链接孙元素到块-->
  <form  class="form">
      <div class="form__row">
        <div class="form__input"></div>
      </div>
  </form>

  <!-- good 创建新的块来保存孙元素-->
  <form  class="form">
      <div class="row">
        <div class="row__input"></div>
      </div>
  </form>
```

```css
/*bad*/
.form__row__input {
  /* styles */ 
}

 /*good__链接孙元素到块*/
.form__row {
  /* styles */ 
}

/*good__链接孙元素到块*/
.form__input { 
  /* styles */ 
}

/*good__创建新的块来保存孙元素*/
.row {
  /* styles */ 
}

/*good__创建新的块来保存孙元素*/
.row__input {
  /* styles */ 
}
```
