---
title: 大数据分时加载
lang: zh-CN
date: 2025-05-22 17:34:31
permalink: /Tips/UseIdelLoad/
---


> **datas**：需处理的大数据
>
> **consumer**: 用于处理需分时的任务
>
> **chunkSplit**：分时规则，`默认使用 requestIdleCallback`


::: vue-playground 演示

@file App.vue

```vue
<template>
  <div class="useIdelLoad-demo">
    <button class="btn1" @click="handleClick">点击添加内容</button>
  </div>
  <div class="useIdelLoad-result">
    <div class="title">生成的内容</div>
    <div class="container"></div>
  </div>
</template>
<script>
export default {
  methods: {
    handleClick() {
      const consumer = (item, i) => {
        const div = document.createElement('div')
        div.textContent = `${i}-`
        const container = document.querySelector('.useIdelLoad-result .container')
        container.appendChild(div)
      }
      const chunkSplit = (task) => {
        setTimeout(() => {
          task(time => time < 16)
        }, 2000)
      }
      this.performChunk(100, consumer)
    },
    performChunk(datas, consumer, chunkSplit) {
      if (typeof  datas === 'number') {
        datas = new Array(datas)
      }
      if (datas.length === 0) {
        return 
      }
      if (!chunkSplit && globalThis.requestIdleCallback) {
        chunkSplit = (task) => {
          requestIdleCallback(idle => {
            task(() => idle.timeRemaining())
          })
        }
      }
      let i = 0 // 目标应该取出的任务下标
      // 执行一块任务
      function _run() {
        if (i === datas.length) {
          return 
        }
        chunkSplit(hasTime => {
          const now = new Date()
          while (hasTime(new Date() - now) && i < datas.length) {
            const item = datas[i]
            consumer(item, i)
            i++
          }
          _run()
        })
      }
      _run()
    }
  }
}
</script>
<style>
.useIdelLoad-result {
  display: flex;
  flex-direction: column;
  border:  1px solid gainsboro;
  margin-top: 10px;
  .title {
    padding: 2px;
  }
  .container {
    background-color: #cccccc;
    margin: 2px;
    display: flex;
    flex-wrap: wrap;
  }
}
</style>
```
:::

