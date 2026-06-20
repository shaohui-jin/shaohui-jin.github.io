<script setup lang="ts">
import { ref } from "vue";
import {
  BaseCrud,
  type SearchFieldConfig,
  type BaseColumnSettingColumn,
} from "jsh-comp";
import type { ApiRow, ComponentApi } from "../../type/types";
import ApiTable from "../ApiTable.vue";
import DemoWidgetTabs from "../DemoWidgetTabs.vue";
import { demoCodes } from "../demoCodes";

// ==================== 演示数据 ====================

const sourceData = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  name: `项目 ${i + 1}`,
  category: ["A类", "B类", "C类"][i % 3],
  status: i % 2 === 0 ? 1 : 0,
  amount: (Math.random() * 10000).toFixed(2),
  remark: i % 4 === 0 ? "备注较长用于测试" : "正常",
}));

const tableData = ref([...sourceData]);
const searchModel = ref<Record<string, unknown>>({});
const loading = ref(false);
const lastEvent = ref("—");

const searchParams: SearchFieldConfig[] = [
  { key: "searchKeyword", label: "关键词", placeholder: "请输入", labelWidth: "80px", fixed: true },
  { key: "category", label: "分类", placeholder: "请输入", labelWidth: "70px", fixed: true },
  {
    key: "status",
    label: "状态",
    type: "select",
    labelWidth: "70px",
    fixed: true,
    options: [
      { name: "启用", value: 1 },
      { name: "禁用", value: 0 },
    ],
  },
];

const drawerParams: SearchFieldConfig[] = [
  { key: "amountMin", label: "最小金额", placeholder: "请输入", labelWidth: "80px" },
  { key: "remark", label: "备注", placeholder: "请输入", labelWidth: "70px" },
];

const columns = ref<BaseColumnSettingColumn[]>([
  { key: "selection", type: "selection", width: 36 },
  { key: "index", type: "index", width: 36 },
  { key: "id", label: "ID", width: 72 },
  { key: "name", label: "名称", width: 140 },
  { key: "category", label: "分类", width: 100 },
  { key: "status", label: "状态", width: 88 },
  { key: "amount", label: "金额", width: 100 },
  { key: "remark", label: "备注" },
]);

function matchRow(row: Record<string, unknown>, filters: Record<string, unknown>) {
  return Object.entries(filters).every(([key, value]) => {
    if (value === undefined || value === null || value === "") return true;
    const cell = row[key];
    if (key === "searchKeyword") {
      return String(row.name ?? "").includes(String(value));
    }
    if (key === "amountMin") {
      return Number(row.amount) >= Number(value);
    }
    return String(cell ?? "").includes(String(value));
  });
}

function runQuery(filters: Record<string, unknown>) {
  loading.value = true;
  window.setTimeout(() => {
    tableData.value = sourceData.filter((row) => matchRow(row, filters));
    loading.value = false;
  }, 300);
}

function onSearch(filters: Record<string, unknown>) {
  lastEvent.value = `search: ${JSON.stringify(filters)}`;
  runQuery(filters);
}

function onReset() {
  searchModel.value = {};
  tableData.value = [...sourceData];
  lastEvent.value = "reset";
}

function onColumnConfirm(cols: BaseColumnSettingColumn[]) {
  const visible = cols.filter((c) => c.show !== false).length;
  lastEvent.value = `columnConfirm: ${visible} 列可见`;
}

// ==================== API 文档 ====================

const api: ComponentApi = {
  props: [
    { name: "mode", type: "BaseTableMode", default: "—", required: true, desc: "表格渲染模式" },
    {
      name: "columns",
      type: "BaseColumnSettingColumn[]",
      default: "—",
      required: true,
      desc: "列配置（v-model:columns）",
    },
    {
      name: "tableData",
      type: "Record<string, unknown>[]",
      default: "—",
      required: true,
      desc: "表格数据",
    },
    {
      name: "searchModel",
      type: "Record<string, unknown>",
      default: "{}",
      required: false,
      desc: "搜索表单（v-model:searchModel）",
    },
    {
      name: "searchParams",
      type: "BaseSearchField[]",
      default: "[]",
      required: false,
      desc: "搜索栏字段，为空时不渲染 BaseSearch",
    },
    {
      name: "drawerParams",
      type: "BaseSearchField[]",
      default: "[]",
      required: false,
      desc: "高级筛选字段，为空时不显示入口",
    },
    { name: "loading", type: "boolean", default: "false", required: false, desc: "加载状态" },
    {
      name: "tableHeight",
      type: "string",
      default: '"420px"',
      required: false,
      desc: "表格高度",
    },
    { name: "rowKey", type: "string", default: '"id"', required: false, desc: "行主键字段" },
    {
      name: "showColumnSetting",
      type: "boolean",
      default: "true",
      required: false,
      desc: "是否显示列设置入口",
    },
    {
      name: "paramOptions",
      type: "Record<string, BaseSearchFieldOption[]>",
      default: "{}",
      required: false,
      desc: "搜索字段异步选项",
    },
  ] as ApiRow[],
  events: [
    {
      name: "update:searchModel",
      payload: "Record<string, unknown>",
      desc: "搜索表单变更",
    },
    {
      name: "update:columns",
      payload: "BaseColumnSettingColumn[]",
      desc: "列配置变更",
    },
    { name: "search", payload: "Record<string, unknown>", desc: "查询或高级筛选确定" },
    { name: "reset", payload: "—", desc: "重置搜索" },
    {
      name: "selectionChange",
      payload: "Record<string, unknown>[]",
      desc: "表格多选变化",
    },
    {
      name: "columnConfirm",
      payload: "BaseColumnSettingColumn[]",
      desc: "列设置确认",
    },
  ],
  slots: [{ name: "toolbar", desc: "表格工具栏左侧扩展区" }],
  notes: [
    "组合 BaseSearch、BaseTable、BaseColumnSetting、BaseSearchDrawer，统一搜索与表格联动",
    "高级筛选入口位于表格左上角；列设置通过表格最右侧 editColumn 列（Setting 图标）打开",
    "editColumn 列 fixed: right、无右边框，不参与 BaseColumnSetting 排序与显隐",
    "search / reset 事件需由使用方拉取数据并更新 tableData",
    "空字符串搜索值不会写入 searchModel（继承 BaseSearch 行为）",
    "通过 ref 可调用 openColumnSetting()、openSearchDrawer()",
  ],
};

</script>

<template>
  <div class="doc-content__header">
    <h2>BaseCrud CRUD 联动</h2>
    <p>组合搜索栏、表格、列设置与高级筛选，提供开箱即用的 CRUD 页面骨架</p>
  </div>

  <DemoWidgetTabs :code="demoCodes.baseCrud" flush>
    <BaseCrud
      mode="element"
      v-model:search-model="searchModel"
      v-model:columns="columns"
      :search-params="searchParams"
      :drawer-params="drawerParams"
      :table-data="tableData"
      :loading="loading"
      table-height="360px"
      @search="onSearch"
      @reset="onReset"
      @column-confirm="onColumnConfirm"
    />
    <template #footer>
      <p class="widget-hint">最近事件：{{ lastEvent }}</p>
    </template>
  </DemoWidgetTabs>

  <div class="api-section">
    <h3 class="api-section__title">BaseCrud Props</h3>
    <ApiTable type="props" :rows="api.props" />
  </div>

  <div class="api-section">
    <h3 class="api-section__title">BaseCrud Events</h3>
    <ApiTable type="events" :rows="api.events!" />
  </div>

  <div class="api-section">
    <h3 class="api-section__title">BaseCrud Slots</h3>
    <ApiTable type="slots" :rows="api.slots!" />
  </div>

  <div v-if="api.notes?.length" class="api-section">
    <h3 class="api-section__title">特殊说明</h3>
    <ul class="api-notes-list">
      <li v-for="(note, i) in api.notes" :key="i">{{ note }}</li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
@use "../../style/variables" as *;
@use "../../style/demo";
</style>
