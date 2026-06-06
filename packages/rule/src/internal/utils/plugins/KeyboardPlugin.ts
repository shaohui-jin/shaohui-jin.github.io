import { Keyboard } from '@antv/x6'
import type { Graph } from '@antv/x6'
import { ElMessage, ElMessageBox } from 'element-plus'
import { createNewNode } from '@/utils/factory/NodeFactory'
import { type WorkflowData } from '@/types/workflow'
import type { GroupNodeManager } from '@/utils/manager/GroupNodeManager'
import { unref, Ref } from 'vue'
import nodeIdFactory from '@/utils/factory/NodeIdFactory'
import { EmitFn } from 'vue'
import * as dagre from 'dagre'

type KeyboardPlugin = {
  graphData: {
    graph: Graph
    groupManager: GroupNodeManager
  }
  workflowData: {
    workflowData: Ref<WorkflowData>
    selectedNodeData: Ref<any>
    showMiniMap: Ref<boolean>
  }
  workflowFn: {
    handleTest: Function
  }
  emit: EmitFn
}

let copiedNodeData: any[] = []
let collapse = false

/** 画布键盘操作标识（batch、日志、配置等） */
export const KEYBOARD = {
  UNDO: 'undo',
  REDO: 'redo',
  DELETE: 'delete',
  COPY: 'copy',
  PASTE: 'paste',
  GROUP: 'group',
  UNGROUP: 'ungroup',
  CLEAR: 'clear',
  IMPORT: 'import',
  EXPORT: 'export',
  TEST: 'test',
  COLLAPSE: 'collapse',
  FIT: 'fit',
  LAYOUT: 'layout',
  BROWSING: 'browsing'
} as const

export type KeyboardAction = (typeof KEYBOARD)[keyof typeof KEYBOARD]

export type KeyboardBinding = string | readonly string[]

export const KeyboardKey = {
  [KEYBOARD.UNDO]: 'ctrl+z',
  [KEYBOARD.REDO]: 'ctrl+y',
  [KEYBOARD.DELETE]: 'delete',
  [KEYBOARD.COPY]: ['ctrl+c', 'cmd+c'] as const,
  [KEYBOARD.PASTE]: ['ctrl+v', 'cmd+v'] as const,
  [KEYBOARD.GROUP]: 'g',
  [KEYBOARD.UNGROUP]: 'ctrl+g',
  [KEYBOARD.CLEAR]: 'ctrl+delete',
  [KEYBOARD.IMPORT]: 'i',
  [KEYBOARD.EXPORT]: 'o',
  [KEYBOARD.TEST]: 't',
  [KEYBOARD.COLLAPSE]: '1',
  [KEYBOARD.FIT]: '2',
  [KEYBOARD.LAYOUT]: '3',
  [KEYBOARD.BROWSING]: '4'
} as const satisfies Record<KeyboardAction, KeyboardBinding>

export type KeyboardKeyId  = keyof typeof KeyboardKey

const toBindKey = (binding: KeyboardBinding): string | string[] => {
  return typeof binding === 'string' ? binding : [...binding]
}

/** 当前选中的节点（不含边） */
const getSelectedNodes = (graph: Graph): any[] => {
  return graph.getSelectedCells().filter((c: any) => c.isNode && c.isNode()) as any[]
}

/** 清空画布数据与视图（不弹确认；供快捷键清空、导入前复用） */
const clearCanvasCore = (
  graph: Graph,
  workflowData: Ref<WorkflowData>,
  selectedNodeData: Ref<any>,
  emit: EmitFn
)  => {
  workflowData.value = {
    id: workflowData.value.id,
    ruleName: workflowData.value.ruleName,
    nodeList: [],
    edges: [],
    groupList: [],
    lua: ''
  }
  graph.clearCells()
  graph.cleanHistory()
  selectedNodeData.value = null
  nodeIdFactory.reset?.(1)
  emit('update:workflow', workflowData.value)
}

/** 布局后把画布节点坐标写回 workflowData */
const syncPositionsFromGraph = (graph: Graph, workflowData: Ref<WorkflowData>)=> {
  graph.getNodes().forEach((node: any) => {
    const nodeData = workflowData.value.nodeList.find(n => n.id === node.id)
    if (nodeData) {
      const p = node.position()
      nodeData.pos = { x: p.x, y: p.y }
    }
  })
}

const downloadJson = (filename: string, payload: object)=> {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

const pickJsonFile = (): Promise<File | null> => {
  return new Promise(resolve => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.style.display = 'none'
    input.onchange = () => {
      resolve(input.files?.[0] ?? null)
      input.remove()
    }
    document.body.appendChild(input)
    input.click()
  })
}

const layout = (graph: Graph) => {
  const layoutG = new dagre.graphlib.Graph()
  layoutG.setGraph({
    rankdir: 'LR',
    nodesep: 120,
    ranksep: 80
  })
  layoutG.setDefaultEdgeLabel(() => ({}))

  const nodes = graph.getNodes().filter((node: any) => !node.parent)
  const edges = graph.getEdges()

  nodes.forEach((node: any) => {
    layoutG.setNode(node.id, {
      width: node.getSize().width,
      height: node.getSize().height
    })
  })
  edges.forEach((edge: any) => {
    layoutG.setEdge(edge.getSourceCellId(), edge.getTargetCellId())
  })

  dagre.layout(layoutG)

  graph.startBatch('layout')
  nodes.forEach((node: any) => {
    const ln = layoutG.node(node.id)
    if (ln) {
      node.setPosition(ln.x - ln.width / 2, ln.y - ln.height / 2)
    }
  })
  graph.centerContent()
  graph.stopBatch('layout')
}

export function registerKeyboardPlugins({
  graphData: { graph, groupManager },
  workflowData: { workflowData, selectedNodeData, showMiniMap },
  workflowFn: { handleTest },
  emit
}: KeyboardPlugin) {
  const keyboard = new Keyboard({
    enabled: true,
    global: false
  })
  graph.use(keyboard)

  // 1 — 一键折叠/展开
  graph.bindKey(toBindKey(KeyboardKey[KEYBOARD.COLLAPSE]), () => {
    graph.startBatch('collapse-nodes-and-edges')
    for (const { id } of workflowData.value.nodeList) {
      const cell = graph.getCellById(id) as any
      if (!cell || cell.parent || cell.isCollapsed !== !collapse) continue
      cell.toggleCollapse()
    }
    graph.stopBatch('collapse-nodes-and-edges')
    collapse = !collapse
  })

  // 2 — 适应视图
  graph.bindKey(toBindKey(KeyboardKey[KEYBOARD.FIT]), () => {
    graph.zoomToFit({ maxScale: 1 })
  })

  // 3 — 一键排列
  graph.bindKey(toBindKey(KeyboardKey[KEYBOARD.LAYOUT]), () => {
    layout(graph)
    setTimeout(() => syncPositionsFromGraph(graph, workflowData), 100)
  })

  // 4 — 视图浏览（小地图开关）
  graph.bindKey(toBindKey(KeyboardKey[KEYBOARD.BROWSING]), () => {
    showMiniMap.value = !showMiniMap.value
  })

  // ctrl+z — 撤销
  graph.bindKey(toBindKey(KeyboardKey[KEYBOARD.UNDO]), () => {
    if (graph.canUndo()) graph.undo()
  })

  // ctrl+y — 重做
  graph.bindKey(toBindKey(KeyboardKey[KEYBOARD.REDO]), () => {
    if (graph.canRedo()) graph.redo()
  })

  // delete — 删除选中
  graph.bindKey(toBindKey(KeyboardKey[KEYBOARD.DELETE]), () => {
    const cells = graph.getSelectedCells()
    if (cells.length === 0) return
    graph.removeCells(cells)
    ElMessage.success(`已删除 ${cells.length} 个元素`)
  })

  // ctrl+c / cmd+c — 复制节点
  graph.bindKey(toBindKey(KeyboardKey[KEYBOARD.COPY]), () => {
    const nodes = getSelectedNodes(graph)
    if (nodes.length === 0) {
      ElMessage.warning('请先选择要复制的节点')
      return
    }
    copiedNodeData = nodes.map((node: any) => ({
      ...(node.data || {}),
      pos: { x: node.getPosition().x, y: node.getPosition().y }
    }))
    ElMessage.success(`成功复制 ${nodes.length} 个节点`)
  })

  // ctrl+v / cmd+v — 粘贴节点
  graph.bindKey(toBindKey(KeyboardKey[KEYBOARD.PASTE]), () => {
    if (copiedNodeData.length === 0) {
      ElMessage.warning('剪贴板为空')
      return
    }
    graph.startBatch('keyboard-paste')
    for (const nodeData of copiedNodeData) {
      try {
        graph.addNode(createNewNode(nodeData) as any)
      } catch (e) {
        console.warn('重新生成节点失败:', e)
      }
    }
    graph.stopBatch('keyboard-paste')
    ElMessage.success('粘贴成功')
  })

  // g — 分组
  graph.bindKey(toBindKey(KeyboardKey[KEYBOARD.GROUP]), () => {
    groupManager.createGroup(getSelectedNodes(graph))
  })

  // ctrl+g — 取消分组
  graph.bindKey(toBindKey(KeyboardKey[KEYBOARD.UNGROUP]), e => {
    e.preventDefault()
    const node = getSelectedNodes(graph)[0]
    if (!node) {
      ElMessage.warning('请先选中分组节点')
      return
    }
    if (!unref(workflowData).groupList.find(g => g.id === node.id)) {
      ElMessage.warning('无法取消非分组对象')
      return
    }
    groupManager.ungroup(node)
  })

  // ctrl+delete — 清空画布
  graph.bindKey(toBindKey(KeyboardKey[KEYBOARD.CLEAR]), () => {
    ElMessageBox.confirm('画布将清空，是否继续？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      clearCanvasCore(graph, workflowData, selectedNodeData, emit)
      ElMessage.success('画布已清空')
    })
  })

  // i — 导入工作流
  graph.bindKey(toBindKey(KeyboardKey[KEYBOARD.IMPORT]), e => {
    e.preventDefault()
    void (async () => {
      const file = await pickJsonFile()
      if (!file) return
      let data: any
      try {
        data = JSON.parse(await file.text())
      } catch {
        ElMessage.error('文件解析失败，请检查文件格式')
        return
      }
      if (!data.nodeList || !data.edges) {
        ElMessage.error('导入的文件格式不正确，请选择正确的工作流文件')
        return
      }
      try {
        await ElMessageBox.confirm('导入将清空当前画布数据，是否继续？', '导入确认', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
      } catch {
        ElMessage.info('已取消导入')
        return
      }
      clearCanvasCore(graph, workflowData, selectedNodeData, emit)
      ElMessage.success('工作流数据导入成功')
    })()
  })

  // o — 导出工作流
  graph.bindKey(toBindKey(KeyboardKey[KEYBOARD.EXPORT]), e => {
    e.preventDefault()
    try {
      groupManager?.syncGroupData?.()
      workflowData.value.nodeList.forEach(node => {
        const cell = graph.getCellById(node.id) as any
        if (cell) node.isCollapsed = cell.isCollapsed
      })
      downloadJson(
        `workflow_${workflowData.value.ruleName || 'unnamed'}_${new Date().toISOString().slice(0, 10)}.json`,
        { ...workflowData.value, id: undefined, lua: undefined }
      )
      ElMessage.success('工作流数据导出成功')
    } catch (err) {
      console.error('导出失败:', err)
      ElMessage.error('导出失败，请重试')
    }
  })

  // t — 测试
  graph.bindKey(toBindKey(KeyboardKey[KEYBOARD.TEST]), e => {
    e.preventDefault()
    handleTest()
  })

  return keyboard
}


