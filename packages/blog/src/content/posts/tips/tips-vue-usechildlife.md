---
title: Vue子组件生命周期
lang: zh-CN
date: 2025-05-24 15:53:31
permalink: /Tips/Vue/UseChildLife/
---

子组件不需要任何处理，只需要在父组件引用的时候通过`@hook`来监听即可，代码如下：

```vue
<template>
  <Child @hook:mounted="() => {}" />
  <Child @hook:updated="() => {}" />
</template>
```

### 源码

实现原理在`vue`源码的 `/src/core/instance/lifecycle.js`

```js
// 每个生命周期后都会调用 callHook('xxx') 如下
if (vm._isMounted && !vm._isDestroyed) {
  callHook(vm, 'beforeUpdate')
}

export function callHook (vm: Component, hook: string) {
  //...
  if (vm._hasHookEvent) {
    vm.$emit('hook:' + hook)
  }
  //...
}
```
