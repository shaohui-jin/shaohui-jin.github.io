---
title: 请使用JS完成异步接口请求
date: 2025-04-23 14:57:37
permalink: /Promotion/Code/PromiseAjax/
category:
  - JavaScript
tag:
  - JavaScript
---

### XMLHttpRequest的 **readyState** 状态码

- 0 - 代表未初始化。 还没有调用 open 方法
- 1 - 代表正在加载。 open 方法已被调用，但 send 方法还没有被调用
- 2 - 代表已加载完毕。send 已被调用。请求已经开始
- 3 - 代表正在与服务器交互中。服务器正在解析响应内容
- 4 - 代表完成。响应发送完毕

### Get请求
```javascript
function getAjax(url, query) {
  let queryData = []
  for (let key in query) {
    queryData.push(`${key}=${query[key]}`)
  }
  url = `${url}?${queryData.join('&')}&timeStamp=${new Date().getTime()}`
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('get', url)
    xhr.send()
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          resolve(JSON.parse(xhr.responseText))
        } else {
          reject(xhr.statusText)
        }
      } else {
        reject(xhr.statusText)
      }
    }
  })
}
```

### Post请求

```javascript
function postAjax(url, query) {
  let queryData = []
  for (let key in query) {
    queryData.push(`${key}=${query[key]}`)
  }
  let queryStr = queryData.join('&')
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('post', url)
    xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded')
    xhr.send(queryStr)
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          resolve(JSON.parse(xhr.responseText))
        } else {
          reject(xhr.statusText)
        }
      } else {
        reject(xhr.statusText)
      }
    }
  })
}
```

