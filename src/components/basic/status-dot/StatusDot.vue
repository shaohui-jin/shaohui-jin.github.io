<script setup lang="ts">
import { libColorDefaults } from "../../../styles/colorDefaults";
import type { StatusDotProps } from "./types";

defineOptions({ name: "StatusDot" });

withDefaults(defineProps<StatusDotProps>(), {
  color: libColorDefaults.neutralLamp,
  text: "",
});
</script>

<template>
  <span class="status-dot">
    <i class="status-dot__lamp" :style="{ backgroundColor: color }" />
    <span v-if="text" class="status-dot__text">{{ text }}</span>
    <slot v-else />
  </span>
</template>

<style scoped lang="scss">
.status-dot {
  display: inline-flex;
  align-items: center;
  min-width: 0;
}

.status-dot__lamp {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.status-dot__text {
  margin-left: 6px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
