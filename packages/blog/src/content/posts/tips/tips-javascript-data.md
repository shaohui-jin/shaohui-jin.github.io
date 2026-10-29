---
title: 数据操作相关
lang: zh-CN
date: 2024-05-18 17:15:31
permalink: /Tips/JavaScript/Data/
category:
  - JavaScript
tag:
  - Tips
---

### 深克隆

#### 解构 

> {...xxx} 只能实现第一层，当有多层的时候还是浅拷贝 

#### JSON

> JSON.parse(JSON.stringify(xxx))  该方法不会拷贝内部函数 

#### 递归 

> 利用递归实现函数

#### structuredClone

```js
let a =  { a: 1, b: 2  }
a.c = a
let b = structuredClone(a)
let c = a
a.a = 2

console.log(a) // {a: 2, b: 2, c: {a: 2, b: 2, c: {…}} }
console.log(b) // {a: 1, b: 2, c: {a: 1, b: 2, c: {…}} }
console.log(c) // {a: 2, b: 2, c: {a: 2, b: 2, c: {…}} }
```

#### MessageChannel

> `MessageChannel`: Channel Messaging API 的 MessageChannel 接口允许创建一个新的消息通道，并通过它的两个 `MessagePort` 属性发送数据。

```js {3-7}
function deepClone(obj) {
  return new Promise(resolve => {
    const { port1, port2 } = new MessageChannel()
    port1.postMessage(obj)
    port2.onmessage = msg => {
      resolve(msg.data)
    }
  })
}

let a = { a: 1, b: 2 }
a.c = a
const b = await deepClone(a)
console.log(a, b, a === b) // <ref *1> { a: 1, b: 2, c: [Circular *1] } <ref *1> { a: 1, b: 2, c: [Circular *1] } false
```

### 长整数加法

```js {4-5,9-10,12-14}
function sum(a, b) {
  let result = ''
  const length = Math.max(a.length, b.length)
  a = a.padStart(length, '0') // 补齐长度
  b = b.padStart(length, '0') // 补齐长度
  let carry = 0 // 进位标识
  for (let i = length - 1; i > 0; i--) {
    const n = +a[i] + +b[i] + carry
    carry = Math.floor(n / 10)
    result = (n % 10) + result
  }
  if (result) {
    result = '1' + result
  }
  return result
}

console.log(sum('2345678901234567', '9874563210369852')) // 1220242111604419
```

### 字符串-码元和码点


| 格式 | 示例 | 码点范围 | 注意                               |
|---|---|---|----------------------------------|
| **\8进制** | `'\141'` | 0-255 | 模板字符串中不可直接使用                     |
| **\x两位16进制** | `'\x61'` | 0-255 | 必须两位                             |
| **\u四位16进制** | `'\u0061'` |	0-65535 | 必须四位                             |
| **\u{16进制}** | `'\u{0061}'` | 0-0x10FFFF | 码点大于 `0xFFFF`，length为2，下标访问值是高低位的值 |


```js {4-5,10,12,14,15}
const str = '123𠀠ÃÄÅÆ'
String.prototype.sliceByPoint = function (pStart, pEnd) {
  let result = ''
  let pIndex = 0 // 码元
  let cIndex = 0 // 码点
  while (1) {
    if(pIndex >= pEnd || cIndex >= this.length) {
      break
    }
    const point = this.codePointAt(cIndex)
    if (pIndex >= pStart) {
      result += String.fromCodePoint(point)
    }
    pIndex++
    cIndex += point > 0xffff ? 2 : 1 // 如果是两个码点的直接+2
  }
  return result
}

str.sliceByPoint(0,5) // '123𠀠Ã'
```

###  字符串-异步替换


```js {28-31,33-35}
String.prototype.asyncReplaceAll = async function (pattern, replacer) {
  // 校验替换参数，如果是文本，调用原本替换方法，同时不是函数的话，报类型错误
  if (typeof replacer === 'string') {
    return this.replaceAll(pattern, replacer)
  } else if (typeof replacer !== 'function') {
    throw new TypeError('The second argument should be an async function or a string')
  }
  // 校验正则参数，同时新建正则实例，不会影响传入的正则
  let reg
  if (typeof pattern === 'string') {
    reg = new RegExp(pattern.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&'), 'g')
  } else if (pattern instanceof RegExp) {
    if (!pattern.global) {
      throw new TypeError('The pattern RegExp should have the global flag set')
    }
    reg = new RegExp(pattern)
  } else {
    throw new TypeError('The pattern should be a string or a RegExp')
  }
  let match // 正则执行结果
  let lastIndex = 0 // 角标
  const result = [] // 文本结果集合
  while ((match = reg.exec(this)) !== null) {
    // [ '55', index: 4, input: '234,55-234_j24-455', groups: undefined ]
    // [ '234', index: 7, input: '234,55-234_j24-455', groups: undefined ]
    // [ '24', index: 12, input: '234,55-234_j24-455', groups: undefined ]
    // [ '455', index: 15, input: '234,55-234_j24-455', groups: undefined ]
    const str = this.slice(lastIndex, match.index) // 获取两次结果之间的文本
    lastIndex = match.index + match[0].length // 更新当前下标值
    const promise = replacer(match[0]) // 执行异步替换函数
    result.push(str, promise)
  }
  result.push(this.slice(lastIndex)) // 防止后面也有字符
  const temp = await Promise.all(result) // 等待异步事件完成
  return temp.join('')
}

const template = `234,55-234_j24-455`
// 模拟异步函数
async function asyncPlaceFn(str) {
  const max = 9,min = 0
  const temp = '一二三四五六七八九十'
  const num = Math.floor(Math.random() * (max - min + 1)) + min;
  return new Promise((resolve) => {
    resolve(temp[num])
  })
}

const result = await template.asyncReplaceAll(/\d+/g, (match) => asyncPlaceFn(match))
console.log(result) // 五,二-五_j七-八
```

