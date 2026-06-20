<script setup lang="ts">
import { ref } from "vue";
import { ElMessage } from "element-plus";

const step = ref(0);
const form = ref({ name: "", email: "", role: "" });

const steps = [
  { title: "基本信息", desc: "填写姓名和邮箱" },
  { title: "角色分配", desc: "选择用户角色" },
  { title: "确认提交", desc: "核对信息并提交" },
];

function next() {
  if (step.value === 0 && (!form.value.name || !form.value.email)) {
    ElMessage.warning("请填写基本信息");
    return;
  }
  if (step.value === 1 && !form.value.role) {
    ElMessage.warning("请选择角色");
    return;
  }
  if (step.value < 2) step.value++;
  else ElMessage.success("提交成功");
}

function prev() {
  if (step.value > 0) step.value--;
}
</script>

<template>
  <div class="step-wizard">
    <el-steps :active="step" finish-status="success" align-center>
      <el-step v-for="s in steps" :key="s.title" :title="s.title" :description="s.desc" />
    </el-steps>
    <div class="step-wizard__body">
      <template v-if="step === 0">
        <el-input v-model="form.name" placeholder="姓名" style="margin-bottom: 12px" />
        <el-input v-model="form.email" placeholder="邮箱" />
      </template>
      <template v-else-if="step === 1">
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
    </div>
    <div class="step-wizard__footer">
      <el-button v-if="step > 0" @click="prev">上一步</el-button>
      <el-button type="primary" @click="next">{{ step === 2 ? '提交' : '下一步' }}</el-button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.step-wizard {
  &__body {
    margin: 24px 0;
    padding: 16px;
    background: #fafafa;
    border-radius: 8px;
    min-height: 80px;
    font-size: 13px;
  }

  &__footer {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
  }
}
</style>
