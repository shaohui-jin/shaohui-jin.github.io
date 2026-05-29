<script setup lang="ts">
import { ref, computed } from "vue";
import { ElDrawer, ElForm, ElFormItem, ElButton } from "element-plus";
import BaseSearchField from "../base-search-field/BaseSearchField.vue";
import type { BaseSearchField as SearchFieldConfig, BaseSearchFieldOption } from "@/type/crud";
import { omitEmptySearchFields, patchSearchFormField } from "../base-search/searchFormData";

defineOptions({ name: "BaseSearchDrawer" });

const props = withDefaults(
  defineProps<{
    params: SearchFieldConfig[];
    modelValue: Record<string, unknown>;
    paramOptions?: Record<string, BaseSearchFieldOption[]>;
    title?: string;
    drawerWidth?: string;
  }>(),
  {
    paramOptions: () => ({}),
    title: "高级筛选",
    drawerWidth: "500px",
  },
);

const emit = defineEmits<{
  "update:modelValue": [value: Record<string, unknown>];
  search: [formData: Record<string, unknown>];
  reset: [];
}>();

const visible = ref(false);
const formRef = ref();

const formData = computed({
  get: (): Record<string, any> => props.modelValue,
  set: (val: Record<string, any>) => emit("update:modelValue", val),
});

function updateFieldValue(key: string, value: unknown) {
  formData.value = patchSearchFormField(formData.value, key, value);
}

function handleSearch() {
  emit("search", omitEmptySearchFields(formData.value));
  visible.value = false;
}

function handleReset() {
  formRef.value?.resetFields();
  formData.value = {};
  visible.value = false;
  emit("reset");
}

function open() {
  formData.value = { ...omitEmptySearchFields(props.modelValue) };
  visible.value = true;
}

defineExpose({
  open,
  formData,
  reset: handleReset,
  search: handleSearch,
});
</script>

<template>
  <ElDrawer
    v-model="visible"
    :close-on-click-modal="false"
    direction="rtl"
    :title="title"
    :size="drawerWidth"
    class="crud-base-search-drawer"
    append-to-body
  >
    <ElForm ref="formRef" :model="formData" label-width="auto" label-position="top">
      <ElFormItem v-for="param in params" :key="param.key" :label="param.label">
        <BaseSearchField
          :model-value="formData[param.key]"
          :field="param"
          :param-options="paramOptions[param.key]"
          @update:model-value="(value) => updateFieldValue(param.key, value)"
        />
      </ElFormItem>
    </ElForm>

    <template #footer>
      <div class="crud-base-search-drawer__footer">
        <ElButton @click="handleReset">取消</ElButton>
        <ElButton type="primary" @click="handleSearch">确定</ElButton>
      </div>
    </template>
  </ElDrawer>
</template>

<style lang="scss">
@use "@/style/variables" as *;

.crud-base-search-drawer {
  .el-drawer__header {
    padding: 20px 20px 10px;
    margin-bottom: 0;

    span {
      color: $lib-text-heading;
    }
  }
}

@media (width <= 768px) {
  .crud-base-search-drawer.el-drawer {
    width: 100% !important;
  }
}
</style>

<style lang="scss" scoped>
@use "@/style/variables" as *;

.crud-base-search-drawer__footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

:deep(.el-form-item) {
  margin-bottom: 24px;
}

:deep(.el-form-item__label) {
  font-weight: 500;
  color: $lib-text-heading;
}
</style>
