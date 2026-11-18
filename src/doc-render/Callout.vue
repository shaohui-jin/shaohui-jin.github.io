<script setup lang="ts">
defineOptions({ name: "DocCallout" });

defineProps<{
  name: string;
  title: string;
  html: string;
}>();
</script>

<template>
  <div class="vp-callout" :class="`vp-callout--${name}`">
    <div class="vp-callout__title">{{ title }}</div>
    <div class="vp-callout__body" v-html="html" />
  </div>
</template>

<style scoped lang="scss">
@use "../styles/site/variables" as *;

.vp-callout {
  margin: $doc-sp-md 0;
  padding: $doc-sp-sm $doc-sp-md;
  border-left: 3px solid $doc-color-primary;
  border-radius: 0 $doc-radius-lg $doc-radius-lg 0;
  background: $doc-bg-subtle;
}

.vp-callout__title {
  margin-bottom: $doc-sp-xs;
  font-weight: 500;
}

.vp-callout--tip {
  border-left-color: $doc-color-success;
}

.vp-callout--warning {
  border-left-color: $doc-color-warning;
}

.vp-callout--danger {
  border-left-color: #f56c6c;
}

.vp-callout__body :deep(> :first-child) {
  margin-top: 0;
}

.vp-callout__body :deep(> :last-child) {
  margin-bottom: 0;
}
</style>
