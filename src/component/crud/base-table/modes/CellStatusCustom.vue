<script setup lang="ts">
import type { BaseTableColumn } from "@/type/crud";
import { formatCell, statusCustomLampColor } from "../utils/column";
import Dot from "@/component/basic/dot/Dot.vue";

defineOptions({ name: "CellStatusCustom" });

const props = defineProps<{
  column: BaseTableColumn;
  row: Record<string, unknown>;
  rowIndex: number;
  noTooltip?: boolean;
}>();
</script>

<template>
  <Dot
    :color="statusCustomLampColor(column, row)"
    :text="formatCell(column, row, rowIndex)"
    class="crud-base-table__status-custom"
    v-bind="noTooltip ? { 'data-no-tooltip': '' } : {}"
  />
</template>

<style scoped lang="scss">
.crud-base-table__status-custom {
  min-width: 0;
}

:deep(.status-dot__text) {
  font-size: 14px;
  color: var(--crud-bt-text, #606266);
  font-weight: 500;
}
</style>
