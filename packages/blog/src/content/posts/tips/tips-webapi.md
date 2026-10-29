---
title: WEB API
lang: zh-CN
date: 2024-05-18 18:54:31
permalink: /Tips/WebApi/
category:
  - JavaScript
tag:
  - Tips
---

### 视频API-自动播放

::: normal-demo 演示

```html
<div class="container">
  <video class="video" src="https://media.w3.org/2010/05/sintel/trailer.mp4" autoplay></video>
  <div class="modal">
    <button class="btn">开始播放</button>
  </div>
</div>
```

```js {6,7,9}
const video = document.querySelector('.video')
const modal = document.querySelector('.modal')
const btn = document.querySelector('.btn')

async function play() {
  video.muted = true; // 静音
  await video.play() // 静音能直接播放(自动播放条件之一)
  const ctx = new AudioContext()
  const canAudioPlay = ctx.state === 'running' // 判断是否有声音，去触发用户手动操作
  await ctx.close()
  if(canAudioPlay) {
    video.muted = false
    modal.style.display = 'none'
    btn.removeEventListener('click', play)
  } else {
    modal.style.display = 'flex'
    btn.addEventListener('click', play)
  }
}
play()
```

```css
* {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}
.container {
  width: 100%;
  display: flex;
  position: relative;
}
video {
  height: calc(100% - 40px);
}
.modal {
  position: absolute;
  z-index: 2222;
  opacity: 0.8;
  width: 100%;
  height: 100%;
}
.modal button {
  width: 100px;
  height: 50px;
  margin: auto;
}
```
:::


### 文件API-浏览器操作文件


::: vue-playground

@file App.vue

```vue
<template>
  <div class="directory-picker-container" style="display: flex; flex-direction: column; height: 100vh; overflow: hidden">
    <button style="width: 100px;height: 25px;margin: auto;" @click="openDirectoryPicker">打开文件</button>
    <div style="display: flex; flex-direction: row; flex: 1;">
      <div style="display: flex; flex-direction: column; width: 150px; padding: 0 12px; overflow-y: auto;">
        <Directory :fileList="fileList" @getFile="$event => text = $event"/>
      </div>
      <div style="flex: 1 1 0; padding: 0 12px; overflow-y: auto;">  
       <textarea v-model="text" style="all: inherit; box-sizing: border-box;"></textarea>
      </div>
    </div>
  </div>
</template>
<script setup>
import Directory from './Directory.vue'
import { ref } from 'vue'
const fileList = ref([])
const text = ref('')
const openDirectoryPicker = async () => {
  try {
    const handler = await showDirectoryPicker()
    const root = await processHandle(handler)
    fileList.value = root.children
  } catch (e) {
    console.log(e)
    // 用户拒绝站点查看文件夹内容
    alert('用户拒绝站点查看文件夹内容')
  }
}
const processHandle = async (handle) => {
  if(handle.kind === 'file') {
    return handle
  }
  handle.children = []
  const iter = await handle.entries()
  for await (const info of iter) {
    // info [" 银河战士中文版4.sgm", { kind: 'file', name: '银河战士中文版4.sgm'} ]
    const subHandle = await processHandle(info[1])
    handle.children.push(subHandle)
  }
  return handle
}
</script>
<style>
@import "//at.alicdn.com/t/c/font_3638201_mvhkpomgc6.css";
* {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}
</style>
```

@file Directory.vue

```vue
<template>
  <div v-for="(file, fileIndex) in props.fileList" :key="file.name">
    <div v-if="file.kind === 'directory'" style="display: flex; flex-direction: column; align-items: baseline;">
      <div style="display: flex; flex-direction: row; cursor: pointer;"  @click="openFiledirectory">
        <i class="iconfont icon-wenjianjia" style="font-size: 16px" />
        {{ file.name }} 
      </div>
    </div>
    <div v-if="file.kind === 'file'" style="display: flex; flex-direction: row; align-items: baseline; cursor: pointer;" @click="openFile(fileIndex)">
      <i class="iconfont icon-wenjian" style="font-size: 16px"></i>
      {{ file.name }}
    </div>
  </div>
</template>
<script>
</script>
<script setup>
import { defineProps, defineEmits } from 'vue'
const props = defineProps({
  fileList: {
    type: Array,
    required: true
  }
})
const emit = defineEmits(['getFile'])
const openFile = async (fileIndex) => {
  // 获取文件内容
  const file = await props.fileList[fileIndex].getFile()
  console.log(file)
  const reader = new FileReader()
  reader.onload = (e) => {
    emit('getFile', e.target.result)
  }
  reader.readAsText(file, 'utf-8')
}
const openFiledirectory = () => alert('测试demo就不往深写了')
</script>

<style scoped>
@import "//at.alicdn.com/t/c/font_3638201_mvhkpomgc6.css";
* {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}
</style>
```
:::

### 剪切板API

> `navigator.clipboard.readText`: 用于读取剪切板
>
> `navigator.clipboard.writeText`: 用于写入剪切板
>
> window监听 `paste事件`，FileReader文件流形式处理图片

案例如下：点击按钮切换复制内容测试，测试图片则需要复制图片再回来粘贴

::: vue-playground 演示

@file App.vue

```vue
<template>
  <div class="clipboard-demo">
    this is something text;this is something text;this is something text;
  </div>
  <button class="btn1" @click="type = 1">测试禁止复制</button>
  <button class="btn2" @click="type = 2">测试增加版权</button>
  <div class="clipboard-demo-result">
    <div class="title">复制内容</div>
    <div class="container">{{ txt }}</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      type: 1,
      txt: '',
    }
  },
  mounted() {
    document.addEventListener('copy', this.fn)
    document.addEventListener('paste', this.pasteFn)
  },
  beforeDestroy() {
    document.removeEventListener('copy', this.fn)
    document.removeEventListener('paste', this.pasteFn)
  },
  methods: {
    fn(e) {
      const type = this.type
      if (type === 1) {
        navigator.clipboard.writeText('禁止复制').then(this.getText)
        e.preventDefault()
      } else if (type === 2) {
        navigator.clipboard.readText().then(txt => {
          navigator.clipboard.writeText(`${txt}，这是增加的版权信息`).then(this.getText)
        })
      }
    },
    async getText() {
      this.txt = await navigator.clipboard.readText()
    },
    pasteFn(e) {
      const container = document.querySelector('.container')
      if (e.clipboardData.files.length > 0) {
        e.preventDefault()
        const file = e.clipboardData.files[0]
        const reader = new FileReader()
        reader.onload = function (e) {
          const img = document.createElement('img')
          img.style.width = '200px' 
          img.style.height = '200px' 
          img.src = e.target.result
          container.appendChild(img)
        }
        reader.readAsDataURL(file)
      }
    }
  }
}
</script>
<style>
.clipboard-demo-result {
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
  }
}
</style>
```
:::

