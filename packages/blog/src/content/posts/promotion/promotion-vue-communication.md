---
title: Vue 通讯方式
lang: zh-CN
date: 2022-06-01 16:21:10
permalink: /Promotion/Vue/Communication/
category:
  - VUE
tag:
  - Framework
---

## 简述

Vue是数据驱动视图更新的框架，所以对于vue来说组件间的数据通信非常重要。

常见使用场景可以分为三类:

- 父子组件通信: props/$emit $parent/$children provide/inject ref $attrs/$listeners

- 兄弟组件通信: eventBus Vuex

- 跨级通信: eventBus Vuex provide/inject $attrs/$listeners

<!-- more -->

## props / $emit （最常用的组建通信方式）

父组件通过 **props** 的方式向子组件传递数据，而通过 **$emit** 子组件可以向父组件通信。

### 父组件向子组件传值（props）

- 传入一个静态的值

```vue
<comp title="My journey with Vue" />
```

- 传入一个动态的值，任何类型的值都可以传给一个 prop。

```vue
<comp v-bind:title="'石怜安'" />
<comp v-bind:likes="28" />
<comp v-bind:is-published="false" />
<comp v-bind:comment-ids="[234, 266, 273]" />
<comp v-bind:author="{ name: '石怜安', company: '石怜安' }" />
```

> 总结：props 只可以在父子组件中通信，即单向数据流。
> 而且 props 是只读的，不可以被修改，所有修改都会被警告；
> 如果是引用类型，则子组件修改时，父组件也会变更。

### 子组件向父组件传值（$emit）

子组件通过 **$emit** 将参数传递给父组件,父组件通过 **v-on** 监听并接收参数。

```js
Vue.component('btn-component', {
  template: `<button v-on:click="$emit('click')">Click me to be welcomed</button>`
})
```

```vue
<template>
  <div id="emit-example-simple">
    <welcome-button v-on:click="talk"></welcome-button>
  </div>
</template>
<script>
  new Vue({
    el: '#emit-example-simple',
    methods: {
      talk: function () {
        alert('Hi!')
      }
    }
  })
</script>

```

## $children / $parent

`$parent` 可以访问到当前组件的父组件实例，`$children` 可以访问到当前组件的子组件实例。

> 注意：`$parent` 和 `$children` 得到的值不一样，`$children` 的值是数组，而 `$parent` 是个对象。

```vue
// 父组件中
<template>
  <div class="hello_world">
    <div>{{msg}}</div>
    <com-a />
    <button @click="changeA">点击改变子组件值</button>
  </div>
</template>
<script>
import ComA from './test/comA.vue'
export default {
  name: 'HelloWorld',
  components: {ComA},
  data() {
    return {
      msg: 'Welcome'
    }
  },
  methods: {
    changeA() {
      // 获取到子组件A
      this.$children[0].messageA = 'this is new value'
    }
  }
}
</script>
```

```vue
// 子组件中
<template>
  <div class="com_a">
    <span>{{messageA}}</span>
    <p>获取父组件的值为: {{parentVal}}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      messageA: 'this is old'
    }
  },
  computed: {
    parentVal() {
      return this.$parent.msg;
    }
  }
}
</script>
```

## provide/ inject

provide/ inject 就是父组件中通过 **provide** 来提供变量, 然后在子组件中通过 **inject** 来注入变量。

provide 是一个 **对象** 或返回 **一个对象的函数** 。inject 是一个 **数组** 或 **对象** 。

> 注意: 这里不论子组件嵌套有多深, 只要调用了 inject 那么就可以注入 provide中 的数据，而不局限于只能从当前父组件的 props 属性中获取数据。

```vue
<script>
// 父级组件提供 'foo'
export default {
  provide: {
    foo: 'bar'
  }
}
</script>
```

```vue
<script>
// 子组件注入 'foo'
export default {
  inject: ['foo'],
}
</script>
```

## ref / refs

在普通的 DOM 元素上使用，引用指向的就是 DOM 元素

用在组件上，引用就指向组件实例，可以通过实例直接调用组件的方法或访问数据。

```vue
<template>
  <base-comp ref="usernameInput">
    <input ref="input">
  </base-comp>
</template>
<script>
export default {
  methods: {
    // 用来从父级组件聚焦输入框
    focus: function () {
      this.$refs.input.focus()
    }
  }
}

</script>
```

## eventBus

eventBus 又称为 **事件总线**，在vue中是所有组件共用相同的事件中心，可以向该中心 **注册发送事件** 或 **接收事件**。

- 初始化

首先需要创建一个事件总线并将其导出, 以便其他模块可以使用或者监听它.

```js
// event-bus.js
import Vue from 'vue'

export const EventBus = new Vue()
```

- 发送事件

假设你有两个组件: **additionNum** 和 **showNum**, 这两个组件可以是兄弟组件也可以是父子组件；这里我们以兄弟组件为例:

```vue
<template>
  <div>
    <show-num-com></show-num-com>
    <addition-num-com></addition-num-com>
  </div>
</template>

<script>
import showNumCom from './showNum.vue'
import additionNumCom from './additionNum.vue'

export default {
  components: {showNumCom, additionNumCom}
}
</script>
```

```vue
<template>
  <div>
    <button @click="additionHandle">+加法器</button>
  </div>
</template>
<script>

import {EventBus} from './event-bus.js'

export default {
  data() {
    return {
      num: 1
    }
  },
  methods: {
    additionHandle() {
      EventBus.$emit('addition', {num: this.num++})
    }
  }
}
</script>
```

- 接收事件

```vue
<template>
  <div>计算和: {{count}}</div>
</template>

<script>
import {EventBus} from './event-bus.js'

export default {
  data() {
    return {
      count: 0
    }
  },
  mounted() {
    EventBus.$on('addition', param => {
      this.count = this.count + param.num;
    })
  }
}
</script>
```

这样就实现了在组件 **addtionNum.vue** 中点击相加按钮, 在 **showNum.vue** 中利用传递来的 num 展示求和的结果.

- 移除事件监听者

如果想移除事件的监听, 可以像下面这样操作:

```js
import {eventBus} from 'event-bus.js'

EventBus.$off('addition', {})
```

## Vuex

Vuex 是一个专为 Vue.js 应用程序开发的 **状态管理模式**。它采用集中式存储管理应用的所有组件的状态，主要解决的是开发大型单页面项目的组件通信问题。

## $attrs与 $listeners

为了解决该需求，引入了 `$attrs` 和 `$listeners`，新增了 **inheritAttrs** 选项。 

默认情况下，父作用域中不作为 prop 被识别 (且获取) 的特性绑定 (class 和 style 除外)，将会 **回退** 且作为普通的HTML特性应用在子组件的根元素上。

```vue
<template>
  <div>
    <child-com1 :name="name" :age="age" :gender="gender" :height="height" />
  </div>
</template>
<script>
const childCom1 = () => import("./childCom1.vue");
export default {
  components: {childCom1},
  data() {
    return {
      name: "石怜安",
      age: "27",
      gender: "男",
      height: "178"
    };
  }
};
</script>
```

```vue
<template class="border">
  <div>
    <p>name: {{ name }}</p>
    <p>childCom1的$attrs: {{ $attrs }}</p>
  </div>
</template>
<script>
export default {
  inheritAttrs: false, // 可以关闭自动挂载到组件根元素上的没有在props声明的属性
  props: {
    name: String // name作为props属性绑定
  },
  created() {
    console.log(this.$attrs); // { "age": "27", "gender": "男", "height": "178" }
  }
};
</script>
```

## localStorage / sessionStorage#

通过 **window.localStorage.getItem(key)** 获取数据，通过 **window.localStorage.setItem(key,value)** 存储数据。

## 总结：

**props** / **$emit** 是使用最多，也最推荐的方式。适用于父子组件通信。

Vuex 是 Vue 官方提供的组件通信方式，适用于构建大型单页面项目。

`$children` / `$parent` ，`ref` ，`$attr` / `$listener` 主要是通过操作父子组件的实例来获取组件的数据，实现组件通信。
