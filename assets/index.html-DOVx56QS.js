import{_ as e}from"./plugin-vue_export-helper-DlAUqK2U.js";import{o as a,c as t,b as s}from"./app-DCbk2o9R.js";const i={},n=s(`<h2 id="csrf-跨站请求伪造" tabindex="-1"><a class="header-anchor" href="#csrf-跨站请求伪造"><span>CSRF 跨站请求伪造</span></a></h2><h3 id="csrf的基本概念、缩写、全称" tabindex="-1"><a class="header-anchor" href="#csrf的基本概念、缩写、全称"><span>CSRF的基本概念、缩写、全称</span></a></h3><blockquote><p>CSRF(Cross-site request forgery)：<code>跨站请求伪造</code>。</p></blockquote><h3 id="csrf的攻击原理" tabindex="-1"><a class="header-anchor" href="#csrf的攻击原理"><span>CSRF的攻击原理</span></a></h3><figure><img src="https://shaohui-jin.github.io/picx-images-hosting/blog/Network/CSRF的攻击原理.1hs17wwv01.webp" alt="" width="800" tabindex="0" loading="lazy"><figcaption>CSRF的攻击原理</figcaption></figure><blockquote><p>从上图可以看出，要完成一次CSRF攻击，受害者必须满足两个必要的条件：</p><ul><li>登录受信任网站A，并在本地生成Cookie。（如果用户没有登录网站A，那么 网站B 在诱导的时候，请求网站A的api接口时，会提示你登录）</li><li>在不登出A的情况下，访问危险网站B（其实是利用了网站A的漏洞）</li></ul></blockquote><h3 id="csrf如何防御" tabindex="-1"><a class="header-anchor" href="#csrf如何防御"><span>CSRF如何防御</span></a></h3><h4 id="token-验证" tabindex="-1"><a class="header-anchor" href="#token-验证"><span>Token 验证</span></a></h4><p>服务器发送给客户端一个token，客户端提交的表单中带着这个token，如果这个 token 不合法，那么服务器拒绝这个请求。</p><h4 id="隐藏令牌" tabindex="-1"><a class="header-anchor" href="#隐藏令牌"><span>隐藏令牌</span></a></h4><p>把 token 隐藏在 http 的 head头中。方法二和方法一有点像，本质上没有太大区别，只是使用方式上有区别。</p><h4 id="referer-验证" tabindex="-1"><a class="header-anchor" href="#referer-验证"><span>Referer 验证</span></a></h4><p>Referer 指的是页面请求来源。意思是，只接受本站的请求，服务器才做响应；如果不是就拦截。</p><h2 id="xss-跨域脚本攻击" tabindex="-1"><a class="header-anchor" href="#xss-跨域脚本攻击"><span>XSS 跨域脚本攻击</span></a></h2><h3 id="xss的基本概念、缩写、全称" tabindex="-1"><a class="header-anchor" href="#xss的基本概念、缩写、全称"><span>XSS的基本概念、缩写、全称</span></a></h3><blockquote><p>XSS(Cross Site Scripting)：<code>跨域脚本攻击</code>。</p></blockquote><h3 id="xss的攻击原理" tabindex="-1"><a class="header-anchor" href="#xss的攻击原理"><span>XSS的攻击原理</span></a></h3><p>XSS攻击的核心原理是：不需要你做任何的登录认证，它会通过合法的操作（比如在url中输入、在评论框中输入），向你的页面注入脚本（可能是js、html代码块等）。</p><p>最后导致的结果可能是：</p><ol><li>盗用Cookie</li><li>破坏页面的正常结构，插入广告等恶意内容</li><li>D-doss攻击</li></ol><h3 id="xss的攻击方式" tabindex="-1"><a class="header-anchor" href="#xss的攻击方式"><span>XSS的攻击方式</span></a></h3><h4 id="反射型" tabindex="-1"><a class="header-anchor" href="#反射型"><span>反射型</span></a></h4><p>发出请求时，XSS代码出现在url中，作为输入提交到服务器端，服务器端解析后响应，XSS代码随响应内容一起传回给浏览器，最后浏览器解析执行XSS代码。这个过程像一次反射，所以叫反射型XSS。</p><h4 id="存储型" tabindex="-1"><a class="header-anchor" href="#存储型"><span>存储型</span></a></h4><p>存储型XSS和反射型XSS的差别在于，提交的代码会存储在服务器端（数据库、内存、文件系统等），下次请求时目标页面时不用再提交XSS代码。</p><h3 id="xss的防范措施-encode-过滤" tabindex="-1"><a class="header-anchor" href="#xss的防范措施-encode-过滤"><span>XSS的防范措施（encode + 过滤）</span></a></h3><h4 id="编码" tabindex="-1"><a class="header-anchor" href="#编码"><span>编码：</span></a></h4><blockquote><p>对用户输入的数据进行 <code>HTML Entity</code> 编码。</p></blockquote><blockquote><p>Encode的作用是将$var等一些字符进行转化，使得浏览器在最终输出结果上是一样的。</p></blockquote><p>比如说这段代码：</p><div class="language-javascript line-numbers-mode" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="token operator">&lt;</span>script<span class="token operator">&gt;</span><span class="token function">alert</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token operator">&lt;</span><span class="token operator">/</span>script<span class="token operator">&gt;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>若不进行任何处理，则浏览器会执行alert的js操作，实现XSS注入。</p><p>进行编码处理之后，在浏览器中的显示结果就是<code>&lt;script&gt;alert(1)&lt;/script&gt;</code>，实现了将<code>$var</code>作为纯文本进行输出，且不引起JavaScript的执行。</p><h4 id="过滤" tabindex="-1"><a class="header-anchor" href="#过滤"><span>过滤</span></a></h4><ul><li>移除用户输入的和事件相关的属性。如onerror可以自动触发攻击，还有onclick等。（总而言是，过滤掉一些不安全的内容）</li><li>移除用户输入的Style节点、Script节点、Iframe节点。（尤其是Script节点，它可是支持跨域的呀，一定要移除）</li></ul><h4 id="校正" tabindex="-1"><a class="header-anchor" href="#校正"><span>校正</span></a></h4><p>避免直接对<code>HTML Entity</code>进行解码。 使用<code>DOM Parse</code>转换(它的作用是把文本解析成DOM结构)，校正不配对的<code>DOM</code>标签</p><h2 id="csrf-和-xss-的区别" tabindex="-1"><a class="header-anchor" href="#csrf-和-xss-的区别"><span>CSRF 和 XSS 的区别</span></a></h2><h3 id="区别一" tabindex="-1"><a class="header-anchor" href="#区别一"><span>区别一</span></a></h3><ul><li>CSRF：需要用户先登录网站A，获取 cookie</li><li>XSS：不需要登录。</li></ul><h3 id="区别二" tabindex="-1"><a class="header-anchor" href="#区别二"><span>区别二</span></a></h3><ul><li>CSRF：是利用网站A本身的漏洞，去请求网站A的api。</li><li>XSS：是向网站 A 注入 JS代码，然后执行 JS 里的代码，篡改网站A的内容。</li></ul>`,42),l=[n];function r(o,c){return a(),t("div",null,l)}const d=e(i,[["render",r],["__file","index.html.vue"]]),S=JSON.parse('{"path":"/Network/CSRFAndXSS/","title":"CSRF 和 XSS","lang":"zh-CN","frontmatter":{"title":"CSRF 和 XSS","lang":"zh-CN","date":"2024-05-14T16:24:16.000Z","permalink":"/Network/CSRFAndXSS/","category":["Network"],"tag":["Network"],"headerDepth":3,"description":"CSRF 跨站请求伪造 CSRF的基本概念、缩写、全称 CSRF(Cross-site request forgery)：跨站请求伪造。 CSRF的攻击原理 CSRF的攻击原理 从上图可以看出，要完成一次CSRF攻击，受害者必须满足两个必要的条件： 登录受信任网站A，并在本地生成Cookie。（如果用户没有登录网站A，那么 网站B 在诱导的时候，请求网...","head":[["meta",{"property":"og:url","content":"https://shaohui-jin.github.io/Network/CSRFAndXSS/"}],["meta",{"property":"og:title","content":"CSRF 和 XSS"}],["meta",{"property":"og:description","content":"CSRF 跨站请求伪造 CSRF的基本概念、缩写、全称 CSRF(Cross-site request forgery)：跨站请求伪造。 CSRF的攻击原理 CSRF的攻击原理 从上图可以看出，要完成一次CSRF攻击，受害者必须满足两个必要的条件： 登录受信任网站A，并在本地生成Cookie。（如果用户没有登录网站A，那么 网站B 在诱导的时候，请求网..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:image","content":"https://shaohui-jin.github.io/picx-images-hosting/blog/Network/CSRF的攻击原理.1hs17wwv01.webp \\"CSRF的攻击原理\\" =800x"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2024-05-14T09:49:56.000Z"}],["meta",{"property":"article:author","content":"石怜安"}],["meta",{"property":"article:tag","content":"Network"}],["meta",{"property":"article:published_time","content":"2024-05-14T16:24:16.000Z"}],["meta",{"property":"article:modified_time","content":"2024-05-14T09:49:56.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"CSRF 和 XSS\\",\\"image\\":[\\"https://shaohui-jin.github.io/picx-images-hosting/blog/Network/CSRF的攻击原理.1hs17wwv01.webp \\\\\\"CSRF的攻击原理\\\\\\" =800x\\"],\\"datePublished\\":\\"2024-05-14T16:24:16.000Z\\",\\"dateModified\\":\\"2024-05-14T09:49:56.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"石怜安\\",\\"url\\":\\"https://shaohui-jin.github.io\\"}]}"]]},"headers":[{"level":2,"title":"CSRF 跨站请求伪造","slug":"csrf-跨站请求伪造","link":"#csrf-跨站请求伪造","children":[{"level":3,"title":"CSRF的基本概念、缩写、全称","slug":"csrf的基本概念、缩写、全称","link":"#csrf的基本概念、缩写、全称","children":[]},{"level":3,"title":"CSRF的攻击原理","slug":"csrf的攻击原理","link":"#csrf的攻击原理","children":[]},{"level":3,"title":"CSRF如何防御","slug":"csrf如何防御","link":"#csrf如何防御","children":[{"level":4,"title":"Token 验证","slug":"token-验证","link":"#token-验证","children":[]},{"level":4,"title":"隐藏令牌","slug":"隐藏令牌","link":"#隐藏令牌","children":[]},{"level":4,"title":"Referer 验证","slug":"referer-验证","link":"#referer-验证","children":[]}]}]},{"level":2,"title":"XSS 跨域脚本攻击","slug":"xss-跨域脚本攻击","link":"#xss-跨域脚本攻击","children":[{"level":3,"title":"XSS的基本概念、缩写、全称","slug":"xss的基本概念、缩写、全称","link":"#xss的基本概念、缩写、全称","children":[]},{"level":3,"title":"XSS的攻击原理","slug":"xss的攻击原理","link":"#xss的攻击原理","children":[]},{"level":3,"title":"XSS的攻击方式","slug":"xss的攻击方式","link":"#xss的攻击方式","children":[{"level":4,"title":"反射型","slug":"反射型","link":"#反射型","children":[]},{"level":4,"title":"存储型","slug":"存储型","link":"#存储型","children":[]}]},{"level":3,"title":"XSS的防范措施（encode + 过滤）","slug":"xss的防范措施-encode-过滤","link":"#xss的防范措施-encode-过滤","children":[{"level":4,"title":"编码：","slug":"编码","link":"#编码","children":[]},{"level":4,"title":"过滤","slug":"过滤","link":"#过滤","children":[]},{"level":4,"title":"校正","slug":"校正","link":"#校正","children":[]}]}]},{"level":2,"title":"CSRF 和 XSS 的区别","slug":"csrf-和-xss-的区别","link":"#csrf-和-xss-的区别","children":[{"level":3,"title":"区别一","slug":"区别一","link":"#区别一","children":[]},{"level":3,"title":"区别二","slug":"区别二","link":"#区别二","children":[]}]}],"git":{"createdTime":1715680196000,"updatedTime":1715680196000,"contributors":[{"name":"shaohui_jin","email":"1051131737@qq.com","commits":1}]},"readingTime":{"minutes":3.13,"words":940},"filePathRelative":"zh/网络/CRFS和XSS.md","localizedDate":"2024年5月14日","excerpt":"<h2>CSRF 跨站请求伪造</h2>\\n<h3>CSRF的基本概念、缩写、全称</h3>\\n<blockquote>\\n<p>CSRF(Cross-site request forgery)：<code>跨站请求伪造</code>。</p>\\n</blockquote>\\n<h3>CSRF的攻击原理</h3>\\n<figure><img src=\\"https://shaohui-jin.github.io/picx-images-hosting/blog/Network/CSRF的攻击原理.1hs17wwv01.webp\\" alt=\\"\\" width=\\"800\\" tabindex=\\"0\\" loading=\\"lazy\\"><figcaption>CSRF的攻击原理</figcaption></figure>","autoDesc":true}');export{d as comp,S as data};