<script setup lang="ts">
import {
  computed,
  createVNode,
  getCurrentInstance,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  render,
  watch,
} from "vue";
import type { Component } from "vue";
import CodeBlock from "@/works/comp/component/basic/code-block/CodeBlock.vue";
import DocApiTable from "@/works/comp/doc/demo/ApiTable.vue";
import CompDocPreview from "./CompDocPreview.vue";
import { renderMarkdown } from "./createMarkdownEngine";
import DemoPlayground from "./DemoPlayground.vue";
import DemoHtml from "./DemoHtml.vue";
import MermaidBlock from "./MermaidBlock.vue";
import Callout from "./Callout.vue";

const props = withDefaults(
  defineProps<{
    source: string;
    apiTable?: boolean;
  }>(),
  {
    source: "",
    apiTable: false,
  },
);

const rendered = computed(() => renderMarkdown(props.source, { apiTable: props.apiTable }));
const host = ref<HTMLElement | null>(null);
const instance = getCurrentInstance();
const mountedTargets: HTMLElement[] = [];

/** 已挂载的占位，避免重复 mount */
const mountedIds = new Set<string>();

let observer: IntersectionObserver | null = null;

function unmountDemos(): void {
  while (mountedTargets.length) {
    const el = mountedTargets.pop();
    if (el) render(null, el);
  }
  mountedIds.clear();
}

/** 复用当前应用上下文挂载，el-* 与 globalProperties 无需重复安装 */
function mountVNode(
  component: Component,
  vnodeProps: Record<string, unknown>,
  el: HTMLElement,
): void {
  const vnode = createVNode(component, vnodeProps);
  vnode.appContext = instance?.appContext ?? null;
  render(vnode, el);
  mountedTargets.push(el);
}

function pickComponent(kind: string) {
  if (kind === "mermaid") return MermaidBlock;
  if (kind === "html") return DemoHtml;
  return DemoPlayground;
}

function mountOne(el: HTMLElement, demoIndex: number): void {
  const demo = rendered.value.demos[demoIndex];
  if (!demo || mountedIds.has(demo.id)) return;
  mountedIds.add(demo.id);
  mountVNode(pickComponent(demo.kind), { demo }, el);
}

function mountCallouts(root: HTMLElement): void {
  let pending = true;
  while (pending) {
    pending = false;
    root.querySelectorAll<HTMLElement>("[data-callout-index]").forEach((el) => {
      const key = `callout:${el.dataset.calloutIndex ?? ""}`;
      if (mountedIds.has(key)) return;
      const callout = rendered.value.callouts[Number(el.dataset.calloutIndex)];
      if (!callout) return;
      mountedIds.add(key);
      mountVNode(Callout, { name: callout.name, title: callout.title, html: callout.html }, el);
      pending = true;
    });
  }
}

function mountCodes(root: HTMLElement): void {
  root.querySelectorAll<HTMLElement>("[data-code-index]").forEach((el) => {
    const key = `code:${el.dataset.codeIndex ?? ""}`;
    if (mountedIds.has(key)) return;
    const fence = rendered.value.fences[Number(el.dataset.codeIndex)];
    if (!fence) return;
    mountedIds.add(key);
    mountVNode(
      CodeBlock,
      {
        code: fence.code,
        lang: fence.lang,
        highlightLines: fence.highlightLines,
      },
      el,
    );
  });
}

function mountApiTables(root: HTMLElement): void {
  root.querySelectorAll<HTMLElement>("[data-api-index]").forEach((el) => {
    const key = `api:${el.dataset.apiIndex ?? ""}`;
    if (mountedIds.has(key)) return;
    const table = rendered.value.apiTables[Number(el.dataset.apiIndex)];
    if (!table) return;
    mountedIds.add(key);
    mountVNode(DocApiTable, { type: table.kind, rows: table.rows }, el);
  });
}

function mountPreviews(root: HTMLElement): void {
  root.querySelectorAll<HTMLElement>("[data-preview-index]").forEach((el) => {
    const key = `preview:${el.dataset.previewIndex ?? ""}`;
    if (mountedIds.has(key)) return;
    const preview = rendered.value.previews[Number(el.dataset.previewIndex)];
    if (!preview) return;
    mountedIds.add(key);
    mountVNode(CompDocPreview, { previewKey: preview.key, code: preview.code }, el);
  });
}

/**
 * 懒挂载：一篇 42 个 demo 的文章会创建 42 个 iframe，每个都要拉 Vue 运行时，
 * 一次性全挂会把首屏拖到十几秒。这里用 IntersectionObserver 提前 600px 挂载，
 * 既保证滚动到附近时已经就绪，又不让不可见的 demo 占用资源。
 */
function getObserver(): IntersectionObserver {
  if (!observer) {
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          observer?.unobserve(el);
          const index = Number(el.dataset.demoIndex);
          if (Number.isNaN(index)) continue;
          mountOne(el, index);
        }
      },
      { rootMargin: "600px 0px" },
    );
  }
  return observer;
}

async function mountDemos(): Promise<void> {
  await nextTick();
  const root = host.value;
  if (!root) return;

  mountCallouts(root);
  mountCodes(root);
  mountApiTables(root);
  mountPreviews(root);

  const placeholders = root.querySelectorAll<HTMLElement>("[data-demo-id]");

  // 没有 IntersectionObserver 时降级为全部立即挂载
  if (typeof IntersectionObserver === "undefined") {
    placeholders.forEach((el) => {
      const index = Number(el.dataset.demoIndex);
      if (!Number.isNaN(index)) mountOne(el, index);
    });
    return;
  }

  const io = getObserver();
  placeholders.forEach((el) => io.observe(el));
}

watch(
  () => props.source,
  () => {
    observer?.disconnect();
    unmountDemos();
    void mountDemos();
  },
  { flush: "pre" },
);

onMounted(() => {
  void mountDemos();
});

onBeforeUnmount(() => {
  observer?.disconnect();
  observer = null;
  unmountDemos();
});
</script>

<template>
  <article class="markdown-body">
    <div ref="host" class="markdown-body__content" v-html="rendered.html" />
  </article>
</template>

<style scoped lang="scss">
@use "../styles/site/variables" as *;

// ============================================================
// 字号映射（全部取自设计令牌）
// 想整体调整正文大小只改 $md-fs，标题与行内元素会跟着走
// ============================================================
$md-fs: $doc-fs-base; // 14 正文
$md-fs-h1: $doc-fs-xl; // 20
$md-fs-h2: $doc-fs-lg; // 17
$md-fs-h3: $doc-fs-md; // 15
$md-fs-h4: $md-fs; // 14
$md-fs-h5: $md-fs; // 14
$md-fs-h6: $doc-fs-sm; // 13

// 块级节奏：p / pre / 表格 / 引用 / callout / demo / mermaid 统一 12px
$md-block-gap: $doc-sp-md;

.markdown-body {
  font-size: $md-fs;
  line-height: 1.75;
  color: $doc-text-primary;
}

.markdown-body__content {
  // 首尾元素去掉多余外边距，避免容器顶部/底部空出一条
  > :first-child {
    margin-top: 0;
  }

  > :last-child {
    margin-bottom: 0;
  }
}

// ---------- 标题 ----------
.markdown-body :deep(h1),
.markdown-body :deep(h2),
.markdown-body :deep(h3),
.markdown-body :deep(h4),
.markdown-body :deep(h5),
.markdown-body :deep(h6) {
  color: $doc-text-heading;
  line-height: 1.4;
  font-weight: 600;
  scroll-margin-top: $doc-sp-lg;
}

.markdown-body :deep(h1) {
  margin: $doc-sp-2xl 0 $doc-sp-md;
  font-size: $md-fs-h1;
}

.markdown-body :deep(h2) {
  margin: $doc-sp-xl 0 $doc-sp-sm;
  font-size: $md-fs-h2;
}

.markdown-body :deep(h3) {
  margin: $doc-sp-lg 0 $doc-sp-sm;
  font-size: $md-fs-h3;
}

.markdown-body :deep(h4) {
  margin: $doc-sp-lg 0 $doc-sp-xs;
  font-size: $md-fs-h4;
}

.markdown-body :deep(h5) {
  margin: $doc-sp-md 0 $doc-sp-xs;
  font-size: $md-fs-h5;
}

.markdown-body :deep(h6) {
  margin: $doc-sp-md 0 $doc-sp-xs;
  font-size: $md-fs-h6;
  font-weight: 500;
  color: $doc-text-secondary;
}

// ---------- 段落与列表 ----------
.markdown-body :deep(p) {
  margin: $md-block-gap 0;
}

.markdown-body :deep(ul),
.markdown-body :deep(ol) {
  margin: $md-block-gap 0;
  padding-left: $doc-sp-xl;
}

.markdown-body :deep(li) {
  margin: $doc-sp-xs 0;
}

.markdown-body :deep(li > ul),
.markdown-body :deep(li > ol) {
  margin: $doc-sp-xs 0;
}

// ---------- 链接 ----------
.markdown-body :deep(a) {
  color: $doc-color-primary;
  text-decoration: none;
}

.markdown-body :deep(a:hover) {
  text-decoration: underline;
}

// ---------- 代码 ----------
.markdown-body :deep(pre:not(.code-block)) {
  margin: $md-block-gap 0;
  padding: $doc-sp-md;
  overflow: auto;
  background: $doc-bg-subtle;
  border: 1px solid $doc-border-color;
  border-radius: $doc-radius-lg;
}

.markdown-body :deep(pre:not(.code-block) code) {
  padding: 0;
  background: transparent;
}

.markdown-body :deep(.code-block code) {
  padding: 0;
  background: transparent;
  border-radius: 0;
  font-size: inherit;
}

.markdown-body :deep(.vp-code-slot),
.markdown-body :deep(.vp-api-slot),
.markdown-body :deep(.vp-preview-slot) {
  margin: $md-block-gap 0;
}

.markdown-body :deep(code) {
  padding: 1px $doc-sp-xs;
  font-family: $doc-font-mono;
  font-size: $doc-fs-sm;
  background: $doc-bg-subtle;
  border-radius: $doc-radius-sm;
}

// ---------- 引用 ----------
.markdown-body :deep(blockquote) {
  margin: $md-block-gap 0;
  padding: $doc-sp-sm $doc-sp-md;
  border-left: 3px solid $doc-color-primary;
  border-radius: 0 $doc-radius-lg $doc-radius-lg 0;
  background: $doc-bg-subtle;
  color: $doc-text-secondary;
}

.markdown-body :deep(blockquote p) {
  margin: $doc-sp-xs 0;
}

// ---------- 图片 ----------
.markdown-body :deep(img) {
  max-width: 100%;
  height: auto;
}

// ---------- 表格（外层 .vp-table-wrap 由引擎注入） ----------
.markdown-body :deep(.vp-table-wrap) {
  margin: $md-block-gap 0;
  overflow-x: auto;
}

.markdown-body :deep(table) {
  width: 100%;
  margin: 0;
  border-collapse: collapse;
  font-size: $doc-fs-sm;
}

.markdown-body :deep(th),
.markdown-body :deep(td) {
  padding: $doc-sp-sm $doc-sp-md;
  border: 1px solid $doc-border-color;
  text-align: left;
}

.markdown-body :deep(th) {
  background: $doc-bg-subtle;
  font-weight: 500;
}

// ---------- 分割线 ----------
.markdown-body :deep(hr) {
  margin: $doc-sp-2xl 0;
  border: 0;
  border-top: 1px solid $doc-border-color;
}

// ---------- 行内标记 ----------
.markdown-body :deep(mark) {
  padding: 0 2px;
  background: #fff3b0;
}

.markdown-body :deep(.vp-badge) {
  display: inline-block;
  margin-right: $doc-sp-xs;
  padding: 0 $doc-sp-sm;
  font-size: $doc-fs-xs;
  line-height: 1.5;
  color: #fff;
  background: $doc-color-primary;
  border-radius: $doc-radius-sm;
  vertical-align: middle;
}

.markdown-body :deep(.vp-badge--tip),
.markdown-body :deep(.vp-badge--success) {
  background: $doc-color-success;
}

.markdown-body :deep(.vp-badge--warning) {
  background: $doc-color-warning;
}

.markdown-body :deep(.vp-badge--danger) {
  background: #f56c6c;
}

// ---------- 脚注 ----------
.markdown-body :deep(.vp-footnote-ref) {
  font-size: 0.75em;
  line-height: 0;
}

.markdown-body :deep(.vp-footnotes) {
  margin-top: $doc-sp-2xl;
  padding-top: $doc-sp-md;
  border-top: 1px solid $doc-border-color;
  font-size: $doc-fs-sm;
  color: $doc-text-secondary;
}

.markdown-body :deep(.vp-footnotes ol) {
  margin: 0;
  padding-left: $doc-sp-xl;
}

.markdown-body :deep(.vp-footnote-back) {
  margin-left: $doc-sp-xs;
}

// ---------- 懒挂载前的占位 ----------
// 按类型给最小高度，尽量贴近挂载后的实际高度，避免滚动时布局跳动
.markdown-body :deep([data-demo-kind="sfc"]),
.markdown-body :deep([data-demo-kind="playground"]),
.markdown-body :deep([data-demo-kind="html"]) {
  min-height: 386px;
}

.markdown-body :deep([data-demo-kind="mermaid"]) {
  min-height: 120px;
}

// 已挂载后取消最小高度，否则占位比实际内容高会留出空白
.markdown-body :deep([data-demo-kind]:has(> *)) {
  min-height: 0;
}
</style>
