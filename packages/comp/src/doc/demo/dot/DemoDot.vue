<script setup lang="ts">
import { Dot } from "jsh-comp";
import type { ComponentApi } from "../../type/types";
import ApiTable from "../ApiTable.vue";
import DemoWidgetTabs from "../DemoWidgetTabs.vue";
import { demoCodes } from "../demoCodes";

const api: ComponentApi = {
  props: [
    {
      name: "color",
      type: "string",
      default: '"rgba(203,206,212,1)"',
      required: false,
      desc: "圆点颜色，任意 CSS 颜色值",
    },
    { name: "text", type: "string", default: '""', required: false, desc: "显示文本" },
  ],
  slots: [{ name: "default", desc: "未传 text 时，使用默认插槽自定义右侧内容" }],
  notes: [
    "与 Tag 的区别：Tag 使用 Element Plus 的 ElTag 以标签形式展示预设状态类型（success / warning / info / danger）；Dot 使用纯色圆点 + 文字，颜色完全自定义，适用于表格行状态、列表指示器等场景。",
    "BaseTable 的 status-custom 列类型内部已使用 Dot 渲染。",
  ],
};

const demos = [
  { color: "#67c23a", text: "运行中" },
  { color: "#e6a23c", text: "待审核" },
  { color: "#f56c6c", text: "已停止" },
  { color: "rgba(203,206,212,1)", text: "未知" },
  { color: "#409eff", text: "处理中" },
];
</script>

<template>
  <div class="doc-content__header">
    <h2>Dot</h2>
    <p>彩色圆点状态指示器，用于在行内以圆点 + 文字标识状态</p>
  </div>

  <h3 class="demo-subsection__title">基础用法</h3>
  <DemoWidgetTabs :code="demoCodes.dotBasic">
    <div class="widget-row">
      <Dot v-for="d in demos" :key="d.text" :color="d.color" :text="d.text" />
    </div>
  </DemoWidgetTabs>

  <h3 class="demo-subsection__title">使用插槽</h3>
  <DemoWidgetTabs :code="demoCodes.dotSlot">
    <div class="widget-row">
      <Dot color="#409eff">
        <span style="margin-left: 6px; font-weight: 600">自定义内容</span>
      </Dot>
    </div>
  </DemoWidgetTabs>

  <div class="api-section">
    <h3 class="api-section__title">Dot Props</h3>
    <ApiTable type="props" :rows="api.props" />
  </div>

  <div class="api-section">
    <h3 class="api-section__title">Dot Slots</h3>
    <ApiTable type="slots" :rows="api.slots!" />
  </div>

  <div v-if="api.notes?.length" class="api-section">
    <h3 class="api-section__title">特殊说明</h3>
    <ul class="api-notes-list">
      <li v-for="(n, i) in api.notes" :key="i">{{ n }}</li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
@use "../../style/variables" as *;
@use "../../style/demo";
</style>
