<script setup lang="ts">
import { Tag, type TagType } from "jsh-comp";
import type { ComponentApi } from "../../type/types";
import ApiTable from "../ApiTable.vue";
import DemoWidgetTabs from "../DemoWidgetTabs.vue";
import { demoCodes } from "../demoCodes";

const demos: { label: string; type: TagType }[] = [
  { label: "成功", type: "success" },
  { label: "警告", type: "warning" },
  { label: "信息", type: "info" },
  { label: "危险", type: "danger" },
];

const api: ComponentApi = {
  props: [
    { name: "label", type: "string", default: "—", required: true, desc: "标签文案" },
    {
      name: "type",
      type: '"success" | "warning" | "info" | "danger"',
      default: '"info"',
      required: false,
      desc: "视觉类型",
    },
  ],
};
</script>

<template>
  <div class="doc-content__header">
    <h2>Tag</h2>
    <p>用于显示状态的圆角标签</p>
  </div>
  <DemoWidgetTabs :code="demoCodes.tag">
    <div class="widget-row">
      <Tag v-for="d in demos" :key="d.type" :label="d.label" :type="d.type" />
    </div>
  </DemoWidgetTabs>

  <div class="api-section">
    <h3 class="api-section__title">Tag Props</h3>
    <ApiTable type="props" :rows="api.props" />
  </div>
</template>

<style scoped lang="scss">
@use "../../style/demo";
</style>
