<script setup lang="ts">
import { ref } from "vue";
import { ElMessage } from "element-plus";
import { StepWizard } from "jsh-comp";
import type { ComponentApi } from "../../type/types";
import ApiTable from "../ApiTable.vue";
import DemoWidgetTabs from "../DemoWidgetTabs.vue";
import { demoCodes } from "../demoCodes";

const step = ref(0);
const form = ref({ name: "", email: "", role: "" });

const steps = [
  { title: "基本信息", description: "填写姓名和邮箱" },
  { title: "角色分配", description: "选择用户角色" },
  { title: "确认提交", description: "核对信息并提交" },
];

const eventLog = ref("—");

function onChange(currentStep: number) {
  eventLog.value = `change → step: ${currentStep}`;
}

function onFinish() {
  eventLog.value = "finish → 提交成功";
  ElMessage.success("提交成功");
}

const api: ComponentApi = {
  props: [
    { name: "steps", type: "StepWizardStep[]", default: "—", required: true, desc: "步骤配置列表" },
    { name: "step / v-model:step", type: "number", default: "0", required: false, desc: "当前步骤索引" },
  ],
  events: [
    { name: "update:step", payload: "(step: number)", desc: "v-model:step 更新" },
    { name: "change", payload: "(step: number)", desc: "步骤切换" },
    { name: "finish", payload: "—", desc: "最后一步点击完成" },
  ],
};
</script>

<template>
  <div class="doc-content__header">
    <h2>StepWizard 步骤向导</h2>
    <p>分步表单向导组件，内置步骤条与上一步/下一步导航</p>
  </div>

  <DemoWidgetTabs :code="demoCodes.stepWizard">
    <StepWizard v-model:step="step" :steps="steps" @change="onChange" @finish="onFinish">
      <template #default="{ step: currentStep }">
        <template v-if="currentStep === 0">
          <el-input v-model="form.name" placeholder="姓名" style="margin-bottom: 12px" />
          <el-input v-model="form.email" placeholder="邮箱" />
        </template>
        <template v-else-if="currentStep === 1">
          <el-radio-group v-model="form.role">
            <el-radio value="admin">管理员</el-radio>
            <el-radio value="editor">编辑</el-radio>
            <el-radio value="viewer">只读</el-radio>
          </el-radio-group>
        </template>
        <template v-else>
          <p>姓名：{{ form.name }}</p>
          <p>邮箱：{{ form.email }}</p>
          <p>角色：{{ form.role }}</p>
        </template>
      </template>
    </StepWizard>
    <p class="widget-hint">当前步骤：{{ step }}，最近事件：{{ eventLog }}</p>
  </DemoWidgetTabs>

  <div class="api-section">
    <h3 class="api-section__title">StepWizard Props</h3>
    <ApiTable type="props" :rows="api.props" />
  </div>

  <div class="api-section">
    <h3 class="api-section__title">StepWizard Events</h3>
    <ApiTable type="events" :rows="api.events" />
  </div>
</template>

<style scoped lang="scss">
@use "../../style/demo";
</style>
