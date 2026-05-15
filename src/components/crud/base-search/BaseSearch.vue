<script setup lang="ts">
import { ref, computed, type Component } from "vue";
import {
  ElForm,
  ElFormItem,
  ElButton,
  ElIcon,
  ElInput,
  ElSelect,
  ElOption,
  ElDatePicker,
  ElCascader,
  ElTreeSelect,
} from "element-plus";
import { ArrowDown, ArrowUp } from "@element-plus/icons-vue";
import { omit } from "lodash-es";
import type { BaseSearchField, BaseSearchFieldOption } from "./types";

defineOptions({ name: "BaseSearch" });

const props = withDefaults(
  defineProps<{
    params: BaseSearchField[];
    modelValue: Record<string, unknown>;
    loading?: boolean;
    paramOptions?: Record<string, BaseSearchFieldOption[]>;
  }>(),
  {
    loading: false,
    paramOptions: () => ({}),
  },
);

const emit = defineEmits<{
  "update:modelValue": [value: Record<string, unknown>];
  search: [formData: Record<string, unknown>];
  reset: [];
  change: [payload: { field?: string; value: unknown; formData: Record<string, unknown> }];
}>();

const formRef = ref();
const isExpanded = ref(false);
const defaultValue = ref<Record<string, unknown>>({});

const formData = computed({
  get: (): Record<string, any> => props.modelValue,
  set: (val: Record<string, any>) => emit("update:modelValue", val),
});

const DATE_TYPES = new Set(["date", "daterange", "datetime", "datetimerange"]);

const componentMap: Record<string, Component> = {
  input: ElInput,
  select: ElSelect,
  date: ElDatePicker,
  daterange: ElDatePicker,
  datetime: ElDatePicker,
  datetimerange: ElDatePicker,
  cascader: ElCascader,
  "tree-select": ElTreeSelect,
};

function getComponent(item: BaseSearchField): Component {
  return componentMap[item.type || "input"] || ElInput;
}

const BIND_OMIT_KEYS = ["key", "label", "fixed", "type", "options", "keydownSearch"];

function getBinds(item: BaseSearchField): Record<string, unknown> {
  return omit(item as unknown as Record<string, unknown>, BIND_OMIT_KEYS);
}

const fixedParams = computed(() => props.params.filter((f) => f.fixed));
const expandParams = computed(() => props.params.filter((f) => !f.fixed));

function toggleExpand() {
  isExpanded.value = !isExpanded.value;
}

function handleParamChange(value: unknown, field?: string) {
  emit("change", { field, value, formData: formData.value });
}

function handleSearch() {
  emit("search", formData.value);
}

function handleReset() {
  formRef.value?.resetFields();
  const data: Record<string, unknown> = {};
  props.params.forEach((p) => {
    data[p.key] = "";
  });
  formData.value = { ...data, ...defaultValue.value };
  emit("reset");
}

function initFormData() {
  formData.value = { ...props.modelValue };
  defaultValue.value = { ...props.modelValue };
}

initFormData();

defineExpose({
  formData,
  reset: handleReset,
  search: handleSearch,
  toggleExpand,
});
</script>

<template>
  <div class="crud-base-search">
    <ElForm ref="formRef" :model="formData" :inline="true" class="crud-base-search__form">
      <div class="crud-base-search__fixed">
        <div class="crud-base-search__line">
          <ElFormItem
            v-for="param in fixedParams"
            :key="param.key"
            :label="param.label"
            :label-width="param.labelWidth || '70px'"
          >
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
              v-bind="getBinds(param)"
              :empty-values="[null, undefined]"
              :clearable="param.clearable !== false"
              @change="(e: unknown) => handleParamChange(e, param.key)"
              @keydown.enter.prevent="
                () => {
                  if (param.keydownSearch !== false) handleSearch();
                }
              "
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
            </component>
          </ElFormItem>

          <ElFormItem class="crud-base-search__actions">
            <ElButton v-if="expandParams.length > 0" text @click="toggleExpand">
              {{ isExpanded ? "收起" : "更多" }}
              <ElIcon class="crud-base-search__arrow">
                <ArrowUp v-if="isExpanded" />
                <ArrowDown v-else />
              </ElIcon>
            </ElButton>
            <ElButton type="primary" :loading="loading" @click="handleSearch">查询</ElButton>
            <ElButton @click="handleReset">重置</ElButton>
          </ElFormItem>
        </div>

        <div
          v-if="expandParams.length > 0 && isExpanded"
          class="crud-base-search__line crud-base-search__expand"
        >
          <ElFormItem
            v-for="param in expandParams"
            :key="param.key"
            :label="param.label"
            :label-width="param.labelWidth || '70px'"
          >
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
              v-bind="getBinds(param)"
              :style="param.style"
              :empty-values="[null, undefined]"
              :clearable="param.clearable !== false"
              @change="(e: unknown) => handleParamChange(e, param.key)"
              @keydown.enter.prevent="
                () => {
                  if (param.keydownSearch !== false) handleSearch();
                }
              "
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
            </component>
          </ElFormItem>
        </div>
      </div>
    </ElForm>
  </div>
</template>

<style scoped lang="scss">
.crud-base-search {
  padding: 12px 16px 0;
  border-radius: 4px;
}

.crud-base-search__form {
  margin: 0;
}

.crud-base-search__fixed {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  flex-direction: column;
  margin-bottom: 12px;

  &:has(.crud-base-search__expand) {
    margin-bottom: 0;

    .crud-base-search__expand {
      margin-bottom: 12px;
    }
  }
}

.crud-base-search__line {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

.crud-base-search__expand {
  :deep(.el-form-item) {
    margin-top: 8px;
    margin-right: 16px;
  }
}

.crud-base-search__actions {
  margin-left: auto;
}

.crud-base-search__arrow {
  margin-left: 4px;
}

:deep(.el-form-item) {
  margin-bottom: 0;
  margin-right: 16px;
}

:deep(.el-form-item__label) {
  font-weight: 500;
  color: #606266;
}

:deep(.el-input),
:deep(.el-select),
:deep(.el-cascader) {
  width: 200px;
}

:deep(.el-form-item__content) {
  min-width: 200px;
}
</style>
