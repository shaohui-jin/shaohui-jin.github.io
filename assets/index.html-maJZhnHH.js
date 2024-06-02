import{_ as s}from"./plugin-vue_export-helper-DlAUqK2U.js";import{o as a,c as t,d as p,a as n,b as e}from"./app-DCbk2o9R.js";const o={},i=n("h2",{id:"深度优先遍历",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#深度优先遍历"},[n("span",null,"深度优先遍历")])],-1),c=n("p",null,"深度优先遍历（Depth First Search，简称 DFS）就是找准一条路不停深入的搜索方法， 当发现这条路走不通的时候就会回退到上一个探索的节点，如果上一个节点存在没有探索的分支，便继续探索若没有则继续回退。 深度优先遍历就有点像二叉树中的前序遍历、中序遍历和后序遍历。",-1),l=n("p",null,"它的特点是不撞南墙不回头，先走完一条路，再换一条路继续走。",-1),u=n("p",null,"深度优先遍历的关键就在于如何找到已经探索过节点的上一个节点，也就是如何回溯。",-1),r=e(`<figure><img src="https://shaohui-jin.github.io/picx-images-hosting/blog/Algorithm/深度优先遍历节点图.231mqdnw1s.webp" alt="" tabindex="0" loading="lazy"><figcaption>深度优先遍历节点图</figcaption></figure><ul><li>从根节点 1 开始遍历，它相邻的节点有 2，3，4，先遍历节点 2，再遍历 2 的子节点 5，然后再遍历 5 的子节点 9</li><li>此时 2 以及下面的节点遍历完后，回到根节点 1，继续遍历 3，6，10，7</li><li>此时 3 以及下面的节点遍历完后，回到根节点 1，继续遍历 4，8</li><li>完整的遍历顺序图如下：</li></ul><figure><img src="https://shaohui-jin.github.io/picx-images-hosting/blog/Algorithm/深度优先遍历顺序图.54xirlp88w.webp" alt="" tabindex="0" loading="lazy"><figcaption>深度优先遍历顺序图</figcaption></figure><p>另一个利用栈的动图描述：</p><figure><img src="https://shaohui-jin.github.io/picx-images-hosting/blog/Algorithm/深度优先遍历栈动态图.7awxddgvzz.gif" alt="" tabindex="0" loading="lazy"><figcaption>深度优先遍历栈动态图</figcaption></figure><h3 id="递归实现" tabindex="-1"><a class="header-anchor" href="#递归实现"><span>递归实现</span></a></h3><div class="language-java line-numbers-mode" data-ext="java" data-title="java"><pre class="language-java"><code><span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">dfs</span><span class="token punctuation">(</span><span class="token class-name">TreeNode</span> root<span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>root <span class="token operator">==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">print</span><span class="token punctuation">(</span><span class="token string">&quot;DFS 遍历，这里应该存节点，如：list.add(root)&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token comment">// 遍历左节点 </span>
  <span class="token function">preOrderRecur</span><span class="token punctuation">(</span>root<span class="token punctuation">.</span>left<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token comment">// 遍历右节点 </span>
  <span class="token function">preOrderRecur</span><span class="token punctuation">(</span>root<span class="token punctuation">.</span>right<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="迭代实现" tabindex="-1"><a class="header-anchor" href="#迭代实现"><span>迭代实现</span></a></h3><p>根据深度优先算法的特性，可以使用栈先入后出的特性实现。</p><p>将探索过的点存入栈内，遇到走不通的时候将栈顶元素出栈回到上一个元素，实现回溯</p><div class="language-java line-numbers-mode" data-ext="java" data-title="java"><pre class="language-java"><code><span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">dfs</span><span class="token punctuation">(</span><span class="token class-name">TreeNode</span> root<span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>root <span class="token operator">==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  	<span class="token keyword">return</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token class-name">Stack</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">TreeNode</span><span class="token punctuation">&gt;</span></span> stack <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Stack</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token punctuation">&gt;</span></span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  stack<span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span>root<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">while</span> <span class="token punctuation">(</span><span class="token operator">!</span>stack<span class="token punctuation">.</span><span class="token function">isEmpty</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  	<span class="token class-name">TreeNode</span> node <span class="token operator">=</span> stack<span class="token punctuation">.</span><span class="token function">pop</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  	<span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">print</span><span class="token punctuation">(</span><span class="token string">&quot;DFS 遍历，这里应该存节点，如：list.add(node)&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  	<span class="token keyword">if</span> <span class="token punctuation">(</span>node<span class="token punctuation">.</span>right <span class="token operator">!=</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  	  stack<span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span>node<span class="token punctuation">.</span>right<span class="token punctuation">)</span><span class="token punctuation">;</span>
  	<span class="token punctuation">}</span>
  	<span class="token keyword">if</span> <span class="token punctuation">(</span>node<span class="token punctuation">.</span>left <span class="token operator">!=</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  	  stack<span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span>node<span class="token punctuation">.</span>left<span class="token punctuation">)</span><span class="token punctuation">;</span>
  	<span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>不难发现，上面的图这就是树的前序遍历，实际上不管是前序遍历，还是中序遍历，亦或是后序遍历，都属于深度优先遍历。</p><p>详细关于 DFS 的前序遍历、中序遍历、后序遍历的讲解，请看 二叉树遍历。</p><h2 id="广度优先遍历" tabindex="-1"><a class="header-anchor" href="#广度优先遍历"><span>广度优先遍历</span></a></h2><p>广度优先遍历（Breath First Search，简称 BFS）一层一层遍历，每一层得到的所有新节点，要用队列存储起来以备下一层遍历的时候再遍历。</p><figure><img src="https://shaohui-jin.github.io/picx-images-hosting/blog/Algorithm/广度优先遍历顺序动图.9gwbz58jr1.gif" alt="" tabindex="0" loading="lazy"><figcaption>广度优先遍历顺序动图</figcaption></figure><p>可以看出，遍历的顺序先是 2，3，4，接着是 5，6，7，8，最后是 9，10。属于一层一层遍历。</p><p>另一个利用队列的动图描述：</p><figure><img src="https://shaohui-jin.github.io/picx-images-hosting/blog/Algorithm/广度优先遍历队列动图.7zq6xe4f0c.gif" alt="" tabindex="0" loading="lazy"><figcaption>广度优先遍历队列动图</figcaption></figure><p>深度优先遍历用的是栈，而广度优先遍历要用队列来实现。</p><div class="language-java line-numbers-mode" data-ext="java" data-title="java"><pre class="language-java"><code><span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">bfs</span><span class="token punctuation">(</span><span class="token class-name">Node</span> root<span class="token punctuation">)</span> <span class="token punctuation">{</span> 
  <span class="token keyword">if</span> <span class="token punctuation">(</span>root <span class="token operator">==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> 
    <span class="token keyword">return</span><span class="token punctuation">;</span> 
  <span class="token punctuation">}</span> 
  <span class="token class-name">Queue</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">Node</span><span class="token punctuation">&gt;</span></span> queue <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">LinkedList</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token punctuation">&gt;</span></span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span> 
  stack<span class="token punctuation">.</span><span class="token function">add</span><span class="token punctuation">(</span>root<span class="token punctuation">)</span><span class="token punctuation">;</span> 
 
  <span class="token keyword">while</span> <span class="token punctuation">(</span><span class="token operator">!</span>queue<span class="token punctuation">.</span><span class="token function">isEmpty</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> 
    <span class="token class-name">Node</span> node <span class="token operator">=</span> queue<span class="token punctuation">.</span><span class="token function">poll</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span> 
    <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">&quot;BFS 遍历，这里可以存节点，如 list.add(node)&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span> 
    <span class="token class-name">Node</span> left <span class="token operator">=</span> node<span class="token punctuation">.</span>left<span class="token punctuation">;</span> 
    <span class="token keyword">if</span> <span class="token punctuation">(</span>left <span class="token operator">!=</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> 
        queue<span class="token punctuation">.</span><span class="token function">add</span><span class="token punctuation">(</span>left<span class="token punctuation">)</span><span class="token punctuation">;</span> 
    <span class="token punctuation">}</span> 
    <span class="token class-name">Node</span> right <span class="token operator">=</span> node<span class="token punctuation">.</span>right<span class="token punctuation">;</span> 
    <span class="token keyword">if</span> <span class="token punctuation">(</span>right <span class="token operator">!=</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> 
        queue<span class="token punctuation">.</span><span class="token function">add</span><span class="token punctuation">(</span>right<span class="token punctuation">)</span><span class="token punctuation">;</span> 
    <span class="token punctuation">}</span> 
  <span class="token punctuation">}</span> 
<span class="token punctuation">}</span> 
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,21);function k(d,m){return a(),t("div",null,[i,c,l,u,p(" more "),r])}const v=s(o,[["render",k],["__file","index.html.vue"]]),b=JSON.parse('{"path":"/Algorithm/PriorityTraversal/","title":"优先遍历算法","lang":"zh-CN","frontmatter":{"title":"优先遍历算法","date":"2022-06-24T14:38:26.000Z","permalink":"/Algorithm/PriorityTraversal/","category":["算法"],"tag":["很菜的算法"],"description":"深度优先遍历 深度优先遍历（Depth First Search，简称 DFS）就是找准一条路不停深入的搜索方法， 当发现这条路走不通的时候就会回退到上一个探索的节点，如果上一个节点存在没有探索的分支，便继续探索若没有则继续回退。 深度优先遍历就有点像二叉树中的前序遍历、中序遍历和后序遍历。 它的特点是不撞南墙不回头，先走完一条路，再换一条路继续走。 ...","head":[["meta",{"property":"og:url","content":"https://shaohui-jin.github.io/Algorithm/PriorityTraversal/"}],["meta",{"property":"og:title","content":"优先遍历算法"}],["meta",{"property":"og:description","content":"深度优先遍历 深度优先遍历（Depth First Search，简称 DFS）就是找准一条路不停深入的搜索方法， 当发现这条路走不通的时候就会回退到上一个探索的节点，如果上一个节点存在没有探索的分支，便继续探索若没有则继续回退。 深度优先遍历就有点像二叉树中的前序遍历、中序遍历和后序遍历。 它的特点是不撞南墙不回头，先走完一条路，再换一条路继续走。 ..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:image","content":"https://shaohui-jin.github.io/picx-images-hosting/blog/Algorithm/深度优先遍历节点图.231mqdnw1s.webp \\"深度优先遍历节点图\\""}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2024-03-22T10:36:45.000Z"}],["meta",{"property":"article:author","content":"石怜安"}],["meta",{"property":"article:tag","content":"很菜的算法"}],["meta",{"property":"article:published_time","content":"2022-06-24T14:38:26.000Z"}],["meta",{"property":"article:modified_time","content":"2024-03-22T10:36:45.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"优先遍历算法\\",\\"image\\":[\\"https://shaohui-jin.github.io/picx-images-hosting/blog/Algorithm/深度优先遍历节点图.231mqdnw1s.webp \\\\\\"深度优先遍历节点图\\\\\\"\\",\\"https://shaohui-jin.github.io/picx-images-hosting/blog/Algorithm/深度优先遍历顺序图.54xirlp88w.webp \\\\\\"深度优先遍历顺序图\\\\\\"\\",\\"https://shaohui-jin.github.io/picx-images-hosting/blog/Algorithm/深度优先遍历栈动态图.7awxddgvzz.gif \\\\\\"深度优先遍历栈动态图\\\\\\"\\",\\"https://shaohui-jin.github.io/picx-images-hosting/blog/Algorithm/广度优先遍历顺序动图.9gwbz58jr1.gif \\\\\\"广度优先遍历顺序动图\\\\\\"\\",\\"https://shaohui-jin.github.io/picx-images-hosting/blog/Algorithm/广度优先遍历队列动图.7zq6xe4f0c.gif \\\\\\"广度优先遍历队列动图\\\\\\"\\"],\\"datePublished\\":\\"2022-06-24T14:38:26.000Z\\",\\"dateModified\\":\\"2024-03-22T10:36:45.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"石怜安\\",\\"url\\":\\"https://shaohui-jin.github.io\\"}]}"]]},"headers":[{"level":2,"title":"深度优先遍历","slug":"深度优先遍历","link":"#深度优先遍历","children":[{"level":3,"title":"递归实现","slug":"递归实现","link":"#递归实现","children":[]},{"level":3,"title":"迭代实现","slug":"迭代实现","link":"#迭代实现","children":[]}]},{"level":2,"title":"广度优先遍历","slug":"广度优先遍历","link":"#广度优先遍历","children":[]}],"git":{"createdTime":1710151243000,"updatedTime":1711103805000,"contributors":[{"name":"shaohui_jin","email":"1051131737@qq.com","commits":2}]},"readingTime":{"minutes":2.88,"words":863},"filePathRelative":"zh/Algorithm/PriorityTraversal.md","localizedDate":"2022年6月24日","excerpt":"<h2>深度优先遍历</h2>\\n<p>深度优先遍历（Depth First Search，简称 DFS）就是找准一条路不停深入的搜索方法，\\n当发现这条路走不通的时候就会回退到上一个探索的节点，如果上一个节点存在没有探索的分支，便继续探索若没有则继续回退。\\n深度优先遍历就有点像二叉树中的前序遍历、中序遍历和后序遍历。</p>\\n<p>它的特点是不撞南墙不回头，先走完一条路，再换一条路继续走。</p>\\n<p>深度优先遍历的关键就在于如何找到已经探索过节点的上一个节点，也就是如何回溯。</p>\\n","autoDesc":true}');export{v as comp,b as data};