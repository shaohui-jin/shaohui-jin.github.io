<script setup lang="ts">
import { ElAutoResizer, ElCheckbox, ElTableV2, ElTooltip } from "element-plus";
import type { Column } from "element-plus";
import { h, ref, shallowRef, toRef } from "vue";
import type { BaseTableColumn } from "@/type/crud";
import { tableLayoutDefaults, TABLE_TOOLTIP_POPPER_CLASS } from "../theme/tableSurface";
import { formatCell, layoutColumnWidths, normalizeColumn, visibleColumns } from "../utils/column";
import { useBaseTableSelection } from "../utils/useBaseTableSelection";
import CellSwitch from "./CellSwitch.vue";
import CellStatusCustom from "./CellStatusCustom.vue";
import TableSlotPopup from "./TableSlotPopup.vue";

defineOptions({ name: "BaseTableVirtual" });

const props = defineProps<{
  tableData: Record<string, unknown>[];
  columns: BaseTableColumn[];
  rowHeight: number;
  headerHeight: number;
  rowKey: string;
}>();

const emit = defineEmits<{
  selectionChange: [rows: Record<string, unknown>[]];
}>();

const tableDataRef = toRef(props, "tableData");
const selection = useBaseTableSelection(props.rowKey, tableDataRef);

const virtualTooltipRef = shallowRef<HTMLElement>();
const tooltipVisible = ref(false);
const tooltipContent = ref("");

const OVERFLOW_SELECTOR = ".crud-base-table__virtual-cell, .status-dot__text";

function onCellMouseover(e: MouseEvent) {
  const cellText = (e.target as HTMLElement).closest?.(OVERFLOW_SELECTOR) as HTMLElement | null;
  if (!cellText || cellText.closest("[data-no-tooltip]")) {
    tooltipVisible.value = false;
    return;
  }
  if (cellText === virtualTooltipRef.value && tooltipVisible.value) {
    return;
  }
  if (cellText.scrollWidth > cellText.clientWidth) {
    tooltipContent.value = cellText.textContent || "";
    virtualTooltipRef.value = cellText;
    tooltipVisible.value = true;
  } else {
    tooltipVisible.value = false;
  }
}

function onContainerMouseleave() {
  tooltipVisible.value = false;
}

/** Table-V2 需固定列宽；与 Canvas 系共用 layoutColumnWidths；selection 列用 ElCheckbox 与 Element 表多选一致 */
function v2columnsAt(innerWidth: number): Column<Record<string, unknown>>[] {
  const vis = visibleColumns(props.columns);
  const widths = layoutColumnWidths(props.columns, innerWidth);
  return vis.map((col, i) => {
    const w = widths[i] ?? tableLayoutDefaults.defaultColumnWidth;
    const align =
      col.type === "selection" ? "center" : col.type === "index" ? "center" : (col.align ?? "left");

    if (col.type === "selection") {
      return {
        key: col.key,
        dataKey: col.key,
        title: "",
        width: w,
        align,
        headerCellRenderer: () =>
          h(ElCheckbox, {
            modelValue: selection.isAllSelected.value,
            indeterminate: selection.isIndeterminate.value,
            onChange: () => emit("selectionChange", selection.toggleAll()),
          }),
        cellRenderer: ({ rowData }) =>
          h(ElCheckbox, {
            modelValue: selection.isRowSelected(rowData as Record<string, unknown>),
            onChange: () =>
              emit("selectionChange", selection.toggleRow(rowData as Record<string, unknown>)),
          }),
      };
    }

    if (col.type === "index") {
      return {
        key: col.key,
        dataKey: col.key,
        title: "",
        width: w,
        align,
        cellRenderer: ({ rowIndex }) =>
          h("span", { class: "crud-base-table__virtual-cell" }, String(rowIndex + 1)),
      };
    }

    if (col.type === "switch") {
      return {
        key: col.key,
        dataKey: col.key,
        title: String(col.label ?? col.title ?? col.key),
        width: w,
        align: "center",
        cellRenderer: ({ rowData }) => {
          const row = rowData as Record<string, unknown>;
          return h(CellSwitch, {
            row,
            colKey: col.key,
            activeValue: col.activeValue as string | number | boolean,
            inactiveValue: col.inactiveValue as string | number | boolean,
            disabled: Boolean(col.disabled),
            beforeChange: col.beforeChange ? () => col.beforeChange!(row, col) : undefined,
          });
        },
      };
    }

    if (col.type === "tableSlot") {
      return {
        key: col.key,
        dataKey: col.key,
        title: String(col.label ?? col.title ?? col.key),
        width: w,
        align,
        cellRenderer: ({ rowData }) =>
          h(TableSlotPopup, {
            row: rowData as Record<string, unknown>,
            column: col,
          }),
      };
    }

    if (col.type === "status-custom") {
      const nc = normalizeColumn(col);
      const noTip = nc.showOverflowTooltip === false;
      return {
        key: col.key,
        dataKey: col.key,
        title: String(col.label ?? col.title ?? col.key),
        width: w,
        align: "left",
        cellRenderer: ({ rowData, rowIndex }) =>
          h(CellStatusCustom, {
            column: col,
            row: rowData as Record<string, unknown>,
            rowIndex,
            noTooltip: noTip,
          }),
      };
    }

    const nc = normalizeColumn(col);
    const noTip = nc.showOverflowTooltip === false;
    return {
      key: col.key,
      dataKey: col.key,
      title: String(col.label ?? col.title ?? col.key),
      width: w,
      align,
      cellRenderer: ({ rowData, rowIndex }) =>
        h(
          "span",
          {
            class: "crud-base-table__virtual-cell",
            ...(noTip ? { "data-no-tooltip": "" } : {}),
          },
          formatCell(col, rowData as Record<string, unknown>, rowIndex),
        ),
    };
  });
}
</script>

<template>
  <div
    class="crud-base-table__virtual"
    @mouseover="onCellMouseover"
    @mouseleave="onContainerMouseleave"
  >
    <ElAutoResizer>
      <template #default="{ height, width }">
        <ElTableV2
          v-if="width > 0 && height > 0"
          :columns="v2columnsAt(width)"
          :data="tableData"
          :width="width"
          :height="height"
          :row-height="props.rowHeight"
          :header-height="props.headerHeight"
          fixed
        />
      </template>
    </ElAutoResizer>
    <ElTooltip
      v-if="virtualTooltipRef"
      :virtual-ref="virtualTooltipRef"
      virtual-triggering
      :visible="tooltipVisible"
      :content="tooltipContent"
      placement="top"
      :teleported="true"
      :show-arrow="true"
      :offset="8"
      :enterable="false"
      :popper-class="TABLE_TOOLTIP_POPPER_CLASS"
    />
  </div>
</template>

<style scoped lang="scss">
.crud-base-table__virtual {
  height: 100%;
  min-height: 0;
}

:deep(.crud-base-table__virtual-cell) {
  display: inline-block;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
