<script setup lang="ts">
import { ref } from "vue";
import { DragSortList } from "jsh-comp";
import type { DragSortItem } from "jsh-comp/type";
import type { ComponentApi } from "../../type/types";
import ApiTable from "../ApiTable.vue";
import DemoWidgetTabs from "../DemoWidgetTabs.vue";
import { demoCodes } from "../demoCodes";

const items = ref([
  { id: 1, label: "首页菜单" },
  { id: 2, label: "用户管理" },
  { id: 3, label: "角色权限" },
  { id: 4, label: "系统配置" },
  { id: 5, label: "操作日志" },
]);

const eventLog = ref("—");

function onChange(list: DragSortItem[]) {
  eventLog.value = `change → 顺序: ${list.map((i) => i.label).join("、")}`;
}

const api: ComponentApi = {
  props: [
    { name: "modelValue / v-model", type: "DragSortItem[]", default: "—", required: true, desc: "可拖拽排序的列表项" },
  ],
  events: [
    { name: "update:modelValue", payload: "(items: DragSortItem[])", desc: "v-model 更新" },
    { name: "change", payload: "(items: DragSortItem[])", desc: "排序完成后列表变化" },
  ],
};
</script>

<template>
  <div class="doc-content__header">
    <h2>DragSortList 拖拽排序列表</h2>
    <p>支持 HTML5 拖拽的列表排序组件，适用于菜单排序、优先级调整等场景</p>
  </div>

  <DemoWidgetTabs :code="demoCodes.dragSortList">
    <DragSortList v-model="items" @change="onChange" />
    <p class="widget-hint">最近事件：{{ eventLog }}</p>
  </DemoWidgetTabs>

  <div class="api-section">
    <h3 class="api-section__title">DragSortList Props</h3>
    <ApiTable type="props" :rows="api.props" />
  </div>

  <div class="api-section">
    <h3 class="api-section__title">DragSortList Events</h3>
    <ApiTable type="events" :rows="api.events" />
  </div>
</template>

<style scoped lang="scss">
@use "../../style/demo";
</style>
