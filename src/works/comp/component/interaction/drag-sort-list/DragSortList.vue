<script setup lang="ts">
import { ref } from "vue";
import type { DragSortListProps, DragSortListEmits } from "@/works/comp/type/interaction";

defineOptions({ name: "DragSortList" });

const props = defineProps<DragSortListProps>();
const emit = defineEmits<DragSortListEmits>();

const dragIndex = ref<number | null>(null);

function onDragStart(i: number) {
  dragIndex.value = i;
}

function onDragOver(e: DragEvent, i: number) {
  e.preventDefault();
  if (dragIndex.value === null || dragIndex.value === i) return;
  const list = [...props.modelValue];
  const [moved] = list.splice(dragIndex.value, 1);
  list.splice(i, 0, moved);
  emit("update:modelValue", list);
  emit("change", list);
  dragIndex.value = i;
}

function onDragEnd() {
  dragIndex.value = null;
}
</script>

<template>
  <ul class="drag-sort-list">
    <li
      v-for="(item, i) in modelValue"
      :key="item.id"
      class="drag-sort-list__item"
      :class="{ 'drag-sort-list__item--dragging': dragIndex === i }"
      draggable="true"
      @dragstart="onDragStart(i)"
      @dragover="onDragOver($event, i)"
      @dragend="onDragEnd"
    >
      <span class="drag-sort-list__handle">⠿</span>
      <slot name="item" :item="item">{{ item.label }}</slot>
    </li>
  </ul>
</template>

<style scoped lang="scss">
.drag-sort-list {
  list-style: none;
  margin: 0;
  padding: 0;

  &__item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 12px;
    margin-bottom: 8px;
    background: var(--comp-bg-card, #fff);
    border: 1px solid var(--comp-border-color, #e4e7ed);
    border-radius: 6px;
    cursor: grab;
    font-size: 13px;

    &--dragging {
      opacity: 0.6;
      box-shadow: 0 4px 12px rgb(0 0 0 / 12%);
    }
    &:active {
      cursor: grabbing;
    }
  }

  &__handle {
    color: #909399;
  }
}
</style>
