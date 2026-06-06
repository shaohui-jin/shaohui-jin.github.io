<template>
  <div class="base-dnd-panel" ref="panelRef">
    <div
      v-for="item in baseFunctionNode"
      :key="item.funcId"
      class="dnd-panel-item"
      @touchmove="onTouchMove"
      @touchstart="e => onNodeMouseDown(item, e)"
      @mousedown="e => onNodeMouseDown(item, e)"
    >
      <div class="dnd-panel-item-icon logic">
        <BaseNodeIcon :type="item.type" :size="32" />
      </div>
      <div class="dnd-panel-item-title">{{ item.title }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BaseNodeIcon from '@/components/base/BaseNodeIcon.vue'
import { builtinNodes, type BaseFunctionNodeType } from '@/data/builtinNodes'

const baseFunctionNode = builtinNodes

const emit = defineEmits(['node-mouse-down'])

const onTouchMove = (e: TouchEvent) => {
  e.preventDefault()
}

const onNodeMouseDown = (item: BaseFunctionNodeType, e: MouseEvent | TouchEvent) => {
  emit('node-mouse-down', e, item)
}

</script>

<style scoped lang="scss">
@use "jsh-core/style/variables" as *;

.base-dnd-panel {
  position: absolute;
  top: 10px;
  left: 10px;
  height: calc(100% - 20px);
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-height: 0;
  z-index: 2000;

  .dnd-panel-item {
    width: 80px;
    height: 80px;
    background: $lib-bg-subtle;
    border: 1.5px solid $lib-border-color;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: grab;
    transition: box-shadow 0.2s, border 0.2s;
    user-select: none;
    pointer-events: auto;
    position: relative;

    .dnd-info {
      position: absolute;
      right: 10px;
      top: 10px;
      z-index: 101;
      cursor: pointer !important;
    }

    &:hover {
      border: 1.5px solid $lib-color-primary;
      background: var(--el-color-primary-light-9, #ecf5ff);
    }

    .dnd-panel-item-icon {
      margin-bottom: 6px;
    }

    .dnd-panel-item-title {
      font-size: 12px;
      color: $lib-text-primary;
      font-weight: 500;
      text-align: center;
    }
  }
}
</style>
