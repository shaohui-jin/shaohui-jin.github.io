<template>
  <div class="workflow-editor-outer" id="workflowEditorOuter">
    <div class="workflow-editor">
      <!-- 画布容器 -->
      <div ref="container" class="graph-container" tabindex="0" />

      <!-- 工作流验证错误面板 -->
      <WorkflowValidationModal
        :visible="showValidationModal"
        :errors="validationErrors"
        @close="closeValidationModal"
        @node-select="handleValidationNodeSelect"
      />

      <!-- 小地图容器 -->
      <div v-show="showMiniMap" class="minimap-container" ref="minimapContainer" />

      <div class="workflow-actions">
        <span>1 折叠/展开</span>
        <span>2 适应视图</span>
        <span>3 一键排列</span>
        <span>4 视图浏览</span>
        <span>ctrl + c 复制</span>
        <span>ctrl + v 粘贴</span>
        <span>ctrl + z 撤销</span>
        <span>ctrl + y 重做</span>
        <span>delete 删除</span>
        <span>ctrl + delete 清空</span>
        <span>g 分组</span>
        <span>ctrl + g 取消分组</span>
        <span>i 导入</span>
        <span>o 导出</span>
        <span>t 测试</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  reactive,
  onMounted,
  onUnmounted,
  watch,
  defineExpose,
  withDefaults,
  h,
  markRaw,
  nextTick,
  computed,
  Ref
} from 'vue'
import { Graph, Shape, Dnd } from '@antv/x6'
import {
  InputData,
  LogicType,
  OutputData,
  type WorkflowData,
  WorkflowEdge,
  WorkflowNode
} from '@/types/workflow'
import { CustomNodeManager, getCustomNodeConfig } from '@/utils/manager/CustomNodeManager'
import { ElMessage, ElMessageBox } from 'element-plus'
import WorkflowValidationModal from '@/components/panels/WorkflowValidationModal.vue'
import { JsCodeParser } from '@/utils/parser/JsCodeParser'
import { FunctionNode } from '@/types/ruleApi'

import { ValidatorManager, type ValidationError } from '@/utils/manager/ValidatorManager'
import { EdgeCorrectionManager } from '@/utils/manager/EdgeCorrectionManager'
import { InfoPanelNode, InfoPanelNodeManager } from '@/utils/manager/InfoPanelNodeManager'
import { GroupNodeManager } from '@/utils/manager/GroupNodeManager'

import { createNewNode, createX6Node } from '@/utils/factory/NodeFactory'
import nodeIdFactory from '@/utils/factory/NodeIdFactory'

import { KEYBOARD, KeyboardKey, registerKeyboardPlugins } from '@/utils/plugins/KeyboardPlugin'
import { registerX6Plugins } from '@/utils/plugins/X6Plugin'

import { BaseFunctionNodeType } from '@/data/builtinNodes'

import { MAX_DEVICE_PIXEL_RATIO, MIN_DEVICE_PIXEL_RATIO } from '@/config/workflow'
import { isCustom } from '@/utils/common/NodeType'

/**
 * 组件属性定义
 * @property {WorkflowData} data - 工作流数据
 * @property {any[]} functionNodes - 函数节点列表
 */
const props = withDefaults(
  defineProps<{
    data: WorkflowData
    functionNodes?: Map<string, FunctionNode>
    nodeId?: number | null
  }>(),
  {
    functionNodes: () => new Map(),
    nodeId: null
  }
)

const emit = defineEmits([
  'update:data',
  'show-attr-panel',
  'update:workflow',
  'save-as-data',
  'test-lua',
  'close-search-modal'
])

/**
 * 组件状态变量
 */
const container = ref<HTMLElement>()
const minimapContainer = ref<HTMLElement>()
const jsCodeParser = new JsCodeParser()
let graph: any
const canUndo = ref(false)
const canRedo = ref(false)
const selectedNodeData = ref<any>(null)
const workflowData = ref(props.data)

const showMiniMap = ref(false)

// 信息展示面板相关状态
const infoPanelNode = ref<any>(null) // 信息面板节点引用
// 拖拽相关状态
let dnd: any = null
// 错误边管理器
let edgeCorrectionManager: EdgeCorrectionManager
// 分组管理器
let groupManager: GroupNodeManager

// 折叠状态
const collapse = ref(false)

let resizeHandler: (() => void) | null = null

// 组件挂载时初始化
onMounted(() => {
  initGraph()
  resizeHandler = () => {
    console.log('resizeHandler')
    if (container.value && graph) {
      const width = container.value.offsetWidth
      const height = container.value.offsetHeight
      graph.resize(width, height)
    }
  }
  window.addEventListener('resize', resizeHandler)
  resizeHandler()
})

// 组件卸载时清理
onUnmounted(() => {
  graph?.dispose()
  dnd?.dispose()
  if (resizeHandler) window.removeEventListener('resize', resizeHandler)
})

// /**
//  * 监听工作流数据变化
//  * 当props.data更新时同步到本地状态
//  */
// watch(
//   () => props.data,
//   val => {
//     workflowData.value = val
//     initNodesAndEdges(graph, val)
//     // graph.centerContent()
//   }
// )
// // 监听点击的节点
// watch(
//   () => props.nodeId,
//   val => {
//     if (val) {
//       selectNodeOnly(val + '')
//     }
//     // graph.centerContent()
//   }
// )

// 初始化X6画布
const initGraph = () => {
  const customNodeManager = new CustomNodeManager()
  customNodeManager.initRegister()

  const infoPanelNodeManager = new InfoPanelNodeManager()
  infoPanelNodeManager.initRegister()

  if (!container.value) return

  graph = new Graph({
    container: container.value,
    background: { color: '#F2F7FA' },
    panning: true, // 允许“拖拽空白区域平移画布”（手抓移动视图）。
    grid: false, // 是否显示网格背景。false 表示不显示网格（也通常不启用吸附到网格）
    autoResize: true, // 容器尺寸变化时自动调整画布尺寸（等价于监听容器 resize 并调用 graph.resize，你代码里也额外手动做了 resize，更稳）。
    scaling: { min: MIN_DEVICE_PIXEL_RATIO, max: MAX_DEVICE_PIXEL_RATIO }, // 缩放限制，限制用户缩放视图的最小/最大倍率（防止缩太小/太大）。
    connecting: {
      snap: true, // 是否启用连线时吸附（例如吸附到端口/连接点），更容易连上。
      allowBlank: false, // 是否允许在空白区域创建连接。false 表示不允许（一般不建议禁用，除非有特殊需求）。
      allowLoop: false, // 是否允许自环（连接起点和终点是同一个节点）。false 表示不允许（一般不建议禁用，除非有特殊需求）。
      highlight: true, // 是否高亮显示连接线。true 表示高亮显示（通常用于提示用户当前连接线是有效的）。
      router: {
        name: 'manhattan', // 路由算法，可选值：'manhattan'（曼哈顿路由）、'vertical'（垂直路由）、'horizontal'（水平路由）、'orthogonal'（直角路由）、'radical'（放射路由）、'cubic'（立方路由）、'based'（基于距离的路由）。
        args: {
          padding: 30 // 路由算法的参数，可选值：padding: 30（路由时与节点/连接点的间距）。
        }
      },
      connector: {
        name: 'rounded', // 连接器类型，可选值：'rounded'（圆角连接器）、'bezier'（贝塞尔连接器）、'straight'（直线连接器）、'arc'（弧形连接器）、'smooth'（平滑连接器）、'orthogonal'（直角连接器）、'based'（基于距离的路由连接器）。
        args: { radius: 30 } // 连接器类型的参数，可选值：radius: 30（圆角连接器的半径）。
      },
      // attrs: {
      //   line: {
      //     stroke: '#faad14',
      //     targetMarker: 'classic'
      //   }
      // },
      connectionPoint: 'boundary', // 连接点类型，可选值：'boundary'（边界连接点）、'vertex'（顶点连接点）、'center'（中心连接点）、'label'（标签连接点）、'source'（源连接点）、'target'（目标连接点）。
      createEdge: () => new Shape.Edge(),
      allowMulti: true, // 是否允许多连接（例如一个节点有多个输出端口，可以连接到多个节点）。true 表示允许多连接（通常用于允许一个节点有多个输出端口）。
      validateConnection(args) {
        if (edgeCorrectionManager) {
          edgeCorrectionManager.edgePreviewColor(args)
        }
        const sourceMagnet = args.sourceMagnet as Element | null | undefined
        const targetMagnet = args.targetMagnet as Element | null | undefined
        if (sourceMagnet && sourceMagnet.getAttribute('port-group') === 'in') {
          return false
        }
        if (targetMagnet && targetMagnet.getAttribute('port-group') === 'out') {
          return false
        }
        const sourcePortId = sourceMagnet?.getAttribute('port')
        const targetPortId = targetMagnet?.getAttribute('port')
        const sourceNodeId = args.sourceCell?.id
        const targetNodeId = args.targetCell?.id
        if (!sourcePortId || !targetPortId || !sourceNodeId || !targetNodeId) {
          return false
        }
        // 组合节点 不允许连接
        const sourceNode = graph.getCellById(sourceNodeId)
        const targetNode = graph.getCellById(targetNodeId)
        if (sourceNode.shape === 'groupNode' || targetNode.shape === 'groupNode') {
          return false
        }
        return true
      }
    },
    interacting: {
      nodeMovable: true, // 是否允许移动节点。true 表示允许移动节点（通常用于允许用户拖拽节点）。
      edgeMovable: true, // 是否允许移动边。true 表示允许移动边（通常用于允许用户拖拽边）。
      vertexMovable: true, // 是否允许移动顶点。true 表示允许移动顶点（通常用于允许用户拖拽顶点）。
      vertexAddable: true, // 是否允许添加顶点。true 表示允许添加顶点（通常用于允许用户添加顶点）。
      vertexDeletable: true, // 是否允许删除顶点。true 表示允许删除顶点（通常用于允许用户删除顶点）。
      arrowheadMovable: true // 是否允许移动箭头。true 表示允许移动箭头（通常用于允许用户拖拽箭头）。
    },
    embedding: {
      enabled: true, // 是否启用节点嵌入。true 表示启用节点嵌入（通常用于允许用户将节点嵌入到其他节点中）。
      findParent({ node }) {
        // 查找父节点，用于节点嵌入。
        const bbox = node.getBBox()
        return this.getNodes().filter(n => {
          // 只有分组节点和可以作为父节点
          if (n.shape !== 'groupNode' || n === node) {
            return false
          }

          const targetBBox = n.getBBox()
          return targetBBox.containsRect(bbox)
        })
      }
    },
    highlighting: {
      embedding: {
        // 高亮显示节点嵌入。
        name: 'stroke', // 高亮显示类型，可选值：'stroke'（描边高亮）、'fill'（填充高亮）、'both'（描边和填充高亮）。
        args: {
          padding: -1, // 高亮显示的间距，可选值：-1（不显示间距）。
          attrs: {
            stroke: 'var(--el-color-success, #73d13d)' // 跟随 Element/Tailwind 主题色系
          }
        }
      }
    },
    // 桩点渲染的回调
    onPortRendered(args) {}
  })

  // 初始化左侧拖拽插件
  dnd = new Dnd({
    target: graph,
    getDragNode: node => node.clone({ keepId: true }),
    getDropNode: node => node.clone({ keepId: true })
  })
  // 初始化错误边管理器
  edgeCorrectionManager = new EdgeCorrectionManager(graph, workflowData, directContectNode)

  initNodesAndEdges(graph, workflowData.value)

  // 初始化分组管理器
  groupManager = new GroupNodeManager(graph, workflowData)

  // 注册插件
  registerX6Plugins(graph, container.value, minimapContainer.value)

  // 注册键盘插件
  registerKeyboardPlugins({
    graphData: {
      graph,
      groupManager
    },
    workflowData: {
      workflowData,
      selectedNodeData,
      showMiniMap
    },
    workflowFn: {
      handleTest
    },
    emit: emit as (event: string, ...args: unknown[]) => void
  })

  // 注册画布事件(预览模式下的基础功能)
  registerGraphBaseEvents()

  // 注册完整功能
  registerGraphFullEvents()

  setTimeout(() => {
    graph.triggerKey(KeyboardKey[KEYBOARD.FIT])
  }, 100)
}

// 初始化节点和边
function initNodesAndEdges(graph: any, data: WorkflowData) {
  // 1. 解析生成节点
  graph.startBatch('init-nodes-and-edges')
  data.nodeList.forEach((node: any, _idx: number) => {
    const rectNode = createX6Node(node)
    graph.addNode(rectNode)
  })
  // 2. 需要先生成所有节点  再生成迭代器 确保子集节点可用

  // 3. 解析生成边
  data.edges.forEach((edge: any, _idx: number) => {
    const targetPort = edge.targetPort || 'in_1'
    const sourcePort = edge.sourcePort || 'out_1'

    if (edge.source.length > 10 || edge.target.length > 10) {
      return
    }

    const x6Edge = graph.addEdge({
      id: edge.id,
      source: { cell: edge.source, port: sourcePort },
      target: { cell: edge.target, port: targetPort }
    })

    // 添加这一行来根据距离更新连接线样式
    updateEdgeConnectorBasedOnDistance(x6Edge)

    // 验证边的类型兼容性并设置颜色
    validateEdgeTypeAndSetColor(x6Edge, true)
  })
  // 4. 解析组合节点
  if (data.groupList.length > 0 && groupManager) {
    groupManager.decodeGroupData()
  }
  graph.stopBatch('init-nodes-and-edges')
}

let removeNodeListener: (() => void) | null = null

// 注册画布事件
function registerGraphBaseEvents() {
  // 监听历史记录变化
  graph.on('history:change', () => {
    canUndo.value = graph.canUndo()
    canRedo.value = graph.canRedo()
  })

  // 撤销恢复的 数据同步处理
  // 节点和边的更新 在 节点和边的 changed add remove 中 已经同步了
  // 这里只需要同步节点和边的标题 (todo: remark)
  graph.on('history:undo', ({ cmds }: { cmds: any[] }) => {
    cmds.forEach(cmd => {
      // 检查是否是节点名称(label/text)的变更
      if (cmd.options?.propertyPath === 'attrs/title/html') {
        const node = workflowData.value.nodeList.find(n => n.id === cmd.data.id)
        // 从 cmd.prev 中获取旧值
        const oldTitle = cmd.data?.prev?.attrs?.title?.text
        if (node && oldTitle) {
          node.title = oldTitle
        }
      } else if (cmd.event === 'cell:change:ports') {
        const portList = cmd.data?.prev?.ports?.items
        if (portList) {
          handlePortChange(cmd.data.id, portList)
        }
      } else if (cmd.event === 'cell:change:visible') {
        if (!cmd.data?.prev?.visible && cmd.data?.next?.visible == false) {
          const cell = graph.getCellById(cmd.data.id)
          if (cell) {
            cell.hide({ ignoreHistory: true })
            cell.show({ ignoreHistory: true })
          }
        }
      }
    })
  })

  graph.on('history:redo', ({ cmds }: { cmds: any[] }) => {
    cmds.forEach(cmd => {
      // 检查是否是节点名称(label/text)的变更
      if (cmd.options?.propertyPath === 'attrs/title/html') {
        const node = workflowData.value.nodeList.find(n => n.id === cmd.data.id)
        // 从 cmd.next 中获取新值
        const newTitle = cmd.data?.next?.attrs?.title?.text
        if (node && newTitle) {
          node.title = newTitle
        }
      } else if (cmd.event === 'cell:change:ports') {
        const portList = cmd.data?.next?.ports?.items
        if (portList) {
          handlePortChange(cmd.data.id, portList)
        }
      }
    })
  })

  // 画布空白点击事件
  graph.on('blank:click', () => {
    onNodeSelected(null)
    closeInfoPanel()
    emit('close-search-modal')
  })

  // 监听节点选中事件
  graph.on('node:click', ({ node }) => {
    const nodeId = node.id
    const found = workflowData.value.nodeList.find(n => n.id === nodeId)
    // console.log('20250817节点选中', nodeId, found)
    if (found) {
      onNodeSelected(found)
    }
    closeInfoPanel()
  })

  // 普通节点鼠标悬停事件
  graph.on('node:mouseenter', ({ node, view }) => {
    // 查询节点的连线情况以及输出桩点情况, 如果出桩多个，或者连线多个都不显示新增
    const outPortCount = node.getPorts().filter(e => e.id.includes('out')).length
    const outPortEdgeCount = graph.getEdges().filter(e => e.source.cell === node.id).length

    if (isCustom(node)) {
      if (node.attr('border/strokeOpacity') !== 1) {
        node.attr('border/strokeOpacity', 1, { ignoreHistory: true })
      }

      if (node.attr('copyButton/width') !== 28) {
        node.attr('copyButton/width', 28, { ignoreHistory: true })
        node.attr('delButton/width', 28, { ignoreHistory: true })
      }
    }

    // 注册 节点图标的鼠标悬停事件
    removeNodeListener = handlerEventListener(node, view)
  })

  // 普通节点鼠标离开事件
  graph.on('node:mouseleave', ({ node, view }) => {
    if (isCustom(node)) {
      if (node.attr('border/strokeOpacity') !== 0) {
        node.attr('border/strokeOpacity', 0, { ignoreHistory: true })
      }
      if (node.attr('copyButton/width') !== 1) {
        // window.setTimeout(() => {
        node.attr('copyButton/width', 1, { ignoreHistory: true })
        node.attr('delButton/width', 1, { ignoreHistory: true })
        // }, 1000) // 延时隐藏按钮
      }
    }

    setTimeout(() => {
      removeNodeListener?.()
    }, 10)

    closeInfoPanel()
  })

  graph.on('node:customer_collapse', ({ node, e }: { node: any; e: Event }) => {
    e.stopPropagation()
    e.preventDefault()
    // console.log('node', node)
    node.toggleCollapse(workflowData.value)
    nextTick(() => {
      refreshConnectedEdges(node)
    })
  })

  // 监听节点变化
  graph.on('node:change:ports', ({ node }: { node: any }) => {
    if (isCustom(node)) {
      // console.log('我是监听桩点变化')
      // 如果节点是矩形节点 则添加到节点列表中
      if (!workflowData.value.nodeList.find((n: any) => n.id === node.data.id)) {
        node.data.pos = { x: node.getPosition().x, y: node.getPosition().y }
        workflowData.value.nodeList.push(node.data)
      }
      refreshConnectedEdges(node)
    }
  })

  graph.on('node:added', ({ node }: { node: any }) => {
    if (isCustom(node)) {
      // 如果节点是矩形节点 则添加到节点列表中
      if (!workflowData.value.nodeList.find((n: any) => n.id === node.data.id)) {
        node.data.pos = { x: node.getPosition().x, y: node.getPosition().y }
        workflowData.value.nodeList.push(node.data)
      }
    }
  })

  graph.on('node:change:position', ({ node }: { node: any }) => {
    // console.log('节点改变', node.id)
    if (isCustom(node)) {
      const nodeId = node.id
      const position = node.position()
      const nodeData = workflowData.value.nodeList.find(n => n.id === nodeId)
      if (nodeData) {
        nodeData.pos = { x: position.x, y: position.y }
      }

      // 更新与该节点相连的所有边的样式
      const connectedEdges = graph.getConnectedEdges(node)
      connectedEdges.forEach((edge: any) => {
        updateEdgeConnectorBasedOnDistance(edge)
      })
    }
  })

  graph.on('node:change:size', ({ node }: { node: any }) => {
    if (isCustom(node)) {
      refreshConnectedEdges(node)
    }
  })

  graph.on('node:removed', ({ node }: { node: any }) => {
    if (isCustom(node)) {
      const nodeId = node.id
      const nodeData = workflowData.value.nodeList.find(n => n.id === nodeId)
      if (nodeData) {
        workflowData.value.nodeList.splice(workflowData.value.nodeList.indexOf(nodeData), 1)
      }
    }
    // 不是气泡框的节点被删除时，取消选中
    if (node.shape !== 'infoPanelNode') {
      onNodeSelected(null)
    }
  })

  graph.on('edge:added', ({ edge }: { edge: any }) => {
    // 虚拟边 不处理
    if (edge.id.startsWith('virtual_')) return

    const newEdge = {
      id: edge.id,
      type: 'data_flow',
      source: edge.getSourceCellId(),
      target: edge.getTargetCellId(),
      sourcePort: edge.getSourcePortId(),
      targetPort: edge.getTargetPortId()
    }
    if (!workflowData.value.edges.find(e => e.id === newEdge.id)) {
      workflowData.value.edges.push(newEdge)
    }

    // 如果连出边了 则清理源节点的 plus 显示
    const sourceNode = graph.getCellById(edge.getSourceCellId())
    if (sourceNode && isCustom(sourceNode)) {
      sourceNode.clearPortCount()
    }

    // 添加这一行来根据距离更新连接线样式
    updateEdgeConnectorBasedOnDistance(edge)

    validateEdgeTypeAndSetColor(edge)
    refreshPanel()
  })

  graph.on('edge:removed', ({ edge }: { edge: any }) => {
    // 虚拟边 不处理
    if (edge.id.startsWith('virtual_')) return

    const sourceNodeId = edge.getSourceCellId()
    const sourcePortId = edge.getSourcePortId()
    const targetNodeId = edge.getTargetCellId()
    const idx = workflowData.value.edges.findIndex(e => e.id === edge.id)
    if (idx !== -1) {
      workflowData.value.edges.splice(idx, 1)
      console.log(`=====================同步删除edge数据 ${edge.id}`)
    }
    // 同步清理节点的数据
    let node = workflowData.value.nodeList.find(n => n.id === sourceNodeId)
    if (node) {
      const outputData = node.outputData.find(p => p.portId === sourcePortId)
      if (outputData && outputData?.value) {
        outputData.value = ''
      }
    }
    node = workflowData.value.nodeList.find(n => n.id === targetNodeId)
    if (node) {
      // 获取上游节点ID列表（包括条件节点的上游非条件节点）
      const upstreamNodeIds = findUpstreamNonConditionNodes(sourceNodeId, workflowData)

      // 清理 source是当前节点或其上游非条件节点的数据
      if (node.id == delPortNodeId) {
        node.inputData.forEach((inp: any) => {
          if (inp.source === sourceNodeId || upstreamNodeIds.includes(inp.source)) {
            inp.source = ''
          }
        })
      }
      // 如果下游节点是条件节点 则清理条件节点的后续节点
      if (node?.logicData?.logicType === LogicType.IFELSE) {
        workflowData.value.edges
          .filter(e => e.source === targetNodeId)
          ?.forEach(edge => {
            const tempNode = workflowData.value.nodeList.find(n => n.id === edge.target)
            if (tempNode) {
              tempNode.inputData.forEach((inp: any) => {
                if (inp.source === sourceNodeId || upstreamNodeIds.includes(inp.source)) {
                  inp.source = ''
                }
              })
            }
          })
      }
    }

    // 清理边相关状态
    edgeCorrectionManager.cleanupEdge(edge)
    refreshPanel()
  })

  graph.on('edge:mouseenter', ({ edge }: { edge: any }) => {
    // 虚拟边 不处理
    if (edge.id.startsWith('virtual_')) return

    edge.attr('line/strokeWidth', 3)
    // 添加箭头

    edge.addTools([
      {
        name: 'target-arrowhead',
        args: {
          attrs: {
            fill: edge.hasCorrectionText
              ? 'var(--el-color-danger, #ff6b6b)'
              : 'var(--el-color-primary, #1890ff)'
          }
        }
      },
      {
        name: 'button-remove',
        args: {
          distance: 0.5,
          size: 10
        }
      }
    ])
  })

  graph.on('edge:mouseleave', ({ edge }: { edge: any }) => {
    // 虚拟边 不处理
    if (edge.id.startsWith('virtual_')) return

    edge.attr('line/strokeWidth', 2)
    // 移除箭头
    edge.removeTools()
  })

  // 连接桩鼠标悬停事件
  graph.on('node:port:mouseenter', ({ node, port }: { node: any; port: any }) => {})

  // 连接桩鼠标离开事件
  graph.on('node:port:mouseleave', ({ node, port }: { node: any; port: any }) => {
    // console.log('连接桩鼠标离开事件  mouseleave', node, port)
    // if (node && node.shape === 'customNode' && port && port.indexOf('out') != -1) {
    //   node.showHidePortPlus(port)
    // }
  })

  // 连接桩点击事件
  graph.on(
    'node:port:click',
    ({ node, port, x, y }: { node: any; port: any; x: number; y: number }) => {}
  )
}

function registerGraphFullEvents() {
  // 监听空白区域双击事件
  graph.on('blank:dblclick', ({ e, x, y }) => {})

  graph.on('edge:connected', ({ edge }: { edge: any }) => {
    const edgeId = edge.id
    const newSource = edge.getSourceCellId()
    const newSourcePort = edge.getSourcePortId()
    const newTarget = edge.getTargetCellId()
    const newTargetPort = edge.getTargetPortId()
    const wfEdge = workflowData.value.edges.find((e: any) => e.id === edgeId)
    const oldTarget = wfEdge?.target
    const oldTargetNode = workflowData.value.nodeList.find((n: any) => n.id === oldTarget)
    const newTargetNode = workflowData.value.nodeList.find((n: any) => n.id === newTarget)
    // console.log('oldTargetNode', oldTargetNode, newTargetNode)
    // 获取上游节点ID列表（包括条件节点的上游非条件节点）
    const upstreamNodeIds = findUpstreamNonConditionNodes(newSource, workflowData)

    if (oldTargetNode && oldTargetNode.inputData) {
      oldTargetNode.inputData.forEach((inp: any) => {
        if (inp.source === newSource || upstreamNodeIds.includes(inp.source)) {
          inp.source = ''
        }
      })
    }

    if (newTargetNode && newTargetNode.inputData) {
      // 获取节点配置，确定连接的端口类型
      let targetParams: InputData[] = []
      targetParams = newTargetNode.inputData.filter((inp: any) => inp.sourceType === 'node')
      const index = Number(newTargetPort.split('_')[1])

      if (targetParams.length >= index) {
        targetParams[index - 1].source = upstreamNodeIds.length > 0 ? upstreamNodeIds[0] : newSource
      }
    }

    if (wfEdge) {
      wfEdge.source = newSource
      wfEdge.target = newTarget
      wfEdge.sourcePort = newSourcePort
      wfEdge.targetPort = newTargetPort
    }

    // 添加这一行来根据距离更新连接线样式
    updateEdgeConnectorBasedOnDistance(edge)

    // // 连接后进行类型验证并设置颜色
    validateEdgeTypeAndSetColor(edge)
    onNodeSelected(null)
  })
}

/**
 * 刷新属性面板
 */
function refreshPanel(nodeIds: string[] = []) {
  let nodeId = ''
  const selectNodeId = selectedNodeData.value?.id || ''
  if (nodeIds.length == 0 && selectNodeId) {
    nodeId = selectNodeId
  } else if (nodeIds.length == 1) {
    nodeId = nodeIds[0]
  } else {
    return
  }

  if (nodeId) {
    const found = workflowData.value.nodeList.find(n => n.id === nodeId)
    if (found) {
      clearSelection()
      graph.select(nodeId)
      selectedNodeData.value = found
    }
  }
}

// 撤销恢复的时候 同步处理 port的数据
// 这是一个比较蛋疼的处理方式 port的节点数据无法和node的节点数据同步
// 需要通过 portMap 来同步数据
// port的变更 影响颇大 需要谨慎处理
function handlePortChange(nodeId: string, portList: any) {
  const node = workflowData.value.nodeList.find(n => n.id === nodeId)
  // console.log('node===', node)
  if (node) {
    // 目前只有 if-else 会动态增减 outputData  后续如果要处理inputData 缓存里的数据也是有的
    const outportList = portList.filter((p: any) => p.group === 'out')
    const nodeDataOutput = node.outputData
    const portIdList = outportList.map((p: any) => p.id)
    const nodeDataIdList = nodeDataOutput.map((p: any) => p.portId)
    // 删除 portIdList 中 不在 nodeDataOutput 中的 port
    nodeDataOutput.forEach((p: any) => {
      if (!portIdList.includes(p.portId)) {
        node.outputData.splice(node.outputData.indexOf(p), 1)
      }
    })
    // 添加 portIdList 中 不在 nodeDataOutput 中的 port 且按照 portList 的顺序添加
    for (let i = 0; i < outportList.length; i++) {
      const port = outportList[i]
      if (!nodeDataIdList.includes(port.id)) {
        const portData = portMap.get(port.uniqueId)
        if (portData) {
          node.outputData.splice(i, 0, portData)
        }
      }
    }
    // 这个是撤销入桩点的处理
    const inportList = portList.filter((p: any) => p.group === 'in')
    const portInIdList = inportList.map((p: any) => p.id)
    // console.log('inportList==', portList, node.inputData, portInIdList)
    node.inputData.forEach(item => {
      if (portInIdList.includes(item.portId)) {
        item.sourceType = 'node'
      } else {
        item.sourceType = 'input'
      }
    })
    // 重新更新节点高度
    onNodeDataUpdate(node)
  }
}

// 在文件中添加以下函数，用于根据节点距离设置连接线样式
function updateEdgeConnectorBasedOnDistance(edge: any) {
  const sourceCell = edge.getSourceCell()
  const targetCell = edge.getTargetCell()

  if (sourceCell && targetCell) {
    // 获取源节点和目标节点的位置及尺寸
    const sourceBBox = sourceCell.getBBox()
    const targetBBox = targetCell.getBBox()
    // 计算两个节点中心点之间的距离
    const sourceCenterX = sourceBBox.center.x
    const sourceCenterY = sourceBBox.center.y
    const targetCenterX = targetBBox.center.x
    const targetCenterY = targetBBox.center.y

    const distance = Math.sqrt(
      Math.pow(targetCenterX - sourceCenterX, 2) + Math.pow(targetCenterY - sourceCenterY, 2)
    )

    const sourceHeight = sourceCell.size().height
    const targetHeight = targetCell.size().height
    // 如果距离小于阈值（例如150像素），使用直线连接；否则使用曲线连接
    // 当前是水平有重叠
    if (targetCenterX - sourceCenterX < 400) {
      // 同时垂直有重叠
      if (Math.abs(targetCenterY - sourceCenterY) < targetHeight / 2 + sourceHeight / 2) {
        // console.log('垂直重叠距离小于300，使用直线连接')
        edge.setRouter('normal')
        edge.setConnector('normal')
      } else {
        edge.setRouter('manhattan')
        edge.setConnector('rounded', { radius: 30 })
      }
    } else {
      edge.setRouter('manhattan')
      edge.setConnector('rounded', { radius: 30 })
    }
  }
}

/** 折叠/改尺寸/改连接桩后刷新与该节点相连的边（位置事件里已有逻辑，尺寸与桩变化需单独处理） */
function refreshConnectedEdges(node: any) {
  if (!graph) return
  const apply = () => {
    graph.getConnectedEdges(node).forEach((edge: any) => {
      updateEdgeConnectorBasedOnDistance(edge)
    })
  }
  apply()
  requestAnimationFrame(apply)
}

// 验证边的类型兼容性并设置颜色, 初始化是 isDecode 为 true 不增加数据转换节点
function validateEdgeTypeAndSetColor(edge: any, isDecode: boolean = false) {
  if (edgeCorrectionManager) {
    edgeCorrectionManager.validateEdgeTypeAndSetColor(edge, isDecode)
  }
}

/**
 * 获取函数ID列表
 * @param workflowData 工作流数据
 * @returns 函数ID列表
 */
function getFuncIdList(workflowData: WorkflowData) {
  const funcIdList = workflowData.nodeList
    .filter((n: any) => n.funcType === 'func')
    .map((n: any) => n.funcId)
  // 去重
  return [...new Set(funcIdList)]
}

/**
 * 获取函数节点
 * @param functionNodes 函数节点列表
 * @param allFuncId 函数ID列表
 * @returns 函数节点列表
 */
function getFunctionNodes(functionNodes: Map<string, FunctionNode>, allFuncId: string[]) {
  const funcNodes: FunctionNode[] = []
  allFuncId.forEach(id => {
    const funcNode = functionNodes.get(id)
    if (funcNode) {
      funcNodes.push(funcNode)
    }
  })
  return funcNodes
}

function checkValidate() {
  // 检查是否有未修复的边
  if (edgeCorrectionManager) {
    const unfixedEdges = edgeCorrectionManager.checkUnfixedEdges()
    if (unfixedEdges.length > 0) {
      ElMessage.error({
        message: h('div', h('div', '存在未修复的边，请先修复后再保存')),
        duration: 3000
      })
      return false
    }
  }

  return true
}

async function getFlowData() {
  const workFlowJson = workflowData.value
  const allFuncId = getFuncIdList(workFlowJson)
  const functionNodes = getFunctionNodes(props.functionNodes, allFuncId)
  if (functionNodes.length === 0) {
    console.log('函数配置数据未加载')
  }

  // 生成lua代码
  const jsCode = jsCodeParser.generate(workflowData.value, functionNodes)
  console.log('jsCode', jsCode)
  return { jsCode, allFuncId }
}

const handleTest = async () => {
  // 验证节点数据完整性
  if (!checkValidate()) return
  // 验证工作流是否合法
  const validRst = validateWorkflow()
  if (!validRst) return
  // 获取工作流数据
  const flowData = await getFlowData()
  if (!flowData) return
  emit('test-lua', flowData.jsCode)
}

/**
 * 开始拖拽预览
 * @param type 节点类型
 * @param item 节点数据
 * @param e 鼠标事件
 */
const startDragPreview = async (item: BaseFunctionNodeType, e: MouseEvent) => {
  if (!graph || !dnd) return
  let nodeData = {
    ...JSON.parse(JSON.stringify(item.template)),
    id: nodeIdFactory.next()
  } as WorkflowNode
  // if (type === 'logic') {
  //   nodeData = createLogicNode(item.type, item.funcId)
  // } else {
  //   nodeData = createFuncNode(item)
  // }
  const rectNode = createX6Node(nodeData, true)
  dnd.start(rectNode, e)
}

/**
 * 同步节点端口和尺寸
 * 这里只处理新增out的情况，动态添加out port 重绘节点
 * @param node 节点对象
 * @param config 节点配置
 */
function syncNodePortsAndSize(node: any, config: any, type?: string) {
  graph.startBatch()
  node.setSize(config.width, config.height)
  // 记录现有的edges 这个部分数据 会在下面强制删除 port的时候  清空
  // console.log('config====', config)
  // console.log('cacheEdges====', node, JSON.parse(JSON.stringify(workflowData.value)))
  const cacheEdges: WorkflowEdge[] =
    type === 'in'
      ? workflowData.value.edges.filter((e: WorkflowEdge) => e.target === node.id)
      : workflowData.value.edges.filter((e: WorkflowEdge) => e.source === node.id)
  // 删除画布的边
  cacheEdges.forEach((edge: any) => {
    graph.removeEdge(edge.id)
  })
  // 筛选出所有的 out_N
  if (type === 'in') {
    // const cacheEdges = workflowData.value.edges.filter((e: any) => e.target === node.id)
    const existOutIds = node
      .getPorts()
      .filter((p: any) => p.group === 'in')
      .map((p: any) => p.id)
    // 删除现有的out port
    // console.log('existOutIds ======', existOutIds, node)
    existOutIds.forEach((id: string) => node.removePort(id))
    // 添加新的out port
    const newOutIds: string[] = []
    const tempIdMap = new Map<string, any>()
    config.ports.items
      .filter((p: any) => p.group === 'in')
      .forEach((p: any) => {
        // console.log('p=======', p)
        node.addPort(p)
        newOutIds.push(p.id)
        tempIdMap.set(p.id, p.uniqueId)
      })
    const nodeData = workflowData.value.nodeList.find(n => n.id === node.id)
    if (nodeData) {
      // 记录历史上边的数据
      // console.log('nodeData===记录历史边', nodeData, tempIdMap)
      nodeData.inputData.forEach((p: any) => {
        // console.log('map======', p.portId)
        const uniqueId = tempIdMap.get(p.portId)
        // console.log('uniqueId===', uniqueId)
        if (uniqueId && !portMap.has(uniqueId)) {
          portMap.set(uniqueId, p)
        }
      })
      // console.log('portMap====记录历史边', portMap)
    }
    // 重新绘制边 需要延帧确保节点更新完成
    setTimeout(() => {
      // console.log('cacheEdges====', cacheEdges)
      cacheEdges.forEach((edge: any) => {
        //只添加 port还存在的边
        // console.log(edge, 'edge.sourcePort', newOutIds, '===', !graph.getCellById(edge.id), newOutIds.includes(edge.sourcePort))
        if (!graph.getCellById(edge.id) && newOutIds.includes(edge.targetPort)) {
          graph.addEdge({
            id: edge.id,
            source: { cell: edge.source, port: edge.sourcePort },
            target: { cell: edge.target, port: edge.targetPort }
          })
        }
      })
      graph.stopBatch()
    }, 50)
  } else {
    const existOutIds = node
      .getPorts()
      .filter((p: any) => p.group === 'out')
      .map((p: any) => p.id)
    // 删除现有的out port
    existOutIds.forEach((id: string) => node.removePort(id))
    // 添加新的out port
    const newOutIds: string[] = []
    const tempIdMap = new Map<string, any>()
    config.ports.items
      .filter((p: any) => p.group === 'out')
      .forEach((p: any) => {
        node.addPort(p)
        newOutIds.push(p.id)
        tempIdMap.set(p.id, p.uniqueId)
      })
    const nodeData = workflowData.value.nodeList.find(n => n.id === node.id)
    if (nodeData) {
      // 记录历史上边的数据
      nodeData.outputData.forEach((p: any) => {
        const uniqueId = tempIdMap.get(p.portId)
        if (uniqueId && !portMap.has(uniqueId)) {
          portMap.set(uniqueId, p)
        }
      })
    }
    // 重新绘制边 需要延帧确保节点更新完成
    setTimeout(() => {
      cacheEdges.forEach((edge: any) => {
        //只添加 port还存在的边
        if (!graph.getCellById(edge.id) && newOutIds.includes(edge.sourcePort)) {
          graph.addEdge({
            id: edge.id,
            source: { cell: edge.source, port: edge.sourcePort },
            target: { cell: edge.target, port: edge.targetPort }
          })
        }
      })
      graph.stopBatch()
    }, 50)
  }
}

const portMap = new Map<string, any>()

// 添加端口数据
function addPortData(newData: any, nodeId: string) {
  const currentNode = workflowData.value.nodeList.find(n => n.id === nodeId)
  if (currentNode) {
    const len = currentNode.outputData.length
    currentNode.outputData.splice(len - 1, 0, newData)
    onNodeDataUpdate(currentNode)
  }
}
let delPortNodeId: string | null = null
// 删除端口数据
function removePortData(index: number, nodeId: string, type?: string) {
  const currentNode = workflowData.value.nodeList.find(n => n.id === nodeId)
  if (currentNode) {
    let removedData: InputData[] | OutputData[] | null = null
    // 入参桩点不删除
    if (type === 'in') {
      removedData = currentNode.inputData
      // console.log('removedData===', removedData)
      // const node = graph.getCellById(currentNode.id)
      // if (node) {
      //   const port = node.getPort(removedData[0].portId)
      //   if (port) {
      //     portMap.set(port.uniqueId, removedData[0])
      //   }
      // }
    } else {
      removedData = currentNode.outputData.splice(index, 1)
      // console.log('removedData====', removedData, JSON.parse(JSON.stringify(workflowData.value.edges)))
      //
      const removedItem = removedData[0]
      if (removedItem) {
        workflowData.value.edges.forEach(i => {
          if (i.sourcePort === removedItem.portId) {
            delPortNodeId = i.target
          }
        })
      }
      // console.log('delPortNodeId===', delPortNodeId)
      const node = graph.getCellById(currentNode.id)
      if (node && removedItem) {
        const port = node.getPort(removedItem.portId)
        if (port) {
          portMap.set(port.uniqueId, removedItem)
        }
        // console.log('portMap====', portMap)
      }
    }
    onNodeDataUpdate(currentNode, type)
  }
}

/**
 * 处理节点数据更新 port
 * @param newData 新的节点数据
 */
function onNodeDataUpdate(newData: any, type?: string) {
  const node = graph.getCellById(newData.id)
  if (node) {
    node.setData(newData)
    const config = getCustomNodeConfig(newData) //重新计算节点配置
    syncNodePortsAndSize(node, config, type)
  } else {
    console.warn('[onNodeDataUpdate] 未找到节点', newData.id)
  }
}

/**
 * 处理节点数据更新 基础信息
 * @param nodeId 更新的id
 */
function onNodeBaseDataUpdate(nodeId: string) {
  const node = graph.getCellById(nodeId)
  const nodeInfo = workflowData.value.nodeList.find(n => n.id === nodeId)

  if (node && nodeInfo) {
    node.setData(nodeInfo)
    node.attr('title/text', nodeInfo.title)
  } else {
    console.error('Node or nodeInfo not found', nodeId)
  }
}

function directContectNode(node: BaseFunctionNodeType, data: any) {
  if (!graph) return
  graph.startBatch('directContectNode')

  const sourceNodeId = data.nodeId
  const sourcePortId = data.portId
  const fromEdgeAdd = data.fromEdgeAdd
  let nodeData = {
    ...JSON.parse(JSON.stringify(node.template)),
    id: nodeIdFactory.next()
  } as WorkflowNode
  // if (node.funcType === 'logic') {
  //   nodeData = createLogicNode(node.type, node.funcId)
  // } else {
  //   nodeData = createFuncNode(node)
  // }
  const x6Node = createX6Node(nodeData, true)

  if (x6Node) {
    graph.addNode(x6Node)
    if (data.fromBlankAdd) {
      x6Node.position(data.fromBlankX, data.fromBlankY)
      graph.stopBatch('directContectNode')
    } else {
      const sourceNode = graph.getCellById(sourceNodeId)
      const sourcePos = sourceNode.getPosition()
      const sourceSize = sourceNode.getSize()
      const targetPos = {
        x: sourcePos.x + sourceSize.width + 100,
        y: sourcePos.y
      }
      x6Node.position(targetPos.x, targetPos.y)
      setTimeout(() => {
        const edge = graph.addEdge({
          source: { cell: sourceNodeId, port: sourcePortId },
          target: { cell: x6Node.id, port: 'in_1' }
        })
        // 修复聚合函数在入桩是input的情况下无法自动连接问题
        if (nodeData.inputData[0].sourceType === 'input') {
          nodeData.inputData[0].sourceType = 'node'
          onNodeDataUpdate(nodeData, 'in')
        }
        if (fromEdgeAdd) {
          edgeCorrectionManager.addNodeBySearch(x6Node, edge)
        } else {
          edgeCorrectionManager.fixEdgeTargetNode(edge)
        }
        validateEdgeTypeAndSetColor(edge)
        const ndf = workflowData.value.nodeList.find(n => n.id === x6Node.id)
        if (ndf) {
          graph.select(x6Node)
          onNodeSelected(ndf)
        }
        graph.stopBatch('directContectNode')
      }, 100)
    }
  }
}

/**
 * 替换节点选中逻辑，选中节点时 emit('show-attr-panel',  nodeData )
 */
function onNodeSelected(nodeData: WorkflowNode | null) {
  selectedNodeData.value = nodeData
  emit('show-attr-panel', nodeData)
}

/**
 * 清除节点选择状态
 * 用于在关闭属性面板后，重置选择状态，以便再次点击同一节点时能触发选择事件
 */
function clearSelection() {
  if (graph) {
    graph.getPlugin('selection').clean()
    graph.unselect()
  }
}

/**
 * 选中指定节点（仅选中，不触发属性面板）
 * @param nodeId 节点ID
 */
function selectNodeOnly(nodeId: string) {
  if (!graph) return
  forceNode(nodeId)
  onNodeSelected(null)
}

/**
 * 选中指定节点
 * @param nodeId 节点ID
 */
function forceNode(nodeId: string) {
  if (!graph) return
  clearSelection()
  // 查找并选中指定节点
  const node = graph.getCellById(nodeId)
  graph.select(node)
  if (node) {
    // 将画布视图移动到节点位置，让节点显示在画布中间偏左200px
    const containerRect = container.value?.getBoundingClientRect()
    if (containerRect) {
      // // 先居中节点
      graph.centerCell(node)
    }
  }
}

const handlerEventListener = (node, view) => {
  // 用事件委托替代逐个 add/remove：mouseenter/leave 不冒泡，委托时改用 mouseover/mouseout
  const root = view.container?.querySelector('.x6-graph-pannable') || view.container

  const getEventEl = (target: EventTarget | null) => {
    const el = target as HTMLElement | null
    return el?.closest?.('[event]') as HTMLElement | null
  }

  const onMouseOver = (e: MouseEvent) => {
    const el = getEventEl(e.target)
    if (!el) return
    // 避免在同一元素内部移动导致重复触发
    if (e.relatedTarget && el.contains(e.relatedTarget as Node)) return

    const eventName = el.getAttribute('event')
    switch (eventName) {
      case 'node:customer_collapse': {
        const href = el.getAttribute('xlink:href') || ''
        showInfoPanel(node, 'foldButton', href.includes('UnFold') ? '展开' : '折叠')
        break
      }
      case 'node:custom_titletip': {
        const text = el.getAttribute('text') || ''
        showInfoPanel(node, 'title', text)
        break
      }
      case 'node:info_mouseenter':
        showInfoPanel(node, 'infoButton', node.data.remark)
        break
    }
  }

  const onMouseOut = (e: MouseEvent) => {
    const el = getEventEl(e.target)
    if (!el) return
    // 离开该元素（而不是在元素内部移动）才关闭
    if (e.relatedTarget && el.contains(e.relatedTarget as Node)) return
    closeInfoPanel()
  }

  root?.addEventListener('mouseover', onMouseOver)
  root?.addEventListener('mouseout', onMouseOut)

  return () => {
    root?.removeEventListener('mouseover', onMouseOver)
    root?.removeEventListener('mouseout', onMouseOut)
  }
}

/**
 * 信息展示面板相关函数
 */
function closeInfoPanel() {
  if (infoPanelNode.value) {
    graph.removeCell(infoPanelNode.value, { ignoreHistory: true })
    infoPanelNode.value = null
  }
}

/**
 * 显示信息面板
 */
function showInfoPanel(
  node: any,
  type: 'title' | 'remark' | 'copyButton' | 'delButton' | 'foldButton' | 'infoButton',
  desc: string
) {
  // 如果已有信息面板，先移除
  if (infoPanelNode.value) {
    graph.removeCell(infoPanelNode.value)
    infoPanelNode.value = null
  }
  // 创建信息面板节点
  const infoPanel = new InfoPanelNode()
  // 标题行的所有 默认都在线上
  let bool = infoPanel.setInfoContent({
    node,
    desc,
    refX: node.attrs[type].refX,
    refX2: node.attrs[type].refX2,
    refY: node.attrs[type].refY > 0 ? 0 : node.attrs[type].refY
  })
  if (bool) {
    // 添加到画布
    graph.addNode(infoPanel, { ignoreHistory: true })
    infoPanelNode.value = infoPanel
  }
}

const showValidationModal = ref(false)
const validationErrors = ref<ValidationError[]>([])
/**
 * 关闭工作流验证错误弹窗
 */
function closeValidationModal() {
  showValidationModal.value = false
  validationErrors.value = []
}

/**
 * 处理验证错误弹窗中的节点选择
 */
function handleValidationNodeSelect(nodeId: string) {
  // 选中指定节点
  selectNodeOnly(nodeId)
}

defineExpose({
  startDragPreview,
  addPortData,
  removePortData,
  onNodeBaseDataUpdate,
  directContectNode,
  clearSelection,
  forceNode,
  selectNodeOnly,
  getFlowData
})

function validateWorkflow() {
  // 同步一次组合 迭代的数据 确保数据完整性
  if (groupManager) {
    groupManager.syncGroupData()
  }
  // console.log('this.workflowData.value===', )
  workflowData.value.nodeList.forEach(node => {
    const _node = graph.getCellById(node.id) as any
    node.isCollapsed = _node.isCollapsed
  })

  const validator = new ValidatorManager(workflowData.value)
  const result = validator.validate()
  if (!result.isValid) {
    onNodeSelected(null)
    validationErrors.value = result.errors
    // 显示验证错误弹窗
    showValidationModal.value = true
  } else {
    if (result.warnings.length > 0) {
      ElMessage.warning({
        message: h('div', [
          h('div', '工作流校验通过，但有警告信息'),
          h('div', { style: 'white-space: pre-line; margin-top: 8px;' }, result.warnings.join('\n'))
        ]),
        duration: 3000
      })
    } else {
      ElMessage.success('工作流校验通过')
    }
  }

  if (result.isValid) {
    // 如果校验通过，则关闭验证错误弹窗
    closeValidationModal()
  }
  return result.isValid
}

/**
 * 递归查找上游非条件节点
 * @param nodeId 起始节点ID
 * @param workflowData 工作流数据
 * @param visited 已访问节点集合
 * @returns 上游非条件节点ID列表
 */
function findUpstreamNonConditionNodes(nodeId: string, workflowData: any): string[] {
  const nodeList = workflowData.value.nodeList || []
  const edges = workflowData.value.edges || []
  const node = nodeList.find(n => n.id === nodeId)

  if (!node) return []

  if (node.funcType === 'logic' && node.logicData?.logicType === 'ifelse') {
    // 递归查找所有连到该条件节点的上游节点
    const upstreamEdges = edges.filter(edge => edge.target === nodeId)
    let result: string[] = []
    for (const edge of upstreamEdges) {
      result = result.concat(findUpstreamNonConditionNodes(edge.source, workflowData))
    }
    return result
  } else {
    // 普通节点，返回当前节点ID
    return [nodeId]
  }
}
</script>

<style scoped lang="scss">
@use "jsh-core/style/variables" as *;

.workflow-editor-outer {
  width: 100%;
  height: 100%;
  position: relative;

  .workflow-editor {
    width: 100%;
    height: 100%;
    position: relative;
    background: $lib-bg-card;
    overflow: hidden;

    .graph-container {
      width: 100%;
      height: 100%;
      position: relative;

      :deep(.snapline) {
        border-color: $lib-color-primary;
        border-style: dashed;

        .x6-widget-snapline-vertical,
        .x6-widget-snapline-horizontal {
          stroke: $lib-color-primary;
          stroke-width: 1px;
          stroke-dasharray: 3, 3;
        }
      }

      :deep(.x6-port-in) {
        .v-line:last-child {
          font-size: 13px;
          fill: $lib-color-warning;
        }
      }

      :deep(.x6-port-out) {
        .v-line:last-child {
          font-size: 13px;
          fill: $lib-color-warning;
        }
      }
    }

    .minimap-container {
      position: absolute;
      right: 20px;
      bottom: 20px;
      width: 200px;
      height: 150px;
      background: $lib-bg-card;
      border-radius: $lib-radius-md;
      box-shadow: 0 2px 12px rgb(0 0 0 / 10%);
      z-index: 100;
    }

    .canvas-actions {
      position: absolute;
      left: 50%;
      bottom: 10px;
      transform: translateX(-50%);
      z-index: 100;
      background: none;
      box-shadow: none;
      display: flex;
      gap: 10px;
      align-items: center;
      padding: 4px;
      border-radius: $lib-radius-sm;

      svg {
        cursor: pointer;
      }
    }

    .workflow-actions {
      position: absolute;
      left: 10px;
      bottom: 10px;
      display: flex;
      gap: 4px;
      z-index: 100;
      padding: 4px;
      border-radius: $lib-radius-sm;
      flex-direction: column;
      align-items: flex-start;
      color: $lib-text-secondary;
      opacity: 0.3;

      span {
        user-select: none;
      }

      div {
        user-select: none;
        cursor: pointer;
        display: flex;
        align-items: center;
      }
    }
  }
}
</style>
