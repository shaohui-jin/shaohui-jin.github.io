---
title: 大文件分片下载
lang: zh-CN
date: 2025-05-22 17:34:31
permalink: /Tips/UseFragmentDownload/
---

```js
  async function UseFragmentDownload(
  url = 'https://duyi-static.oss-cn-beijing.aliyuncs.com/files/novel.txt'
) {

  const resp = await fetch(url)
  const reader = resp.body.getReader()
  const decoder = new TextDecoder()
  let remainChunk =  new Uint8Array(0)
  let resultText = ''
  for (;;) {
    const { value, done } = await reader.read();
    if (done) {
      break;
    }
    const lastIndex = value.lastIndexOf(10); // 最后的换行位置
    const chunk = value.slice(0, lastIndex + 1); // 等待解析的文本，移除后面一段，保证没有乱码
    const readChunk = new Uint8Array(remainChunk.length + chunk.length)
    readChunk.set(remainChunk);
    readChunk.set(chunk, remainChunk.length);
    remainChunk = value.slice(lastIndex + 1);
    const text = decoder.decode(readChunk);
    resultText += text;
  }
}
```
