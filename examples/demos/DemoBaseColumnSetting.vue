<script setup lang="ts">
import { computed, ref } from "vue";
import {
  BaseTable,
  BaseColumnSetting,
  withEditColumn,
  stripEditColumn,
  type BaseTableColumn,
  type BaseColumnSettingColumn,
} from "comp-vue-lib";
import type { ComponentApi } from "./types";
import ApiTable from "./ApiTable.vue";
import DemoWidgetTabs from "./DemoWidgetTabs.vue";
import { demoCodes } from "./demoCodes";

// ==================== 演示数据 ====================

const columns = ref<BaseColumnSettingColumn[]>([
  { key: "selection", type: "selection", width: 36 },
  { key: "index", type: "index", width: 36 },
  { key: "id", label: "ID", width: 72 },
  { key: "name", label: "名称", width: 140 },
  { key: "amount", label: "金额", width: 100 },
  { key: "status", label: "状态", width: 100 },
  { key: "category", label: "分类", width: 120 },
  { key: "remark", label: "备注" },
]);

const tableColumns = computed(() => withEditColumn(columns.value as BaseTableColumn[], true));

const tableData = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  name: `项目 ${i + 1}`,
  amount: (Math.random() * 10000).toFixed(2),
  status: i % 2 === 0 ? "启用" : "禁用",
  category: ["A类", "B类", "C类"][i % 3],
  remark: i % 5 === 0 ? "这是一段较长的备注信息" : "正常",
}));

const settingRef = ref<InstanceType<typeof BaseColumnSetting>>();
const lastEvent = ref("—");

function openSetting() {
  settingRef.value?.open();
}

function onConfirm(cols: BaseColumnSettingColumn[]) {
  columns.value = stripEditColumn(cols) as BaseColumnSettingColumn[];
  const visible = columns.value.filter((c) => c.show !== false).length;
  lastEvent.value = `confirm: ${visible} 列可见`;
}

// ==================== API 文档 ====================

const api: ComponentApi = {
  props: [
    {
      name: "columns",
      type: "BaseColumnSettingColumn[]",
      default: "—",
      required: true,
      desc: "列配置数组（v-model:columns）",
    },
    { name: "title", type: "string", default: '"表格设置"', required: false, desc: "抽屉标题" },
    { name: "drawerWidth", type: "string", default: '"592px"', required: false, desc: "抽屉宽度" },
  ],
  events: [
    {
      name: "update:columns",
      payload: "BaseColumnSettingColumn[]",
      desc: "确认后触发，参数为更新后的列配置",
    },
    { name: "confirm", payload: "BaseColumnSettingColumn[]", desc: "点击确定时触发" },
  ],
  notes: [
    "推荐配合 BaseTable 的 editColumn 列：表头 Setting 图标触发 open()，与 BaseCrud 一致",
    "editColumn 列使用 withEditColumn() 追加，不参与本面板排序与显隐",
    "selection / index / expand 类型的列不会在设置面板中显示",
    "支持拖拽排序、显隐切换、冻结列设置（左 / 无 / 右）",
    "确认时会按 fixed 位置重新排列：左冻结 → 正常 → 右冻结",
    "列配置类型 BaseColumnSettingColumn 继承自 BaseTableColumn，新增 fixed 字段",
  ],
};

</script>

<template>
  <div class="doc-content__header">
    <h2>BaseColumnSetting 列设置</h2>
    <p>表格列配置面板，支持拖拽排序、显隐切换和冻结列设置</p>
  </div>

  <DemoWidgetTabs :code="demoCodes.baseColumnSetting" flush>
    <BaseTable
      mode="element"
      :table-data="tableData"
      :columns="tableColumns"
      height="360px"
      @edit-column="openSetting"
    />
    <BaseColumnSetting ref="settingRef" v-model:columns="columns" @confirm="onConfirm" />
    <template #footer>
      <p class="widget-hint">最近事件：{{ lastEvent }}</p>
    </template>
  </DemoWidgetTabs>

  <!-- Props -->
  <div class="api-section">
    <h3 class="api-section__title">BaseColumnSetting Props</h3>
    <ApiTable type="props" :rows="api.props" />
  </div>

  <!-- Events -->
  <div class="api-section">
    <h3 class="api-section__title">BaseColumnSetting Events</h3>
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
@use "./variables" as *;
@use "./demo";
</style>
