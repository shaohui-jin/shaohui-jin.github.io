<template>
  <div class="rule-workflow-page">
    <div class="rule-workflow-page__container">
      <WorkflowDesigner />
    </div>
  </div>
</template>

<script setup lang="ts">
import WorkflowDesigner from '../component/workflow-designer/WorkflowDesigner.vue'

defineOptions({
  name: 'RuleWorkflowPage'
})
</script>

<style scoped lang="scss">
@use "jsh-core/style/variables" as *;

.rule-workflow-page {
  width: 100%;
  height: 100%;
  min-height: 0;
}

.rule-workflow-page__container {
  width: 100%;
  height: 100%;
  min-height: 0;
  background: $lib-bg-page;
  overflow: hidden;
}
</style>
