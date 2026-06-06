import { Graph, Node } from '@antv/x6'
import { CustomNode } from '@/utils/manager/CustomNodeManager'
import { wrapTextByWidth } from '@/utils/common/TextTruncate'

const MAX_WIDTH = 300 // 气泡最大宽度
const TOOLTIP_DOUBLE_PADDING = 16 // 提示框内文字左右内边距(双倍的)，原因见X6文档
const BASE_FONT_SIZE = 14
const BASE_LINE_HEIGHT = 16

export class InfoPanelNode extends Node {
  constructor() {
    super()
  }

  public setInfoContent(content: any) {
    if (!content || !content.desc) return false

    const { node, refX, refX2, refY: offsetY } = content

    // 根据canvas算宽度截取文案换行
    let desc = wrapTextByWidth(content.desc, MAX_WIDTH - TOOLTIP_DOUBLE_PADDING)

    // 计算行数, 防止部分行存在过多的符号
    const lineCount = desc.split('\n').filter(Boolean).length

    // 设置位置（相对于触发节点）
    const sourcePosition = node.getPosition()
    const sourceSize = node.getSize()

    const height = lineCount * BASE_LINE_HEIGHT + TOOLTIP_DOUBLE_PADDING
    const width = lineCount > 1 ? MAX_WIDTH : desc.length * BASE_FONT_SIZE + TOOLTIP_DOUBLE_PADDING

    const offsetX = refX === '100%' ? sourceSize.width + refX2 : refX
    // 计算信息面板位置（默认显示在节点右侧）
    const x = sourcePosition.x + offsetX - 5
    const y = sourcePosition.y - height - 4 + offsetY
    this.setPosition(x, y, { ignoreHistory: true })

    // 更新描述文本
    this.attr('description/text', desc || '', { ignoreHistory: true })
    // 修改尺寸
    this.setSize(width, height, { ignoreHistory: true })

    // 更新尖角位置，使其指向源节点
    this.attr('arrow/refX', 20, { ignoreHistory: true })
    this.attr('arrow/refY', height, { ignoreHistory: true })

    return true
  }
}

InfoPanelNode.config({
  shape: 'infoPanelNode',
  width: MAX_WIDTH,
  height: MAX_WIDTH,
  markup: [
    {
      tagName: 'rect',
      selector: 'body'
    },
    {
      tagName: 'polygon',
      selector: 'arrow'
    },
    {
      tagName: 'text',
      selector: 'description'
    }
  ],
  attrs: {
    body: {
      refWidth: '100%',
      refHeight: '100%',
      fill: '#303133',
      stroke: '#303133',
      strokeWidth: 1,
      rx: 8,
      ry: 8,
      filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.15))',
      zIndex: 1000
    },
    arrow: {
      points: '-4,0 4,0 0,8',
      fill: '#303133',
      strokeWidth: 1,
      refX: -8, // 相对于body的x偏移
      refY: 20, // 相对于body的y偏移
      zIndex: 999
    },
    description: {
      text: '',
      fontSize: BASE_FONT_SIZE,
      height: BASE_LINE_HEIGHT,
      lineHeight: BASE_LINE_HEIGHT,
      fill: '#ffffff',
      refX: TOOLTIP_DOUBLE_PADDING / 2,
      refY: TOOLTIP_DOUBLE_PADDING / 2,
      textAnchor: 'start',
      textVerticalAnchor: 'top',
      // textWrap: {
      //   width: '100%',
      //   height: '100%',
      //   breakWord: 'break-all'
      // },
      zIndex: 1002
    }
  },
  ports: {
    groups: {
      // 信息面板不需要端口
    },
    items: []
  }
})

export class InfoPanelNodeManager extends Node {
  public initRegister(): void {
    Graph.registerNode('infoPanelNode', InfoPanelNode, true)
  }
}
