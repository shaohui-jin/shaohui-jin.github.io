---
headerDepth: 3
---

### ajax


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


### 地址栏输入url按下回车会发生什么事

> 1. **url检测**：`检查`/`纠错`
> 2. **Dns解析**
> 3. **TCP三次握手**(SSL握手)
> 4. 准备请求(请求头： cookies + ...)
> 5. **发送请求**(GET)
> 6. 服务器处理请求
> 7. **服务器响应**
> 8. 浏览器收到响应头
> 9. 处理响应头(`set-cookie`、`content-type`、`缓存`、`状态码`、`connection: keep-alive`)
> 10. 收响应体
> 11. **渲染**
>     - 解析(预处理线程，资源加载、资源描述符 async defer preload prefetch) 生成DOM树和CSSOM树
>     - 样式计算
>     - Layout布局
>     - layer 分层
>     - paint 绘制(主线程结束、合成线程开始)
>     - tiles 分块
>     - 光栅化
>     - draw 画
> 12. **根据情况是否需要关闭连接，四次挥手**

### preload、prefetch、async、defer的区别

> preload 和 prefetch：用于资源提前加载，分别适用当前页面和未来可能需要的资源。
> - **Preload**：用于告诉浏览器在页面加载过程中需要高优先级加载的资源。
> - **Prefetch**：用于告诉浏览器资源之后可能会在未来使用，因此可以在空闲时间提前下载。
>
> **async** 和 **defer**：用于控制脚本的加载与执行时机，async最适合独立脚本，defer适合需要按顺序执行且依赖DOM的脚本。
> - **Async**：async用于异步加载JavaScript，脚本下载完成后立即执行，不会影响dom脚本解析。
> - **Defer**：defer用于延迟执行JavaScript，直到HTML解析完毕之后再执行。

### async、defer、load、DOMContentLoaded 先后顺序

> defer -> DOMContentLoaded -> window.onload -> load
> 
> async -> window.onload -> load

- **DOMContentLoaded** —— 浏览器已完全加载HTML，并构建了DOM树，但像**img标签**和**样式表之类**的外部资源可能尚未加载完成。
- **load** —— 浏览器不仅加载完成了 HTML，还加载完成了所有外部资源：图片，样式等
- **async** —— async脚本的加载是异步的，不会阻塞HTML解析。脚本一旦下载完成，会立即执行，此时可能会中断HTML解析（若解析尚未完成）。由于浏览器并行下载脚本和其他资源，因此其执行时机取决于下载完成的时间。
- **window.onload** —— window.onload事件会在页面所有资源（包括图片、样式表、异步脚本等）加载完成后触发。这意味着浏览器会等待async脚本的下载完成，即使它们的执行已经结束。

### http 1.0 2.0 区别

|   | http 1.0 | http 2.0 |
|---|----------|----------|
| 连接方式  |  默认使用`短连接`，每个请求需要单独建立一次TCP连接，请求完成后立即关闭。会导致频繁的TCP握手和断开，增加了网络延迟和开销‌。       |  采用`长连接`，默认复用同一个TCP连接，可以在一个连接上并发处理多个请求和响应，减少了TCP连接的建立和断开次数，提高性能和效率‌‌。        |
| 数据格式  |  基于`文本`的协议，请求和响应以纯文本形式传输，解析效率低且容易出错‌。        |   采用`二进制分帧`，将数据分割为更小的二进制帧进行传输，提高了传输效率和错误率低‌。       |
| 头部压缩  |  `不支持`头部压缩，每次请求需要重复发送完整的头部信息，浪费带宽‌        |   使用`HPACK算法`对头部进行压缩，减少了冗余数据传输，典型压缩率可达50%-90%。       |
| ‌多路复用‌  |  `不支持`多路复用，请求需要按顺序发送和接收，存在“队头阻塞”问题        |   `支持`多路复用，单个TCP连接可以并发处理多个请求和响应，解决了队头阻塞问题，提高了并发处理能力‌       |
| 服务器推送  |  `不支持`服务器推送功能，客户端必须主动请求每个资源‌。        |   服务器可以`主动向客户端推送资源`。       |

### [浏览器缓存 与 http缓存](/my-blog/Promotion/JavaScript/BrowserCache/)

> `localStorage(5M)`、`sessionStorage(5M)`、`cookie(4k)`
