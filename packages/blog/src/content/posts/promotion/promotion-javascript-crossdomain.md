---
title: 跨域
lang: zh-CN
date: 2024-05-14 16:24:16
permalink: /Promotion/JavaScript/CrossDomain/
category: 
  - JavaScript
tag: 
  - Network
---

## 同源策略的概念和具体限制


同源策略：限制 **从一个源加载的文档或脚本** 如何与 **来自另一个源的资源** 进行交互。这是一个用于隔离潜在恶意文件的关键的安全机制。（来自MDN官方的解释）



具体解释：

- `源`包括三个部分：协议、域名、端口。如果有任何一个部分不同，则`源`不同，那就是跨域了。
- `限制`：这个源的文档没有权利去操作另一个源的文档。这个限制体现在：
  - `Cookie`、`LocalStorage`和`IndexDB`无法获取。
  - 无法获取和操作`DOM`。
  - 不能发送`Ajax`请求。我们要注意，`Ajax`只适合`同源`的通信。


![](https://shaohui-jin.github.io/picx-images-hosting/blog/Network/跨域之同源策略.b8qxop4qm.webp "跨域之同源策略" =x600)

<!-- more -->


[//]: # (## 简单请求与预检请求)

[//]: # ()
[//]: # (主要有以下几种方式：)

[//]: # ()
[//]: # (- `Ajax`：不支持跨域。)

[//]: # (- `WebSocket`：不受同源策略的限制，支持跨域)

[//]: # (- `CORS`：不受同源策略的限制，支持跨域。一种新的通信协议标准。可以理解成是：`同时支持同源和跨域的Ajax`。)

[//]: # ()


## 前后端如何通信

主要有以下几种方式：

- `Ajax`：不支持跨域。
- `WebSocket`：不受同源策略的限制，支持跨域
- `CORS`：不受同源策略的限制，支持跨域。一种新的通信协议标准。可以理解成是：`同时支持同源和跨域的Ajax`。

## 跨域的解决方式

1. CORS
2. nginx

### CORS 跨源资源共享

浏览器必须首先使用 OPTIONS 方法发起一个预检请求，从而获知服务端是否允许该跨源请求。

服务器确认允许之后，才发起实际的 HTTP 请求。在预检请求的返回中，服务器端也可以通知客户端，是否需要携带身份凭证 COOKIE

1. 当浏览器发出跨域请求时，浏览器会添加一个带有当前 **源(方案、主机和端口)** 的 **Origin** 标头。
2. 在服务器端，当服务器看到此标头并希望允许访问时，它需要在响应中添加一个 **Access-Control-Allow-Origin** 标头，指定请求来源(或 * 以允许任何来源)
3. 当浏览器看到带有适当 **Access-Control-Allow-Origin** 标头的响应时，浏览器允许与客户端站点共享响应数据。

``` java {7-17}
@Override
public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
  throws IOException, ServletException {
  
  HttpServletResponse res = (HttpServletResponse) response;

  // 允许跨域的域名，设置 * 表示允许除带 Cookies 信息的所有域名
  res.addHeader("Access-Control-Allow-Origin", "http://localhost:9527"); 
  // 携带Cookie的请求需开启配置，同时 Access-Control-Allow-Origin 一定为精准匹配
  res.addHeader("Access-Control-Allow-Credentials", true); 
  // 允许跨域的方法，可设置*表示所有。GET/POST/OPTIONS等
  res.addHeader("Access-Control-Allow-Methods", "GET"); 
  // 假如给post请求头设置了contentType字段，则需要添加以下信息
  res.addHeader("Access-Control-Allow-Headers", "Content-Type");
  // 设置预检命令的缓存时效。单位是"秒"
  // 如果没有失效，则不会再次发起OPTION预检请求
  res.addHeader("Access-Control-Max-Age", "3600");
  // 还可以有其他配置...
  chain.doFilter(request, response); //让过滤器放行该请求
}
```

### nginx

> **正向代理：** 利用代理客户端去请求服务器，从而隐藏了真实的客户端，服务器并不知道客户端是谁。如：vpn、devServerProxy
>
> **反向代理:** 反向代理隐藏了真正的服务端。软件层面上常用 Ngnix 来做反向代理服务器，性能很好，用来做负载均衡

为了实现反向代理，需要在 Ngnix 中配置一个代理域名，或者称为一个网址 demo.com，就像百度成千上万的服务器使用用一个代理网址 www.baidu.com 一样

```nginx
server {
  listen 80;
  server_name: demo.com; # 请求域名是demo.com，端口是80的，都会被nginx做代理
  # http://demo.com/api/test 就会跳转到http://localhost:8080/test/
  location /api {
    proxy_pass http://localhost:8080/test/;
  }
  # http://demo.com/test 就会跳转到http://localhost:8080/
  location / {
    proxy_pass http://localhost:8080; 
  }
}
```

##  跨域通信的几种方式

1. JSONP
2. WebSocket
3. Hash
4. postMessage

### JSONP

在 `CORS` 和 `postMessage` 以前，一直都是通过 `JSONP` 来做跨域通信的。

> 通过`<script>标签`的异步加载来实现的。比如说，实际开发中，head标签里，可以通过`<script src="xxx">`加载很多在线的插件。这就是用到了JSONP。

比如，客户端这样写：

```html
 <script src="https://shaohui-jin.github.io/?data=name&callback=jsonp_xxxx"></script>
```

于是，本地要求创建一个 jsonp_xxxx 的全局函数，才能将返回的数据执行出来。

```js
function jsonp(url, params, callback) {
  // 接收接口所需的所有参数及callback的函数名
  let paramList = []
  for (let key in params) {
    paramList.push(`${key}=${params[key]}`)
  }
  // 随机callback函数名称
  let random = Math.random().toString().replace('.', '')
  const callbackName = 'jsonp_' + random
  paramList.push(`callback=${callbackName}`)
  const urlStr = url + '?' + paramList.join('&')
  window[callbackName] = function (param) {      //根据回调名称注册一个全局的函数
    if (callback && typeof callback === 'function') {
      callback(param)
    }
  };
  // 生成element
  const script = document.createElement('script')
  script.src = urlStr
  // 放入body, 立即调用全局函数 callbackName
  document.body.appendChild(script)
  // js拿到后，移除文件
  document.body.removeChild(script)
  // 删除函数或变量
  window[callbackName] = null;  //最后不要忘了删除
}
```

### WebSocket

```js
let ws = new WebSocket('wss://shaohui-jin.github.io'); //创建WebSocket的对象。参数可以是 ws 或 wss，后者表示加密。

//把请求发出去
ws.onopen = function (evt) {
  console.log('Connection open ...');
  ws.send('Hello WebSockets!');
};

//对方发消息过来时，我接收
ws.onmessage = function (evt) {
  console.log('Received Message: ', evt.data);
  ws.close();
};

//关闭连接
ws.onclose = function (evt) {
  console.log('Connection closed.');
};
```

### Hash

url的 `#` 后面的内容就叫 **Hash**。 **Hash** 的改变，页面不会刷新。这就是用 **Hash** 做跨域通信的基本原理。

url的 `?` 后面的内容叫 **Search**。**Search** 的改变，会导致页面刷新，因此不能做跨域通信。

```js {3,6-8}
//伪代码
let B = document.getElementsByTagName('iframe');
B.src = B.src + '#' + 'jsonString';  // 可以把JS 对象，通过 JSON.stringify()方法转成 json字符串，发给 B

// B中的伪代码
window.onhashchange = function () {  //通过onhashchange方法监听，url中的 hash 是否发生变化
  let data = window.location.hash;
}
```

### postMessage

```js
// 窗口A(http:A.com)向跨域的窗口B(http:B.com)发送信息
Awindow.postMessage('data', 'http://B.com'); //这里强调的是B窗口里的window对象

// 在窗口B中监听 message 事件
Bwindow.addEventListener('message', function (event) {   //这里强调的是A窗口里的window对象
  console.log(event.origin);  //获取 ：url。这里指：http://A.com
  console.log(event.source);  //获取：A window对象
  console.log(event.data);    //获取传过来的数据
}, false);
```

