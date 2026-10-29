---
title: Stream 流
lang: zh-CN
date: 2022-05-16 11:26:43
permalink: /Java/Stream/
category:
  - Java
tag:
  - Java
---

Stream 使用一种类似用 SQL 语句从数据库查询数据的直观方式来提供一种对 Java 集合运算和表达的高阶抽象。
Stream API可以极大提高Java程序员的生产力，让程序员写出高效率、干净、简洁的代码。
这种风格将要处理的元素集合看作一种流， 流在管道中传输， 并且可以在管道的节点上进行处理， 比如筛选， 排序，聚合等。

## 特性

- 不是数据结构：它没有内部存储，它只是用操作管道从 source（数据结构、数组、generator function、IO channel）抓取数据。它也绝不修改自己所封装的底层数据结构的数据。例如 Stream 的 filter 操作会产生一个不包含被过滤元素的新 Stream，而不是从 source 删除那些元素。
- 不支持索引访问：但是很容易生成数组或者 List 。
- 惰性化：很多 Stream 操作是向后延迟的，一直到它弄清楚了最后需要多少数据才会开始。Intermediate 操作永远是惰性化的。
- 并行能力。当一个 Stream 是并行化的，就不需要再写多线程代码，所有对它的操作会自动并行进行的。
- 可以是无限的：集合有固定大小，Stream 则不必。limit(n) 和 findFirst() 这类的 short-circuiting 操作可以对无限的 Stream 进行运算并很快完成。
- 注意事项：所有 Stream 的操作必须以 lambda 表达式为参数。

## 流操作类型

- Intermediate：一个流可以后面跟随零个或多个 intermediate 操作。其目的主要是打开流，做出某种程度的数据映射/过滤，然后返回一个新的流，交给下一个操作使用。这类操作都是惰性化的（lazy），就是说，仅仅调用到这类方法，并没有真正开始流的遍历。
- Terminal：一个流只能有一个 terminal 操作，当这个操作执行后，流就被使用“光”了，无法再被操作。所以这必定是流的最后一个操作。Terminal操作的执行，才会真正开始流的遍历，并且会生成一个结果，或者一个 side effect。

## 基本使用

这里我们依旧使用一个简单示例来看看吧。在开发中，我们有时需要对一些数据进行过滤，如果是传统的方式，我们需要对这批数据进行遍历过滤，会显得比较繁琐，如果使用stream流方式的话，那么可以很方便的进行处理。

```java
// 首先通过普通的方式进行过滤:
List<String> list = Arrays.asList("张三", "李四", "王五", "xuwujing");
System.out.println("过滤之前:" + list);
List<String> result = new ArrayList<>();
for (String str : list) {
 if (!"李四".equals(str)) {
  result.add(str);
 }
}
System.out.println("过滤之后:" + result);

// 使用Steam方式进行过滤：
List<String> result2 = list.stream().filter(str -> !"李四".equals(str)).collect(Collectors.toList());
System.out.println("stream 过滤之后:" + result2);

// 输出结果:
// 过滤之前:[张三, 李四, 王五, xuwujing]
// 过滤之后:[张三, 王五, xuwujing]
// stream 过滤之后:[张三, 王五, xuwujing]
```

是不是很简洁和方便呢。其实Stream流还有更多的使用方法，filter只是其中的一角而已。那么在这里我们就来学习了解下这些用法吧。

## 构造Stream流的方式

```java
Stream stream = Stream.of("a", "b", "c");
String[] strArray = new String[] { "a", "b", "c" };
stream = Stream.of(strArray);
stream = Arrays.stream(strArray);
List<String> list = Arrays.asList(strArray);
stream = list.stream();
```

## Stream流的之间的转换

注意:一个Stream流只可以使用一次，这段代码为了简洁而重复使用了数次，因此会抛出 stream has already been operated upon or closed 异常。

```java
try {
  Stream<String> stream2 = Stream.of("a", "b", "c");
  // 转换成 Array
  String[] strArray1 = stream2.toArray(String[]::new);

  // 转换成 Collection
  List<String> list1 = stream2.collect(Collectors.toList());
  List<String> list2 = stream2.collect(Collectors.toCollection(ArrayList::new));   
  Set set1 = stream2.collect(Collectors.toSet());
  Stack stack1 = stream2.collect(Collectors.toCollection(Stack::new));

  // 转换成 String
  String str = stream.collect(Collectors.joining()).toString();
 } catch (Exception e) {
  e.printStackTrace();
 }
```

## Stream流的map使用

map方法用于映射每个元素到对应的结果，一对一。

```java
 // 示例一：转换大写
 List<String> list3 = Arrays.asList("zhangSan", "liSi", "wangWu");
 System.out.println("转换之前的数据:" + list3);
 List<String> list4 = list3.stream().map(String::toUpperCase).collect(Collectors.toList());
 System.out.println("转换之后的数据:" + list4); 
 // 转换之后的数据:[ZHANGSAN, LISI,WANGWU]

 // 示例二：转换数据类型
 List<String> list31 = Arrays.asList("1", "2", "3");
 System.out.println("转换之前的数据:" + list31);
 List<Integer> list41 = list31.stream().map(Integer::valueOf).collect(Collectors.toList());
 System.out.println("转换之后的数据:" + list41); 
 // [1, 2, 3]

 // 示例三：获取平方
 List<Integer> list5 = Arrays.asList(new Integer[] { 1, 2, 3, 4, 5 });
 List<Integer> list6 = list5.stream().map(n -> n * n).collect(Collectors.toList());
 System.out.println("平方的数据:" + list6);
 // [1, 4, 9, 16, 25]
```

## Stream流的filter使用

filter方法用于通过设置的条件过滤出元素。

```java
 // 示例一：通过与 findAny 得到 if/else 的值
 List<String> list = Arrays.asList("张三", "李四", "王五", "xuwujing");
 String result3 = list.stream().filter(str -> "李四".equals(str)).findAny().orElse("找不到!");
 String result4 = list.stream().filter(str -> "李二".equals(str)).findAny().orElse("找不到!");
 System.out.println("stream 过滤之后 2:" + result3);
 System.out.println("stream 过滤之后 3:" + result4);

 //stream 过滤之后 2:李四
 //stream 过滤之后 3:找不到!

 // 示例二：通过与 mapToInt 计算和
 List<User> lists = new ArrayList<User>();
 lists.add(new User(6, "张三"));
 lists.add(new User(2, "李四"));
 lists.add(new User(3, "王五"));
 lists.add(new User(1, "张三"));
 // 计算这个list中出现 "张三" id的值
 int sum = lists.stream().filter(u -> "张三".equals(u.getName())).mapToInt(u -> u.getId()).sum();

 System.out.println("计算结果:" + sum); 
```

## Stream流的flatMap使用

flatMap 方法用于映射每个元素到对应的结果，一对多。

```java
 // 示例:从句子中得到单词
 String worlds = "The way of the future";
 List<String> list7 = new ArrayList<>();
 list7.add(worlds);
 List<String> list8 = list7.stream().flatMap(str -> Stream.of(str.split(" "))).filter(world -> world.length() > 0).collect(Collectors.toList());
 System.out.println("单词:");
 list8.forEach(System.out::println);
 // 单词:
 // The 
 // way 
 // of 
 // the 
 // future
```

## Stream流的limit使用

limit 方法用于获取指定数量的流。

```java
 // 示例一：获取前n条数的数据
 Random rd = new Random();
 System.out.println("取到的前三条数据:");
 rd.ints().limit(3).forEach(System.out::println);
 // 取到的前三条数据:
 // 1167267754
 // -1164558977
 // 1977868798

 // 示例二：结合skip使用得到需要的数据 skip表示的是扔掉前n个元素。

 List<User> list9 = new ArrayList<User>();
 for (int i = 1; i < 4; i++) {
  User user = new User(i, "pancm" + i);
  list9.add(user);
 }
 System.out.println("截取之前的数据:");
 // 取前3条数据，但是扔掉了前面的2条，可以理解为拿到的数据为 2<=i<3 (i 是数值下标)
 List<String> list10 = list9.stream().map(User::getName).limit(3).skip(2).collect(Collectors.toList());
 System.out.println("截取之后的数据:" + list10);
 //  截取之前的数据:
 //  姓名:pancm1
 //  姓名:pancm2
 //  姓名:pancm3
 //  截取之后的数据:[pancm3]
 注:User实体类中 getName 方法会打印姓名。
```

## Stream流的sort使用

sorted方法用于对流进行升序排序。

```java
 // 示例一：随机取值排序
 Random rd2 = new Random();
 System.out.println("取到的前三条数据然后进行排序:");
 rd2.ints().limit(3).sorted().forEach(System.out::println);
 // 取到的前三条数据然后进行排序:
 // -2043456377
 // -1778595703
 // 1013369565

 // 示例二：优化排序 tips:先获取在排序效率会更高!
 //普通的排序取值
 List<User> list11 = list9.stream().sorted((u1, u2) -> u1.getName().compareTo(u2.getName())).limit(3)
   .collect(Collectors.toList());
 System.out.println("排序之后的数据:" + list11);
 //优化排序取值
 List<User> list12 = list9.stream().limit(3).sorted((u1, u2) -> u1.getName().compareTo(u2.getName()))
   .collect(Collectors.toList());
 System.out.println("优化排序之后的数据:" + list12);
 //排序之后的数据:[{"id":1,"name":"pancm1"}, {"id":2,"name":"pancm2"}, {"id":3,"name":"pancm3"}]
 //优化排序之后的数据:[{"id":1,"name":"pancm1"}, {"id":2,"name":"pancm2"}, {"id":3,"name":"pancm3"}]
```

## Stream流的peek使用

peek对每个元素执行操作并返回一个新的Stream

```java
 // 示例:双重操作
 System.out.println("peek使用:");
 Stream.of("one", "two", "three", "four").filter(e -> e.length() > 3).peek(e -> System.out.println("转换之前: " + e))
   .map(String::toUpperCase).peek(e -> System.out.println("转换之后: " + e)).collect(Collectors.toList());
 
 // 转换之前: three
 // 转换之后: THREE
 // 转换之前: four
 // 转换之后: FOUR
```

## Stream流的parallel使用

parallelStream 是流并行处理程序的代替方法。

```java
 // 示例:获取空字符串的数量
 List<String> strings = Arrays.asList("a", "", "c", "", "e","", " ");
 // 获取空字符串的数量
 long count =  strings.parallelStream().filter(string -> string.isEmpty()).count();
 System.out.println("空字符串的个数:"+count);
```

## Stream流的max/min/distinct使用

```java
 // 示例一：得到最大最小值
 List<String> list13 = Arrays.asList("zhangsan","lisi","wangwu","xuwujing");
 int maxLines = list13.stream().mapToInt(String::length).max().getAsInt();
 int minLines = list13.stream().mapToInt(String::length).min().getAsInt();
 System.out.println("最长字符的长度:" + maxLines+",最短字符的长度:"+minLines);
 //最长字符的长度:8,最短字符的长度:4

 // 示例二：得到去重之后的数据
 String lines = "good good study day day up";
 List<String> list14 = new ArrayList<String>();
 list14.add(lines);
 List<String> words = list14.stream().flatMap(line -> Stream.of(line.split(" "))).filter(word -> word.length() > 0)
   .map(String::toLowerCase).distinct().sorted().collect(Collectors.toList());
 System.out.println("去重复之后:" + words);
 //去重复之后:[day, good, study, up]
```

## Stream流的Match使用

```java
 // allMatch：Stream 中全部元素符合则返回 true ;
 // anyMatch：Stream 中只要有一个元素符合则返回 true;
 // noneMatch：Stream 中没有一个元素符合则返回 true。

 // 示例:数据是否符合
 boolean all = lists.stream().allMatch(u -> u.getId() > 3);
 System.out.println("是否都大于3:" + all);
 boolean any = lists.stream().anyMatch(u -> u.getId() > 3);
 System.out.println("是否有一个大于3:" + any);
 boolean none = lists.stream().noneMatch(u -> u.getId() > 3);
 System.out.println("是否没有一个大于3的:" + none);  
 // 是否都大于3:false
 // 是否有一个大于3:true
 // 是否没有一个大于3的:false
```

## Stream流的reduce使用

reduce 主要作用是把 Stream 元素组合起来进行操作。

```java
 // 示例一：字符串连接
 String concat = Stream.of("A", "B", "C", "D").reduce("", String::concat);
 System.out.println("字符串拼接:" + concat);

 // 示例二：得到最小值
 double minValue = Stream.of(-4.0, 1.0, 3.0, -2.0).reduce(Double.MAX_VALUE, Double::min);
 System.out.println("最小值:" + minValue);
 //最小值:-4.0

 // 示例三：求和
 // 求和, 无起始值
 int sumValue = Stream.of(1, 2, 3, 4).reduce(Integer::sum).get();
 System.out.println("有无起始值求和:" + sumValue);
 // 求和, 有起始值
  sumValue = Stream.of(1, 2, 3, 4).reduce(1, Integer::sum);
  System.out.println("有起始值求和:" + sumValue);
 // 有无起始值求和:10
 // 有起始值求和:11

 // 示例四：过滤拼接
 concat = Stream.of("a", "B", "c", "D", "e", "F").filter(x -> x.compareTo("Z") > 0).reduce("", String::concat);
 System.out.println("过滤和字符串连接:" + concat);
 //过滤和字符串连接:ace
```

## Stream流的iterate使用

iterate 跟 reduce 操作很像，接受一个种子值，和一个UnaryOperator（例如 f）。然后种子值成为 Stream 的第一个元素，f(seed) 为第二个，f(f(seed)) 第三个，以此类推。在 iterate 时候管道必须有 limit 这样的操作来限制 Stream 大小。

```java
 // 示例:生成一个等差队列
 System.out.println("从2开始生成一个等差队列:");
 Stream.iterate(2, n -> n + 2).limit(5).forEach(x -> System.out.print(x + " "));
 // 从2开始生成一个等差队列:
 // 2 4 6 8 10
```

## Stream流的Supplier使用

通过实现Supplier类的方法可以自定义流计算规则。

```java
 // 示例：随机获取两条用户信息
 System.out.println("自定义一个流进行计算输出:");
 Stream.generate(new UserSupplier()).limit(2).forEach(u -> System.out.println(u.getId() + ", " + u.getName()));
 
 //第一次:
 //自定义一个流进行计算输出:
 //10, pancm7
 //11, pancm6
 
 //第二次:
 //自定义一个流进行计算输出:
 //10, pancm4
 //11, pancm2
 
 //第三次:
 //自定义一个流进行计算输出:
 //10, pancm4
 //11, pancm8


 class UserSupplier implements Supplier<User> {
  private int index = 10;
  private Random random = new Random();
 
  @Override
  public User get() {
   return new User(index++, "pancm" + random.nextInt(10));
  }
 }
```

## Stream流的groupingBy/partitioningBy使用

```java
 // groupingBy：分组排序；
 // partitioningBy：分区排序。

 // 示例一：分组排序
 System.out.println("通过id进行分组排序:");
 Map<Integer, List<User>> personGroups = Stream.generate(new UserSupplier2()).limit(5)
   .collect(Collectors.groupingBy(User::getId));
 Iterator it = personGroups.entrySet().iterator();
 while (it.hasNext()) {
  Map.Entry<Integer, List<User>> persons = (Map.Entry) it.next();
  System.out.println("id " + persons.getKey() + " = " + persons.getValue());
 }
 
 // 通过id进行分组排序:
 // id 10 = [{"id":10,"name":"pancm1"}] 
 // id 11 = [{"id":11,"name":"pancm3"}, {"id":11,"name":"pancm6"}, {"id":11,"name":"pancm4"}, {"id":11,"name":"pancm7"}]

 class UserSupplier2 implements Supplier<User> {
  private int index = 10;
  private Random random = new Random();
 
  @Override
  public User get() {
   return new User(index % 2 == 0 ? index++ : index, "pancm" + random.nextInt(10));
  }
 }

 // 示例二：分区排序
 System.out.println("通过年龄进行分区排序:");
 Map<Boolean, List<User>> children = Stream.generate(new UserSupplier3()).limit(5)
   .collect(Collectors.partitioningBy(p -> p.getId() < 18));

 System.out.println("小孩: " + children.get(true));
 System.out.println("成年人: " + children.get(false));
 
 // 通过年龄进行分区排序:
 // 小孩: [{"id":16,"name":"pancm7"}, {"id":17,"name":"pancm2"}]
 // 成年人: [{"id":18,"name":"pancm4"}, {"id":19,"name":"pancm9"}, {"id":20,"name":"pancm6"}]

  class UserSupplier3 implements Supplier<User> {
  private int index = 16;
  private Random random = new Random();
 
  @Override
  public User get() {
   return new User(index++, "pancm" + random.nextInt(10));
  }
 }
```

## Stream流的summaryStatistics使用

IntSummaryStatistics 用于收集统计信息(如count、min、max、sum和average)的状态对象。

```java
 // 示例:得到最大、最小、之和以及平均数。
 List<Integer> numbers = Arrays.asList(1, 5, 7, 3, 9);
 IntSummaryStatistics stats = numbers.stream().mapToInt((x) -> x).summaryStatistics();
  
 System.out.println("列表中最大的数 : " + stats.getMax());
 System.out.println("列表中最小的数 : " + stats.getMin());
 System.out.println("所有数之和 : " + stats.getSum());
 System.out.println("平均数 : " + stats.getAverage());
 
 // 列表中最大的数 : 9
 // 列表中最小的数 : 1
 // 所有数之和 : 25
 // 平均数 : 5.0
```

Stream 介绍就到这里了，JDK1.8中的Stream流其实还有很多很多用法，更多的用法则需要大家去查看JDK1.8的API文档了。
