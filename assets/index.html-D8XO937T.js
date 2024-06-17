import{_ as i}from"./plugin-vue_export-helper-DlAUqK2U.js";import{o as n,c as e,d as o,b as t}from"./app-DGyjAF8E.js";const r={},s=t('<p>当浏览器的 「<strong>网络线程</strong>」 收到 「<strong>HTML 文档</strong>」后，会产生一个 <strong>渲染任务</strong>，并将其传递 「<strong>渲染主线程</strong>」 的消息队列。</p><p>在事件循环机制的作用下，渲染主线程取出消息队列中的渲染任务，开启渲染流程。</p><figure><img src="https://shaohui-jin.github.io/picx-images-hosting/blog/EventLoop/渲染时间点.1hrzbay7up.webp" alt="" width="800" tabindex="0" loading="lazy"><figcaption>渲染时间点</figcaption></figure><h2 id="渲染流水线" tabindex="-1"><a class="header-anchor" href="#渲染流水线"><span>渲染流水线</span></a></h2>',4),a=t('<p>整个渲染流程分为多个阶段，分别是： <code>HTML 解析</code>、<code>样式计算</code>、<code>布局</code>、<code>分层</code>、<code>绘制</code>、<code>分块</code>、<code>光栅化</code>、<code>画</code></p><p>每个阶段都有明确的输入输出，「<strong>上一个阶段的输出</strong>」 会成为 「<strong>下一个阶段的输入</strong>」。</p><p>这样，整个渲染流程就形成了一套组织严密的生产流水线。</p><figure><img src="https://shaohui-jin.github.io/picx-images-hosting/blog/EventLoop/渲染流水线.41xtnyj74g.webp" alt="" width="800" tabindex="0" loading="lazy"><figcaption>渲染流水线</figcaption></figure>',4),g=t('<h3 id="「解析-html」-parse-html" tabindex="-1"><a class="header-anchor" href="#「解析-html」-parse-html"><span>「<strong>解析 HTML</strong>」 Parse HTML</span></a></h3><p>解析过程中遇到 CSS 解析 CSS，遇到 JS 执行 JS。</p><p>为了提高解析效率，浏览器在开始解析前，会启动一个 <strong>预解析</strong> 的线程，率先下载 HTML 中的 <strong>外部CSS</strong> 文件和 <strong>外部的 JS 文件</strong>。</p><p>如果主线程解析到 <strong>link</strong> 位置，此时外部的 CSS 文件还没有下载解析好，主线程不会等待，继续解析后续的HTML。</p><p>这是因为 <strong>下载</strong> 和 <strong>解析 CSS</strong> 的工作是在 <strong>预解析线程</strong> 中进行的。这就是CSS不会阻塞 HTML 解析的根本原因。</p><figure><img src="https://shaohui-jin.github.io/picx-images-hosting/blog/EventLoop/预解析CSS.969ifq9lxi.webp" alt="" width="800" tabindex="0" loading="lazy"><figcaption>预解析CSS</figcaption></figure><p>如果主线程解析到 <strong>script</strong> 位置，会停止解析 HTML，转而等待 JS 文件下载好，并将全局代码解析执行完成后，才能继续解析 HTML。</p><p>这是因为 JS 代码的执行过程可能会修改当前的 DOM 树，所以 DOM 树的生成<strong>必须暂停</strong>。这就是 JS 会阻塞 HTML 解析的根本原因。</p><figure><img src="https://shaohui-jin.github.io/picx-images-hosting/blog/EventLoop/预解析JS.5fkcuhgqjb.webp" alt="" width="800" tabindex="0" loading="lazy"><figcaption>预解析JS</figcaption></figure><figure><img src="https://shaohui-jin.github.io/picx-images-hosting/blog/EventLoop/Document-Object-Model.7zq74q3yr3.webp" alt="" width="800" tabindex="0" loading="lazy"><figcaption>Document-Object-Model</figcaption></figure><figure><img src="https://shaohui-jin.github.io/picx-images-hosting/blog/EventLoop/CSS-Object-Model.2a4ut48dpd.webp" alt="" width="800" tabindex="0" loading="lazy"><figcaption>CSS-Object-Model</figcaption></figure><h3 id="「样式计算」-recalculate-style" tabindex="-1"><a class="header-anchor" href="#「样式计算」-recalculate-style"><span>「<strong>样式计算</strong>」 Recalculate Style</span></a></h3><p>主线程会遍历得到的 DOM 树， 依次为树中的每个节点计算出它最终的样式，称之为 「<strong>Computed Style</strong>」。</p><p>在这一过程中，很多 <strong>预设值</strong>会变成 <strong>绝对值</strong>，比如 <code>red</code> 会变成 <code>rgb(255,0,0)</code>；<strong>相对单位</strong> 会变成 <strong>绝对单位</strong>，比如 <code>em</code> 会变成 <code>px</code></p><figure><img src="https://shaohui-jin.github.io/picx-images-hosting/blog/EventLoop/样式计算.3nrdzlzvb8.webp" alt="" width="800" tabindex="0" loading="lazy"><figcaption>样式计算</figcaption></figure><h3 id="「布局」-layout" tabindex="-1"><a class="header-anchor" href="#「布局」-layout"><span>「<strong>布局</strong>」 Layout</span></a></h3><p>布局阶段会依次遍历 DOM 树的每一个节点，计算每个节点的「<strong>几何信息</strong>」。 例如节点的 <strong>宽高</strong>、<strong>相对包含块</strong>的位置。</p><p>大部分时候，DOM 树和布局树 「<strong>并非一一对应</strong>」。</p><p>比如 <code>display:none</code> 的节点 <strong>没有几何信息</strong>，因此不会生成到布局树；又比如使用了 <strong>伪元素选择器</strong>，虽然 DOM树 中不存在这些伪元素节点，但它们拥有几何信息，所以会生成到布局树中。</p><p>还有 <strong>匿名行盒</strong>、<strong>匿名块盒</strong> 等等都会导致 DOM 树和布局树无法一一对应。</p><figure><img src="https://shaohui-jin.github.io/picx-images-hosting/blog/EventLoop/布局(DOM转Layout).6pna10bp9v.webp" alt="" width="800" tabindex="0" loading="lazy"><figcaption>布局(DOM转Layout)</figcaption></figure><h3 id="「分层」-layer" tabindex="-1"><a class="header-anchor" href="#「分层」-layer"><span>「<strong>分层</strong>」 Layer</span></a></h3><p>主线程会使用一套复杂的策略对整个 <strong>布局树</strong> 中进行分层。</p><p>分层的好处在于，将来某一个层改变后，仅会对该层进行后续处理，从而提升效率。</p><p><strong>滚动条</strong>、<strong>堆叠上下文</strong>、<strong>transform</strong>、<strong>opacity</strong> 等样式都会或多或少的影响分层结果，也可以通过 <strong>will-change</strong> 属性更大程度的影响分层结果。</p><blockquote><p>观察方式： 谷歌浏览器 F12 打开控制台，右上角的 <strong>三个点</strong> 中的更多工具中有 Layers</p></blockquote><h3 id="「绘制」-paint" tabindex="-1"><a class="header-anchor" href="#「绘制」-paint"><span>「<strong>绘制</strong>」 Paint</span></a></h3><p><strong>主线程</strong> 会为 <strong>每个层</strong> 单独产生 「<strong>绘制指令集</strong>」，用于描述这一层的内容该如何画出来。</p><p>渲染主线程的工作到此为止，剩余步骤交给其他线程完成。</p><figure><img src="https://shaohui-jin.github.io/picx-images-hosting/blog/EventLoop/渲染主线程任务.3k7s23yr7b.webp" alt="" width="800" tabindex="0" loading="lazy"><figcaption>渲染主线程任务</figcaption></figure><h3 id="「分块」-tiling" tabindex="-1"><a class="header-anchor" href="#「分块」-tiling"><span>「<strong>分块</strong>」 Tiling</span></a></h3><p>主线程将 <strong>每个图层的绘制信息</strong> 提交给 <strong>合成线程</strong>，剩余工作将由合成线程完成。</p><p><strong>合成线程</strong> 首先对 <strong>每个图层</strong> 进行 <strong>分块</strong>，将其划分为更多的小区域。</p><p>它会从线程池中拿取多个线程来完成分块工作。</p><figure><img src="https://shaohui-jin.github.io/picx-images-hosting/blog/EventLoop/分块.8hg8w018nx.webp" alt="" width="800" tabindex="0" loading="lazy"><figcaption>分块</figcaption></figure><h3 id="「光栅化」-raster" tabindex="-1"><a class="header-anchor" href="#「光栅化」-raster"><span>「<strong>光栅化</strong>」 Raster</span></a></h3><p>合成线程会将块信息交给 <strong>GPU</strong> 进程，以极高的速度完成光栅化。</p><p><strong>GPU 进程</strong> 会开启 <strong>多个线程</strong> 来完成光栅化，并且优先处理靠近视口区域的块。</p><p>光栅化的结果，就是一块一块的位图。</p><figure><img src="https://shaohui-jin.github.io/picx-images-hosting/blog/EventLoop/光栅化.6m3o3ezhbp.webp" alt="" width="800" tabindex="0" loading="lazy"><figcaption>光栅化</figcaption></figure><h3 id="「画」-draw" tabindex="-1"><a class="header-anchor" href="#「画」-draw"><span>「<strong>画</strong>」 Draw</span></a></h3><p><strong>合成线程</strong> 拿到 每个层、每个块的位图 后，生成一个个 「<strong>指引(quad)</strong>」 信息。指引会标识出每个位图应该画到屏幕的哪个位置，以及会考虑到旋转、缩放等变形。</p><p><strong>变形发生</strong> 在 <strong>合成线程</strong>，与 <strong>渲染主线程</strong> 无关，这就是 <strong>transform</strong> 效率高的本质原因。</p><p>合成线程会把 「<strong>quad</strong>」 提交给 「<strong>GPU 进程</strong>」，由 GPU 进程产生系统调用，提交给 GPU 硬件，完成最终的屏幕成像。</p><figure><img src="https://shaohui-jin.github.io/picx-images-hosting/blog/EventLoop/画.4uap8jprpt.webp" alt="" width="800" tabindex="0" loading="lazy"><figcaption>画</figcaption></figure><h2 id="知识延伸" tabindex="-1"><a class="header-anchor" href="#知识延伸"><span>知识延伸</span></a></h2><h3 id="为何-script、meta等元素都是不显示的" tabindex="-1"><a class="header-anchor" href="#为何-script、meta等元素都是不显示的"><span>为何 Script、meta等元素都是不显示的</span></a></h3><p>在浏览器的默认样式中，默认了样式 <code>display: none</code></p><h3 id="css-属性值的计算过程" tabindex="-1"><a class="header-anchor" href="#css-属性值的计算过程"><span>CSS 属性值的计算过程</span></a></h3><ul><li>叠层</li><li>继承</li></ul><p>视觉格式化模型</p><ul><li>盒模型</li><li>包含块</li></ul><h3 id="什么是-reflow-重排" tabindex="-1"><a class="header-anchor" href="#什么是-reflow-重排"><span>什么是 reflow(重排)</span></a></h3><p>reflow 的本质就是 重新计算 <strong>layout 树</strong>。</p><p>当进行了会影响 <strong>布局树</strong> 的操作后，需要重新计算布局树，会引发 <strong>layout</strong>。</p><p>为了避免连续的多次操作导致布局树反复计算，浏览器会合并这些操作，当 JS 代码 <strong>全部完成后</strong> 再进行统一计算。 所以，改动属性造成的 <strong>reflow</strong> 是 <strong>异步</strong>完成的。</p><p>也同样因为如此，当 JS 获取布局属性时，<strong><code>就可能造成无法获取到最新的布局信息</code></strong>。</p><p>浏览器在反复权衡下，最终决定 <strong><code>获取属性立即 reflow</code></strong>。</p><h3 id="什么是-repaint-重绘" tabindex="-1"><a class="header-anchor" href="#什么是-repaint-重绘"><span>什么是 repaint(重绘)</span></a></h3><p>repaint 的本质就是重新根据 <strong>分层信息</strong> 计算了 <strong>绘制指令</strong>。</p><p>当改动了可见样式后，就需要重新计算，会引发repaint。</p><p>由于元素的 <strong>布局信息</strong> 也属于可见样式，所以 <strong><code>reflow 一定会引起 repaint</code></strong>。</p><h3 id="为什么-transform-的效率高" tabindex="-1"><a class="header-anchor" href="#为什么-transform-的效率高"><span>为什么 transform 的效率高</span></a></h3><p>因为 <strong>transform</strong> 既不会影响 <strong>布局</strong> 也不会影响 <strong>绘制指令</strong>，</p><p>它影响的只是 <strong>渲染流程</strong> 的 最后一个「<strong>draw</strong>」阶段由于 draw 阶段在 <strong>合成线程</strong> 中，所以 <strong>transform</strong> 的变化几乎不会影响 <strong>渲染主线程</strong>。</p><p>反之，渲染主线程无论如何忙碌，也不会影响 <strong>transform</strong> 的变化。</p>',66);function p(l,h){return n(),e("div",null,[s,o(" #region info "),a,o(" #endregion info "),g])}const u=i(r,[["render",p],["__file","index.html.vue"]]),b=JSON.parse('{"path":"/JavaScript/BrowserRenderingPrinciples/","title":"浏览器渲染原理","lang":"zh-CN","frontmatter":{"title":"浏览器渲染原理","lang":"zh-CN","date":"2024-03-27T16:04:31.000Z","permalink":"/JavaScript/BrowserRenderingPrinciples/","category":["JavaScript"],"tag":["JavaScript"],"description":"当浏览器的 「网络线程」 收到 「HTML 文档」后，会产生一个 渲染任务，并将其传递 「渲染主线程」 的消息队列。 在事件循环机制的作用下，渲染主线程取出消息队列中的渲染任务，开启渲染流程。 渲染时间点 渲染流水线 整个渲染流程分为多个阶段，分别是： HTML 解析、样式计算、布局、分层、绘制、分块、光栅化、画 每个阶段都有明确的输入输出，「上一个阶...","head":[["meta",{"property":"og:url","content":"https://shaohui-jin.github.io/JavaScript/BrowserRenderingPrinciples/"}],["meta",{"property":"og:title","content":"浏览器渲染原理"}],["meta",{"property":"og:description","content":"当浏览器的 「网络线程」 收到 「HTML 文档」后，会产生一个 渲染任务，并将其传递 「渲染主线程」 的消息队列。 在事件循环机制的作用下，渲染主线程取出消息队列中的渲染任务，开启渲染流程。 渲染时间点 渲染流水线 整个渲染流程分为多个阶段，分别是： HTML 解析、样式计算、布局、分层、绘制、分块、光栅化、画 每个阶段都有明确的输入输出，「上一个阶..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:image","content":"https://shaohui-jin.github.io/picx-images-hosting/blog/EventLoop/渲染时间点.1hrzbay7up.webp \\"渲染时间点\\" =800x"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2024-06-12T07:43:08.000Z"}],["meta",{"property":"article:author","content":"石怜安"}],["meta",{"property":"article:tag","content":"JavaScript"}],["meta",{"property":"article:published_time","content":"2024-03-27T16:04:31.000Z"}],["meta",{"property":"article:modified_time","content":"2024-06-12T07:43:08.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"浏览器渲染原理\\",\\"image\\":[\\"https://shaohui-jin.github.io/picx-images-hosting/blog/EventLoop/渲染时间点.1hrzbay7up.webp \\\\\\"渲染时间点\\\\\\" =800x\\",\\"https://shaohui-jin.github.io/picx-images-hosting/blog/EventLoop/渲染流水线.41xtnyj74g.webp \\\\\\"渲染流水线\\\\\\" =800x\\",\\"https://shaohui-jin.github.io/picx-images-hosting/blog/EventLoop/预解析CSS.969ifq9lxi.webp \\\\\\"预解析CSS\\\\\\" =800x\\",\\"https://shaohui-jin.github.io/picx-images-hosting/blog/EventLoop/预解析JS.5fkcuhgqjb.webp \\\\\\"预解析JS\\\\\\" =800x\\",\\"https://shaohui-jin.github.io/picx-images-hosting/blog/EventLoop/Document-Object-Model.7zq74q3yr3.webp \\\\\\"Document-Object-Model\\\\\\" =800x\\",\\"https://shaohui-jin.github.io/picx-images-hosting/blog/EventLoop/CSS-Object-Model.2a4ut48dpd.webp \\\\\\"CSS-Object-Model\\\\\\" =800x\\",\\"https://shaohui-jin.github.io/picx-images-hosting/blog/EventLoop/样式计算.3nrdzlzvb8.webp \\\\\\"样式计算\\\\\\" =800x\\",\\"https://shaohui-jin.github.io/picx-images-hosting/blog/EventLoop/布局(DOM转Layout\\",\\"https://shaohui-jin.github.io/picx-images-hosting/blog/EventLoop/渲染主线程任务.3k7s23yr7b.webp \\\\\\"渲染主线程任务\\\\\\" =800x\\",\\"https://shaohui-jin.github.io/picx-images-hosting/blog/EventLoop/分块.8hg8w018nx.webp \\\\\\"分块\\\\\\" =800x\\",\\"https://shaohui-jin.github.io/picx-images-hosting/blog/EventLoop/光栅化.6m3o3ezhbp.webp \\\\\\"光栅化\\\\\\" =800x\\",\\"https://shaohui-jin.github.io/picx-images-hosting/blog/EventLoop/画.4uap8jprpt.webp \\\\\\"画\\\\\\" =800x\\"],\\"datePublished\\":\\"2024-03-27T16:04:31.000Z\\",\\"dateModified\\":\\"2024-06-12T07:43:08.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"石怜安\\",\\"url\\":\\"https://shaohui-jin.github.io\\"}]}"]]},"headers":[{"level":2,"title":"渲染流水线","slug":"渲染流水线","link":"#渲染流水线","children":[{"level":3,"title":"「解析 HTML」 Parse HTML","slug":"「解析-html」-parse-html","link":"#「解析-html」-parse-html","children":[]},{"level":3,"title":"「样式计算」 Recalculate Style","slug":"「样式计算」-recalculate-style","link":"#「样式计算」-recalculate-style","children":[]},{"level":3,"title":"「布局」 Layout","slug":"「布局」-layout","link":"#「布局」-layout","children":[]},{"level":3,"title":"「分层」 Layer","slug":"「分层」-layer","link":"#「分层」-layer","children":[]},{"level":3,"title":"「绘制」 Paint","slug":"「绘制」-paint","link":"#「绘制」-paint","children":[]},{"level":3,"title":"「分块」 Tiling","slug":"「分块」-tiling","link":"#「分块」-tiling","children":[]},{"level":3,"title":"「光栅化」 Raster","slug":"「光栅化」-raster","link":"#「光栅化」-raster","children":[]},{"level":3,"title":"「画」 Draw","slug":"「画」-draw","link":"#「画」-draw","children":[]}]},{"level":2,"title":"知识延伸","slug":"知识延伸","link":"#知识延伸","children":[{"level":3,"title":"为何 Script、meta等元素都是不显示的","slug":"为何-script、meta等元素都是不显示的","link":"#为何-script、meta等元素都是不显示的","children":[]},{"level":3,"title":"CSS 属性值的计算过程","slug":"css-属性值的计算过程","link":"#css-属性值的计算过程","children":[]},{"level":3,"title":"什么是 reflow(重排)","slug":"什么是-reflow-重排","link":"#什么是-reflow-重排","children":[]},{"level":3,"title":"什么是 repaint(重绘)","slug":"什么是-repaint-重绘","link":"#什么是-repaint-重绘","children":[]},{"level":3,"title":"为什么 transform 的效率高","slug":"为什么-transform-的效率高","link":"#为什么-transform-的效率高","children":[]}]}],"git":{"createdTime":1714290599000,"updatedTime":1718178188000,"contributors":[{"name":"shaohui_jin","email":"1051131737@qq.com","commits":2}]},"readingTime":{"minutes":5.75,"words":1726},"filePathRelative":"zh/JavaScript/浏览器/浏览器渲染原理.md","localizedDate":"2024年3月27日","excerpt":"<p>当浏览器的 「<strong>网络线程</strong>」 收到 「<strong>HTML 文档</strong>」后，会产生一个 <strong>渲染任务</strong>，并将其传递 「<strong>渲染主线程</strong>」 的消息队列。</p>\\n<p>在事件循环机制的作用下，渲染主线程取出消息队列中的渲染任务，开启渲染流程。</p>\\n<figure><img src=\\"https://shaohui-jin.github.io/picx-images-hosting/blog/EventLoop/渲染时间点.1hrzbay7up.webp\\" alt=\\"\\" width=\\"800\\" tabindex=\\"0\\" loading=\\"lazy\\"><figcaption>渲染时间点</figcaption></figure>","autoDesc":true}');export{u as comp,b as data};
