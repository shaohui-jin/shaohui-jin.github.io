---
title: React 通讯方式
lang: zh-CN
date: 2024-03-20 10:34:17
permalink: /Promotion/React/Communication/
category:
  - React
tag:
  - Framework
---

## 简述

在 React 中，组件通信是非常重要的，因为一个复杂的应用程序通常由多个组件组成。

## Props

这是 React 中最基本的组件通信方式。通过将数据作为属性传递给子组件，可以实现从父组件向子组件传递数据。这是一种单向传递的方式，父组件向子组件传递数据，子组件只能读取这些数据。

```js
function ParentComponent() {
    const data = "Hello from parent!";
    return <ChildComponent message={data} />;
}

// 子组件
function ChildComponent(props) {
    return <p>{props.message}</p>;
}
```

## 回调函数

通过将回调函数传递给子组件，父组件可以与子组件进行通信。子组件可以调用这些回调函数来触发父组件中的操作。

```js
// 父组件
function ParentComponent() {
    const handleChildClick = () => {
        console.log("Child clicked!");
    };

    return <ChildComponent onClick={handleChildClick} />;
}

// 子组件
function ChildComponent(props) {
    return <button onClick={props.onClick}>Click me</button>;
}
```

## Context

React Context 是一种用于在组件树中共享数据的高级机制。它允许您在不必一级一级传递属性的情况下共享数据。

```js
// 创建上下文
const MyContext = React.createContext();

// 父组件
function ParentComponent() {
    return (
        <MyContext.Provider value="Hello from context">
            <ChildComponent />
        </MyContext.Provider>
    );
}

// 子组件
function ChildComponent() {
    const data = useContext(MyContext);
    return <p>{data}</p>;
}
```

## Redux

Redux 是一种用于管理应用程序状态的库，它允许组件之间通过一个全局存储来进行通信。Redux 的核心概念包括 Store、Action 和 Reducer。

## 事件总线

事件总线是一种发布-订阅模式的实现，允许不直接相关的组件通过中央事件总线进行通信。








