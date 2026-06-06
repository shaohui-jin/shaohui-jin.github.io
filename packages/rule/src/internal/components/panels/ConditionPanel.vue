<template>
  <div class="condition-node-panel">
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

    <div class="param-group-title">输入参数</div>
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
      <div class="button-group">
        <el-button type="primary" @click="addElseIf" class="add-else-btn narrow-add-btn">
          + 分支
        </el-button>
      </div>
    </div>
    <div class="branch-list scrollable-branch-list">
      <div v-for="(param, idx) in nodeData.outputData" :key="idx" class="branch-card">
        <div class="branch-row">
          <span class="branch-label">
            {{ idx === 0 ? 'if' : idx === nodeData.outputData.length - 1 ? 'else' : 'elseif' }}
          </span>
          <template v-if="idx !== nodeData.outputData.length - 1">
            <BaseFunctionInput
              v-model="param.functionCode"
              :disabled="props.disabled"
              class="branch-cond-input"
            />
          </template>
        </div>
        <div class="branch-row">
          <span class="branch-label">目标</span>
          <el-input
            :model-value="getOutputTargetInfo(nodeData, param)"
            disabled
            placeholder="目标"
            class="branch-target-input"
            style="flex: 1"
          />
        </div>
        <el-button
          v-if="canDeleteBranch(idx)"
          type="danger"
          @click="removeBranch(idx)"
          circle
          class="branch-del"
        >
          -
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { toRefs, defineEmits, computed, ref, inject } from 'vue'
import BaseFunctionInput from '@/components/base/BaseFunctionInput.vue'
import { getAvailableSourceOptionsKey, getOutputTargetInfoKey } from '@/injectKeys'

const getOutputTargetInfo = inject(getOutputTargetInfoKey)
const getAvailableSourceOptions = inject(getAvailableSourceOptionsKey)

const props = defineProps<{
  nodeData: any
  disabled: boolean
  onParamSourceChange: (param: any, value: any) => void
  onParamInputChange: (param: any, value: any) => void
}>()

const emit = defineEmits(['update:nodeBaseData', 'update:addPortData', 'update:removePortData'])
const { nodeData } = toRefs(props)

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

function calcPortId(): string {
  //遍历 nodeData.value.outputData 找出所有 portId 中最大的数字
  const portId = nodeData.value.outputData.map((item: any) => Number(item.portId.split('_')[1]))
  const maxPortId = Math.max(...portId)
  return String(maxPortId + 1)
}

function onNodeTitleChange(val: string) {
  nodeData.value.title = val
  emit('update:nodeBaseData', nodeData.value.id)
}

function addElseIf(): void {
  if (props.disabled) {
    return
  }
  const newBranch = {
    functionCode: '',
    target: '',
    type: 'table',
    subType: 'any',
    portId: 'out_' + calcPortId()
  }
  emit('update:addPortData', newBranch, nodeData.value.id)
}

// 判断是否可以删除分支（中间分支且总数大于2）
function canDeleteBranch(idx: number): boolean {
  const { outputData } = nodeData.value
  const isMiddleBranch = idx !== 0 && idx !== outputData.length - 1
  const hasEnoughBranches = outputData.length > 2
  return isMiddleBranch && hasEnoughBranches
}

function removeBranch(idx: number) {
  if (props.disabled || !canDeleteBranch(idx)) {
    return
  }
  emit('update:removePortData', idx, nodeData.value.id)
}
</script>

<style lang="scss" scoped>
@use "jsh-core/style/variables" as *;

.condition-node-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  padding: 2px 0 2px 0;
}

/* 备注编辑区域样式 */
.remark-container {
  position: relative;
  margin-top: 16px;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.2s;
  overflow: hidden;
}

.remark-input {
  width: 100%;
  min-height: 60px;
  font-size: 14px;
  line-height: 1.5;
  color: var(--el-text-color-primary);
  border-radius: 4px;
  outline: none;
  font-family: inherit;
  margin-bottom: 0;
}

.divider {
  height: 1px;
  background: var(--el-border-color-lighter);
  margin: 10px 0 6px 0;
}

.param-group-title {
  font-weight: 600;
  font-size: 15px;
  margin: 8px 0 4px 0;
  color: var(--el-text-color-primary);
  letter-spacing: 1px;
  user-select: none;
}

.param-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 10px;
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
  background: var(--el-color-primary-light-9);
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

.branch-label {
  width: 40px;
  font-size: 13px;
  color: var(--el-text-color-primary);
  font-weight: 500;
  margin-right: 4px;
  text-align: right;
  user-select: none;
}

.branch-target-input {
  width: 100px;
}

.scrollable-branch-list {
  flex: 1 1 0;
  min-height: 0;
  max-height: none;
  overflow-y: overlay;
  overflow-x: hidden;
  padding: 8px 0;
}

.branch-del {
  position: absolute;
  top: -10px !important;
  right: 0 !important;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: var(--el-color-danger);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: bold;
  line-height: 1;
  padding: 0;
  box-shadow: none !important;
  z-index: 12;
}

.add-else-btn {
  margin-top: 2px;
  margin-left: 6px;
  min-width: 50px;
  height: 20px;
  font-weight: 500;
  letter-spacing: 1px;
  border-radius: 5px;
  background: $lib-color-primary;
  color: $lib-bg-card;
  border: none;
  transition: background 0.2s;
  box-shadow: 0 1px 4px rgb(60 121 180 / 15%);
  padding: 0 8px;
  font-size: 12px;
}

.add-else-btn:hover {
  background: var(--el-color-primary-light-3);
  color: $lib-bg-card;
  border: none;
  transition: background 0.2s;
  box-shadow: 0 1px 4px rgb(60 121 180 / 20%);
  padding: 0 8px;
  font-size: 12px;
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

.narrow-add-btn {
  min-width: 32px;
  width: 50px;
  padding: 0 4px;
  height: 18px;
  font-size: 12px;
  border-radius: 5px;
  margin-left: 4px;
}
</style>
