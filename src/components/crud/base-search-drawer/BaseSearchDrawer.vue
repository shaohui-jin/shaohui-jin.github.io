<script setup lang="ts">
import { ref, computed, type Component } from "vue";
import {
  ElDrawer,
  ElForm,
  ElFormItem,
  ElButton,
  ElInput,
  ElSelect,
  ElOption,
  ElDatePicker,
  ElCascader,
  ElTreeSelect,
  ElRadioGroup,
  ElRadio,
} from "element-plus";
import { omit } from "lodash-es";
import type { BaseSearchField, BaseSearchFieldOption } from "./types";

defineOptions({ name: "BaseSearchDrawer" });

const props = withDefaults(
  defineProps<{
    params: BaseSearchField[];
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

const DATE_TYPES = new Set(["date", "daterange", "datetime", "datetimerange"]);

const componentMap: Record<string, Component> = {
  input: ElInput,
  textarea: ElInput,
  select: ElSelect,
  date: ElDatePicker,
  daterange: ElDatePicker,
  datetime: ElDatePicker,
  datetimerange: ElDatePicker,
  cascader: ElCascader,
  "tree-select": ElTreeSelect,
  "radio-group": ElRadioGroup,
};

function getComponent(item: BaseSearchField): Component {
  return componentMap[item.type || "input"] || ElInput;
}

const BIND_OMIT_KEYS = ["key", "label"];

function getBinds(item: BaseSearchField): Record<string, unknown> {
  return omit(item as unknown as Record<string, unknown>, BIND_OMIT_KEYS);
}

function handleSearch() {
  emit("search", formData.value);
  visible.value = false;
}

function handleReset() {
  formRef.value?.resetFields();
  const data: Record<string, unknown> = {};
  props.params.forEach((p) => {
    data[p.key] = "";
  });
  formData.value = { ...data };
  visible.value = false;
  emit("reset");
}

function open() {
  formData.value = { ...props.modelValue };
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
        <ElDatePicker
          v-if="DATE_TYPES.has(param.type ?? '')"
          v-model="formData[param.key]"
          :type="(param.type as any)"
          range-separator="至"
          :clearable="param.clearable !== false"
          v-bind="getBinds(param)"
        />
        <component
          v-else
          :is="getComponent(param)"
          v-model="formData[param.key]"
          :placeholder="param.placeholder"
          v-bind="getBinds(param)"
          :empty-values="[null, undefined]"
          :clearable="param.clearable !== false"
        >
          <template v-if="param.type === 'select'">
            <template v-if="param.options && param.options.length > 0">
              <ElOption
                v-for="option in param.options"
                :key="param.key + String(option.value)"
                :label="option.name"
                :value="option.value"
              />
            </template>
            <template v-else-if="paramOptions[param.key]">
              <ElOption
                v-for="option in paramOptions[param.key]"
                :key="param.key + String(option.value)"
                :label="option.name"
                :value="option.value"
              />
            </template>
          </template>

          <template v-else-if="param.type === 'radio-group'">
            <template v-if="param.options && param.options.length > 0">
              <ElRadio
                v-for="option in param.options"
                :key="param.key + String(option.value)"
                :value="option.value"
              >
                {{ option.name }}
              </ElRadio>
            </template>
            <template v-else-if="paramOptions[param.key]">
              <ElRadio
                v-for="option in paramOptions[param.key]"
                :key="param.key + String(option.value)"
                :value="option.value"
              >
                {{ option.name }}
              </ElRadio>
            </template>
          </template>
        </component>
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
.crud-base-search-drawer {
  .el-drawer__header {
    padding: 20px 20px 10px;
    margin-bottom: 0;

    span {
      color: rgba(28, 26, 39, 1);
    }
  }
}

@media (max-width: 768px) {
  .crud-base-search-drawer.el-drawer {
    width: 100% !important;
  }
}
</style>

<style lang="scss" scoped>
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
  color: rgba(28, 26, 39, 1);
}
</style>
