<script setup lang="ts">
import { ref } from "vue";
import {
  BaseSearchDrawer,
  type SearchFieldConfig,
  type BaseSearchDrawerProps,
  type BaseSearchDrawerEmits,
} from "jsh-comp";
import type { ComponentApi } from "../../type/types";
import ApiTable from "../ApiTable.vue";
import DemoWidgetTabs from "../DemoWidgetTabs.vue";
import { demoCodes } from "../demoCodes";

// ==================== 演示数据 ====================

const drawerParams: SearchFieldConfig[] = [
  { key: "searchKeyword", label: "关键词", placeholder: "请输入" },
  { key: "serialNo", label: "编号", placeholder: "请输入" },
  {
    key: "status",
    label: "状态",
    type: "select",
    options: [
      { name: "启用", value: 1 },
      { name: "禁用", value: 0 },
    ],
  },
  {
    key: "priority",
    label: "优先级",
    type: "radio-group",
    options: [
      { name: "高", value: "high" },
      { name: "中", value: "medium" },
      { name: "低", value: "low" },
    ],
  },
  {
    key: "dateRange",
    label: "日期范围",
    type: "daterange",
    startPlaceholder: "开始日期",
    endPlaceholder: "结束日期",
  },
  { key: "remark", label: "备注", type: "textarea", placeholder: "请输入备注" },
];

const formData = ref<Record<string, unknown>>({});
const drawerRef = ref<InstanceType<typeof BaseSearchDrawer>>();
const lastEvent = ref("—");

function openDrawer() {
  drawerRef.value?.open();
}

function onSearch(data: Record<string, unknown>) {
  lastEvent.value = `search: ${JSON.stringify(data)}`;
}

function onReset() {
  lastEvent.value = "reset";
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
      name: "paramOptions",
      type: "Record<string, BaseSearchFieldOption[]>",
      default: "{}",
      required: false,
      desc: "异步加载的选项",
    },
    { name: "title", type: "string", default: '"高级筛选"', required: false, desc: "抽屉标题" },
    { name: "drawerWidth", type: "string", default: '"500px"', required: false, desc: "抽屉宽度" },
  ],
  events: [
    { name: "search", payload: "Record<string, unknown>", desc: "点击确定时触发，参数为表单数据" },
    { name: "reset", payload: "—", desc: "点击取消时触发，同时关闭抽屉并重置表单" },
  ],
  notes: [
    "通过 ref 调用 open() 方法打开抽屉",
    "支持 input / textarea / select / radio-group / date 等字段类型",
    "表单项由 BaseSearchField 组件渲染，字段配置类型与 BaseSearch 一致",
    "通过 defineExpose 暴露 open、formData、reset、search 方法",
  ],
};
</script>

<template>
  <div class="doc-content__header">
    <h2>BaseSearchDrawer 搜索抽屉</h2>
    <p>侧边抽屉式高级搜索表单，适用于复杂筛选场景</p>
  </div>

  <DemoWidgetTabs :code="demoCodes.baseSearchDrawer">
    <el-button type="primary" @click="openDrawer">打开搜索抽屉</el-button>
    <BaseSearchDrawer
      ref="drawerRef"
      v-model="formData"
      :params="drawerParams"
      @search="onSearch"
      @reset="onReset"
    />
    <template #footer>
      <p class="widget-hint">最近事件：{{ lastEvent }}</p>
    </template>
  </DemoWidgetTabs>

  <!-- Props -->
  <div class="api-section">
    <h3 class="api-section__title">BaseSearchDrawer Props</h3>
    <ApiTable type="props" :rows="api.props" />
  </div>

  <!-- Events -->
  <div class="api-section">
    <h3 class="api-section__title">BaseSearchDrawer Events</h3>
    <ApiTable type="events" :rows="api.events!" />
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
