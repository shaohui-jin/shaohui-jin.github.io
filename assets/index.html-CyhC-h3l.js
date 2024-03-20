import{_ as o}from"./plugin-vue_export-helper-DlAUqK2U.js";import{o as l,c as i,d as a,a as t,e,b as s}from"./app-GjHxp28g.js";const d={},r=t("p",null,[t("strong",null,"微前端"),e(" 是一种类似于微服务的架构，它将微服务的理念应用于浏览器端，即将单页面前端应用由单一的单体应用转变为多个小型前端应用聚合为一的应用。")],-1),c=t("p",null,"各个前端应用还可以独立开发、独立部署。同时，它们也可以在共享组件的同时进行并行开发——这些组件可以通过 NPM 或者 Git Tag、Git Submodule 来管理。",-1),p=t("p",null,[t("strong",null,"qiankun（乾坤）"),e(" 就是一款由蚂蚁金服推出的比较成熟的微前端框架，基于 "),t("strong",null,"single-spa"),e(" 进行二次开发，用于将Web应用由单一的单体应用转变为多个小型前端应用聚合为一的应用。")],-1),u=t("p",null,"那么，话不多说，我们的源码解析正式开始。",-1),g=["src"],h=s('<p>我们从两个基础 API : <strong>registerMicroApps(apps, lifeCycles?) - 注册子应用</strong> 和 <strong>start(opts?) - 启动主应用</strong> 开始</p><p>由于 <strong>registerMicroApps</strong> 函数中设置的回调函数较多，并且读取了 <strong>start</strong> 函数中设置的初始配置项，所以我们从 <strong>start</strong> 函数开始解析。</p><h2 id="start-opts" tabindex="-1"><a class="header-anchor" href="#start-opts"><span>start(opts)</span></a></h2>',3),m=["src"],_=s('<p>第 196 行：设置 <strong>window</strong> 的 <strong><strong>POWERED_BY_QIANKUN</strong></strong> 属性为 true，在子应用中使用 <strong>window.<strong>POWERED_BY_QIANKUN</strong></strong> 值判断是否运行在主应用容器中。</p><p>第 198~199 行：设置配置参数（有默认值），将配置参数存储在 <strong>importLoaderConfiguration</strong> 对象中。</p><p>第 201~203 行：检查 <strong>prefetch</strong> 属性，如果需要预加载，则添加全局事件 <strong>single-spa:first-mount</strong> 监听，在第一个子应用挂载后预加载其他子应用资源，优化后续其他子应用的加载速度。</p><p>第 205 行：根据 <strong>singularMode</strong> 参数设置是否为单实例模式。</p><p>第 209~217 行：根据 <strong>jsSandbox</strong> 参数设置是否启用沙箱运行环境，旧版本需要关闭该选项以兼容 IE。（新版本在单实例模式下默认支持 IE，多实例模式依然不支持 IE）。</p><p>第 222 行：调用了 <strong>single-spa</strong> 的 <strong>startSingleSpa</strong> 方法启动主应用。</p><p>从上面可以看出，<strong>start</strong> 函数负责初始化一些全局设置，然后启动应用。这些初始化的配置参数有一部分将在 <strong>registerMicroApps</strong> 注册子应用的回调函数中使用，我们继续往下看。</p><h2 id="registermicroapps-apps-lifecycles" tabindex="-1"><a class="header-anchor" href="#registermicroapps-apps-lifecycles"><span>registerMicroApps(apps, lifeCycles?)</span></a></h2><p><strong>registerMicroApps</strong> 函数的作用是注册子应用，并且在子应用激活时，创建运行沙箱，在不同阶段调用不同的生命周期钩子函数。</p>',9),w=["src"],y=s("<p>从上面可以看出，在 第 70~71 行 <strong>registerMicroApps</strong> 函数做了个处理，防止重复注册相同的子应用。</p><p>在 第 74 行 调用了 <strong>single-spa</strong> 的 <strong>registerApplication</strong> 方法注册了子应用。</p><p>我们直接来看 <strong>registerApplication</strong> 方法，<strong>registerApplication</strong> 方法是 <strong>single-spa</strong> 中注册子应用的核心函数。该函数有四个参数，分别是</p><ul><li>name（子应用的名称）</li><li>回调函数（activeRule 激活时调用）</li><li>activeRule（子应用的激活规则）</li><li>props（主应用需要传递给子应用的数据）</li></ul><p>这些参数都是由 <strong>single-spa</strong> 直接实现，这里可以先简单理解为注册子应用。在符合 <strong>activeRule</strong> 激活规则时将会激活子应用，执行回调函数，返回一些生命周期钩子函数。</p><blockquote><p>注意，这些生命周期钩子函数属于 single-spa，由 single-spa 决定在何时调用。</p></blockquote><p>如果你还是觉得有点懵，没关系，我们通过一张图来帮助理解。</p>",7),f=["src"],b=s('<h2 id="import-html-entry" tabindex="-1"><a class="header-anchor" href="#import-html-entry"><span>import-html-entry</span></a></h2><p>我们从上面分析可以看出，<strong>qiankun</strong> 的 <strong>registerMicroApps</strong> 方法中第一个入参 apps - <strong>Array&lt;RegistrableApp&lt;<strong>T</strong>&gt;&gt;</strong> 有三个参数 <strong>name、activeRule、props</strong> 都是交给 <strong>single-spa</strong> 使用，还有 <strong>entry</strong> 和 <strong>render</strong> 参数还没有用到。</p><p>我们这里需要关注 <strong>entry（子应用的 entry 地址）</strong> 和 <strong>render（子应用被激活时触发的渲染规则）</strong> 这两个还没有用到的参数，这两个参数延迟到 <strong>single-spa</strong> 子应用激活后的回调函数中执行。</p><p>那我们假设此时我们的子应用已激活，我们来看看这里做了什么。</p>',4),x=["src"],k=t("p",null,"从上图可以看出，在子应用激活后，首先在 第 81~84 行 处使用了 import-html-entry 库从 entry 进入加载子应用，加载完成后将返回一个对象",-1),v=["src"],S=s('<table><thead><tr><th style="text-align:left;">字段</th><th style="text-align:left;">解释</th></tr></thead><tbody><tr><td style="text-align:left;"><code>template</code></td><td style="text-align:left;">将脚本文件内容注释后的 <code>html</code> 模板文件</td></tr><tr><td style="text-align:left;"><code>assetPublicPath</code></td><td style="text-align:left;">资源地址根路径，可用于加载子应用资源</td></tr><tr><td style="text-align:left;"><code>getExternalScripts</code></td><td style="text-align:left;">方法：获取外部引入的脚本文件</td></tr><tr><td style="text-align:left;"><code>getExternalStyleSheets</code></td><td style="text-align:left;">方法：获取外部引入的样式表文件</td></tr><tr><td style="text-align:left;"><code>execScripts</code></td><td style="text-align:left;">方法：执行该模板文件中所有的 <code>JS</code> 脚本文件，并且可以指定脚本的作用域 - <code>proxy</code> 对象</td></tr></tbody></table><p>我们先将 <strong>template 模板</strong>、<strong>getExternalScripts</strong> 和 <strong>getExternalStyleSheets</strong> 函数的执行结果打印出来，效果如下:</p>',2),q=["src"],E=t("p",null,[e("从上图我们可以看到我们外部引入的三个 "),t("strong",null,"js"),e(" 脚本文件，这个模板文件没有外部 "),t("strong",null,"css"),e(" 样式表，对应的样式表数组也为空。")],-1),M=t("p",null,[e("然后我们再来分析 "),t("strong",null,"execScripts"),e(" 方法，该方法的作用就是指定一个 "),t("strong",null,"proxy（默认是 window）对象"),e("，然后执行该模板文件中所有的 JS，并返回 JS 执行后 proxy 对象的最后一个属性。")],-1),K=t("p",null,"在微前端架构中，这个对象一般会包含一些子应用的生命周期钩子函数，主应用可以通过在特定阶段调用这些生命周期钩子函数，进行挂载和销毁子应用的操作。",-1),B=["src"],$=["src"],P=t("p",null,[e("在 qiankun 的 "),t("strong",null,"importEntry"),e(" 函数中还传入了配置项 "),t("strong",null,"getTemplate"),e("，这个其实是对 html 目标文件的二次处理，这里就不作展开了，有兴趣的可以自行去了解一下。")],-1),A=t("h2",{id:"主应用挂载子应用-html-模板",tabindex:"-1"},[t("a",{class:"header-anchor",href:"#主应用挂载子应用-html-模板"},[t("span",null,"主应用挂载子应用 HTML 模板")])],-1),T=t("p",null,"我们回到 qiankun 源码部分继续看",-1),L=["src"],I=t("p",null,"从上图看出，在 第 85~87 行 处，先对单实例进行检测。在单实例模式下，新的子应用挂载行为会在旧的子应用卸载之后才开始。",-1),D=t("p",null,"在 第 88 行 中，执行注册子应用时传入的 render 函数，将 HTML Template 和 loading 作为入参，render 函数的内容一般是将 HTML 挂载在指定容器中（见下图）。",-1),C=["src"],V=t("p",null,"在这个阶段，主应用已经将子应用基础的 HTML 结构挂载在了主应用的某个容器内，接下来还需要执行子应用对应的 mount 方法（如 Vue.$mount）对子应用状态进行挂载。",-1),j=t("p",null,"此时页面还可以根据 loading 参数开启一个类似加载的效果，直至子应用全部内容加载完成。",-1),N=t("h2",{id:"沙箱运行环境-gensandbox",tabindex:"-1"},[t("a",{class:"header-anchor",href:"#沙箱运行环境-gensandbox"},[t("span",null,"沙箱运行环境 - genSandbox")])],-1),R=t("p",null,"我们回到 qiankun 源码部分继续看，此时还是子应用激活时的回调函数部分（见下图）",-1),H=["src"],O=t("p",null,"在 第 90~98 行 是 qiankun 比较核心的部分，也是几个子应用之间状态独立的关键，那就是 js 的沙箱运行环境。如果关闭了 useJsSandbox 选项，那么所有子应用的沙箱环境都是 window，就很容易对全局状态产生污染。",-1),U=t("p",null,"我们进入到 genSandbox 内部，看看 qiankun 是如何创建的 （JS）沙箱运行环境。（见下图）",-1),G=["src"],F=t("p",null,"从上图可以看出 genSandbox 内部的沙箱主要是通过是否支持 window.Proxy 分为 LegacySandbox 和 SnapshotSandbox 两种。",-1),W=t("blockquote",null,[t("p",null,"扩展阅读：多实例还有一种 ProxySandbox 沙箱，这种沙箱模式目前看来是最优方案。由于其表现与旧版本略有不同，所以暂时只用于多实例模式。"),t("p",null,"ProxySandbox 沙箱稳定之后可能会作为单实例沙箱使用。")],-1),J=t("h3",{id:"legacysandbox",tabindex:"-1"},[t("a",{class:"header-anchor",href:"#legacysandbox"},[t("span",null,"LegacySandbox")])],-1),Q=t("p",null,"我们先来看看 LegacySandbox 沙箱是怎么进行状态隔离的（见下图）",-1),Z=["src"],z=s('<p>我们来分析一下 LegacySandbox 类的几个属性：</p><table><thead><tr><th style="text-align:left;">字段</th><th style="text-align:left;">解释</th></tr></thead><tbody><tr><td style="text-align:left;"><code>addedPropsMapInSandbox</code></td><td style="text-align:left;">记录沙箱运行期间新增的全局变量</td></tr><tr><td style="text-align:left;"><code>modifiedPropsOriginalValueMapInSandbox</code></td><td style="text-align:left;">记录沙箱运行期间更新的全局变量</td></tr><tr><td style="text-align:left;"><code>currentUpdatedPropsValueMap</code></td><td style="text-align:left;">记录沙箱运行期间操作过的全局变量。上面两个 <code>Map</code> 用于 <code>关闭沙箱</code> 时还原全局状态，而 <code>currentUpdatedPropsValueMap</code> 是在 <code>激活沙箱</code> 时还原沙箱的独立状态</td></tr><tr><td style="text-align:left;"><code>name</code></td><td style="text-align:left;">沙箱名称</td></tr><tr><td style="text-align:left;"><code>proxy</code></td><td style="text-align:left;">代理对象，可以理解为子应用的 <code>global/window</code> 对象</td></tr><tr><td style="text-align:left;"><code>sandboxRunning</code></td><td style="text-align:left;">当前沙箱是否在运行中</td></tr><tr><td style="text-align:left;"><code>active</code></td><td style="text-align:left;">激活沙箱，在子应用挂载时启动</td></tr><tr><td style="text-align:left;"><code>inactive</code></td><td style="text-align:left;">关闭沙箱，在子应用卸载时启动</td></tr><tr><td style="text-align:left;"><code>constructor</code></td><td style="text-align:left;">构造函数，创建沙箱环境</td></tr></tbody></table><p>我们现在从 window.Proxy 的 set 和 get 属性来详细讲解 LegacySandbox 是如何实现沙箱运行环境的。（见下图）</p>',3),Y=["src"],X=s(`<blockquote><p>注意：子应用沙箱中的 proxy 对象（第 62 行）可以简单理解为子应用的 window 全局对象（代码如下），子应用对全局属性的操作就是对该 proxy 对象属性的操作，带着这份理解继续往下看吧。</p></blockquote><div class="language-javascript line-numbers-mode" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="token comment">// 子应用脚本文件的执行过程：</span>
<span class="token function">eval</span><span class="token punctuation">(</span>
  <span class="token comment">// 这里将 proxy 作为 window 参数传入</span>
  <span class="token comment">// 子应用的全局对象就是该子应用沙箱的 proxy 对象</span>
  <span class="token punctuation">(</span><span class="token keyword">function</span><span class="token punctuation">(</span><span class="token parameter">window</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">/* 子应用脚本文件内容 */</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">(</span>proxy<span class="token punctuation">)</span>
<span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在 第 65~72 行中，当调用 set 向子应用 proxy/window 对象设置属性时，所有的属性设置和更新都会先记录在 addedPropsMapInSandbox 或 modifiedPropsOriginalValueMapInSandbox 中，然后统一记录到currentUpdatedPropsValueMap 中。</p><p>在 第 73 行 中修改全局 window 的属性，完成值的设置。</p><p>当调用 get 从子应用 proxy/window 对象取值时，会直接从 window 对象中取值。对于非构造函数的取值将会对 this 指针绑定到 window 对象后，再返回函数。</p><p>LegacySandbox 的沙箱隔离是通过激活沙箱时还原子应用状态，卸载时还原主应用状态（子应用挂载前的全局状态）实现的，具体实现如下（见下图）。</p>`,6),tt=["src"],nt=t("p",null,"从上图可以看出：",-1),et=t("p",null,"第 37 行：在激活沙箱时，沙箱会通过 currentUpdatedPropsValueMap 查询到子应用的独立状态池（沙箱可能会激活多次，这里是沙箱曾经激活期间被修改的全局变量），然后还原子应用状态。",-1),st=t("p",null,"第 44~45 行：在关闭沙箱时，通过 addedPropsMapInSandbox 删除在沙箱运行期间新增的全局变量，通过 modifiedPropsOriginalValueMapInSandbox 还原沙箱运行期间被修改的全局变量，从而还原到子应用挂载前的状态。",-1),ot=t("p",null,"从上面的分析可以得知，LegacySandbox 的沙箱隔离机制利用快照模式实现，我们画一张图来帮助理解（见下图）",-1),lt=["src"],it=t("h3",{id:"多实例沙箱-proxysandbox",tabindex:"-1"},[t("a",{class:"header-anchor",href:"#多实例沙箱-proxysandbox"},[t("span",null,"多实例沙箱 - ProxySandbox")])],-1),at=t("p",null,"ProxySandbox 是一种新的沙箱模式，目前用于多实例模式的状态隔离。在稳定后以后可能会成为 单实例沙箱，我们来看看 ProxySandbox 沙箱是怎么进行状态隔离的（见下图）",-1),dt=["src"],rt=s('<p>我们来分析一下 ProxySandbox 类的几个属性：</p><table><thead><tr><th style="text-align:left;">字段</th><th style="text-align:left;">解释</th></tr></thead><tbody><tr><td style="text-align:left;"><code>updateValueMap</code></td><td style="text-align:left;">记录沙箱中更新的值，也就是每个子应用中独立的状态池</td></tr><tr><td style="text-align:left;"><code>name</code></td><td style="text-align:left;">沙箱名称</td></tr><tr><td style="text-align:left;"><code>proxy</code></td><td style="text-align:left;">代理对象，可以理解为子应用的 <code>global/window</code> 对象</td></tr><tr><td style="text-align:left;"><code>sandboxRunning</code></td><td style="text-align:left;">当前沙箱是否在运行中</td></tr><tr><td style="text-align:left;"><code>active</code></td><td style="text-align:left;">激活沙箱，在子应用挂载时启动</td></tr><tr><td style="text-align:left;"><code>inactive</code></td><td style="text-align:left;">关闭沙箱，在子应用卸载时启动</td></tr><tr><td style="text-align:left;"><code>constructor</code></td><td style="text-align:left;">构造函数，创建沙箱环境</td></tr></tbody></table><p>我们现在从 window.Proxy 的 set 和 get 属性来详细讲解 ProxySandbox 是如何实现沙箱运行环境的。（见下图）</p>',3),ct=["src"],pt=s(`<blockquote><p>注意：子应用沙箱中的 proxy 对象可以简单理解为子应用的 window 全局对象（代码如下），子应用对全局属性的操作就是对该 proxy 对象属性的操作，带着这份理解继续往下看吧。</p></blockquote><div class="language-javascript line-numbers-mode" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="token comment">// 子应用脚本文件的执行过程：</span>
<span class="token function">eval</span><span class="token punctuation">(</span>
  <span class="token comment">// 这里将 proxy 作为 window 参数传入</span>
  <span class="token comment">// 子应用的全局对象就是该子应用沙箱的 proxy 对象</span>
  <span class="token punctuation">(</span><span class="token keyword">function</span><span class="token punctuation">(</span><span class="token parameter">window</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">/* 子应用脚本文件内容 */</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">(</span>proxy<span class="token punctuation">)</span>
<span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>当调用 set 向子应用 proxy/window 对象设置属性时，所有的属性设置和更新都会命中 updateValueMap，存储在 updateValueMap 集合中（第 38 行），从而避免对 window 对象产生影响（旧版本则是通过 diff 算法还原 window 对象状态快照，子应用之间的状态是隔离的，而父子应用之间 window 对象会有污染）。</p><p>当调用 get 从子应用 proxy/window 对象取值时，会优先从子应用的沙箱状态池 updateValueMap 中取值，如果没有命中才从主应用的 window 对象中取值（第 49 行）。对于非构造函数的取值将会对 this 指针绑定到 window 对象后，再返回函数。</p><p>如此一来，ProxySandbox 沙箱应用之间的隔离就完成了，所有子应用对 proxy/window 对象值的存取都受到了控制。设置值只会作用在沙箱内部的 updateValueMap 集合上，取值也是优先取子应用独立状态池（updateValueMap）中的值，没有找到的话，再从 proxy/window 对象中取值。</p><p>相比较而言，ProxySandbox 是最完备的沙箱模式，完全隔离了对 window 对象的操作，也解决了快照模式中子应用运行期间仍然会对 window 造成污染的问题。</p><p>我们对 ProxySandbox 沙箱画一张图来加深理解（见下图）</p>`,7),ut=["src"],gt=t("h3",{id:"snapshotsandbox",tabindex:"-1"},[t("a",{class:"header-anchor",href:"#snapshotsandbox"},[t("span",null,"SnapshotSandbox")])],-1),ht=t("p",null,"在不支持 window.Proxy 属性时，将会使用 SnapshotSandbox 沙箱，我们来看看其内部实现（见下图）",-1),mt=["src"],_t=s('<p>我们来分析一下 SnapshotSandbox 类的几个属性：</p><table><thead><tr><th style="text-align:left;">字段</th><th style="text-align:left;">解释</th></tr></thead><tbody><tr><td style="text-align:left;"><code>name</code></td><td style="text-align:left;">沙箱名称</td></tr><tr><td style="text-align:left;"><code>proxy</code></td><td style="text-align:left;">代理对象，此处为 <code>window</code> 对象</td></tr><tr><td style="text-align:left;"><code>sandboxRunning</code></td><td style="text-align:left;">当前沙箱是否激活</td></tr><tr><td style="text-align:left;"><code>windowSnapshot</code></td><td style="text-align:left;"><code>window</code> 状态快照</td></tr><tr><td style="text-align:left;"><code>modifyPropsMap</code></td><td style="text-align:left;">沙箱运行期间被修改过的 <code>window</code> 属性</td></tr><tr><td style="text-align:left;"><code>constructor</code></td><td style="text-align:left;">构造函数，激活沙箱</td></tr><tr><td style="text-align:left;"><code>active</code></td><td style="text-align:left;">激活沙箱，在子应用挂载时启动</td></tr><tr><td style="text-align:left;"><code>inactive</code></td><td style="text-align:left;">关闭沙箱，在子应用卸载时启动</td></tr></tbody></table><p>SnapshotSandbox 的沙箱环境主要是通过激活时记录 window 状态快照，在关闭时通过快照还原 window 对象来实现的。（见下图）</p>',3),wt=["src"],yt=t("p",null,"我们先看 active 函数，在沙箱激活时，会先给当前 window 对象打一个快照，记录沙箱激活前的状态（第 38~40 行）。打完快照后，函数内部将 window 状态通过 modifyPropsMap 记录还原到上次的沙箱运行环境，也就是还原沙箱激活期间（历史记录）修改过的 window 属性。",-1),ft=t("p",null,"在沙箱关闭时，调用 inactive 函数，在沙箱关闭前通过遍历比较每一个属性，将被改变的 window 对象属性值（第 54 行）记录在 modifyPropsMap 集合中。在记录了 modifyPropsMap 后，将 window 对象通过快照 windowSnapshot 还原到被沙箱激活前的状态（第 55 行），相当于是将子应用运行期间对 window 造成的污染全部清除。",-1),bt=t("p",null,"SnapshotSandbox 沙箱就是利用快照实现了对 window 对象状态隔离的管理。相比较 ProxySandbox 而言，在子应用激活期间，SnapshotSandbox 将会对 window 对象造成污染，属于一个对不支持 Proxy 属性的浏览器的向下兼容方案。",-1),xt=t("p",null,"我们对 SnapshotSandbox 沙箱画一张图来加深理解（见下图）",-1),kt=["src"],vt=t("h2",{id:"挂载沙箱-mountsandbox",tabindex:"-1"},[t("a",{class:"header-anchor",href:"#挂载沙箱-mountsandbox"},[t("span",null,"挂载沙箱 - mountSandbox")])],-1),St=["src"],qt=t("p",null,"我们继续回到这张图，genSandbox 函数不仅返回了一个 sandbox 沙箱，还返回了一个 mount 和 unmount 方法，分别在子应用挂载时和卸载时的时候调用。",-1),Et=t("p",null,"我们先看看 mount 函数内部（见下图）",-1),Mt=["src"],Kt=t("p",null,"首先，在 mount 内部先激活了子应用沙箱（第 26 行），在沙箱启动后开始劫持各类全局监听（第 27 行），我们这里重点看看 patchAtMounting 内部是怎么实现的。（见下图）",-1),Bt=["src"],$t=t("p",null,"patchAtMounting 内部调用了下面四个函数：",-1),Pt=t("ul",null,[t("li",null,"patchTimer（计时器劫持）"),t("li",null,"patchWindowListener（window 事件监听劫持）"),t("li",null,"patchHistoryListener（window.history 事件监听劫持）"),t("li",null,"patchDynamicAppend（动态添加 Head 元素事件劫持）")],-1),At=t("p",null,"上面四个函数实现了对 window 指定对象的统一劫持，我们可以挑一些解析看看其内部实现。",-1),Tt=t("h3",{id:"计时器劫持-patchtimer",tabindex:"-1"},[t("a",{class:"header-anchor",href:"#计时器劫持-patchtimer"},[t("span",null,"计时器劫持 - patchTimer")])],-1),Lt=t("p",null,"我们先来看看 patchTimer 对计时器的劫持（见下图）",-1),It=["src"],Dt=t("p",null,"从上图可以看出，patchTimer 内部将 setInterval 进行重载，将每个启用的定时器的 intervalId 都收集起来（第 23~24 行），以便在子应用卸载时调用 free 函数将计时器全部清除（见下图）",-1),Ct=["src"],Vt=t("p",null,"我们来看看在子应用加载时的 setInterval 函数验证即可（见下图）",-1),jt=["src"],Nt=t("p",null,"从上图可以看出，在进入子应用时，setInterval 已经被替换成了劫持后的函数，防止全局计时器泄露污染。",-1),Rt=t("h3",{id:"动态添加样式表和脚本文件劫持-patchdynamicappend",tabindex:"-1"},[t("a",{class:"header-anchor",href:"#动态添加样式表和脚本文件劫持-patchdynamicappend"},[t("span",null,"动态添加样式表和脚本文件劫持 - patchDynamicAppend")])],-1),Ht=t("p",null,"patchWindowListener 和 patchHistoryListener 的实现都与 patchTimer 实现类似，这里就不作复述了。",-1),Ot=t("p",null,"我们需要重点对 patchDynamicAppend 函数进行解析，这个函数的作用是劫持对 head 元素的操作（见下图）",-1),Ut=["src"],Gt=t("p",null,"从上图可以看出，patchDynamicAppend 主要是对动态添加的 style 样式表和 script 标签做了处理。",-1),Ft=t("p",null,"我们先看看对 style 样式表的处理（见下图）",-1),Wt=["src"],Jt=t("p",null,"从上图可以看出，主要的处理逻辑在 第 68~74 行，如果当前子应用处于激活状态（判断子应用的激活状态主要是因为：当主应用切换路由时可能会自动添加动态样式表， 此时需要避免主应用的样式表被添加到子应用head节点中导致出错），那么动态 style 样式表就会被添加到子应用容器内（见下图），在子应用卸载时样式表也可以和子应用一起被卸载，从而避免样式污染。 同时，动态样式表也会存储在 dynamicStyleSheetElements 数组中，在后面还会提到其用处。",-1),Qt=["src"],Zt=t("p",null,"我们再来看看对 script 脚本文件的处理（见下图）",-1),zt=["src"],Yt=t("p",null,"对动态 script 脚本文件的处理较为复杂一些，我们也来解析一波：",-1),Xt=t("p",null,"在 第 83~101 行 处对外部引入的 script 脚本文件使用 fetch 获取，然后使用 execScripts 指定 proxy 对象（作为 window 对象）后执行脚本文件内容，同时也触发了 load 和 error 两个事件。",-1),tn=t("p",null,"在 第 103~106 行 处将注释后的脚本文件内容以注释的形式添加到子应用容器内。",-1),nn=t("p",null,"在 第 109~113 行 是对内嵌脚本文件的执行过程，就不作复述了。",-1),en=t("p",null,"我们可以看出，对动态添加的脚本进行劫持的主要目的就是为了将动态脚本运行时的 window 对象替换成 proxy 代理对象，使子应用动态添加的脚本文件的运行上下文也替换成子应用自身。",-1),sn=t("p",null,"HTMLHeadElement.prototype.removeChild 的逻辑就是多加了个子应用容器判断，其他无异，就不展开说了。",-1),on=t("p",null,"最后我们来看看 free 函数（见下图）",-1),ln=["src"],an=t("p",null,"这个 free 函数与其他的 patches（劫持函数） 实现不太一样，这里缓存了一份 cssRules，在重新挂载的时候会执行 rebuild 函数将其还原。 这是因为样式元素 DOM 从文档中删除后，浏览器会自动清除样式元素表。如果不这么做的话，在重新挂载时会出现存在 style 标签，但是没有渲染样式的问题。",-1),dn=t("h2",{id:"卸载沙箱-unmountsandbox",tabindex:"-1"},[t("a",{class:"header-anchor",href:"#卸载沙箱-unmountsandbox"},[t("span",null,"卸载沙箱 - unmountSandbox")])],-1),rn=t("p",null,"我们再回到 mount 函数本身（见下图）",-1),cn=["src"],pn=t("p",null,"从上图可以看出，在 patchAtMounting 函数中劫持了各类全局监听，并返回了解除劫持的 free 函数。在卸载应用时调用 free 函数解除这些全局监听的劫持行为（见下图）",-1),un=["src"],gn=t("p",null,"从上图可以看到 sideEffectsRebuilders 在 free 后被返回，在 mount 的时候又将被调用 rebuild 重建动态样式表。这块环环相扣，是稍微有点绕，没太看明白的同学可以翻上去再看一遍。",-1),hn=t("p",null,"到这里，qiankun 的最核心部分-沙箱机制，我们就已经解析完毕了，接下来我们继续剖析别的部分。",-1),mn=t("p",null,"在这里我们画一张图，对沙箱的创建过程进行一个总梳理（见下图）",-1),_n=["src"],wn=t("h3",{id:"注册内部生命周期函数",tabindex:"-1"},[t("a",{class:"header-anchor",href:"#注册内部生命周期函数"},[t("span",null,"注册内部生命周期函数")])],-1),yn=t("p",null,"在创建好了沙箱环境后，在 第 100~106 行 注册了一些内部生命周期函数（见下图）",-1),fn=["src"],bn=t("p",null,"在上图中，第 106 行 的 mergeWith 方法的作用是将内置的生命周期函数与传入的 lifeCycles 生命周期函数。",-1),xn=t("blockquote",null,[t("p",null,"这里的 lifeCycles 生命周期函数指的是全子应用共享的生命周期函数，可用于执行多个子应用间相同的逻辑操作，例如 加载效果 之类的。（见下图）")],-1),kn=["src"],vn=t("p",null,"除了外部传入的生命周期函数外，我们还需要关注 qiankun 内置的生命周期函数做了些什么（见下图）",-1),Sn=["src"],qn=t("p",null,"我们对上图的代码进行逐一解析：",-1),En=t("ul",null,[t("li",null,"第 13~15 行：在加载子应用前 beforeLoad（只会执行一次）时注入一个环境变量，指示了子应用的 public 路径。"),t("li",null,"第 17~19 行：在挂载子应用前 beforeMount（可能会多次执行）时可能也会注入该环境变量。"),t("li",null,"第 23~30 行：在卸载子应用前 beforeUnmount 时将环境变量还原到原始状态。")],-1),Mn=t("p",null,[e("通过上面的分析我们可以得出一个结论，我们可以在子应用中获取该环境变量，将其设置为 "),t("strong",null,"webpack_public_path"),e(" 的值，从而使子应用在主应用中运行时，可以匹配正确的资源路径。（见下图）")],-1),Kn=["src"],Bn=t("h3",{id:"触发-beforeload-生命周期钩子函数",tabindex:"-1"},[t("a",{class:"header-anchor",href:"#触发-beforeload-生命周期钩子函数"},[t("span",null,"触发 beforeLoad 生命周期钩子函数")])],-1),$n=t("p",null,"在注册完了生命周期函数后，立即触发了 beforeLoad 生命周期钩子函数（见下图）",-1),Pn=["src"],An=t("p",null,"从上图可以看出，在 第 108 行 中，触发了 beforeLoad 生命周期钩子函数。",-1),Tn=t("p",null,"随后，在 第 110 行 执行了 import-html-entry 的 execScripts 方法。指定了脚本文件的运行沙箱（jsSandbox），执行完子应用的脚本文件后，返回了一个对象，对象包含了子应用的生命周期钩子函数（见下图）。",-1),Ln=["src"],In=t("p",null,"在 第 112~121 行 对子应用的生命周期钩子函数做了个检测，如果在子应用的导出对象中没有发现生命周期钩子函数，会在沙箱对象中继续查找生命周期钩子函数。如果最后没有找到生命周期钩子函数则会抛出一个错误，所以我们的子应用一定要有 bootstrap, mount, unmount 这三个生命周期钩子函数才能被 qiankun 正确嵌入到主应用中。",-1),Dn=t("p",null,"这里我们画一张图，对子应用挂载前的初始化过程做一个总梳理（见下图）",-1),Cn=["src"],Vn=t("h3",{id:"进入到-mount-挂载流程",tabindex:"-1"},[t("a",{class:"header-anchor",href:"#进入到-mount-挂载流程"},[t("span",null,"进入到 mount 挂载流程")])],-1),jn=t("p",null,"在一些初始化配置（如 子应用资源、运行沙箱环境、生命周期钩子函数等等）准备就绪后，qiankun 内部将其组装在一起，返回了三个函数作为 single-spa 内部的生命周期函数",-1),Nn=t("p",null,"single-spa 内部的逻辑我们后面再展开说，这里我们可以简单理解为 single-spa 内部的三个生命周期钩子函数：",-1),Rn=t("ul",null,[t("li",null,"bootstrap：子应用初始化时调用，只会调用一次；"),t("li",null,"mount：子应用挂载时调用，可能会调用多次；"),t("li",null,"unmount：子应用卸载时调用，可能会调用多次；")],-1),Hn=t("p",null,"我们可以看出，在 bootstrap 阶段调用了子应用暴露的 bootstrap 生命周期函数。",-1),On=t("p",null,"我们这里对 mount 阶段进行展开，看看在子应用 mount 阶段执行了哪些函数（见下",-1),Un=["src"],Gn=t("p",null,"我们进行逐行解析：",-1),Fn=t("ul",null,[t("li",null,"第 127~133 行：对单实例模式进行检测。在单实例模式下，新的子应用挂载行为会在旧的子应用卸载之后才开始。（由于这里是串行顺序执行，所以如果某一处发生阻塞的话，会阻塞所有后续的函数执行）"),t("li",null,"第 134 行：执行注册子应用时传入的 render 函数，将 HTML Template 和 loading 作为入参。这里一般是在发生了一次 unmount 后，再次进行 mount 挂载行为时将 HTML 挂载在指定容器中（见下图）")],-1),Wn=t("blockquote",null,[t("p",null,"由于初始化的时候已经调用过一次 render，所以在首次调用 mount 时可能已经执行过一次 render 方法。"),t("p",null,'在下面的代码中也有对重复挂载的情况进行判断的语句 - if (frame.querySelector("div") === null，防止重复挂载子应用。')],-1),Jn=["src"],Qn=t("ul",null,[t("li",null,"第 135 行：触发了 beforeMount 全局生命周期钩子函数；"),t("li",null,"第 136 行：挂载沙箱，这一步中激活了对应的子应用沙箱，劫持了部分全局监听（如 setInterval）。此时开始子应用的代码将在沙箱中运行。（反推可知，在 beforeMount 前的部分全局操作将会对主应用造成污染，如 setInterval）"),t("li",null,"第 137 行：触发子应用的 mount 生命周期钩子函数，在这一步通常是执行对应的子应用的挂载操作（如 ReactDOM.render、Vue.$mount。（见下图）")],-1),Zn=["src"],zn=t("ul",null,[t("li",null,"第 138 行：再次调用 render 函数，此时 loading 参数为 false，代表子应用已经加载完成。"),t("li",null,"第 139 行：触发了 afterMount 全局生命周期钩子函数；"),t("li",null,"第 140~144 行：在单实例模式下设置 prevAppUnmountedDeferred 的值，这个值是一个 promise，在当前子应用卸载时才会被 resolve，在该子应用运行期间会阻塞其他子应用的挂载动作（第 134 行）；")],-1),Yn=t("p",null,"我们在上面很详细的剖析了整个子应用的 mount 挂载流程，如果你还没有搞懂的话，没关系，我们再画一个流程图来帮助理解。（见下图）",-1),Xn=["src"],te=t("h3",{id:"进入到-unmount-卸载流程",tabindex:"-1"},[t("a",{class:"header-anchor",href:"#进入到-unmount-卸载流程"},[t("span",null,"进入到 unmount 卸载流程")])],-1),ne=t("p",null,"我们刚才梳理了子应用的 mount 挂载流程，我们现在就进入到子应用的 unmount 卸载流程。在子应用激活阶段， activeRule 未命中时将会触发 unmount 卸载行为，具体的行为如下（见下图）",-1),ee=["src"],se=s("<p>从上图我们可以看出，unmount 卸载流程要比 mount 简单很多，我们直接来梳理一下：</p><ul><li><p>第 148 行：触发了 beforeUnmount 全局生命周期钩子函数；</p></li><li><p>第 149 行：这里与 mount 流程的顺序稍微有点不同，这里先执行了子应用的 unmount 生命周期钩子函数，保证子应用仍然是运行在沙箱内，避免造成状态污染。在这里一般是对子应用的一些状态进行清理和卸载操作。（如下图，销毁了刚才创建的 vue 实例）</p></li><li><p>第 150 行：卸载沙箱，关闭了沙箱的激活状态。</p></li><li><p>第 151 行：触发了 afterUnmount 全局生命周期钩子函数；</p></li><li><p>第 152 行：触发 render 方法，并且传入的 appContent 为空字符串，此处可以清空主应用容器内的内容。</p></li><li><p>第 153~156 行：当前子应用卸载完成后，在单实例模式下触发 prevAppUnmountedDeferred.resolve()，使其他子应用的挂载行为得以继续进行，不再阻塞。</p></li></ul><p>我们对 unmount 卸载流程也画一张图，帮助大家理解（见下图）。</p>",3),oe=["src"],le=t("h2",{id:"总结",tabindex:"-1"},[t("a",{class:"header-anchor",href:"#总结"},[t("span",null,"总结")])],-1),ie=t("p",null,"到这里，我们对 qiankun 框架的总流程梳理就差不多了。这里应该做个总结，大家看了这么多文字，估计大家也看累了，最后用一张图对 qiankun 的总流程进行总结吧。",-1),ae=["src"],de=t("h2",{id:"彩蛋",tabindex:"-1"},[t("a",{class:"header-anchor",href:"#彩蛋"},[t("span",null,"彩蛋")])],-1),re=["src"],ce=t("h2",{id:"展望",tabindex:"-1"},[t("a",{class:"header-anchor",href:"#展望"},[t("span",null,"展望")])],-1),pe=t("p",null,"传统的云控制台应用，几乎都会面临业务快速发展之后，单体应用进化成巨石应用的问题。我们要如何维护一个巨无霸中台应用？",-1),ue=t("p",null,"上面这个问题引出了微前端架构理念，所以微前端的概念也越来越火，我们团队最近也在尝试转型微前端架构。",-1),ge=t("p",null,"工欲善其事必先利其器，所以针对 qiankun 的源码进行解读，在分享知识的同时也是帮助自己理解。",-1),he=["src"];function me(n,_e){return l(),i("div",null,[r,c,p,u,a(" more "),t("img",{src:n.$withBase("/assets/knowledge/frontEnd/micro/qianKun/microInfo.png")},null,8,g),h,t("img",{src:n.$withBase("/assets/knowledge/frontEnd/micro/qianKun/start.png")},null,8,m),_,t("img",{src:n.$withBase("/assets/knowledge/frontEnd/micro/qianKun/registerMicroApps.png")},null,8,w),y,t("img",{src:n.$withBase("/assets/knowledge/frontEnd/micro/qianKun/flow.png")},null,8,f),b,t("img",{src:n.$withBase("/assets/knowledge/frontEnd/micro/qianKun/importHtmlEntry.png")},null,8,x),k,t("img",{src:n.$withBase("/assets/knowledge/frontEnd/micro/qianKun/entry.png")},null,8,v),S,t("img",{src:n.$withBase("/assets/knowledge/frontEnd/micro/qianKun/entryDetail.png")},null,8,q),E,M,K,t("img",{src:n.$withBase("/assets/knowledge/frontEnd/micro/qianKun/execScripts.png")},null,8,B),t("img",{src:n.$withBase("/assets/knowledge/frontEnd/micro/qianKun/proxyLastOptions.png")},null,8,$),P,A,T,t("img",{src:n.$withBase("/assets/knowledge/frontEnd/micro/qianKun/render.png")},null,8,L),I,D,t("img",{src:n.$withBase("/assets/knowledge/frontEnd/micro/qianKun/mountedApp.png")},null,8,C),V,j,N,R,t("img",{src:n.$withBase("/assets/knowledge/frontEnd/micro/qianKun/genSandbox.png")},null,8,H),O,U,t("img",{src:n.$withBase("/assets/knowledge/frontEnd/micro/qianKun/genSandboxDetail.png")},null,8,G),F,W,J,Q,t("img",{src:n.$withBase("/assets/knowledge/frontEnd/micro/qianKun/legacySandbox.png")},null,8,Z),z,t("img",{src:n.$withBase("/assets/knowledge/frontEnd/micro/qianKun/genSandboxProxy.png")},null,8,Y),X,t("img",{src:n.$withBase("/assets/knowledge/frontEnd/micro/qianKun/legacySandboxActive.png")},null,8,tt),nt,et,st,ot,t("img",{src:n.$withBase("/assets/knowledge/frontEnd/micro/qianKun/legacySandboxFlow.png")},null,8,lt),it,at,t("img",{src:n.$withBase("/assets/knowledge/frontEnd/micro/qianKun/proxySandbox.png")},null,8,dt),rt,t("img",{src:n.$withBase("/assets/knowledge/frontEnd/micro/qianKun/proxySandboxProxy.png")},null,8,ct),pt,t("img",{src:n.$withBase("/assets/knowledge/frontEnd/micro/qianKun/proxySandboxFlow.png")},null,8,ut),gt,ht,t("img",{src:n.$withBase("/assets/knowledge/frontEnd/micro/qianKun/snapshotSandbox.png")},null,8,mt),_t,t("img",{src:n.$withBase("/assets/knowledge/frontEnd/micro/qianKun/snapshotSandboxActive.png")},null,8,wt),yt,ft,bt,xt,t("img",{src:n.$withBase("/assets/knowledge/frontEnd/micro/qianKun/snapshotSandboxFlow.png")},null,8,kt),vt,t("img",{src:n.$withBase("/assets/knowledge/frontEnd/micro/qianKun/genSandbox.png")},null,8,St),qt,Et,t("img",{src:n.$withBase("/assets/knowledge/frontEnd/micro/qianKun/mount.png")},null,8,Mt),Kt,t("img",{src:n.$withBase("/assets/knowledge/frontEnd/micro/qianKun/patchAtMounting.png")},null,8,Bt),$t,Pt,At,Tt,Lt,t("img",{src:n.$withBase("/assets/knowledge/frontEnd/micro/qianKun/patchTimer-patch.png")},null,8,It),Dt,t("img",{src:n.$withBase("/assets/knowledge/frontEnd/micro/qianKun/patchTimer-free.png")},null,8,Ct),Vt,t("img",{src:n.$withBase("/assets/knowledge/frontEnd/micro/qianKun/patchTimer-setInterval-log.png")},null,8,jt),Nt,Rt,Ht,Ot,t("img",{src:n.$withBase("/assets/knowledge/frontEnd/micro/qianKun/patchDynamicAppend-patch.png")},null,8,Ut),Gt,Ft,t("img",{src:n.$withBase("/assets/knowledge/frontEnd/micro/qianKun/patchDynamicAppend-style.png")},null,8,Wt),Jt,t("img",{src:n.$withBase("/assets/knowledge/frontEnd/micro/qianKun/patchDynamicAppend-dynamicStyleSheetElements.png")},null,8,Qt),Zt,t("img",{src:n.$withBase("/assets/knowledge/frontEnd/micro/qianKun/patchDynamicAppend-script.png")},null,8,zt),Yt,Xt,tn,nn,en,sn,on,t("img",{src:n.$withBase("/assets/knowledge/frontEnd/micro/qianKun/patchDynamicAppend-free.png")},null,8,ln),an,dn,rn,t("img",{src:n.$withBase("/assets/knowledge/frontEnd/micro/qianKun/mount.png")},null,8,cn),pn,t("img",{src:n.$withBase("/assets/knowledge/frontEnd/micro/qianKun/unmount.png")},null,8,un),gn,hn,mn,t("img",{src:n.$withBase("/assets/knowledge/frontEnd/micro/qianKun/sandboxLifeCycle.png")},null,8,_n),wn,yn,t("img",{src:n.$withBase("/assets/knowledge/frontEnd/micro/qianKun/lifeCycles.png")},null,8,fn),bn,xn,t("img",{src:n.$withBase("/assets/knowledge/frontEnd/micro/qianKun/registerMicroAppsLoading.png")},null,8,kn),vn,t("img",{src:n.$withBase("/assets/knowledge/frontEnd/micro/qianKun/getAddOn.png")},null,8,Sn),qn,En,Mn,t("img",{src:n.$withBase("/assets/knowledge/frontEnd/micro/qianKun/isInContainer.png")},null,8,Kn),Bn,$n,t("img",{src:n.$withBase("/assets/knowledge/frontEnd/micro/qianKun/beforeLoad.png")},null,8,Pn),An,Tn,t("img",{src:n.$withBase("/assets/knowledge/frontEnd/micro/qianKun/proxyLastOptions.png")},null,8,Ln),In,Dn,t("img",{src:n.$withBase("/assets/knowledge/frontEnd/micro/qianKun/beforeMountFlow.png")},null,8,Cn),Vn,jn,Nn,Rn,Hn,On,t("img",{src:n.$withBase("/assets/knowledge/frontEnd/micro/qianKun/mount1.png")},null,8,Un),Gn,Fn,Wn,t("img",{src:n.$withBase("/assets/knowledge/frontEnd/micro/qianKun/mountedApp.png")},null,8,Jn),Qn,t("img",{src:n.$withBase("/assets/knowledge/frontEnd/micro/qianKun/mount2.png")},null,8,Zn),zn,Yn,t("img",{src:n.$withBase("/assets/knowledge/frontEnd/micro/qianKun/lifeCycle-mount.png")},null,8,Xn),te,ne,t("img",{src:n.$withBase("/assets/knowledge/frontEnd/micro/qianKun/unmount1.png")},null,8,ee),se,t("img",{src:n.$withBase("/assets/knowledge/frontEnd/micro/qianKun/lifeCycle-unmount.png")},null,8,oe),le,ie,t("img",{src:n.$withBase("/assets/knowledge/frontEnd/micro/qianKun/lifeCycle-flow.png")},null,8,ae),de,t("img",{src:n.$withBase("/assets/knowledge/frontEnd/micro/qianKun/deleteProperty.png")},null,8,re),ce,pe,ue,ge,t("img",{src:n.$withBase("/assets/knowledge/frontEnd/micro/qianKun/lifeCycle-info.png")},null,8,he)])}const fe=o(d,[["render",me],["__file","index.html.vue"]]),be=JSON.parse('{"path":"/Interview/Framework/Micro/QianKun/","title":"乾坤","lang":"zh-CN","frontmatter":{"title":"乾坤","lang":"zh-CN","date":"2022-05-16T11:21:30.000Z","permalink":"/Interview/Framework/Micro/QianKun/","isOriginal":true,"sticky":true,"star":true,"category":["微前端"],"tag":["微前端"],"description":"微前端 是一种类似于微服务的架构，它将微服务的理念应用于浏览器端，即将单页面前端应用由单一的单体应用转变为多个小型前端应用聚合为一的应用。 各个前端应用还可以独立开发、独立部署。同时，它们也可以在共享组件的同时进行并行开发——这些组件可以通过 NPM 或者 Git Tag、Git Submodule 来管理。 qiankun（乾坤） 就是一款由蚂蚁金服...","head":[["meta",{"property":"og:url","content":"https://shaohui-jin.github.io/Interview/Framework/Micro/QianKun/"}],["meta",{"property":"og:title","content":"乾坤"}],["meta",{"property":"og:description","content":"微前端 是一种类似于微服务的架构，它将微服务的理念应用于浏览器端，即将单页面前端应用由单一的单体应用转变为多个小型前端应用聚合为一的应用。 各个前端应用还可以独立开发、独立部署。同时，它们也可以在共享组件的同时进行并行开发——这些组件可以通过 NPM 或者 Git Tag、Git Submodule 来管理。 qiankun（乾坤） 就是一款由蚂蚁金服..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2024-03-20T10:13:02.000Z"}],["meta",{"property":"article:author","content":"石怜安"}],["meta",{"property":"article:tag","content":"微前端"}],["meta",{"property":"article:published_time","content":"2022-05-16T11:21:30.000Z"}],["meta",{"property":"article:modified_time","content":"2024-03-20T10:13:02.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"乾坤\\",\\"image\\":[\\"\\"],\\"datePublished\\":\\"2022-05-16T11:21:30.000Z\\",\\"dateModified\\":\\"2024-03-20T10:13:02.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"石怜安\\",\\"url\\":\\"https://shaohui-jin.github.io\\"}]}"]]},"headers":[{"level":2,"title":"start(opts)","slug":"start-opts","link":"#start-opts","children":[]},{"level":2,"title":"registerMicroApps(apps, lifeCycles?)","slug":"registermicroapps-apps-lifecycles","link":"#registermicroapps-apps-lifecycles","children":[]},{"level":2,"title":"import-html-entry","slug":"import-html-entry","link":"#import-html-entry","children":[]},{"level":2,"title":"主应用挂载子应用 HTML 模板","slug":"主应用挂载子应用-html-模板","link":"#主应用挂载子应用-html-模板","children":[]},{"level":2,"title":"沙箱运行环境 - genSandbox","slug":"沙箱运行环境-gensandbox","link":"#沙箱运行环境-gensandbox","children":[{"level":3,"title":"LegacySandbox","slug":"legacysandbox","link":"#legacysandbox","children":[]},{"level":3,"title":"多实例沙箱 - ProxySandbox","slug":"多实例沙箱-proxysandbox","link":"#多实例沙箱-proxysandbox","children":[]},{"level":3,"title":"SnapshotSandbox","slug":"snapshotsandbox","link":"#snapshotsandbox","children":[]}]},{"level":2,"title":"挂载沙箱 - mountSandbox","slug":"挂载沙箱-mountsandbox","link":"#挂载沙箱-mountsandbox","children":[{"level":3,"title":"计时器劫持 - patchTimer","slug":"计时器劫持-patchtimer","link":"#计时器劫持-patchtimer","children":[]},{"level":3,"title":"动态添加样式表和脚本文件劫持 - patchDynamicAppend","slug":"动态添加样式表和脚本文件劫持-patchdynamicappend","link":"#动态添加样式表和脚本文件劫持-patchdynamicappend","children":[]}]},{"level":2,"title":"卸载沙箱 - unmountSandbox","slug":"卸载沙箱-unmountsandbox","link":"#卸载沙箱-unmountsandbox","children":[{"level":3,"title":"注册内部生命周期函数","slug":"注册内部生命周期函数","link":"#注册内部生命周期函数","children":[]},{"level":3,"title":"触发 beforeLoad 生命周期钩子函数","slug":"触发-beforeload-生命周期钩子函数","link":"#触发-beforeload-生命周期钩子函数","children":[]},{"level":3,"title":"进入到 mount 挂载流程","slug":"进入到-mount-挂载流程","link":"#进入到-mount-挂载流程","children":[]},{"level":3,"title":"进入到 unmount 卸载流程","slug":"进入到-unmount-卸载流程","link":"#进入到-unmount-卸载流程","children":[]}]},{"level":2,"title":"总结","slug":"总结","link":"#总结","children":[]},{"level":2,"title":"彩蛋","slug":"彩蛋","link":"#彩蛋","children":[]},{"level":2,"title":"展望","slug":"展望","link":"#展望","children":[]}],"git":{"createdTime":1710929582000,"updatedTime":1710929582000,"contributors":[{"name":"shaohui_jin","email":"1051131737@qq.com","commits":1}]},"readingTime":{"minutes":23.96,"words":7189},"filePathRelative":"zh/Interview/Micro/QianKun.md","localizedDate":"2022年5月16日","excerpt":"<p><strong>微前端</strong> 是一种类似于微服务的架构，它将微服务的理念应用于浏览器端，即将单页面前端应用由单一的单体应用转变为多个小型前端应用聚合为一的应用。</p>\\n<p>各个前端应用还可以独立开发、独立部署。同时，它们也可以在共享组件的同时进行并行开发——这些组件可以通过 NPM 或者 Git Tag、Git Submodule 来管理。</p>\\n<p><strong>qiankun（乾坤）</strong> 就是一款由蚂蚁金服推出的比较成熟的微前端框架，基于 <strong>single-spa</strong> 进行二次开发，用于将Web应用由单一的单体应用转变为多个小型前端应用聚合为一的应用。</p>\\n<p>那么，话不多说，我们的源码解析正式开始。</p>\\n","autoDesc":true}');export{fe as comp,be as data};
