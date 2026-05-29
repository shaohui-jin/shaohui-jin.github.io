<script setup lang="ts">
import { computed, type Component } from "vue";
import {
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
import type { BaseSearchField, BaseSearchFieldOption } from "@/type/crud";

defineOptions({ name: "BaseSearchField" });

const props = withDefaults(
  defineProps<{
    field: BaseSearchField;
    modelValue: unknown;
    paramOptions?: BaseSearchFieldOption[];
  }>(),
  {
    paramOptions: () => [],
  },
);

const emit = defineEmits<{
  "update:modelValue": [value: unknown];
  change: [value: unknown];
  enter: [];
}>();

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

const BIND_OMIT_KEYS = ["key", "label", "fixed", "type", "options", "keydownSearch"];

const resolvedOptions = computed(() => {
  if (props.field.options?.length) return props.field.options;
  return props.paramOptions;
});

function getComponent(item: BaseSearchField): Component {
  return componentMap[item.type || "input"] || ElInput;
}

function getBinds(item: BaseSearchField): Record<string, unknown> {
  return omit(item as unknown as Record<string, unknown>, BIND_OMIT_KEYS);
}

function updateValue(value: unknown) {
  emit("update:modelValue", value);
}

function handleChange(value: unknown) {
  emit("change", value);
}

function handleEnter() {
  if (props.field.keydownSearch !== false) {
    emit("enter");
  }
}
</script>

<template>
  <ElDatePicker
    v-if="DATE_TYPES.has(field.type ?? '')"
    :model-value="(modelValue as any)"
    :type="field.type as any"
    range-separator="至"
    :clearable="field.clearable !== false"
    v-bind="getBinds(field)"
    @update:model-value="updateValue"
  />
  <component
    :is="getComponent(field)"
    v-else
    :model-value="modelValue"
    :placeholder="field.placeholder"
    :style="field.style"
    v-bind="getBinds(field)"
    :empty-values="[null, undefined]"
    :clearable="field.clearable !== false"
    @update:model-value="updateValue"
    @change="handleChange"
    @keydown.enter.prevent="handleEnter"
  >
    <template v-if="field.type === 'select'">
      <ElOption
        v-for="option in resolvedOptions"
        :key="field.key + String(option.value)"
        :label="option.name"
        :value="option.value"
      />
    </template>

    <template v-else-if="field.type === 'radio-group'">
      <ElRadio
        v-for="option in resolvedOptions"
        :key="field.key + String(option.value)"
        :value="option.value"
      >
        {{ option.name }}
      </ElRadio>
    </template>
  </component>
</template>
