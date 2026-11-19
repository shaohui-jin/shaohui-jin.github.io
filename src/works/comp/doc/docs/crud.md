---
title: CRUD
groupTitle: CRUD
order: 10
---

# CRUD

## BaseTable

同一套列配置，按引擎适配数据量。滚轮纵向，Shift + 滚轮横向。

::: comp-preview tables

```vue
<script setup lang="ts">
import { BaseTable, type BaseTableColumn } from "@/works/comp";

const columns: BaseTableColumn[] = [
  { key: "selection", type: "selection", width: 36 },
  { key: "index", type: "index", width: 36 },
  { key: "name", label: "名称", width: 140 },
  { key: "remark", label: "备注" },
];

const tableData = [
  { id: 1, name: "项目 1", remark: "正常" },
  { id: 2, name: "项目 2", remark: "正常" },
];
</script>

<template>
  <BaseTable mode="element" :table-data="tableData" :columns="columns" height="420px" />
</template>
```

:::

### Props

| 名称               | 类型                        | 默认值       | 必填 | 说明                             |
| ------------------ | --------------------------- | ------------ | ---- | -------------------------------- |
| mode               | `BaseTableMode`             | —            | 是   | 渲染模式                         |
| tableData          | `Record<string, unknown>[]` | —            | 是   | 表格数据                         |
| columns            | `BaseTableColumn[]`         | —            | 是   | 列配置数组                       |
| height             | `string`                    | `"420px"`    | 否   | 容器高度，如 400px、60vh、100%   |
| rowKey             | `string`                    | `"id"`       | 否   | 行数据唯一标识字段名             |
| loading            | `boolean`                   | `false`      | 否   | 是否显示加载状态                 |
| emptyText          | `string`                    | `"暂无数据"` | 否   | 数据为空时的提示文案             |
| rowHeight          | `number`                    | `36`         | 否   | 行高（px）                       |
| headerHeight       | `number`                    | `40`         | 否   | 表头高度（px）                   |
| maxPrerenderPixels | `number`                    | `12000000`   | 否   | canvas-tile 模式最大预渲染像素数 |
| skiaWasmBaseUrl    | `string`                    | `undefined`  | 否   | CanvasKit WASM 资源 base URL     |

### Events

| 名称            | 参数                        | 说明                                   |
| --------------- | --------------------------- | -------------------------------------- |
| selectionChange | `Record<string, unknown>[]` | 选中行变化时触发，参数为当前选中行数组 |

### Slots

| 名称    | 说明               |
| ------- | ------------------ |
| toolbar | 表格上方工具栏区域 |

### 渲染模式

| 名称        | 说明                                                              |
| ----------- | ----------------------------------------------------------------- |
| element     | Element Plus el-table 封装，能力最全，适合常规数据量（百 ~ 千行） |
| virtual     | el-table-v2 虚拟滚动，适合万级行，DOM 仍可控                      |
| canvas      | 单 Canvas 2D 视口内重绘，适合超大数据、结构简单场景               |
| canvas-tile | Canvas + 整表预渲染 + 视口裁切，小数据集下滚动更流畅              |
| skia-wasm   | CanvasKit（Skia WASM）渲染，GPU 加速，需加载 wasm 资源            |

### 列配置

| 名称                | 类型                                 | 默认值      | 必填 | 说明                                         |
| ------------------- | ------------------------------------ | ----------- | ---- | -------------------------------------------- |
| key                 | `string`                             | —           | 是   | 列字段名，取 row[key] 作为单元格值           |
| label               | `string`                             | —           | 否   | 表头文案                                     |
| title               | `string`                             | —           | 否   | 表头文案（兼容 Table-V2 的 title 字段）      |
| width               | `number`                             | `120`       | 否   | 列宽（px）                                   |
| minWidth            | `number`                             | —           | 否   | 最小列宽（px），仅 element 模式              |
| align               | `"left" \| "center" \| "right"`      | `"left"`    | 否   | 对齐方式                                     |
| show                | `boolean`                            | `true`      | 否   | 是否显示，设为 false 时隐藏该列              |
| type                | `BaseTableColumnType \| string`      | `"default"` | 否   | 列类型（BaseTableColumnType 为内置联合类型） |
| formatter           | `(row, column, cellValue) => string` | —           | 否   | 自定义单元格格式化函数                       |
| showOverflowTooltip | `boolean`                            | `true`      | 否   | 超长文本省略时显示 tooltip                   |

### switch

| 名称          | 类型                                        | 默认值  | 必填 | 说明                                              |
| ------------- | ------------------------------------------- | ------- | ---- | ------------------------------------------------- |
| activeValue   | `string \| number \| boolean`               | `true`  | 否   | 激活时的值                                        |
| inactiveValue | `string \| number \| boolean`               | `false` | 否   | 非激活时的值                                      |
| disabled      | `boolean`                                   | `false` | 否   | 是否禁用开关                                      |
| beforeChange  | `(row, col) => boolean \| Promise<boolean>` | —       | 否   | 切换前的拦截钩子，返回 false 或 reject 时阻止切换 |

### status-custom

| 名称     | 类型                     | 默认值 | 必填 | 说明                                                           |
| -------- | ------------------------ | ------ | ---- | -------------------------------------------------------------- |
| colorMap | `Record<string, string>` | —      | 否   | 按单元格值映射灯色，如 { 0: 'rgba(0,85,255,1)', 1: '#67c23a' } |

### tableSlot

| 名称              | 类型                         | 默认值 | 必填 | 说明                     |
| ----------------- | ---------------------------- | ------ | ---- | ------------------------ |
| columns           | `BaseTableColumn[]`          | —      | 否   | 弹窗内嵌子表格的列配置   |
| popoverWidth      | `number`                     | `430`  | 否   | 弹窗宽度（px）           |
| filter            | `(keyword, item) => boolean` | —      | 否   | 弹窗内搜索过滤函数       |
| filterPlaceholder | `string`                     | —      | 否   | 弹窗内搜索框 placeholder |

### 特殊说明

- 五种渲染模式共享同一套列配置（BaseTableColumn），但高性能模式（canvas / canvas-tile / skia-wasm）仅支持文本化展示，type 字段中的 switch、tableSlot 等交互类型不会生效
- loading 仅在 element 模式下显示加载遮罩
- canvas 系模式通过 CSS 变量（tableSurfaceCssVars）统一视觉风格
- rowHeight、headerHeight 由组件内置默认值，可通过 props 覆盖
- maxPrerenderPixels 仅 canvas-tile 模式有效
- skiaWasmBaseUrl 仅 skia-wasm 模式需要
- 高性能模式（canvas 系）的 type 仅支持文本化展示

## BaseSearch

配置式搜索表单，支持固定字段与可展开字段，覆盖常用表单类型。

::: comp-preview base-search

```vue
<script setup lang="ts">
import { ref } from "vue";
import { BaseSearch, type SearchFieldConfig } from "@/works/comp";

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
</script>

<template>
  <BaseSearch
    v-model="formData"
    :params="searchParams"
    @search="console.log"
    @reset="console.log"
  />
</template>
```

:::

### Props

| 名称                 | 类型                                      | 默认值  | 必填 | 说明                             |
| -------------------- | ----------------------------------------- | ------- | ---- | -------------------------------- |
| params               | `BaseSearchField[]`                       | —       | 是   | 搜索字段配置数组                 |
| modelValue / v-model | `Record<string, unknown>`                 | —       | 是   | 表单数据双向绑定                 |
| loading              | `boolean`                                 | `false` | 否   | 查询按钮加载状态                 |
| paramOptions         | `Record<string, BaseSearchFieldOption[]>` | `{}`    | 否   | 异步加载的选项（key 为字段 key） |

### Events

| 名称   | 参数                         | 说明                           |
| ------ | ---------------------------- | ------------------------------ |
| search | `Record<string, unknown>`    | 点击查询时触发，参数为表单数据 |
| reset  | —                            | 点击重置时触发                 |
| change | `{ field, value, formData }` | 字段值变化时触发               |

### params 字段配置

| 名称          | 类型                  | 默认值    | 必填 | 说明                   |
| ------------- | --------------------- | --------- | ---- | ---------------------- |
| key           | `string`              | —         | 是   | 表单值字段名           |
| label         | `string`              | —         | 是   | 标签文本               |
| labelWidth    | `string`              | `"70px"`  | 否   | 标签宽度               |
| placeholder   | `string`              | —         | 否   | 占位文本               |
| fixed         | `boolean`             | `false`   | 否   | 是否固定显示（不折叠） |
| type          | `BaseSearchFieldType` | `"input"` | 否   | 表单项类型             |
| options       | `{ name, value }[]`   | —         | 否   | select 类型的选项列表  |
| clearable     | `boolean`             | `true`    | 否   | 是否可清空             |
| keydownSearch | `boolean`             | `true`    | 否   | 按下回车时是否触发搜索 |

### 特殊说明

- fixed: true 的字段始终显示，其余字段在点击「更多」后展开
- 支持 input / select / date / daterange / datetime / datetimerange / cascader / tree-select 类型
- 表单项由 BaseSearchField 组件渲染，详见 BaseSearchField 文档
- 通过 defineExpose 暴露 formData、reset、search、toggleExpand 方法

## BaseSearchField

根据字段配置渲染单个表单项，供 BaseSearch / BaseSearchDrawer 复用，也可独立使用。

::: comp-preview base-search-field

```vue
<script setup lang="ts">
import { ref } from "vue";
import { BaseSearchField, type SearchFieldConfig } from "@/works/comp";

const field: SearchFieldConfig = {
  key: "searchKeyword",
  label: "关键词",
  placeholder: "请输入关键词",
};

const value = ref("");
</script>

<template>
  <BaseSearchField v-model="value" :field="field" />
</template>
```

:::

### Props

| 名称                 | 类型                      | 默认值 | 必填 | 说明                                                                |
| -------------------- | ------------------------- | ------ | ---- | ------------------------------------------------------------------- |
| field                | `BaseSearchField`         | —      | 是   | 字段配置对象，结构与 BaseSearch / BaseSearchDrawer 的 params 项一致 |
| modelValue / v-model | `unknown`                 | —      | 是   | 当前字段值双向绑定                                                  |
| paramOptions         | `BaseSearchFieldOption[]` | `[]`   | 否   | 异步加载的选项，field.options 为空时使用                            |

### Events

| 名称   | 参数      | 说明                                              |
| ------ | --------- | ------------------------------------------------- |
| change | `unknown` | 字段值变化时触发                                  |
| enter  | —         | 输入框回车时触发（field.keydownSearch !== false） |

### field 配置项

| 名称          | 类型                  | 默认值    | 必填 | 说明                                   |
| ------------- | --------------------- | --------- | ---- | -------------------------------------- |
| key           | `string`              | —         | 是   | 表单值字段名                           |
| label         | `string`              | —         | 是   | 标签文本                               |
| labelWidth    | `string`              | `"70px"`  | 否   | 标签宽度                               |
| placeholder   | `string`              | —         | 否   | 占位文本                               |
| fixed         | `boolean`             | `false`   | 否   | 是否在 BaseSearch 中固定显示（不折叠） |
| type          | `BaseSearchFieldType` | `"input"` | 否   | 表单项类型                             |
| options       | `{ name, value }[]`   | —         | 否   | select / radio-group 的选项列表        |
| clearable     | `boolean`             | `true`    | 否   | 是否可清空                             |
| keydownSearch | `boolean`             | `true`    | 否   | 按下回车时是否触发 enter 事件          |

### 特殊说明

- BaseSearch 与 BaseSearchDrawer 内部均使用本组件渲染单个表单项
- 支持 input / textarea / select / date 系列 / cascader / tree-select / radio-group
- 可单独用于自定义搜索表单布局，无需嵌套 BaseSearch

## BaseSearchDrawer

侧边抽屉式高级搜索表单，适用于复杂筛选场景。

::: comp-preview base-search-drawer

```vue
<script setup lang="ts">
import { ref } from "vue";
import { BaseSearchDrawer, type SearchFieldConfig } from "@/works/comp";

const drawerParams: SearchFieldConfig[] = [
  { key: "searchKeyword", label: "关键词", placeholder: "请输入" },
  { key: "remark", label: "备注", type: "textarea" },
];

const formData = ref<Record<string, unknown>>({});
const drawerRef = ref<InstanceType<typeof BaseSearchDrawer>>();
</script>

<template>
  <el-button type="primary" @click="drawerRef?.open()">打开高级筛选</el-button>
  <BaseSearchDrawer ref="drawerRef" v-model="formData" :params="drawerParams" />
</template>
```

:::

### Props

| 名称                 | 类型                                      | 默认值       | 必填 | 说明             |
| -------------------- | ----------------------------------------- | ------------ | ---- | ---------------- |
| params               | `BaseSearchField[]`                       | —            | 是   | 搜索字段配置数组 |
| modelValue / v-model | `Record<string, unknown>`                 | —            | 是   | 表单数据双向绑定 |
| paramOptions         | `Record<string, BaseSearchFieldOption[]>` | `{}`         | 否   | 异步加载的选项   |
| title                | `string`                                  | `"高级筛选"` | 否   | 抽屉标题         |
| drawerWidth          | `string`                                  | `"500px"`    | 否   | 抽屉宽度         |

### Events

| 名称   | 参数                      | 说明                                   |
| ------ | ------------------------- | -------------------------------------- |
| search | `Record<string, unknown>` | 点击确定时触发，参数为表单数据         |
| reset  | —                         | 点击取消时触发，同时关闭抽屉并重置表单 |

### 特殊说明

- 通过 ref 调用 open() 方法打开抽屉
- 支持 input / textarea / select / radio-group / date 等字段类型
- 表单项由 BaseSearchField 组件渲染，字段配置类型与 BaseSearch 一致
- 通过 defineExpose 暴露 open、formData、reset、search 方法

## BaseColumnSetting

表格列配置面板，支持拖拽排序、显隐切换和冻结列设置。

::: comp-preview base-column-setting

```vue
<script setup lang="ts">
import { computed, ref } from "vue";
import {
  BaseColumnSetting,
  BaseTable,
  stripEditColumn,
  withEditColumn,
  type BaseColumnSettingColumn,
  type BaseTableColumn,
} from "@/works/comp";

const columns = ref<BaseColumnSettingColumn[]>([
  { key: "index", type: "index", width: 36 },
  { key: "id", label: "ID", width: 72 },
  { key: "name", label: "名称", width: 140 },
]);

const tableColumns = computed(() => withEditColumn(columns.value as BaseTableColumn[], true));
const tableData = [{ id: 1, name: "项目 1" }];
const settingRef = ref<InstanceType<typeof BaseColumnSetting>>();
</script>

<template>
  <BaseTable
    mode="element"
    :table-data="tableData"
    :columns="tableColumns"
    height="360px"
    @edit-column="settingRef?.open()"
  />
  <BaseColumnSetting
    ref="settingRef"
    v-model:columns="columns"
    @confirm="(cols) => (columns = stripEditColumn(cols))"
  />
</template>
```

:::

### Props

| 名称        | 类型                        | 默认值       | 必填 | 说明                          |
| ----------- | --------------------------- | ------------ | ---- | ----------------------------- |
| columns     | `BaseColumnSettingColumn[]` | —            | 是   | 列配置数组（v-model:columns） |
| title       | `string`                    | `"表格设置"` | 否   | 抽屉标题                      |
| drawerWidth | `string`                    | `"592px"`    | 否   | 抽屉宽度                      |

### Events

| 名称           | 参数                        | 说明                             |
| -------------- | --------------------------- | -------------------------------- |
| update:columns | `BaseColumnSettingColumn[]` | 确认后触发，参数为更新后的列配置 |
| confirm        | `BaseColumnSettingColumn[]` | 点击确定时触发                   |

### 特殊说明

- 推荐配合 BaseTable 的 editColumn 列：表头 Setting 图标触发 open()，与 BaseCrud 一致
- editColumn 列使用 withEditColumn() 追加，不参与本面板排序与显隐
- selection / index / expand 类型的列不会在设置面板中显示
- 支持拖拽排序、显隐切换、冻结列设置（左 / 无 / 右）
- 确认时会按 fixed 位置重新排列：左冻结 → 正常 → 右冻结
- 列配置类型 BaseColumnSettingColumn 继承自 BaseTableColumn，新增 fixed 字段

## BaseCrud

组合搜索栏、表格、列设置与高级筛选，提供开箱即用的 CRUD 页面骨架。

::: comp-preview base-crud

```vue
<script setup lang="ts">
import { ref } from "vue";
import { BaseCrud, type BaseColumnSettingColumn, type SearchFieldConfig } from "@/works/comp";

const tableData = ref([{ id: 1, name: "项目 1", status: 1, amount: "1234.56" }]);
const searchModel = ref<Record<string, unknown>>({});
const searchParams: SearchFieldConfig[] = [
  { key: "searchKeyword", label: "关键词", placeholder: "请输入", fixed: true },
];
const columns = ref<BaseColumnSettingColumn[]>([
  { key: "index", type: "index", width: 36 },
  { key: "name", label: "名称", width: 140 },
]);
</script>

<template>
  <BaseCrud
    mode="element"
    v-model:search-model="searchModel"
    v-model:columns="columns"
    :search-params="searchParams"
    :table-data="tableData"
    table-height="360px"
  />
</template>
```

:::

### Props

| 名称              | 类型                                      | 默认值    | 必填 | 说明                                |
| ----------------- | ----------------------------------------- | --------- | ---- | ----------------------------------- |
| mode              | `BaseTableMode`                           | —         | 是   | 表格渲染模式                        |
| columns           | `BaseColumnSettingColumn[]`               | —         | 是   | 列配置（v-model:columns）           |
| tableData         | `Record<string, unknown>[]`               | —         | 是   | 表格数据                            |
| searchModel       | `Record<string, unknown>`                 | `{}`      | 否   | 搜索表单（v-model:searchModel）     |
| searchParams      | `BaseSearchField[]`                       | `[]`      | 否   | 搜索栏字段，为空时不渲染 BaseSearch |
| drawerParams      | `BaseSearchField[]`                       | `[]`      | 否   | 高级筛选字段，为空时不显示入口      |
| loading           | `boolean`                                 | `false`   | 否   | 加载状态                            |
| tableHeight       | `string`                                  | `"420px"` | 否   | 表格高度                            |
| rowKey            | `string`                                  | `"id"`    | 否   | 行主键字段                          |
| showColumnSetting | `boolean`                                 | `true`    | 否   | 是否显示列设置入口                  |
| paramOptions      | `Record<string, BaseSearchFieldOption[]>` | `{}`      | 否   | 搜索字段异步选项                    |

### Events

| 名称               | 参数                        | 说明               |
| ------------------ | --------------------------- | ------------------ |
| update:searchModel | `Record<string, unknown>`   | 搜索表单变更       |
| update:columns     | `BaseColumnSettingColumn[]` | 列配置变更         |
| search             | `Record<string, unknown>`   | 查询或高级筛选确定 |
| reset              | —                           | 重置搜索           |
| selectionChange    | `Record<string, unknown>[]` | 表格多选变化       |
| columnConfirm      | `BaseColumnSettingColumn[]` | 列设置确认         |

### Slots

| 名称    | 说明                 |
| ------- | -------------------- |
| toolbar | 表格工具栏左侧扩展区 |

### 特殊说明

- 组合 BaseSearch、BaseTable、BaseColumnSetting、BaseSearchDrawer，统一搜索与表格联动
- 高级筛选入口位于表格左上角；列设置通过表格最右侧 editColumn 列（Setting 图标）打开
- editColumn 列 fixed: right、无右边框，不参与 BaseColumnSetting 排序与显隐
- search / reset 事件需由使用方拉取数据并更新 tableData
- 空字符串搜索值不会写入 searchModel（继承 BaseSearch 行为）
- 通过 ref 可调用 openColumnSetting()、openSearchDrawer()
