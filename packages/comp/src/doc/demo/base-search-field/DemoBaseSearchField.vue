<script setup lang="ts">
import { ref } from "vue";
import { ElForm, ElFormItem } from "element-plus";
import {
  BaseSearchField,
  type SearchFieldConfig,
} from "jsh-comp";
import type { ApiRow, ComponentApi } from "../../type/types";
import ApiTable from "../ApiTable.vue";
import DemoWidgetTabs from "../DemoWidgetTabs.vue";
import { demoCodes } from "../demoCodes";

// ==================== 演示数据 ====================

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

const formData = ref<Record<string, unknown>>({
  searchKeyword: "",
  status: "",
  dateRange: "",
  priority: "medium",
});

const lastEvent = ref("—");

function onChange(payload: unknown) {
  lastEvent.value = `change: ${JSON.stringify(payload)}`;
}

function onEnter() {
  lastEvent.value = "enter: 回车触发";
}

// ==================== API 文档 ====================

const api: ComponentApi = {
  props: [
    {
      name: "field",
      type: "BaseSearchField",
      default: "—",
      required: true,
      desc: "字段配置对象，结构与 BaseSearch / BaseSearchDrawer 的 params 项一致",
    },
    {
      name: "modelValue / v-model",
      type: "unknown",
      default: "—",
      required: true,
      desc: "当前字段值双向绑定",
    },
    {
      name: "paramOptions",
      type: "BaseSearchFieldOption[]",
      default: "[]",
      required: false,
      desc: "异步加载的选项，field.options 为空时使用",
    },
  ],
  events: [
    { name: "change", payload: "unknown", desc: "字段值变化时触发" },
    { name: "enter", payload: "—", desc: "输入框回车时触发（field.keydownSearch !== false）" },
  ],
  notes: [
    "BaseSearch 与 BaseSearchDrawer 内部均使用本组件渲染单个表单项",
    "支持 input / textarea / select / date 系列 / cascader / tree-select / radio-group",
    "可单独用于自定义搜索表单布局，无需嵌套 BaseSearch",
  ],
};

const fieldConfigApi: ApiRow[] = [
  { name: "key", type: "string", default: "—", required: true, desc: "表单值字段名" },
  { name: "label", type: "string", default: "—", required: true, desc: "标签文本" },
  { name: "labelWidth", type: "string", default: '"70px"', required: false, desc: "标签宽度" },
  { name: "placeholder", type: "string", default: "—", required: false, desc: "占位文本" },
  {
    name: "fixed",
    type: "boolean",
    default: "false",
    required: false,
    desc: "是否在 BaseSearch 中固定显示（不折叠）",
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
    desc: "select / radio-group 的选项列表",
  },
  { name: "clearable", type: "boolean", default: "true", required: false, desc: "是否可清空" },
  {
    name: "keydownSearch",
    type: "boolean",
    default: "true",
    required: false,
    desc: "按下回车时是否触发 enter 事件",
  },
];
</script>

<template>
  <div class="doc-content__header">
    <h2>BaseSearchField 搜索字段</h2>
    <p>根据字段配置渲染单个表单项，供 BaseSearch / BaseSearchDrawer 复用，也可独立使用</p>
  </div>

  <DemoWidgetTabs :code="demoCodes.baseSearchField">
    <ElForm :model="formData" label-width="90px" class="demo-search-field__form">
      <ElFormItem label="输入框">
        <BaseSearchField
          v-model="formData.searchKeyword"
          :field="inputField"
          @change="onChange"
          @enter="onEnter"
        />
      </ElFormItem>
      <ElFormItem label="下拉选择">
        <BaseSearchField v-model="formData.status" :field="selectField" @change="onChange" />
      </ElFormItem>
      <ElFormItem label="日期范围">
        <BaseSearchField v-model="formData.dateRange" :field="dateField" @change="onChange" />
      </ElFormItem>
      <ElFormItem label="单选组">
        <BaseSearchField v-model="formData.priority" :field="radioField" @change="onChange" />
      </ElFormItem>
    </ElForm>
    <p class="widget-hint">当前值：{{ JSON.stringify(formData) }}</p>
    <template #footer>
      <p class="widget-hint">最近事件：{{ lastEvent }}</p>
    </template>
  </DemoWidgetTabs>

  <div class="api-section">
    <h3 class="api-section__title">BaseSearchField Props</h3>
    <ApiTable type="props" :rows="api.props" />
  </div>

  <div class="api-section">
    <h3 class="api-section__title">BaseSearchField Events</h3>
    <ApiTable type="events" :rows="api.events!" />
  </div>

  <div class="api-section">
    <h3 class="api-section__title">field 配置项（BaseSearchField 类型）</h3>
    <ApiTable type="props" :rows="fieldConfigApi" />
  </div>

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

.demo-search-field__form {
  max-width: 480px;

  :deep(.el-input),
  :deep(.el-select),
  :deep(.el-date-editor) {
    width: 100%;
  }
}

@media (max-width: $doc-bp-mobile) {
  .demo-search-field__form {
    max-width: none;
  }
}
</style>
