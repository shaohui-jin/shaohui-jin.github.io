---
title: 攻击 - CSRF与XSS
lang: zh-CN
date: 2024-05-14 16:24:16
permalink: /Promotion/JavaScript/CSRFAndXSS/
category: 
  - JavaScript
tag: 
  - Network
headerDepth: 3
---


## CSRF 跨站请求伪造

###  CSRF的基本概念、缩写、全称

> CSRF(Cross-site request forgery)：`跨站请求伪造`。

### CSRF的攻击原理

![](https://shaohui-jin.github.io/picx-images-hosting/blog/Network/CSRF的攻击原理.1hs17wwv01.webp "CSRF的攻击原理" =800x)


> 从上图可以看出，要完成一次CSRF攻击，受害者必须满足两个必要的条件：
> - 登录受信任网站A，并在本地生成Cookie。（如果用户没有登录网站A，那么 网站B 在诱导的时候，请求网站A的api接口时，会提示你登录）
> - 在不登出A的情况下，访问危险网站B（其实是利用了网站A的漏洞）


###  CSRF如何防御

#### Token 验证

服务器发送给客户端一个token，客户端提交的表单中带着这个token，如果这个 token 不合法，那么服务器拒绝这个请求。

#### 隐藏令牌

把 token 隐藏在 http 的 head头中。方法二和方法一有点像，本质上没有太大区别，只是使用方式上有区别。

#### Referer 验证

Referer 指的是页面请求来源。意思是，只接受本站的请求，服务器才做响应；如果不是就拦截。

## XSS 跨域脚本攻击

###  XSS的基本概念、缩写、全称

> XSS(Cross Site Scripting)：`跨域脚本攻击`。

### XSS的攻击原理

XSS攻击的核心原理是：不需要你做任何的登录认证，它会通过合法的操作（比如在url中输入、在评论框中输入），向你的页面注入脚本（可能是js、html代码块等）。

最后导致的结果可能是：

1. 盗用Cookie
2. 破坏页面的正常结构，插入广告等恶意内容
3. D-doss攻击

### XSS的攻击方式

#### 反射型

发出请求时，XSS代码出现在url中，作为输入提交到服务器端，服务器端解析后响应，XSS代码随响应内容一起传回给浏览器，最后浏览器解析执行XSS代码。这个过程像一次反射，所以叫反射型XSS。

#### 存储型

存储型XSS和反射型XSS的差别在于，提交的代码会存储在服务器端（数据库、内存、文件系统等），下次请求时目标页面时不用再提交XSS代码。

### XSS的防范措施（encode + 过滤）

#### 编码：

> 对用户输入的数据进行 `HTML Entity` 编码。

> Encode的作用是将$var等一些字符进行转化，使得浏览器在最终输出结果上是一样的。

比如说这段代码：

```js
<script>alert(1)</script>
```

若不进行任何处理，则浏览器会执行alert的js操作，实现XSS注入。

进行编码处理之后，在浏览器中的显示结果就是`<script>alert(1)</script>`，实现了将`$var`作为纯文本进行输出，且不引起JavaScript的执行。

#### 过滤

- 移除用户输入的和事件相关的属性。如onerror可以自动触发攻击，还有onclick等。（总而言是，过滤掉一些不安全的内容）
- 移除用户输入的Style节点、Script节点、Iframe节点。（尤其是Script节点，它可是支持跨域的呀，一定要移除）

#### 校正

避免直接对`HTML Entity`进行解码。
使用`DOM Parse`转换(它的作用是把文本解析成DOM结构)，校正不配对的`DOM`标签

## CSRF 和 XSS 的区别

### 区别一

- CSRF：需要用户先登录网站A，获取 cookie
- XSS：不需要登录。

### 区别二

- CSRF：是利用网站A本身的漏洞，去请求网站A的api。
- XSS：是向网站 A 注入 JS代码，然后执行 JS 里的代码，篡改网站A的内容。
