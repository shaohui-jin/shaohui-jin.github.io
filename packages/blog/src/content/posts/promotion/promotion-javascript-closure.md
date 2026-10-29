---
title: 闭包以及内存泄漏原因
lang: zh-CN
date: 2024-03-11 14:58:43
permalink: /Promotion/JavaScript/Closure/
category:
  - JavaScript
tag:
  - JavaScript
---

## 全文概述

<!-- #region info -->
    
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

<!-- #endregion info -->

## 闭包定义应用场景

闭包是一种强大的编程工具，它可以用于许多不同的应用场景，包括数据封装、模块化编程、回调函数等。

### 保护私有变量

闭包允许你创建一个包含 **私有数据** 的函数，这些数据对外部是不可见的。这在模块化编程中非常有用，可以防止外部代码 **直接访问** 和 **修改内部状态**。

```js
function counter() {
  let count = 0;

  return function () {
    count++;
    console.log(count);
  };
}

const fn = counter();
fn(); // 输出 1
fn(); // 输出 2
```

### 实现数据封装

闭包可以用于创建类似于面向对象编程中的对象实例。你可以定义一个包含 **内部状态** 和 **方法** 的函数，然后通过闭包来访问和操作这些数据。这种方式被称为 "**模块模式**"：

```js
function createPerson(name) {
  let age = 0;

  return {
    getName: function () {
      return name;
    },
    getAge: function () {
      return age;
    },
    setBirthYear: function (year) {
      const nowYear = new Date().getFullYear()
      if (year <= nowYear) {
        age = nowYear - year;
      }
    }
  };
}

const person = createPerson("石怜安");
console.log(person.getName()); // 输出 "石怜安"
console.log(person.getAge()); // 输出 0
person.setBirthYear(1997);
console.log(person.getAge()); // 输出 27
```

### 实现回调函数

闭包经常用于创建回调函数，将函数作为参数传递给其他函数。这些回调函数可以 **访问外部函数的局部变量**，以便在异步操作完成后执行特定的逻辑。

```js
function fetchData(url, callback) {
  // 模拟异步请求
  setTimeout(function () {
    callback(url);
  }, 1000);
}

fetchData("url:xxxx", function (resp) {
  console.log("接收报文为 " + resp);
});
```

### 实现函数工厂

闭包可以用于创建 **定制的函数**，这些函数可以生成特定的行为或配置。这在某些库和框架中很常见。

```js
function createPowerFunction(number) {
  return function (x) {
    return x ** number;
  };
}

const square = createPowerFunction(2);
const cubic = createPowerFunction(3);

console.log(square(5)); // 输出 25
console.log(cubic(5)); // 输出 125
```

## 内存泄露

垃圾回收器会回收 **无法触达的内存空间**，它是我们 **不想要的内存空间** 的 **子集**。

::: vue-playground

@file App.vue

```vue
<!-- 1、创建 canvas 元素 -->
<template>
  <button id="closure_demo_1">测试</button>
</template>
<script>
export default {
  mounted() {
    let increase;
    const btn = document.getElementById('closure_demo_1')
    const handleClick = () => {
      increase = this.createIncrease()
      increase()
      // increase = null
      // btn.removeEventListener('click', handleClick)
    }
    btn.addEventListener('click', handleClick)
  },
  methods: {
    createIncrease() {
      const domList = new Array(100000).fill(0).map((_,i) => {
        const dom = document.createElement('div')
        dom.innerHTML = i
        return dom
      })
      function increase() {
        domList.forEach((dom) => {
          dom.innerHTML = Number(dom.innerHTML) + 1
        })
      }
      function _temp() {
        console.log(doms)
      }
      return increase
    }
  }
}
</script>
```
:::

首先，打开浏览器的控制台，进入 **存储Memory**，打印一下 **快照 ①**，可以看到并未点击按钮的时候，快照大小为 **27.3M**。

然后，点击事例的按钮，再去手动触发下 **垃圾回收 ②**，再次打印 **快照 ①**，可以看到快照大小为 **48.1M**。

最后，点击 **比较Comparison ③**，能清晰看到 **Detached HTMLDivElement** 存在 **10 0000个div** 是 **新增** 的且没有被 **垃圾回收掉**。

![](https://shaohui-jin.github.io/picx-images-hosting/blog/Closure/闭包导致内存泄露案例1-1.syq3ztbbp.webp "闭包导致内存泄露案例1-1" =800x)

接着，把事例代码中的 **increase = null** 注释取消掉，再次点击事例的按钮，第三次打印 **快照**，可以看到快照大小为 **27.1M**。

再次点击 **比较Comparison**，能清晰看到 **Detached HTMLDivElement** 存在 **10 0000个div** 是 **删除且被垃圾回收**。

![](https://shaohui-jin.github.io/picx-images-hosting/blog/Closure/闭包导致内存泄露案例1-2.3ye82xnq8m.webp "闭包导致内存泄露案例1-2" =800x)







