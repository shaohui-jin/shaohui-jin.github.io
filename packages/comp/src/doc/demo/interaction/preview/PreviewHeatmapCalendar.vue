<script setup lang="ts">
import { ref, computed } from "vue";

const tooltip = ref({ visible: false, text: "", x: 0, y: 0 });

const weeks = 12;
const days = weeks * 7;

const data = Array.from({ length: days }, (_, i) => ({
  date: `Day ${i + 1}`,
  count: Math.floor(Math.random() * 10),
}));

const maxCount = computed(() => Math.max(...data.map((d) => d.count), 1));

function level(count: number) {
  if (count === 0) return 0;
  return Math.ceil((count / maxCount.value) * 4);
}

function showTip(e: MouseEvent, item: { date: string; count: number }) {
  tooltip.value = {
    visible: true,
    text: `${item.date}: ${item.count} 次`,
    x: e.clientX,
    y: e.clientY,
  };
}

function hideTip() {
  tooltip.value.visible = false;
}
</script>

<template>
  <div class="heatmap">
    <div class="heatmap__grid">
      <div
        v-for="(item, i) in data"
        :key="i"
        class="heatmap__cell"
        :class="`heatmap__cell--l${level(item.count)}`"
        @mouseenter="showTip($event, item)"
        @mouseleave="hideTip"
      />
    </div>
    <div class="heatmap__legend">
      <span>少</span>
      <div v-for="l in 4" :key="l" class="heatmap__cell" :class="`heatmap__cell--l${l}`" />
      <span>多</span>
    </div>
    <Teleport to="body">
      <div
        v-if="tooltip.visible"
        class="heatmap__tooltip"
        :style="{ left: `${tooltip.x + 8}px`, top: `${tooltip.y - 28}px` }"
      >
        {{ tooltip.text }}
      </div>
    </Teleport>
  </div>
</template>

<style scoped lang="scss">
.heatmap {
  &__grid {
    display: flex;
    flex-wrap: wrap;
    gap: 3px;
    max-width: 100%;
  }

  &__cell {
    width: 14px;
    height: 14px;
    border-radius: 2px;
    background: #ebedf0;
    cursor: pointer;

    &--l1 { background: #9be9a8; }
    &--l2 { background: #40c463; }
    &--l3 { background: #30a14e; }
    &--l4 { background: #216e39; }
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
