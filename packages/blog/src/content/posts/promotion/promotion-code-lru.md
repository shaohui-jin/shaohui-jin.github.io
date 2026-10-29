---
title: 请使用JS完成一个LRU缓存
date: 2023-02-25 14:57:37
permalink: /Promotion/Code/LRU/
category:
  - JavaScript
tag:
  - JavaScript
---

## 什么是 LRU？

`LRU` 英文全称是 `Least Recently Used`，英译过来就是 `最近最少使用` 的意思。 

### 百度百科


LRU 是一种常用的页面置换算法，选择 `最近` `最久` `未使用` 的页面予以`淘汰`。

该算法赋予`每个页面`一个`访问字段`，用来记录一个页面自上次被访问以来所 `经历的时间t`，当须淘汰一个页面时，选择现有页面中其 `t` 值最大的，即`最近最少使用`的页面予以淘汰。

### 通俗的解释

假如我们有一块`内存`，专门用来缓存我们`最近访问`的网页，访问一个`新网页`，我们就会往内存中添加一个`网页地址`，随着网页的不断增加，内存存满了，这个时候我们就需要考虑删除一些网页了。这个时候我们找到内存中`最早访问`的那个网页地址，然后把它`删掉`。
这一整个过程就可以称之为 L`RU` 算法。

虽然上面的解释比较好懂了，但是我们还有很多地方没有考虑到，比如如下几点：

- 当我们访问内存中`已经存在`的`网址`，那么该网址是否需要`更新`在内存中的`存储顺序`。
- 当我们内存中还没有数据的时候，是否需要执行删除操作。


## 使用场景

`LRU` 算法使用的场景非常多，这里简单举几个例子即可：

1. 操作系统底层的内存管理，其中就包括有 LRU 算法
2. 我们常见的缓存服务，比如 redis 等等
3. 浏览器的最近浏览记录存储，如下图：

总之 LRU 算法的运用场景还是蛮多的，所以我们很有必要掌握它。

## 梳理 LRU 思路

### 特点

1. 需要一块`有限`的`存储空间`，因为无限的化就没必要使用 `LRU` 算法`删除数据`了。
2. `存储空间`里面存储的数据需要是`有序的`，因为必须要`顺序`来`删除数据`，所以可以考虑使用 `Array`、`Map` 数据结构来存储。
3. 能够`删除`或者`添加`以及`获取`到这块存储空间中的`指定数据`。
4. 存储空间`存满`之后，在添加数据时，会自动删除时间`最久远`的那条数据。

### 实现需求

1. 实现一个 `LRUCache` 类型，用来充当`存储空间`
2. 采用 `Map` 数据结构`存储数据`，因为它的存取时间复杂度为 `O(1)`，数组为 `O(n)`
3. 实现 `get` 和 `set` 方法，用来`获取`和`添加`数据
4. 存储空间有`长度限制`，所以`无需`提供`删除方法`，存储满之后，自动删除最久远的那条数据
5. 当使用 `get` 获取数据后，该条数据需要`更新`到`最前面`

现在已经把 `LRU` 算法的特点以及实现思路列了出来，那么接下来就去实现它吧！

## 实现

首先我们定义一个 `LRUCache` 类，封装所有的方法和变量。

```javascript
class LRUCache {
  constructor(lenght) {
    this.length = lenght; // 存储长度
    this.data = new Map(); // 存储数据
  }
  // 存储数据，通过键值对的方式
  set(key, value) { }
  // 获取数据
  get(key) { }
}
```

上段代码只是最简单的一个架子，我们需要去实现具体的 `get` 和 `set` 方法。

```javascript
class LRUCache {
  constructor(lenght) {
    this.length = lenght; // 存储长度
    this.data = new Map(); // 存储数据
  }
  // 存储数据，通过键值对的方式
  set(key, value) {
    const data = this.data;
    if (data.has(key)) {
      data.delete(key)
    }
    data.set(key, value);


    // 如果超出了容量，则需要删除最久的数据
    if (data.size > this.length) {
      const delKey = data.keys().next().value;
      data.delete(delKey);
    }
  }
  // 获取数据
  get(key) {
    const data = this.data;
    // 未找到
    if (!data.has(key)) {
      return null;
    }
    const value = data.get(key); // 获取元素
    data.delete(key); // 删除元素
    data.set(key, value); // 重新插入元素
  }
}
```

上段代码中实现实现了 `get` 和 `set` 方法，下面说一下这两个方法的`实现思路`：

`set` 方法：往 `map` 里面`添加`新数据，如果添加的数据`存在`了，则`先删除`该条数据，然后`再添加`。如果添加数据后`超长`了，则需要删除`最久远`的一条数据。`data.keys().next().value` 便是获取最后一条数据的意思。
`get` 方法：首先从 `map` 对象中`拿出`该条数据，然后`删除`该条数据，最后再重新`插入`该条数据，确保将该条数据移动到`最前面`。

## 测试

存储数据 set：

```javascript
const lruCache = new LRUCache(5);
lruCache.set('name', '小猪课堂');
lruCache.set('age', 22);
lruCache.set('sex', '男');
lruCache.set('height', 176);
lruCache.set('weight', '100');
console.log(lruCache);

//  LRUCache {length: 5, data: Map(5)}
//    data: Map(5)
//      [[Entries]]
//        0: {"name" => "小猪课堂"}
//        1: {"age" => 22}
//        2: {"sex" => "男"}
//        3: {"height" => 176}
//        4: {"weight" => "100"}
//      size: 5
//      [[Prototype]]: Map
//    length: 5
//    [[Prototype]]: Object
```

继续插入数据，此时会超长，代码如下：

```javascript
lruCache.set('grade', '10000');
console.log(lruCache);

//  LRUCache {length: 5, data: Map(5)}
//    data: Map(5)
//      [[Entries]]
//        0: {"age" => 22}
//        1: {"sex" => "男"}
//        2: {"height" => 176}
//        3: {"weight" => "100"}
//        4: {"grade" => "10000"}
//      size: 5
//      [[Prototype]]: Map
//    length: 5
//    [[Prototype]]: Object
```

此时我们发现存储时间最久的 name 已经被移除了，新插入的数据变为了最前面的一个。

我们使用 `get` 获取数据，代码如下：

```javascript
lruCache.get('sex');
console.log(lruCache);

//  LRUCache {length: 5, data: Map(5)}
//    data: Map(5)
//      [[Entries]]
//        0: {"age" => 22}
//        1: {"height" => 176}
//        2: {"weight" => "100"}
//        3: {"grade" => "10000"}
//        4: {"sex" => "男"}
//      size: 5
//      [[Prototype]]: Map
//    length: 5
//    [[Prototype]]: Object
```

我们发现此时 sex 字段已经跑到最前面去了。

## 总结

`LRU` 算法其实逻辑非常的简单，明白了原理之后实现起来非常的简单。

最主要的是需要使用什么`数据结构`来`存储数据`，因为 `map` 的存取非常快，所以采用了它，当然数组其实也可以实现的。还有一些小伙伴使用链表来实现 `LRU`，这当然也是可以的。
