<script setup lang="ts">
import { ref, computed } from "vue";
import type {
  HeatmapCalendarProps,
  HeatmapCalendarEmits,
  HeatmapCell,
} from "@/works/comp/type/interaction";

defineOptions({ name: "HeatmapCalendar" });

const props = defineProps<HeatmapCalendarProps>();
const emit = defineEmits<HeatmapCalendarEmits>();

const tooltip = ref({ visible: false, text: "", x: 0, y: 0 });

const maxCount = computed(() => Math.max(...props.data.map((d) => d.count), 1));

function level(count: number) {
  if (count === 0) return 0;
  return Math.ceil((count / maxCount.value) * 4);
}

function showTip(e: MouseEvent, cell: HeatmapCell) {
  tooltip.value = {
    visible: true,
    text: `${cell.date}: ${cell.count} 次`,
    x: e.clientX,
    y: e.clientY,
  };
}

function hideTip() {
  tooltip.value.visible = false;
}

function onCellClick(cell: HeatmapCell) {
  emit("cell-click", cell);
}
</script>

<template>
  <div class="heatmap-calendar">
    <div class="heatmap-calendar__grid">
      <div
        v-for="(cell, i) in data"
        :key="i"
        class="heatmap-calendar__cell"
        :class="`heatmap-calendar__cell--l${level(cell.count)}`"
        @mouseenter="showTip($event, cell)"
        @mouseleave="hideTip"
        @click="onCellClick(cell)"
      />
    </div>
    <div class="heatmap-calendar__legend">
      <span>少</span>
      <div
        v-for="l in 4"
        :key="l"
        class="heatmap-calendar__cell"
        :class="`heatmap-calendar__cell--l${l}`"
      />
      <span>多</span>
    </div>
    <Teleport to="body">
      <div
        v-if="tooltip.visible"
        class="heatmap-calendar__tooltip"
        :style="{ left: `${tooltip.x + 8}px`, top: `${tooltip.y - 28}px` }"
      >
        {{ tooltip.text }}
      </div>
    </Teleport>
  </div>
</template>

<style scoped lang="scss">
.heatmap-calendar {
  &__grid {
    display: flex;
    flex-wrap: wrap;
    gap: 3px;
  }

  &__cell {
    width: 14px;
    height: 14px;
    border-radius: 2px;
    background: #ebedf0;
    cursor: pointer;

    &--l1 {
      background: #9be9a8;
    }
    &--l2 {
      background: #40c463;
    }
    &--l3 {
      background: #30a14e;
    }
    &--l4 {
      background: #216e39;
    }
  }

  &__legend {
    display: flex;
    align-items: center;
    gap: 4px;
    margin-top: 12px;
    font-size: 11px;
    color: #909399;
  }

  &__tooltip {
    position: fixed;
    z-index: 9999;
    padding: 4px 8px;
    background: #303133;
    color: #fff;
    border-radius: 4px;
    font-size: 12px;
    pointer-events: none;
  }
}
</style>
