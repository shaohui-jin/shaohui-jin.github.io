<script setup lang="ts">
import { WorkflowDesigner } from "jsh-rule";
</script>

<template>
  <WorkflowDesigner class="demo-rule-root demo-rule-root--canvas" />
</template>

<style scoped lang="scss">
.demo-rule-root {
  width: 100%;
  height: 100%;
  min-height: 0;
  flex: 1;
  box-sizing: border-box;
}

.demo-rule-root--canvas {
  overflow: hidden;
}
</style>
