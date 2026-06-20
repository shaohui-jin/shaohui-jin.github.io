<script setup lang="ts">
import { ref } from "vue";
import { HeatmapCalendar } from "jsh-comp";
import type { HeatmapCell } from "jsh-comp/type";
import type { ComponentApi } from "../../type/types";
import ApiTable from "../ApiTable.vue";
import DemoWidgetTabs from "../DemoWidgetTabs.vue";
import { demoCodes } from "../demoCodes";

const heatmapData: HeatmapCell[] = Array.from({ length: 84 }, (_, i) => ({
  date: `Day ${i + 1}`,
  count: (i * 7 + 3) % 10,
}));

const eventLog = ref("—");

function onCellClick(cell: HeatmapCell) {
  eventLog.value = `cell-click → ${cell.date}: ${cell.count} 次`;
}

const api: ComponentApi = {
  props: [
    { name: "data", type: "HeatmapCell[]", default: "—", required: true, desc: "热力图单元格数据（date + count）" },
  ],
  events: [
    { name: "cell-click", payload: "(cell: HeatmapCell)", desc: "点击单元格" },
  ],
};
</script>

<template>
  <div class="doc-content__header">
    <h2>HeatmapCalendar 热力日历</h2>
    <p>类似 GitHub 贡献图的热力日历，通过颜色深浅展示数值密度</p>
  </div>

  <DemoWidgetTabs :code="demoCodes.heatmapCalendar">
    <HeatmapCalendar :data="heatmapData" @cell-click="onCellClick" />
    <p class="widget-hint">最近事件：{{ eventLog }}</p>
  </DemoWidgetTabs>

  <div class="api-section">
    <h3 class="api-section__title">HeatmapCalendar Props</h3>
    <ApiTable type="props" :rows="api.props" />
  </div>

  <div class="api-section">
    <h3 class="api-section__title">HeatmapCalendar Events</h3>
    <ApiTable type="events" :rows="api.events" />
  </div>
</template>

<style scoped lang="scss">
@use "../../style/demo";
</style>
