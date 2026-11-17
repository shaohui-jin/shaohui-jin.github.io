<script setup lang="ts">
import { ref, useSlots } from "vue";
import { ElTabPane, ElTabs } from "element-plus";
import CodeBlock from "../code-block/CodeBlock.vue";

defineOptions({ name: "WidgetTabs" });

const props = withDefaults(
  defineProps<{
    /** 代码 Tab 展示的源代码文本 */
    code: string;
    /** 经 highlight 处理后的代码 HTML */
    highlighted: string;
    /** 预览区是否贴边 */
    flush?: boolean;
  }>(),
  { flush: true },
);

const slots: ReturnType<typeof useSlots> = useSlots();
const tab = ref<"preview" | "code">("preview");
</script>

<template>
  <ElTabs v-model="tab" type="border-card" class="widget-tabs">
    <ElTabPane label="预览" name="preview">
      <div class="widget-tabs__body" :class="{ 'widget-tabs__body--flush': flush }">
        <slot />
      </div>
      <div v-if="slots.footer" class="widget-tabs__footer">
        <slot name="footer" />
      </div>
    </ElTabPane>

    <ElTabPane label="代码" name="code" lazy>
      <div class="widget-tabs__body widget-tabs__body--code">
        <CodeBlock :code="props.code" :highlighted="highlighted" />
      </div>
    </ElTabPane>
  </ElTabs>
</template>

<style scoped lang="scss">
.widget-tabs {
  --wt-sp: var(--widget-tabs-spacing, 16px);
  --wt-border: var(--widget-tabs-border, #e4e7ed);

  border-radius: var(--widget-tabs-radius, 6px);
  overflow: hidden;

  :deep(.el-tabs__content) {
    padding: 0;
  }
}

.widget-tabs__body {
  padding: var(--wt-sp);

  &--flush {
    padding: 0;
  }

  &--code {
    padding-top: 12px;
    padding-bottom: 12px;
  }
}

.widget-tabs__footer {
  padding: 0 var(--wt-sp) var(--wt-sp);
  border-top: 1px solid var(--wt-border);
}
</style>
