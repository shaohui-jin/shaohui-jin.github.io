<script setup lang="ts">
/**
 * Hero 右侧的终端窗口。
 *
 * 用「跑两条命令」的形式展示个人信息：
 *   cat profile.json  → 职位 / 关注方向 / 技术栈
 *   ls projects/      → 项目列表
 *
 * 为什么用终端而不是普通卡片：这些内容本来就是结构化数据，
 * 用命令输出的形式呈现，比堆一行行标签更贴合「工程师」的身份，
 * 也省掉了图标、分隔线之类的装饰。
 */
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { homeProfile, homeProjects } from "../homeData";

const props = defineProps<{
  /** 文章总数，与 Hero 的「N 篇文章」同源 */
  articles: number;
}>();

/** 项目名列表：排除「更多项目」占位卡，最多取 6 个，避免终端过长 */
const projectNames = computed(() =>
  homeProjects
    .filter((p) => !p.placeholder)
    .slice(0, 6)
    .map((p) => p.name),
);

/**
 * profile.json 的内容由数据生成，不手写字符串。
 *
 * 为什么不用 `JSON.stringify(obj, null, 2)`：那个缩进参数对数组同样生效，
 * 会把 focus / stack 展开成十几行，终端里显得又长又空。
 * 所以这里手写序列化 —— 对象按行拆开，数组保持单行内联。
 *
 * 返回 string[] 而不是带 \n 的字符串，调用处就不必再 split。
 */
const inlineArray = (items: string[]) => `[${items.map((v) => JSON.stringify(v)).join(", ")}]`;

const profileJson = computed<string[]>(() => [
  "{",
  `  "role": ${JSON.stringify(homeProfile.role)},`,
  `  "focus": ${inlineArray(homeProfile.focus ?? [])},`,
  // 最后一项不带逗号，JSON 语法要求
  `  "stack": ${inlineArray(homeProfile.stack ?? [])}`,
  "}",
]);

/**
 * 终端脚本：一行一个条目。
 * JSON 行拆成若干分段，键名与值分别着色（不用正则扫高亮，
 * 而是在生成脚本时就切好段，避免运行时再解析）。
 */
interface Seg {
  text: string;
  /** key：琥珀色；val：正文色；punct：标点与括号的暗色 */
  tone?: "key" | "val" | "punct";
}

interface Line {
  segs: Seg[];
  cls?: "prompt" | "output";
}

/** 把一行 JSON 切成 `<缩进> "key": value` 的分段 */
function splitJsonLine(raw: string): Seg[] {
  const m = /^(\s*)("([^"]+)")(\s*:\s*)(.*)$/.exec(raw);
  if (!m) return [{ text: raw, tone: "punct" }];
  const [, indent, keyRaw, , colon, rest] = m;
  const segs: Seg[] = [{ text: indent + keyRaw, tone: "key" }];
  segs.push({ text: colon, tone: "punct" });
  segs.push({ text: rest, tone: "val" });
  return segs;
}

const script = computed<Line[]>(() => {
  const lines: Line[] = [];

  // ── 第一段：cat profile.json ──
  lines.push({ segs: [{ text: "cat profile.json" }], cls: "prompt" });
  for (const raw of profileJson.value) {
    lines.push({ segs: splitJsonLine(raw) });
  }

  // ── 第二段：ls projects/ ──
  lines.push({ segs: [{ text: "ls projects/" }], cls: "prompt" });
  // 两行铺开，最多 3 个一行，和真实 ls 的观感接近
  for (let i = 0; i < projectNames.value.length; i += 3) {
    lines.push({ segs: [{ text: projectNames.value.slice(i, i + 3).join("   ") }] });
  }

  return lines;
});

/** 已渲染的行（打字过程中逐行增长） */
const rendered = ref<Array<{ segs: Seg[]; cls?: Line["cls"] }>>([]);
const done = ref(false);

const CHARS_PER_FRAME = 3;
let raf = 0;
let cancelled = false;

/** 把一行按字符数截断，保持分段结构 */
function cutLine(line: Line, limit: number): Seg[] {
  let left = limit;
  const out: Seg[] = [];
  for (const seg of line.segs) {
    if (left <= 0) break;
    const piece = seg.text.slice(0, left);
    left -= piece.length;
    out.push({ text: piece, tone: seg.tone });
  }
  return out;
}

function lineLength(line: Line): number {
  return line.segs.reduce((n, s) => n + s.text.length, 0);
}

function play(): void {
  const all = script.value;
  let lineIdx = 0;
  let charIdx = 0;

  const tick = () => {
    if (cancelled) return;

    const line = all[lineIdx];
    if (!line) {
      done.value = true;
      return;
    }

    const total = lineLength(line);
    charIdx = Math.min(total, charIdx + CHARS_PER_FRAME);
    // 把「已完成的整行」+「当前行的前 charIdx 个字符」一起渲染
    rendered.value = [...all.slice(0, lineIdx), { segs: cutLine(line, charIdx), cls: line.cls }];

    if (charIdx < total) {
      raf = requestAnimationFrame(tick);
      return;
    }

    lineIdx += 1;
    charIdx = 0;
    // 行与行之间留一点停顿，看起来像真在敲
    raf = requestAnimationFrame(() => {
      if (!cancelled) raf = requestAnimationFrame(tick);
    });
  };

  raf = requestAnimationFrame(tick);
}

onMounted(() => {
  // 系统开了「减少动态效果」就直接铺满，不做打字机
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) {
    rendered.value = script.value;
    done.value = true;
    return;
  }
  play();
});

onBeforeUnmount(() => {
  cancelled = true;
  cancelAnimationFrame(raf);
});
</script>

<template>
  <div
    class="term"
    role="img"
    :aria-label="`终端窗口：展示${homeProfile.name}的职位、方向与技术栈`"
  >
    <div class="term__bar">
      <span class="term__dot" />
      <span class="term__dot" />
      <span class="term__dot" />
      <span class="term__name">~/wuqi — zsh</span>
    </div>

    <div class="term__body">
      <div
        v-for="(line, i) in rendered"
        :key="i"
        class="term__line"
        :class="line.cls ? `term__line--${line.cls}` : undefined"
      >
        <template v-if="line.cls === 'prompt'">
          <span class="term__ps">$</span>
          <span class="term__cmd">{{ line.segs[0]?.text }}</span>
        </template>
        <template v-else>
          <span
            v-for="(seg, j) in line.segs"
            :key="j"
            :class="seg.tone ? `term__seg--${seg.tone}` : undefined"
            >{{ seg.text }}</span
          >
        </template>
      </div>

      <!-- 光标：跑完常亮，未完成时跟在最后一行 -->
      <div class="term__line term__line--cursor">
        <span class="term__ps">$</span>
        <span class="term__caret" :class="{ 'is-idle': done }" />
      </div>
    </div>

    <p class="term__meta">
      <b>{{ props.articles }}</b> 篇文章 · {{ projectNames.length }} 个仓库
    </p>
  </div>
</template>

<style scoped lang="scss">
.term {
  --term-bg: rgb(13 17 23 / 88%);
  --term-bar: rgb(255 255 255 / 5%);
  --term-border: rgb(255 255 255 / 12%);
  --term-text: rgb(232 235 240 / 92%);
  --term-dim: rgb(255 255 255 / 40%);
  --term-green: #6fdd97;
  --term-blue: #7bbcff;
  --term-amber: #ecc463;

  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid var(--term-border);
  border-radius: 10px;
  background: var(--term-bg);
  box-shadow:
    0 1px 0 rgb(255 255 255 / 6%) inset,
    0 30px 60px -32px rgb(0 0 0 / 85%);
  font-family: var(--doc-font-mono);
  font-size: 12.5px;
  line-height: 1.75;

  @supports (backdrop-filter: blur(1px)) {
    backdrop-filter: blur(18px) saturate(140%);
    background: rgb(13 17 23 / 74%);
  }
}

.term__bar {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 9px 13px;
  border-bottom: 1px solid var(--term-border);
  background: var(--term-bar);
}

.term__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgb(255 255 255 / 16%);
}

.term__name {
  margin-left: 8px;
  color: var(--term-dim);
  font-size: 10.5px;
  letter-spacing: 0.02em;
}

.term__body {
  flex: 1;
  min-height: 0;
  padding: 14px 16px;
  overflow-x: auto;
}

.term__line {
  color: var(--term-text);
  white-space: pre;
}

.term__ps {
  margin-right: 8px;
  color: var(--term-green);
  user-select: none;
}

.term__cmd {
  color: var(--term-blue);
}

.term__seg--key {
  color: var(--term-amber);
}

.term__seg--val {
  color: var(--term-text);
}

.term__seg--punct {
  color: var(--term-dim);
}

.term__line--prompt {
  margin-top: 6px;

  &:first-child {
    margin-top: 0;
  }
}

.term__line--cursor {
  display: flex;
  align-items: center;
  margin-top: 4px;
}

.term__caret {
  display: inline-block;
  width: 7px;
  height: 14px;
  margin-left: 2px;
  background: var(--term-text);
  animation: term-blink 1.1s steps(1, end) infinite;

  &.is-idle {
    opacity: 0.85;
  }
}

@keyframes term-blink {
  50% {
    opacity: 0;
  }
}

.term__meta {
  padding: 9px 16px 11px;
  border-top: 1px solid var(--term-border);
  color: var(--term-dim);
  font-size: 10.5px;
  letter-spacing: 0.03em;

  b {
    color: var(--term-green);
    font-weight: 600;
    font-variant-numeric: tabular-nums;
  }
}

@media (width <= 768px) {
  .term {
    font-size: 11px;
  }

  .term__body {
    padding: 12px 13px;
  }
}
</style>
