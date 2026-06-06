<template>
  <div v-if="visible" class="workflow-validation-panel">
    <div class="panel-header">
      <div class="panel-title">检查判断 ({{ totalErrorCount }})</div>
      <el-button 
        type="text" 
        class="close-btn"
        @click="handleClose"
      >
        <el-icon><Close /></el-icon>
      </el-button>
    </div>
    
    <div class="validation-content">
      <!-- 提示信息 -->
      <div class="validation-tip">
        发布前请确保所有问题已解决
      </div>
      
             <!-- 错误列表 -->
       <div class="error-list" :class="{ 'has-scrollbar': hasScrollbar }">
         <div
           v-for="(errorGroup, index) in groupedErrors"
           :key="index"
           class="error-group-container"
           @click="handleErrorItemClick(errorGroup.nodeId)"
         >
           <!-- 错误组标题 -->
           <div class="error-group-title">
             {{ errorGroup.nodeId }}：{{ errorGroup.nodeTitle }}
           </div>
           
           <!-- 错误项列表 -->
           <div class="error-items">
             <div
               v-for="(error, errorIndex) in errorGroup.errors"
               :key="errorIndex"
               class="error-item"
             >
               <el-icon class="error-icon">
                 <CircleCloseFilled />
               </el-icon>
               <span class="error-text">{{ error }}</span>
             </div>
           </div>
         </div>
       </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, nextTick } from 'vue'
import { CircleCloseFilled, Close } from '@element-plus/icons-vue'

/**
 * 错误信息接口
 */
interface ValidationError {
  nodeId: string
  nodeTitle: string
  errors: string[]
  type: 'workflow' | 'edge'
}

/**
 * 组件属性定义
 */
interface Props {
  visible: boolean
  errors: ValidationError[]
}

const props = defineProps<Props>()

/**
 * 组件事件定义
 */
const emit = defineEmits<{
  close: []
  nodeSelect: [nodeId: string]
}>()

/**
 * 组件状态
 */
const dialogVisible = ref(false)
const hasScrollbar = ref(false)

/**
 * 监听visible属性变化
 */
watch(
  () => props.visible,
  (newVisible) => {
    dialogVisible.value = newVisible
    if (newVisible) {
      // 弹窗显示后检查是否需要滚动条
      nextTick(() => {
        checkScrollbar()
      })
    }
  }
)

/**
 * 监听弹窗显示状态变化
 */
watch(dialogVisible, (newVisible) => {
  if (!newVisible) {
    emit('close')
  }
})

/**
 * 计算总错误数量
 */
const totalErrorCount = computed(() => {
  return props.errors.reduce((total, group) => total + group.errors.length, 0)
})

/**
 * 按节点分组的错误信息
 */
const groupedErrors = computed(() => {
  // 按节点ID分组
  const grouped = new Map<string, ValidationError>()
  
  props.errors.forEach(error => {
    if (grouped.has(error.nodeId)) {
      grouped.get(error.nodeId)!.errors.push(...error.errors)
    } else {
      grouped.set(error.nodeId, { ...error })
    }
  })
  
  return Array.from(grouped.values())
})

/**
 * 检查是否需要滚动条
 */
const checkScrollbar = () => {
  const errorList = document.querySelector('.error-list')
  if (errorList) {
    hasScrollbar.value = errorList.scrollHeight > 600
  }
}

/**
 * 处理错误项点击
 */
const handleErrorItemClick = (nodeId: string) => {
  emit('nodeSelect', nodeId)
}

/**
 * 处理关闭弹窗
 */
const handleClose = () => {
  dialogVisible.value = false
  emit('close')
}


</script>

<style scoped lang="scss">
@use "jsh-core/style/variables" as *;

.workflow-validation-panel {
  position: absolute;
  right: 0;
  top: 60px;
  width: 350px;
  height: calc(100% - 60px);
  background: $lib-bg-card;
  border-left: 1px solid $lib-border-color;
  box-shadow: -2px 0 8px rgb(0 0 0 / 10%);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  border-radius: $lib-radius-md;
  overflow: hidden;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  background: $lib-bg-card;
  border-bottom: 1px solid $lib-border-color;
  flex-shrink: 0;
}

.panel-title {
  font-size: 16px;
  font-weight: 600;
  color: $lib-text-primary;
}

.close-btn {
  padding: 4px;
  color: $lib-text-secondary;
}

.close-btn:hover {
  color: $lib-text-regular;
}

.validation-content {
  padding: 8px;
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background: $lib-bg-card;
}

.validation-tip {
  font-size: 14px;
  color: $lib-text-secondary;
  margin-bottom: 6px;
  flex-shrink: 0;
}

.error-list {
  flex: 1;
  overflow-y: auto;
  background: $lib-bg-card;
  border-radius: $lib-radius-sm;
  padding: 8px;
}

.error-list.has-scrollbar {
  padding-right: 8px;
}

.error-group-container {
  margin-bottom: 12px;
  background: $lib-bg-card;
  border: 1px solid $lib-border-color;
  border-radius: $lib-radius-md;
  padding: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.error-group-container:hover {
  border-color: $lib-color-primary;
  box-shadow: 0 2px 8px rgb(64 158 255 / 10%);
}

.error-group-title {
  font-size: 14px;
  font-weight: 600;
  color: $lib-text-primary;
  margin-bottom: 8px;
  padding: 8px 12px;
  background: $lib-bg-page;
  border-radius: $lib-radius-sm;
  border-left: 3px solid $lib-color-primary;
}

.error-items {
  margin-left: 0;
}

.error-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 8px 12px;
  transition: background-color 0.2s;
  border-radius: $lib-radius-sm;
  background: $lib-bg-subtle;
  margin-bottom: 4px;
  border: none;
}

.error-item:last-child {
  margin-bottom: 0;
}

.error-item:hover {
  background-color: $lib-bg-muted;
}

.error-icon {
  color: var(--el-color-danger, #f56c6c);
  font-size: 16px;
  margin-top: 2px;
  flex-shrink: 0;
}

.error-text {
  font-size: 14px;
  color: $lib-text-regular;
  line-height: 1.5;
  flex: 1;
}

.divider {
  height: 1px;
  background-color: $lib-border-color;
  margin: 12px 0;
}

.error-list::-webkit-scrollbar {
  width: 8px;
}

.error-list::-webkit-scrollbar-track {
  background: $lib-bg-muted;
  border-radius: $lib-radius-sm;
}

.error-list::-webkit-scrollbar-thumb {
  background: $lib-border-medium;
  border-radius: $lib-radius-sm;
}

.error-list::-webkit-scrollbar-thumb:hover {
  background: $lib-text-secondary;
}
</style>
