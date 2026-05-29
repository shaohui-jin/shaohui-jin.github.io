<script setup lang="ts">
import { ref, computed } from "vue";
import { ElForm, ElFormItem, ElButton, ElIcon } from "element-plus";
import { ArrowDown, ArrowUp } from "@element-plus/icons-vue";
import BaseSearchField from "../base-search-field/BaseSearchField.vue";
import type { BaseSearchField as SearchFieldConfig, BaseSearchFieldOption } from "@/type/crud";
import { isEmptySearchFieldValue, omitEmptySearchFields, patchSearchFormField } from "./searchFormData";

defineOptions({ name: "BaseSearch" });

const props = withDefaults(
  defineProps<{
    params: SearchFieldConfig[];
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

const fixedParams = computed(() => props.params.filter((f) => f.fixed));
const expandParams = computed(() => props.params.filter((f) => !f.fixed));

function toggleExpand() {
  isExpanded.value = !isExpanded.value;
}

function updateFieldValue(key: string, value: unknown) {
  formData.value = patchSearchFormField(formData.value, key, value);
}

function handleParamChange(value: unknown, field?: string) {
  emit("change", { field, value, formData: formData.value });
}

function handleSearch() {
  emit("search", omitEmptySearchFields(formData.value));
}

function handleReset() {
  formRef.value?.resetFields();
  formData.value = { ...defaultValue.value };
  emit("reset");
}

function initFormData() {
  const cleaned = omitEmptySearchFields(props.modelValue);
  defaultValue.value = { ...cleaned };
  if (Object.values(props.modelValue).some(isEmptySearchFieldValue)) {
    emit("update:modelValue", cleaned);
  }
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
      <div class="crud-base-search__body">
        <div class="crud-base-search__fields">
          <ElFormItem
            v-for="param in fixedParams"
            :key="param.key"
            :label="param.label"
            :label-width="param.labelWidth || '70px'"
          >
            <BaseSearchField
              :model-value="formData[param.key]"
              :field="param"
              :param-options="paramOptions[param.key]"
              @update:model-value="(value) => updateFieldValue(param.key, value)"
              @change="(value) => handleParamChange(value, param.key)"
              @enter="handleSearch"
            />
          </ElFormItem>

          <template v-if="expandParams.length > 0 && isExpanded">
            <ElFormItem
              v-for="param in expandParams"
              :key="param.key"
              :label="param.label"
              :label-width="param.labelWidth || '70px'"
            >
              <BaseSearchField
                :model-value="formData[param.key]"
                :field="param"
                :param-options="paramOptions[param.key]"
                @update:model-value="(value) => updateFieldValue(param.key, value)"
                @change="(value) => handleParamChange(value, param.key)"
                @enter="handleSearch"
              />
            </ElFormItem>
          </template>
        </div>

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
    </ElForm>
  </div>
</template>

<style scoped lang="scss">
@use "@/style/variables" as *;

$search-field-gap: var(--comp-font-size-sm, 13px);
$search-stack-gap: var(--comp-font-size-base, 14px);
$search-label-max: 90px;
$search-control-width: 200px;
$search-daterange-width: 350px;
// 标准字段 + 日期范围并排的最小容器宽度（含 padding，不压缩桌面端日期范围展示）
$search-stack-bp: calc(
  (#{$search-label-max} + #{$search-control-width}) + (80px + #{$search-daterange-width}) + 16px + 32px
);

.crud-base-search {
  container-type: inline-size;
  container-name: crud-base-search;
  padding: $search-stack-gap 16px 0;
  border-radius: $lib-radius-sm;
}

.crud-base-search__form {
  margin: 0;
}

.crud-base-search__body {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: $search-stack-gap 0;
  margin-bottom: $search-stack-gap;
}

.crud-base-search__fields {
  display: flex;
  flex: 1 1 auto;
  flex-wrap: wrap;
  align-items: center;
  gap: $search-stack-gap 16px;
  min-width: 0;
}

.crud-base-search__actions {
  flex: 0 0 auto;
  margin-left: auto;

  :deep(.el-form-item__content) {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: $search-field-gap;
    min-width: auto;
  }
}

.crud-base-search__arrow {
  margin-left: 4px;
}

:deep(.el-form-item) {
  margin-bottom: 0;
  margin-right: 0;
}

:deep(.el-form-item__label) {
  font-weight: 500;
  color: $lib-text-regular;
}

:deep(.el-input),
:deep(.el-select),
:deep(.el-cascader) {
  width: $search-control-width;
}

:deep(.el-form-item__content) {
  min-width: $search-control-width;
}

:deep(.el-form-item:has(.el-date-editor) .el-form-item__content) {
  min-width: 0;
}

// 容器宽度不足两个表单项并排时，与移动端一致：纵向全宽布局
@container crud-base-search (max-width: #{$search-stack-bp}) {
  .crud-base-search {
    padding: $search-stack-gap 12px 0;
  }

  .crud-base-search__form :deep(.el-form--inline) {
    display: block;
  }

  .crud-base-search__body {
    flex-direction: column;
    align-items: stretch;
    gap: $search-stack-gap;
  }

  .crud-base-search__fields {
    flex-direction: column;
    align-items: stretch;
    gap: $search-stack-gap;
    width: 100%;
  }

  .crud-base-search__actions {
    width: 100%;
    margin-left: 0;
    margin-bottom: 0;

    :deep(.el-form-item__content) {
      justify-content: stretch;
      flex-direction: column;
      gap: $search-field-gap;
    }

    :deep(.el-button) {
      width: 100%;
      min-height: 36px;
      margin: 0;
    }
  }

  :deep(.el-form-item) {
    display: flex;
    flex-direction: column;
    align-items: stretch;
  }

  :deep(.el-form-item__label) {
    width: auto !important;
    justify-content: flex-start;
    padding-bottom: 6px;
    line-height: 1.4;
  }

  :deep(.el-form-item__content) {
    min-width: 0;
    width: 100%;
  }

  :deep(.el-input),
  :deep(.el-select),
  :deep(.el-cascader),
  :deep(.el-date-editor) {
    width: 100%;
  }
}
</style>
