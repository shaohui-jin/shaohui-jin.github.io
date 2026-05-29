<script setup lang="ts">
import { computed, ref } from "vue";
import { ElButton } from "element-plus";
import BaseSearch from "../base-search/BaseSearch.vue";
import BaseSearchDrawer from "../base-search-drawer/BaseSearchDrawer.vue";
import BaseTable from "../base-table/BaseTable.vue";
import BaseColumnSetting from "../base-column-setting/BaseColumnSetting.vue";
import { stripEditColumn, withEditColumn } from "../base-table/utils/column";
import type { BaseCrudEmits, BaseCrudProps } from "@/type/crud";

defineOptions({ name: "BaseCrud" });

const props = withDefaults(defineProps<BaseCrudProps>(), {
  searchModel: () => ({}),
  searchParams: () => [],
  drawerParams: () => [],
  loading: false,
  tableHeight: "420px",
  rowKey: "id",
  showColumnSetting: true,
  paramOptions: () => ({}),
});

const emit = defineEmits<BaseCrudEmits>();

const columnSettingRef = ref<InstanceType<typeof BaseColumnSetting>>();
const searchDrawerRef = ref<InstanceType<typeof BaseSearchDrawer>>();

const searchModel = computed({
  get: () => props.searchModel,
  set: (value) => emit("update:searchModel", value),
});

const columnsModel = computed({
  get: () => stripEditColumn(props.columns),
  set: (value) => emit("update:columns", stripEditColumn(value)),
});

const tableColumns = computed(() =>
  withEditColumn(columnsModel.value, props.showColumnSetting && props.mode === "element"),
);

function handleSearch(formData: Record<string, unknown>) {
  emit("search", formData);
}

function handleReset() {
  emit("reset");
}

function handleColumnConfirm(columns: typeof props.columns) {
  emit("columnConfirm", stripEditColumn(columns));
}

function openColumnSetting() {
  columnSettingRef.value?.open();
}

function openSearchDrawer() {
  searchDrawerRef.value?.open();
}

defineExpose({
  openColumnSetting,
  openSearchDrawer,
  columnSettingRef,
  searchDrawerRef,
});
</script>

<template>
  <div class="crud-base-crud">
    <BaseSearch
      v-if="searchParams.length > 0"
      v-model="searchModel"
      :params="searchParams"
      :loading="loading"
      :param-options="paramOptions"
      @search="handleSearch"
      @reset="handleReset"
    />

    <div class="crud-base-crud__table">
      <BaseTable
        :mode="mode"
        :table-data="tableData"
        :columns="tableColumns"
        :loading="loading"
        :height="tableHeight"
        :row-key="rowKey"
        @selection-change="emit('selectionChange', $event)"
        @edit-column="openColumnSetting"
      >
        <template v-if="drawerParams.length > 0 || $slots.toolbar" #toolbar>
          <div class="crud-base-crud__toolbar">
            <ElButton v-if="drawerParams.length > 0" @click="openSearchDrawer">高级筛选</ElButton>
            <slot name="toolbar" />
          </div>
        </template>
      </BaseTable>
    </div>

    <BaseSearchDrawer
      v-if="drawerParams.length > 0"
      ref="searchDrawerRef"
      v-model="searchModel"
      :params="drawerParams"
      :param-options="paramOptions"
      @search="handleSearch"
      @reset="handleReset"
    />

    <BaseColumnSetting
      v-if="showColumnSetting"
      ref="columnSettingRef"
      v-model:columns="columnsModel"
      @confirm="handleColumnConfirm"
    />
  </div>
</template>

<style scoped lang="scss">
@use "@/style/variables" as *;

$crud-inline-padding: 16px;
$crud-stack-gap: var(--comp-font-size-base, 14px);

.crud-base-crud {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-width: 0;
}

.crud-base-crud__table {
  box-sizing: border-box;
  padding: 0 $crud-inline-padding $crud-stack-gap;
}

.crud-base-crud__toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-start;
  gap: 8px;
  padding: 0 0 $crud-stack-gap;
}

@media (max-width: 768px) {
  .crud-base-crud__table {
    padding-inline: 12px;
  }

  .crud-base-crud__toolbar {
    :deep(.el-button) {
      min-height: 36px;
    }
  }
}
</style>
