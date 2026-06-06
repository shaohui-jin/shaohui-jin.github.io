import { InputData, LogicType, OutputData, type WorkflowNode } from '@/types/workflow'
import { COLORS, PORT_ATTRS } from '../config/StyleConstants'
const VITE_PUBLIC_PATH = (import.meta.env.BASE_URL || '/').replace(/\/$/, '')
import { Graph, Node } from '@antv/x6'
import { type WorkflowData } from '@/types/workflow'
import type { Ref } from 'vue'
import { NODE_CONFIG_BASE_HEIGHT, NODE_CONFIG_TITLE_HEIGHT, NODE_CONFIG_WIDTH } from '@/config/node'
import { truncateText } from '@/utils/common/TextTruncate'

const DEFAULT_PORT = {
  portId: 'in_1',
  attributes: {
    paramType: 'string',
    inputType: 'text',
    label: '节点Id',
    desc: ''
  },
  options: []
}

// 生成端口配置
function generatePorts(node: WorkflowNode, nodeHeight: number) {
  let inputPorts = []
  let outputPorts = []

  // 创建端口配置
  function createPortConfig(item: InputData | OutputData, group: 'in' | 'out', position: any) {
    const {
      portId: id,
      attributes: { label: portTitle, desc, paramType: typeText }
    } = item
    return {
      id,
      group,
      args: position,
      portTitle,
      desc,
      zIndex: 10,
      attrs: {
        ...PORT_ATTRS,
        text: {
          text: truncateText(portTitle, NODE_CONFIG_WIDTH / 2, 14) + '\n' + typeText,
          fontSize: 14,
          textWrap: {
            width: NODE_CONFIG_WIDTH / 2,
            height: 80,
            overflow: 'hidden',
            ellipsis: true
          }
        }
      },
      uniqueId: 'port_' + Date.now() + Math.random().toString(36).substring(2, 15)
    }
  }

  // 自定义port分布函数，让port在边上均匀分布
  function getPortPosition(side: 'left' | 'right', total: number, idx: number, nodeHeight: number) {
    const available = nodeHeight - NODE_CONFIG_TITLE_HEIGHT
    let y
    if (total == 1) {
      y = NODE_CONFIG_TITLE_HEIGHT + available / 2
    } else {
      const step = available / (total + 1)
      y = NODE_CONFIG_TITLE_HEIGHT + step * (idx + 1)
    }
    return {
      x: side === 'left' ? 0 : NODE_CONFIG_WIDTH,
      y
    }
  }

  const inputNodeList = node.inputData.filter(e => e.sourceType == 'node')
  const isOnlyGlobal =
    node.inputData.length === 1 && node.inputData.find(e => e.sourceType === 'global')
  const inputData = inputNodeList.length ? inputNodeList : isOnlyGlobal ? [] : [DEFAULT_PORT]
  let inputPortCount = inputData.length || 1

  inputData.forEach((item, i) => {
    const inPos = getPortPosition('left', inputPortCount, i, nodeHeight)
    inputPorts.push(createPortConfig(item, 'in', inPos))
  })

  const outputData = node.outputData
  let outputPortCount = outputData.length || 1
  outputData.forEach((item, i) => {
    const outPos = getPortPosition('right', outputPortCount, i, nodeHeight)
    outputPorts.push(createPortConfig(item, 'out', outPos))
  })

  return { inputPorts, outputPorts }
}

/**
 * 自定义工作流节点工厂方法
 * @param node 节点数据
 * @returns X6节点配置
 */
export function getCustomNodeConfig(node: WorkflowNode) {
  // 1. 分析入参端口组名
  let inputPortCount = 1

  // if (node.funcType === 'func') {
  //   // 函数节点：根据 paramGroup 分析入参端口组名
  //   if (node.inputData && Array.isArray(node.inputData)) {
  //     node.inputData.forEach((input: any) => {
  //       if (input.sourceType === 'node') {
  //         inputPortCount++
  //       }
  //     })
  //   }
  // }

  // 2. 计算端口需求高度
  let nodeHeight = NODE_CONFIG_BASE_HEIGHT
  const outputPortCount = node.outputData?.length || 1
  const maxPort = Math.max(inputPortCount, outputPortCount)
  // 计算最终高度 (常用函数大多是一个node节点或者没有，保持一致的高度)
  nodeHeight = maxPort > 2 ? (maxPort - 2) * 24 + NODE_CONFIG_BASE_HEIGHT : NODE_CONFIG_BASE_HEIGHT

  // 3. 计算最终高度
  const finalHeight = NODE_CONFIG_TITLE_HEIGHT + (nodeHeight - NODE_CONFIG_TITLE_HEIGHT)

  const { inputPorts, outputPorts } = generatePorts(node, finalHeight)

  return {
    id: node.id,
    label: node.title,
    x: node.pos?.x || 100,
    y: node.pos?.y || 100,
    width: NODE_CONFIG_WIDTH,
    height: finalHeight,
    data: node,
    attrs: {
      body: {
        refWidth: '100%',
        refHeight: '100%',
        fill: '#fff',
        stroke: COLORS.border,
        strokeWidth: 1.5,
        rx: 10,
        ry: 10,
        filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.06))'
      },
      titleAreaBg: {
        refWidth: '100%',
        height: 20,
        refX: 0,
        refY: 16,
        fill: COLORS.background.lighter,
        stroke: 'none'
      },
      titleArea: {
        refWidth: '100%',
        height: 36,
        fill: COLORS.background.lighter,
        stroke: 'none',
        rx: 10,
        ry: 10,
        cursor: 'pointer'
      },
      border: {
        refWidth: '100%',
        refHeight: '100%',
        rx: 10,
        ry: 10,
        fill: 'none',
        stroke: COLORS.primary,
        strokeWidth: 2,
        strokeOpacity: 0
      },
      title: {
        text: node.title,
        fill: COLORS.text.primary,
        fontSize: 13,
        fontWeight: 'bold',
        refX: 16,
        refY: 18,
        textAnchor: 'start',
        yAlign: 'middle',
        // pointerEvents: 'none',
        event: 'node:custom_titletip',
        textWrap: {
          width: -80,
          height: 40,
          ellipsis: true
        }
      },
      nodeId: {
        text: node.id || '',
        fill: COLORS.text.secondary,
        fontSize: 13,
        refX: '100%',
        refX2: -280,
        refY: -20,
        textAnchor: 'end',
        pointerEvents: 'none'
      },
      foldButton: {
        width: 20,
        height: 20,
        refX: '100%',
        refX2: -60,
        refY: 10,
        cursor: 'pointer',
        'xlink:href': VITE_PUBLIC_PATH + '/rsvg/Fold.svg',
        event: 'node:customer_collapse'
      },
      infoButton: {
        width: 20,
        height: 20,
        refX: '100%',
        refX2: -36,
        refY: 10,
        cursor: 'pointer',
        'xlink:href': VITE_PUBLIC_PATH + '/rsvg/InfoCircleOutlined.svg',
        zIndex: 10,
        event: 'node:info_mouseenter'
      }
    },
    ports: {
      groups: {
        in: {
          position: 'absolute',
          attrs: PORT_ATTRS,
          label: {
            position: 'inside'
          },
          markup: [
            {
              tagName: 'circle',
              selector: 'circle'
            }
          ]
        },
        out: {
          position: 'absolute',
          attrs: PORT_ATTRS,
          label: {
            position: 'inside'
          },
          markup: [
            {
              tagName: 'circle',
              selector: 'circle'
            },
            {
              tagName: 'circle',
              selector: 'plus'
            },
            {
              tagName: 'text',
              selector: 'plusText'
            }
          ]
        }
      },
      items: [...inputPorts, ...outputPorts]
    },
    markup: [
      {
        tagName: 'rect',
        selector: 'body'
      },
      {
        tagName: 'rect',
        selector: 'titleAreaBg'
      },
      {
        tagName: 'rect',
        selector: 'titleArea',
        attrs: {
          'pointer-events': 'visiblePainted'
        }
      },
      {
        tagName: 'rect',
        selector: 'border'
      },
      {
        tagName: 'text',
        selector: 'title'
      },
      {
        tagName: 'text',
        selector: 'nodeId'
      },
      {
        tagName: 'image',
        selector: 'foldButton'
      },
      {
        tagName: 'image',
        selector: 'infoButton'
      }
    ]
  }
}

export class CustomNode extends Node {
  public startNode: Node = null
  private _isCollapsed = false
  public expandSize: { width: number; height: number }
  public oldPortXY: Array<any>[] = []
  private graph: Graph
  private workflowData: Ref<WorkflowData>
  constructor(options: any) {
    super(options)
  }

  private timer: TimeoutHandle
  // 设置1.5s 后显示 plusIcon
  showHidePortPlus(portId: string, isShow: boolean) {
    if (isShow) {
      this.timer = setTimeout(() => {
        this.showPortPlus(portId, true)
      }, 1500)
    } else {
      this.showPortPlus(portId, false)
      this.clearPortCount()
    }
  }

  showPortPlus(portId: string, isShow: boolean) {
    // 显示指定端口的 plus 和 plusText 元素
    const port = this.getPort(portId)
    if (port && port.group === 'out') {
      // 使用 X6 的 prop 方法设置属性
      this.setPortProp(portId, 'attrs/plus/display', isShow ? 'block' : 'none', {
        ignoreHistory: true
      })
      this.setPortProp(portId, 'attrs/plusText/display', isShow ? 'block' : 'none', {
        ignoreHistory: true
      })
      this.setPortProp(portId, 'attrs/circle/display', isShow ? 'none' : 'block', {
        ignoreHistory: true
      })
    }
  }
  //判断当前桩点是否有显示plus
  showSearchCheck(portId: string): boolean {
    return this.getPortProp(portId, 'attrs/plus/display') === 'block'
  }

  clearPortCount() {
    if (this.timer) {
      clearTimeout(this.timer)
      this.timer = null
    }
  }
  public resetStartNodePos() {
    // 获取父节点的位置
    const parentPosition = this.getPosition()
    // 设置起始节点位置，确保在迭代器内部
    const startX = parentPosition.x + 20
    const startY = parentPosition.y + 60
    this.startNode.setPosition(startX, startY, { ignoreHistory: true })
  }

  public getTitle() {
    return this.attr('title/text') as string
  }

  public setTitle(title: string) {
    this.attr('title/text', title, { ignoreHistory: true })
  }

  /**
   * 切换折叠状态
   */
  public toggleCollapse() {
    this._isCollapsed = !this._isCollapsed
    this.updateCollapseState()
  }

  public get isCollapsed() {
    return this._isCollapsed
  }
  /**
   * 更新桩位置
   */
  public updatePositionPorts(_isCollapsed: boolean) {
    const ports = this.getPorts()
    if (_isCollapsed) {
      const _tempXY = []
      ports.forEach((port: any) => {
        const { id, group, args } = port
        _tempXY.push({ id: port.id, group: group, args: JSON.parse(JSON.stringify(args)) })
        if (id.includes('in')) {
          args.y = this.size().height / 2
          args.x = 0
        } else {
          args.y = this.size().height / 2
          args.x = this.size().width
        }
        this.portProp(
          id,
          { group, args, attrs: { text: { visibility: 'hidden' } } },
          { ignoreHistory: true }
        )
      })
      this.oldPortXY = _tempXY
    } else {
      this.oldPortXY.forEach((item: any) => {
        const { id, group, args } = item
        this.portProp(
          id,
          { group, args, attrs: { text: { visibility: 'visible' } } },
          { ignoreHistory: true }
        )
      })
    }
  }
  /**
   * 更新折叠状态显示
   */
  private updateCollapseState() {
    if (this._isCollapsed) {
      // 收缩
      this.attr('foldButton/xlink:href', VITE_PUBLIC_PATH + '/rsvg/UnFold.svg', {
        ignoreHistory: true
      })
      //  node.attr('border/strokeOpacity', 1, { ignoreHistory: true })
      this.expandSize = this.getSize()
      this.resize(this.expandSize.width, 40, { ignoreHistory: true })
    } else {
      // 展开
      this.attr('foldButton/xlink:href', VITE_PUBLIC_PATH + '/rsvg/Fold.svg', {
        ignoreHistory: true
      })
      if (this.expandSize) {
        this.resize(this.expandSize.width, this.expandSize.height, { ignoreHistory: true })
      }
    }
    // 修改连接桩的位置
    this.updatePositionPorts(this._isCollapsed)
    const cells = this.getChildren()
    if (cells) {
      cells.forEach((cell: any) => {
        if (this._isCollapsed) {
          cell.hide()
        } else {
          cell.show()
        }
      })
    }
  }
}

export class CustomNodeManager extends Node {
  public initRegister(): void {
    Graph.registerNode('customNode', CustomNode, true)
  }
}
