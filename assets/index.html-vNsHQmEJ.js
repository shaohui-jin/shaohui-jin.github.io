import{_ as t}from"./plugin-vue_export-helper-DlAUqK2U.js";import{r as e,o as p,c as o,a as n,e as l,w as i,f as s,b as c}from"./app-DCbk2o9R.js";const r={},u=n("p",null,[s("typescript 和 javascript "),n("strong",null,"几乎一样"),s("，拥有相同的数据类型，另外在 javascript 基础上提供了 "),n("strong",null,"更加实用的类型"),s(" 供开发使用")],-1),d=n("p",null,[s("在开发阶段，可以为 明确的变量定义为 某种类型，这样 typescript 就能在编译阶段进行 "),n("strong",null,"类型检查"),s("，当类型不合符预期结果的时候则会出现错误提示")],-1),k=n("h2",{id:"typescript-的数据类型",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#typescript-的数据类型"},[n("span",null,"typescript 的数据类型")])],-1),m=n("li",null,"boolean（布尔类型）",-1),v=n("li",null,"number（数字类型）",-1),g=n("li",null,"string（字符串类型）",-1),b=n("li",null,"array（数组类型）",-1),h=n("li",null,"tuple（元组类型）",-1),y=n("li",null,"any（任意类型）",-1),f=n("li",null,"null 和 undefined 类型",-1),_=n("li",null,"void 类型",-1),w=n("li",null,"never 类型",-1),x=n("li",null,"object 对象类型",-1),T=c(`<h3 id="布尔类型-boolean" tabindex="-1"><a class="header-anchor" href="#布尔类型-boolean"><span>布尔类型 boolean</span></a></h3><div class="language-typescript line-numbers-mode" data-ext="ts" data-title="ts"><pre class="language-typescript"><code><span class="token keyword">let</span> flag<span class="token operator">:</span><span class="token builtin">boolean</span> <span class="token operator">=</span> <span class="token boolean">true</span><span class="token punctuation">;</span>
<span class="token comment">// flag = 123; // 错误</span>
flag <span class="token operator">=</span> <span class="token boolean">false</span><span class="token punctuation">;</span>  <span class="token comment">//正确</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="数字类型-number" tabindex="-1"><a class="header-anchor" href="#数字类型-number"><span>数字类型 number</span></a></h3><p>typescript 的 数值类型 都是 <strong>浮点数</strong>，可支持<strong>二进制</strong>、<strong>八进制</strong>、<strong>十进制</strong>和<strong>十六进制</strong></p><div class="language-typescript line-numbers-mode" data-ext="ts" data-title="ts"><pre class="language-typescript"><code><span class="token keyword">let</span> num<span class="token operator">:</span><span class="token builtin">number</span> <span class="token operator">=</span> <span class="token number">123</span><span class="token punctuation">;</span>
<span class="token comment">// num = &#39;456&#39;; // Type &#39;string&#39; is not assignable to type &#39;number&#39;.</span>
num <span class="token operator">=</span> <span class="token number">456</span><span class="token punctuation">;</span>  <span class="token comment">//正确</span>
<span class="token comment">// 进制表示：</span>
<span class="token keyword">let</span> decLiteral<span class="token operator">:</span> <span class="token builtin">number</span> <span class="token operator">=</span> <span class="token number">6</span><span class="token punctuation">;</span> <span class="token comment">// 十进制 6</span>
<span class="token keyword">let</span> hexLiteral<span class="token operator">:</span> <span class="token builtin">number</span> <span class="token operator">=</span> <span class="token number">0xf00d</span><span class="token punctuation">;</span> <span class="token comment">// 十六进制 61453</span>
<span class="token keyword">let</span> binaryLiteral<span class="token operator">:</span> <span class="token builtin">number</span> <span class="token operator">=</span> <span class="token number">0b1010</span><span class="token punctuation">;</span> <span class="token comment">// 二进制 10</span>
<span class="token keyword">let</span> octalLiteral<span class="token operator">:</span> <span class="token builtin">number</span> <span class="token operator">=</span> <span class="token number">0o744</span><span class="token punctuation">;</span> <span class="token comment">// 八进制 484</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="字符串类型-string" tabindex="-1"><a class="header-anchor" href="#字符串类型-string"><span>字符串类型 string</span></a></h3><p>可以使用 <strong>双引号</strong> 或 <strong>单引号</strong> 表示字符串</p><div class="language-typescript line-numbers-mode" data-ext="ts" data-title="ts"><pre class="language-typescript"><code><span class="token keyword">let</span> str<span class="token operator">:</span> <span class="token builtin">string</span> <span class="token operator">=</span> <span class="token string">&#39;this is ts&#39;</span><span class="token punctuation">;</span>
str <span class="token operator">=</span> <span class="token string">&#39;test&#39;</span><span class="token punctuation">;</span>
<span class="token keyword">let</span> name<span class="token operator">:</span> <span class="token builtin">string</span> <span class="token operator">=</span> <span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">Gene</span><span class="token template-punctuation string">\`</span></span><span class="token punctuation">;</span> <span class="token comment">// 注意编辑器存在部分bug，name会报错，跟window的name冲突</span>
<span class="token keyword">let</span> age<span class="token operator">:</span> <span class="token builtin">number</span> <span class="token operator">=</span> <span class="token number">37</span><span class="token punctuation">;</span>
<span class="token keyword">let</span> sentence<span class="token operator">:</span> <span class="token builtin">string</span> <span class="token operator">=</span> <span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">Hello, my name is </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span> name <span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">\`</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="数组类型-array" tabindex="-1"><a class="header-anchor" href="#数组类型-array"><span>数组类型 array</span></a></h3><p>通过 <strong>[]</strong> 进行包裹，有两种写法</p><div class="language-typescript line-numbers-mode" data-ext="ts" data-title="ts"><pre class="language-typescript"><code><span class="token comment">// 方式一：元素类型后面接上 []</span>
<span class="token keyword">let</span> arr1<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token string">&#39;12&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;23&#39;</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
arr1 <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token string">&#39;45&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;56&#39;</span><span class="token punctuation">]</span><span class="token punctuation">;</span>

<span class="token comment">// 方式二：使用数组泛型，Array&lt;元素类型&gt;  </span>
<span class="token keyword">let</span> arr2<span class="token operator">:</span> <span class="token builtin">Array</span><span class="token operator">&lt;</span><span class="token builtin">number</span><span class="token operator">&gt;</span> <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">2</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
arr2 <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token number">45</span><span class="token punctuation">,</span> <span class="token number">56</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="元祖类型-tuple" tabindex="-1"><a class="header-anchor" href="#元祖类型-tuple"><span>元祖类型 tuple</span></a></h3><p>表示一个 <strong>已知元素数量</strong> 和 <strong>类型</strong> 的数组，各元素的 <strong>类型可以不相同</strong></p><p>赋值的 <strong>类型</strong>、<strong>位置</strong>、<strong>个数需要</strong>和定义（声明）的一致</p><div class="language-typescript line-numbers-mode" data-ext="ts" data-title="ts"><pre class="language-typescript"><code><span class="token keyword">let</span> tupleArr<span class="token operator">:</span> <span class="token punctuation">[</span><span class="token builtin">number</span><span class="token punctuation">,</span> <span class="token builtin">string</span><span class="token punctuation">,</span> <span class="token builtin">boolean</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
tupleArr <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token number">12</span><span class="token punctuation">,</span> <span class="token string">&#39;34&#39;</span><span class="token punctuation">,</span> <span class="token boolean">true</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
typleArr <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token number">12</span><span class="token punctuation">,</span> <span class="token string">&#39;34&#39;</span><span class="token punctuation">]</span> <span class="token comment">// Cannot find name &#39;typleArr&#39;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="枚举类型-enum" tabindex="-1"><a class="header-anchor" href="#枚举类型-enum"><span>枚举类型 enum</span></a></h3><p>enum 类型是对 JavaScript 标准数据类型的一个补充</p><div class="language-typescript line-numbers-mode" data-ext="ts" data-title="ts"><pre class="language-typescript"><code><span class="token keyword">enum</span> Color <span class="token punctuation">{</span>Red<span class="token punctuation">,</span> Green<span class="token punctuation">,</span> Blue<span class="token punctuation">}</span>
<span class="token keyword">let</span> c<span class="token operator">:</span> Color <span class="token operator">=</span> Color<span class="token punctuation">.</span>Green<span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="任何类型-any" tabindex="-1"><a class="header-anchor" href="#任何类型-any"><span>任何类型 any</span></a></h3><p>可以指定任何类型的值，在 <strong>编程阶段</strong> 还不清楚类型的变量指定一个类型，不希望 <strong>类型检查器</strong> 对这些值进行检查，而是直接让它们通过编译阶段的检查</p><p>使用 any 类型允许被赋值为 <strong>任意类型</strong>，甚至可以调用其 <strong>属性</strong>、<strong>方法</strong></p><div class="language-typescript line-numbers-mode" data-ext="ts" data-title="ts"><pre class="language-typescript"><code><span class="token keyword">let</span> num<span class="token operator">:</span> <span class="token builtin">any</span> <span class="token operator">=</span> <span class="token number">123</span><span class="token punctuation">;</span>
num <span class="token operator">=</span> <span class="token string">&#39;str&#39;</span><span class="token punctuation">;</span>
num <span class="token operator">=</span> <span class="token boolean">true</span><span class="token punctuation">;</span>
<span class="token comment">// 定义存储各种类型数据的数组时，示例代码如下：</span>
<span class="token keyword">let</span> arrayList<span class="token operator">:</span> <span class="token builtin">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">,</span> <span class="token boolean">false</span><span class="token punctuation">,</span> <span class="token string">&#39;fine&#39;</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
arrayList<span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token number">100</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="null-和-和-undefined" tabindex="-1"><a class="header-anchor" href="#null-和-和-undefined"><span>null 和 和 undefined</span></a></h3><p>在 JavaScript 中 null表示 &quot;<strong>什么都没有</strong>&quot;，是一个只有一个值的特殊类型，表示一个<strong>空对象引用</strong>，而 undefined 表示一个 <strong>没有设置值</strong> 的 <strong>变量</strong></p><p>默认情况下 <strong>null</strong> 和 <strong>undefined</strong> 是所有类型的 <strong>子类型</strong>，<code>就是说你可以把 null和 undefined 赋值给 number 类型的变量</code></p><div class="language-typescript line-numbers-mode" data-ext="ts" data-title="ts"><pre class="language-typescript"><code><span class="token keyword">let</span> num<span class="token operator">:</span> <span class="token builtin">number</span> <span class="token operator">|</span> <span class="token keyword">undefined</span><span class="token punctuation">;</span> <span class="token comment">// 数值类型 或者 undefined</span>
<span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>num<span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// undefined</span>
num <span class="token operator">=</span> <span class="token number">123</span><span class="token punctuation">;</span>
<span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>num<span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// 123</span>
num <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
<span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>num<span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// null</span>
num <span class="token operator">=</span> <span class="token keyword">undefined</span><span class="token punctuation">;</span>
<span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>num<span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// undefined</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>但是 ts 配置了 <strong>--strictNullChecks</strong> 标记，null 和 undefined 只能赋值给 <strong>void</strong> 和 <strong>它们各自</strong></p><h3 id="无返回值类型-void" tabindex="-1"><a class="header-anchor" href="#无返回值类型-void"><span>无返回值类型 void</span></a></h3><p>用于标识方法返回值的类型，表示该方法没有返回值</p><div class="language-typescript line-numbers-mode" data-ext="ts" data-title="ts"><pre class="language-typescript"><code><span class="token keyword">function</span> <span class="token function">hello</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token keyword">void</span> <span class="token punctuation">{</span>
  <span class="token function">alert</span><span class="token punctuation">(</span><span class="token string">&quot;Hello Ts&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="不会出现类型-never" tabindex="-1"><a class="header-anchor" href="#不会出现类型-never"><span>不会出现类型 never</span></a></h3><p>never是其他类型（包括null和 undefined）的子类型，可以赋值给任何类型，代表 <strong>从不会出现的值</strong></p><p>但是没有类型是 never 的子类型，这意味着声明 never 的变量只能被 never 类型所赋值</p><p>never 类型一般用来指定 <strong>抛出异常</strong>、<strong>无限循环</strong></p><div class="language-typescript line-numbers-mode" data-ext="ts" data-title="ts"><pre class="language-typescript"><code><span class="token keyword">let</span> a<span class="token operator">:</span> <span class="token builtin">never</span><span class="token punctuation">;</span>
a <span class="token operator">=</span> <span class="token number">123</span><span class="token punctuation">;</span> <span class="token comment">// Type &#39;number&#39; is not assignable to type &#39;never&#39;.</span>

a <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span> <span class="token comment">// 正确的写法</span>
  <span class="token keyword">throw</span> <span class="token keyword">new</span> <span class="token class-name">Error</span><span class="token punctuation">(</span><span class="token string">&#39;错误&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">(</span><span class="token punctuation">)</span>

<span class="token comment">// 返回never的函数必须存在无法达到的终点</span>
<span class="token keyword">function</span> <span class="token function">error</span><span class="token punctuation">(</span>message<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">never</span> <span class="token punctuation">{</span>
  <span class="token keyword">throw</span> <span class="token keyword">new</span> <span class="token class-name">Error</span><span class="token punctuation">(</span>message<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="对象类型-object" tabindex="-1"><a class="header-anchor" href="#对象类型-object"><span>对象类型 object</span></a></h3><div class="language-typescript line-numbers-mode" data-ext="ts" data-title="ts"><pre class="language-typescript"><code><span class="token keyword">let</span> obj<span class="token operator">:</span> object<span class="token punctuation">;</span>
obj <span class="token operator">=</span> <span class="token punctuation">{</span> name<span class="token operator">:</span> <span class="token string">&#39;ShiLianAn&#39;</span><span class="token punctuation">,</span> age<span class="token operator">:</span> <span class="token number">27</span> <span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="总而言之" tabindex="-1"><a class="header-anchor" href="#总而言之"><span>总而言之</span></a></h3><p>和 javascript 基本一致，也分成：</p><ul><li>基本类型</li><li>引用类型</li></ul><p>在基础类型上，typescript 增添了 <strong>void</strong>、<strong>any</strong>、<strong>emum</strong> 等原始类型</p>`,41);function j(S,C){const a=e("RouteLink");return p(),o("div",null,[u,d,k,n("ul",null,[m,v,g,b,h,n("li",null,[l(a,{to:"/TypeScript/Enum/"},{default:i(()=>[s("enum（枚举类型）")]),_:1})]),y,f,_,w,x]),T])}const A=t(r,[["render",j],["__file","index.html.vue"]]),q=JSON.parse('{"path":"/TypeScript/DataType/","title":"说说TypeScript中的数据类型","lang":"zh-CN","frontmatter":{"title":"说说TypeScript中的数据类型","lang":"zh-CN","date":"2024-04-17T16:22:21.000Z","permalink":"/TypeScript/DataType/","category":["TypeScript"],"tag":["TypeScript"],"description":"typescript 和 javascript 几乎一样，拥有相同的数据类型，另外在 javascript 基础上提供了 更加实用的类型 供开发使用 在开发阶段，可以为 明确的变量定义为 某种类型，这样 typescript 就能在编译阶段进行 类型检查，当类型不合符预期结果的时候则会出现错误提示 typescript 的数据类型 boolean（布尔...","head":[["meta",{"property":"og:url","content":"https://shaohui-jin.github.io/TypeScript/DataType/"}],["meta",{"property":"og:title","content":"说说TypeScript中的数据类型"}],["meta",{"property":"og:description","content":"typescript 和 javascript 几乎一样，拥有相同的数据类型，另外在 javascript 基础上提供了 更加实用的类型 供开发使用 在开发阶段，可以为 明确的变量定义为 某种类型，这样 typescript 就能在编译阶段进行 类型检查，当类型不合符预期结果的时候则会出现错误提示 typescript 的数据类型 boolean（布尔..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2024-04-17T10:02:49.000Z"}],["meta",{"property":"article:author","content":"石怜安"}],["meta",{"property":"article:tag","content":"TypeScript"}],["meta",{"property":"article:published_time","content":"2024-04-17T16:22:21.000Z"}],["meta",{"property":"article:modified_time","content":"2024-04-17T10:02:49.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"说说TypeScript中的数据类型\\",\\"image\\":[\\"\\"],\\"datePublished\\":\\"2024-04-17T16:22:21.000Z\\",\\"dateModified\\":\\"2024-04-17T10:02:49.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"石怜安\\",\\"url\\":\\"https://shaohui-jin.github.io\\"}]}"]]},"headers":[{"level":2,"title":"typescript 的数据类型","slug":"typescript-的数据类型","link":"#typescript-的数据类型","children":[{"level":3,"title":"布尔类型 boolean","slug":"布尔类型-boolean","link":"#布尔类型-boolean","children":[]},{"level":3,"title":"数字类型 number","slug":"数字类型-number","link":"#数字类型-number","children":[]},{"level":3,"title":"字符串类型 string","slug":"字符串类型-string","link":"#字符串类型-string","children":[]},{"level":3,"title":"数组类型 array","slug":"数组类型-array","link":"#数组类型-array","children":[]},{"level":3,"title":"元祖类型 tuple","slug":"元祖类型-tuple","link":"#元祖类型-tuple","children":[]},{"level":3,"title":"枚举类型 enum","slug":"枚举类型-enum","link":"#枚举类型-enum","children":[]},{"level":3,"title":"任何类型 any","slug":"任何类型-any","link":"#任何类型-any","children":[]},{"level":3,"title":"null 和 和 undefined","slug":"null-和-和-undefined","link":"#null-和-和-undefined","children":[]},{"level":3,"title":"无返回值类型 void","slug":"无返回值类型-void","link":"#无返回值类型-void","children":[]},{"level":3,"title":"不会出现类型 never","slug":"不会出现类型-never","link":"#不会出现类型-never","children":[]},{"level":3,"title":"对象类型 object","slug":"对象类型-object","link":"#对象类型-object","children":[]},{"level":3,"title":"总而言之","slug":"总而言之","link":"#总而言之","children":[]}]}],"git":{"createdTime":1713348169000,"updatedTime":1713348169000,"contributors":[{"name":"shaohui_jin","email":"1051131737@qq.com","commits":1}]},"readingTime":{"minutes":3.46,"words":1038},"filePathRelative":"zh/TypeScript/说说TypeScript中的数据类型.md","localizedDate":"2024年4月17日","excerpt":"<p>typescript 和 javascript <strong>几乎一样</strong>，拥有相同的数据类型，另外在 javascript 基础上提供了 <strong>更加实用的类型</strong> 供开发使用</p>\\n<p>在开发阶段，可以为 明确的变量定义为 某种类型，这样 typescript 就能在编译阶段进行 <strong>类型检查</strong>，当类型不合符预期结果的时候则会出现错误提示</p>\\n<h2>typescript 的数据类型</h2>\\n<ul>\\n<li>boolean（布尔类型）</li>\\n<li>number（数字类型）</li>\\n<li>string（字符串类型）</li>\\n<li>array（数组类型）</li>\\n<li>tuple（元组类型）</li>\\n<li><a href=\\"/TypeScript/Enum/\\" target=\\"_blank\\">enum（枚举类型）</a></li>\\n<li>any（任意类型）</li>\\n<li>null 和 undefined 类型</li>\\n<li>void 类型</li>\\n<li>never 类型</li>\\n<li>object 对象类型</li>\\n</ul>","autoDesc":true}');export{A as comp,q as data};