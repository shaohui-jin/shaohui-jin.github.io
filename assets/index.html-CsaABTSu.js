import{_ as n}from"./plugin-vue_export-helper-DlAUqK2U.js";import{o as a,c as s,b as t}from"./app-Bo5PwrVT.js";const e={},p=t(`<h2 id="简述" tabindex="-1"><a class="header-anchor" href="#简述"><span>简述</span></a></h2><p>在 React 中，组件通信是非常重要的，因为一个复杂的应用程序通常由多个组件组成。</p><h2 id="props" tabindex="-1"><a class="header-anchor" href="#props"><span>Props</span></a></h2><p>这是 React 中最基本的组件通信方式。通过将数据作为属性传递给子组件，可以实现从父组件向子组件传递数据。这是一种单向传递的方式，父组件向子组件传递数据，子组件只能读取这些数据。</p><div class="language-javascript line-numbers-mode" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="token keyword">function</span> <span class="token function">ParentComponent</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> data <span class="token operator">=</span> <span class="token string">&quot;Hello from parent!&quot;</span><span class="token punctuation">;</span>
    <span class="token keyword">return</span> <span class="token operator">&lt;</span>ChildComponent message<span class="token operator">=</span><span class="token punctuation">{</span>data<span class="token punctuation">}</span> <span class="token operator">/</span><span class="token operator">&gt;</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token comment">// 子组件</span>
<span class="token keyword">function</span> <span class="token function">ChildComponent</span><span class="token punctuation">(</span><span class="token parameter">props</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> <span class="token operator">&lt;</span>p<span class="token operator">&gt;</span><span class="token punctuation">{</span>props<span class="token punctuation">.</span>message<span class="token punctuation">}</span><span class="token operator">&lt;</span><span class="token operator">/</span>p<span class="token operator">&gt;</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="回调函数" tabindex="-1"><a class="header-anchor" href="#回调函数"><span>回调函数</span></a></h2><p>通过将回调函数传递给子组件，父组件可以与子组件进行通信。子组件可以调用这些回调函数来触发父组件中的操作。</p><div class="language-javascript line-numbers-mode" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="token comment">// 父组件</span>
<span class="token keyword">function</span> <span class="token function">ParentComponent</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> <span class="token function-variable function">handleChildClick</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
        console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;Child clicked!&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">;</span>

    <span class="token keyword">return</span> <span class="token operator">&lt;</span>ChildComponent onClick<span class="token operator">=</span><span class="token punctuation">{</span>handleChildClick<span class="token punctuation">}</span> <span class="token operator">/</span><span class="token operator">&gt;</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token comment">// 子组件</span>
<span class="token keyword">function</span> <span class="token function">ChildComponent</span><span class="token punctuation">(</span><span class="token parameter">props</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> <span class="token operator">&lt;</span>button onClick<span class="token operator">=</span><span class="token punctuation">{</span>props<span class="token punctuation">.</span>onClick<span class="token punctuation">}</span><span class="token operator">&gt;</span>Click me<span class="token operator">&lt;</span><span class="token operator">/</span>button<span class="token operator">&gt;</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="context" tabindex="-1"><a class="header-anchor" href="#context"><span>Context</span></a></h2><p>React Context 是一种用于在组件树中共享数据的高级机制。它允许您在不必一级一级传递属性的情况下共享数据。</p><div class="language-javascript line-numbers-mode" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="token comment">// 创建上下文</span>
<span class="token keyword">const</span> MyContext <span class="token operator">=</span> React<span class="token punctuation">.</span><span class="token function">createContext</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token comment">// 父组件</span>
<span class="token keyword">function</span> <span class="token function">ParentComponent</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> <span class="token punctuation">(</span>
        <span class="token operator">&lt;</span>MyContext<span class="token punctuation">.</span>Provider value<span class="token operator">=</span><span class="token string">&quot;Hello from context&quot;</span><span class="token operator">&gt;</span>
            <span class="token operator">&lt;</span>ChildComponent <span class="token operator">/</span><span class="token operator">&gt;</span>
        <span class="token operator">&lt;</span><span class="token operator">/</span>MyContext<span class="token punctuation">.</span>Provider<span class="token operator">&gt;</span>
    <span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token comment">// 子组件</span>
<span class="token keyword">function</span> <span class="token function">ChildComponent</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> data <span class="token operator">=</span> <span class="token function">useContext</span><span class="token punctuation">(</span>MyContext<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">return</span> <span class="token operator">&lt;</span>p<span class="token operator">&gt;</span><span class="token punctuation">{</span>data<span class="token punctuation">}</span><span class="token operator">&lt;</span><span class="token operator">/</span>p<span class="token operator">&gt;</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="redux" tabindex="-1"><a class="header-anchor" href="#redux"><span>Redux</span></a></h2><p>Redux 是一种用于管理应用程序状态的库，它允许组件之间通过一个全局存储来进行通信。Redux 的核心概念包括 Store、Action 和 Reducer。</p><h2 id="事件总线" tabindex="-1"><a class="header-anchor" href="#事件总线"><span>事件总线</span></a></h2><p>事件总线是一种发布-订阅模式的实现，允许不直接相关的组件通过中央事件总线进行通信。</p>`,15),o=[p];function c(l,i){return a(),s("div",null,o)}const d=n(e,[["render",c],["__file","index.html.vue"]]),k=JSON.parse('{"path":"/React/Communication/","title":"React 通讯方式","lang":"zh-CN","frontmatter":{"title":"React 通讯方式","lang":"zh-CN","date":"2024-03-20T10:34:17.000Z","permalink":"/React/Communication/","category":["React"],"tag":["Framework"],"description":"简述 在 React 中，组件通信是非常重要的，因为一个复杂的应用程序通常由多个组件组成。 Props 这是 React 中最基本的组件通信方式。通过将数据作为属性传递给子组件，可以实现从父组件向子组件传递数据。这是一种单向传递的方式，父组件向子组件传递数据，子组件只能读取这些数据。 回调函数 通过将回调函数传递给子组件，父组件可以与子组件进行通信。子...","head":[["meta",{"property":"og:url","content":"https://shaohui-jin.github.io/React/Communication/"}],["meta",{"property":"og:title","content":"React 通讯方式"}],["meta",{"property":"og:description","content":"简述 在 React 中，组件通信是非常重要的，因为一个复杂的应用程序通常由多个组件组成。 Props 这是 React 中最基本的组件通信方式。通过将数据作为属性传递给子组件，可以实现从父组件向子组件传递数据。这是一种单向传递的方式，父组件向子组件传递数据，子组件只能读取这些数据。 回调函数 通过将回调函数传递给子组件，父组件可以与子组件进行通信。子..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2024-04-05T09:12:06.000Z"}],["meta",{"property":"article:author","content":"石怜安"}],["meta",{"property":"article:tag","content":"Framework"}],["meta",{"property":"article:published_time","content":"2024-03-20T10:34:17.000Z"}],["meta",{"property":"article:modified_time","content":"2024-04-05T09:12:06.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"React 通讯方式\\",\\"image\\":[\\"\\"],\\"datePublished\\":\\"2024-03-20T10:34:17.000Z\\",\\"dateModified\\":\\"2024-04-05T09:12:06.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"石怜安\\",\\"url\\":\\"https://shaohui-jin.github.io\\"}]}"]]},"headers":[{"level":2,"title":"简述","slug":"简述","link":"#简述","children":[]},{"level":2,"title":"Props","slug":"props","link":"#props","children":[]},{"level":2,"title":"回调函数","slug":"回调函数","link":"#回调函数","children":[]},{"level":2,"title":"Context","slug":"context","link":"#context","children":[]},{"level":2,"title":"Redux","slug":"redux","link":"#redux","children":[]},{"level":2,"title":"事件总线","slug":"事件总线","link":"#事件总线","children":[]}],"git":{"createdTime":1712308326000,"updatedTime":1712308326000,"contributors":[{"name":"shaohui_jin","email":"1051131737@qq.com","commits":1}]},"readingTime":{"minutes":1.4,"words":419},"filePathRelative":"zh/React/React通讯方式.md","localizedDate":"2024年3月20日","excerpt":"<h2>简述</h2>\\n<p>在 React 中，组件通信是非常重要的，因为一个复杂的应用程序通常由多个组件组成。</p>\\n<h2>Props</h2>\\n<p>这是 React 中最基本的组件通信方式。通过将数据作为属性传递给子组件，可以实现从父组件向子组件传递数据。这是一种单向传递的方式，父组件向子组件传递数据，子组件只能读取这些数据。</p>\\n<div class=\\"language-javascript\\" data-ext=\\"js\\" data-title=\\"js\\"><pre class=\\"language-javascript\\"><code><span class=\\"token keyword\\">function</span> <span class=\\"token function\\">ParentComponent</span><span class=\\"token punctuation\\">(</span><span class=\\"token punctuation\\">)</span> <span class=\\"token punctuation\\">{</span>\\n    <span class=\\"token keyword\\">const</span> data <span class=\\"token operator\\">=</span> <span class=\\"token string\\">\\"Hello from parent!\\"</span><span class=\\"token punctuation\\">;</span>\\n    <span class=\\"token keyword\\">return</span> <span class=\\"token operator\\">&lt;</span>ChildComponent message<span class=\\"token operator\\">=</span><span class=\\"token punctuation\\">{</span>data<span class=\\"token punctuation\\">}</span> <span class=\\"token operator\\">/</span><span class=\\"token operator\\">&gt;</span><span class=\\"token punctuation\\">;</span>\\n<span class=\\"token punctuation\\">}</span>\\n\\n<span class=\\"token comment\\">// 子组件</span>\\n<span class=\\"token keyword\\">function</span> <span class=\\"token function\\">ChildComponent</span><span class=\\"token punctuation\\">(</span><span class=\\"token parameter\\">props</span><span class=\\"token punctuation\\">)</span> <span class=\\"token punctuation\\">{</span>\\n    <span class=\\"token keyword\\">return</span> <span class=\\"token operator\\">&lt;</span>p<span class=\\"token operator\\">&gt;</span><span class=\\"token punctuation\\">{</span>props<span class=\\"token punctuation\\">.</span>message<span class=\\"token punctuation\\">}</span><span class=\\"token operator\\">&lt;</span><span class=\\"token operator\\">/</span>p<span class=\\"token operator\\">&gt;</span><span class=\\"token punctuation\\">;</span>\\n<span class=\\"token punctuation\\">}</span>\\n</code></pre></div>","autoDesc":true}');export{d as comp,k as data};