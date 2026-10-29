---
title: AJAX - XHR与Fetch
lang: zh-CN
date: 2024-05-07 16:31:31
permalink: /Promotion/JavaScript/AJAX/
headerDepth: 3
---

## 全文概述
 
<!-- #region info -->

- 「**AJAX 全称 Asynchronous Javascript And XML**」：异步JavaScript和xml，是一种技术的统称
  - 「**XHR 全称 XmlHttpRequest**」：HTML源生实现Ajax的一种技术
  - 「**Fetch**」：基于 Promise 的一种api，在es6时提出，用于代替 XHR 实现 AJAX 的一种技术
- 「**axios**」 是一种 使用 Promise + xhr 封装的第三方库
- 「**umi-request**」： 基于 fetch 封装的第三方库

> **上传下载进度：**
> 1. xhr `支持上传、下载进度展示`
> 2. fetch 不支持上传进度，`支持下载进度展示`
> 
> **Abort 取消机制：**
> 1. xhr `支持终止请求`
> 2. fetch `本身不支持`，可使用 `信号控制器 AbortController` 实现
>
> **Timeout 超时机制:** 
> 1. xhr `支持超时机制`
> 2. fetch **本身不支持**，可使用 `信号控制器 AbortController` 以及 `Promise` 实现

<!-- #endregion info -->

##  如何创建Ajax

1. 创建 `XMLHttpRequest` 对象。
2. 使用`open`方法设置请求的参数。`open(method, url, 是否异步)`
3. 发送请求。
4. 注册事件。 注册 `onreadystatechange` 事件，状态改变时就会调用。
5. 获取返回的数据，更新UI。

```javascript
export function xhrRequest(option) {
  const { url, method = 'GET', data = null } = option
  const xhr = new XMLHttpRequest()
  xhr.onreadystatechange = () => {
    if(xhr.readyState === 4 && xhr.status === 200) {
      console.log(xhr.responseText)
      return xhr.responseText
    }
  }
  xhr.open(method, url)
  xhr.send()
}
```

注册 `onreadystatechange` 事件后，每当 `readyState` 属性改变时，就会调用 `onreadystatechange` 函数。

`readyState`：（存有 `XMLHttpRequest` 的状态。从 0 到 4 发生变化）

- `0`: 请求未初始化
- `1`: 服务器连接已建立
- `2`: 请求已接收
- `3`: 请求处理中
- `4`: 请求已完成，且响应已就绪

### 事件的触发条件及顺序

| 顺序 | 事件                     | 触发条件                                                                                                                                                                                                                                                                                                 |
|----|------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 1  | xhr.onreadystatechange | 每当`xhr.readystate`改变时触发；但`xhr.readystate`由非`θ`值变为`0`时不触发(如`xhr.abort()`取消接口的时候)                                                                                                                                                                                                                      |
| 2  | xhr.onloadstart        | 调用`xhr.send()`方法后立即触发，若`xhr.send()`未被调用则不会触发此事件。                                                                                                                                                                                                                                                     |
| 3  | xhr.upload.onloadstart | 上传阶段开始                                                                                                                                                                                                                                                                                               |
| 4  | xhr.upload.onprogress  | `xhr.upload.onprogress`在上传阶段(即`xhr.send()`之后，`xhr.readystate=2`之前)触发，每50ms触发一次                                                                                                                                                                                                                                                                                        |
| 5  | xhr.upload.onload      |                                                                                                                                                                                                                                                                                                      |
| 6  | xhr.upload.onloadend   | 上传阶段结束，下载阶段开始                                                                                                                                                                                                                                                                                        |
| 7  | xhr.onprogress         | `xhr.onprogress`在下载阶段(即`xhr.readystate=3`时)触发，每50ms触发一次                                                                                                                                                         |
| 8  | xhr.onload             | 当请求成功完成时触发，此时 `xhr.readystate=4`                                                                                                                                                                                                                                                                     |
| 9  | xhr.onloadend          | 当请求结束(包括请求成功和请求失败)时触发                                                                                                                                                                                                                                                                                |
|    | xhr.onabort            | 当调用 `xhr.abort()` 后触发                                                                                                                                                                                                                                                                                |
|    | xhr.ontimeout          | `xhr.timeout` 不等于0，由请求开始即 `onloadstart` 开始算起，当到达 `xhr.timeout` 所设置时间请求还未结束即 `onloadend`，则触发此事件。                                                                                                                                                                                                      |
|    | xhr.onerror            | 在请求过程中，若发生 `Network error` 则会触发此事件(若发生 `Network error` 时，上传还没有结束，则会先触发 `xhr.upload.onerror`，再触发 `xhr.onerror`；若发生 Network error 时，上传已经结束，则只会触发 `xhr.onerror` )。注意，只有发生了 **网络层级别** 的异常才会触发此事件，对于应用层级别的异常，如响应返回的 `xhr.statuscode` 是 `4xx` 时，并不属于 `Network error`，所以不会触发 `onerror` 事件，而是会触发 `onload` 事件。 |


## progress 进度条展示

### xhr 实现 上传、下载 

```javascript {7-14}
export function xhrRequest(option) {
  const { url, method = 'GET', data = null } = option
  const xhr = new XMLHttpRequest()
  xhr.onreadystatechange = () => {
    if(xhr.readyState === 4 && xhr.status === 200) {}
  }
  xhr.addEventListener('progress', (e) => {
    const { loaded, total } = e
    console.log(loaded, total) // 下载的当前数据以及下载的总数据量
  })
  xhr.upload.addEventListener('progress', e => {
    const { loaded, total } = e
    console.log(loaded, total) // 上传的当前数据以及上传的总数据量
  })
  xhr.open(method, url)
  xhr.send()
}
```

### fetch 实现 下载

```javascript {5,6,11,15}
export function fetchRequest(option){
  const { url, method = 'GET', data = null } = option
  return new Promise(async resolve => {
    const resp = await fetch(url, { method, body: data })
    let loaded = 0
    const total = +resp.headers.get('content-length')
    const decoder = new TextDecoder()
    let body = ''
    const reader = resp.body.getReader()
    while (1) {
      const { done, value } = await  reader.read()
      if (done) {
        break;
      }
      loaded += value.length
      body += decoder.decode(value)
    }
    resolve(body)
  })
}
```

## abort 取消接口

### xhr 实现 abort

> 如果该请求已被发出，**XMLHttpRequest.abort()** 方法将终止该请求。 
> 
> 当一个请求被终止，它的 **readyState** 将被置为 **XMLHttpRequest.UNSENT(0)**，并且请求的 **status** 置为 **0**。

```javascript {6-9,18}
function xhrWithCancel(url, token) { // the token is for cancellation
   let xhr = new XMLHttpRequest
   xhr.open('GET', url)
   return new Promise((resolve, reject) => {
      xhr.onload = () => resolve(xhr.responseText)
      token.cancel = () => {  // SPECIFY CANCELLATION
        xhr.abort() // abort request
        reject(new Error("Cancelled")) // reject the promise
      }
      xhr.onerror = reject
   });
};

let token = {};
let promise = xhrWithCancel("/someUrl", token);

// later we want to abort the promise:
token.cancel();
```

### fetch 增加 abort

```javascript
const abortController = new AbortController() // 信号控制器
fetch(url, {
  signal: abortController.signal
}).then(resolve, reject)

setTimeout(() => {
  abortController.abort()
}, 100)
```

### axios 取消接口方法

:::warning 
2021 年 10 月推出的 **Axios V0.22.0** 版本中把 **CancelToken** 打上 **deprecated** 的标记，意味废弃。与此同时，推荐 **AbortController** 来取而代之
:::

## timeout 超时处理

### xhr 实现 timeout

```javascript {2,6-9}
let xhr = new XMLHttpRequest();
xhr.timeout = 2000; // 超时时间，单位是毫秒
xhr.onload = function () {
  // 请求完成。在此进行处理。
};
xhr.ontimeout = function (e) {
  // XMLHttpRequest 超时。在此做某事。
};
xhr.open("GET", "/server", true);
xhr.send(null);
```

### fetch 增加 timeout

```javascript {4,7,9-12}
export function createFetchWithTimeoutByPromiseStatus(timeout = 5000) {
  return function (url, options) {
    return new Promise((resolve, reject) => {
      const abortController = new AbortController() // 信号控制器
      fetch(url, {
        ...options,
        signal: abortController.signal
      }).then(resolve, reject)
      setTimeout(() => {
        reject(new Error('fetch timeout'))
        abortController.abort()
      }, timeout)
    })
  }
}
```

```javascript {3-10}
export function createFetchWithTimeoutByPromiseRace(timeout = 5000) {
  return function (url, options) {
    return Promise.race([
      fetch(url, options),
      new Promise((resolve, reject) => {
        setTimeout(() => {
          reject(new Error('fetch timeout'))
        }, timeout)
      })
    ])
  }
}
```
