---
title: 观察者模式
lang: zh-CN
date: 2022-05-16 11:21:30
permalink: /DesignPattern/Observer/
category: 
  - 设计模式
tag: 
  - 设计模式
---

# 观察者模式

我们学习vue的时候，经常会遇到消息通信，但大部分组件不是父子关系，就是兄弟关系。
那如果两个没有任何关系的组件，既要进行消息通信，要保证通信不丢失，那么这时候 **观察者模式（发布-订阅模式）** 就很好用了。

## 发布-订阅
> 发布：数据推送方，如：组件A想获取组件B数据，组件B抛出组件A需要的数据
>
> 订阅：提出诉求方，如：组件A想获取组件B数据，抛出了个接收数据的'getData'方法

## 代码编写
- 首先我们要定义一个观察者（数据处理中心），用来存储事件和回调函数信息。

```js
class Observer {
    constructor() {
        // 数据处理中心，用来存储事件和回调函数信息
        this.handlers = {}
        this.caches = {}
    }
}
module.exports = new Observer()
```

- 其次我们要定义一个发布的函数，当然，为了防止发布者比订阅者提早生成，将发布内容存储于 **caches**，使订阅者生成后直接发布。

```js
function emit(eventName) {
    const fns = this.handlers[eventName] // 获取注册的事件
    const args = [].slice.call(arguments) // 获取所有参数转成list
    args.shift() // 参数去掉事件名称
    // 判断 有注册的执行
    if (!fns || fns.length === 0) {
        this.caches[eventName] = args
        return false;
    }
    fns.forEach((fn) => {
        fn.apply(null, args)
    })
}
```

- 然后我们要定义一个订阅的函数，当发布者比订阅者提早生成时，要先将caches中存有的发布数据发布出去，再存入观察者中。

```js
function on(eventName, fn) {
    if (typeof fn !== 'function') {
        console.error('fn must be a function')
    }
    if (this.caches[eventName] instanceof Array) {
        //有缓存的 可以执行 说明是先发布 后订阅
        fn.apply(null, this.caches[eventName])
        delete this.caches[eventName]
    }
    if (!this.handlers[eventName]) {
        this.handlers[eventName] = []
    }
    this.handlers[eventName].push(fn)
}
```

- 最后，当页面销毁的时候，我们就需要定义一个销毁订阅的方法。

```js
function off(eventName, fn) {
    // 若是没有传参，注销所有的订阅
    if (!arguments.length) {
        this.handlers = {};
        return this;
    }
    const fns = this.handlers[eventName]
    if (!fns) return
    // 若是只传eventName，不传fn，删除对应事件名称下的所有回调函数
    if (arguments.length === 1) {
        delete this.handlers[eventName]
        return
    }
    if (fns && fns.includes(fn)) {
        fns.splice(fns.indexOf(fn), 1)
    }
}
```

## 实际应用

首先我们使用vue-cli直接 **vue create demo** 创建应用，
在app.vue中引入两个组件 comp1 以及 comp2， 代码如下：

- comp1.vue
```vue
<script>
    import observer from '../utils/observer'
    export default {
        name: 'comp1',
        created() {
            console.log('我是组件1，1秒后发送数据1')
            setTimeout(() => {
                // 发布'comp1ToComp2'事件并携带数据
                observer.emit('comp1ToComp2Func1', {
                    info: '1组件发送给2组件的数据1'
                })
            }, 1000)

            console.log('我是组件1，10秒后发送数据2')
            setTimeout(() => {
                // 发布'comp1ToComp2'事件并携带数据
                observer.emit('comp1ToComp2Func2', {
                    info: '1组件发送给2组件的数据2'
                })
            }, 10000)
        }
    }
</script>
```

- comp2.vue
```vue
<script>
    import observer from '../utils/observer'
    export default {
        name: 'comp2',
        created() {
            console.log('我是组件2，5秒后才订阅事件1')
            // 添加'comp1ToComp2'事件订阅
            setTimeout(() => {
                observer.on('comp1ToComp2Func1', this.getComp1Data.bind(this))
            }, 5000)

            console.log('我是组件2，9秒后才订阅事件2')
            setTimeout(() => {
                observer.on('comp1ToComp2Func2', this.getComp1Data.bind(this))
            }, 9000)
        },
        methods: {
            getComp1Data(data) {
                console.log(`我是组件2，我拿到数据了，数据是${data.info}`)
            }
        },
    }
</script>
```

- 最后的结果是：

![](https://shaohui-jin.github.io/picx-images-hosting/blog/DesignPattern/observer_001.7i0593ia03.webp " " =800x)
