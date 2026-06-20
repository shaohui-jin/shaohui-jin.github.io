/** 各 Demo 预览区对应的示例代码（供 DemoWidgetTabs 代码 Tab 展示） */
export const demoCodes = {
  baseSearch: `<script setup lang="ts">
import { ref } from "vue";
import { BaseSearch, type SearchFieldConfig } from "jsh-comp";

const searchParams: SearchFieldConfig[] = [
  { key: "searchKeyword", label: "关键词", placeholder: "请输入", fixed: true },
  {
    key: "status",
    label: "状态",
    type: "select",
    options: [
      { name: "启用", value: 1 },
      { name: "禁用", value: 0 },
    ],
    fixed: true,
  },
  { key: "dateRange", label: "日期范围", type: "daterange" },
];

const formData = ref<Record<string, unknown>>({});
const loading = ref(false);

function onSearch(data: Record<string, unknown>) {
  console.log("search", data);
}

function onReset() {
  console.log("reset");
}

function onChange(payload: { field?: string; value: unknown }) {
  console.log("change", payload);
}
</script>

<template>
  <BaseSearch
    v-model="formData"
    :params="searchParams"
    :loading="loading"
    @search="onSearch"
    @reset="onReset"
    @change="onChange"
  />
</template>`,

  baseSearchField: `<script setup lang="ts">
import { ref } from "vue";
import { ElForm, ElFormItem } from "element-plus";
import { BaseSearchField, type SearchFieldConfig } from "jsh-comp";

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

function onChange(payload: unknown) {
  console.log("change", payload);
}
</script>

<template>
  <ElForm :model="formData" label-width="90px">
    <ElFormItem label="输入框">
      <BaseSearchField v-model="formData.searchKeyword" :field="inputField" @change="onChange" />
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
</template>`,

  baseSearchDrawer: `<script setup lang="ts">
import { ref } from "vue";
import { BaseSearchDrawer, type SearchFieldConfig } from "jsh-comp";

const drawerParams: SearchFieldConfig[] = [
  { key: "searchKeyword", label: "关键词", placeholder: "请输入" },
  {
    key: "status",
    label: "状态",
    type: "select",
    options: [
      { name: "启用", value: 1 },
      { name: "禁用", value: 0 },
    ],
  },
  { key: "remark", label: "备注", type: "textarea" },
];

const formData = ref<Record<string, unknown>>({});
const drawerRef = ref<InstanceType<typeof BaseSearchDrawer>>();

function onSearch(data: Record<string, unknown>) {
  console.log("search", data);
}

function onReset() {
  console.log("reset");
}
</script>

<template>
  <BaseSearchDrawer
    ref="drawerRef"
    v-model="formData"
    :params="drawerParams"
    @search="onSearch"
    @reset="onReset"
  />
  <ElButton type="primary" @click="drawerRef?.open()">打开高级筛选</ElButton>
</template>`,

  baseColumnSetting: `<script setup lang="ts">
import { computed, ref } from "vue";
import {
  BaseTable,
  BaseColumnSetting,
  withEditColumn,
  stripEditColumn,
  type BaseTableColumn,
  type BaseColumnSettingColumn,
} from "jsh-comp";

const columns = ref<BaseColumnSettingColumn[]>([
  { key: "index", type: "index", width: 36 },
  { key: "id", label: "ID", width: 72 },
  { key: "name", label: "名称", width: 140 },
  { key: "status", label: "状态", width: 100 },
]);

const tableColumns = computed(() => withEditColumn(columns.value as BaseTableColumn[], true));

const tableData = [
  { id: 1, name: "项目 1", status: "启用" },
  { id: 2, name: "项目 2", status: "禁用" },
];

const settingRef = ref<InstanceType<typeof BaseColumnSetting>>();

function openSetting() {
  settingRef.value?.open();
}

function onConfirm(cols: BaseColumnSettingColumn[]) {
  columns.value = stripEditColumn(cols) as BaseColumnSettingColumn[];
}
</script>

<template>
  <BaseTable
    mode="element"
    :table-data="tableData"
    :columns="tableColumns"
    height="360px"
    @edit-column="openSetting"
  />
  <BaseColumnSetting ref="settingRef" v-model:columns="columns" @confirm="onConfirm" />
</template>`,

  baseCrud: `<script setup lang="ts">
import { ref } from "vue";
import {
  BaseCrud,
  type SearchFieldConfig,
  type BaseColumnSettingColumn,
} from "jsh-comp";

const tableData = ref([
  { id: 1, name: "项目 1", category: "A类", status: 1, amount: "1234.56" },
  { id: 2, name: "项目 2", category: "B类", status: 0, amount: "5678.90" },
]);

const searchModel = ref<Record<string, unknown>>({});
const loading = ref(false);

const searchParams: SearchFieldConfig[] = [
  { key: "searchKeyword", label: "关键词", placeholder: "请输入", fixed: true },
  {
    key: "status",
    label: "状态",
    type: "select",
    fixed: true,
    options: [
      { name: "启用", value: 1 },
      { name: "禁用", value: 0 },
    ],
  },
];

const drawerParams: SearchFieldConfig[] = [
  { key: "remark", label: "备注", placeholder: "请输入" },
];

const columns = ref<BaseColumnSettingColumn[]>([
  { key: "index", type: "index", width: 36 },
  { key: "id", label: "ID", width: 72 },
  { key: "name", label: "名称", width: 140 },
  { key: "status", label: "状态", width: 88 },
]);

function onSearch(filters: Record<string, unknown>) {
  console.log("search", filters);
}

function onReset() {
  searchModel.value = {};
}

function onColumnConfirm(cols: BaseColumnSettingColumn[]) {
  console.log("columns", cols);
}
</script>

<template>
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
</template>`,

  tag: `<script setup lang="ts">
import { Tag } from "jsh-comp";
</script>

<template>
  <Tag label="成功" type="success" />
  <Tag label="警告" type="warning" />
  <Tag label="信息" type="info" />
  <Tag label="危险" type="danger" />
</template>`,

  dotBasic: `<script setup lang="ts">
import { Dot } from "jsh-comp";
</script>

<template>
  <Dot color="#67c23a" text="运行中" />
  <Dot color="#e6a23c" text="待审核" />
  <Dot color="#f56c6c" text="已停止" />
</template>`,

  dotSlot: `<script setup lang="ts">
import { Dot } from "jsh-comp";
</script>

<template>
  <Dot color="#409eff">
    <span style="margin-left: 6px; font-weight: 600">自定义内容</span>
  </Dot>
</template>`,

  image3d: `<script setup lang="ts">
import { Image3D } from "jsh-comp";
</script>

<template>
  <Image3D src="https://picsum.photos/seed/lib-img/300/200" />
</template>`,

  imageCarousel: `<script setup lang="ts">
import { ref } from "vue";
import { ImageCarousel } from "jsh-comp";

const urls = [
  "https://picsum.photos/seed/c1/400/300",
  "https://picsum.photos/seed/c2/400/300",
  "https://picsum.photos/seed/c3/400/300",
];

const currentIndex = ref(0);

function onChange(index: number) {
  console.log("index:", index);
}
</script>

<template>
  <ImageCarousel
    v-model:index="currentIndex"
    :image-urls="urls"
    @change="onChange"
  />
</template>`,

  imagePointer: `<script setup lang="ts">
import { ImagePointer } from "jsh-comp";

const urls = [
  "https://picsum.photos/seed/p1/150/120",
  "https://picsum.photos/seed/p2/180/120",
  "https://picsum.photos/seed/p3/120/120",
];

function onHover(index: number) {
  console.log("hover", index);
}

function onClick(index: number) {
  console.log("click", index);
}

function onLeave() {
  console.log("leave");
}
</script>

<template>
  <ImagePointer
    :image-urls="urls"
    @hover="onHover"
    @click="onClick"
    @leave="onLeave"
  />
</template>`,

  canvasTime: `<script setup lang="ts">
import { CanvasTime } from "jsh-comp";
</script>

<template>
  <CanvasTime color="#333333" bg-color="#f9f9fb" />
</template>`,

  codeBlock: `<script setup lang="ts">
import { computed } from "vue";
import { CodeBlock } from "jsh-comp";
import { highlightTsCode } from "./demoCodeHighlight";

const sampleCode = \`function greet(name: string) {
  return \\\`Hello, \\\${name}!\\\`;
}\`;

const highlightedSample = computed(() => highlightTsCode(sampleCode));
</script>

<template>
  <CodeBlock :code="sampleCode" :highlighted="highlightedSample" />
</template>`,

  widgetTabs: `<script setup lang="ts">
import { computed } from "vue";
import { WidgetTabs } from "jsh-comp";
import { highlightDemoCode } from "./demoCodeHighlight";

const sourceCode = \`<MyComponent />\`;
const highlighted = computed(() => highlightDemoCode(sourceCode));
</script>

<template>
  <WidgetTabs :code="sourceCode" :highlighted="highlighted">
    <MyComponent />
  </WidgetTabs>
</template>`,

  splitPane: `<script setup lang="ts">
import { ref } from "vue";
import { SplitPane } from "jsh-comp";

const ratio = ref(0.5);

function onChange(value: number) {
  console.log("ratio:", value);
}
</script>

<template>
  <SplitPane v-model:ratio="ratio" class="split-pane-demo" @change="onChange">
    <template #left>
      <div class="split-pane-demo__panel split-pane-demo__panel--left">左侧面板</div>
    </template>
    <template #right>
      <div class="split-pane-demo__panel split-pane-demo__panel--right">右侧面板</div>
    </template>
  </SplitPane>
</template>`,

  dragSortList: `<script setup lang="ts">
import { ref } from "vue";
import { DragSortList } from "jsh-comp";

const items = ref([
  { id: 1, label: "首页菜单" },
  { id: 2, label: "用户管理" },
  { id: 3, label: "角色权限" },
]);

function onChange(list: typeof items.value) {
  console.log("sorted:", list);
}
</script>

<template>
  <DragSortList v-model="items" @change="onChange" />
</template>`,

  floatingToolbar: `<script setup lang="ts">
import { ref, computed } from "vue";
import { FloatingToolbar } from "jsh-comp";

const rows = ref([
  { id: 1, name: "订单 #1001", checked: false },
  { id: 2, name: "订单 #1002", checked: false },
]);

const selectedCount = computed(() => rows.value.filter((r) => r.checked).length);

function onAction(action: string) {
  console.log(action, selectedCount.value);
}
</script>

<template>
  <div class="float-toolbar-demo">
    <div v-for="row in rows" :key="row.id">
      <input v-model="row.checked" type="checkbox" /> {{ row.name }}
    </div>
    <FloatingToolbar :count="selectedCount" @action="onAction">
      <template #default="{ onAction }">
        <button @click="onAction('导出')">导出</button>
        <button @click="onAction('删除')">删除</button>
      </template>
    </FloatingToolbar>
  </div>
</template>`,

  treeTransfer: `<script setup lang="ts">
import { ref } from "vue";
import { TreeTransfer } from "jsh-comp";

const treeData = [
  {
    id: "1",
    label: "系统管理",
    children: [
      { id: "1-1", label: "用户管理" },
      { id: "1-2", label: "角色管理" },
    ],
  },
];

const checkedKeys = ref<string[]>(["1-2"]);

function onChange(ids: string[]) {
  console.log("checked:", ids);
}
</script>

<template>
  <TreeTransfer v-model="checkedKeys" :data="treeData" @change="onChange" />
</template>`,

  stepWizard: `<script setup lang="ts">
import { ref } from "vue";
import { StepWizard } from "jsh-comp";

const step = ref(0);
const form = ref({ name: "", email: "", role: "" });

const steps = [
  { title: "基本信息", description: "填写姓名和邮箱" },
  { title: "角色分配", description: "选择用户角色" },
  { title: "确认提交", description: "核对信息并提交" },
];

function onFinish() {
  console.log("submit", form.value);
}
</script>

<template>
  <StepWizard v-model:step="step" :steps="steps" @finish="onFinish">
    <template #default="{ step: currentStep }">
      <el-input v-if="currentStep === 0" v-model="form.name" placeholder="姓名" />
      <!-- 其他步骤内容 -->
    </template>
  </StepWizard>
</template>`,

  contextMenu: `<script setup lang="ts">
import { ContextMenu } from "jsh-comp";
import type { ContextMenuItem } from "jsh-comp/type";

const items: ContextMenuItem[] = [
  { label: "编辑", shortcut: "Ctrl+E" },
  { label: "复制", shortcut: "Ctrl+C" },
  { label: "删除", shortcut: "Del", danger: true },
];

function onSelect(item: ContextMenuItem) {
  console.log("selected:", item.label);
}
</script>

<template>
  <ContextMenu :items="items" @select="onSelect">
    <div class="ctx-target">在此区域右键打开菜单</div>
  </ContextMenu>
</template>`,

  canvasCountUp: `<script setup lang="ts">
import { ref } from "vue";
import { CanvasCountUp } from "jsh-comp";

const countUpRef = ref<InstanceType<typeof CanvasCountUp>>();

function onFinish() {
  console.log("animation done");
}
</script>

<template>
  <CanvasCountUp ref="countUpRef" :value="98765" :duration="2000" @finish="onFinish">
    <div class="canvas-count-up-demo__meta">
      <span class="canvas-count-up-demo__trend">↑ 12.5%</span>
      <span class="canvas-count-up-demo__label">总访问量</span>
    </div>
  </CanvasCountUp>
  <el-button @click="countUpRef?.restart()">重播</el-button>
</template>`,

  heatmapCalendar: `<script setup lang="ts">
import { HeatmapCalendar } from "jsh-comp";
import type { HeatmapCell } from "jsh-comp/type";

const heatmapData: HeatmapCell[] = Array.from({ length: 84 }, (_, i) => ({
  date: \`Day \${i + 1}\`,
  count: (i * 7 + 3) % 10,
}));

function onCellClick(cell: HeatmapCell) {
  console.log(cell.date, cell.count);
}
</script>

<template>
  <HeatmapCalendar :data="heatmapData" @cell-click="onCellClick" />
</template>`,

  imageLightbox: `<script setup lang="ts">
import { ref } from "vue";
import { ImageLightbox } from "jsh-comp";

const urls = [
  "https://picsum.photos/seed/lb1/800/600",
  "https://picsum.photos/seed/lb2/800/600",
  "https://picsum.photos/seed/lb3/800/600",
  "https://picsum.photos/seed/lb4/800/600",
];

const currentIndex = ref(0);

function onChange(index: number) {
  console.log("index:", index);
}
</script>

<template>
  <ImageLightbox
    v-model:index="currentIndex"
    :urls="urls"
    @change="onChange"
  />
</template>`,
} as const;
