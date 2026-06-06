import { Graph, Node } from '@antv/x6'
import { ElMessage, ElMessageBox } from 'element-plus'
import nodeIdFactory from '../factory/NodeIdFactory'
import { GroupNodeData, WorkflowData } from '@/types/workflow'
import type { Ref } from 'vue'

class GroupNode extends Node {
  private _isCollapsed = false
  private expandSize!: { width: number; height: number }

  protected postprocess() {
    this.toggleCollapse(false)
    // 设置父节点层级
    this.setZIndex(-1)
  }

  get isCollapsed() {
    return this._isCollapsed
  }

  set isCollapsed(_isCollapsed: boolean) {
    this._isCollapsed = _isCollapsed
  }

  getExpandedSize() {
    return this.expandSize ? this.expandSize : this.getSize()
  }

  toggleCollapse(_isCollapsed?: boolean) {
    const target = _isCollapsed == null ? !this._isCollapsed : _isCollapsed
    if (target) {
      this.attr('buttonSign', { d: 'M 1 5 9 5 M 5 1 5 9' })
      this.expandSize = this.getSize()
      // 计算折叠后的宽度：左边距 + 折叠按钮宽度 + 按钮间距 + 标题宽度 + 取消按钮宽度 + 右边距
      const labelText = (this.attr('label/text') || '') as string
      const labelWidth = labelText.length * 12 // 假设每个字符宽度为12px
      const collapsedWidth = 60 + labelWidth
      this.resize(Math.max(collapsedWidth, 180), 80)
    } else {
      this.attr('buttonSign', { d: 'M 2 5 8 5' })
      if (this.expandSize) {
        this.resize(this.expandSize.width, this.expandSize.height)
      }
    }
    this._isCollapsed = target
  }
}

// 配置分组节点的样式和行为
GroupNode.config({
  shape: 'groupNode',
  markup: [
    {
      tagName: 'rect',
      selector: 'body'
    },
    {
      tagName: 'rect',
      selector: 'titleArea',
      attrs: {
        'pointer-events': 'visiblePainted'
      }
    },
    {
      tagName: 'text',
      selector: 'label'
    },
    {
      tagName: 'g',
      selector: 'buttonGroup',
      children: [
        {
          tagName: 'rect',
          selector: 'button',
          attrs: {
            'pointer-events': 'visiblePainted'
          }
        },
        {
          tagName: 'path',
          selector: 'buttonSign',
          attrs: {
            fill: 'none',
            'pointer-events': 'none'
          }
        }
      ]
    },
    {
      tagName: 'g',
      selector: 'ungroupButton',
      children: [
        {
          tagName: 'rect',
          selector: 'ungroupButtonBg',
          attrs: {
            'pointer-events': 'visiblePainted'
          }
        },
        {
          tagName: 'text',
          selector: 'ungroupButtonText',
          attrs: {
            'pointer-events': 'none'
          }
        }
      ]
    }
  ],
  attrs: {
    body: {
      refWidth: '100%',
      refHeight: '100%',
      strokeWidth: 1,
      fill: '#ffffff',
      stroke: '#ccc',
      rx: 8,
      ry: 8,
      zIndex: -1 // 确保在最底层
    },
    titleArea: {
      refX: 28,
      refY: 4,
      refWidth: -56,
      height: 24,
      fill: 'transparent',
      stroke: 'none',
      cursor: 'pointer',
      'data-title-area': 'true', // 添加标识属性
      class: 'group-title-area' // 添加类名以便于识别
    },
    label: {
      fontSize: 12,
      fill: '#333',
      refX: 32,
      refY: 11,
      textAnchor: 'start',
      pointerEvents: 'none', // 确保文本不会阻止事件传递到下面的titleArea
      textWrap: {
        width: -64, // 总宽度减去左右按钮的宽度（24px + 24px = 48px）再留些边距
        height: -10, // 留出上下边距
        ellipsis: true // 文本过长时显示省略号
      }
    },
    buttonGroup: {
      refX: 8,
      refY: 8
    },
    button: {
      height: 14,
      width: 16,
      rx: 2,
      ry: 2,
      fill: '#f5f5f5',
      stroke: '#ccc',
      cursor: 'pointer',
      event: 'node:collapse'
    },
    buttonSign: {
      refX: 3,
      refY: 2,
      stroke: '#808080'
    },
    ungroupButton: {
      refX: '100%',
      refX2: -24,
      refY: 8
    },
    ungroupButtonBg: {
      height: 16,
      width: 16,
      rx: 2,
      ry: 0,
      fill: '#ffffff',
      cursor: 'pointer',
      event: 'node:ungroup'
    },
    ungroupButtonText: {
      text: '×',
      fill: '#ff4d4f',
      fontSize: 18,
      fontWeight: 'bold',
      refX: 8,
      refY: 0,
      textAnchor: 'middle'
    }
  },
  ports: {
    groups: {
      in: {
        position: 'left',
        attrs: {
          circle: {
            r: 5,
            magnet: true,
            stroke: 'transparent',
            strokeWidth: 2.5,
            fill: 'transparent'
          }
        }
      },
      out: {
        position: 'right',
        attrs: {
          circle: {
            r: 5,
            magnet: true,
            stroke: 'transparent',
            strokeWidth: 2.5,
            fill: 'transparent'
          }
        }
      }
    },
    items: [
      {
        id: 'in_1',
        group: 'in',
        args: { x: 0, y: '50%' }
      },
      {
        id: 'out_1',
        group: 'out',
        args: { x: '100%', y: '50%' }
      }
    ]
  }
})

function createGroupNode(groupData: GroupNodeData) {
  return new GroupNode({
    id: groupData.id || nodeIdFactory.next(),
    x: groupData.pos.x,
    y: groupData.pos.y,
    width: groupData.width,
    height: groupData.height,
    zIndex: -1, // 确保在最底层
    attrs: {
      label: { text: groupData.title }
    },
    isCollapsed: groupData.isCollapsed || false
  })
}

export class GroupNodeManager {
  private graph: Graph
  private workflowData: Ref<WorkflowData>

  constructor(graph: Graph, workflowData: Ref<WorkflowData>) {
    this.graph = graph
    this.workflowData = workflowData
    this.initGroupEvents()
  }

  /**
   * 创建分组
   * @param selectedNodes 选中的节点列表
   * @returns 是否创建成功
   */
  createGroup(selectedNodes: Node[]): boolean {
    if (selectedNodes.length < 2) {
      ElMessage.warning('请选择至少2个节点进行组合')
      return false
    }

    try {
      // 计算分组的边界框
      const bbox = this.graph.getCellsBBox(selectedNodes)
      if (!bbox) {
        ElMessage.warning('无法计算分组边界')
        return false
      }

      // 创建分组节点
      const groupId = nodeIdFactory.next()
      const padding = 30 // 增加分组边框与内部节点的间距
      const group = createGroupNode({
        id: groupId,
        children: [],
        isCollapsed: false,
        pos: {
          x: bbox.x - padding,
          y: bbox.y - padding - 10
        },
        width: bbox.width + padding * 2,
        height: bbox.height + padding * 2 + 10,
        title: `Group ${groupId}`
      })

      // 添加分组节点到画布
      this.graph.addNode(group)

      // 将选中的节点添加到分组中
      this.graph.startBatch('group')
      this.graph.unselect(selectedNodes || [])
      selectedNodes.forEach(node => {
        group.addChild(node)
      })
      this.graph.stopBatch('group')

      // 触发一次重命名
      this.renameGroupAlert(group)

      ElMessage.success(`成功创建分组，包含 ${selectedNodes.length} 个节点`)
      return true
    } catch (error) {
      console.error('创建分组失败:', error)
      ElMessage.error('创建分组失败')
      return false
    }
  }

  /**
   * 取消分组
   * @param groupNode 分组节点
   * @returns 是否取消成功
   */
  ungroup(groupNode: Node): Promise<boolean> {
    return new Promise(resolve => {
      ElMessageBox.confirm('确定要取消分组吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.graph.startBatch('ungroup')
          const children = groupNode.getChildren()
          if (children && children.length > 0) {
            // 将子节点从分组中移出，并调整位置
            children.forEach((child: any) => {
              child.show()
              groupNode.removeChild(child)
              if (child.isNode && child.isNode()) {
                this.graph.addNode(child)
              } else if (child.isEdge && child.isEdge()) {
                this.graph.addEdge(child)
              }
            })
            // 删除分组节点
            this.graph.removeNode(groupNode)
            ElMessage.success('已取消分组')
            resolve(true)
          }
          this.graph.stopBatch('ungroup')
        })
        .catch(() => {
          // 用户取消操作
          resolve(false)
        })
    })
  }

  /**
   * 折叠/展开分组
   * @param groupNode 分组节点
   */
  toggleCollapse(groupNode: any): void {
    if (groupNode.toggleCollapse) {
      groupNode.toggleCollapse()
      const collapsed = groupNode.isCollapsed

      // 折叠/展开 子节点
      const collapse = (parent: any) => {
        const cells = parent.getChildren()
        if (cells) {
          cells.forEach((cell: any) => {
            if (collapsed) {
              cell.hide()
            } else {
              cell.show()
            }

            if (cell.toggleCollapse && !cell.isCollapsed) {
              collapse(cell)
            }
          })
        }
      }
      collapse(groupNode)

      // 处理虚拟边
      this.handleVirtualEdges(groupNode)
    }
  }

  /**
   * 重命名分组 弹窗
   * @param groupNode 分组节点
   */
  renameGroupAlert(groupNode: any): void {
    const currentLabel = groupNode.attr('label/text')
    ElMessageBox.prompt('请输入新的组名:', '重命名', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      inputValue: currentLabel
    })
      .then(({ value }) => {
        this.renameGroup(groupNode, value)
      })
      .catch(() => {
        // 用户取消操作
      })
  }

  /**
   * 重命名分组
   * @param groupNode 分组节点
   * @param newTitle 新标题
   */
  renameGroup(groupNode: any, newTitle: string): void {
    if (newTitle && newTitle.trim() !== '') {
      const title = newTitle.trim()
      // 更新节点视图
      groupNode.attr('label/text', title)
      ElMessage.success('重命名成功')
    } else {
      ElMessage.warning('分组名称不能为空')
    }
  }

  /**
   * 处理分组节点的虚拟边
   * @param groupNode 分组节点
   */
  handleVirtualEdges(groupNode: any): void {
    const isCollapsed = groupNode.isCollapsed

    // 开始一个不记录历史的批处理
    this.graph.startBatch('virtual_edges', { ignoreHistory: true })

    // 展开状态 清理虚拟边
    if (!isCollapsed) {
      const existingVirtualEdges = this.graph
        .getEdges()
        .filter(edge => edge.id.startsWith(`virtual_${groupNode.id}`))
      existingVirtualEdges.forEach(edge => edge.remove())
      this.graph.stopBatch('virtual-edges')
      return
    }

    // 收起状态，创建虚拟边
    const hiddenEdges = this.graph.getEdges()

    // 为每个隐藏的边创建一个虚拟边（连接到分组节点）
    hiddenEdges.forEach(edge => {
      const sourceId = edge.getSourceCellId()
      const targetId = edge.getTargetCellId()
      const sourcePort = edge.getSourcePortId()
      const targetPort = edge.getTargetPortId()

      // 检查源节点或目标节点是否是组内节点
      const sourceIsInGroup = groupNode.isAncestorOf(this.graph.getCellById(sourceId))
      const targetIsInGroup = groupNode.isAncestorOf(this.graph.getCellById(targetId))

      // 只有当一个端点在组内，另一个在组外时才创建虚拟边
      if (sourceIsInGroup !== targetIsInGroup && (sourceIsInGroup || targetIsInGroup)) {
        this.graph.addEdge({
          id: `virtual_${groupNode.id}_${edge.id}`,
          source: sourceIsInGroup ? groupNode.id : sourceId,
          target: targetIsInGroup ? groupNode.id : targetId,
          sourcePort: sourcePort,
          targetPort: targetPort,
          attrs: {
            line: {
              stroke: '#1890ff',
              strokeDasharray: '5 5', // 虚线样式
              strokeWidth: 1,
              targetMarker: {
                name: 'block',
                size: 6
              }
            }
          },
          connector: 'smooth',
          zIndex: 0
        })
      }
    })

    this.graph.stopBatch('virtual-edges')
  }

  /**
   * 保存的时候 同步分组数据
   */
  syncGroupData(): void {
    const groupList = this.workflowData.value.groupList
    groupList.forEach(groupData => {
      const groupView = this.graph.getCellById(groupData.id) as any
      if (groupView) {
        const children = groupView.getChildren()
        const pos = groupView.getPosition()
        const size = groupView.getExpandedSize()
        groupData.children = children.map(n => n.id)
        groupData.isCollapsed = groupView.isCollapsed
        groupData.pos = { x: pos.x, y: pos.y }
        groupData.title = groupView.attr('label/text')
        groupData.width = size.width
        groupData.height = size.height
      }
    })
  }

  /**
   * 加载的时候 解码分组数据
   */
  decodeGroupData(): void {
    const groupList = this.workflowData.value.groupList
    groupList.forEach(groupData => {
      const groupNode = createGroupNode({
        id: groupData.id,
        children: groupData.children,
        isCollapsed: groupData.isCollapsed,
        pos: groupData.pos,
        width: groupData.width,
        height: groupData.height,
        title: groupData.title
      })
      this.graph.addNode(groupNode)
      // 根据保存信息 重新添加下子节点
      groupData.children.forEach(child => {
        const node = this.graph.getCellById(child)
        if (node) {
          groupNode.addChild(node)
        }
      })
      // 根据保存的信息 处理一下折叠情况
      if (groupData.isCollapsed) {
        this.toggleCollapse(groupNode)
      }
    })
  }

  /**
   * 初始化分组事件
   */
  private initGroupEvents(): void {
    // 添加分组节点的折叠/展开事件处理
    this.graph.on('node:collapse', ({ node }: { node: any }) => {
      this.toggleCollapse(node)
    })

    // 添加取消分组事件处理
    this.graph.on('node:ungroup', ({ node }: { node: any }) => {
      this.ungroup(node)
    })

    // 添加分组节点标题双击事件处理
    this.graph.on('node:dblclick', ({ node, e }: { node: any; e: any }) => {
      if (node.shape === 'groupNode') {
        // 检查点击的元素是否在标题区域
        const target = e.target as Element
        if (
          !target.getAttribute('data-title-area') &&
          !target.parentElement?.getAttribute('data-title-area')
        ) {
          return
        }

        this.renameGroupAlert(node)
      }
    })

    // 分组节点添加事件处理
    this.graph.on('node:added', ({ node }: { node: any }) => {
      if (node.shape === 'groupNode') {
        if (!this.workflowData.value.groupList.find((g: any) => g.id === node.id)) {
          this.workflowData.value.groupList.push({
            id: node.id,
            title: node.attr('label/text'),
            children: [],
            isCollapsed: false,
            width: node.getSize().width,
            height: node.getSize().height,
            pos: { x: node.getPosition().x, y: node.getPosition().y }
          })
        }
      }
    })

    // 分组节点移除事件处理
    this.graph.on('node:removed', ({ node }: { node: any }) => {
      if (node.shape === 'groupNode') {
        const nodeId = node.id
        const idx = this.workflowData.value.groupList.findIndex(n => n.id === nodeId)
        if (idx !== -1) {
          this.workflowData.value.groupList.splice(idx, 1)
        }
      }
    })
  }
}
