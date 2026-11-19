<script setup lang="ts">
import { computed, ref } from "vue";
import { ElMessage } from "element-plus";
import {
  ContextMenu,
  DragSortList,
  FloatingToolbar,
  HeatmapCalendar,
  SplitPane,
  StepWizard,
  TreeTransfer,
} from "@/works/comp";
import type { ContextMenuItem, DragSortItem, HeatmapCell } from "@/works/comp/type";

defineProps<{ name: string }>();

const ratio = ref(0.5);
const ratioLog = ref("—");

const sortItems = ref<DragSortItem[]>([
  { id: "1", label: "首页菜单" },
  { id: "2", label: "用户管理" },
  { id: "3", label: "角色权限" },
  { id: "4", label: "系统配置" },
  { id: "5", label: "操作日志" },
]);
const sortLog = ref("—");

const orders = ref([
  { id: 1, name: "订单 #1001", checked: false },
  { id: 2, name: "订单 #1002", checked: false },
  { id: 3, name: "订单 #1003", checked: false },
  { id: 4, name: "订单 #1004", checked: false },
]);
const selectedCount = computed(() => orders.value.filter((row) => row.checked).length);
const allChecked = computed({
  get: () => selectedCount.value === orders.value.length && orders.value.length > 0,
  set: (value: boolean) => {
    orders.value.forEach((row) => {
      row.checked = value;
    });
  },
});
const toolbarLog = ref("—");

function onToolbarAction(action: string) {
  toolbarLog.value = `action → ${action}（${selectedCount.value} 项）`;
  ElMessage.success(`${action} ${selectedCount.value} 项`);
  orders.value.forEach((row) => {
    row.checked = false;
  });
}

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
const transferLog = ref("—");

const step = ref(0);
const form = ref({ name: "", email: "", role: "" });
const steps = [
  { title: "基本信息", description: "填写姓名和邮箱" },
  { title: "角色分配", description: "选择用户角色" },
  { title: "确认提交", description: "核对信息并提交" },
];
const wizardLog = ref("—");

function onFinish() {
  wizardLog.value = "finish → 提交成功";
  ElMessage.success("提交成功");
}

const menuItems: ContextMenuItem[] = [
  { label: "编辑", shortcut: "Ctrl+E" },
  { label: "复制", shortcut: "Ctrl+C" },
  { label: "删除", shortcut: "Del", danger: true },
];
const menuLog = ref("—");

const heatmapData: HeatmapCell[] = Array.from({ length: 84 }, (_, i) => ({
  date: `Day ${i + 1}`,
  count: (i * 7 + 3) % 10,
}));
const heatmapLog = ref("—");
</script>

<template>
  <div v-if="name === 'split-pane'">
    <SplitPane
      v-model:ratio="ratio"
      class="split-pane-demo"
      @change="ratioLog = `change → ratio: ${Number($event).toFixed(2)}`"
    >
      <template #left>
        <div class="split-pane-demo__panel split-pane-demo__panel--left">
          左侧面板 — 拖拽中间分隔条调整比例，双击还原
        </div>
      </template>
      <template #right>
        <div class="split-pane-demo__panel split-pane-demo__panel--right">
          右侧面板 — 适用于主从布局、配置页
        </div>
      </template>
    </SplitPane>
    <p class="widget-hint">当前比例：{{ ratio.toFixed(2) }}，最近事件：{{ ratioLog }}</p>
  </div>

  <div v-else-if="name === 'drag-sort-list'">
    <DragSortList
      v-model="sortItems"
      @change="
        sortLog = `change → 顺序: ${($event as DragSortItem[]).map((item) => item.label).join('、')}`
      "
    />
    <p class="widget-hint">最近事件：{{ sortLog }}</p>
  </div>

  <div v-else-if="name === 'floating-toolbar'" class="float-toolbar-demo">
    <label class="float-toolbar-demo__all">
      <el-checkbox v-model="allChecked">全选</el-checkbox>
    </label>
    <div v-for="row in orders" :key="row.id" class="float-toolbar-demo__row">
      <el-checkbox v-model="row.checked" />
      <span>{{ row.name }}</span>
    </div>
    <FloatingToolbar :count="selectedCount" @action="onToolbarAction">
      <template #default="{ onAction }">
        <button type="button" class="float-toolbar-demo__btn" @click="onAction('导出')">
          导出
        </button>
        <button type="button" class="float-toolbar-demo__btn" @click="onAction('删除')">
          删除
        </button>
        <button type="button" class="float-toolbar-demo__btn" @click="onAction('审批')">
          审批
        </button>
      </template>
    </FloatingToolbar>
    <p class="widget-hint">最近事件：{{ toolbarLog }}</p>
  </div>

  <div v-else-if="name === 'tree-transfer'">
    <TreeTransfer
      v-model="checkedKeys"
      :data="treeData"
      @change="transferLog = `change → 已选: ${($event as string[]).join('、') || '无'}`"
    />
    <p class="widget-hint">
      已选节点：{{ checkedKeys.join("、") || "无" }}，最近事件：{{ transferLog }}
    </p>
  </div>

  <div v-else-if="name === 'step-wizard'">
    <StepWizard
      v-model:step="step"
      :steps="steps"
      @change="wizardLog = `change → step: ${$event}`"
      @finish="onFinish"
    >
      <template #default="{ step: currentStep }">
        <template v-if="currentStep === 0">
          <el-input v-model="form.name" placeholder="姓名" style="margin-bottom: 12px" />
          <el-input v-model="form.email" placeholder="邮箱" />
        </template>
        <template v-else-if="currentStep === 1">
          <el-radio-group v-model="form.role">
            <el-radio value="admin">管理员</el-radio>
            <el-radio value="editor">编辑</el-radio>
            <el-radio value="viewer">只读</el-radio>
          </el-radio-group>
        </template>
        <template v-else>
          <p>姓名：{{ form.name }}</p>
          <p>邮箱：{{ form.email }}</p>
          <p>角色：{{ form.role }}</p>
        </template>
      </template>
    </StepWizard>
    <p class="widget-hint">当前步骤：{{ step }}，最近事件：{{ wizardLog }}</p>
  </div>

  <div v-else-if="name === 'context-menu'">
    <ContextMenu
      :items="menuItems"
      @select="menuLog = `select → ${($event as ContextMenuItem).label}`"
    >
      <div class="ctx-target">在此区域右键打开菜单</div>
    </ContextMenu>
    <p class="widget-hint">最近事件：{{ menuLog }}</p>
  </div>

  <div v-else-if="name === 'heatmap-calendar'">
    <HeatmapCalendar
      :data="heatmapData"
      @cell-click="
        heatmapLog = `cell-click → ${($event as HeatmapCell).date}: ${($event as HeatmapCell).count} 次`
      "
    />
    <p class="widget-hint">最近事件：{{ heatmapLog }}</p>
  </div>
</template>

<style scoped lang="scss">
@use "../style/variables" as *;
@use "../style/demo";

.split-pane-demo {
  height: 200px;
}

.split-pane-demo__panel {
  box-sizing: border-box;
  height: 100%;
  padding: 16px;
  font-size: 13px;
  color: #606266;

  &--left {
    background: #f0f9ff;
  }

  &--right {
    background: #fef9f0;
  }
}

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
    margin-bottom: 6px;
    padding: 10px 12px;
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
    font-size: 12px;
    cursor: pointer;

    &:hover {
      background: rgb(255 255 255 / 10%);
    }
  }
}

.ctx-target {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 160px;
  background: #f5f7fa;
  border: 1px dashed #dcdfe6;
  border-radius: 8px;
  font-size: 13px;
  color: #606266;
  user-select: none;
}
</style>
