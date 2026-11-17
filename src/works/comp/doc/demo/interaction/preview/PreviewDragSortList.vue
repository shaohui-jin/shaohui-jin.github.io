<script setup lang="ts">
import { ref } from "vue";

const items = ref([
  { id: 1, label: "首页菜单" },
  { id: 2, label: "用户管理" },
  { id: 3, label: "角色权限" },
  { id: 4, label: "系统配置" },
  { id: 5, label: "操作日志" },
]);

const dragIndex = ref<number | null>(null);

function onDragStart(i: number) {
  dragIndex.value = i;
}

function onDragOver(e: DragEvent, i: number) {
  e.preventDefault();
  if (dragIndex.value === null || dragIndex.value === i) return;
  const list = [...items.value];
  const [moved] = list.splice(dragIndex.value, 1);
  list.splice(i, 0, moved);
  items.value = list;
  dragIndex.value = i;
}

function onDragEnd() {
  dragIndex.value = null;
}
</script>

<template>
  <ul class="drag-list">
    <li
      v-for="(item, i) in items"
      :key="item.id"
      class="drag-list__item"
      :class="{ 'drag-list__item--dragging': dragIndex === i }"
      draggable="true"
      @dragstart="onDragStart(i)"
      @dragover="onDragOver($event, i)"
      @dragend="onDragEnd"
    >
      <span class="drag-list__handle">⠿</span>
      {{ item.label }}
    </li>
  </ul>
</template>

<style scoped lang="scss">
.drag-list {
  list-style: none;
  margin: 0;
  padding: 0;

  &__item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 12px;
    margin-bottom: 8px;
    background: #fff;
    border: 1px solid #e4e7ed;
    border-radius: 6px;
    cursor: grab;
    font-size: 13px;
    transition: box-shadow 0.15s;

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
    font-size: 16px;
  }
}
</style>
