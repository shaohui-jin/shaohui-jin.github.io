---
title: Vue状态仓库持久化
lang: zh-CN
date: 2025-05-06 17:14:30
permalink: /Tips/Vue/UsePersist/
category: 
  - VUE
tag: 
  - VUE
---

## 思路

在 Vue 项目中，一般采用 **vuex** 或者 **pinia** 去实现全局的状态仓库，

同时在设计时有提供插件方式去控制数据源，可以从插件的方式入手持久化。

### Vuex

```javascript
// store.js
import { createStore } from 'vuex'
import counter from './counter';
import persistPlugin from './persistPlugin'

const store = createStore({
  modules: {
    counter
  },
  plugins: [persistPlugin]
})
export default store;

// persistPlugin.js
const KEY_PREFIX = 'VUEX:STATE:'

export default (context) => {
  const key = `${KEY_PREFIX}${context.store.$id}`
  // 存
  window.addEventListener('beforeunload', () => {
    localStorage.setItem(key, JSON.stringify(context.store.$state))
  })
  // 取
  const value = localStorage.getItem(key)
  if (!value) {
    return
  }
  try {
    const originState = (JSON.parse(value))
    store.replaceState(originState)
  } catch {
    console.log('存储格式有误')
  }
};

```

### Pinia

```javascript
// main.js
import  { createApp } from 'vue'
import { cretrPinia } from 'pinia'
import persistPlugin from './persistPlugin'
import App from './App.vue'

const pinia = cretrPinia()
pinia.use(persistPlugin)
const app = createApp(App)
app.use(pinia)
app.mount('#app')

// persistPlugin.js
const KEY_PREFIX = 'PINIA:STATE:'

export default (context) => {
  const key = `${KEY_PREFIX}${context.store.$id}`
  // 存
  window.addEventListener('beforeunload', () => {
    localStorage.setItem(key, JSON.stringify(context.store.$state))
  })
  // 取
  const value = localStorage.getItem(key)
  if (!value) {
    return
  }
  try {
    const originState = (JSON.parse(value))
    context.store.$patch(originState)
  } catch {
    console.log('存储格式有误')
  }
};
```
