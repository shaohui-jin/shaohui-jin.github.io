---
title: Vue上下文生成器
lang: zh-CN
date: 2025-05-24 15:49:31
permalink: /Tips/Vue/UseContextLoad/
---

> Vue2 获取文件上下文方法是 `require.context('../views/components', true, /\.vue/)`
> 
> Vue3 获取文件上下文方法是 `import.meta.glob('../views/components/*.vue')`

### 上下文全局挂载组件

```js
import Vue from 'vue'
// 自定义组件
const requireComponents = require.context('../views/components', true, /\.vue/)
// 打印结果
// 遍历出每个组件的路径
requireComponents.keys().forEach(fileName => {
  // 组件实例
  const reqCom = requireComponents(fileName)
  // 截取路径作为组件名
  const reqComName = reqCom.name|| fileName.replace(/\.\/(.*)\.vue/,'$1')
  // 组件挂载
  Vue.component(reqComName, reqCom.default || reqCom)
})
```

### 上下文注册路由 

```js {2,4,6,7}
// 寻找views文件夹中的所有的page.js
const pages = import.meta.glob('../views/**/page.js', { eager: true, import: 'default' })
// 寻找所有组件，为后期component做准备
const pageComps = import.meta.glob('../views/**/index.vue', { eager: true })
const routes = Object.entries(pages).map(([path, meta]) => {
  path = path.replace('../views', '').replace('/page.js', '')
  path = path || '/'
  const name = path.split('/').filter(Boolean).join('-') || 'index'
  return {
    path,
    name,
    // component: () => import(''), 
    meta
  }
})

export const router = createRouter({
  history: createWebHistory(),
  routes
})
```
