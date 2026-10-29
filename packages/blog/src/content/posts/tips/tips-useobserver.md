---
title: 监控页面
lang: zh-CN
date: 2025-05-22 17:20:31
permalink: /Tips/UseObserver/
---

### 监控页面元素变化

```js
const observer = new MutationObserver(() => {
  // 回调函数
});

// 监听此组件的变化
observer.observe('', {
  childList: true,
  subtree: true
});
```

### 监控页面是否卡顿    

```js
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    if (entry.duration > 100) {
      console.log('上报到日志中心')
    }
  }
})

observer.observe({
  entryTypes: ['longtask']
})

```

