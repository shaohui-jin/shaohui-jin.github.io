<script setup lang="ts">
import { ElButton, ElMessage } from "element-plus";
import { DocumentCopy } from "@element-plus/icons-vue";

defineOptions({ name: "CodeBlock" });

defineProps<{
  /** 需要复制的原始代码文本 */
  code: string;
  /** 经 highlight 处理后的 HTML（若不传则直接展示 code） */
  highlighted?: string;
}>();

async function copyCode(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    ElMessage.success("已复制到剪贴板");
  } catch {
    ElMessage.error("复制失败，请手动选择复制");
  }
}
</script>

<template>
  <div class="code-block__wrap">
    <ElButton
      class="code-block__copy"
      size="small"
      text
      :icon="DocumentCopy"
      @click="copyCode(code)"
    >
      复制
    </ElButton>
    <pre class="code-block"><code v-html="highlighted ?? code" /></pre>
  </div>
</template>

<style scoped lang="scss">
@use "@/style/variables" as *;

.code-block {
  --cb-bg: var(--code-block-bg, var(--comp-bg-subtle, transparent));
  --cb-text: var(--code-block-text, var(--comp-text-primary, #1f2328));
  --cb-radius: var(--code-block-radius, #{$lib-radius-sm});
  --cb-font: var(--code-block-font, "SFMono-Regular", consolas, "Liberation Mono", menlo, monospace);
  --cb-font-size: var(--code-block-font-size, #{$lib-font-size-sm});

  margin: 0;
  padding: 12px 16px;
  overflow: auto;
  background: var(--cb-bg);
  border-radius: var(--cb-radius);
  font-family: var(--cb-font);
  font-size: var(--cb-font-size);
  line-height: 1.7;
  color: var(--cb-text);
  white-space: pre-wrap;
  word-break: break-word;
}

.code-block__wrap {
  position: relative;
}

.code-block__copy {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 1;
  min-height: 32px;
  padding: 4px 8px;
  color: var(--code-block-copy-color, var(--comp-text-regular, #606266));
  background: color-mix(in srgb, var(--cb-bg) 92%, transparent);
  backdrop-filter: blur(4px);

  &:hover {
    color: var(--el-color-primary, #409eff);
  }
}

.code-block :deep(code) {
  display: block;
  padding: 0;
  background: transparent;
  color: inherit;
  font-family: inherit;
  font-size: inherit;
  line-height: inherit;
  white-space: pre-wrap;
  word-break: break-word;
}
</style>

<style lang="scss">
.code-block .hljs-tag,
.code-block .hljs-name {
  color: var(--el-color-primary, #409eff);
}

.code-block .hljs-attr {
  color: var(--code-block-text, var(--comp-text-primary, #1f2328));
}

.code-block .hljs-string {
  color: var(--el-color-success, #67c23a);
}

.code-block .hljs-keyword {
  color: var(--el-color-warning, #e6a23c);
}

.code-block .hljs-comment {
  color: var(--code-block-comment, var(--comp-text-secondary, #909399));
}

.code-block :deep(.hljs),
.code-block :deep(code.hljs) {
  background: transparent;
  color: inherit;
}

.code-block .hljs-number {
  color: #b5695a;
}

.code-block .hljs-title,
.code-block .hljs-function {
  color: var(--el-color-primary, #409eff);
}

.code-block .hljs-type,
.code-block .hljs-built_in {
  color: #c97016;
}
</style>
