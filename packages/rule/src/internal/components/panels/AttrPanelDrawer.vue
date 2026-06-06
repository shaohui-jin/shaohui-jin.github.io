<template>
  <!-- 自定义属性面板抽屉 -->
  <div class="attr-panel-drawer" :class="{ 'drawer-open': visible }">
    <!-- 抽屉头部 -->
    <div class="drawer-header">
      <div class="drawer-title-container">
        <div class="drawer-title">
          <template v-if="nodeData">
            <span class="node-id">{{ nodeData?.id || '' }}</span>
            <div class="node-title-container" @click="startEditTitle">
              <p class="node-title" v-if="props.disabled">{{ nodeData?.title || '节点名称' }}</p>
              <template v-else-if="!isEditingTitle">
                <el-tooltip class="box-item" effect="dark" content="单击编辑标题" placement="top">
                  <p class="node-title">{{ nodeData?.title || '节点名称' }}</p>
                </el-tooltip>
              </template>
              <!-- <el-input v-model="input" placeholder="Please input" /> -->
              <el-input
                v-else
                ref="titleInputRef"
                class="node-title-input"
                v-model="nodeData.title"
                @blur="finishEditTitle"
                @keydown.enter.prevent="finishEditTitle"
                @keydown.esc.prevent="cancelEditTitle"
                size="default"
                placeholder="节点名称"
              />
            </div>
          </template>
        </div>
      </div>
      <div class="drawer-actions">
        <div class="node-type-icon">
          <BaseNodeIcon
            :type="nodeData?.funcType"
            :logic-type="nodeData?.logicData?.logicType"
            :size="24"
          />
        </div>
        <el-button size="small" circle @click="handleClose" class="close-btn">
          <el-icon><Close /></el-icon>
        </el-button>
      </div>
    </div>

    <!-- 抽屉内容 -->
    <div class="drawer-content">
      <component
        v-if="currentPanelComponent"
        :is="currentPanelComponent"
        :key="nodeData?.id"
        :nodeData="nodeData"
        :disabled="props.disabled"
        @update:addPortData="handleAddPortData"
        @update:removePortData="handleRemovePortData"
        @update:nodeBaseData="handleNodeBaseDataUpdate"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, PropType } from 'vue'
import { LogicType, WorkflowNode } from '@/types/workflow'
import FuncPanel from './FuncPanel.vue'
import ConditionPanel from './ConditionPanel.vue'
import CalculatorPanel from './CalculatorPanel.vue'
import { Close } from '@element-plus/icons-vue'
import BaseNodeIcon from '@/components/base/BaseNodeIcon.vue'

const props = defineProps({
  visible: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  nodeData: { type: Object as PropType<WorkflowNode>, default: () => ({}) }
})

/**
 * 组件事件定义
 */
const emit = defineEmits<{
  close: []
  addPortData: [newData: any, nodeId: string]
  removePortData: [index: number, nodeId: string, type?: string]
  nodeBaseDataUpdate: [nodeId: string]
}>()

/**
 * 组件状态
 */
const isEditingTitle = ref(false)
const titleInputRef = ref<HTMLInputElement | null>(null)
const originalTitle = ref('')

/**
 * 面板组件映射
 */
const panelMap = {
  func: FuncPanel,
  logic_condition: ConditionPanel,
  logic_calculator: CalculatorPanel
}

/**
 * 当前面板组件
 */
const currentPanelComponent = computed(() => {
  if (!props.nodeData) return null
  if (props.nodeData.funcType === 'logic') {
    if (props.nodeData.logicData?.logicType === LogicType.IFELSE) {
      return panelMap.logic_condition
    } else if (props.nodeData.logicData?.logicType === LogicType.CALCULATOR) {
      return panelMap.logic_calculator
    }
  }
  return panelMap.func
})

/**
 * 开始编辑标题
 */
function startEditTitle() {
  if (!props.nodeData) return

  // 保存原始标题，以便取消时恢复
  originalTitle.value = props.nodeData.title || ''
  isEditingTitle.value = true

  // 在下一个事件循环中聚焦输入框
  nextTick(() => {
    if (titleInputRef.value) {
      titleInputRef.value.focus()
    }
  })
}

/**
 * 完成编辑标题
 */
function finishEditTitle() {
  if (!props.nodeData) return
  isEditingTitle.value = false

  // 更新节点基本数据
  emit('nodeBaseDataUpdate', props.nodeData.id)
}

/**
 * 取消编辑标题
 */
function cancelEditTitle() {
  if (!props.nodeData) return

  // 恢复原始标题
  props.nodeData.title = originalTitle.value
  isEditingTitle.value = false
}

/**
 * 关闭抽屉
 */
function handleClose() {
  isEditingTitle.value = false
  emit('close')
}

/**
 * 添加端口数据
 */
function handleAddPortData(newData: any, nodeId: string) {
  emit('addPortData', newData, nodeId)
}

/**
 * 删除端口数据
 */
function handleRemovePortData(index: number, nodeId: string, type?: string) {
  emit('removePortData', index, nodeId, type)
}

/**
 * 更新节点基本数据
 */
function handleNodeBaseDataUpdate(nodeId: string) {
  emit('nodeBaseDataUpdate', nodeId)
}
</script>

<style lang="scss" scoped>
@use "jsh-core/style/variables" as *;
/* 自定义抽屉样式 */
.attr-panel-drawer {
  position: absolute;
  top: 60px;
  right: -500px;
  width: 500px;
  height: calc(100% - 70px);
  background: var(--el-bg-color);
  box-shadow: -2px 0 8px rgb(60 121 180 / 12%);
  z-index: 2001;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transform: translateX(0);
  will-change: right, transform;
  border-radius: 12px;
}

.attr-panel-drawer.drawer-open {
  right: 10px; /* 打开时滑入屏幕 */
  transform: translateX(0);
}

/* 抽屉内容动画 */
.drawer-content {
  flex: 1 1 0;
  //width: 100%;
  overflow: hidden;
  padding: 0 16px;
  background: var(--el-bg-color);
  opacity: 0;
  transform: translateX(20px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transition-delay: 0.1s;
}

.drawer-open .drawer-content {
  opacity: 1;
  transform: translateX(0);
}

/* 抽屉头部样式 */
.drawer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: var(--el-bg-color);
  border-bottom: 1px solid var(--el-border-color-lighter);
  flex-shrink: 0;
}

.drawer-title-container {
  display: flex;
  align-items: center;
  flex: 1 1 0;
  overflow: hidden;
}

.drawer-title {
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 500;
  line-height: 1.5;
  @apply text-theme-dark;
  width: 100%;
}

.drawer-actions {
  display: flex;
  align-items: center;
  margin-left: 12px;
  gap: 6px;
}

.node-id {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid;
  @apply border-theme-medium text-theme-medium;
  font-weight: 600;
  font-size: 12px;
  margin-right: 8px;
  flex-shrink: 0;
  line-height: 1;
}

.node-title-container {
  position: relative;
  display: flex;
  align-items: center;
  flex: 1;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background-color 0.2s;
  max-width: calc(100% - 40px);
  min-height: 28px;
}

.node-title-container:hover {
  @apply bg-theme-lightest;
}

.node-title {
  font-size: 16px;
  line-height: 1.5;
  font-weight: 500;
  @apply text-theme-dark;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block;
  margin: 0;
}

.node-title-input {
  width: 100%;
  font-size: 16px;
  font-weight: 500;
  line-height: 1.5;
  @apply text-theme-dark;
}

.node-type-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0;
}

.close-btn {
  @apply text-theme-medium;
  transition: color 0.2s ease;
}

.close-btn:hover {
  @apply text-theme-dark;
}

:deep(.el-form-item) {
  margin-bottom: 12px;
  display: flex;
  align-items: flex-start;
}

/* 调整表单项布局 */
:deep(.el-form-item__label) {
  padding: 0;
  height: auto;
  line-height: 1.5;
  text-align: right;
  flex-shrink: 0;
  position: relative; /* 添加相对定位 */
}

/* 移除 element-plus 的默认 margin */
:deep(.el-form-item__content) {
  margin-left: 0 !important;
  padding-left: 10px; /* 固定的左边距 */
  flex: 1;
  min-width: 0;
  display: flex;
  justify-content: flex-start;
  position: relative; /* 添加相对定位 */
}

/* 保持 ElementPlus 原有的 hover 交互，不覆盖默认行为 */

/* 确保所有输入控件宽度一致 */
:deep(.el-input),
:deep(.el-select),
:deep(.el-input-number) {
  width: 100%;
}

/* 修复 element-plus 的一些默认样式 */
:deep(.el-form-item__label-wrap) {
  width: 100%;
}

:deep(.el-form-item__label::before),
:deep(.el-form-item__label::after) {
  display: none !important;
}

:deep(.el-select) {
  width: 100% !important;
  min-width: 100px;
  max-width: 100%;
  flex-shrink: 0;
}

:deep(.el-select__tags) {
  width: 100% !important;
  max-width: 100% !important;
  min-width: 0 !important;
  flex-wrap: wrap;
  overflow: hidden;
}

:deep(.el-select__input) {
  width: 100% !important;
  min-width: 0 !important;
}
</style>
