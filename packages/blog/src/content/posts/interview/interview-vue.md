---
headerDepth: 3
---

### 为什么要虚拟DOM

1. 框架设计： 渲染页面运行render函数，组件化开发的时候属性一旦改变只能全量渲染，直接操作DOM代价过高，使用虚拟DOM代替
2. 跨平台：除了浏览器环境，其他环境都不存在dom，打包其他环境的时候可以用虚拟dom做中间转换


### Proxy 和 DefineProperty 的区别

> **Proxy** 可以重定义对象的所有基本方法
> 
> **DefineProperty** 只是基本方法之一

### v-if 和 v-for优先级

> 在 Vue 2 中，v-for 的优先级高于 v-if，也就是说，Vue 2 在渲染时，会先处理 v-for 生成列表项，再对子项判断 v-if 是否渲染。
> 
> 在 Vue3 中，v-if 的优先级高于 v-for，也就是说， v-if 的条件将无法访问到 v-for 作用域内定义的变量别名，所以会报错。

### extend(s)与mixins差异

> **Mixins** 选项接收一个混入对象的数组（即可以多个）。 
> - 当值为对象的选项，如 **methods,components** 等，选项会被合并，键冲突的时候组件会覆盖混入对象 
> - 当值为函数的选项，如 **created,mounted** 等，就会被合并调用，混入对象钩子函数会比组件里的钩子函数先调用
> 
> **Extends** 只能暴露一个extends对象。
> - extends会比Mixins先执行。执行顺序：extends > Mixins> 组件

### [生命周期](/my-blog/Promotion/Vue/LifeCycle/)

![](https://shaohui-jin.github.io/picx-images-hosting/blog/Vue/生命周期.5fkdt6fcci.webp "vueLifecycle" =x800)

### created与activated差异

> 页面第一次进入，钩子的触发顺序 **created -> mounted-> activated**，退出时触发 **deactivated**
> 
> 当再次进入（前进或者后退）时，只触发 **activated**
>
> 被包含在 <**keep-alive**> 中创建的组件，会多出两个生命周期的钩子: activated 与 deactivated
> - **activated**：在组件第一次渲染时也会被调用，之后每次keep-alive激活时被调用。 
> - **deactivated**：在组件被停用时调用。

### 通讯方式

> - 父子组件通信: `props/$emit`、`$parent/$children`、`provide/inject`、`ref`、`$attrs/$listeners`
> - 兄弟组件通信: `eventBus`、`Vuex`
> - 跨级通信: `eventBus`、`Vuex`、`provide/inject`、`$attrs/$listeners`
