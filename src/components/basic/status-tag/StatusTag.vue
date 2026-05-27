<script setup lang="ts">
import { ElTag } from "element-plus";
import type { StatusTagProps } from "./types";

defineOptions({ name: "StatusTag" });

withDefaults(defineProps<StatusTagProps>(), {
  type: "info",
});
</script>

<template>
  <ElTag class="status-tag" :type="type" effect="light" round>
    {{ label }}
  </ElTag>
</template>

<style scoped lang="scss">
.status-tag {
  font-weight: 500;
}
</style>
