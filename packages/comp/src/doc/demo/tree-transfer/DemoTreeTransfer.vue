<script setup lang="ts">
import { ref } from "vue";
import { TreeTransfer } from "jsh-comp";
import type { ComponentApi } from "../../type/types";
import ApiTable from "../ApiTable.vue";
import DemoWidgetTabs from "../DemoWidgetTabs.vue";
import { demoCodes } from "../demoCodes";

const treeData = [
  {
    id: "1",
    label: "系统管理",
    children: [
      { id: "1-1", label: "用户管理" },
      { id: "1-2", label: "角色管理" },
    ],
  },
  {
    id: "2",
    label: "内容管理",
    children: [
      { id: "2-1", label: "文章列表" },
      { id: "2-2", label: "分类管理" },
    ],
  },
];

const checkedKeys = ref<string[]>(["1-2"]);

const eventLog = ref("—");

function onChange(ids: string[]) {
  eventLog.value = `change → 已选: ${ids.join("、") || "无"}`;
}

const api: ComponentApi = {
  props: [
    { name: "data", type: "TreeTransferNode[]", default: "—", required: true, desc: "树形数据源" },
    { name: "modelValue / v-model", type: "string[]", default: "—", required: true, desc: "已选节点 id 列表" },
  ],
  events: [
    { name: "update:modelValue", payload: "(ids: string[])", desc: "v-model 更新" },
    { name: "change", payload: "(ids: string[])", desc: "穿梭后已选节点变化" },
  ],
};
</script>

<template>
  <div class="doc-content__header">
    <h2>TreeTransfer 树形穿梭框</h2>
    <p>左右两栏树形结构穿梭选择，适用于权限分配、组织架构选择等场景</p>
  </div>

  <DemoWidgetTabs :code="demoCodes.treeTransfer">
    <TreeTransfer v-model="checkedKeys" :data="treeData" @change="onChange" />
    <p class="widget-hint">已选节点：{{ checkedKeys.join("、") || "无" }}，最近事件：{{ eventLog }}</p>
  </DemoWidgetTabs>

  <div class="api-section">
    <h3 class="api-section__title">TreeTransfer Props</h3>
    <ApiTable type="props" :rows="api.props" />
  </div>

  <div class="api-section">
    <h3 class="api-section__title">TreeTransfer Events</h3>
    <ApiTable type="events" :rows="api.events" />
  </div>
</template>

<style scoped lang="scss">
@use "../../style/demo";
</style>
