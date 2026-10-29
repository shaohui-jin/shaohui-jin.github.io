---
headerDepth: 3
---

## 后续暂未整理


### vue的computed跟普通的函数有什么区别吗，computed怎么实现缓存的，有看过源码吗

### vue-router实现原理的 history 相关的api

## webpack模块

### webpack中 bundle chunk module 有什么区别

### webpack中 plugin loader 有什么区别


### 同源与跨域

#### 同源策略限制了什么

1. DOM层面：同源策略限制了不同源的js对当前DOM对象的读写操作
2. 数据层面：同源策略限制了不同源站点读取当前站点的Cookies、IndexDB、LocalStorage等数据
3. 网络层面：同源策略限制了数据发送给非同源站点（比如XML HttpRequest、Fetch等无法请求不同源站点

#### 跨域三要素

浏览器限制：即浏览器对跨域行为进行检测和阻止
触发跨域的三要素之一：协议、域名、端口
发起的是xhr请求：即XMLHttpRequest

#### 如何解决跨域

被调用方解决跨域设置 访问控制允许来源
response.addHeader(‘Access-Control-Allow-Origin’,’*’ )
调用方使用Nginx 代理调用方请求，目的是为了和被调用方的域名端口保持一致
jsonp


#### a.com -> b.com 跨域发生在一步

### get请求跨域吗

### 什么时候会发送预检请求

### 网络策略

#### CORS 跨源资源共享


#### CSP 内容安全策略

同源策略是期望让我们的页面引用的资源都来自一个源，对于不是同源的文件，我们默认就是不安全的
CSP的核心思想就是让服务器决定浏览器可以加载那些资源，让服务器决定浏览器是否能够执行加载的JS代码。
Content-Security-Policy: default-src 'self'; img-src *; media-src media1.com media2.com; script-src userscripts.example.com


## Vue3

### ref 和 reactive的用法
### reactive的响应式

## React

### 类组件 和 函数组件 的区别
### useState 和 useRef
### useLayoutEffect


## 代码测试 

## 灵活

### 长列表问题

1. 帧动画加载
2. 冻结数组
3. 触底加载
4. 文档碎片Fragment

