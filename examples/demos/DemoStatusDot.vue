<script setup lang="ts">
import { StatusDot, type StatusDotProps } from "comp-vue-lib";
import type { ComponentApi } from "./types";
import ApiTable from "./ApiTable.vue";

const api: ComponentApi = {
  props: [
    { name: "color", type: "string", default: '"rgba(203,206,212,1)"', required: false, desc: "圆点颜色，任意 CSS 颜色值" },
    { name: "text", type: "string", default: '""', required: false, desc: "显示文本" },
  ],
  slots: [
    { name: "default", desc: "未传 text 时，使用默认插槽自定义右侧内容" },
  ],
  notes: [
    "与 StatusTag 的区别：StatusTag 使用 Element Plus 的 ElTag 以标签形式展示预设状态类型（success / warning / info / danger）；StatusDot 使用纯色圆点 + 文字，颜色完全自定义，适用于表格行状态、列表指示器等场景。",
    "BaseTable 的 status-custom 列类型内部已使用 StatusDot 渲染。",
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
    <h2>StatusDot</h2>
    <p>彩色圆点状态指示器，用于在行内以圆点 + 文字标识状态</p>
  </div>
  <div class="widget-card widget-card--full">
    <div class="widget-card__head">
      <span class="widget-card__title">基础用法</span>
    </div>
    <div class="widget-card__body">
      <div class="widget-row">
        <StatusDot v-for="d in demos" :key="d.text" :color="d.color" :text="d.text" />
      </div>
    </div>
  </div>

  <div class="widget-card widget-card--full">
    <div class="widget-card__head">
      <span class="widget-card__title">使用插槽</span>
    </div>
    <div class="widget-card__body">
      <div class="widget-row">
        <StatusDot color="#409eff">
          <span style="margin-left: 6px; font-weight: 600">自定义内容</span>
        </StatusDot>
      </div>
    </div>
  </div>

  <div class="widget-card widget-card--full">
    <div class="widget-card__api">
      <h4>Props</h4>
      <ApiTable type="props" :rows="api.props" />
      <h4>Slots</h4>
      <ApiTable type="slots" :rows="api.slots!" />
      <div v-if="api.notes?.length" class="api-note">
        <h4>说明</h4>
        <ul>
          <li v-for="(n, i) in api.notes" :key="i">{{ n }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "./demo";
</style>
