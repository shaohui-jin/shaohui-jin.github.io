<script setup lang="ts">
import { computed, ref, shallowReactive } from "vue";
import { ElForm, ElFormItem } from "element-plus";
import {
  BaseColumnSetting,
  BaseCrud,
  BaseSearch,
  BaseSearchDrawer,
  BaseSearchField,
  BaseTable,
  stripEditColumn,
  withEditColumn,
  type BaseColumnSettingColumn,
  type BaseTableColumn,
  type BaseTableMode,
  type SearchFieldConfig,
} from "@/works/comp";

defineProps<{ name: string }>();

const modes: { label: string; value: BaseTableMode; desc: string; rows: number }[] = [
  { label: "Element Plus", value: "element", desc: "el-table 封装，能力最全", rows: 50 },
  { label: "Virtual Scroll", value: "virtual", desc: "el-table-v2 虚拟滚动", rows: 10_000 },
  { label: "Canvas 2D", value: "canvas", desc: "单 Canvas 视口重绘", rows: 100_000 },
  { label: "Canvas Tile", value: "canvas-tile", desc: "整表预渲染 + 视口裁切", rows: 5_000 },
  { label: "Skia WASM", value: "skia-wasm", desc: "CanvasKit 渲染", rows: 100_000 },
];
const activeMode = ref<BaseTableMode>("element");
const tableDataMap = shallowReactive<Record<string, Record<string, unknown>[]>>({});

function generateRows(count: number): Record<string, unknown>[] {
  return Object.freeze(
    Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      name: `项 ${i + 1}`,
      amount: (Math.random() * 1000000).toFixed(2),
      remark: i % 7 === 0 ? "备注较长用于测试截断" : "正常",
      status: i % 3 === 0 ? 1 : 2,
      "status-custom": i % 5,
      tableSlot: Array.from({ length: 2 + (i % 4) }, (_, j) => ({
        img: `https://picsum.photos/seed/${i * 10 + j}/60/60`,
        code: `TC-${String(i + 1).padStart(3, "0")}-${j + 1}`,
        name: `花色${["红", "蓝", "绿", "白"][j % 4]}`,
      })),
    })),
  ) as unknown as Record<string, unknown>[];
}

function ensureData(mode: BaseTableMode) {
  if (!tableDataMap[mode]) {
    const found = modes.find((item) => item.value === mode);
    if (found) tableDataMap[mode] = generateRows(found.rows);
  }
}
ensureData("element");

const tableColumns: BaseTableColumn[] = [
  { key: "selection", type: "selection", width: 36 },
  { key: "index", type: "index", width: 36 },
  { key: "id", label: "默认", width: 72 },
  { key: "amount", label: "超长", width: 70 },
  { key: "name", label: "名称", width: 140 },
  { key: "formatter", label: "formatter字段", width: 120, formatter: () => String(1212) },
  {
    key: "status",
    label: "switch状态",
    type: "switch",
    width: 100,
    activeValue: 1,
    inactiveValue: 2,
    beforeChange: () => window.confirm("确认切换？"),
  },
  {
    key: "status-custom",
    label: "status-custom字段",
    type: "status-custom",
    width: 160,
    colorMap: {
      0: "rgba(0, 85, 255, 1)",
      1: "rgba(103, 194, 58, 1)",
      2: "rgba(0, 85, 255, 1)",
      3: "rgba(103, 194, 58, 1)",
      4: "rgba(103, 194, 58, 1)",
    },
  },
  {
    key: "tableSlot",
    label: "tableSlot字段",
    width: 120,
    type: "tableSlot",
    filterPlaceholder: "请输入编码/名称",
    filter: (str: string, item: Record<string, unknown>) =>
      String(item.code ?? "").includes(str.trim()) || String(item.name ?? "").includes(str.trim()),
    columns: [
      { key: "index", type: "index", label: "序号", width: 60 },
      { key: "img", type: "image", label: "预览图", width: 80 },
      { key: "code", label: "编码", width: 80 },
      { key: "name", label: "名称", minWidth: 100 },
    ],
  },
  { key: "remark", label: "备注" },
];

const searchParams: SearchFieldConfig[] = [
  { key: "searchKeyword", label: "关键词", placeholder: "请输入", labelWidth: "90px", fixed: true },
  { key: "category", label: "分类", placeholder: "请输入", labelWidth: "90px", fixed: true },
  {
    key: "status",
    label: "状态",
    type: "select",
    options: [
      { name: "启用", value: 1 },
      { name: "禁用", value: 0 },
    ],
    labelWidth: "70px",
    fixed: true,
  },
  {
    key: "dateRange",
    label: "日期范围",
    type: "daterange",
    labelWidth: "80px",
    startPlaceholder: "开始日期",
    endPlaceholder: "结束日期",
  },
  { key: "remark", label: "备注", placeholder: "请输入", labelWidth: "70px" },
];
const searchForm = ref<Record<string, unknown>>({});
const searchEvent = ref("—");

const inputField: SearchFieldConfig = {
  key: "searchKeyword",
  label: "关键词",
  placeholder: "请输入关键词",
};
const selectField: SearchFieldConfig = {
  key: "status",
  label: "状态",
  type: "select",
  options: [
    { name: "启用", value: 1 },
    { name: "禁用", value: 0 },
  ],
};
const dateField: SearchFieldConfig = {
  key: "dateRange",
  label: "日期范围",
  type: "daterange",
  startPlaceholder: "开始日期",
  endPlaceholder: "结束日期",
};
const radioField: SearchFieldConfig = {
  key: "priority",
  label: "优先级",
  type: "radio-group",
  options: [
    { name: "高", value: "high" },
    { name: "中", value: "medium" },
    { name: "低", value: "low" },
  ],
};
const fieldForm = ref<Record<string, unknown>>({
  searchKeyword: "",
  status: "",
  dateRange: "",
  priority: "medium",
});
const fieldEvent = ref("—");

const drawerParams: SearchFieldConfig[] = [
  { key: "searchKeyword", label: "关键词", placeholder: "请输入" },
  {
    key: "status",
    label: "状态",
    type: "select",
    options: [
      { name: "启用", value: 1 },
      { name: "禁用", value: 0 },
    ],
  },
  { key: "remark", label: "备注", type: "textarea", placeholder: "请输入备注" },
];
const drawerForm = ref<Record<string, unknown>>({});
const drawerRef = ref<InstanceType<typeof BaseSearchDrawer>>();
const drawerEvent = ref("—");

const settingColumns = ref<BaseColumnSettingColumn[]>([
  { key: "selection", type: "selection", width: 36 },
  { key: "index", type: "index", width: 36 },
  { key: "id", label: "ID", width: 72 },
  { key: "name", label: "名称", width: 140 },
  { key: "status", label: "状态", width: 100 },
  { key: "remark", label: "备注" },
]);
const settingTableColumns = computed(() =>
  withEditColumn(settingColumns.value as BaseTableColumn[], true),
);
const settingData = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  name: `项目 ${i + 1}`,
  status: i % 2 === 0 ? "启用" : "禁用",
  remark: "正常",
}));
const settingRef = ref<InstanceType<typeof BaseColumnSetting>>();
const settingEvent = ref("—");

const crudSource = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  name: `项目 ${i + 1}`,
  category: ["A类", "B类", "C类"][i % 3],
  status: i % 2 === 0 ? 1 : 0,
  amount: (Math.random() * 10000).toFixed(2),
  remark: "正常",
}));
const crudData = ref([...crudSource]);
const crudSearch = ref<Record<string, unknown>>({});
const crudLoading = ref(false);
const crudEvent = ref("—");
const crudSearchParams: SearchFieldConfig[] = [
  { key: "searchKeyword", label: "关键词", placeholder: "请输入", fixed: true },
  {
    key: "status",
    label: "状态",
    type: "select",
    fixed: true,
    options: [
      { name: "启用", value: 1 },
      { name: "禁用", value: 0 },
    ],
  },
];
const crudDrawerParams: SearchFieldConfig[] = [
  { key: "remark", label: "备注", placeholder: "请输入" },
];
const crudColumns = ref<BaseColumnSettingColumn[]>([
  { key: "index", type: "index", width: 36 },
  { key: "id", label: "ID", width: 72 },
  { key: "name", label: "名称", width: 140 },
  { key: "status", label: "状态", width: 88 },
  { key: "amount", label: "金额", width: 100 },
]);

function onModeChange(name: string | number) {
  ensureData(String(name) as BaseTableMode);
}

function onSettingConfirm(cols: BaseColumnSettingColumn[]) {
  settingColumns.value = stripEditColumn(cols) as BaseColumnSettingColumn[];
  const visible = settingColumns.value.filter((col) => col.show !== false).length;
  settingEvent.value = `confirm: ${visible} 列可见`;
}

function onCrudReset() {
  crudSearch.value = {};
  crudData.value = [...crudSource];
  crudEvent.value = "reset";
}

function onCrudSearch(filters: Record<string, unknown>) {
  crudEvent.value = `search: ${JSON.stringify(filters)}`;
  crudLoading.value = true;
  window.setTimeout(() => {
    crudData.value = crudSource.filter((row) => {
      const keyword = filters.searchKeyword;
      if (keyword && !String(row.name).includes(String(keyword))) return false;
      if (filters.status !== undefined && filters.status !== "" && row.status !== filters.status) {
        return false;
      }
      return true;
    });
    crudLoading.value = false;
  }, 200);
}
</script>

<template>
  <div v-if="name === 'tables'" class="crud-preview__table">
    <el-tabs
      v-model="activeMode"
      class="crud-preview__tabs"
      type="border-card"
      @tab-change="onModeChange"
    >
      <el-tab-pane
        v-for="mode in modes"
        :key="mode.value"
        :label="mode.label"
        :name="mode.value"
        lazy
      >
        <div class="crud-preview__pane">
          <p class="widget-hint">{{ mode.desc }} · {{ mode.rows.toLocaleString() }} 行</p>
          <BaseTable
            :mode="mode.value"
            :table-data="tableDataMap[mode.value] ?? []"
            :columns="tableColumns"
            height="420px"
            :loading="!tableDataMap[mode.value]"
          />
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>

  <div v-else-if="name === 'base-search'">
    <BaseSearch
      v-model="searchForm"
      :params="searchParams"
      @search="searchEvent = `search: ${JSON.stringify($event)}`"
      @reset="searchEvent = 'reset'"
      @change="searchEvent = `change: ${JSON.stringify($event)}`"
    />
    <p class="widget-hint">最近事件：{{ searchEvent }}</p>
  </div>

  <div v-else-if="name === 'base-search-field'">
    <ElForm :model="fieldForm" label-width="90px">
      <ElFormItem label="输入框">
        <BaseSearchField
          v-model="fieldForm.searchKeyword"
          :field="inputField"
          @change="fieldEvent = `change: ${JSON.stringify($event)}`"
          @enter="fieldEvent = 'enter: 回车触发'"
        />
      </ElFormItem>
      <ElFormItem label="下拉选择">
        <BaseSearchField v-model="fieldForm.status" :field="selectField" />
      </ElFormItem>
      <ElFormItem label="日期范围">
        <BaseSearchField v-model="fieldForm.dateRange" :field="dateField" />
      </ElFormItem>
      <ElFormItem label="单选组">
        <BaseSearchField v-model="fieldForm.priority" :field="radioField" />
      </ElFormItem>
    </ElForm>
    <p class="widget-hint">当前值：{{ JSON.stringify(fieldForm) }} · {{ fieldEvent }}</p>
  </div>

  <div v-else-if="name === 'base-search-drawer'">
    <el-button type="primary" @click="drawerRef?.open()">打开搜索抽屉</el-button>
    <BaseSearchDrawer
      ref="drawerRef"
      v-model="drawerForm"
      :params="drawerParams"
      @search="drawerEvent = `search: ${JSON.stringify($event)}`"
      @reset="drawerEvent = 'reset'"
    />
    <p class="widget-hint">最近事件：{{ drawerEvent }}</p>
  </div>

  <div v-else-if="name === 'base-column-setting'">
    <BaseTable
      mode="element"
      :table-data="settingData"
      :columns="settingTableColumns"
      height="320px"
      @edit-column="settingRef?.open()"
    />
    <BaseColumnSetting
      ref="settingRef"
      v-model:columns="settingColumns"
      @confirm="onSettingConfirm"
    />
    <p class="widget-hint">最近事件：{{ settingEvent }}</p>
  </div>

  <div v-else-if="name === 'base-crud'">
    <BaseCrud
      v-model:search-model="crudSearch"
      v-model:columns="crudColumns"
      mode="element"
      :search-params="crudSearchParams"
      :drawer-params="crudDrawerParams"
      :table-data="crudData"
      :loading="crudLoading"
      table-height="360px"
      @search="onCrudSearch"
      @reset="onCrudReset"
      @column-confirm="crudEvent = 'columnConfirm'"
    />
    <p class="widget-hint">最近事件：{{ crudEvent }}</p>
  </div>
</template>

<style scoped lang="scss">
@use "@/styles/site/variables" as *;
@use "../style/el-overrides" as *;
@use "../style/demo";

.crud-preview__tabs {
  @include el-tabs-border-card;
}

.crud-preview__pane {
  padding: 12px 0;
  background: $doc-bg-card;
}

.widget-hint {
  margin-top: 8px;
}
</style>
