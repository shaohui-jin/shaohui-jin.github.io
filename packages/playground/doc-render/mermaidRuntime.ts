/**
 * mermaid 渲染运行时
 *
 * 为什么单独成文件：`<script setup>` 里的顶层代码会随每个组件实例重新执行，
 * 放在组件里会导致序号自增失效（多个块拿到相同 id）和串行队列失效。
 * mermaid.render 依赖全局配置 + body 上的临时容器，id 冲突或并发调用都会炸，
 * 所以序号与队列必须放在模块作用域（全局唯一）。
 */

const CONFIG = {
  startOnLoad: false,
  securityLevel: "strict" as const,
  theme: "base" as const,
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif',
  themeVariables: {
    primaryColor: "#eef2ff",
    primaryTextColor: "#1f2328",
    primaryBorderColor: "#a5b4fc",
    secondaryColor: "#f8fafc",
    tertiaryColor: "#ffffff",
    lineColor: "#94a3b8",
    textColor: "#1f2328",
    fontSize: "14px",
  },
  flowchart: { useMaxWidth: true, curve: "basis" as const },
};

let seq = 0;
let chain: Promise<unknown> = Promise.resolve();

/** 串行执行：mermaid 是全局状态机，并发 render 会互相破坏 */
function enqueue<T>(task: () => Promise<T>): Promise<T> {
  const next = chain.then(task, task);
  chain = next.catch(() => undefined);
  return next;
}

/**
 * 把 mermaid 源码渲染成 SVG 字符串。
 * 同一页面多个图表会按调用顺序依次渲染，可安全并发调用。
 */
export function renderMermaid(code: string): Promise<string> {
  const id = `vp-mermaid-${(seq += 1)}`;

  return enqueue(async () => {
    try {
      // 懒加载：只有页面里真的出现 mermaid 图时才拉这个 500KB+ 的依赖
      const mermaid = (await import("mermaid")).default;
      mermaid.initialize(CONFIG);
      const { svg } = await mermaid.render(id, code);
      return svg;
    } finally {
      // 渲染异常时 mermaid 会在 body 残留临时容器，兜底清掉
      document.getElementById(`d${id}`)?.remove();
      document.getElementById(id)?.remove();
    }
  });
}
