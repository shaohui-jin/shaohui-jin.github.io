<script setup lang="ts">
import { ref } from "vue";
import { ElDrawer, ElButton, ElSwitch, ElRadioGroup, ElRadioButton, ElIcon } from "element-plus";
import { cloneDeep } from "lodash-es";
import type { BaseColumnSettingColumn } from "@/type/crud";

defineOptions({ name: "BaseColumnSetting" });

const props = withDefaults(
  defineProps<{
    columns: BaseColumnSettingColumn[];
    title?: string;
    drawerWidth?: string;
  }>(),
  {
    title: "表格设置",
    drawerWidth: "592px",
  },
);

const emit = defineEmits<{
  "update:columns": [columns: BaseColumnSettingColumn[]];
  confirm: [columns: BaseColumnSettingColumn[]];
}>();

const FIRST_TYPES = new Set(["selection", "expand", "index"]);
const LAST_TYPES = new Set(["action", "editColumn"]);

const showSetting = ref(false);
const _columns = ref<BaseColumnSettingColumn[]>([]);
const firstColumns = ref<BaseColumnSettingColumn[]>([]);
const lastColumns = ref<BaseColumnSettingColumn[]>([]);

function initColumns() {
  const cols = cloneDeep(props.columns).map((e) => {
    if (!Object.prototype.hasOwnProperty.call(e, "show")) {
      e.show = true;
    }
    if (!Object.prototype.hasOwnProperty.call(e, "fixed")) {
      e.fixed = undefined;
    }
    return e;
  });

  firstColumns.value = cols.filter((e) => FIRST_TYPES.has(e.type ?? ""));
  lastColumns.value = cols.filter((e) => LAST_TYPES.has(e.type ?? ""));
  _columns.value = cols.filter(
    (e) => !FIRST_TYPES.has(e.type ?? "") && !LAST_TYPES.has(e.type ?? ""),
  );
}

function confirm() {
  const fixedLeft = _columns.value.filter((e) => e.fixed === "left");
  const fixedRight = _columns.value.filter((e) => e.fixed === "right");
  const rest = _columns.value.filter((e) => e.fixed !== "left" && e.fixed !== "right");

  const result = [
    ...firstColumns.value,
    ...fixedLeft,
    ...rest,
    ...fixedRight,
    ...lastColumns.value,
  ];

  emit("update:columns", result);
  emit("confirm", result);
  close();
}

function open() {
  initColumns();
  showSetting.value = true;
}

function close() {
  showSetting.value = false;
}

// ---- 原生拖拽排序 ----
const dragIndex = ref(-1);
const dropIndex = ref(-1);

function onDragStart(idx: number, e: DragEvent) {
  dragIndex.value = idx;
  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = "move";
  }
}

function onDragOver(idx: number, e: DragEvent) {
  e.preventDefault();
  if (e.dataTransfer) {
    e.dataTransfer.dropEffect = "move";
  }
  dropIndex.value = idx;
}

function onDrop(idx: number) {
  if (dragIndex.value < 0 || dragIndex.value === idx) return;
  const items = [..._columns.value];
  const [moved] = items.splice(dragIndex.value, 1);
  items.splice(idx, 0, moved);
  _columns.value = items;
  dragIndex.value = -1;
  dropIndex.value = -1;
}

function onDragEnd() {
  dragIndex.value = -1;
  dropIndex.value = -1;
}

defineExpose({ open });
</script>

<template>
  <ElDrawer
    v-model="showSetting"
    :before-close="close"
    :title="title"
    :size="drawerWidth"
    class="crud-base-column-setting"
  >
    <div class="crud-base-column-setting__body">
      <table class="crud-base-column-setting__table">
        <thead>
          <tr>
            <th class="crud-base-column-setting__col--drag"></th>
            <th class="crud-base-column-setting__col--name">字段名称</th>
            <th class="crud-base-column-setting__col--show">显隐</th>
            <th class="crud-base-column-setting__col--fixed">冻结列设置</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(col, idx) in _columns"
            :key="col.key"
            :class="{
              'is-dragging': dragIndex === idx,
              'is-drop-target': dropIndex === idx && dropIndex !== dragIndex,
            }"
            draggable="true"
            @dragstart="onDragStart(idx, $event)"
            @dragover="onDragOver(idx, $event)"
            @drop="onDrop(idx)"
            @dragend="onDragEnd"
          >
            <td class="crud-base-column-setting__col--drag">
              <ElIcon :size="20" class="crud-base-column-setting__drag-handle">
                <svg viewBox="0 0 12 20" width="12" height="20" fill="none">
                  <path
                    d="M5 3V5H3V3H5ZM9 3V5H7V3H9ZM5 7V9H3V7H5ZM9 7V9H7V7H9ZM5 11V13H3V11H5ZM9 11V13H7V11H9ZM5 15V17H3V15H5ZM9 15V17H7V15H9Z"
                    fill="currentColor"
                    fill-rule="evenodd"
                  />
                </svg>
              </ElIcon>
            </td>
            <td class="crud-base-column-setting__col--name">
              {{ col.label ?? col.title ?? col.key }}
            </td>
            <td class="crud-base-column-setting__col--show">
              <ElSwitch v-model="col.show" />
            </td>
            <td class="crud-base-column-setting__col--fixed">
              <ElRadioGroup v-model="col.fixed" size="small">
                <ElRadioButton label="left">左</ElRadioButton>
                <ElRadioButton :label="undefined">无</ElRadioButton>
                <ElRadioButton label="right">右</ElRadioButton>
              </ElRadioGroup>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <template #footer>
      <div class="crud-base-column-setting__footer">
        <ElButton @click="close">取消</ElButton>
        <ElButton type="primary" @click="confirm">确定</ElButton>
      </div>
    </template>
  </ElDrawer>
</template>

<style lang="scss">
.crud-base-column-setting {
  .el-drawer__header {
    margin-bottom: 0;
    padding: 20px 20px 10px;
  }
}

@media (width <= 768px) {
  .crud-base-column-setting.el-drawer {
    width: 100% !important;
  }
}
</style>

<style lang="scss" scoped>
@use "@/style/variables" as *;

.crud-base-column-setting__body {
  overflow: auto;
  max-height: 760px;
}

.crud-base-column-setting__table {
  width: 100%;
  min-width: 500px;
  border-collapse: collapse;
  font-size: 14px;

  th,
  td {
    height: 40px;
    padding: 0 8px;
    text-align: left;
    border-bottom: 1px solid $lib-border-color;
  }

  thead th {
    font-weight: 600;
    color: $lib-text-regular;
    background: $lib-bg-page;
  }

  tbody tr {
    transition: background-color 0.15s;

    &:hover {
      background: $lib-bg-page;
    }

    &.is-dragging {
      opacity: 0.5;
    }

    &.is-drop-target {
      border-top: 2px solid $lib-color-primary;
    }
  }
}

.crud-base-column-setting__col--drag {
  width: 44px;
  text-align: center;
}

.crud-base-column-setting__col--name {
  width: 240px;
}

.crud-base-column-setting__col--show {
  width: 120px;
}

.crud-base-column-setting__col--fixed {
  width: 140px;
}

.crud-base-column-setting__drag-handle {
  cursor: move;
  color: $lib-neutral-icon;
}

.crud-base-column-setting__footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

:deep(.el-radio-button__inner) {
  padding: 3px 8px;
}
</style>
