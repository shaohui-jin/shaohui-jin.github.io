<script setup lang="ts">
import { ref } from "vue";
import { ContextMenu } from "jsh-comp";
import type { ContextMenuItem } from "jsh-comp/type";
import type { ComponentApi } from "../../type/types";
import ApiTable from "../ApiTable.vue";
import DemoWidgetTabs from "../DemoWidgetTabs.vue";
import { demoCodes } from "../demoCodes";

const items: ContextMenuItem[] = [
  { label: "编辑", shortcut: "Ctrl+E" },
  { label: "复制", shortcut: "Ctrl+C" },
  { label: "删除", shortcut: "Del", danger: true },
];

const eventLog = ref("—");

function onSelect(item: ContextMenuItem) {
  eventLog.value = `select → ${item.label}`;
}

const api: ComponentApi = {
  props: [
    { name: "items", type: "ContextMenuItem[]", default: "—", required: true, desc: "菜单项列表" },
  ],
  events: [
    { name: "select", payload: "(item: ContextMenuItem)", desc: "选中菜单项" },
  ],
};
</script>

<template>
  <div class="doc-content__header">
    <h2>ContextMenu 右键菜单</h2>
    <p>在触发区域右键弹出上下文菜单，支持快捷键提示与危险项样式</p>
  </div>

  <DemoWidgetTabs :code="demoCodes.contextMenu">
    <ContextMenu :items="items" @select="onSelect">
      <div class="ctx-target">在此区域右键打开菜单</div>
    </ContextMenu>
    <p class="widget-hint">最近事件：{{ eventLog }}</p>
  </DemoWidgetTabs>

  <div class="api-section">
    <h3 class="api-section__title">ContextMenu Props</h3>
    <ApiTable type="props" :rows="api.props" />
  </div>

  <div class="api-section">
    <h3 class="api-section__title">ContextMenu Events</h3>
    <ApiTable type="events" :rows="api.events" />
  </div>
</template>

<style scoped lang="scss">
@use "../../style/demo";

.ctx-target {
  height: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f7fa;
  border: 1px dashed #dcdfe6;
  border-radius: 8px;
  font-size: 13px;
  color: #606266;
  user-select: none;
}
</style>
