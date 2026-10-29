---
title: Vue 生命周期
lang: zh-CN
date: 2024-4-6 13:35:02
permalink: /Promotion/Vue/LifeCycle/
category: 
  - VUE
tag: 
  - VUE
---

每个Vue实例再被创建之前，都会经过一系列的初始化过程，这个过程被称之为vue的生命周期。

其中Vue中包含如下钩子：

| VUE2 | VUE3                | 备注 |
|------|---------------------|----|
|  **beforeCreate**  |                     |    |
|  **created**   |                     |    |
|  **beforeMount**   | **onBeforeMount**   |    |
|  **mounted**   | **onMounted**       |    |
|  **beforeUpdate**   | **onBeforeUpdate**  |    |
|  **updated**   | **onUpdated**       |    |
|  **beforeDestroy**   | **onBeforeUnmount** |    |
|  **destroyed**   | **onUnmounted**     |    |
|  **activated**   |                     |  keep-alive包裹时有效  |
|  **deactivated**   |                     |  keep-alive包裹时有效  |
|  **errorCapture**   |                     |  捕获异常  |


下面这张进行了注释官网的生命周期图。

![](https://shaohui-jin.github.io/picx-images-hosting/blog/Vue/生命周期.5fkdt6fcci.webp "vueLifecycle" =800x)

<!-- more -->

## 案例

> 结合下面的Vue生命周期案例，F12看控制台更容易理解。

::: vue-playground
@file App.vue
```vue
<template>
  <div ref="lifeCycle">
    <h1>{{ message + ' --- 这是在outer HTML中的' }}</h1>
    <button @click="message++">自增，验证update</button>
  </div>
</template>

<script>

export default {
  data() {
    return {
      message: 0
    }
  },
  beforeCreate() {
    console.group('------beforeCreate创建前状态------');
    console.log('%c%s', 'color:red', 'el     : ' + this.$el); //undefined
    console.log('%c%s', 'color:red', 'data   : ' + this.$data); //undefined
    console.log('%c%s', 'color:red', 'message: ' + this.message); //undefined
  },
  created() {
    console.group('------created创建完毕状态------');
    console.log('%c%s', 'color:red', 'el     : ' + this.$el); //undefined
    console.log('%c%s', 'color:red', 'data   : ' + this.$data); //已被初始化
    console.log('%c%s', 'color:red', 'message: ' + this.message); //已被初始化
  },
  beforeMount() {
    console.group('------beforeMount挂载前状态------');
    console.log('%c%s', 'color:red', 'el     : ' + this.$el); //已被初始化
    console.log(this.$el);
    console.log('%c%s', 'color:red', 'data   : ' + this.$data); //已被初始化
    console.log('%c%s', 'color:red', 'message: ' + this.message); //已被初始化
  },
  mounted() {
    console.group('------mounted 挂载结束状态------');
    console.log('%c%s', 'color:red', 'el     : ' + this.$el); //已被初始化
    console.log(this.$el);
    console.log('%c%s', 'color:red', 'data   : ' + this.$data); //已被初始化
    console.log('%c%s', 'color:red', 'message: ' + this.message); //已被初始化
  },
  beforeUpdate() {
    console.group('beforeUpdate 更新前状态===============》');
    console.log('%c%s', 'color:red', 'el     : ' + this.$el);
    console.log(this.$el);
    console.log('%c%s', 'color:red', 'data   : ' + this.$data);
    console.log('%c%s', 'color:red', 'message: ' + this.message);
    console.groupEnd();
  },
  updated() {
    console.group('updated 更新完成状态===============》');
    console.log('%c%s', 'color:red', 'el     : ' + this.$el);
    console.log(this.$el);
    console.log('%c%s', 'color:red', 'data   : ' + this.$data);
    console.log('%c%s', 'color:red', 'message: ' + this.message);
    console.groupEnd();
  },
  beforeDestroy() {
    console.group('beforeDestroy 销毁前状态===============》');
    console.log('%c%s', 'color:red', 'el     : ' + this.$el);
    console.log(this.$el);
    console.log('%c%s', 'color:red', 'data   : ' + this.$data);
    console.log('%c%s', 'color:red', 'message: ' + this.message);
  },
  destroyed() {
    console.group('destroyed 销毁完成状态===============》');
    console.log('%c%s', 'color:red', 'el     : ' + this.$el);
    console.log(this.$el);
    console.log('%c%s', 'color:red', 'data   : ' + this.$data);
    console.log('%c%s', 'color:red', 'message: ' + this.message)
  },
}
</script>
```
:::
