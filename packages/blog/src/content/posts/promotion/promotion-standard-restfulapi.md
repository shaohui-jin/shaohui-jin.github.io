---
title: Restful Api
lang: zh-CN
date: 2022-05-16 11:21:30
permalink: /Promotion/Standard/RestfulApi/
category: 
  - Standard
tag: 
  - RestfulApi
---

## 如何解释什么是RESTful

一个悠闲的周日下午，Ta午觉醒来，又习惯性的抓起这个月的杂志，饶有兴趣地看了起来。

果不其然，看着看着，Ta又对我发难了，“Restful是什么呀，是restaurant的形容词吗，突然就觉得好饿了啊......”

作为一个合格的程序员，我一直把能够将一项技术讲给Ta听，并且能给Ta讲懂，作为我已经掌握了这项技术的标准。

如果我直接回答说，**REST就是Representational State Transfer的缩写呀，翻译为中文就是 表述性状态转移**，那肯定不行。

必须找个合适的机会，把Restful的来龙去脉给Ta形象的描述一遍。

“走，咱们去楼下咖啡厅吃个下午茶吧”，我对Ta说。

“一个芝士蛋糕，一杯拿铁，两条吸管，谢谢”，我对前台的服务员说，然后我们找了个角落坐了下来。

## Level 0 - 面向前台

“刚才我们向前台点了一杯拿铁，这个过程可以用这段文字来描述”，说着，我在纸上写下了这段JSON，虽然Ta不知道什么叫JSON，但理解这段文字对于英语专业8级的Ta，实在再简单不过。

```json
{
  "addOrder": {
    "orderName": "latte"
  }
}
```

“我们通过这段文字，告诉前台，新增一笔订单，订单是一杯拿铁咖啡”，接着，前台给我们返回这么一串回复：

```json
{
  "orderId": "123456"
}
```

“订单ID？还是订单编号？”

“恩恩，就是订单编号”

“那我们就等着前台喊订单123456的客户可以取餐了，然后就可以开吃了！”

“哈哈，你真聪明，不过，在这之前，假设我们有一张会员卡，我们想查询一下这张会员卡的余额，这时候，要向前台发起另一个询问”，我继续在纸上写着：

```json
{
  "queryBalance": {
    "cardId": "886333"
  }
}
```

“查询卡号为886333的卡的余额？”

“真棒！接着，查询的结果返回来了”

```json
{
  "balance": "0"
}
```

“切，没钱......”

“哈哈，没钱，现在我们要跟前台说，这杯咖啡不要了”，我在纸上写到：

```json
{
  "deleteOrder": {
    "orderId": "123456"
  }
}
```

“哼，这就把订单取消啦？”

## Level 1 - 面向资源

“现在这家咖啡店越做越大，来喝咖啡的人越来越多，单靠前台显然是不行的，店主决定进行分工，每个资源都有专人负责，我们可以直接面向资源操作。”

"面向资源？”

“是的，比如还是下单，请求的内容不变，但是我们多了一条消息”，我在纸上画出这次的模型：

```
/orders
{
 "addOrder": {
   "orderName": "latte"
 }
}
```

“多了一个斜杠和orders？这是什么意思？”

“这个表示我们这个请求是发给哪个资源的，订单是一种资源，我们可以理解为是咖啡厅专门管理订单的人，他可以帮我们处理所有有关订单的操作，包括新增订单、修改订单、取消订单等操作”

“Soga...”

“接着还是会返回订单的编号给我们”

```json
{
  "orderId": "123456"
}
```

“下面，我们还是要查询会员卡余额，这次请求的资源变成了cards”

```
/cards
{
  "queryBalance": {
    "cardId": "886333"
  }
}
```

“接下来是取消订单”

“这个我会”，说着，Ta抢走我手上的笔，在纸上写了起来：

```
/orders
{
  "deleteOrder": {
    "orderId": "123456"
  }
}
```

## Level 2 - 打上标签

“接下来，店主还想继续优化他的咖啡厅的服务流程，他发现负责处理订单的员工，每次都要去订单内容里面看是新增订单还是删除订单，还是其他的什么操作，十分不方便，于是规定，所有新增资源的请求，都在请求上面写上大大的 **POST** ，表示这是一笔新增资源的请求”

“其他种类的请求，比如查询类的，用 **GET** 表示，删除类的，用 **DELETE** 表示”

“还有修改类的，修改分为两种，这个第一种，如果修改，无论发送多少次，最后一次修改后的资源，总是和第一次修改后的一样，比如将拿铁改为猫屎，那么用 **PUT** 表示；第二种，如果这个修改，每次修改都会让这个资源和前一次的不一样，比如是加一杯咖啡，那么这种请求用 **PATCH** 或者 **POST** 表示”，一口气讲了这么多，发现Ta有点似懂非懂。

“来，我们再来重复上面那个过程，来一杯拿铁”，我边说边画着：

```
POST /orders
{
  "orderName": "latte"
}
```

"请求的内容简洁多啦，不用告诉店员是addOrder，看到POST就知道是新增"，Ta听的很认真，理解的也很透彻。

"恩恩，返回的内容还是一样"

```json
{
  "orderId": "123456"
}
```

“接着是查询会员卡余额，这次也简化了很多”

```
GET /cards
{
  "cardId": "886333"
}
```

“这个请求我们还可以进一步优化为这样”

```
GET /cards/886333
```

“Soga，直接把要查询的卡号写在后面了”

“没错，接着，取消订单”

```
DELETE /orders/123456
```

## Level 3 - 完美服务

“忽然有一天，有个顾客抱怨说，他买了咖啡后，不知道要怎么取消订单，咖啡厅一个店员回了一句，你不会看我们的宣传单吗，上面不写着：

```
DELETE /orders/{orderId}
```

顾客反问道，谁会去看那个啊，店员不服，又说到，你瞎了啊你......据说后面两人吵着吵着还打了起来...”

“噗，真是悲剧...”

“有了这次教训，店长决定，顾客下了单之后，不仅给他们返回订单的编号，还给顾客返回所有可以对这个订单做的操作，比如告诉用户如何删除订单。现在，我们还是发出请求，请求内容和上一次一样”

```
POST /orders
{
  "orderName": "latte"
}
```

“但是这次返回时多了些内容”

```json
{
  "orderId": "123456",
  "link": {
    "rel": "cancel",
    "url": "/order/123456"
  }
}
```

“这次返回时多了一项link信息，里面包含了一个rel属性和url属性，rel是relationship的意思，这里的关系是cancel，url则告诉你如何执行这个cancel操作，接着你就可以这样子来取消订单啦”

```
DELETE /orders/123456
```

“哈哈，这服务真是贴心，以后再也不用担心店员和顾客打起来了”

“订单123456的客户可以取餐了”，伴随着咖啡厅的广播，我们吃起了下午茶，一杯拿铁，两支吸管......

## 说明

上面讲的Level0 ~ Level3，来自Leonard Richardson提出的Richardson Maturity Model：

- Level0 和 Level1 最大的区别，就是 Level1 拥有了 RESTful 的第一个特征——面向资源，这对构建可伸缩、分布式的架构是至关重要的。同时，如果把 Level0 的数据格式换成XML，那么其实就是 SOAP ，SOAP 的特点是关注行为和处理，和面向资源的 RESTful 有很大的不同。

- Level0 和 Level1 ，其实都很挫，他们都只是把 HTTP 当做一个传输的通道，没有把 HTTP 当做一种传输协议。

- Level2，真正将 HTTP 作为了一种传输协议，最直观的一点就是 Level2 使用了HTTP动词，GET/PUT/POST/DELETE/PATCH....,这些都是 HTTP 的规范，规范的作用自然是重大的，用户看到一个 POST 请求，就知道它不是幂等的，使用时要小心，看到 PUT ，就知道他是幂等的，调用多几次都不会造成问题，当然，这些的前提都是 API 的设计者和开发者也遵循这一套规范，确保自己提供的 PUT 接口是幂等的。

- Level3，关于这一层，有一个古怪的名词，叫 HATEOAS（Hypertext As The Engine Of Application State），中文翻译为“将超媒体格式作为应用状态的引擎”，核心思想就是每个资源都有它的状态，不同状态下，可对它进行的操作不一样。理解了这一层，再来看看 REST 的全称，Representational State Transfer，中文翻译为“表述性状态转移”，是不是好理解多了？

- Level3 的 Restful API，给使用者带来了很大的便利，使用者只需要知道如何获取资源的入口，之后的每个URI都可以通过请求获得，无法获得就说明无法执行那个请求。

- 现在绝大多数的 RESTful 接口都做到了 Level2 的层次，做到 Level3 的比较少。当然，这个模型并不是一种规范，只是用来理解 RESTful 的工具。所以，做到了 Level2 ，也就是面向资源和使用 HTTP 动词，就已经很 RESTful 了。RESTful 本身也不是一种规范，我比较倾向于用“风格"来形容它。如果你想深入了解Level3，可以阅读《Rest in Practice》第五章。

> 我讲的时候，用的数据格式是JSON，但是要强调一点，RESTful 对数据格式没有限制，就算你用的是XML或者其他格式，只要符合上面提到的几个特征，也算RESTful。


## 规范

RESTful 是目前最流行的 API 设计规范，用于 Web 数据接口的设计。

它的大原则容易把握，但是细节不容易做对。本文总结 RESTful 的设计细节，介绍如何设计出易于理解和使用的 API。

### URL 设计

#### 动词 + 宾语

RESTful 的核心思想就是，客户端发出的数据操作指令都是"动词 + 宾语"的结构。比如: **GET /articles** 这个命令，GET是动词，/articles是宾语。

动词通常就是五种 HTTP 方法，对应 CRUD 操作。

```
- GET：读取（Read）
- POST：新建（Create）
- PUT：更新（Update）
- PATCH：更新（Update），通常是部分更新
- DELETE：删除（Delete）
- 根据 HTTP 规范，动词一律大写。
```

#### 动词的覆盖

有些客户端只能使用 GET 和 POST 这两种方法。服务器必须接受 POST 模拟其他三个方法（PUT、PATCH、DELETE）。

这时，客户端发出的 HTTP 请求，要加上 **X-HTTP-Method-Override** 属性，告诉服务器应该使用哪一个动词，覆盖POST方法。

```http request
POST /api/Person/4 HTTP/1.1  
X-HTTP-Method-Override: PUT
```

上面代码中，X-HTTP-Method-Override 指定本次请求的方法是PUT，而不是POST。

#### 宾语必须是名词

宾语就是 API 的 URL，是 HTTP 动词作用的对象。它应该是名词，不能是动词。比如: **/articles** 这个 URL 就是正确的，而下面的 URL 不是名词，所以都是错误的。

```
/getAllCars
/createNewCar
/deleteAllRedCars
```

#### 复数 URL

既然 URL 是名词，那么应该使用复数，还是单数？

这没有统一的规定，但是常见的操作是读取一个集合，比如 **GET /articles**（读取所有文章），这里明显应该是复数。

为了统一起见，建议都使用复数 URL，比如 **GET /articles/2** 要好于 **GET /article/2** 。

#### 避免多级 URL

常见的情况是，资源需要多级分类，因此很容易写出多级的 URL，比如获取某个作者的某一类文章。

```http request
GET /authors/12/categories/2 HTTP/1.1
```

这种 URL 不利于扩展，语义也不明确，往往要想一会，才能明白含义。

更好的做法是，除了第一级，其他级别都用查询字符串表达。

```http request
GET /authors/12?categories=2 HTTP/1.1
```

下面是另一个例子，查询已发布的文章。你可能会设计成下面的 URL。

```http request
GET /articles/published HTTP/1.1
```

查询字符串的写法明显更好。

```http request
GET /articles?published=true HTTP/1.1
```

### 状态码

#### 状态码必须精确

客户端的每一次请求，服务器都必须给出回应。回应包括 **HTTP 状态码** 和 **数据** 两部分。

HTTP 状态码就是一个三位数，分成五个类别。
```
- 1xx：相关信息
- 2xx：操作成功
- 3xx：重定向
- 4xx：客户端错误
- 5xx：服务器错误
```

这五大类总共包含100多种状态码，覆盖了绝大部分可能遇到的情况。每一种状态码都有标准的（或者约定的）解释，客户端只需查看状态码，就可以判断出发生了什么情况，所以服务器应该返回尽可能精确的状态码。

API 不需要1xx状态码，下面介绍其他四类状态码的精确含义。

#### 2xx 状态码

200状态码表示操作成功，但是不同的方法可以返回更精确的状态码。

```
- GET: 200 OK
- POST: 201 Created
- PUT: 200 OK
- PATCH: 200 OK
- DELETE: 204 No Content
```

上面代码中，POST返回201状态码，表示生成了新的资源；DELETE返回204状态码，表示资源已经不存在。

此外，202 Accepted状态码表示服务器已经收到请求，但还未进行处理，会在未来再处理，通常用于异步操作。下面是一个例子。

```http request
HTTP/1.1 202 Accepted

{
  "task": {
    "href": "/api/company/job-management/jobs/2130040",
    "id": "2130040"
  }
}
```

#### 3xx 状态码

API 用不到301状态码（永久重定向）和302状态码（暂时重定向，307也是这个含义），因为它们可以由应用级别返回，浏览器会直接跳转，API 级别可以不考虑这两种情况。

API 用到的3xx状态码，主要是303 See Other，表示参考另一个 URL。它与302和307的含义一样，也是"暂时重定向"，区别在于 **302和307用于GET请求** ，而 **303用于POST、PUT和DELETE请求**。收到303以后，浏览器不会自动跳转，而会让用户自己决定下一步怎么办。下面是一个例子。

```http request
HTTP/1.1 303 See Other
Location: /api/orders/12345
```

#### 4xx 状态码

4xx状态码表示客户端错误，主要有下面几种。

```
400 Bad Request：服务器不理解客户端的请求，未做任何处理。
401 Unauthorized：用户未提供身份验证凭据，或者没有通过身份验证。
403 Forbidden：用户通过了身份验证，但是不具有访问资源所需的权限。
404 Not Found：所请求的资源不存在，或不可用。
405 Method Not Allowed：用户已经通过身份验证，但是所用的 HTTP 方法不在他的权限之内。
410 Gone：所请求的资源已从这个地址转移，不再可用。
415 Unsupported Media Type：客户端要求的返回格式不支持。比如，API 只能返回 JSON 格式，但是客户端要求返回 XML 格式。
422 Unprocessable Entity ：客户端上传的附件无法处理，导致请求失败。
429 Too Many Requests：客户端的请求次数超过限额。
```


#### 5xx 状态码

5xx状态码表示服务端错误。一般来说，API 不会向用户透露服务器的详细信息，所以只要两个状态码就够了。

```
500 Internal Server Error：客户端请求有效，服务器处理时发生了意外。
503 Service Unavailable：服务器无法处理请求，一般用于网站维护状态。
```

### 服务器回应

#### 不要返回纯本文

API 返回的数据格式，不应该是纯文本，而应该是一个 JSON 对象，因为这样才能返回标准的结构化数据。所以，服务器回应的 HTTP 头的 **Content-Type** 属性要设为 **application/json**。

客户端请求时，也要明确告诉服务器，可以接受 JSON 格式，即请求的 HTTP 头的ACCEPT属性也要设成application/json。下面是一个例子。

```http request
GET /orders/2 HTTP/1.1 
Accept: application/json
```

#### 发生错误时，不要返回 200 状态码

有一种不恰当的做法是，即使发生错误，也返回200状态码，把错误信息放在数据体里面，就像下面这样。

```http request
HTTP/1.1 200 OK
Content-Type: application/json

{
  "status": "failure",
  "data": {
    "error": "Expected at least two items in list."
  }
}
```

上面代码中，解析数据体以后，才能得知操作失败。

这张做法实际上取消了状态码，这是完全不可取的。正确的做法是，状态码反映发生的错误，具体的错误信息放在数据体里面返回。下面是一个例子。

```http request
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
  "error": "Invalid payoad.",
  "detail": {
     "surname": "This field is required."
  }
}
```

#### 提供链接

API 的使用者未必知道，URL 是怎么设计的。一个解决方法就是，在回应中，给出相关链接，便于下一步操作。这样的话，用户只要记住一个 URL，就可以发现其他的 URL。这种方法叫做 HATEOAS。

> 举例来说，GitHub 的 API 都在 api.github.com 这个域名。访问它，就可以得到其他 URL。

```json
{
  "feeds_url": "https://api.github.com/feeds",
  "followers_url": "https://api.github.com/user/followers",
  "following_url": "https://api.github.com/user/following{/target}",
  "gists_url": "https://api.github.com/gists{/gist_id}",
  "hub_url": "https://api.github.com/hub"
}
```

上面的回应中，挑一个 URL 访问，又可以得到别的 URL。对于用户来说，不需要记住 URL 设计，只要从 api.github.com 一步步查找就可以了。

HATEOAS 的格式没有统一规定，上面例子中，GitHub 将它们与其他属性放在一起。更好的做法应该是，将相关链接与其他属性分开。

```http request
HTTP/1.1 200 OK
Content-Type: application/json

{
  "status": "In progress",
   "links": {[
    { "rel":"cancel", "method": "delete", "href":"/api/status/12345" } ,
    { "rel":"edit", "method": "put", "href":"/api/status/12345" }
  ]}
}
```
