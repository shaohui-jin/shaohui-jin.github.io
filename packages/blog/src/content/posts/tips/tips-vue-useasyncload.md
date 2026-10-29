---
title: Vue异步加载
lang: zh-CN
date: 2025-05-24 15:31:31
permalink: /Tips/Vue/UseAsyncLoad/
---

### 路由懒加载

```js
VueRouter({
  routes:[
    {
      path: '/about',
      name: 'About',
      component: resolve => require(['path路径'], resolve), // Vue异步组件
      component1: () => import('path路径'), // es6的import
      component2: () => r => require.ensure([],() =>  r(require('path路径')), 'demo'), // webpack提供的require.ensure()
    }
  ]
})
```

### 组件懒加载

```vue
<script>
export default {
  //在vue的components中
  components: {
    ChildFirst:() => ({
      component: import(/* webpackChunkName: "Async" */ './Async'),
      delay:200, // 延迟几毫秒，默认200
      timeout:3000, // 加载几毫米之后就超时，触发error组件
      loading: import(/* webpackChunkName: "LoadingComponent" */ './LoadingComponent'), // 组件未加载回来前显示
      error: import(/* webpackChunkName: "ErrorComponent" */ './ErrorComponent') // 组件超时时显示
    }),
    addBureau: () => import('./components/ChildSecond')
  }
}
</script>
```
