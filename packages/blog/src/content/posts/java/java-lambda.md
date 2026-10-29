---
title: Lambda表达式
lang: zh-CN
date: 2022-05-16 11:26:43
permalink: /Java/Lambda/
category:
  - Java
tag:
  - Java
---

Lambda 表达式(lambda expression)是一个匿名函数，Lambda表达式基于数学中的λ演算得名，直接对应于其中的lambda抽象(lambda abstraction)，是一个匿名函数，即没有函数名的函数。

## 表达式的结构

- 一个 Lambda 表达式可以有零个或多个参数
- 参数的类型既可以明确声明，也可以根据上下文来推断。例如：(int a)与(a)效果相同
- 所有参数需包含在圆括号内，参数之间用逗号相隔。例如：(a, b) 或 (int a, int b) 或 (String a, int b, float c)
- 空圆括号代表参数集为空。例如：() -> 42
- 当只有一个参数，且其类型可推导时，圆括号（）可省略。例如：a -> return a * a
- Lambda 表达式的主体可包含零条或多条语句
- 如果 Lambda 表达式的主体只有一条语句，花括号{}可省略。匿名函数的返回类型与该主体表达式一致
- 如果 Lambda 表达式的主体包含一条以上语句，则表达式必须包含在花括号{}中（形成代码块）。匿名函数的返回类型与代码块的返回类型一致，若没有返回则为空

## 表达式的使用

下面我们先使用一个简单的例子来看看Lambda的效果吧。
比如我们对Map 的遍历 传统方式遍历如下:

```java
  Map<String, String> map = new HashMap<>();
  map.put("a", "a");
  map.put("b", "b");
  map.put("c", "c");
  map.put("d", "d");

  for (String key : map.keySet()) {
   System.out.println("k=" + key + "，v=" + map.get(key));
  }
```

使用Lambda进行遍历:

```java
  map.forEach((k, v) -> {
   System.out.println("k=" + k + "，v=" + v);
 });
```

List也同理，不过List还可以通过双冒号运算符遍历:

```java
  List<String> list = new ArrayList<String>();
  list.add("a");
  list.add("bb");
  list.add("ccc");
  list.add("dddd");

  list.forEach(v -> {
   System.out.println(v);
  });

  list.forEach(System.out::println);
```

> Lambda除了在for循环遍历中使用外，它还可以代替匿名的内部类。比如下面这个例子的线程创建:

```java
 Runnable r1 = new Runnable() {
  @Override
  public void run() {
   System.out.println("普通方式创建!");
  }
 };
 
 //使用拉姆达方式创建
 Runnable r2 = ()-> System.out.println("拉姆达方式创建!");
```

注: 这个例子中使用Lambda表达式的时候，编译器会自动推断：根据线程类的构造函数签名 Runnable r { }，将该 Lambda 表达式赋Runnable 接口。

Lambda 表达式与匿名类的区别使用匿名类与 Lambda 表达式的一大区别在于关键词的使用。对于匿名类，关键词 this 解读为匿名类，而对于 Lambda 表达式，关键词 this 解读为写就 Lambda 的外部类。

## 注意事项

Lambda虽然简化了代码的编写，但同时也减少了可读性。
