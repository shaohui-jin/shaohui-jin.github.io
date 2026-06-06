<template>
  <div class="rule-dev-shell">
    <header class="rule-dev-shell__header">
      <h1 class="rule-dev-shell__title">jsh-rule 开发预览</h1>
      <p class="rule-dev-shell__desc">独立 dev 入口，用于联调 JsDocEditor 与 WorkflowDesigner</p>
    </header>
    <el-tabs v-model="activeTab" type="border-card" class="rule-dev-app">
      <el-tab-pane label="JsDoc 编辑器" name="js-doc" lazy>
        <div class="rule-dev-app__pane">
          <JsDocEditor />
        </div>
      </el-tab-pane>
      <el-tab-pane label="规则编排" name="workflow" lazy>
        <div class="rule-dev-app__pane rule-dev-app__pane--full">
          <WorkflowDesigner />
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import JsDocEditor from "../component/js-doc-editor/JsDocEditor.vue";
import WorkflowDesigner from "../component/workflow-designer/WorkflowDesigner.vue";

const activeTab = ref("js-doc");
</script>

<style lang="scss">
@use "jsh-core/style/variables" as *;

html,
body,
#app {
  height: 100%;
  margin: 0;
  background: $lib-bg-page;
}

.rule-dev-shell {
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding: 12px;
  box-sizing: border-box;
  gap: 8px;
}

.rule-dev-shell__header {
  flex-shrink: 0;
}

.rule-dev-shell__title {
  margin: 0;
  font-size: 18px;
  color: $lib-text-heading;
}

.rule-dev-shell__desc {
  margin: 4px 0 0;
  font-size: 13px;
  color: $lib-text-secondary;
}

.rule-dev-app {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;

  .el-tabs__content {
    flex: 1;
    min-height: 0;
    padding: 0;
  }

  .el-tab-pane {
    height: 100%;
  }
}

.rule-dev-app__pane {
  height: 100%;
  overflow: auto;
  padding: 12px;
  box-sizing: border-box;
}

.rule-dev-app__pane--full {
  padding: 0;
  overflow: hidden;
}
</style>
