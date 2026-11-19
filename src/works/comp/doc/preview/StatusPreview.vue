<script setup lang="ts">
import { Dot, Tag, type TagType } from "@/works/comp";

defineProps<{ name: string }>();

const tags: { label: string; type: TagType }[] = [
  { label: "成功", type: "success" },
  { label: "警告", type: "warning" },
  { label: "信息", type: "info" },
  { label: "危险", type: "danger" },
];

const dots = [
  { color: "#67c23a", text: "运行中" },
  { color: "#e6a23c", text: "待审核" },
  { color: "#f56c6c", text: "已停止" },
  { color: "rgba(203,206,212,1)", text: "未知" },
  { color: "#409eff", text: "处理中" },
];
</script>

<template>
  <div v-if="name === 'tag'" class="widget-row">
    <Tag v-for="item in tags" :key="item.type" :label="item.label" :type="item.type" />
  </div>
  <div v-else-if="name === 'dot'" class="widget-row">
    <Dot v-for="item in dots" :key="item.text" :color="item.color" :text="item.text" />
  </div>
  <div v-else-if="name === 'dot-slot'" class="widget-row">
    <Dot color="#409eff">
      <span class="status-preview__slot">自定义内容</span>
    </Dot>
  </div>
</template>

<style scoped lang="scss">
@use "../style/demo";

.status-preview__slot {
  margin-left: 6px;
  font-weight: 600;
}
</style>
