<script setup lang="ts">
import { computed } from "vue";
import { tableLayoutDefaults, tableSurfaceCssVars } from "./theme/tableSurface";
import { useLibConfig } from "../../../config/useLibConfig";
import type { LibConfig } from "../../../config/configTypes";
import type { BaseTableProps, BaseTableEmits } from "./types";
import BaseTableCanvas from "./modes/BaseTableCanvas.vue";
import BaseTableCanvasTile from "./modes/BaseTableCanvasTile.vue";
import BaseTableElement from "./modes/BaseTableElement.vue";
import BaseTableSkiaWasm from "./modes/BaseTableSkiaWasm.vue";
import BaseTableVirtual from "./modes/BaseTableVirtual.vue";

defineOptions({ name: "BaseTable" });

const props = withDefaults(defineProps<BaseTableProps & { theme?: LibConfig }>(), {
  height: "420px",
  rowKey: "id",
  loading: false,
  emptyText: "暂无数据",
  rowHeight: tableLayoutDefaults.rowHeight,
  headerHeight: tableLayoutDefaults.headerHeight,
  maxPrerenderPixels: 12_000_000,
  skiaWasmBaseUrl: undefined,
  theme: undefined,
});

const emit = defineEmits<BaseTableEmits>();

const config = useLibConfig(() => props.theme);

function onSelectionChange(rows: Record<string, unknown>[]) {
  emit("selectionChange", rows);
}

function onEditColumn() {
  emit("editColumn");
}

const surfaceStyle = computed(() =>
  tableSurfaceCssVars(config.value, props.rowHeight, props.headerHeight),
);
</script>

<template>
  <div class="crud-base-table" :style="{ height, ...surfaceStyle }">
    <div v-if="$slots.toolbar" class="crud-base-table__toolbar">
      <slot name="toolbar" />
    </div>
    <div class="crud-base-table__main">
      <KeepAlive>
        <BaseTableElement
          v-if="mode === 'element'"
          :table-data="tableData"
          :columns="columns"
          :row-key="rowKey"
          :empty-text="emptyText"
          :loading="loading"
          @selection-change="onSelectionChange"
          @edit-column="onEditColumn"
        />
        <BaseTableVirtual
          v-else-if="mode === 'virtual'"
          :table-data="tableData"
          :columns="columns"
          :row-height="rowHeight"
          :header-height="headerHeight"
          :row-key="rowKey"
          @selection-change="onSelectionChange"
        />
        <BaseTableCanvas
          v-else-if="mode === 'canvas'"
          :table-data="tableData"
          :columns="columns"
          :row-height="rowHeight"
          :header-height="headerHeight"
          :empty-text="emptyText"
          :row-key="rowKey"
          @selection-change="onSelectionChange"
        />
        <BaseTableCanvasTile
          v-else-if="mode === 'canvas-tile'"
          :table-data="tableData"
          :columns="columns"
          :row-height="rowHeight"
          :header-height="headerHeight"
          :empty-text="emptyText"
          :max-prerender-pixels="maxPrerenderPixels"
          :row-key="rowKey"
          @selection-change="onSelectionChange"
        />
        <BaseTableSkiaWasm
          v-else-if="mode === 'skia-wasm'"
          :table-data="tableData"
          :columns="columns"
          :row-height="rowHeight"
          :header-height="headerHeight"
          :empty-text="emptyText"
          :skia-wasm-base-url="skiaWasmBaseUrl"
          :row-key="rowKey"
          @selection-change="onSelectionChange"
        />
      </KeepAlive>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "./theme/table-surface";

.crud-base-table {
  display: flex;
  flex-direction: column;
  min-height: 0;
  width: 100%;
}

.crud-base-table__toolbar {
  flex: none;
}

.crud-base-table__main {
  flex: 1 1 0;
  min-height: 0;
  position: relative;
}
</style>
