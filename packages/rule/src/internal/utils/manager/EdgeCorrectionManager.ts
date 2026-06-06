import { Ref, h } from 'vue'
import { ElMessage } from 'element-plus'
import { getCustomNodeConfig } from '@/utils/manager/CustomNodeManager'
import { ValidatorManager } from './ValidatorManager'
import { LogicType, type WorkflowData } from '@/types/workflow'
import { EDGE_STYLES } from '../config/StyleConstants'

// 类型定义
interface SearchTarget {
  targetNodeId: string
  targetPortId: string
  edgeId: string
}

export class EdgeCorrectionManager {
  // ==================== 核心属性 ====================
  private graph: any
  private workflowData: Ref<WorkflowData>
  private edgeColorSet: boolean = false

  // ==================== 状态管理 ====================
  private typeErrorMap: Map<string, boolean>
  public searchTarget: SearchTarget | null = null
  private directContectNode: Function

  // ==================== 配置常量 ====================
  private readonly edgeStyles = EDGE_STYLES

  private autoList1 = ['{}Part', 'Part[]', 'Part[][]']
  private autoList2 = ['string', 'string[]', 'string[][]']
  private autoList3 = ['number', 'number[]', 'number[][]']

  private readonly UI_CONSTANTS = {
    ICON_SIZE: 20,
    ICON_Z_INDEX: 1000,
    HOVER_DELAY: 300,
    CLOSE_DELAY: 100,
    CLICK_DELAY: 100
  }

  // ==================== 构造函数 ====================
  constructor(graph: any, workflowData: Ref<any>, directContectNode: Function) {
    this.graph = graph
    this.workflowData = workflowData
    this.typeErrorMap = new Map()
    this.directContectNode = directContectNode
  }

  // ==================== 公共接口方法 ====================

  /**
   * 验证边的类型兼容性并设置颜色
   * @param edge 边对象
   */
  validateEdgeTypeAndSetColor(edge: any, isDecode: boolean = false) {
    const sourceNodeId = edge.getSourceCellId()
    const sourcePortId = edge.getSourcePortId()
    const targetNodeId = edge.getTargetCellId()
    const targetPortId = edge.getTargetPortId()

    const sourceType = this.getNodePortType(sourceNodeId, sourcePortId, true)
    const targetType = this.getNodePortType(targetNodeId, targetPortId, false)

    if (sourceType && targetType) {
      const isValid = this.validateTypeCompatibility(sourceType, targetType)
      if (!isValid) {
        this.handleTypeMismatch(edge, sourceType, targetType)
      } else {
        this.handleTypeMatch(edge)
        // 校验是否需要增加数据转换节点
        if (!isDecode) {
          this.midNodeCheck(
            sourceNodeId,
            sourcePortId,
            targetNodeId,
            targetPortId,
            edge,
            targetType
          )
        }
      }
    }
  }

  edgePreviewColor(args: any) {
    if (this.edgeColorSet) return
    const edge = args.edge
    let tempColor: any = this.edgeStyles.normal
    const sourceNodeId = args.sourceCell?.id
    const sourcePortId = args.sourcePort
    const targetNodeId = args.targetCell?.id
    const targetPortId = args.targetPort
    if (!targetNodeId) {
      // 没有目标节点，则设置为默认色
      this.setEdgeStyle(edge, tempColor)
      return
    }
    const sourceType = this.getNodePortType(sourceNodeId, sourcePortId, true)
    const targetType = this.getNodePortType(targetNodeId, targetPortId, false)
    if (sourceType && targetType) {
      const isValid = this.validateTypeCompatibility(sourceType, targetType)
      if (!isValid) {
        tempColor = this.edgeStyles.error
      } else {
        // 有任意any类型，都则设置为警告色
        const hasSourceAny = sourceType[0][0] === 'any' || sourceType[0][1] === 'any'
        if (hasSourceAny) {
          tempColor = this.edgeStyles.alert
        } else {
          const node = this.workflowData.value.nodeList.find(n => n.id === targetNodeId)
          const targetPortData = node.inputData?.find(p => p.portId === targetPortId)
          if (
            targetPortData &&
            (targetPortData.type === 'any' || targetPortData.subType === 'any')
          ) {
            tempColor = this.edgeStyles.alert
          } else {
            tempColor = this.edgeStyles.pass
          }
        }
      }
    }
    this.setEdgeStyle(edge, tempColor)
    this.edgeColorSet = true
    setTimeout(() => {
      this.edgeColorSet = false
    }, 200)
  }

  /**
   * 清理边相关状态
   * @param edge 边对象
   */
  cleanupEdge(edge: any) {
    const errorKey = this.generateErrorKey(edge)
    this.typeErrorMap.delete(errorKey)

    if (edge.hasCorrectionText) {
      edge.hasCorrectionText = false
    }
  }

  /**
   * 修复边的目标节点参数赋值
   * @param edge 边对象
   */
  fixEdgeTargetNode(edge: any) {
    const newSource = edge.getSourceCellId()
    const newTarget = edge.getTargetCellId()
    const newTargetPort = edge.getTargetPortId()
    const newTargetNode = this.workflowData.value.nodeList.find((n: any) => n.id === newTarget)

    if (newTargetNode && newTargetNode.inputData) {
      this.assignTargetNodeParameters(newTargetNode, newTargetPort, newSource)
    }
  }

  /**
   * 通过搜索的方式添加了新的节点，此时需要补充edge2并校验edge1和edge2
   * @param node 节点
   * @param edge 边
   */
  addNodeBySearch(node: any, edge: any) {
    if (this.searchTarget) {
      const targetNodeId = this.searchTarget.targetNodeId
      const targetPortId = this.searchTarget.targetPortId
      const edge2 = this.graph.addEdge({
        source: { cell: node.id, port: 'out_1' },
        target: { cell: targetNodeId, port: targetPortId }
      })

      this.graph.removeEdge(this.searchTarget.edgeId)
      this.fixEdgeTargetNode(edge2)
      this.fixEdgeTargetNode(edge)
    }
    this.searchTarget = null
  }

  private getCurType(typs: string[]) {
    return typs?.[1] || typs?.[0] || ''
  }

  /**
   * 检查是否有未修复的边
   * @returns 是否存在未修复的边
   */
  checkUnfixedEdges(): any[] {
    const errorEdges = this.graph.getEdges().filter((edge: any) => edge.hasCorrectionText)
    return errorEdges
  }

  // ==================== 类型验证相关方法 ====================

  /**
   * 处理类型不匹配的情况
   * @param edge 边对象
   * @param sourceNodeId 源节点ID
   * @param targetNodeId 目标节点ID
   */
  private handleTypeMismatch(edge: any, sourceType: string[][], targetType: string[][]) {
    // 设置错误样式
    this.setEdgeStyle(edge, this.edgeStyles.error)
    edge.hasCorrectionText = true

    // 显示错误消息
    this.showTypeMismatchError(edge, sourceType, targetType)
  }

  /**
   * 处理类型匹配的情况
   * @param edge 边对象
   * @param sourceNodeId 源节点ID
   * @param targetNodeId 目标节点ID
   */
  private handleTypeMatch(edge: any) {
    // 设置正常样式
    this.setEdgeStyle(edge, this.edgeStyles.normal)
  }

  /**
   * 显示类型不匹配错误消息
   * @param edge 边对象
   * @param sourceNodeId 源节点ID
   * @param targetNodeId 目标节点ID
   */
  private showTypeMismatchError(edge: any, sourceTypes: string[][], targetTypes: string[][]) {
    // 获取源节点和目标节点信息
    const sourceType = sourceTypes[0]
    const targetType = targetTypes[0]
    const sourceNodeId = edge.getSourceCellId()
    const sourcePortId = edge.getSourcePortId()
    const targetNodeId = edge.getTargetCellId()
    const targetPortId = edge.getTargetPortId()
    const sourceSubType = this.getCurType(sourceType)
    const targetSubType = this.getCurType(targetType)

    const isAutoAddMidCheck = this.contentAutoAddMidCheck(
      sourceSubType,
      targetSubType,
      targetNodeId,
      targetPortId,
      edge,
      sourceNodeId,
      sourcePortId
    )
    if (isAutoAddMidCheck) {
      return
    }

    // 生成错误键，避免重复显示
    const errorKey = this.generateErrorKey(edge)
    // 检查是否已经显示过这个错误
    if (!this.typeErrorMap.has(errorKey)) {
      this.typeErrorMap.set(errorKey, true)
      const sourceTypeText = `${sourceType[0]}${sourceType?.[1] || ''}`
      const targetTypesText = `${targetType[0]}${targetType?.[1] || ''}`
      this.displayErrorMessage(sourceTypeText, targetTypesText)
    }
  }

  private autoAddConverCheck(
    sourceSubType: string,
    targetSubType: string,
    targetId: string,
    targetPortId: string,
    sourceId: string
  ) {
    // 如果类型是否相同，是则 不自动添加数据转换节点
    if (sourceSubType == targetSubType) return false
    // 如果目标节点是否有数据 如果有则不自动添加数据转换节点
    const otherEdge = this.workflowData.value.edges.find(
      n => n.target === targetId && n.targetPort === targetPortId && n.source != sourceId
    )
    if (otherEdge) {
      return false
    }
    // 如果目标节点只有一个端口，则不自动添加数据转换节点
    const targetNode = this.workflowData.value.nodeList.find(n => n.id === targetId)
    if (targetNode && targetNode.inputData.length == 1) {
      return false
    }
    const sourceCount = sourceSubType.split('[]').length
    const targetCount = targetSubType.split('[]').length
    // 如果类型数量相差大于1，则不自动添加数据转换节点
    if (Math.abs(sourceCount - targetCount) > 1) {
      return false
    }
    // 如果类型是自动列表中的类型，则自动添加数据转换节点
    if (
      (this.autoList1.includes(sourceSubType) && this.autoList1.includes(targetSubType)) ||
      (this.autoList2.includes(sourceSubType) && this.autoList2.includes(targetSubType)) ||
      (this.autoList3.includes(sourceSubType) && this.autoList3.includes(targetSubType))
    ) {
      return true
    }
    return false
  }

  // 连接成功后，校验是否需要自动补充数据转换节点
  private midNodeCheck(
    sourceNodeId: string,
    sourcePortId: string,
    targetNodeId: string,
    targetPortId: string,
    edge: any,
    targetType: string[][]
  ) {
    // 获取真正的sourceType
    const realSourceType = this.getRealSourceType(sourceNodeId, targetNodeId, targetPortId)
    if (realSourceType) {
      const targetSubType = this.getCurType(targetType?.[0] || [])
      // 校验是否需要增加数据转换节点
      this.contentAutoAddMidCheck(
        realSourceType,
        targetSubType,
        targetNodeId,
        targetPortId,
        edge,
        sourceNodeId,
        sourcePortId
      )
    }
  }

  private getRealSourceType(sourceNodeId: string, targetNodeId: string, targetPortId: string) {
    const sourceNode = this.workflowData.value.nodeList.find(n => n.id === sourceNodeId)
    if (sourceNode.funcType === 'logic' && sourceNode.logicData?.logicType === LogicType.IFELSE) {
      // 如果上游节点是条件节点，也需要校验一下是否需要自动补充数据转换节点
      const targetNode = this.workflowData.value.nodeList.find(n => n.id === targetNodeId)
      let realSourceId = ''
      targetNode.inputData.forEach(p => {
        if (p.portId === targetPortId) {
          realSourceId = p.source
        }
      })
      // 找到真正的源节点
      const realSourceNode = this.workflowData.value.nodeList.find(n => n.id === realSourceId)
      if (realSourceNode) {
        const realSourceType = this.getNodePortType(realSourceId, 'out_1', true)
        const sourceSubType = this.getCurType(realSourceType?.[0] || [])
        return sourceSubType
      }
    }
    return ''
  }

  // 当类型不匹配 且自动添加升维或降维的逻辑处理
  private contentAutoAddMidCheck(
    sourceSubType: string,
    targetSubType: string,
    targetNodeId: string,
    targetPortId: string,
    edge: any,
    sourceNodeId: string,
    sourcePortId: string
  ) {
    if (
      this.autoAddConverCheck(
        sourceSubType,
        targetSubType,
        targetNodeId,
        targetPortId,
        sourceNodeId
      )
    ) {
      // 自动生成中间转换类型
      console.log('自动生成中间转换类型')

      this.searchTarget = {
        targetNodeId: targetNodeId,
        targetPortId: targetPortId,
        edgeId: edge.id
      }

      return true
    }
    return false
  }

  /**
   * 显示错误消息
   * @param sourceTypeText 源类型文本
   * @param targetTypesText 目标类型文本
   */
  private displayErrorMessage(sourceTypeText: string, targetTypesText: string) {
    ElMessage({
      message: h('div', [
        h(
          'div',
          {
            style:
              'font-weight: bold; margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center;'
          },
          [
            h('span', '节点连接错误：没有找到匹配的类型'),
            h(
              'button',
              {
                style:
                  'background: none; border: none; cursor: pointer; color: #999; font-size: 20px; padding: 0; margin-left: 10px;',
                onClick: () => {
                  const messageEl = document.querySelector('.type-mismatch-error')
                  if (messageEl) {
                    messageEl.remove()
                  }
                }
              },
              '×'
            )
          ]
        ),
        h('div', { style: 'margin-bottom: 4px;' }, `上游出参的类型：${sourceTypeText}`),
        h('div', { style: 'margin-bottom: 4px;' }, `下游期望的类型：${targetTypesText}`)
      ]),
      type: 'error',
      duration: 0,
      showClose: false,
      customClass: 'type-mismatch-error'
    })
  }

  // ==================== 工具方法 ====================

  /**
   * 分配目标节点参数
   * @param targetNode 目标节点
   * @param targetPort 目标端口
   * @param sourceNodeId 源节点ID
   */
  private assignTargetNodeParameters(targetNode: any, targetPort: string, sourceNodeId: string) {
    const nodeConfig = getCustomNodeConfig(targetNode)
    const targetPortConfig = nodeConfig.ports.items.find(p => p.id === targetPort)
    const portTitle = targetPortConfig?.attrs?.text?.text || ''

    let found = false
    let targetParams: any[] = []

    if (portTitle === '默认' || portTitle === '') {
      targetParams = targetNode.inputData.filter((inp: any) => !inp.attributes?.paramGroup)
    } else {
      targetParams = targetNode.inputData.filter(
        (inp: any) => inp.attributes?.paramGroup === portTitle
      )
    }

    // 查找可赋值的参数
    for (const inp of targetParams) {
      if (inp.source === '' && inp.sourceType === 'node') {
        inp.source = sourceNodeId
        found = true
        break
      }
    }

    if (!found) {
      // const message = portTitle === '默认'
      //   ? '默认端口没有找到空闲的参数（跳过有参数组的参数）'
      //   : `参数组"${portTitle}"没有找到空闲的参数`
      // ElMessage.warning(message)
    }
  }

  /**
   * 生成错误键
   * @param edge 边对象
   * @returns 错误键
   */
  private generateErrorKey(edge: any): string {
    return `${edge.getSourceCellId()}:${edge.getSourcePortId()}-${edge.getTargetCellId()}:${edge.getTargetPortId()}`
  }

  /**
   * 设置边样式
   * @param edge 边对象
   * @param isError 是否为错误状态
   */
  private setEdgeStyle(edge: any, style: any) {
    edge.attr({ line: style }, { ignoreHistory: true })
    edge.attr(
      {
        targetMarker: {
          fill: style.stroke,
          stroke: style.stroke
        }
      },
      { ignoreHistory: true }
    )
  }

  /**
   * 获取节点端口类型
   * @param nodeId 节点ID
   * @param portId 端口ID
   * @param isSource 是否为源端口
   * @returns 端口类型
   */
  private getNodePortType(nodeId: string, portId: string, isSource: boolean): string[][] | undefined {
    const node = this.workflowData.value.nodeList.find(n => n.id === nodeId)
    if (!node) {
      return undefined
    }
    return ValidatorManager.getNodePortType(node, portId, isSource)
  }

  /**
   * 验证类型兼容性
   * @param sourceType 源类型
   * @param targetType 目标类型
   * @returns 是否兼容
   */
  private validateTypeCompatibility(sourceType: string[][], targetType: string[][]): boolean {
    return ValidatorManager.validateTypeCompatibility(sourceType[0], targetType)
  }
}
