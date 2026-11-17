<script setup lang="ts">
import { ref, watch } from "vue";
import { ElSwitch } from "element-plus";

defineOptions({ name: "CellSwitch" });

const props = defineProps<{
  row: Record<string, unknown>;
  colKey: string;
  activeValue?: string | number | boolean;
  inactiveValue?: string | number | boolean;
  disabled?: boolean;
  beforeChange?: () => boolean | Promise<boolean>;
}>();

const localValue = ref(props.row[props.colKey]);
watch(
  () => props.row[props.colKey],
  (v) => {
    localValue.value = v;
  },
);

function onUpdate(val: string | number | boolean) {
  localValue.value = val;
  props.row[props.colKey] = val;
}
</script>

<template>
  <ElSwitch
    :model-value="localValue as string | number | boolean"
    :active-value="activeValue ?? true"
    :inactive-value="inactiveValue ?? false"
    :disabled="disabled ?? false"
    :before-change="beforeChange"
    @update:model-value="onUpdate"
  />
</template>
