---
title: Vue双向绑定
lang: zh-CN
date: 2024-4-6 13:35:02
permalink: /Promotion/Vue/Reactivity/
category: 
  - VUE
tag: 
  - VUE
---

## 什么是单向绑定

model -> view 数据模型绑定到vue视图上
view -> model 用户视图上更新，同步更新数据模型

## MVVM构成

1. 数据层 model： 存储数据及业务逻辑
2. 视图层 view： 展示效果
3. 业务逻辑层 viewModel： 关联数据和视图

数据 视图
1. observer： 对所有数据的属性进行监听
2. compiler： 解析器，更新的效果


