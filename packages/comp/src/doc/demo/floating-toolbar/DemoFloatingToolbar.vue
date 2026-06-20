<script setup lang="ts">
import { ref, computed } from "vue";
import { ElMessage } from "element-plus";
import { FloatingToolbar } from "jsh-comp";
import type { ComponentApi } from "../../type/types";
import ApiTable from "../ApiTable.vue";
import DemoWidgetTabs from "../DemoWidgetTabs.vue";
import { demoCodes } from "../demoCodes";

const rows = ref([
  { id: 1, name: "订单 #1001", checked: false },
  { id: 2, name: "订单 #1002", checked: false },
  { id: 3, name: "订单 #1003", checked: false },
  { id: 4, name: "订单 #1004", checked: false },
]);

const selectedCount = computed(() => rows.value.filter((r) => r.checked).length);

const allChecked = computed({
  get: () => selectedCount.value === rows.value.length && rows.value.length > 0,
  set: (val: boolean) => {
    rows.value.forEach((r) => { r.checked = val; });
  },
});

const eventLog = ref("—");

function onAction(action: string) {
  eventLog.value = `action → ${action}（${selectedCount.value} 项）`;
  ElMessage.success(`${action} ${selectedCount.value} 项`);
  rows.value.forEach((r) => { r.checked = false; });
}

const api: ComponentApi = {
  props: [
    { name: "count", type: "number", default: "—", required: true, desc: "选中数量，大于 0 时显示工具栏" },
  ],
  events: [
    { name: "action", payload: "(action: string)", desc: "点击工具栏按钮时触发" },
  ],
};
</script>

<template>
  <div class="doc-content__header">
    <h2>FloatingToolbar 浮动工具栏</h2>
    <p>批量操作场景的底部浮动工具栏，选中项大于 0 时滑入显示</p>
  </div>

  <DemoWidgetTabs :code="demoCodes.floatingToolbar">
    <div class="float-toolbar-demo">
      <label class="float-toolbar-demo__all">
        <el-checkbox v-model="allChecked">全选</el-checkbox>
      </label>
      <div
        v-for="row in rows"
        :key="row.id"
        class="float-toolbar-demo__row"
      >
        <el-checkbox v-model="row.checked" />
        <span>{{ row.name }}</span>
      </div>
      <FloatingToolbar :count="selectedCount" @action="onAction">
        <template #default="{ onAction: emitAction }">
          <button type="button" class="float-toolbar-demo__btn" @click="emitAction('导出')">导出</button>
          <button type="button" class="float-toolbar-demo__btn" @click="emitAction('删除')">删除</button>
          <button type="button" class="float-toolbar-demo__btn" @click="emitAction('审批')">审批</button>
        </template>
      </FloatingToolbar>
    </div>
    <p class="widget-hint">最近事件：{{ eventLog }}</p>
  </DemoWidgetTabs>

  <div class="api-section">
    <h3 class="api-section__title">FloatingToolbar Props</h3>
    <ApiTable type="props" :rows="api.props" />
  </div>

  <div class="api-section">
    <h3 class="api-section__title">FloatingToolbar Events</h3>
    <ApiTable type="events" :rows="api.events" />
  </div>
</template>

<style scoped lang="scss">
@use "../../style/demo";
@use "../../style/variables" as *;

.float-toolbar-demo {
  position: relative;
  padding-bottom: 56px;

  &__all {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
    font-size: 13px;
  }

  &__row {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 12px;
    margin-bottom: 6px;
    background: var(--comp-bg-subtle, #{$doc-bg-subtle});
    border-radius: 6px;
    font-size: 13px;
  }

  &__btn {
    padding: 4px 12px;
    border: 1px solid rgb(255 255 255 / 30%);
    border-radius: 4px;
    background: transparent;
    color: #fff;
    cursor: pointer;
    font-size: 12px;

    &:hover {
      background: rgb(255 255 255 / 10%);
    }
  }
}
</style>
