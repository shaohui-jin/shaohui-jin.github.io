<script setup lang="ts">
import { computed } from "vue";
import { CodeBlock } from "jsh-comp";
import { DocApiTable as ApiTable, highlightTsCode } from "jsh-comp/doc";
import { toolDocItems } from "../../toolDocItems";

const currentItem = toolDocItems.copyToClipboard;
const highlightedCode = computed(() => highlightTsCode(currentItem.usage));
const highlightedSignature = computed(() =>
  currentItem.signature ? highlightTsCode(currentItem.signature) : "",
);
const highlightedImpl = computed(() =>
  currentItem.implementation ? highlightTsCode(currentItem.implementation) : "",
);
</script>

<template>
  <div class="doc-content__header">
    <h2>{{ currentItem.name }}</h2>
    <p>{{ currentItem.desc }}</p>
  </div>

  <div class="utils-usage">
    <h4 class="utils-usage__title">基础用法</h4>
    <div class="demo-code-panel">
      <CodeBlock :code="currentItem.usage" :highlighted="highlightedCode" />
    </div>
  </div>

  <div v-if="highlightedSignature" class="utils-usage utils-usage--signature">
    <h4 class="utils-usage__title">配置参数</h4>
    <div class="demo-code-panel">
      <CodeBlock :code="currentItem.signature!" :highlighted="highlightedSignature" />
    </div>
  </div>

  <div v-if="highlightedImpl" class="utils-usage utils-usage--impl">
    <h4 class="utils-usage__title">体操实现</h4>
    <div class="demo-code-panel">
      <CodeBlock :code="currentItem.implementation!" :highlighted="highlightedImpl" />
    </div>
  </div>

  <div class="api-section">
    <h3 class="api-section__title">参数说明</h3>
    <ApiTable type="props" :rows="currentItem.api" />
  </div>
</template>

<style scoped lang="scss">
@use "jsh-comp/doc/style/variables" as *;
@use "jsh-comp/doc/style/demo";

.utils-usage {
  margin-bottom: 24px;

  &__title {
    margin: 0 0 12px;
    font-size: 14px;
    font-weight: 600;
    color: $doc-text-primary;
  }
}
</style>
