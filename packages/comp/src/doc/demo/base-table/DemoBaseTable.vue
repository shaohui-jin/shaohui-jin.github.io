<script setup lang="ts">
import { ref, shallowReactive } from "vue";
import {
  BaseTable,
  type BaseTableColumn,
  type BaseTableColumnType,
  type BaseTableEmits,
  type BaseTableMode,
  type BaseTableProps,
} from "jsh-comp";
import type { ApiRow, ComponentApi } from "../../type/types";
import ApiTable from "../ApiTable.vue";

// ==================== 演示数据 ====================

const modes: { label: string; value: BaseTableMode; desc: string; rows: number }[] = [
  {
    label: "Element Plus",
    value: "element",
    desc: "el-table 封装，能力最全，适合常规数据量",
    rows: 50,
  },
  {
    label: "Virtual Scroll",
    value: "virtual",
    desc: "el-table-v2 虚拟滚动，适合万级行",
    rows: 10_000,
  },
  { label: "Canvas 2D", value: "canvas", desc: "单 Canvas 视口重绘，适合超大数据", rows: 100_000 },
  {
    label: "Canvas Tile",
    value: "canvas-tile",
    desc: "整表预渲染 + 视口裁切，小数据集更流畅",
    rows: 5_000,
  },
  {
    label: "Skia WASM",
    value: "skia-wasm",
    desc: "CanvasKit (Skia) 渲染，GPU 加速",
    rows: 100_000,
  },
];

const activeMode = ref<BaseTableMode>("element");
const activeTypeTab = ref("switch");

function generateRows(count: number): Record<string, unknown>[] {
  return Object.freeze(
    Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      name: `项 ${i + 1}`,
      amount: (Math.random() * 1000000).toFixed(2),
      remark: i % 7 === 0 ? "备注较长用于测试截断" : "正常",
      status: i % 3 === 0 ? 1 : 2,
      "status-custom": i % 5,
      tableSlot: Array.from({ length: 2 + (i % 4) }, (_, j) => ({
        img: `https://picsum.photos/seed/${i * 10 + j}/60/60`,
        code: `TC-${String(i + 1).padStart(3, "0")}-${j + 1}`,
        name: `花色${["红", "蓝", "绿", "白"][j % 4]}`,
      })),
    })),
  ) as unknown as Record<string, unknown>[];
}

const tableDataMap = shallowReactive<Record<string, Record<string, unknown>[]>>({});

function ensureData(mode: BaseTableMode) {
  if (!tableDataMap[mode]) {
    const m = modes.find((item) => item.value === mode)!;
    tableDataMap[mode] = generateRows(m.rows);
  }
}

ensureData("element");

const columns: BaseTableColumn[] = [
  { key: "selection", type: "selection", width: 36 },
  { key: "index", type: "index", width: 36 },
  { key: "id", label: "默认", width: 72 },
  { key: "amount", label: "超长", width: 70 },
  { key: "name", label: "名称", width: 140 },
  { key: "formatter", label: "formatter字段", width: 120, formatter: () => String(1212) },
  {
    key: "status",
    label: "switch状态",
    type: "switch",
    width: 100,
    activeValue: 1,
    inactiveValue: 2,
    beforeChange: () => window.confirm("确认切换？"),
  },
  {
    key: "status-custom",
    label: "status-custom字段",
    type: "status-custom",
    width: 160,
    colorMap: {
      0: "rgba(0, 85, 255, 1)",
      1: "rgba(103, 194, 58, 1)",
      2: "rgba(0, 85, 255, 1)",
      3: "rgba(103, 194, 58, 1)",
      4: "rgba(103, 194, 58, 1)",
    },
  },
  {
    key: "tableSlot",
    label: "tableSlot字段",
    width: 120,
    type: "tableSlot",
    filterPlaceholder: "请输入编码/名称",
    filter: (str: string, item: Record<string, unknown>) =>
      String(item.Code ?? "").includes(str.trim()) || String(item.Name ?? "").includes(str.trim()),
    columns: [
      { key: "index", type: "index", label: "序号", width: 60 },
      { key: "img", type: "image", label: "预览图", width: 80 },
      { key: "code", label: "编码", width: 80 },
      { key: "name", label: "名称", minWidth: 100 },
    ],
  },
  { key: "remark", label: "备注" },
];

// ==================== API 文档数据 ====================

const baseTableApi: ComponentApi = {
  props: [
    { name: "mode", type: "BaseTableMode", default: "—", required: true, desc: "渲染模式" },
    {
      name: "tableData",
      type: "Record<string, unknown>[]",
      default: "—",
      required: true,
      desc: "表格数据",
    },
    {
      name: "columns",
      type: "BaseTableColumn[]",
      default: "—",
      required: true,
      desc: "列配置数组",
    },
    {
      name: "height",
      type: "string",
      default: '"420px"',
      required: false,
      desc: "容器高度，如 400px、60vh、100%",
    },
    {
      name: "rowKey",
      type: "string",
      default: '"id"',
      required: false,
      desc: "行数据唯一标识字段名",
    },
    {
      name: "loading",
      type: "boolean",
      default: "false",
      required: false,
      desc: "是否显示加载状态",
    },
    {
      name: "emptyText",
      type: "string",
      default: '"暂无数据"',
      required: false,
      desc: "数据为空时的提示文案",
    },
    {
      name: "rowHeight",
      type: "number",
      default: "36",
      required: false,
      desc: "行高（px）",
      note: "BaseTable 组件内置默认值，可通过 props 覆盖",
    },
    {
      name: "headerHeight",
      type: "number",
      default: "40",
      required: false,
      desc: "表头高度（px）",
      note: "BaseTable 组件内置默认值，可通过 props 覆盖",
    },
    {
      name: "maxPrerenderPixels",
      type: "number",
      default: "12000000",
      required: false,
      desc: "canvas-tile 模式最大预渲染像素数",
      note: "仅 canvas-tile 模式有效",
    },
    {
      name: "skiaWasmBaseUrl",
      type: "string",
      default: "undefined",
      required: false,
      desc: "CanvasKit WASM 资源 base URL",
      note: "仅 skia-wasm 模式需要",
    },
  ],
  events: [
    {
      name: "selectionChange",
      payload: "Record<string, unknown>[]",
      desc: "选中行变化时触发，参数为当前选中行数组",
    },
  ],
  slots: [{ name: "toolbar", desc: "表格上方工具栏区域" }],
  notes: [
    "五种渲染模式共享同一套列配置（BaseTableColumn），但高性能模式（canvas/canvas-tile/skia-wasm）仅支持文本化展示，type 字段中的 switch、tableSlot 等交互类型不会生效",
    "loading 仅在 element 模式下显示加载遮罩",
    "canvas 系模式通过 CSS 变量（tableSurfaceCssVars）统一视觉风格",
  ],
};

const baseTableModeApi = [
  { value: "element", desc: "Element Plus el-table 封装，能力最全，适合常规数据量（百 ~ 千行）" },
  { value: "virtual", desc: "el-table-v2 虚拟滚动，适合万级行，DOM 仍可控" },
  { value: "canvas", desc: "单 Canvas 2D 视口内重绘，适合超大数据、结构简单场景" },
  { value: "canvas-tile", desc: "Canvas + 整表预渲染 + 视口裁切，小数据集下滚动更流畅" },
  { value: "skia-wasm", desc: "CanvasKit（Skia WASM）渲染，GPU 加速，需加载 wasm 资源" },
];

const baseTableColumnApi: ApiRow[] = [
  {
    name: "key",
    type: "string",
    default: "—",
    required: true,
    desc: "列字段名，取 row[key] 作为单元格值",
  },
  { name: "label", type: "string", default: "—", required: false, desc: "表头文案" },
  {
    name: "title",
    type: "string",
    default: "—",
    required: false,
    desc: "表头文案（兼容 Table-V2 的 title 字段）",
  },
  { name: "width", type: "number", default: "120", required: false, desc: "列宽（px）" },
  {
    name: "minWidth",
    type: "number",
    default: "—",
    required: false,
    desc: "最小列宽（px），仅 element 模式",
  },
  {
    name: "align",
    type: '"left" | "center" | "right"',
    default: '"left"',
    required: false,
    desc: "对齐方式",
  },
  {
    name: "show",
    type: "boolean",
    default: "true",
    required: false,
    desc: "是否显示，设为 false 时隐藏该列",
  },
  {
    name: "type",
    type: "BaseTableColumnType | string",
    default: '"default"',
    required: false,
    desc: "列类型（BaseTableColumnType 为内置联合类型）",
    note: "高性能模式（canvas 系）仅支持文本化展示",
  },
  {
    name: "formatter",
    type: "(row, column, cellValue) => string",
    default: "—",
    required: false,
    desc: "自定义单元格格式化函数",
  },
  {
    name: "showOverflowTooltip",
    type: "boolean",
    default: "true",
    required: false,
    desc: "超长文本省略时显示 tooltip",
  },
];

const baseTableColumnSwitchApi: ApiRow[] = [
  {
    name: "activeValue",
    type: "string | number | boolean",
    default: "true",
    required: false,
    desc: "激活时的值",
  },
  {
    name: "inactiveValue",
    type: "string | number | boolean",
    default: "false",
    required: false,
    desc: "非激活时的值",
  },
  { name: "disabled", type: "boolean", default: "false", required: false, desc: "是否禁用开关" },
  {
    name: "beforeChange",
    type: "(row, col) => boolean | Promise<boolean>",
    default: "—",
    required: false,
    desc: "切换前的拦截钩子，返回 false 或 reject 时阻止切换",
  },
];

const baseTableColumnStatusCustomApi: ApiRow[] = [
  {
    name: "colorMap",
    type: "Record<string, string>",
    default: "—",
    required: false,
    desc: "按单元格值映射灯色，如 { 0: 'rgba(0,85,255,1)', 1: '#67c23a' }",
  },
];

const baseTableColumnTableSlotApi: ApiRow[] = [
  {
    name: "columns",
    type: "BaseTableColumn[]",
    default: "—",
    required: false,
    desc: "弹窗内嵌子表格的列配置",
  },
  { name: "popoverWidth", type: "number", default: "430", required: false, desc: "弹窗宽度（px）" },
  {
    name: "filter",
    type: "(keyword, item) => boolean",
    default: "—",
    required: false,
    desc: "弹窗内搜索过滤函数",
  },
  {
    name: "filterPlaceholder",
    type: "string",
    default: "—",
    required: false,
    desc: "弹窗内搜索框 placeholder",
  },
];
</script>

<template>
  <div class="doc-content__header">
    <h2>BaseTable 多模式表格</h2>
    <p>同一套列配置，按引擎适配数据量。滚轮纵向 · Shift+滚轮横向</p>
  </div>

  <!-- Mode tabs -->
  <el-tabs v-model="activeMode" type="border-card" class="doc-tabs" @tab-change="ensureData">
    <el-tab-pane v-for="m in modes" :key="m.value" :label="m.label" :name="m.value" lazy>
      <div class="mode-pane">
        <div class="mode-pane__meta">
          <el-tag type="info" size="small" effect="plain">{{ m.value }}</el-tag>
          <el-tag size="small" effect="plain">{{ m.rows.toLocaleString() }} 行</el-tag>
          <span class="mode-pane__desc">{{ m.desc }}</span>
        </div>
        <div class="mode-pane__table">
          <BaseTable
            :mode="m.value"
            :table-data="tableDataMap[m.value] ?? []"
            :columns="columns"
            height="420px"
            :loading="!tableDataMap[m.value]"
          />
        </div>
      </div>
    </el-tab-pane>
  </el-tabs>

  <!-- BaseTable API 文档 -->
  <div class="api-section">
    <h3 class="api-section__title">BaseTable Props</h3>
    <ApiTable type="props" :rows="baseTableApi.props" />
  </div>

  <div class="api-section">
    <h3 class="api-section__title">BaseTable Events</h3>
    <ApiTable type="events" :rows="baseTableApi.events!" />
  </div>

  <div class="api-section">
    <h3 class="api-section__title">BaseTable Slots</h3>
    <ApiTable type="slots" :rows="baseTableApi.slots!" />
  </div>

  <div class="api-section">
    <h3 class="api-section__title">BaseTableMode 渲染模式</h3>
    <ApiTable type="slots" :rows="baseTableModeApi.map((m) => ({ name: m.value, desc: m.desc }))" />
  </div>

  <div class="api-section">
    <h3 class="api-section__title">BaseTableColumn 列配置（通用）</h3>
    <ApiTable type="props" :rows="baseTableColumnApi" />
  </div>

  <div class="api-section">
    <h3 class="api-section__title">BaseTableColumn 扩展字段（按 type）</h3>
    <el-tabs v-model="activeTypeTab" type="border-card" class="type-tabs">
      <el-tab-pane label="switch" name="switch">
        <ApiTable type="props" :rows="baseTableColumnSwitchApi" />
      </el-tab-pane>
      <el-tab-pane label="status-custom" name="status-custom">
        <ApiTable type="props" :rows="baseTableColumnStatusCustomApi" />
      </el-tab-pane>
      <el-tab-pane label="tableSlot" name="tableSlot">
        <ApiTable type="props" :rows="baseTableColumnTableSlotApi" />
      </el-tab-pane>
    </el-tabs>
  </div>

  <div v-if="baseTableApi.notes?.length" class="api-section">
    <h3 class="api-section__title">特殊说明</h3>
    <ul class="api-notes-list">
      <li v-for="(note, idx) in baseTableApi.notes" :key="idx">{{ note }}</li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
@use "../../style/variables" as *;
@use "../../style/el-overrides" as *;
@use "../../style/demo";

.doc-tabs {
  @include el-tabs-border-card;
}

.type-tabs {
  @include el-tabs-border-card;
}

.mode-pane {
  background: $doc-bg-card;
  padding: $doc-sp-lg;
}

.mode-pane__meta {
  display: flex;
  align-items: center;
  gap: $doc-sp-md;
  margin-bottom: $doc-sp-md;
}

.mode-pane__desc {
  font-size: $doc-fs-sm;
  color: $doc-text-secondary;
}

.mode-pane__table {
  border: 1px solid $doc-border-color;
  border-radius: $doc-radius-md;
  overflow: hidden;
}
</style>
