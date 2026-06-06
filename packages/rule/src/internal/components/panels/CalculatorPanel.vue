<template>
  <div class="condition-node-panel">
    <el-form label-width="70px" :model="nodeData">
      <!-- 节点备注编辑区域 -->
      <div class="remark-container" @click="startEditRemark">
        <el-input
          type="textarea"
          ref="remarkInputRef"
          v-model="nodeData.remark"
          class="remark-input"
          placeholder="请输入备注"
          rows="4"
          :disabled="props.disabled"
          @blur="finishEditRemark"
          @keydown.enter.exact.prevent="finishEditRemark"
          @keydown.esc.prevent="cancelEditRemark"
        ></el-input>
      </div>
      <div class="param-group-title">输入参数：</div>
      <div class="param-list">
        <div v-for="(item, idx) in allInputOptions" :key="idx" class="param-row">
          <div class="param-label-col">
            <span class="param-label">{{ item.dataLabel }}</span>
          </div>
          <div class="param-input-group">
            <el-input
              :model-value="item.label"
              disabled
              style="pointer-events: none; user-select: none"
              placeholder=""
            />
          </div>
        </div>
      </div>
      <div class="divider" />
      <div class="param-group-title-row">
        <div class="param-group-title">出参配置：</div>
      </div>
      <div class="branch-list scrollable-branch-list">
        <div v-for="(param, idx) in nodeData.outputData" :key="idx" class="branch-card">
          <div class="branch-row">
            <BaseFunctionInput
              v-model="param.functionCode"
              :disabled="props.disabled"
              class="branch-cond-input"
            />
          </div>
          <div class="branch-row">
            <span class="branch-label-col">
              <span class="param-label">目标</span>
              <span class="param-type-under">({{ param.type }})</span>
            </span>
            <el-input
              :model-value="resolveOutputTarget(param)"
              disabled
              placeholder="目标"
              class="branch-target-input"
              style="flex: 1"
            />
          </div>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { toRefs, defineEmits, computed, ref, PropType, inject } from 'vue'
import BaseFunctionInput from '@/components/base/BaseFunctionInput.vue'
import { getAvailableSourceOptionsKey, getOutputTargetInfoKey } from '@/injectKeys'
import { type WorkflowNode } from '@/types/workflow'

const getOutputTargetInfo = inject(getOutputTargetInfoKey)
const getAvailableSourceOptions = inject(getAvailableSourceOptionsKey)!

const props = defineProps({
  nodeData: { type: Object, default: () => ({}) },
  disabled: { type: Boolean, default: false },
  onParamSourceChange: { type: Function as PropType<(param: any) => any[]> },
  onParamInputChange: { type: Function as PropType<(param: any) => any[]> }
})

const emit = defineEmits(['update:nodeBaseData', 'update:addPortData', 'update:removePortData'])
const { nodeData } = toRefs(props)

function resolveOutputTarget(param: Record<string, unknown>) {
  return getOutputTargetInfo?.(nodeData.value as WorkflowNode, param as never) ?? '未连接'
}

// 备注编辑状态
const remarkInputRef = ref<HTMLTextAreaElement | null>(null)
const originalRemark = ref('')

// 开始编辑备注
function startEditRemark() {
  originalRemark.value = nodeData.value.remark || ''

  // 在下一个事件循环中聚焦输入框
  setTimeout(() => {
    if (remarkInputRef.value) {
      remarkInputRef.value.focus()
    }
  }, 10)
}

// 完成编辑备注
function finishEditRemark() {
  // 更新节点基本数据
  emit('update:nodeBaseData', nodeData.value.id)
}

// 取消编辑备注
function cancelEditRemark() {
  nodeData.value.remark = originalRemark.value
}

// 新增：将所有param的options展开为一维数组，并生成data序号
const allInputOptions = computed(() => {
  const arr: { label: string; value: any; dataLabel: string }[] = []
  let idx = 0
  for (const param of nodeData.value.inputData || []) {
    const options = getAvailableSourceOptions(param) || []
    for (const option of options) {
      arr.push({
        label: option.label,
        value: option.value,
        dataLabel: idx === 0 ? 'data' : `data${idx}`
      })
      idx++
    }
  }
  return arr
})
</script>

<style lang="scss" scoped>
@use "jsh-core/style/variables" as *;

.condition-node-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  padding: 2px 0;
}

.remark-container {
  position: relative;
  margin-top: 16px;
  cursor: pointer;
  border-radius: $lib-radius-sm;
  transition: background-color 0.2s;
  overflow: hidden;
}

.remark-input {
  width: 100%;
  min-height: 60px;
  font-size: 14px;
  line-height: 1.5;
  color: $lib-text-primary;
  border-radius: $lib-radius-sm;
  outline: none;
  font-family: inherit;
  margin-bottom: 0;
}

.divider {
  height: 1px;
  background: $lib-border-color;
  margin: 10px 0 6px;
}

.param-group-title {
  font-weight: 600;
  font-size: 15px;
  margin: 8px 0 4px;
  color: $lib-text-heading;
  letter-spacing: 1px;
  user-select: none;
}

.param-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 8px;
}

.param-row {
  display: flex;
  align-items: center;
  gap: 6px;
  min-height: 24px;
  margin-bottom: 0;
}

.param-label-col {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  width: 60px;
  min-width: 60px;
  margin-right: 2px;
  user-select: none;
}

.param-label {
  color: var(--el-text-color-primary);
  font-size: 13px;
  font-weight: 500;
  text-align: right;
  max-width: 80px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  user-select: none;
}

.param-type-under {
  color: $lib-text-secondary;
  font-size: 11px;
  margin-top: 1px;
  text-align: right;
  user-select: none;
}

.param-input-group {
  display: flex;
  align-items: center;
  gap: 4px;
  flex: 1;
  width: 100%;
}
.param-input-group .el-input,
.param-input-group .el-select {
  width: 100% !important;
  min-width: 120px !important;
  max-width: 170px !important;
  height: 28px !important;
  max-height: 28px !important;
  font-size: 13px;
}

.branch-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 8px;
}

.branch-card {
  border-radius: 8px;
  position: relative;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.03);
}

.branch-row {
  display: flex;
  align-items: center;
  //margin-bottom: 4px;
  padding: 4px;
}

.branch-label-col {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  width: 60px;
  min-width: 60px;
  margin-right: 10px;
  user-select: none;
  pointer-events: auto;
}

.branch-target-input {
  width: 100px;
}

.scrollable-branch-list {
  flex: 1 1 0;
  min-height: 0;
  max-height: none;
  padding-right: 2px;
}

.button-group {
  display: flex;
  align-items: center;
}

.param-group-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
}
</style>
