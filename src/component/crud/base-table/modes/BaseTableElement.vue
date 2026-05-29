<script setup lang="ts">
import { ElIcon, ElImage, ElTable, ElTableColumn } from "element-plus";
import { Setting } from "@element-plus/icons-vue";
import type { BaseTableColumn } from "@/type/crud";
import { tableLayoutDefaults, TABLE_TOOLTIP_POPPER_CLASS } from "../theme/tableSurface";
import { formatCell, getTableColumnBinds, visibleColumns } from "../utils/column";
import CellSwitch from "./CellSwitch.vue";
import CellStatusCustom from "./CellStatusCustom.vue";
import TableSlotPopup from "./TableSlotPopup.vue";

const tooltipOptions = { popperClass: TABLE_TOOLTIP_POPPER_CLASS };

defineOptions({ name: "BaseTableElement" });

const props = defineProps<{
  tableData: Record<string, unknown>[];
  columns: BaseTableColumn[];
  rowKey?: string;
  emptyText?: string;
  loading?: boolean;
  /** 嵌套子表格时使用 max-height 而非 height，使表格高度自适应 */
  tableMaxHeight?: number;
}>();

const emit = defineEmits<{
  selectionChange: [rows: Record<string, unknown>[]];
  editColumn: [];
}>();

function onSelectionChange(val: Record<string, unknown>[]) {
  emit("selectionChange", val);
}

function columnFormatter(col: BaseTableColumn) {
  return (row: unknown, _column: unknown, cellValue: unknown) =>
    col.formatter!(row as Record<string, unknown>, col, cellValue);
}
</script>

<template>
  <div
    :class="[
      'crud-base-table__element',
      { 'crud-base-table__element--nested': tableMaxHeight != null },
    ]"
  >
    <ElTable
      :data="tableData"
      v-bind="tableMaxHeight != null ? { 'max-height': tableMaxHeight } : { height: '100%' }"
      border
      stripe
      show-overflow-tooltip
      :row-key="rowKey"
      :empty-text="emptyText"
      :tooltip-options="tooltipOptions"
      @selection-change="onSelectionChange"
    >
      <template v-for="(col, ci) in visibleColumns(columns)" :key="`${col.key}-${ci}`">
        <ElTableColumn
          v-if="col.type === 'selection'"
          v-bind="getTableColumnBinds(col)"
          type="selection"
          :width="col.width ?? tableLayoutDefaults.selectionColumnWidth"
          align="center"
          :show-overflow-tooltip="false"
        />
        <ElTableColumn
          v-else-if="col.type === 'index'"
          v-bind="getTableColumnBinds(col)"
          type="index"
          :width="col.width ?? tableLayoutDefaults.indexColumnWidth"
          align="center"
          :show-overflow-tooltip="false"
        />
        <ElTableColumn
          v-else-if="col.type === 'switch'"
          v-slot="scope"
          v-bind="getTableColumnBinds(col)"
          :show-overflow-tooltip="false"
        >
          <CellSwitch
            :row="scope.row"
            :col-key="col.key"
            :active-value="col.activeValue as string | number | boolean"
            :inactive-value="col.inactiveValue as string | number | boolean"
            :disabled="Boolean(col.disabled)"
            :before-change="col.beforeChange ? () => col.beforeChange!(scope.row, col) : undefined"
          />
        </ElTableColumn>
        <ElTableColumn
          v-else-if="col.type === 'image'"
          v-slot="scope"
          v-bind="getTableColumnBinds(col)"
          :show-overflow-tooltip="false"
        >
          <ElImage
            :src="String(scope.row[col.key] ?? '')"
            fit="cover"
            style="width: 30px; height: 30px"
            lazy
            :preview-src-list="[String(scope.row[col.key] ?? '')]"
            preview-teleported
          />
        </ElTableColumn>
        <ElTableColumn
          v-else-if="col.type === 'status-custom'"
          v-slot="scope"
          v-bind="getTableColumnBinds(col)"
        >
          <CellStatusCustom :column="col" :row="scope.row" :row-index="scope.$index" />
        </ElTableColumn>
        <ElTableColumn
          v-else-if="col.type === 'tableSlot'"
          v-slot="scope"
          v-bind="getTableColumnBinds(col)"
        >
          <TableSlotPopup :row="scope.row" :column="col" />
        </ElTableColumn>
        <ElTableColumn
          v-else-if="col.type === 'editColumn'"
          v-bind="getTableColumnBinds(col)"
          class-name="crud-base-table__edit-column"
          label-class-name="crud-base-table__edit-column"
          fixed="right"
          :width="col.width ?? 48"
          :resizable="false"
          :show-overflow-tooltip="false"
        >
          <template #header>
            <ElIcon class="crud-base-table__edit-column-btn" @click="emit('editColumn')">
              <Setting />
            </ElIcon>
          </template>
        </ElTableColumn>
        <ElTableColumn
          v-else-if="col.formatter"
          v-bind="getTableColumnBinds(col)"
          :formatter="columnFormatter(col)"
        />
        <ElTableColumn
          v-else
          v-bind="getTableColumnBinds(col)"
          :show-overflow-tooltip="true"
          :prop="col.key"
        />
      </template>
    </ElTable>
    <div v-if="loading" class="crud-base-table__element-mask" />
  </div>
</template>

<style scoped lang="scss">
@use "@/style/variables" as *;

.crud-base-table__element {
  position: relative;
  height: 100%;
  min-height: 0;

  &--nested {
    height: auto;
  }
}

.crud-base-table__element-mask {
  position: absolute;
  inset: 0;
  z-index: 2;
  background: $lib-mask-light;
  pointer-events: none;
}

:deep(.crud-base-table__edit-column-btn) {
  flex-shrink: 0;
  cursor: pointer;
  color: $lib-neutral-icon;
  font-size: 16px;

  &:hover {
    color: $lib-color-primary;
  }
}
</style>
