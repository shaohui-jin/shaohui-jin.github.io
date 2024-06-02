import{_ as a}from"./plugin-vue_export-helper-DlAUqK2U.js";import{o as t,c as p,a as n,f as s}from"./app-DCbk2o9R.js";const o={},e=n("blockquote",null,[n("p",null,[n("code",null,"import.meta.glob"),s(": 属性返回一个字符串，表示当前模块所在的文件夹中的文件名的模式。这个字符串使用 glob 语法表示，可以使用通配符来匹配文件名。")])],-1),c=n("div",{class:"language-javascript line-numbers-mode","data-ext":"js","data-title":"js"},[n("pre",{js:"",class:"language-javascript"},[n("code",null,[n("span",{class:"token comment"},"// 寻找views文件夹中的所有的page.js"),s(`
`),n("span",{class:"token keyword"},"const"),s(" pages "),n("span",{class:"token operator"},"="),s(),n("span",{class:"token keyword"},"import"),n("span",{class:"token punctuation"},"."),s("meta"),n("span",{class:"token punctuation"},"."),n("span",{class:"token function"},"glob"),n("span",{class:"token punctuation"},"("),n("span",{class:"token string"},"'../views/**/page.js'"),n("span",{class:"token punctuation"},","),s(),n("span",{class:"token punctuation"},"{"),s(),n("span",{class:"token literal-property property"},"eager"),n("span",{class:"token operator"},":"),s(),n("span",{class:"token boolean"},"true"),n("span",{class:"token punctuation"},","),s(),n("span",{class:"token keyword"},"import"),n("span",{class:"token operator"},":"),s(),n("span",{class:"token string"},"'default'"),s(),n("span",{class:"token punctuation"},"}"),n("span",{class:"token punctuation"},")"),s(`
`),n("span",{class:"token comment"},"// 寻找所有组件，为后期component做准备"),s(`
`),n("span",{class:"token keyword"},"const"),s(" pageComps "),n("span",{class:"token operator"},"="),s(),n("span",{class:"token keyword"},"import"),n("span",{class:"token punctuation"},"."),s("meta"),n("span",{class:"token punctuation"},"."),n("span",{class:"token function"},"glob"),n("span",{class:"token punctuation"},"("),n("span",{class:"token string"},"'../views/**/index.vue'"),n("span",{class:"token punctuation"},","),s(),n("span",{class:"token punctuation"},"{"),s(),n("span",{class:"token literal-property property"},"eager"),n("span",{class:"token operator"},":"),s(),n("span",{class:"token boolean"},"true"),s(),n("span",{class:"token punctuation"},"}"),n("span",{class:"token punctuation"},")"),s(`
`),n("span",{class:"token keyword"},"const"),s(" routes "),n("span",{class:"token operator"},"="),s(" Object"),n("span",{class:"token punctuation"},"."),n("span",{class:"token function"},"entries"),n("span",{class:"token punctuation"},"("),s("pages"),n("span",{class:"token punctuation"},")"),n("span",{class:"token punctuation"},"."),n("span",{class:"token function"},"map"),n("span",{class:"token punctuation"},"("),n("span",{class:"token punctuation"},"("),n("span",{class:"token parameter"},[n("span",{class:"token punctuation"},"["),s("path"),n("span",{class:"token punctuation"},","),s(" meta"),n("span",{class:"token punctuation"},"]")]),n("span",{class:"token punctuation"},")"),s(),n("span",{class:"token operator"},"=>"),s(),n("span",{class:"token punctuation"},"{"),s(`
  path `),n("span",{class:"token operator"},"="),s(" path"),n("span",{class:"token punctuation"},"."),n("span",{class:"token function"},"replace"),n("span",{class:"token punctuation"},"("),n("span",{class:"token string"},"'../views'"),n("span",{class:"token punctuation"},","),s(),n("span",{class:"token string"},"''"),n("span",{class:"token punctuation"},")"),n("span",{class:"token punctuation"},"."),n("span",{class:"token function"},"replace"),n("span",{class:"token punctuation"},"("),n("span",{class:"token string"},"'/page.js'"),n("span",{class:"token punctuation"},","),s(),n("span",{class:"token string"},"''"),n("span",{class:"token punctuation"},")"),s(`
  path `),n("span",{class:"token operator"},"="),s(" path "),n("span",{class:"token operator"},"||"),s(),n("span",{class:"token string"},"'/'"),s(`
  `),n("span",{class:"token keyword"},"const"),s(" name "),n("span",{class:"token operator"},"="),s(" path"),n("span",{class:"token punctuation"},"."),n("span",{class:"token function"},"split"),n("span",{class:"token punctuation"},"("),n("span",{class:"token string"},"'/'"),n("span",{class:"token punctuation"},")"),n("span",{class:"token punctuation"},"."),n("span",{class:"token function"},"filter"),n("span",{class:"token punctuation"},"("),s("Boolean"),n("span",{class:"token punctuation"},")"),n("span",{class:"token punctuation"},"."),n("span",{class:"token function"},"join"),n("span",{class:"token punctuation"},"("),n("span",{class:"token string"},"'-'"),n("span",{class:"token punctuation"},")"),s(),n("span",{class:"token operator"},"||"),s(),n("span",{class:"token string"},"'index'"),s(`
  `),n("span",{class:"token keyword"},"return"),s(),n("span",{class:"token punctuation"},"{"),s(`
    path`),n("span",{class:"token punctuation"},","),s(`
    name`),n("span",{class:"token punctuation"},","),s(`
    `),n("span",{class:"token comment"},"// component: () => import(''), "),s(`
    meta
  `),n("span",{class:"token punctuation"},"}"),s(`
`),n("span",{class:"token punctuation"},"}"),n("span",{class:"token punctuation"},")"),s(`

`),n("span",{class:"token keyword"},"export"),s(),n("span",{class:"token keyword"},"const"),s(" router "),n("span",{class:"token operator"},"="),s(),n("span",{class:"token function"},"createRouter"),n("span",{class:"token punctuation"},"("),n("span",{class:"token punctuation"},"{"),s(`
  `),n("span",{class:"token literal-property property"},"history"),n("span",{class:"token operator"},":"),s(),n("span",{class:"token function"},"createWebHistory"),n("span",{class:"token punctuation"},"("),n("span",{class:"token punctuation"},")"),n("span",{class:"token punctuation"},","),s(`
  routes
`),n("span",{class:"token punctuation"},"}"),n("span",{class:"token punctuation"},")"),s(`
`)])]),n("div",{class:"highlight-lines"},[n("br"),n("div",{class:"highlight-line"}," "),n("br"),n("div",{class:"highlight-line"}," "),n("br"),n("div",{class:"highlight-line"}," "),n("div",{class:"highlight-line"}," "),n("br"),n("br"),n("br"),n("br"),n("br"),n("br"),n("br"),n("br"),n("br"),n("br"),n("br"),n("br"),n("br")]),n("div",{class:"line-numbers","aria-hidden":"true"},[n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"})])],-1),l=[e,c];function i(u,r){return t(),p("div",null,l)}const d=a(o,[["render",i],["__file","index.html.vue"]]),g=JSON.parse(`{"path":"/Tips/JavaScript/Vue/001/","title":"路由生成器","lang":"zh-CN","frontmatter":{"title":"路由生成器","lang":"zh-CN","date":"2024-05-18T18:54:31.000Z","permalink":"/Tips/JavaScript/Vue/001/","category":["JavaScript"],"tag":["Tips"],"description":"import.meta.glob: 属性返回一个字符串，表示当前模块所在的文件夹中的文件名的模式。这个字符串使用 glob 语法表示，可以使用通配符来匹配文件名。","head":[["meta",{"property":"og:url","content":"https://shaohui-jin.github.io/Tips/JavaScript/Vue/001/"}],["meta",{"property":"og:title","content":"路由生成器"}],["meta",{"property":"og:description","content":"import.meta.glob: 属性返回一个字符串，表示当前模块所在的文件夹中的文件名的模式。这个字符串使用 glob 语法表示，可以使用通配符来匹配文件名。"}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2024-05-29T07:52:09.000Z"}],["meta",{"property":"article:author","content":"石怜安"}],["meta",{"property":"article:tag","content":"Tips"}],["meta",{"property":"article:published_time","content":"2024-05-18T18:54:31.000Z"}],["meta",{"property":"article:modified_time","content":"2024-05-29T07:52:09.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"路由生成器\\",\\"image\\":[\\"\\"],\\"datePublished\\":\\"2024-05-18T18:54:31.000Z\\",\\"dateModified\\":\\"2024-05-29T07:52:09.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"石怜安\\",\\"url\\":\\"https://shaohui-jin.github.io\\"}]}"]]},"headers":[],"git":{"createdTime":1716969129000,"updatedTime":1716969129000,"contributors":[{"name":"shaohui_jin","email":"1051131737@qq.com","commits":1}]},"readingTime":{"minutes":0.54,"words":162},"filePathRelative":"zh/小技巧/JavaScript/Vue相关/001.路由生成器.md","localizedDate":"2024年5月18日","excerpt":"<blockquote>\\n<p><code>import.meta.glob</code>: 属性返回一个字符串，表示当前模块所在的文件夹中的文件名的模式。这个字符串使用 glob 语法表示，可以使用通配符来匹配文件名。</p>\\n</blockquote>\\n<div class=\\"language-javascript\\" data-ext=\\"js\\" data-title=\\"js\\"><pre js=\\"\\" class=\\"language-javascript\\"><code><span class=\\"token comment\\">// 寻找views文件夹中的所有的page.js</span>\\n<span class=\\"token keyword\\">const</span> pages <span class=\\"token operator\\">=</span> <span class=\\"token keyword\\">import</span><span class=\\"token punctuation\\">.</span>meta<span class=\\"token punctuation\\">.</span><span class=\\"token function\\">glob</span><span class=\\"token punctuation\\">(</span><span class=\\"token string\\">'../views/**/page.js'</span><span class=\\"token punctuation\\">,</span> <span class=\\"token punctuation\\">{</span> <span class=\\"token literal-property property\\">eager</span><span class=\\"token operator\\">:</span> <span class=\\"token boolean\\">true</span><span class=\\"token punctuation\\">,</span> <span class=\\"token keyword\\">import</span><span class=\\"token operator\\">:</span> <span class=\\"token string\\">'default'</span> <span class=\\"token punctuation\\">}</span><span class=\\"token punctuation\\">)</span>\\n<span class=\\"token comment\\">// 寻找所有组件，为后期component做准备</span>\\n<span class=\\"token keyword\\">const</span> pageComps <span class=\\"token operator\\">=</span> <span class=\\"token keyword\\">import</span><span class=\\"token punctuation\\">.</span>meta<span class=\\"token punctuation\\">.</span><span class=\\"token function\\">glob</span><span class=\\"token punctuation\\">(</span><span class=\\"token string\\">'../views/**/index.vue'</span><span class=\\"token punctuation\\">,</span> <span class=\\"token punctuation\\">{</span> <span class=\\"token literal-property property\\">eager</span><span class=\\"token operator\\">:</span> <span class=\\"token boolean\\">true</span> <span class=\\"token punctuation\\">}</span><span class=\\"token punctuation\\">)</span>\\n<span class=\\"token keyword\\">const</span> routes <span class=\\"token operator\\">=</span> Object<span class=\\"token punctuation\\">.</span><span class=\\"token function\\">entries</span><span class=\\"token punctuation\\">(</span>pages<span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">.</span><span class=\\"token function\\">map</span><span class=\\"token punctuation\\">(</span><span class=\\"token punctuation\\">(</span><span class=\\"token parameter\\"><span class=\\"token punctuation\\">[</span>path<span class=\\"token punctuation\\">,</span> meta<span class=\\"token punctuation\\">]</span></span><span class=\\"token punctuation\\">)</span> <span class=\\"token operator\\">=&gt;</span> <span class=\\"token punctuation\\">{</span>\\n  path <span class=\\"token operator\\">=</span> path<span class=\\"token punctuation\\">.</span><span class=\\"token function\\">replace</span><span class=\\"token punctuation\\">(</span><span class=\\"token string\\">'../views'</span><span class=\\"token punctuation\\">,</span> <span class=\\"token string\\">''</span><span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">.</span><span class=\\"token function\\">replace</span><span class=\\"token punctuation\\">(</span><span class=\\"token string\\">'/page.js'</span><span class=\\"token punctuation\\">,</span> <span class=\\"token string\\">''</span><span class=\\"token punctuation\\">)</span>\\n  path <span class=\\"token operator\\">=</span> path <span class=\\"token operator\\">||</span> <span class=\\"token string\\">'/'</span>\\n  <span class=\\"token keyword\\">const</span> name <span class=\\"token operator\\">=</span> path<span class=\\"token punctuation\\">.</span><span class=\\"token function\\">split</span><span class=\\"token punctuation\\">(</span><span class=\\"token string\\">'/'</span><span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">.</span><span class=\\"token function\\">filter</span><span class=\\"token punctuation\\">(</span>Boolean<span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">.</span><span class=\\"token function\\">join</span><span class=\\"token punctuation\\">(</span><span class=\\"token string\\">'-'</span><span class=\\"token punctuation\\">)</span> <span class=\\"token operator\\">||</span> <span class=\\"token string\\">'index'</span>\\n  <span class=\\"token keyword\\">return</span> <span class=\\"token punctuation\\">{</span>\\n    path<span class=\\"token punctuation\\">,</span>\\n    name<span class=\\"token punctuation\\">,</span>\\n    <span class=\\"token comment\\">// component: () =&gt; import(''), </span>\\n    meta\\n  <span class=\\"token punctuation\\">}</span>\\n<span class=\\"token punctuation\\">}</span><span class=\\"token punctuation\\">)</span>\\n\\n<span class=\\"token keyword\\">export</span> <span class=\\"token keyword\\">const</span> router <span class=\\"token operator\\">=</span> <span class=\\"token function\\">createRouter</span><span class=\\"token punctuation\\">(</span><span class=\\"token punctuation\\">{</span>\\n  <span class=\\"token literal-property property\\">history</span><span class=\\"token operator\\">:</span> <span class=\\"token function\\">createWebHistory</span><span class=\\"token punctuation\\">(</span><span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">,</span>\\n  routes\\n<span class=\\"token punctuation\\">}</span><span class=\\"token punctuation\\">)</span>\\n</code></pre></div>","autoDesc":true}`);export{d as comp,g as data};