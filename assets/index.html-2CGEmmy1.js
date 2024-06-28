import{_ as e}from"./plugin-vue_export-helper-DlAUqK2U.js";import{r as g,o as d,c as o,d as c,e as r,b as i,a as t}from"./app-Bo5PwrVT.js";const s={},b=i('<p>每个Vue实例再被创建之前，都会经过一系列的初始化过程，这个过程被称之为vue的生命周期。</p><p>其中Vue中包含如下钩子：</p><table><thead><tr><th>VUE2</th><th>VUE3</th><th>备注</th></tr></thead><tbody><tr><td><strong>beforeCreate</strong></td><td></td><td></td></tr><tr><td><strong>created</strong></td><td></td><td></td></tr><tr><td><strong>beforeMount</strong></td><td><strong>onBeforeMount</strong></td><td></td></tr><tr><td><strong>mounted</strong></td><td><strong>onMounted</strong></td><td></td></tr><tr><td><strong>beforeUpdate</strong></td><td><strong>onBeforeUpdate</strong></td><td></td></tr><tr><td><strong>updated</strong></td><td><strong>onUpdated</strong></td><td></td></tr><tr><td><strong>beforeDestroy</strong></td><td><strong>onBeforeUnmount</strong></td><td></td></tr><tr><td><strong>destroyed</strong></td><td><strong>onUnmounted</strong></td><td></td></tr><tr><td><strong>activated</strong></td><td></td><td>keep-alive包裹时有效</td></tr><tr><td><strong>deactivated</strong></td><td></td><td>keep-alive包裹时有效</td></tr><tr><td><strong>errorCapture</strong></td><td></td><td>捕获异常</td></tr></tbody></table><p>下面这张进行了注释官网的生命周期图。</p><figure><img src="https://shaohui-jin.github.io/picx-images-hosting/blog/Vue/生命周期.5fkdt6fcci.webp" alt="" width="800" tabindex="0" loading="lazy"><figcaption>vueLifecycle</figcaption></figure>',5),l=t("h2",{id:"案例",tabindex:"-1"},[t("a",{class:"header-anchor",href:"#案例"},[t("span",null,"案例")])],-1),u=t("blockquote",null,[t("p",null,"结合下面的Vue生命周期案例，F12看控制台更容易理解。")],-1);function C(a,I){const n=g("VuePlayground");return d(),o("div",null,[b,c(" more "),l,u,r(n,{title:"",key:"3ed55c2e",settings:"%7B%7D",files:"eyJBcHAudnVlIjoiPHRlbXBsYXRlPlxuICA8ZGl2IHJlZj1cImxpZmVDeWNsZVwiPlxuICAgIDxoMT57eyBtZXNzYWdlICsgJyAtLS0g6L%2BZ5piv5Zyob3V0ZXIgSFRNTOS4reeahCcgfX08L2gxPlxuICAgIDxidXR0b24gQGNsaWNrPVwibWVzc2FnZSsrXCI%2B6Ieq5aKe77yM6aqM6K%2BBdXBkYXRlPC9idXR0b24%2BXG4gIDwvZGl2PlxuPC90ZW1wbGF0ZT5cblxuPHNjcmlwdD5cblxuZXhwb3J0IGRlZmF1bHQge1xuICBkYXRhKCkge1xuICAgIHJldHVybiB7XG4gICAgICBtZXNzYWdlOiAwXG4gICAgfVxuICB9LFxuICBiZWZvcmVDcmVhdGUoKSB7XG4gICAgY29uc29sZS5ncm91cCgnLS0tLS0tYmVmb3JlQ3JlYXRl5Yib5bu65YmN54q25oCBLS0tLS0tJyk7XG4gICAgY29uc29sZS5sb2coJyVjJXMnLCAnY29sb3I6cmVkJywgJ2VsICAgICA6ICcgKyB0aGlzLiRlbCk7IC8vdW5kZWZpbmVkXG4gICAgY29uc29sZS5sb2coJyVjJXMnLCAnY29sb3I6cmVkJywgJ2RhdGEgICA6ICcgKyB0aGlzLiRkYXRhKTsgLy91bmRlZmluZWRcbiAgICBjb25zb2xlLmxvZygnJWMlcycsICdjb2xvcjpyZWQnLCAnbWVzc2FnZTogJyArIHRoaXMubWVzc2FnZSk7IC8vdW5kZWZpbmVkXG4gIH0sXG4gIGNyZWF0ZWQoKSB7XG4gICAgY29uc29sZS5ncm91cCgnLS0tLS0tY3JlYXRlZOWIm%2BW7uuWujOavleeKtuaAgS0tLS0tLScpO1xuICAgIGNvbnNvbGUubG9nKCclYyVzJywgJ2NvbG9yOnJlZCcsICdlbCAgICAgOiAnICsgdGhpcy4kZWwpOyAvL3VuZGVmaW5lZFxuICAgIGNvbnNvbGUubG9nKCclYyVzJywgJ2NvbG9yOnJlZCcsICdkYXRhICAgOiAnICsgdGhpcy4kZGF0YSk7IC8v5bey6KKr5Yid5aeL5YyWXG4gICAgY29uc29sZS5sb2coJyVjJXMnLCAnY29sb3I6cmVkJywgJ21lc3NhZ2U6ICcgKyB0aGlzLm1lc3NhZ2UpOyAvL%2BW3suiiq%2BWIneWni%2BWMllxuICB9LFxuICBiZWZvcmVNb3VudCgpIHtcbiAgICBjb25zb2xlLmdyb3VwKCctLS0tLS1iZWZvcmVNb3VudOaMgui9veWJjeeKtuaAgS0tLS0tLScpO1xuICAgIGNvbnNvbGUubG9nKCclYyVzJywgJ2NvbG9yOnJlZCcsICdlbCAgICAgOiAnICsgdGhpcy4kZWwpOyAvL%2BW3suiiq%2BWIneWni%2BWMllxuICAgIGNvbnNvbGUubG9nKHRoaXMuJGVsKTtcbiAgICBjb25zb2xlLmxvZygnJWMlcycsICdjb2xvcjpyZWQnLCAnZGF0YSAgIDogJyArIHRoaXMuJGRhdGEpOyAvL%2BW3suiiq%2BWIneWni%2BWMllxuICAgIGNvbnNvbGUubG9nKCclYyVzJywgJ2NvbG9yOnJlZCcsICdtZXNzYWdlOiAnICsgdGhpcy5tZXNzYWdlKTsgLy%2Flt7LooqvliJ3lp4vljJZcbiAgfSxcbiAgbW91bnRlZCgpIHtcbiAgICBjb25zb2xlLmdyb3VwKCctLS0tLS1tb3VudGVkIOaMgui9vee7k%2Badn%2BeKtuaAgS0tLS0tLScpO1xuICAgIGNvbnNvbGUubG9nKCclYyVzJywgJ2NvbG9yOnJlZCcsICdlbCAgICAgOiAnICsgdGhpcy4kZWwpOyAvL%2BW3suiiq%2BWIneWni%2BWMllxuICAgIGNvbnNvbGUubG9nKHRoaXMuJGVsKTtcbiAgICBjb25zb2xlLmxvZygnJWMlcycsICdjb2xvcjpyZWQnLCAnZGF0YSAgIDogJyArIHRoaXMuJGRhdGEpOyAvL%2BW3suiiq%2BWIneWni%2BWMllxuICAgIGNvbnNvbGUubG9nKCclYyVzJywgJ2NvbG9yOnJlZCcsICdtZXNzYWdlOiAnICsgdGhpcy5tZXNzYWdlKTsgLy%2Flt7LooqvliJ3lp4vljJZcbiAgfSxcbiAgYmVmb3JlVXBkYXRlKCkge1xuICAgIGNvbnNvbGUuZ3JvdXAoJ2JlZm9yZVVwZGF0ZSDmm7TmlrDliY3nirbmgIE9PT09PT09PT09PT09PT3jgIsnKTtcbiAgICBjb25zb2xlLmxvZygnJWMlcycsICdjb2xvcjpyZWQnLCAnZWwgICAgIDogJyArIHRoaXMuJGVsKTtcbiAgICBjb25zb2xlLmxvZyh0aGlzLiRlbCk7XG4gICAgY29uc29sZS5sb2coJyVjJXMnLCAnY29sb3I6cmVkJywgJ2RhdGEgICA6ICcgKyB0aGlzLiRkYXRhKTtcbiAgICBjb25zb2xlLmxvZygnJWMlcycsICdjb2xvcjpyZWQnLCAnbWVzc2FnZTogJyArIHRoaXMubWVzc2FnZSk7XG4gICAgY29uc29sZS5ncm91cEVuZCgpO1xuICB9LFxuICB1cGRhdGVkKCkge1xuICAgIGNvbnNvbGUuZ3JvdXAoJ3VwZGF0ZWQg5pu05paw5a6M5oiQ54q25oCBPT09PT09PT09PT09PT0944CLJyk7XG4gICAgY29uc29sZS5sb2coJyVjJXMnLCAnY29sb3I6cmVkJywgJ2VsICAgICA6ICcgKyB0aGlzLiRlbCk7XG4gICAgY29uc29sZS5sb2codGhpcy4kZWwpO1xuICAgIGNvbnNvbGUubG9nKCclYyVzJywgJ2NvbG9yOnJlZCcsICdkYXRhICAgOiAnICsgdGhpcy4kZGF0YSk7XG4gICAgY29uc29sZS5sb2coJyVjJXMnLCAnY29sb3I6cmVkJywgJ21lc3NhZ2U6ICcgKyB0aGlzLm1lc3NhZ2UpO1xuICAgIGNvbnNvbGUuZ3JvdXBFbmQoKTtcbiAgfSxcbiAgYmVmb3JlRGVzdHJveSgpIHtcbiAgICBjb25zb2xlLmdyb3VwKCdiZWZvcmVEZXN0cm95IOmUgOavgeWJjeeKtuaAgT09PT09PT09PT09PT09PeOAiycpO1xuICAgIGNvbnNvbGUubG9nKCclYyVzJywgJ2NvbG9yOnJlZCcsICdlbCAgICAgOiAnICsgdGhpcy4kZWwpO1xuICAgIGNvbnNvbGUubG9nKHRoaXMuJGVsKTtcbiAgICBjb25zb2xlLmxvZygnJWMlcycsICdjb2xvcjpyZWQnLCAnZGF0YSAgIDogJyArIHRoaXMuJGRhdGEpO1xuICAgIGNvbnNvbGUubG9nKCclYyVzJywgJ2NvbG9yOnJlZCcsICdtZXNzYWdlOiAnICsgdGhpcy5tZXNzYWdlKTtcbiAgfSxcbiAgZGVzdHJveWVkKCkge1xuICAgIGNvbnNvbGUuZ3JvdXAoJ2Rlc3Ryb3llZCDplIDmr4HlrozmiJDnirbmgIE9PT09PT09PT09PT09PT3jgIsnKTtcbiAgICBjb25zb2xlLmxvZygnJWMlcycsICdjb2xvcjpyZWQnLCAnZWwgICAgIDogJyArIHRoaXMuJGVsKTtcbiAgICBjb25zb2xlLmxvZyh0aGlzLiRlbCk7XG4gICAgY29uc29sZS5sb2coJyVjJXMnLCAnY29sb3I6cmVkJywgJ2RhdGEgICA6ICcgKyB0aGlzLiRkYXRhKTtcbiAgICBjb25zb2xlLmxvZygnJWMlcycsICdjb2xvcjpyZWQnLCAnbWVzc2FnZTogJyArIHRoaXMubWVzc2FnZSlcbiAgfSxcbn1cbjwvc2NyaXB0PlxuIn0%3D"})])}const A=e(s,[["render",C],["__file","index.html.vue"]]),Z=JSON.parse('{"path":"/Vue/LifeCycle/","title":"Vue生命周期","lang":"zh-CN","frontmatter":{"title":"Vue生命周期","lang":"zh-CN","date":"2024-04-06T13:35:02.000Z","permalink":"/Vue/LifeCycle/","category":["VUE"],"tag":["VUE"],"description":"每个Vue实例再被创建之前，都会经过一系列的初始化过程，这个过程被称之为vue的生命周期。 其中Vue中包含如下钩子： 下面这张进行了注释官网的生命周期图。 vueLifecycle 案例 结合下面的Vue生命周期案例，F12看控制台更容易理解。","head":[["meta",{"property":"og:url","content":"https://shaohui-jin.github.io/Vue/LifeCycle/"}],["meta",{"property":"og:title","content":"Vue生命周期"}],["meta",{"property":"og:description","content":"每个Vue实例再被创建之前，都会经过一系列的初始化过程，这个过程被称之为vue的生命周期。 其中Vue中包含如下钩子： 下面这张进行了注释官网的生命周期图。 vueLifecycle 案例 结合下面的Vue生命周期案例，F12看控制台更容易理解。"}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:image","content":"https://shaohui-jin.github.io/picx-images-hosting/blog/Vue/生命周期.5fkdt6fcci.webp \\"vueLifecycle\\" =800x"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2024-06-17T10:53:37.000Z"}],["meta",{"property":"article:author","content":"石怜安"}],["meta",{"property":"article:tag","content":"VUE"}],["meta",{"property":"article:published_time","content":"2024-04-06T13:35:02.000Z"}],["meta",{"property":"article:modified_time","content":"2024-06-17T10:53:37.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"Vue生命周期\\",\\"image\\":[\\"https://shaohui-jin.github.io/picx-images-hosting/blog/Vue/生命周期.5fkdt6fcci.webp \\\\\\"vueLifecycle\\\\\\" =800x\\"],\\"datePublished\\":\\"2024-04-06T13:35:02.000Z\\",\\"dateModified\\":\\"2024-06-17T10:53:37.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"石怜安\\",\\"url\\":\\"https://shaohui-jin.github.io\\"}]}"]]},"headers":[{"level":2,"title":"案例","slug":"案例","link":"#案例","children":[]}],"git":{"createdTime":1712308326000,"updatedTime":1718621617000,"contributors":[{"name":"shaohui_jin","email":"1051131737@qq.com","commits":6}]},"readingTime":{"minutes":1.75,"words":525},"filePathRelative":"zh/Vue/Vue生命周期.md","localizedDate":"2024年4月6日","excerpt":"<p>每个Vue实例再被创建之前，都会经过一系列的初始化过程，这个过程被称之为vue的生命周期。</p>\\n<p>其中Vue中包含如下钩子：</p>\\n<table>\\n<thead>\\n<tr>\\n<th>VUE2</th>\\n<th>VUE3</th>\\n<th>备注</th>\\n</tr>\\n</thead>\\n<tbody>\\n<tr>\\n<td><strong>beforeCreate</strong></td>\\n<td></td>\\n<td></td>\\n</tr>\\n<tr>\\n<td><strong>created</strong></td>\\n<td></td>\\n<td></td>\\n</tr>\\n<tr>\\n<td><strong>beforeMount</strong></td>\\n<td><strong>onBeforeMount</strong></td>\\n<td></td>\\n</tr>\\n<tr>\\n<td><strong>mounted</strong></td>\\n<td><strong>onMounted</strong></td>\\n<td></td>\\n</tr>\\n<tr>\\n<td><strong>beforeUpdate</strong></td>\\n<td><strong>onBeforeUpdate</strong></td>\\n<td></td>\\n</tr>\\n<tr>\\n<td><strong>updated</strong></td>\\n<td><strong>onUpdated</strong></td>\\n<td></td>\\n</tr>\\n<tr>\\n<td><strong>beforeDestroy</strong></td>\\n<td><strong>onBeforeUnmount</strong></td>\\n<td></td>\\n</tr>\\n<tr>\\n<td><strong>destroyed</strong></td>\\n<td><strong>onUnmounted</strong></td>\\n<td></td>\\n</tr>\\n<tr>\\n<td><strong>activated</strong></td>\\n<td></td>\\n<td>keep-alive包裹时有效</td>\\n</tr>\\n<tr>\\n<td><strong>deactivated</strong></td>\\n<td></td>\\n<td>keep-alive包裹时有效</td>\\n</tr>\\n<tr>\\n<td><strong>errorCapture</strong></td>\\n<td></td>\\n<td>捕获异常</td>\\n</tr>\\n</tbody>\\n</table>\\n<p>下面这张进行了注释官网的生命周期图。</p>\\n<figure><img src=\\"https://shaohui-jin.github.io/picx-images-hosting/blog/Vue/生命周期.5fkdt6fcci.webp\\" alt=\\"\\" width=\\"800\\" tabindex=\\"0\\" loading=\\"lazy\\"><figcaption>vueLifecycle</figcaption></figure>\\n","autoDesc":true}');export{A as comp,Z as data};