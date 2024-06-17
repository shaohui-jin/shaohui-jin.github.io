import{_ as t}from"./plugin-vue_export-helper-DlAUqK2U.js";import{o as e,c as o,d as p,b as a,a as n,f as s}from"./app-DGyjAF8E.js";const c={},i=a('<h2 id="同源策略的概念和具体限制" tabindex="-1"><a class="header-anchor" href="#同源策略的概念和具体限制"><span>同源策略的概念和具体限制</span></a></h2><p>同源策略：限制 <strong>从一个源加载的文档或脚本</strong> 如何与 <strong>来自另一个源的资源</strong> 进行交互。这是一个用于隔离潜在恶意文件的关键的安全机制。（来自MDN官方的解释）</p><p>具体解释：</p><ul><li><code>源</code>包括三个部分：协议、域名、端口。如果有任何一个部分不同，则<code>源</code>不同，那就是跨域了。</li><li><code>限制</code>：这个源的文档没有权利去操作另一个源的文档。这个限制体现在： <ul><li><code>Cookie</code>、<code>LocalStorage</code>和<code>IndexDB</code>无法获取。</li><li>无法获取和操作<code>DOM</code>。</li><li>不能发送<code>Ajax</code>请求。我们要注意，<code>Ajax</code>只适合<code>同源</code>的通信。</li></ul></li></ul><figure><img src="https://shaohui-jin.github.io/picx-images-hosting/blog/Network/跨域之同源策略.b8qxop4qm.webp" alt="" height="600" tabindex="0" loading="lazy"><figcaption>跨域之同源策略</figcaption></figure>',5),l=a('<h2 id="前后端如何通信" tabindex="-1"><a class="header-anchor" href="#前后端如何通信"><span>前后端如何通信</span></a></h2><p>主要有以下几种方式：</p><ul><li><code>Ajax</code>：不支持跨域。</li><li><code>WebSocket</code>：不受同源策略的限制，支持跨域</li><li><code>CORS</code>：不受同源策略的限制，支持跨域。一种新的通信协议标准。可以理解成是：<code>同时支持同源和跨域的Ajax</code>。</li></ul><h2 id="跨域的解决方式" tabindex="-1"><a class="header-anchor" href="#跨域的解决方式"><span>跨域的解决方式</span></a></h2><ol><li>CORS</li><li>nginx</li></ol><h3 id="cors-跨源资源共享" tabindex="-1"><a class="header-anchor" href="#cors-跨源资源共享"><span>CORS 跨源资源共享</span></a></h3><p>浏览器必须首先使用 OPTIONS 方法发起一个预检请求，从而获知服务端是否允许该跨源请求。</p><p>服务器确认允许之后，才发起实际的 HTTP 请求。在预检请求的返回中，服务器端也可以通知客户端，是否需要携带身份凭证 COOKIE</p><ol><li>当浏览器发出跨域请求时，浏览器会添加一个带有当前 <strong>源(方案、主机和端口)</strong> 的 <strong>Origin</strong> 标头。</li><li>在服务器端，当服务器看到此标头并希望允许访问时，它需要在响应中添加一个 <strong>Access-Control-Allow-Origin</strong> 标头，指定请求来源(或 * 以允许任何来源)</li><li>当浏览器看到带有适当 <strong>Access-Control-Allow-Origin</strong> 标头的响应时，浏览器允许与客户端站点共享响应数据。</li></ol>',9),u=n("div",{class:"language-java line-numbers-mode","data-ext":"java","data-title":"java"},[n("pre",{java:"",class:"language-java"},[n("code",null,[n("span",{class:"token annotation punctuation"},"@Override"),s(`
`),n("span",{class:"token keyword"},"public"),s(),n("span",{class:"token keyword"},"void"),s(),n("span",{class:"token function"},"doFilter"),n("span",{class:"token punctuation"},"("),n("span",{class:"token class-name"},"ServletRequest"),s(" request"),n("span",{class:"token punctuation"},","),s(),n("span",{class:"token class-name"},"ServletResponse"),s(" response"),n("span",{class:"token punctuation"},","),s(),n("span",{class:"token class-name"},"FilterChain"),s(" chain"),n("span",{class:"token punctuation"},")"),s(`
  `),n("span",{class:"token keyword"},"throws"),s(),n("span",{class:"token class-name"},"IOException"),n("span",{class:"token punctuation"},","),s(),n("span",{class:"token class-name"},"ServletException"),s(),n("span",{class:"token punctuation"},"{"),s(`
  
  `),n("span",{class:"token class-name"},"HttpServletResponse"),s(" res "),n("span",{class:"token operator"},"="),s(),n("span",{class:"token punctuation"},"("),n("span",{class:"token class-name"},"HttpServletResponse"),n("span",{class:"token punctuation"},")"),s(" response"),n("span",{class:"token punctuation"},";"),s(`

  `),n("span",{class:"token comment"},"// 允许跨域的域名，设置 * 表示允许除带 Cookies 信息的所有域名"),s(`
  res`),n("span",{class:"token punctuation"},"."),n("span",{class:"token function"},"addHeader"),n("span",{class:"token punctuation"},"("),n("span",{class:"token string"},'"Access-Control-Allow-Origin"'),n("span",{class:"token punctuation"},","),s(),n("span",{class:"token string"},'"http://localhost:9527"'),n("span",{class:"token punctuation"},")"),n("span",{class:"token punctuation"},";"),s(` 
  `),n("span",{class:"token comment"},"// 携带Cookie的请求需开启配置，同时 Access-Control-Allow-Origin 一定为精准匹配"),s(`
  res`),n("span",{class:"token punctuation"},"."),n("span",{class:"token function"},"addHeader"),n("span",{class:"token punctuation"},"("),n("span",{class:"token string"},'"Access-Control-Allow-Credentials"'),n("span",{class:"token punctuation"},","),s(),n("span",{class:"token boolean"},"true"),n("span",{class:"token punctuation"},")"),n("span",{class:"token punctuation"},";"),s(` 
  `),n("span",{class:"token comment"},"// 允许跨域的方法，可设置*表示所有。GET/POST/OPTIONS等"),s(`
  res`),n("span",{class:"token punctuation"},"."),n("span",{class:"token function"},"addHeader"),n("span",{class:"token punctuation"},"("),n("span",{class:"token string"},'"Access-Control-Allow-Methods"'),n("span",{class:"token punctuation"},","),s(),n("span",{class:"token string"},'"GET"'),n("span",{class:"token punctuation"},")"),n("span",{class:"token punctuation"},";"),s(` 
  `),n("span",{class:"token comment"},"// 假如给post请求头设置了contentType字段，则需要添加以下信息"),s(`
  res`),n("span",{class:"token punctuation"},"."),n("span",{class:"token function"},"addHeader"),n("span",{class:"token punctuation"},"("),n("span",{class:"token string"},'"Access-Control-Allow-Headers"'),n("span",{class:"token punctuation"},","),s(),n("span",{class:"token string"},'"Content-Type"'),n("span",{class:"token punctuation"},")"),n("span",{class:"token punctuation"},";"),s(`
  `),n("span",{class:"token comment"},'// 设置预检命令的缓存时效。单位是"秒"'),s(`
  `),n("span",{class:"token comment"},"// 如果没有失效，则不会再次发起OPTION预检请求"),s(`
  res`),n("span",{class:"token punctuation"},"."),n("span",{class:"token function"},"addHeader"),n("span",{class:"token punctuation"},"("),n("span",{class:"token string"},'"Access-Control-Max-Age"'),n("span",{class:"token punctuation"},","),s(),n("span",{class:"token string"},'"3600"'),n("span",{class:"token punctuation"},")"),n("span",{class:"token punctuation"},";"),s(`
  `),n("span",{class:"token comment"},"// 还可以有其他配置..."),s(`
  chain`),n("span",{class:"token punctuation"},"."),n("span",{class:"token function"},"doFilter"),n("span",{class:"token punctuation"},"("),s("request"),n("span",{class:"token punctuation"},","),s(" response"),n("span",{class:"token punctuation"},")"),n("span",{class:"token punctuation"},";"),s(),n("span",{class:"token comment"},"//让过滤器放行该请求"),s(`
`),n("span",{class:"token punctuation"},"}"),s(`
`)])]),n("div",{class:"highlight-lines"},[n("br"),n("br"),n("br"),n("br"),n("br"),n("br"),n("div",{class:"highlight-line"}," "),n("div",{class:"highlight-line"}," "),n("div",{class:"highlight-line"}," "),n("div",{class:"highlight-line"}," "),n("div",{class:"highlight-line"}," "),n("div",{class:"highlight-line"}," "),n("div",{class:"highlight-line"}," "),n("div",{class:"highlight-line"}," "),n("div",{class:"highlight-line"}," "),n("div",{class:"highlight-line"}," "),n("div",{class:"highlight-line"}," "),n("br"),n("br"),n("br")]),n("div",{class:"line-numbers","aria-hidden":"true"},[n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"})])],-1),r=a(`<h3 id="nginx" tabindex="-1"><a class="header-anchor" href="#nginx"><span>nginx</span></a></h3><blockquote><p><strong>正向代理：</strong> 利用代理客户端去请求服务器，从而隐藏了真实的客户端，服务器并不知道客户端是谁。如：vpn、devServerProxy</p><p><strong>反向代理:</strong> 反向代理隐藏了真正的服务端。软件层面上常用 Ngnix 来做反向代理服务器，性能很好，用来做负载均衡</p></blockquote><p>为了实现反向代理，需要在 Ngnix 中配置一个代理域名，或者称为一个网址 demo.com，就像百度成千上万的服务器使用用一个代理网址 www.baidu.com 一样</p><div class="language-nginx line-numbers-mode" data-ext="nginx" data-title="nginx"><pre class="language-nginx"><code><span class="token directive"><span class="token keyword">server</span></span> <span class="token punctuation">{</span>
  <span class="token directive"><span class="token keyword">listen</span> <span class="token number">80</span></span><span class="token punctuation">;</span>
  <span class="token directive"><span class="token keyword">server_name:</span> demo.com</span><span class="token punctuation">;</span> <span class="token comment"># 请求域名是demo.com，端口是80的，都会被nginx做代理</span>
  <span class="token comment"># http://demo.com/api/test 就会跳转到http://localhost:8080/test/</span>
  <span class="token directive"><span class="token keyword">location</span> /api</span> <span class="token punctuation">{</span>
    <span class="token directive"><span class="token keyword">proxy_pass</span> http://localhost:8080/test/</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token comment"># http://demo.com/test 就会跳转到http://localhost:8080/</span>
  <span class="token directive"><span class="token keyword">location</span> /</span> <span class="token punctuation">{</span>
    <span class="token directive"><span class="token keyword">proxy_pass</span> http://localhost:8080</span><span class="token punctuation">;</span> 
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="跨域通信的几种方式" tabindex="-1"><a class="header-anchor" href="#跨域通信的几种方式"><span>跨域通信的几种方式</span></a></h2><ol><li>JSONP</li><li>WebSocket</li><li>Hash</li><li>postMessage</li></ol><h3 id="jsonp" tabindex="-1"><a class="header-anchor" href="#jsonp"><span>JSONP</span></a></h3><p>在 <code>CORS</code> 和 <code>postMessage</code> 以前，一直都是通过 <code>JSONP</code> 来做跨域通信的。</p><blockquote><p>通过<code>&lt;script&gt;标签</code>的异步加载来实现的。比如说，实际开发中，head标签里，可以通过<code>&lt;script url=&quot;xxx&quot;&gt;</code>加载很多在线的插件。这就是用到了JSONP。</p></blockquote><p>比如，客户端这样写：</p><div class="language-html line-numbers-mode" data-ext="html" data-title="html"><pre class="language-html"><code> <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span> <span class="token attr-name">src</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>https://shaohui-jin.github.io/?data=name&amp;callback=jsonp_xxxx<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span><span class="token script"></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">&gt;</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>于是，本地要求创建一个 jsonp_xxxx 的全局函数，才能将返回的数据执行出来。</p><div class="language-javascript line-numbers-mode" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="token keyword">function</span> <span class="token function">jsonp</span><span class="token punctuation">(</span><span class="token parameter">url<span class="token punctuation">,</span> params<span class="token punctuation">,</span> callback</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// 接收接口所需的所有参数及callback的函数名</span>
  <span class="token keyword">let</span> paramList <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>
  <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">let</span> key <span class="token keyword">in</span> params<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    paramList<span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>key<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">=</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>params<span class="token punctuation">[</span>key<span class="token punctuation">]</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">\`</span></span><span class="token punctuation">)</span>
  <span class="token punctuation">}</span>
  <span class="token comment">// 随机callback函数名称</span>
  <span class="token keyword">let</span> random <span class="token operator">=</span> Math<span class="token punctuation">.</span><span class="token function">random</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">toString</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">replace</span><span class="token punctuation">(</span><span class="token string">&#39;.&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;&#39;</span><span class="token punctuation">)</span>
  <span class="token keyword">const</span> callbackName <span class="token operator">=</span> <span class="token string">&#39;jsonp_&#39;</span> <span class="token operator">+</span> random
  paramList<span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">callback=</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>callbackName<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">\`</span></span><span class="token punctuation">)</span>
  <span class="token keyword">const</span> urlStr <span class="token operator">=</span> url <span class="token operator">+</span> <span class="token string">&#39;?&#39;</span> <span class="token operator">+</span> paramList<span class="token punctuation">.</span><span class="token function">join</span><span class="token punctuation">(</span><span class="token string">&#39;&amp;&#39;</span><span class="token punctuation">)</span>
  window<span class="token punctuation">[</span>callbackName<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">param</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>      <span class="token comment">//根据回调名称注册一个全局的函数</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>callback <span class="token operator">&amp;&amp;</span> <span class="token keyword">typeof</span> callback <span class="token operator">===</span> <span class="token string">&#39;function&#39;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token function">callback</span><span class="token punctuation">(</span>param<span class="token punctuation">)</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span><span class="token punctuation">;</span>
  <span class="token comment">// 生成element</span>
  <span class="token keyword">const</span> script <span class="token operator">=</span> document<span class="token punctuation">.</span><span class="token function">createElement</span><span class="token punctuation">(</span><span class="token string">&#39;script&#39;</span><span class="token punctuation">)</span>
  script<span class="token punctuation">.</span>src <span class="token operator">=</span> urlStr
  <span class="token comment">// 放入body, 立即调用全局函数 callbackName</span>
  document<span class="token punctuation">.</span>body<span class="token punctuation">.</span><span class="token function">appendChild</span><span class="token punctuation">(</span>script<span class="token punctuation">)</span>
  <span class="token comment">// js拿到后，移除文件</span>
  document<span class="token punctuation">.</span>body<span class="token punctuation">.</span><span class="token function">removeChild</span><span class="token punctuation">(</span>script<span class="token punctuation">)</span>
  <span class="token comment">// 删除函数或变量</span>
  window<span class="token punctuation">[</span>callbackName<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>  <span class="token comment">//最后不要忘了删除</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="websocket" tabindex="-1"><a class="header-anchor" href="#websocket"><span>WebSocket</span></a></h3><div class="language-javascript line-numbers-mode" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="token keyword">let</span> ws <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">WebSocket</span><span class="token punctuation">(</span><span class="token string">&#39;wss://shaohui-jin.github.io&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">//创建WebSocket的对象。参数可以是 ws 或 wss，后者表示加密。</span>

<span class="token comment">//把请求发出去</span>
ws<span class="token punctuation">.</span><span class="token function-variable function">onopen</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">evt</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&#39;Connection open ...&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  ws<span class="token punctuation">.</span><span class="token function">send</span><span class="token punctuation">(</span><span class="token string">&#39;Hello WebSockets!&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>

<span class="token comment">//对方发消息过来时，我接收</span>
ws<span class="token punctuation">.</span><span class="token function-variable function">onmessage</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">evt</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&#39;Received Message: &#39;</span><span class="token punctuation">,</span> evt<span class="token punctuation">.</span>data<span class="token punctuation">)</span><span class="token punctuation">;</span>
  ws<span class="token punctuation">.</span><span class="token function">close</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>

<span class="token comment">//关闭连接</span>
ws<span class="token punctuation">.</span><span class="token function-variable function">onclose</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">evt</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&#39;Connection closed.&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="hash" tabindex="-1"><a class="header-anchor" href="#hash"><span>Hash</span></a></h3><p>url的 <code>#</code> 后面的内容就叫 <strong>Hash</strong>。 <strong>Hash</strong> 的改变，页面不会刷新。这就是用 <strong>Hash</strong> 做跨域通信的基本原理。</p><p>url的 <code>?</code> 后面的内容叫 <strong>Search</strong>。<strong>Search</strong> 的改变，会导致页面刷新，因此不能做跨域通信。</p>`,18),d=n("div",{class:"language-javascript line-numbers-mode","data-ext":"js","data-title":"js"},[n("pre",{js:"",class:"language-javascript"},[n("code",null,[n("span",{class:"token comment"},"//伪代码"),s(`
`),n("span",{class:"token keyword"},"let"),s(),n("span",{class:"token constant"},"B"),s(),n("span",{class:"token operator"},"="),s(" document"),n("span",{class:"token punctuation"},"."),n("span",{class:"token function"},"getElementsByTagName"),n("span",{class:"token punctuation"},"("),n("span",{class:"token string"},"'iframe'"),n("span",{class:"token punctuation"},")"),n("span",{class:"token punctuation"},";"),s(`
`),n("span",{class:"token constant"},"B"),n("span",{class:"token punctuation"},"."),s("src "),n("span",{class:"token operator"},"="),s(),n("span",{class:"token constant"},"B"),n("span",{class:"token punctuation"},"."),s("src "),n("span",{class:"token operator"},"+"),s(),n("span",{class:"token string"},"'#'"),s(),n("span",{class:"token operator"},"+"),s(),n("span",{class:"token string"},"'jsonString'"),n("span",{class:"token punctuation"},";"),s("  "),n("span",{class:"token comment"},"// 可以把JS 对象，通过 JSON.stringify()方法转成 json字符串，发给 B"),s(`

`),n("span",{class:"token comment"},"// B中的伪代码"),s(`
window`),n("span",{class:"token punctuation"},"."),n("span",{class:"token function-variable function"},"onhashchange"),s(),n("span",{class:"token operator"},"="),s(),n("span",{class:"token keyword"},"function"),s(),n("span",{class:"token punctuation"},"("),n("span",{class:"token punctuation"},")"),s(),n("span",{class:"token punctuation"},"{"),s("  "),n("span",{class:"token comment"},"//通过onhashchange方法监听，url中的 hash 是否发生变化"),s(`
  `),n("span",{class:"token keyword"},"let"),s(" data "),n("span",{class:"token operator"},"="),s(" window"),n("span",{class:"token punctuation"},"."),s("location"),n("span",{class:"token punctuation"},"."),s("hash"),n("span",{class:"token punctuation"},";"),s(`
`),n("span",{class:"token punctuation"},"}"),s(`
`)])]),n("div",{class:"highlight-lines"},[n("br"),n("br"),n("div",{class:"highlight-line"}," "),n("br"),n("br"),n("div",{class:"highlight-line"}," "),n("div",{class:"highlight-line"}," "),n("div",{class:"highlight-line"}," ")]),n("div",{class:"line-numbers","aria-hidden":"true"},[n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"})])],-1),k=a(`<h3 id="postmessage" tabindex="-1"><a class="header-anchor" href="#postmessage"><span>postMessage</span></a></h3><div class="language-javascript line-numbers-mode" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="token comment">// 窗口A(http:A.com)向跨域的窗口B(http:B.com)发送信息</span>
Awindow<span class="token punctuation">.</span><span class="token function">postMessage</span><span class="token punctuation">(</span><span class="token string">&#39;data&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;http://B.com&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">//这里强调的是B窗口里的window对象</span>

<span class="token comment">// 在窗口B中监听 message 事件</span>
Bwindow<span class="token punctuation">.</span><span class="token function">addEventListener</span><span class="token punctuation">(</span><span class="token string">&#39;message&#39;</span><span class="token punctuation">,</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">event</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>   <span class="token comment">//这里强调的是A窗口里的window对象</span>
  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>event<span class="token punctuation">.</span>origin<span class="token punctuation">)</span><span class="token punctuation">;</span>  <span class="token comment">//获取 ：url。这里指：http://A.com</span>
  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>event<span class="token punctuation">.</span>source<span class="token punctuation">)</span><span class="token punctuation">;</span>  <span class="token comment">//获取：A window对象</span>
  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>event<span class="token punctuation">.</span>data<span class="token punctuation">)</span><span class="token punctuation">;</span>    <span class="token comment">//获取传过来的数据</span>
<span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token boolean">false</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,2);function m(v,g){return e(),o("div",null,[i,p(" more "),l,u,r,d,k])}const w=t(c,[["render",m],["__file","index.html.vue"]]),f=JSON.parse('{"path":"/JavaScript/CrossDomain/","title":"跨域","lang":"zh-CN","frontmatter":{"title":"跨域","lang":"zh-CN","date":"2024-05-14T16:24:16.000Z","permalink":"/JavaScript/CrossDomain/","category":["JavaScript"],"tag":["Network"],"description":"同源策略的概念和具体限制 同源策略：限制 从一个源加载的文档或脚本 如何与 来自另一个源的资源 进行交互。这是一个用于隔离潜在恶意文件的关键的安全机制。（来自MDN官方的解释） 具体解释： 源包括三个部分：协议、域名、端口。如果有任何一个部分不同，则源不同，那就是跨域了。 限制：这个源的文档没有权利去操作另一个源的文档。这个限制体现在： Cookie、...","head":[["meta",{"property":"og:url","content":"https://shaohui-jin.github.io/JavaScript/CrossDomain/"}],["meta",{"property":"og:title","content":"跨域"}],["meta",{"property":"og:description","content":"同源策略的概念和具体限制 同源策略：限制 从一个源加载的文档或脚本 如何与 来自另一个源的资源 进行交互。这是一个用于隔离潜在恶意文件的关键的安全机制。（来自MDN官方的解释） 具体解释： 源包括三个部分：协议、域名、端口。如果有任何一个部分不同，则源不同，那就是跨域了。 限制：这个源的文档没有权利去操作另一个源的文档。这个限制体现在： Cookie、..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:image","content":"https://shaohui-jin.github.io/picx-images-hosting/blog/Network/跨域之同源策略.b8qxop4qm.webp \\"跨域之同源策略\\" =x600"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2024-06-12T07:44:12.000Z"}],["meta",{"property":"article:author","content":"石怜安"}],["meta",{"property":"article:tag","content":"Network"}],["meta",{"property":"article:published_time","content":"2024-05-14T16:24:16.000Z"}],["meta",{"property":"article:modified_time","content":"2024-06-12T07:44:12.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"跨域\\",\\"image\\":[\\"https://shaohui-jin.github.io/picx-images-hosting/blog/Network/跨域之同源策略.b8qxop4qm.webp \\\\\\"跨域之同源策略\\\\\\" =x600\\"],\\"datePublished\\":\\"2024-05-14T16:24:16.000Z\\",\\"dateModified\\":\\"2024-06-12T07:44:12.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"石怜安\\",\\"url\\":\\"https://shaohui-jin.github.io\\"}]}"]]},"headers":[{"level":2,"title":"同源策略的概念和具体限制","slug":"同源策略的概念和具体限制","link":"#同源策略的概念和具体限制","children":[]},{"level":2,"title":"前后端如何通信","slug":"前后端如何通信","link":"#前后端如何通信","children":[]},{"level":2,"title":"跨域的解决方式","slug":"跨域的解决方式","link":"#跨域的解决方式","children":[{"level":3,"title":"CORS 跨源资源共享","slug":"cors-跨源资源共享","link":"#cors-跨源资源共享","children":[]},{"level":3,"title":"nginx","slug":"nginx","link":"#nginx","children":[]}]},{"level":2,"title":"跨域通信的几种方式","slug":"跨域通信的几种方式","link":"#跨域通信的几种方式","children":[{"level":3,"title":"JSONP","slug":"jsonp","link":"#jsonp","children":[]},{"level":3,"title":"WebSocket","slug":"websocket","link":"#websocket","children":[]},{"level":3,"title":"Hash","slug":"hash","link":"#hash","children":[]},{"level":3,"title":"postMessage","slug":"postmessage","link":"#postmessage","children":[]}]}],"git":{"createdTime":1718178252000,"updatedTime":1718178252000,"contributors":[{"name":"shaohui_jin","email":"1051131737@qq.com","commits":1}]},"readingTime":{"minutes":5.35,"words":1604},"filePathRelative":"zh/JavaScript/网络/跨域.md","localizedDate":"2024年5月14日","excerpt":"<h2>同源策略的概念和具体限制</h2>\\n<p>同源策略：限制 <strong>从一个源加载的文档或脚本</strong> 如何与 <strong>来自另一个源的资源</strong> 进行交互。这是一个用于隔离潜在恶意文件的关键的安全机制。（来自MDN官方的解释）</p>\\n<p>具体解释：</p>\\n<ul>\\n<li><code>源</code>包括三个部分：协议、域名、端口。如果有任何一个部分不同，则<code>源</code>不同，那就是跨域了。</li>\\n<li><code>限制</code>：这个源的文档没有权利去操作另一个源的文档。这个限制体现在：\\n<ul>\\n<li><code>Cookie</code>、<code>LocalStorage</code>和<code>IndexDB</code>无法获取。</li>\\n<li>无法获取和操作<code>DOM</code>。</li>\\n<li>不能发送<code>Ajax</code>请求。我们要注意，<code>Ajax</code>只适合<code>同源</code>的通信。</li>\\n</ul>\\n</li>\\n</ul>\\n<figure><img src=\\"https://shaohui-jin.github.io/picx-images-hosting/blog/Network/跨域之同源策略.b8qxop4qm.webp\\" alt=\\"\\" height=\\"600\\" tabindex=\\"0\\" loading=\\"lazy\\"><figcaption>跨域之同源策略</figcaption></figure>\\n","autoDesc":true}');export{w as comp,f as data};
