---
title: Worker
date: 2025-05-22 17:17:31
---

```js
const code = `console.log('worker')`;

// 1. Object Url
const blob = new Blob([code], { type: "applaction/javascript" });
const url = URL.createObjectURL(blob);
const worker1 = new Worker(url);

// 2. Data Url
const dataUrl = `data:appliction/javascript;utf8,${code}`;
const worker2 = new Worker(dataUrl);
```
