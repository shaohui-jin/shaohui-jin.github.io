---
title: 简而言之
lang: zh-CN
date: 2022-05-16 11:21:30
permalink: /DesignPattern/Info/
category: 
  - 设计模式
tag: 
  - 设计模式
---

### 设计模式是什么？

设计模式（Design pattern）代表了`最佳的实践`，通常被有经验的面向对象的软件开发人员所采用。

设计模式是软件开发人员在软件开发过程中面临的一般问题的解决方案。这些解决方案是众多软件开发人员经过相当长的一段时间的试验和错误总结出来的。

大白话就是，在`合适的场景`使用`合适的设计模式`：

- 代码比较稳定
- 代码比较高效
- 代码维护性强
- 代码比较规范

### 工厂模式

工厂模式通俗点说就是：`更方便地去创建实例`

大家开发中应该使用过 **axios.create()** 这个方法吧？这其实就是工厂模式的实践之一

简单分析一下 **axios.create()** 的原理（不一定跟源码一模一样）

**axios.create()** 每次返回的都是一个全新的实例~

```js
// 原理部分
class Axios {
  create() {
    return new Axios()
  }
}

const axios = new Axios()
export default axios

// 使用部分
import axios from 'axios'

// 创建很多实例
const httpRequest1 = axios.create()
const httpRequest2 = axios.create()
const httpRequest3 = axios.create()
const httpRequest4 = axios.create()
const httpRequest5 = axios.create()
```

> 这就是工厂模式~

### 单例模式

单例模式通俗点说就是：`定义一个类，生成一个实例，并且整个项目仅此这一个实例`

相信大家在项目中都封装使用过`Axios`吧

我们会先定义封装一个请求的实例然后暴露出去

```ts
// utils/request.ts

// 定义一个类
class HttpRequest {
  instance: AxiosInstance;
  constructor(options: CreateAxiosOptions) {
  this.instance = axios.create(options)
}

setHeader() {}
get() {}
post() {}
put() {}
delete() {}
}
// 生成一个实例
const request = new HttpRequest({})

// 全局仅用这么一个请求实例
export default request
```

然后在项目中各处去使用这一个请求实例

```ts
import request '@/utils/request'

const fetchData = (url) => {
  return request.get(url)
}
```

> 这就是单例模式~

### 策略模式

策略模式通俗点说就是：`根据不同的策略去做不同的事情`

比如我需要根据不同的年龄去做不同的处理

```ts
const doSomething = (age: number) => {
  if (age === 20) {
    // do something
  }
  if (age === 30) {
    // do something
  }
  if (age === 40) {
    // do something
  }
}
```

但其实这样做有很多坏处：

- 可读性一般（实际代码比这更复杂）
- 可维护性差，如果以后多一种**age**判断，又要修改这个**doSomething**函数，规范的话是`不建议`去过多修改函数本身的
- 可拓展性差，多一种age判断只能修改原函数体

所以我们可以这么做

```ts
// map存储，好拓展
const doMap: Record<number, Function> = {
  20: () => {
  },// do something 
  30: () => {
  },// do something 
  40: () => {
  },// do something 
}

const doSomething = (age: number) => {
  doMap[age]?.()
}
```

> 这就是策略模式模式~

### 适配器模式

适配器模式通俗点说就是：`将一种格式适配成你所需要的格式`

比如有一个场景：后端给你返回了三种数据格式，但是你需要把这三种格式转成你前端所需要的格式

```ts
// 格式1
const data1 = [{ age1: 20, name1: 'JSH' }]
// 格式2
const data2 = [{ age2: 20, name2: 'JSH' }]
// 格式3
const data3 = [{ age3: 20, name3: 'JSH' }]
```

这个时候你需要定义几个适配器类

```ts
class Adapter1 {
  data: { age1: number; name1: string }[]
  constructor(data) {
    this.data = data
  }
  transform() {
    return this.data.map(({ age1, name1 }) => ({
      age: age1,
      name: name1
    }))
  }
}

class Adapter2 {
// 同理
}

class Adapter3 {
// 同理
}
```

当你需要转换成你需要的数据时，调用这些类就行

```ts
const adapter1 = new Adapter1(data1)
// 适配成功
const data = adapter1.transform()
```

这就是适配器模式模式~

### 装饰器模式

装饰器模式通俗点说就是：`定义一个类，在不改这个类的前提下，给这个类拓展功能`

```ts
class Man {
  say() {
    console.log('我是普通人')
  }
}

class Man2SuperMan {
  man: Man
  constructor(man) {
    this.man = man
  }
  say() {
    this.man.say()
    console.log('我变成超人啦！')
  }
}

const man = new Man()
const superMan = new Man2SuperMan(man)
man.say()
// 我是普通人
superMan.say()
// 我是普通人
// 我变成超人啦！
```

> 这就是装饰器模式~

### 代理模式

代理模式通俗易懂点说就是：`为对象提供一种代理，便以控制对这个对象的访问，不能直接访问目标对象`

最好的实践场景就是ES6 Proxy

```ts
const handler = {
  get: function(obj, prop) {
    return prop in obj ? obj[prop] : 7;
  }
};

const p = new Proxy({}, handler);
p.a = 1;
p.b = undefined;

console.log(p.a, p.b);      // 1, undefined
console.log('c' in p, p.c); // false, 37
```

> 这就是代理模式~

# 观察者模式

观察者模式通俗点讲就是：定义对象间的一种一对多的依赖关系，当一个对象的状态发生改变时，所有依赖于它的对象都将得到通知

我们平时使用的框架Vue，它的响应式就是基于观察者模式去做的，下面是简单展示一下它的原理

```ts
  class Subject {
    count: number
    observers: any[]
    constructor() {
      this.count = 0
      this.observers = []
    }
    getCount() {
      return this.count
    }
    setCount(count: number) {
      // 设置值之后通知更新
      this.count = count
      this.notify()
    }
    notify() {
      this.observers.forEach((o) => {
        o.update()
      })
    }
    push(o) {
      this.observers.push(o)
    }
  }

  class Observer {
    constructor(name: string, sub: Subject) {
      this.name = name
      this.subject = sub
      this.subject.push(this)
    }
    update() {
      console.log(
        `${this.name} 变了 ${this.subject.getCount()}`
      )
    }
  }
  
  const sub = new Subject()
  // 观察一号
  const observer1 = new Observer('一号', sub)
  // 观察二号
  const observer2 = new Observer('二号', sub)

  sub.setCount(1)
  // 一号 变了 1
  // 二号 变了 1
```

> 这就是观察者模式~

### 发布订阅模式

`发布订阅模式`跟`观察者模式`很像，他们其实都有`发布者`和`订阅者`，但是他们是有区别的

-观察者模式的`发布`和`订阅`是`互相依赖`的
-发布订阅模式的`发布`和`订阅`是`不互相依赖`的，因为有一个`统一调度中心`

为了更好区分这两种设计模式，我举一个现实中的生活例子吧！

**例子一：** A想转手一部手机，B想买，于是两个人互加联系方式，B买了手机后，每次有手机系统更新时，都需要A去联系B进行升级教学

**例子二：** A想转手一部手机，所以挂在了某平台转卖，B在平台看到手机并买下，每次有手机系统更新时，A只需要跟平台反馈并提供升级教程，平台自然会通知B进行升级教学

我们`Vue EventBus`就是用了`发布订阅模式`

```ts
class EventEmitter {
  constructor() {
    this.cache = {}
  }

  on(name, fn) {
    const tasks = this.cache[name]
    if (tasks) {
      this.cache[name].push(fn)
    } else {
      this.cache[name] = [fn]
    }
  }

  off(name, fn) {
    const tasks = this.cache[name]
    if (tasks) {
      const index = tasks.findIndex(item => item === fn)
      if (index >= 0) {
        this.cache[name].splice(index, 1)
      }
    }
  }

  emit(name, ...args) {
    // 复制一份。防止回调里继续on，导致死循环
    const tasks = this.cache[name].slice()
    if (tasks) {
      for (let fn of tasks) {
        fn(...args)
      }
    }
  }

  once(name, cb) {
    function fn(...args) {
      cb(args)
      this.off(name, fn)
    }
    this.on(name, fn)
  }
}

const eventBus = new EventEmitter()
// 组件一
eventBus.on('event', (val) => {
  console.log(val)
})
// 组件二
eventBus.emit('event', 'params')
```
