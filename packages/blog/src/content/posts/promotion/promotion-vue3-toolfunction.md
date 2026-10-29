---
title: Vue3 工具函数源码解析
date: 2022-07-11 13:41:55
permalink: /Promotion/Vue3/ToolFunction/
category:
  - VUE
  - VUE3
tag:
  - VUE
---

:::info Tips
具体文件是 `shared.cjs.prod.js` 和 `shared.cjs.js` 文件下针对源码中的工具函数和较冷门知识点的提取分析。

vue 版本为 3.2.31
:::

## 常量定义

### EMPTY_OBJ、EMPTY_ARR 对象

typescript是通过 `readonly` 的方式来定义一个冻结对象的类型的， `readonly` 是只读修饰符。 `Object.freeze` 冻结对象属性功能。

- 源码实现

```typescript
export declare const EMPTY_OBJ: {
    readonly [key: string]: any;
} = __DEV__ ? Object.freeze({}) : {}


export declare const EMPTY_ARR: {
    readonly [key: string]: any;
} = __DEV__ ? Object.freeze([]) : []
```

- 使用案例

```typescript
let emptyObj = Object.freeze({
  props: {
    name: 'jack',
    age: 12
  },
  total: 1000
})
// 无法修改第一层属性
emptyObj.total = 0
console.log('emptyObj.total', emptyObj.total)
// 可以修改第二层对象的属性
emptyObj.props.age = 13
console.log('emptyObj.props.age', emptyObj.props.age)
// 无法新建本不存在的属性
emptyObj.props2 = {}
console.log('emptyObj.props2', emptyObj.props2)


let arr = Object.freeze([])
let arr1 = Object.freeze([{ name: 'jack' }])
// arr.push(1) // 无法添加元素, 会直接报错
arr.length = 3
console.log('arr', arr)
// 对象内的属性可以修改
arr1[0].name = 'rose'
console.log('arr1[0].name', arr1[0].name) // rose
```

### NOOP 空函数

定义一个空函数，而不是 `function () {}` 这样定义，是为了方便压缩。

- 源码实现

```typescript
export const NOOP = () => {}
```

- 使用案例

```typescript
let obj = function getName (cb => NOOP) {}
```

### NO 返回false常量函数

永远返回 `false` 的函数, 就是一个返回 `boolean` 值的函数的备选项

- 源码实现

```typescript
export const NO = () => false
```


## 函数定义

### toTypeString  复杂数据类型区分

`toTypeString` 主要是返回数据的类型，使用了 `Object.prototype.toString.call` 的方法，实现了对复杂数据类型的区分

- 源码实现

```typescript
const objectToString = Object.prototype.toString;
const toTypeString = (value) => objectToString.call(value);
```

- 使用案例

```typescript
let arr = []
let obj = {}
let map = new Map()
let set = new Set()
console.log(toTypeString(obj)) // [object Object]
console.log(toTypeString(arr)) // [object Array]
console.log(toTypeString(map)) // [object Map]
console.log(toTypeString(set)) // [object Set]
```

### toRawType 取出数据类型

这里需要注意的是前面的 `toTypeString` 返回了 `[object xxType]`，现在则是使用 `slice` 方法来将 `xxType` 取出

- 源码实现

```typescript
export const toRawType = (value: unknown): string => {
  // extract "RawType" from strings like "[object RawType]"
  return toTypeString(value).slice(8, -1)
}
```

- 使用案例

```typescript
const objectToString = Object.prototype.toString
const toTypeString = (value) => objectToString.call(value)

const toRawType = (value) => toTypeString(value).slice(8, -1)

const str = toRawType('')
console.log('str', str) // 'String'
const num = toRawType(123)
console.log('num', num) // 'Number'
```

### isOn 事件名on判断

利用正则来判断当前的事件名是否是 `on + EventName` 的格式

注意: `^` 在正则开头表示首位占位符，其他地方都是非的含义，`[^a-z]` 表示不是 a 到 z 的字母

- 源码实现

```typescript
const onRE = /^on[^a-z]/
export const isOn = (key: string) => onRE.test(key)
```

### isModelListener 事件名onUpdate判断

检验监听事件名是否是`onUpdate:`开头

- 源码实现

```typescript
export const isModelListener = (key: string) => key.startsWith('onUpdate:')
```

> `startsWith` 是 `es6` 当中的方法，可以获取一个字符串是否以指定的子字符串开头，返回Boolean类型

- 使用案例

```typescript
console.log(isModeListener('onUpdate:change'))
```

### extend 合并对象

- 源码实现

```typescript
const extend = Object.assign
```

- 使用案例

```typescript
let obj1 = {name: 'jack'}
let obj2 = {name: 'rose', age: 18}

let obj = extend(obj1, obj2)
console.log('obj', obj) // { name: 'rose', age: 18 }
// 注意, 原本的obj1也会被改变
console.log('obj1', obj1) // { name: 'rose', age: 18 }
```

### remove 删除数组元素

删除数组中的某个元素，但是使用splice方法，其实是比较消耗性能的。

- 源码实现

```typescript
export const remove = <T>(arr: T[], el: T) => {
  const i = arr.indexOf(el)
  if (i > -1) {
    arr.splice(i, 1)
  }
}
```

- 使用案例

```typescript
let arr = [1, 2, 3]
remove(arr, 2) // [ 1, 3 ] 'arr数据'
console.log(arr, 'arr数据')
```

:::info Tips
axios源码中 `lib/core/interceptorManager.js` , 使用以下的方式删除数组中的元素:

```typescript
InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};

// 第46行
/**
 * Iterate over all the registered interceptors
 *
 * This method is particularly useful for skipping over any
 * interceptors that may have become `null` calling `eject`.
 *
 * @param {Function} fn The function to call for each interceptor
 */
InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};
```
:::

### hasOwn 是否包含属性

判断一个属性是否是一个对象本身的属性，利用了 `Object.prototype.hasOwnProperty.call` 的形式来实现功能

- 源码实现

```typescript
const hasOwnProperty = Object.prototype.hasOwnProperty

/**
 * Vue3 的写法
 */
export const hasOwn = (
  val: object,
  key: string | symbol
): key is keyof typeof val => hasOwnProperty.call(val, key)

/**
 * Vue3.2 的写法
 */
export const hasOwn = (
  val: object,
  key: string | symbol
): key is never => hasOwnProperty.call(val, key)
```

:::info Tips
- `is` 关键字：它被称为类型谓词，用来判断一个变量属于某个接口或类型，比如：

```typescript
const isNumber = (val: unknown): val is number => typeof val === 'number'
const isString = (val: unknown): val is string => typeof val === 'string'
```

- `keyof` 关键字：用于获取某种类型的所有键，其返回类型是联合类型，比如：

```typescript
interface Person {
    name: string;
    age: number;
}
type K = keyof Person; // "name" | "age"
```

- `typeof` 关键字：js 中的 typeof 只能获取几种类型，而在 ts 中 typeof 用来获取一个变量声明或对象的类型，比如：

```typescript
interface Person {
  name: string;
  age: number;
}
 
const sem: Person = { name: 'semlinker', age: 30 };
type Sem = typeof sem; // -> Person
```
:::

### isArray 是否数组

- 源码实现

```typescript
export const isArray = (arg: any) : arg is any[] => Array.isArray(arg);
```

- 使用案例

```typescript
const fakeArray = { __proto__: Array.prototype, length: 0 }

console.log('isArray(fakeArray)', isArray(fakeArray)) // false
console.log('fakeArray instanceof Array', fakeArray instanceof Array) // true
```

### isMap/isSet 是否Map/Set 

- 源码实现

```typescript
export const isMap = (val: unknown): val is Map<any, any> => toTypeString(val) === '[object Map]'
export const isSet = (val: unknown): val is Set<any> => toTypeString(val) === '[object Set]'
```

#### Map

Map 是一种 `es6` 提供的新的一种键值对数据结构的数据类型，相比于对象，它的键不同于对象那种只能是字符串的键，可以是各种类型。

- 基础方法

> `get` 获取元素， 
> `set` 新增元素成员， 
> `has` 是否包含某元素， 
> `delete` 删除元素成员， 
> `clear` 清空所有元素， 
> `Array.from` 转为普通的二维数组

```typescript
// 1. 定义一个函数作为键
let fn = function func() { console.log('this is function') }
let m = new Map([['jack', 100], [fn, '我是函数的值']]) // 形式上, Map类型是二维数组

// 2. get方法获取元素
let result = m.get(fn)
console.log('func -> result', result)
// func -> result 我是函数的值

// 3. 通过Array.from可以转为普通的二维数组
let arr = Array.from(m)
console.log('func -> arr', arr)
// func -> arr [ [ 'jack', 100 ], [ [Function: func], '我是函数的值' ] ]

// 4. set方法新增元素成员
let obj = { name: 'jack' }
m.set(obj, '28岁了都')
console.log('set新元素之后', m)
// set新元素之后 Map {
// 'jack' => 100,
//  [Function: func] => '我是函数的值',
//  { name: 'jack' } => '28岁了都' }

// 5. has 判断是否包含某元素
m.has(fn)
console.log('func -> m.has(fn)', m.has(fn)) // true

// 6. delete删除元素成员
m.delete(obj)
console.log('删除后的结果', Array.from(m))
// 删除后的结果 [ [ 'jack', 100 ], [ [Function: func], '我是函数的值' ] ]

// 7. clear清空所有元素
m.clear()
console.log('清空后的结果', m)
```

- 遍历相关的方法

> `keys` 返回包含映射中 **键** 的迭代器对象，`entries` 返回包含映射中的 **键值** 的迭代器对象，`values` 返回包含映射中的 **值** 的迭代器对象，`forEach`

```typescript
let fn = function func() { console.log('this is function') }
let m = new Map([['jack', 100], [fn, '我是函数的值']])
m.forEach(item => {
  console.log('forEach -> item', item)
})
/**
 * forEach -> item 100
 * forEach -> item 我是函数的值
 */


// 1. keys 方法, 返回包含映射中键的迭代器对象
let it = m.keys()
console.log('it', it) // it [Map Iterator] { 'jack', [Function: func] }
console.log(it.next().value) // jack
console.log(it.next().value) // [Function: func]
console.log(it.next().value) // undefined
// 或者
for (let key of it) {
  console.log('for...of... -> key', key)
}
/**
 * 
  for...of... -> key jack
  for...of... -> key function func() {
    console.log('this is function');
  }
 */

// 2. entries 方法, 返回包含映射中的键值的迭代器对象
let it = m.entries()
console.log(it.next().value) // [ 'jack', 100 ]
console.log(it.next().value) // [ [Function: func], '我是函数的值' ]
console.log(it.next().value) // undefined
// 或者
for (let item of it) {
  console.log('for...of... -> entries', item)
}
/**
 * for...of... -> entries [ 'jack', 100 ]
 * for...of... -> entries [ [Function: func], '我是函数的值' ]
 */

// 3. values 方法, 返回包含映射中的值的迭代器对象
let it = m.values()
console.log(it.next().value) // 100
console.log(it.next().value) // 我是函数的值
console.log(it.next().value) // undefined
// 或者
for (let value of it) {
	console.log('for...of... -> value', value)
}
// /**
//  * for...of... -> value 100
//  * for...of... -> value 我是函数的值
//  */
```


::: theorem Map和Object的区别:
- Map的键可以是`任意类型`, Object只能是 `String` 或者 `Symbol`
- Map的可以通过`size`属性获取元素数量, Object则必须`手动计算`
- Map在频繁`增减键值对`的场景下, `性能较好`
- Map中的数据是`有序`的, 而Object则是`无序`的
:::

####  Set

Set类型是`es6`提供的一种新的数据类型，它允许你存入 `任意类型` 的 `唯一值` ，无论是 `基本数据类型` 还是 `引用类型` ，尽管NaN !== NaN，Set仍然认为这是同一个数据。

- 基础方法

> `add` 新增元素成员， 
> `has` 是否包含某元素， 
> `delete` 删除元素成员， 
> `clear` 清空所有元素， 
> `Array.from` 转为数组

```typescript
// 1. NaN
let set = new Set([NaN, NaN])
// 尽管NaN !== NaN, 但是, 在Set中仍然被认为是相同的数据
console.log('NaN === NaN', NaN === NaN) // false
console.log('set', set) // Set {NaN}

// 2.add 方法
let set = new Set()
let person1 = {
  name: '大明'
}
let person2 = {
  name: '小明'
}
set.add(person1)
set.add(person2)
console.log('add的结果', set)
// add的结果 Set { { name: '大明' }, { name: '小明' } }

console.log('Array.from', Array.from(set))
// Array.from [ { name: '大明' }, { name: '小明' } ]

// 3. delete方法
set.delete(person1)
console.log('delete之后', set) // delete之后 Set { { name: '小明' } }

// 4. has方法
console.log('has person1 -->', set.has(person1))
// has person1 --> false
console.log('has person2 -->', set.has(person2))
// has person2 --> true

// 5.清空
set.clear()
console.log('set clear -->', set) // set clear --> Set {}
```

- 遍历相关的方法

> 主要有`keys`，`entries`，`values`，`forEach`

```typescript
// 1. keys方法
let it = set.keys()
console.log(it.next().value) // { name: '大明' }
console.log(it.next().value) // { name: '小明' }
console.log(it.next().value) // undefined
// 或者
for (let key of it) {
  console.log('for...of... -> keys', key)
}
/**
 * for...of... -> keys { name: '大明' }
 * for...of... -> keys { name: '小明' }
 */

// 2. entries 方法
let it = set.entries() // SetIterator {{…} => {…}, {…} => {…}}
for (let key of it) {
  console.log('for...of... -> entries', key)
}
/**
 * for...of... -> entries [ { name: '大明' }, { name: '大明' } ]
 * for...of... -> entries [ { name: '小明' }, { name: '小明' } ]
 */

// 3. values
let it = set.values() // SetIterator {{…}, {…}}
console.log(it.next().value) // { name: '大明' }
console.log(it.next().value) // { name: '小明' }
console.log(it.next().value) // undefined
// 或者
for (let key of it) {
  console.log('for...of... -> values', key)
}
/**
 * for...of... -> values { name: '大明' }
 * for...of... -> values { name: '小明' }
 */

// 4. forEach
set.forEach(item => {
  console.log('item', item)
})
/**
 * item { name: '大明' }
 * item { name: '小明' }
 */
```

### isDate 是否时间

- 源码实现 <Badge text="有风险" type="error"/>

```typescript
export const isDate = (val: unknown): val is Date => val instanceof Date
```

这么做有一定的漏洞，但一般还是可以判断

```typescript
const isDate = (val) => val instanceof Date
let date = new Date()
let result = isDate({ __proto__: Date.prototype, length: 0 })
console.log('result', result) // result true
```

### isFunction 是否函数

- 源码实现

```typescript
export const isFunction = (val: unknown): val is Function => typeof val === 'function'
```

### isObject 是否对象

- 注意事项

> `typeof null === 'object'`，所以必须确保val不为null。
>
> `Record`是 `typescript` 中的一种工具类型，它的作用是限制一个对象的键值类型，其两个泛型参数就是一个限制键类型，一个限制值类型。

- 源码实现

```typescript
export const isObject = (val: unknown): val is Record<any, any> => val !== null && typeof val === 'object'
```

:::info Tips
```typescript
// 第1469行代码
type Record<K extends keyof any, T> = {
    [P in K]: T;
};
// 从这里我们可以看出, 键的类型只能从K(第一个泛型参数中得到), 而值的类型只能是T
```

Record使用案例:

```typescript
type Animal = 'dog' | 'cat' | 'pig'

interface Info {
  name: string;
  age: number
}

type AnimalInfo = Record<Animal, Info>

// animalInfo的键, 只能是dog, cat, pig中的一个
const animalInfo: AnimalInfo = {
  dog: {
    name: '阿旺',
    age: 2
  },
  cat: {
    name: '阿花',
    age: 1
  },
  pig: {
    name: '二师兄',
    age: 3
  }
}
```
:::

### isPlainObject 是否纯粹对象

该方法作用是，判断一个对象`是否是纯粹的对象`，前面一个isObject方法，`isObject([])是true`，`isObject({})也是true`，而此处的isPlainObject则仅限于真正的Object。

- 源码实现

```typescript
export const isPlainObject = (val: unknown): val is object => toTypeString(val) === '[object Object]'
```

### isPromise 是否Promise

判断是否是promise对象，这里要注意的是Promise的类型，typescript 中 `Promise<T>` 类型，接受一个`泛型参数T`，用以确定这个promise对象最终`resolve的值的类型`。

- 源码实现

```typescript
export const isPromise = <T = any>(val: unknown): val is Promise<T> => isObject(val) && isFunction(val.then) && isFunction(val.catch)
```

:::info Tips
我们如何控制声明Promise返回值的类型:

- 使用这里的泛型方式声明

```typescript
let promiseString:Promise<string> = new Promise(resolve => resolve('123'))
let promiseNumber:Promise<number> = new Promise(resolve => resolve('123'))
```

- 单独声明resolve方法

```typescript
let promiseString = new Promise((resolve: (params: string) => void, reject) => resolve('123'))
```
:::

### isIntegerKey 是否数字型的字符串

主要是用于判断是否是数字型的字符串，形如: '123'，'888' 则为true，'123hello'则为false。

- 源码实现

```typescript
export const isString = (val: unknown): val is string => typeof val === 'string'
export const isIntegerKey = (key: unknown) =>
  isString(key) &&
  key !== 'NaN' &&
  key[0] !== '-' &&
  '' + parseInt(key, 10) === key
isIntegerKey('888hello') // false
```

:::info Tips
parseInt 的第一个参数大家都很熟悉，就是要被转换的字符串，但是第二个出现的概率可能相对偏低，第二个表示的就是`进制`，一般`默认是10`，也就是十进制！
这里指明进制数是为了保证在不同的环境下运行结果能保证一致！

```typescript
// 以二进制的方式解析'010'
const result = parseInt('010', 2)
console.log('result', result) // 2
// 我们都知道，如果 '010'是二进制，那么，转为10进制，就是使用: 0*2^0 + 1*2^1 + 0*2^2 结果自然就是2，同理我们可以知道用三进制来解析：
const result = parseInt('010', 3) // 结果自然就是3
```

<Badge text="思考"/>

 第二个参数的取值最大能达到多少？

<Badge text="猜测" type="warning"/> 

我们知道，十进制最大的数也就是9，那么如果我要解析十进制以上的数字呢？
最常见的就是十六进制。不错，我们会用字母代替！也就是a-z，共26个字母，那么我们大胆猜测下，最大取值，是不是就是36？

```typescript
const result = parseInt('010', 36)
console.log('result', result) // 36
// 那再往上加一呢:
const result = parseInt('010', 37)
console.log('result', result) // NaN
```
由此我们得知, parseInt最多只能取到36!
:::

### makeMap 构造带逗号的字符串校验字符函数

该方法主要是接收一个`带逗号的字符串`，将该字符串以`逗号拆分`为一个个子字符串，再用这些子字符串作为一个对象的`键`，`值全部为true`；返回一个方法，这个方法可以检测出这个方法接收的参数是否是对象中的键。

- 源码实现

```typescript
export function makeMap(
  str: string,
  expectsLowerCase?: boolean
): (key: string) => boolean {
  const map: Record<string, boolean> = Object.create(null)
  const list: Array<string> = str.split(',')
  for (let i = 0; i < list.length; i++) {
    map[list[i]] = true
  }
  return expectsLowerCase ? val => !!map[val.toLowerCase()] : val => !!map[val]
}
```

- 难点解析

类型上来看，其实就是一个这样的方法：`(params1:string, params2?:boolean) => (key: string) => boolean`，其返回了一个检测函数，该检测函数接受一个字符串，返回是该字符串是否存在！

- 使用案例

```typescript
const fn = makeMap('dog,cat,bird')
const result1 = fn('fish')
console.log(result1) // false, 不存在fish
const result2 = fn('dog')
console.log(result2) // true, 存在dog
```

:::info Tips
<Badge text="思考"/> 

创建对象为何要用 `Object.create(null)` 而不是直接使用 `const map = {}` 

<Badge text="解答" type="warning"/>

`Object.create(proto, [propertiesObject])`，返回一个新的对象。第一个参数`proto`，将会被挂在到`新对象的原型对象`上。
第二个参数`propertiesObject`，对应了`Object.defineProperties`的第二个参数，也就是所谓的属性描述符:

- value 属性的值
- writable 是否可以写，默认为true
- enumerable  属性是否可枚举, 所谓可枚举，就是能够被以下方法访问到
- for...in 能将该属性遍历出来
- Object.keys 能将该属性包含在返回的数组中
- JSON.stringify 能够将其变为JSON字符串的一部分
- configurable 默认true，如果为false，则属性无法被改变，无法被删除，无法修改属性描述符
- set 存值函数
- get 取值函数


我们可以看到，`Object.create(null)`创建的对象更为纯粹，当方法执行到`map[val.toLowerCase()]`时，不会受到`__proto__`的影响。
:::

### cacheStringFunction 缓存结果函数

函数`返回一个函数`，这个函数接收`一个字符串`参数，如果第一次传入了一个参数，计算结果就会被`闭包``缓存`起来，下次再遇到相同参数的时候，就不会再走`fn方法重新计算`了。
本质上是一个`单例模式`，利用闭包，保存了之前的计算结果。

- 源码实现

```typescript
const cacheStringFunction = <T extends (str: string) => string>(fn: T): T => {
  const cache: Record<string, string> = Object.create(null)
  return ((str: string) => {
    const hit = cache[str]
    return hit || (cache[str] = fn(str))
  }) as any
}
```

- 使用案例

```typescript
let fn1 = cacheStringFunction((key) => {
  console.log('通过了计算得到', key + 'world')
  return key + 'world'
})
console.log(fn1('hello'))
console.log(fn1('hello'))
console.log(fn1('goodbye'))
/**
 * 
 * 通过了计算得到 helloworld
 * helloworld
 * helloworld
 * 通过了计算得到 goodbyeworld
 * goodbyeworld
 */
```

:::info Tips
<Badge text="思考"/>

为何返回的函数要被`as any`？去掉会如何？

<Badge text="猜测" type="warning"/> 

`(str:string) => string` 是符合 `T` 的类型要求，但是，`T`也可以是另一种形式的`子类`，也就无法保证和参数的类型完全一致。举个例子，假如以下函数不报错：

```typescript
let testGenerics = <T extends { length: number }>(params: T, minNum: number): T =>{
  if (params.length >= minNum) {
    return params
  } else {
    return { length: minNum } as T
  }
}
```

那我们直接运行下

```typescript
let data = testGenerics([1,2,3], 8)
// 此时的data,讲道理应该是Array类型
data.slice(0,1) // 直接报错, 因为根本就不是数组!
```
:::


### camelize 驼峰转化

- 源码实现

```typescript
const camelizeRE = /-(\w)/g
export const camelize = cacheStringFunction((str: string): string => {
  return str.replace(camelizeRE, (_, c) => (c ? c.toUpperCase() : ''))
})
```

- 使用案例

```typescript
let str = 'on-handle-click'
const result = camelize(str)
console.log('result', result) // result onHandleClick
```

:::info Tips
关于replace的使用: `replace(regexp|substr, newSubStr|function)`

> 第一个参数既可以是`字符串`，也可以是`正则`，总之就是需要`被替换的字符串的文本模式`。
>
> 第二个参数，它既可以是用于`替换掉`第一个参数在原字符串中的匹配部分的`字符串`（该字符串中可以内插一些`特殊的变量名`），也可以是一个用来创建新子字符串的`函数`，该函数的返回值将替换掉第一个参数匹配到的结果。

- 正则替换表达式

> $& 用于无分组的情况

```typescript
let str = '史记真是史家之绝唱,无韵之离骚'
let result = str.replace('史记', '《$&》') // 这里的$&就是`史记`二字, 也就是用《史记》代替史记
console.log(result) // 《史记》真是史家之绝唱,无韵之离骚
```

> $` 匹配到的数据的左边字符串

```typescript
let str = '研究一下replace该怎么用'
let result = str.replace('replace', ',$`前端技术') // 这里的 $` === 研究一下，也就是用 ',研究一下前端技术' 代替 'replace' 
console.log(result) // 研究一下,研究一下前端技术该怎么用
```

> $' 和 $` 相反，代表匹配到的数据的右边字符串

```typescript
let str = '研究一下replace该怎么用'
let result = str.replace('replace', ",vue3$',") // 此处的 $' === 该怎么用，也就是用 ',vue3该怎么用,' 代替 'replace'
console.log(result) // 研究一下,vue3该怎么用,该怎么用
```

> $1,$2,$3,.....$n，表示第几个分组
```typescript
let str = '西瓜,番薯,大番薯,咸鱼,萝卜,苹果'
let result = str.replace(/(西瓜)(.*)(苹果)/, "$1(水果)$2$3(水果)")
/**
 * $1 === 西瓜
 * $2 === ,番薯,大番薯,咸鱼,萝卜,
 * $3 === 苹果
 */
console.log('result', result) // 西瓜(水果),番薯,大番薯,咸鱼,萝卜,苹果(水果)
```

- 函数

```typescript
let str = '今年是2022年,时间好快'
let result = str.replace(/(今年).+?(时间).*/g, function () {
  console.log(arguments)
  /**
   * 0: "今年是2022年,时间好快"
   * 1: "今年"
   * 2: "时间"
   * 3: 0
   * 4: "今年是2022年,时间好快"
   */
})
```

可以得出结论，那就是`有分组`的情况下，第二个参数开始就是`依次展示`每次分组`匹配到的内容`。
所以，我们回到源码中，此处的`c`，实际上就是前面说的每次匹配到的`第一个分组`，本案例中依次为：h, c两个，然后将其改为大写，直接return，就能将`-x`替换为`X`，从而实现我们的目标。

```typescript
let str = 'on-handle-click'
let result = str.replace(/-(\w)/g, function () {
  console.log(arguments)
  // { '0': '-h', '1': 'h', '2': 2, '3': 'on-handle-click' }
  // { '0': '-c', '1': 'c', '2': 9, '3': 'on-handle-click' }
  return str.replace(camelizeRE, (_, c) => (c ? c.toUpperCase() : ''))
})
```
:::

### hasChanged 比较变量相同

- 源码实现

```typescript
// compare whether a value has changed, accounting for NaN.
export const hasChanged = (value: any, oldValue: any): boolean => !Object.is(value, oldValue)
```

:::info Tips
可能有人感到疑问，两个值是否不同还需要封装？多此一举，我直接 `a !== b` 不就行了？我们来看几个例子：

```typescript
// +0 和 -0问题
console.log(+0 === -0) // true
Object.is(+0, -0) // false

// NaN 问题
console.log(NaN === NaN) // false
Object.is(NaN, NaN) // true
```

由此可以看出，`Object.is`可以弥补 `正负0` 和 `NaN` 比较上存在的问题。MDN网站上还提供了一个`polyfill`：

```typescript
Object.is = function () {
	 // 如果两个值不同(有可能是正负0)
  if (x === y) {
    return x !== 0 || 1/x === 1/y
    /**
     * 如果x,y分别为+0 和 -0, 那么, 一个将会是Infinity 另一个是-Infinity
     */
    // 如果不同, 也可能是NaN
  } else {
    // 自己都不等于自己, 那肯定是NaN了
    return x !== x && y !==y
  }
}
console.log('NaN === NaN -->', Object.is(NaN, NaN))
console.log('+0 === -0 -->', Object.is(+0, -0))
// NaN === NaN --> true ⠼ : timing npm:load:cleanupLog Completed in 2ms
// +0 === -0 --> false
```
:::

### def 添加不可枚举属性

就是给对象`obj`，加上一个`可以删除`，其属性描述符`可以改变`，且`不可枚举的属性key`，其值为`value`。

- 源码实现

```typescript
export const def = (obj: object, key: string | symbol, value: any) => {
  Object.defineProperty(obj, key, {
    configurable: true,
    enumerable: false,
    value
  })
}
```

- 使用案例

```typescript
let person = {
  name: 'human',
  age: 100
}
def(person, 'gender', 'male')
console.log('person --> ', person) 
/**
 * nodejs 环境下 { name: 'human', age: 100 }
 * chrome 浏览器下 { name: 'human', age: 100, gender: 'male' }
 *  */ 
console.log('gender --> ', person.gender) // male
```

测试可枚举性，按照我们之前说的`for...in`，`Object.keys`，`JSON.stringify`三种方法

```typescript
// for...in
for (let key in person) {
  console.log('key', key)
  /**
   * key name
   * key age
   */
}

// JSON.stringify
console.log('JSON.stringify(person)', JSON.stringify(person))
// {"name":"human","age":100}

// Object.keys(person)
console.log('Object.keys(person)', Object.keys(person))
// [ 'name', 'age' ]
```

:::info Tips 
属性描述符可以细分为`数据描述符`和`存取描述符`。注意，configurable 和 enumerable既是数据描述符又是存取描述符。除了这两个属性之外，其他不同的描述符不得共用！

数据描述符：`writable` 只有writable为true的时候，该属性才能被改变值。 `value` 属性的值

存取描述符： `get`，`set`
:::

### toNumber 尝试转换数字

- 源码实现

```typescript
export const toNumber = (val: any): any => {
  const n = parseFloat(val)
  return isNaN(n) ? val : n
}
```

:::info Tips 
isNaN一看字面意思就知道: 判断一个值是否为NaN. 但他有一些怪异行为, 例如:

```typescript
isNaN(undefined) // true
isNaN('undefined') // true
isNaN('haha') // true
```

很明显, 这个方法关心的根本不是一个值是否是NaN, 它似乎更关心一个值是否无法被转为数字! 所以, 我们有了Number.isNaN

```typescript
Number.isNaN(undefined) // false
Number.isNaN('undefined') // false
Number.isNaN('haha') // false
```

所以, 一定要注意了, `isNaN`和`Number.isNaN`不是一回事!
:::
