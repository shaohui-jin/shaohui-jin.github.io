<template>
  <div class="rule-edit-layout">
    <DndPanel @node-mouse-down="(e, node) => onNodeMouseDown(node, e)" />

    <!-- 中间画布区域：用于展示和编辑工作流 -->
    <div class="center-panel">
      <div class="canvas-center-wrap">
        <Designer
          ref="editorRef"
          :data="workflowData"
          @show-attr-panel="onShowAttrPanel"
          @update:workflow="updateWorkflowData"
          @test-lua="handleTestLua"
          :nodeId="nodeId"
          :isTesting="isTesting"
        />
      </div>
    </div>

    <!-- 属性面板抽屉组件 -->
    <AttrPanelDrawer
      :visible="showAttrPanel"
      :nodeData="selectedNodeData"
      @close="onCloseAttrPanel"
      @addPortData="addPortData"
      @removePortData="removePortData"
      @nodeBaseDataUpdate="onNodeBaseDataUpdate"
    />

    <!-- 测试抽屉 -->
    <TestDrawer @node-click="handleNodeClick" ref="testDrawerRef" @close="closeTestDrawer" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, provide, type Ref } from 'vue'
import Designer from '@/components/designer/index.vue'
import AttrPanelDrawer from '@/components/panels/AttrPanelDrawer.vue'
import DndPanel from '@/components/panels/DndPanel.vue'
import { LogicType, OutputData, type WorkflowData, WorkflowNode } from '@/types/workflow'
import nodeIdFactory from '@/utils/factory/NodeIdFactory'

import TestDrawer from '@/components/TestDrawer/index.vue'

import { type BaseFunctionNodeType } from '@/data/builtinNodes'
import { ExecutionRecordData } from '@/types/ruleApi'
import {
  getAllAvailableOptionsKey,
  getAvailableSourceOptionsKey,
  getAvailableTargetOptionsKey,
  getOutputTargetInfoKey
} from '@/injectKeys'
import { ValidatorManager } from '@/utils/manager/ValidatorManager'

defineOptions({
  name: 'WorkflowDesigner'
})

/**
 * 工作流数据
 * 包含节点列表、边列表和工作流配置
 * 使用ref包装以实现响应式
 */
const workflowData = ref<WorkflowData>({
  id: '', // 工作流ID
  nodeList: [], // 节点列表
  edges: [], // 边列表
  groupList: [], // 组列表
  lua: '', // Lua脚本
  ruleName: '' // 规则名称
})

// 页面退出拦截相关状态

// 检查画布是否有内容
function hasCanvasContent(): boolean {
  return workflowData.value.nodeList.length > 0 || workflowData.value.edges.length > 0
}

// 浏览器刷新/关闭事件处理
async function handleBeforeUnload(event: BeforeUnloadEvent) {
  // 如果画布为空，不拦截
  if (!hasCanvasContent()) {
    return
  }
  event.preventDefault()
  event.returnValue = '离开此网站？系统可能不会保存您所做的更改。'
  return event.returnValue
}

/**
 * 更新工作流数据
 * @param data 新的工作流数据
 */
function updateWorkflowData(data: WorkflowData) {
  workflowData.value = data
  syncNodeIdFactoryWithWorkflow(data)
}
// 同步节点ID工厂
function syncNodeIdFactoryWithWorkflow(data: WorkflowData) {
  const maxId = Math.max(0, ...data.nodeList.map(n => Number(n.id)).filter(n => !isNaN(n)))
  nodeIdFactory.reset(maxId + 1)
}

// 属性面板相关状态
const showAttrPanel = ref(false)
const selectedNodeData = ref<any>(null)

// 属性面板事件处理
function onShowAttrPanel(nodeData: WorkflowNode) {
  selectedNodeData.value = nodeData
  // 如果抽屉已经打开，只是切换节点数据，不关闭抽屉
  if (!showAttrPanel.value && nodeData) {
    showAttrPanel.value = true
  }
  // 如果点击空白区域且抽屉已打开，则关闭抽屉
  if (!nodeData && showAttrPanel.value) {
    showAttrPanel.value = false
  }
}

// 关闭属性面板
function onCloseAttrPanel() {
  showAttrPanel.value = false

  // 延迟清空节点数据，确保关闭动画完成后再清空
  // 这样可以避免在关闭后立即点击同一节点时无法打开抽屉的问题
  setTimeout(() => {
    selectedNodeData.value = null

    // 通知编辑器取消节点选择状态
    if (editorRef.value) {
      editorRef.value.clearSelection?.()
    }
  }, 300)
}

// 添加端口数据
function addPortData(newData: any, nodeId: string) {
  editorRef.value.addPortData(newData, nodeId)
}
// 删除端口数据
function removePortData(index: number, nodeId: string, type?: string) {
  editorRef.value.removePortData(index, nodeId, type)
}

function onNodeBaseDataUpdate(nodeId: string) {
  // 更新单个node的基本信息显示（无port）
  editorRef.value?.onNodeBaseDataUpdate(nodeId)
}

// 另存对话框相关状态
const testDrawerRef = ref<any>(null) // 测试抽屉引用

onMounted(async () => {
  // 添加浏览器事件监听
  window.addEventListener('beforeunload', handleBeforeUnload)
})

onUnmounted(() => {
  // 清理浏览器事件监听
  window.removeEventListener('beforeunload', handleBeforeUnload)
})

// 工作流设计器组件引用
const editorRef = ref()

/**
 * 处理节点拖拽到画布
 * @param type 节点类型 'logic' | 'func'
 * @param item 节点基础数据
 * @param e 鼠标事件
 */
function onNodeMouseDown(item: BaseFunctionNodeType, e: MouseEvent) {
  editorRef.value?.startDragPreview(item, e)
}

const isTesting = ref(false)

/**
 * 处理测试事件
 * @param data 测试数据
 */
const handleTestLua = (code: string) => {
  if (!testDrawerRef.value) return
  isTesting.value = true
  const data = {
    code,
    configData: JSON.stringify({
      nodeList: workflowData.value.nodeList
    })
  } as ExecutionRecordData
  console.log('data', data)
  testDrawerRef.value.openDrawer(data)
}

const handleNodeClick = node => {
  console.log('节点被点击：', node)
  selectedNodeData.value = null
  showAttrPanel.value = false
  if (node && node.nodeId && editorRef.value) {
    editorRef.value.selectNodeOnly(node.nodeId)
  }
}
const closeTestDrawer = () => {
  isTesting.value = false
}

// 定位位置
const nodeId = ref<number | null>(null)

type UpstreamNodeItem = { node: WorkflowNode; isFromCondition: boolean }
type SourceOption = {
  label: string
  value: string
  currentLabel?: string
  currentPort?: string
  currentId?: string
  currentSource?: string
}

// 在方法体外部声明递归函数
const findUpstreamNodes = (
  targetNodeId: string,
  isFromCondition: boolean,
  flowData: Ref<WorkflowData>,
  visited: Set<string>
): UpstreamNodeItem[] => {
  if (visited.has(targetNodeId)) return []
  visited.add(targetNodeId)
  const nodeList = flowData.value.nodeList || []
  const edges = flowData.value.edges || []
  const node = nodeList.find(n => n.id === targetNodeId)
  if (!node) {
    console.error('findUpstreamNodes 未找到节点', targetNodeId)
    return []
  }
  if (node.funcType === 'logic' && node.logicData?.logicType === LogicType.IFELSE) {
    const upstreamEdges = edges.filter(edge => edge.target === targetNodeId)
    let result: UpstreamNodeItem[] = []
    for (const edge of upstreamEdges) {
      result = result.concat(findUpstreamNodes(edge.source, true, flowData, visited))
    }
    return result
  }
  return [{ node, isFromCondition }]
}

// 子孙组件使用 -------------------------------------------

// 获取输出参数指向的目标节点信息
const getOutputTargetInfo = (nodeData: WorkflowNode, outputParam: OutputData) => {
  if (!nodeData || !workflowData.value) return '未连接'
  const portId = outputParam.portId
  const nodeId = nodeData.id
  const edges = workflowData.value.edges || []
  const nodeList = workflowData.value.nodeList || []

  // 只精确匹配 source 和 sourcePort
  const edge = edges.find((e: any) => e.source === nodeId && e.sourcePort === portId)
  if (!edge) return '未连接'
  const targetNode = nodeList.find((n: any) => n.id === edge.target)
  if (!targetNode) return `节点${edge.target}`
  return targetNode.title || targetNode.id
}

// 获取可用的上游节点列表
const getAvailableSourceOptions = (param: any): SourceOption[] => {
  const node = selectedNodeData.value
  if (!node || !param) return []

  const edges = workflowData.value.edges.filter(e => e.target === node.id)
  const options: SourceOption[] = []
  edges.map(e => {
    const curEdgeSourceId = e.source
    const sourceNode = workflowData.value.nodeList.find(n => n.id === curEdgeSourceId)
    // console.log('sourceNode===', sourceNode)
    if (!sourceNode) {
      // 如果上游是迭代器的开始节点 则按迭代器的上游算
      // 默认找不到就直接返回
      return
    }
    // 如果source 或 target 任意一个是logic节点  则继续往前找
    if (
      (sourceNode.funcType === 'logic' && sourceNode.logicData?.logicType == LogicType.IFELSE) ||
      (node.funcType === 'logic' && node.logicData?.logicType == LogicType.IFELSE)
    ) {
      // 递归查找所有上游节点
      const visited = new Set<string>()
      const upstreamNodes = findUpstreamNodes(e.source, true, workflowData, visited)
      for (const { node: upNode, isFromCondition } of upstreamNodes) {
        options.push({
          label: isFromCondition
            ? `[条件]${upNode?.title || upNode.id}`
            : upNode?.title || upNode.id,
          value: upNode.id,
          currentLabel: e.targetPort === param.portId ? param.attributes?.label : '',
          currentPort: e.targetPort,
          currentId: node.id,
          currentSource: e.source
        })
      }
      return
    }
    // 强制校验 类型
    const outPort = sourceNode.outputData?.[0]
    if (outPort) {
      const sourceType = [param.type ?? '', param.subType ?? '']
      const targetType = [[outPort.type ?? '', outPort.subType ?? '']]
      if (ValidatorManager.validateTypeCompatibility(sourceType, targetType)) {
        options.push({
          label: sourceNode?.title || e.source,
          value: e.source,

          currentId: e.targetPort === param.portId ? e.id : '',
          currentLabel: e.targetPort === param.portId ? param.attributes?.label : '',
          currentPort: e.targetPort,
          currentSource: e.source
        })
        // paramName可能是为空值的
      }
    }
  })
  return options
}

const getAvailableTargetOptions = () => {
  return workflowData.value.nodeList.map(node => ({ label: node.title, value: node.id }))
}

const getAllAvailableOptions = (param: any): Array<{ label: string; value: string }> => {
  const node = selectedNodeData.value
  if (!node || !param) return []
  const nodeList = workflowData.value.nodeList
  const options: Array<{ label: string; value: string }> = []
  nodeList.forEach(node => {
    if (
      node.funcType === 'logic' &&
      (node.logicData?.logicType === LogicType.GLOBAL_VARIABLE ||
        node.logicData?.logicType === LogicType.GLOBAL_PARAM ||
        node.logicData?.logicType === LogicType.IFELSE)
    ) {
      return
    }
    options.push({ label: node.id + ':' + node.title, value: node.id })
  })
  return options
}

provide(getOutputTargetInfoKey, getOutputTargetInfo)
provide(getAvailableSourceOptionsKey, getAvailableSourceOptions)
provide(getAvailableTargetOptionsKey, getAvailableTargetOptions)
provide(getAllAvailableOptionsKey, getAllAvailableOptions)
</script>

<style scoped lang="scss">
@use "jsh-core/style/variables" as *;

.rule-edit-layout {
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
  min-height: 480px;
  align-items: center;
  justify-content: center;
  position: relative;
}

.fold {
  position: absolute;
  left: 44px;
  bottom: 42px;
  width: 30px;
  height: 30px;
  background: $lib-bg-muted;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 103;

  svg {
    scale: 70%;
  }
}

.center-panel {
  flex: 1 1 0;
  min-width: 0;
  height: 100%;
  align-self: center;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: auto;
  z-index: 1;
}

.canvas-center-wrap {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: $lib-bg-card;
  box-shadow: 0 4px 32px rgb(0 0 0 / 10%);
  position: relative;
}

.drawer-content {
  flex: 1;
  overflow-y: auto;
  padding: 0 20px;
  background: $lib-bg-card;
  opacity: 0;
  transform: translateX(20px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transition-delay: 0.1s;
}

.drawer-open .drawer-content {
  opacity: 1;
  transform: translateX(0);
}

.drawer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: $lib-bg-card;
  border-bottom: 1px solid $lib-border-color;
  flex-shrink: 0;
}

.drawer-title-container {
  display: flex;
  align-items: center;
  flex: 1;
  overflow: hidden;
}

.drawer-title {
  display: flex;
  align-items: center;
  font-size: 18px;
  font-weight: 500;
  color: $lib-text-primary;
  width: 100%;
}

.drawer-actions {
  display: flex;
  align-items: center;
  margin-left: 16px;
}

.node-id {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  border: 2px solid $lib-color-primary;
  color: $lib-color-primary;
  font-weight: 600;
  font-size: 14px;
  margin-right: 6px;
  flex-shrink: 0;
}

.node-title-container {
  position: relative;
  display: flex;
  align-items: center;
  flex: 1;
  cursor: pointer;
  padding: 0 8px;
  border-radius: $lib-radius-sm;
  transition: background-color 0.2s;
  max-width: calc(100% - 40px);

  &:hover {
    background-color: rgb(64 158 255 / 5%);
  }

  .node-title {
    font-size: 18px;
    font-weight: 500;
    color: $lib-text-primary;
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: inline-block;
  }

  .node-title-input {
    width: 100%;
    border: none;
    outline: none;
    font-size: 18px;
    font-weight: 500;
    color: $lib-text-primary;
  }
}

.snapline {
  border-color: $lib-color-primary;
  border-style: dashed;
}
</style>
