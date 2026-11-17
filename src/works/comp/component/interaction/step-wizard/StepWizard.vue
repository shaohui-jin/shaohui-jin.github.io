<script setup lang="ts">
import { ref, watch } from "vue";
import type { StepWizardProps, StepWizardEmits } from "@/works/comp/type/interaction";

defineOptions({ name: "StepWizard" });

const props = withDefaults(defineProps<StepWizardProps>(), {
  step: 0,
});

const emit = defineEmits<StepWizardEmits>();

const innerStep = ref(props.step);

watch(
  () => props.step,
  (v) => {
    innerStep.value = v;
  },
);

function setStep(v: number) {
  innerStep.value = v;
  emit("update:step", v);
  emit("change", v);
}

function next() {
  if (innerStep.value < props.steps.length - 1) {
    setStep(innerStep.value + 1);
  } else {
    emit("finish");
  }
}

function prev() {
  if (innerStep.value > 0) setStep(innerStep.value - 1);
}

defineExpose({ next, prev });
</script>

<template>
  <div class="step-wizard">
    <el-steps :active="innerStep" finish-status="success" align-center>
      <el-step v-for="s in steps" :key="s.title" :title="s.title" :description="s.description" />
    </el-steps>
    <div class="step-wizard__body">
      <slot :step="innerStep" />
    </div>
    <div class="step-wizard__footer">
      <slot name="footer" :step="innerStep" :prev="prev" :next="next">
        <el-button v-if="innerStep > 0" @click="prev">上一步</el-button>
        <el-button type="primary" @click="next">
          {{ innerStep === steps.length - 1 ? "完成" : "下一步" }}
        </el-button>
      </slot>
    </div>
  </div>
</template>

<style scoped lang="scss">
.step-wizard {
  &__body {
    margin: 24px 0;
    padding: 16px;
    background: var(--comp-bg-subtle, #fafafa);
    border-radius: 8px;
    min-height: 80px;
  }

  &__footer {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
  }
}
</style>
