<script setup lang="ts">
import { ref } from "vue";
import {
  BaseSearch,
  type SearchFieldConfig,
  type BaseSearchProps,
  type BaseSearchEmits,
} from "jsh-comp";
import type { ApiRow, ComponentApi } from "../../type/types";
import ApiTable from "../ApiTable.vue";
import DemoWidgetTabs from "../DemoWidgetTabs.vue";
import { demoCodes } from "../demoCodes";

// ==================== 演示数据 ====================

const searchParams: SearchFieldConfig[] = [
  {
    key: "searchKeyword",
    label: "关键词",
    placeholder: "请输入",
    labelWidth: "90px",
    fixed: true,
  },
  {
    key: "category",
    label: "分类",
    placeholder: "请输入",
    labelWidth: "90px",
    fixed: true,
  },
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
  {
    key: "remark",
    label: "备注",
    placeholder: "请输入",
    labelWidth: "70px",
  },
];

const formData = ref<Record<string, unknown>>({});
const lastEvent = ref("—");

function onSearch(data: Record<string, unknown>) {
  lastEvent.value = `search: ${JSON.stringify(data)}`;
}

function onReset() {
  lastEvent.value = "reset";
}

function onChange(payload: { field?: string; value: unknown }) {
  lastEvent.value = `change: ${payload.field} = ${payload.value}`;
}

// ==================== API 文档 ====================

const api: ComponentApi = {
  props: [
    {
      name: "params",
      type: "BaseSearchField[]",
      default: "—",
      required: true,
      desc: "搜索字段配置数组",
    },
    {
      name: "modelValue / v-model",
      type: "Record<string, unknown>",
      default: "—",
      required: true,
      desc: "表单数据双向绑定",
    },
    {
      name: "loading",
      type: "boolean",
      default: "false",
      required: false,
      desc: "查询按钮加载状态",
    },
    {
      name: "paramOptions",
      type: "Record<string, BaseSearchFieldOption[]>",
      default: "{}",
      required: false,
      desc: "异步加载的选项（key 为字段 key）",
    },
  ],
  events: [
    { name: "search", payload: "Record<string, unknown>", desc: "点击查询时触发，参数为表单数据" },
    { name: "reset", payload: "—", desc: "点击重置时触发" },
    { name: "change", payload: "{ field, value, formData }", desc: "字段值变化时触发" },
  ],
  notes: [
    "fixed: true 的字段始终显示，其余字段在点击「更多」后展开",
    "支持 input / select / date / daterange / datetime / datetimerange / cascader / tree-select 类型",
    "表单项由 BaseSearchField 组件渲染，详见 BaseSearchField 文档",
    "通过 defineExpose 暴露 formData、reset、search、toggleExpand 方法",
  ],
};

const fieldApi: ApiRow[] = [
  { name: "key", type: "string", default: "—", required: true, desc: "表单值字段名" },
  { name: "label", type: "string", default: "—", required: true, desc: "标签文本" },
  { name: "labelWidth", type: "string", default: '"70px"', required: false, desc: "标签宽度" },
  { name: "placeholder", type: "string", default: "—", required: false, desc: "占位文本" },
  {
    name: "fixed",
    type: "boolean",
    default: "false",
    required: false,
    desc: "是否固定显示（不折叠）",
  },
  {
    name: "type",
    type: "BaseSearchFieldType",
    default: '"input"',
    required: false,
    desc: "表单项类型",
  },
  {
    name: "options",
    type: "{ name, value }[]",
    default: "—",
    required: false,
    desc: "select 类型的选项列表",
  },
  { name: "clearable", type: "boolean", default: "true", required: false, desc: "是否可清空" },
  {
    name: "keydownSearch",
    type: "boolean",
    default: "true",
    required: false,
    desc: "按下回车时是否触发搜索",
  },
];
</script>

<template>
  <div class="doc-content__header">
    <h2>BaseSearch 搜索栏</h2>
    <p>配置式搜索表单，支持固定字段与可展开字段，覆盖常用表单类型</p>
  </div>

  <DemoWidgetTabs :code="demoCodes.baseSearch">
    <BaseSearch
      v-model="formData"
      :params="searchParams"
      @search="onSearch"
      @reset="onReset"
      @change="onChange"
    />
    <template #footer>
      <p class="widget-hint">最近事件：{{ lastEvent }}</p>
    </template>
  </DemoWidgetTabs>

  <!-- Props -->
  <div class="api-section">
    <h3 class="api-section__title">BaseSearch Props</h3>
    <ApiTable type="props" :rows="api.props" />
  </div>

  <!-- Events -->
  <div class="api-section">
    <h3 class="api-section__title">BaseSearch Events</h3>
    <ApiTable type="events" :rows="api.events!" />
  </div>

  <!-- params 字段配置 -->
  <div class="api-section">
    <h3 class="api-section__title">params 字段配置</h3>
    <p class="api-section__hint">
      字段配置类型为 BaseSearchField，组件级说明见 <strong>BaseSearchField</strong> 文档页。
    </p>
    <ApiTable type="props" :rows="fieldApi" />
  </div>

  <!-- Notes -->
  <div v-if="api.notes?.length" class="api-section">
    <h3 class="api-section__title">特殊说明</h3>
    <ul class="api-notes-list">
      <li v-for="(note, idx) in api.notes" :key="idx">{{ note }}</li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
@use "../../style/variables" as *;
@use "../../style/demo";
</style>
