<script setup lang="ts">
import { computed, ref, useSlots } from "vue";
import { ElButton, ElMessage, ElTabPane, ElTabs } from "element-plus";
import { DocumentCopy } from "@element-plus/icons-vue";
import { highlightDemoCode } from "./demoCodeHighlight";

const props = withDefaults(
  defineProps<{
    /** 代码 Tab 展示的示例代码 */
    code: string;
    /** 预览区是否贴边（padding: 0） */
    flush?: boolean;
  }>(),
  {
    flush: false,
  },
);

const slots = useSlots();
const tab = ref<"preview" | "code">("preview");

const highlightedCode = computed(() => highlightDemoCode(props.code));

async function copyCode() {
  try {
    await navigator.clipboard.writeText(props.code);
    ElMessage.success("已复制到剪贴板");
  } catch {
    ElMessage.error("复制失败，请手动选择复制");
  }
}
</script>

<template>
  <ElTabs v-model="tab" type="border-card" class="demo-widget-tabs">
    <ElTabPane label="预览" name="preview">
      <div class="demo-widget-tabs__body" :class="{ 'demo-widget-tabs__body--flush': flush }">
        <slot />
      </div>
      <div v-if="slots.footer" class="demo-widget-tabs__footer">
        <slot name="footer" />
      </div>
    </ElTabPane>

    <ElTabPane label="代码" name="code" lazy>
      <div class="demo-widget-tabs__body demo-widget-tabs__body--code">
        <div class="demo-code-block__wrap">
          <ElButton
            class="demo-code-block__copy"
            size="small"
            text
            :icon="DocumentCopy"
            @click="copyCode"
          >
            复制
          </ElButton>
          <pre class="demo-code-block"><code class="hljs language-xml" v-html="highlightedCode" /></pre>
        </div>
      </div>
    </ElTabPane>
  </ElTabs>
</template>

<style scoped lang="scss">
@use "./variables" as *;
@use "./el-overrides" as ep;

.demo-widget-tabs {
  @include ep.el-tabs-border-card;
}

.demo-widget-tabs__body {
  padding: $doc-sp-xl $doc-sp-lg;

  &--flush {
    padding: 0;
  }

  &--code {
    padding-top: $doc-sp-md;
    padding-bottom: $doc-sp-md;
  }
}

.demo-widget-tabs__footer {
  padding: 0 $doc-sp-lg $doc-sp-xl;
  border-top: 1px solid $doc-border-light;

  :deep(.widget-hint) {
    margin: $doc-sp-md 0 0;
  }
}

@media (max-width: $doc-bp-mobile) {
  .demo-widget-tabs :deep(.el-tabs__item) {
    min-height: 36px;
  }
}
</style>

<!-- highlight.js 注入的 span 无 scoped 标记，hljs 样式须全局 -->
<style lang="scss">
@use "./variables" as *;

.demo-widget-tabs .demo-code-block {
  margin: 0;
  padding: $doc-sp-md $doc-sp-lg;
  overflow: auto;
  background: $doc-bg-subtle;
  border-radius: $doc-radius-sm;
  font-family: $doc-font-mono;
  font-size: $doc-fs-xs;
  line-height: 1.7;
  color: $doc-text-primary;
  white-space: pre-wrap;
  word-break: break-word;
}

.demo-widget-tabs .demo-code-block__wrap {
  position: relative;
}

.demo-widget-tabs .demo-code-block__copy {
  position: absolute;
  top: $doc-sp-sm;
  right: $doc-sp-sm;
  z-index: 1;
  min-height: 32px;
  padding: 4px 8px;
  color: $doc-text-regular;
  background: color-mix(in srgb, #{$doc-bg-card} 92%, transparent);
  backdrop-filter: blur(4px);

  &:hover {
    color: $doc-color-primary;
  }
}

.demo-widget-tabs .demo-code-block code.hljs {
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

.demo-widget-tabs .demo-code-block .hljs-tag,
.demo-widget-tabs .demo-code-block .hljs-name {
  color: $doc-color-primary;
}

.demo-widget-tabs .demo-code-block .hljs-attr {
  color: $doc-text-primary;
}

.demo-widget-tabs .demo-code-block .hljs-string {
  color: $doc-color-success;
}

.demo-widget-tabs .demo-code-block .hljs-keyword {
  color: $doc-color-warning;
}

.demo-widget-tabs .demo-code-block .hljs-comment {
  color: $doc-text-secondary;
}
</style>
