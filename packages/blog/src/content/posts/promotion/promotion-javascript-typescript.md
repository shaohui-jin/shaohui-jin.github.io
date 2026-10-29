---
title: TypeScript
lang: zh-CN
date: 2024-04-15 14:15:31
permalink: /Promotion/JavaScript/TypeScript/
category:
  - TypeScript
tag:
  - TypeScript
---

## TS中的类

**类（Class）** 是 **面向对象** 程序设计 **（OOP，Object-Oriented Programming）** 实现信息封装的基础

类是一种用户定义的 **引用数据** 类型，也称类类型

传统的 面向对象语言 基本都是基于类的，JavaScript 基于 **原型** 的方式让开发者多了很多理解成本

在 ES6 之后，JavaScript 拥有了 **class** 关键字，虽然本质依然是 **构造函数**，但是使用起来已经方便了许多

但是 JavaScript 的 class 依然有一些特性还没有加入，比如 **修饰符** 和 **抽象类**

TypeScript 的 class 支持 面向对象 的 所有特性，比如 **类**、**接口** 等

### 用法

定义类的关键字为 **class**，后面紧跟类名，类可以包含以下几个模块（类的数据成员）：

- 字段：类里面声明的变量
- 构造函数：类实例化时调用，可以为类的对象分配内存
- 方法：对象要执行的操作

```typescript
class People {
  // 字段
  name: string;

  // 构造函数
  constructor(name: string) {
    this.name = name
  }

  // 方法
  getInfo(): void {
    console.log("姓名为:  " + this.name)
  }
}
```

### 继承

类的 **继承** 使用 **extends** 的关键字

```typescript
class People {
  talk(someThing: string) {
    console.log(someThing)
  }
}

class Man extends People {
  run() {
    console.log('The man ran ten meters');
  }
}

const aMan = new Man();

aMan.run(); // The man ran ten meters
aMan.talk("It's exhausting"); // It's exhausting
```

Man 是一个 **派生类**，它派生自 Man 基类，**派生类** 通常被称作 **子类**，**基类** 通常被称作 **超类**

Man 类继承了 People 类，因此实例 aMan 也能够使用 People 类 talk 方法

同样，类继承后，子类可以对父类的方法重新定义，这个过程称之为方法的重写

通过 **super关键字** 是对父类的直接引用，该关键字可以引用父类的属性和方法，如下：

```typescript
class People {
  talk(someThing: string) {
    console.log(someThing)
  }
}

class Man extends People {
  run() {
    console.log('The man ran ten meters');
  }
  talk() {
    super.talk("People don't want to speak anymore")
    console.log("Man don't want to speak anymore")
  }
}

const aMan = new Man();

aMan.run(); // The man ran ten meters
aMan.talk(); // People don't want to speak anymore    Man don't want to speak anymore
```

### 修饰符

#### 公共修饰符 public 

可以被访问的类程序里定义的成员

```typescript
class People {
  public name: string = 'zhangsan';
}

class Man extends People {
  constructor() {
    super();
    console.log(this.name) // zhangsan
  }
}

const aMan = new Man();
console.log(aMan.name) // zhangsan
```

#### 私有修饰符 private

只能够在该类的 **内部** 进行访问

```typescript
class People {
  public name: string = 'zhangsan';
  private age: number = 18;
}

class Man extends People {
  constructor() {
    super();
    console.log(this.name) // zhangsan
    console.log(this.age) // Property 'age' is private and only accessible within class 'People'
  }
}

const aMan = new Man();
console.log(aMan.name) // zhangsan
console.log(aMan.age) // Property 'age' is private and only accessible within class 'People'
```

#### 受保护修饰符 protect

除了在该类的 **内部** 可以访问，还可以在 **子类** 中仍然可以访问

```typescript
class People {
  public name: string = 'zhangsan';
  private age: number = 18;
  protected sex: 'male' | 'female' = 'male'
}

class Man extends People {
  constructor() {
    super();
    console.log(this.name) // zhangsan
    console.log(this.age) // Property 'age' is private and only accessible within class 'People'
    console.log(this.sex) // male
  }
}

const aMan = new Man();

console.log(aMan.name) // zhangsan
console.log(aMan.age) // Property 'age' is private and only accessible within class 'People'
console.log(aMan.sex) // Property 'sex' is protected and only accessible within class 'People' and its subclasses.
```

#### 只读修饰符 readonly

通过 **readonly** 关键字进行声明，只读属性必须在 **声明时** 或 构造函数里 被 **初始化**

```typescript
class People {
  readonly name: string;
  constructor(name: string) {
    this.name = name
  }
}

const people = new People('zhangsan')
people.name = 'lisi' //  Cannot assign to 'name' because it is a read-only property.
```

#### 静态属性 static

这些属性存在于 **类本身** 上面而 不是 **类实例** 上，通过static进行定义，访问这些属性需要通过 **类型.静态属性** 的这种形式访问

```typescript
class People {
  static idCard: string = '111xxxxxx11'
  readonly name: string;
  constructor(name: string) {
    this.name = name
    console.log(this.idCard) // Property 'idCard' does not exist on type 'People'. Did you mean to access the static member 'People.idCard' instead?
  }
}

console.log(People.idCard) // 111xxxxxx11
```

#### 抽象类 abstract

抽象类 做为 其它派生类 的 基类 使用，它们一般不会直接被实例化，不同于接口，抽象类可以包含成员的实现细节

**abstract** 关键字是用于定义 **抽象类** 和在抽象类内部定义 **抽象方法**

```typescript
abstract class People {
  abstract talk(): void
  run() {
    console.log('The people ran ten meters');
  }
}

class Man extends People {
  talk() {
    console.log("Man don't want to speak anymore");
  }
}

const aMan = new Man()
aMan.run() // The people ran ten meters
aMan.talk() // Man don't want to speak anymore
```

### 应用场景

除了日常借助 类 的特性完成日常业务代码，还可以将类（class）也可以作为接口，尤其在 **React** 工程中是很常用的，如下：

`export default class Carousel extends React.Component<Props, State> {}`

由于组件需要传入 **props** 的类型 **Props** ，同时有需要设置默认 **props** 即 **defaultProps**，这时候更加适合使用 class 作为接口
先声明一个类，这个类包含组件 **props** 所需的 **类型** 和 **初始值**：

```typescript
// props的类型
export default class Props {
  public children: Array<React.ReactElement<any>> | React.ReactElement<any> | never[] = []
  public speed: number = 500
  public height: number = 160
  public animation: string = 'easeInOutQuad'
  public isAuto: boolean = true
  public autoPlayInterval: number = 4500
  public afterChange: () => {}
  public beforeChange: () => {}
  public selesctedColor: string
  public showDots: boolean = true
}
```

当需要传入 props 类型的时候直接将 Props 作为接口传入，此时 Props 的作用就是接口，而当需要我们设置defaultProps初始值的时候，我们只需要:

```typescript
export default class Props {  }
const defaultProps = new Props()
```

Props 的实例就是 **defaultProps** 的 **初始值**，这就是 **class** 作为 **接口** 的实际应用，

用一个 class 起到了 **接口** 和 **设置初始值** 两个作用，方便统一管理，减少了代码量




## typescript 的数据类型

typescript 和 javascript **几乎一样**，拥有相同的数据类型，另外在 javascript 基础上提供了 **更加实用的类型** 供开发使用

在开发阶段，可以为 明确的变量定义为 某种类型，这样 typescript 就能在编译阶段进行 **类型检查**，当类型不合符预期结果的时候则会出现错误提示

- boolean（布尔类型）
- number（数字类型）
- string（字符串类型）
- array（数组类型）
- tuple（元组类型）
- enum（枚举类型）
- any（任意类型）
- null 和 undefined 类型
- void 类型
- never 类型
- object 对象类型


### 布尔类型 boolean

```typescript
let flag:boolean = true;
// flag = 123; // 错误
flag = false;  //正确
```

### 数字类型 number

typescript 的 数值类型 都是 **浮点数**，可支持**二进制**、**八进制**、**十进制**和**十六进制**

```typescript
let num:number = 123;
// num = '456'; // Type 'string' is not assignable to type 'number'.
num = 456;  //正确
// 进制表示：
let decLiteral: number = 6; // 十进制 6
let hexLiteral: number = 0xf00d; // 十六进制 61453
let binaryLiteral: number = 0b1010; // 二进制 10
let octalLiteral: number = 0o744; // 八进制 484
```

### 字符串类型 string

可以使用 **双引号** 或 **单引号** 表示字符串

```typescript
let str: string = 'this is ts';
str = 'test';
let name: string = `Gene`; // 注意编辑器存在部分bug，name会报错，跟window的name冲突
let age: number = 37;
let sentence: string = `Hello, my name is ${ name }`
```

### 数组类型 array

通过 **[]** 进行包裹，有两种写法

```typescript
// 方式一：元素类型后面接上 []
let arr1: string[] = ['12', '23'];
arr1 = ['45', '56'];

// 方式二：使用数组泛型，Array<元素类型>  
let arr2: Array<number> = [1, 2];
arr2 = [45, 56];
```

### 元祖类型 tuple

表示一个 **已知元素数量** 和 **类型** 的数组，各元素的 **类型可以不相同**

赋值的 **类型**、**位置**、**个数需要**和定义（声明）的一致

```typescript
let tupleArr: [number, string, boolean];
tupleArr = [12, '34', true];
typleArr = [12, '34'] // Cannot find name 'typleArr'
```

### 枚举类型 enum

enum 类型是对 JavaScript 标准数据类型的一个补充

```typescript
enum Color {Red, Green, Blue}
let c: Color = Color.Green;
```

### 任何类型 any

可以指定任何类型的值，在 **编程阶段** 还不清楚类型的变量指定一个类型，不希望 **类型检查器** 对这些值进行检查，而是直接让它们通过编译阶段的检查

使用 any 类型允许被赋值为 **任意类型**，甚至可以调用其 **属性**、**方法**

```typescript
let num: any = 123;
num = 'str';
num = true;
// 定义存储各种类型数据的数组时，示例代码如下：
let arrayList: any[] = [1, false, 'fine'];
arrayList[1] = 100;
```

### null 和 和 undefined

在 JavaScript 中 null表示 "**什么都没有**"，是一个只有一个值的特殊类型，表示一个**空对象引用**，而 undefined 表示一个 **没有设置值** 的 **变量**

默认情况下 **null** 和 **undefined** 是所有类型的 **子类型**，`就是说你可以把 null和 undefined 赋值给 number 类型的变量`

```typescript
let num: number | undefined; // 数值类型 或者 undefined
console.log(num); // undefined
num = 123;
console.log(num); // 123
num = null;
console.log(num); // null
num = undefined;
console.log(num); // undefined
```

但是 ts 配置了 **--strictNullChecks** 标记，null 和 undefined 只能赋值给 **void** 和 **它们各自**

### 无返回值类型 void

用于标识方法返回值的类型，表示该方法没有返回值

```typescript
function hello(): void {
  alert("Hello Ts");
}
```

### 不会出现类型 never

never是其他类型（包括null和 undefined）的子类型，可以赋值给任何类型，代表 **从不会出现的值**

但是没有类型是 never 的子类型，这意味着声明 never 的变量只能被 never 类型所赋值

never 类型一般用来指定 **抛出异常**、**无限循环**

```typescript
let a: never;
a = 123; // Type 'number' is not assignable to type 'never'.

a = (() => { // 正确的写法
  throw new Error('错误');
})()

// 返回never的函数必须存在无法达到的终点
function error(message: string): never {
  throw new Error(message);
}
```

### 对象类型 object

```typescript
let obj: object;
obj = { name: 'ShiLianAn', age: 27 };
```

### 总而言之

和 javascript 基本一致，也分成：

- 基本类型
- 引用类型

在基础类型上，typescript 增添了 **void**、**any**、**emum** 等原始类型



## TS中的枚举类型

**枚举** 是一个被 命名 的 **整型常数** 的集合，用于声明一组命名的常数，当一个变量有几种可能的取值时，可以将它定义为 **枚举类型**

通俗来说，**枚举** 就是 `一个对象的所有可能取值的集合`

在日常生活中也很常见，例如表示星期的 SUNDAY、MONDAY、TUESDAY、WEDNESDAY、THURSDAY、FRIDAY、SATURDAY 就可以看成是一个枚举

枚举的 说明与结构和 **联合** 相似，其形式为：

```
enum 枚举名{
    标识符①[=整型常数],
    标识符②[=整型常数],
    ...
    标识符N[=整型常数],
}枚举变量;
```

### 用法

通过 **enum 关键字** 进行定义

```typescript
enum Direction {  }
let d: Direction;
```

### 分类

##### 数字枚举

当我们声明一个枚举类型时，虽然没有给它们赋值，但是它们的值其实是 **默认的数字类型**，而且 **默认从0开始** 依次累加

```typescript
enum Direction {
  Up,   // 值默认为 0
  Down, // 值默认为 1
  Left, // 值默认为 2
  Right // 值默认为 3
}
console.log(Direction.Up === 0); // true
console.log(Direction.Down === 1); // true
console.log(Direction.Left === 2); // true
console.log(Direction.Right === 3); // true
```

如果将 **第一个值** 进行赋值后，后面的值也会根据前一个值进行 **累加1**

```typescript
enum Direction {
  Up = 10,
  Down,
  Left,
  Right
}

console.log(Direction.Up, Direction.Down, Direction.Left, Direction.Right); // 10 11 12 13
```

##### 字符串枚举

枚举类型的值其实也可以是 **字符串类型**

```typescript
enum Direction {
  Up = 'Up',
  Down = 'Down',
  Left = 'Left',
  Right = 'Right'
}

console.log(Direction['Right'], Direction.Up); // Right Up
```

如果设定了 **一个变量为字符串** 之后，后续的字段也 **必须赋值字符串**，否则报错

```typescript
enum Direction {
  Up = 'UP',
  Down, // Enum member must have initializer.
  Left, // Enum member must have initializer.
  Right // Enum member must have initializer.
}
```

##### 异构枚举

即 将 **数字枚举** 和 **字符串枚举** 结合起来混合起来使用

```typescript
enum EnumType {
  No = 0,
  Yes = "YES",
}
```

通常情况下很少会使用异构枚举

现在一个枚举的案例如下：

```typescript
// 编译前
enum Direction {
  Up,
  Down,
  Left,
  Right
}

// 编译后
var Direction;
(function (Direction) {
  Direction[Direction["Up"] = 0] = "Up";
  Direction[Direction["Down"] = 1] = "Down";
  Direction[Direction["Left"] = 2] = "Left";
  Direction[Direction["Right"] = 3] = "Right";
})(Direction || (Direction = {}));
```

上述代码可以看到， Direction[Direction["Up"] = 0] = "Up"可以分成

```typescript
Direction["Up"] = 0
Direction[0] = "Up"
```

所以定义枚举类型后，可以通过 **正反映射** 拿到对应的值，如下：

```typescript
enum Direction {
  Up,
  Down,
  Left,
  Right
}

console.log(Direction.Up === 0); // true
console.log(Direction[0]); // Up
```

并且 多处定义 的 枚举 是可以进行 **合并** 操作

```typescript
// 编译前
enum Direction {
    Up = 'Up',
    Down = 'Down',
    Left = 'Left',
    Right = 'Right'
}

enum Direction {
    Center = 1
}

// 编译后
var Direction;
(function (Direction) {
  Direction["Up"] = "Up";
  Direction["Down"] = "Down";
  Direction["Left"] = "Left";
  Direction["Right"] = "Right";
})(Direction || (Direction = {}));
(function (Direction) {
  Direction[Direction["Center"] = 1] = "Center";
})(Direction || (Direction = {}));
```

### 应用场景

就拿回生活的例子，后端返回的字段使用 **0 - 6** 标记对应的日期，这时候就可以使用枚举可提高代码可读性

```typescript
enum Days {Sun, Mon, Tue, Wed, Thu, Fri, Sat}

console.log(Days["Sun"] === 0); // true
console.log(Days["Mon"] === 1); // true
console.log(Days["Tue"] === 2); // true
console.log(Days["Sat"] === 6); // true
```




