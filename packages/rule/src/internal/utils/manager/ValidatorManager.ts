import { InputData, LogicType, WorkflowNode, type WorkflowData } from '@/types/workflow'

/**
 * 错误信息接口
 */
export interface ValidationError {
  nodeId: string
  nodeTitle: string
  errors: string[]
  type: 'workflow' | 'edge'
}

export class ValidatorManager {
  private workflowData: WorkflowData
  private errors: ValidationError[] = []
  private warnings: string[] = []

  constructor(workflowData: WorkflowData) {
    this.workflowData = workflowData
  }

  /**
   * 执行所有校验规则
   */
  public validate(): { isValid: boolean; errors: ValidationError[]; warnings: string[] } {
    this.errors = []
    this.warnings = []

    // 预计算一些常用数据，避免重复计算
    const allNodeIds: string[] = []
    this.workflowData.nodeList.forEach(node => {
      allNodeIds.push(node.id)
    })

    const edgesByTarget = new Map<string, any[]>()
    const edgesBySource = new Map<string, any[]>()

    // 构建边的索引，提高查找效率
    this.workflowData.edges.forEach(edge => {
      // 按目标节点分组
      if (!edgesByTarget.has(edge.target)) {
        edgesByTarget.set(edge.target, [])
      }
      edgesByTarget.get(edge.target)!.push(edge)

      // 按源节点分组
      if (!edgesBySource.has(edge.source)) {
        edgesBySource.set(edge.source, [])
      }
      edgesBySource.get(edge.source)!.push(edge)
    })

    // 在一个循环中执行所有校验规则
    this.workflowData.nodeList.forEach(node => {
      this.validateNodeInputCount(node, allNodeIds)
      this.validateParameterTypes(node)
      this.validateConditionNode(node, edgesBySource)
      this.validateIsolatedNodes(node, edgesByTarget, edgesBySource)
      this.validateGlobalVariableReferences(node, allNodeIds)
    })

    return {
      isValid: this.errors.length === 0,
      errors: this.errors,
      warnings: this.warnings
    }
  }

  /**
   * 校验节点入参数量是否匹配
   * 规则：连接到当前节点的边的数量 + 当前数据源类型是input的数量 = 节点入参数量
   * 当实际数量小于预期数量时为错误，大于预期数量时为警告
   */
  private validateNodeInputCount(node: WorkflowNode, allNodeIds: string[]): void {
    if (!node.inputData) return
    if (
      node.funcType === 'logic' &&
      (node.logicData?.logicType === LogicType.IFELSE ||
        node.logicData?.logicType === LogicType.GLOBAL_VARIABLE ||
        node.logicData?.logicType === LogicType.GLOBAL_PARAM)
    )
      return

    const nodeErrors: string[] = []

    node.inputData.forEach(param => {
      if (param.sourceType === 'node') {
        if (!param.source) {
          nodeErrors.push(`入参${this.getParamName(param)}未设置数据源`)
        } else if (!allNodeIds.includes(param.source)) {
          nodeErrors.push(`入参${this.getParamName(param)}数据源节点不存在`)
        }
      }
    })

    if (nodeErrors.length > 0) {
      this.errors.push({
        nodeId: node.id,
        nodeTitle: node.title || node.id,
        errors: nodeErrors,
        type: 'workflow'
      })
    }
  }

  /**
   * 校验参数类型是否匹配
   * 规则：根据实际的每个入参对应的节点的返回值和当前入参的参数类型做匹配
   */
  private validateParameterTypes(node: WorkflowNode): void {
    if (!node.inputData) return
    if (node.funcType === 'logic') return

    const nodeErrors: string[] = []

    node.inputData.forEach(param => {
      if (param.sourceType === 'node' && param.source) {
        // 找到源节点
        const sourceNode = this.workflowData.nodeList.find(n => n.id === param.source)
        if (!sourceNode) return

        // 找到对应的边
        const edge = this.workflowData.edges.find(
          e => e.source === param.source && e.target === node.id
        )
        if (!edge) return

        // 找到源节点的输出参数
        const sourceOutput = sourceNode.outputData?.find(out => out.portId === edge.sourcePort)
        if (!sourceOutput) return

        // 校验类型是否匹配
        if (
          sourceOutput.type !== param.type &&
          sourceOutput.type != 'any' &&
          param.type != 'any' &&
          sourceOutput.subType != 'any'
        ) {
          nodeErrors.push(`入参${this.getParamName(param)}类型不符`)
        }
      }
    })

    if (nodeErrors.length > 0) {
      this.errors.push({
        nodeId: node.id,
        nodeTitle: node.title || node.id,
        errors: nodeErrors,
        type: 'workflow'
      })
    }
  }

  /**
   * 校验条件函数的问题
   * 规则：
   * 1. 条件函数的每个出参都必须连接到其他节点
   * 2. logicData.source不能为空
   * 3. outputData每项的source不能为空
   */
  private validateConditionNode(node: WorkflowNode, edgesBySource: Map<string, any[]>): void {
    if (node.funcType === 'logic' && node.logicData?.logicType === LogicType.IFELSE) {
      const nodeErrors: string[] = []

      // 校验校验节点入参值
      node.inputData.forEach(param => {
        if (param.sourceType === 'node' && !param.source) {
          nodeErrors.push(`入参${this.getParamName(param)}未设置数据源`)
        }
      })

      // 校验每个分支的出参是否连接到其他节点
      node.outputData?.forEach(output => {
        const connectedEdges = edgesBySource.get(node.id) || []
        const hasConnection = connectedEdges.some(edge => edge.sourcePort === output.portId)
        if (!hasConnection) {
          nodeErrors.push(`条件分支${output.portId}未连接`)
        }
      })

      // 校验outputData每项的functionCode，最后一个分支（else）跳过
      if (Array.isArray(node.outputData)) {
        node.outputData.forEach((out, idx) => {
          if (idx < node.outputData.length - 1) {
            if (!out.functionCode || out.functionCode === '') {
              nodeErrors.push(`分支${idx + 1}条件未设置`)
            }
          }
        })
      }

      if (nodeErrors.length > 0) {
        this.errors.push({
          nodeId: node.id,
          nodeTitle: node.title || node.id,
          errors: nodeErrors,
          type: 'workflow'
        })
      }
    }
  }

  /**
   * 校验孤立节点
   * 规则：如果一个节点与其他节点都没有边的关系，则报错
   */
  private validateIsolatedNodes(
    node: WorkflowNode,
    edgesByTarget: Map<string, any[]>,
    edgesBySource: Map<string, any[]>
  ): void {
    const hasIncomingConnections = (edgesByTarget.get(node.id) || []).length > 0
    const hasOutgoingConnections = (edgesBySource.get(node.id) || []).length > 0

    if (!hasIncomingConnections && !hasOutgoingConnections) {
      this.errors.push({
        nodeId: node.id,
        nodeTitle: node.title || node.id,
        errors: ['该节点为孤立节点'],
        type: 'workflow'
      })
    }
  }

  /**wo
   * 校验全局变量节点引用的节点ID是否存在
   * 规则：全局变量节点引用的节点ID必须在当前工作流中存在
   */
  private validateGlobalVariableReferences(node: WorkflowNode, allNodeIds: string[]): void {
    if (node.funcType === 'logic' && node.logicData?.logicType === LogicType.GLOBAL_VARIABLE) {
      // 获取全局变量节点的nodeId参数
      const nodeIdParam = node.inputData?.find(input => input.paramName === 'nodeId')
      if (nodeIdParam) {
        const targetNodeId = nodeIdParam.source || nodeIdParam.defaultValue
        if (targetNodeId && !allNodeIds.includes(targetNodeId)) {
          this.errors.push({
            nodeId: node.id,
            nodeTitle: node.title || node.id,
            errors: [`引用的节点ID:${targetNodeId}不存在`],
            type: 'workflow'
          })
        } else if (!targetNodeId) {
          this.errors.push({
            nodeId: node.id,
            nodeTitle: node.title || node.id,
            errors: ['引用的节点ID未设置'],
            type: 'workflow'
          })
        }
      }
    }
  }

  private getParamName(param: InputData): string {
    if (param.attributes && param.attributes.label) {
      return `[${param.attributes.label}]`
    }
    return `[${param.paramName}]`
  }

  // 获取节点端口类型
  static getNodePortType(node: WorkflowNode, portId: string, isSource: boolean): string[][] | undefined {
    if (isSource) {
      // 如果是获取当前节点的出参
      const port = node.outputData?.find(p => p.portId === portId)
      if (!port) {
        return undefined
      }
      if (!port.type) {
        return undefined
      }
      return [[port.type, port.subType]]
    } else {
      // 如果是获取当前节点的入参
      const port = node.inputData?.find(p => p.portId === portId)
      if (!port) {
        return undefined
      }
      if (!port.type) {
        return undefined
      }
      return [[port.type, port.subType]]

      // if (!node.inputData || !Array.isArray(node.inputData)) {
      //   return undefined
      // }
      // const params = node.inputData.map(p => {
      //   if (!p.type) {
      //     return ['string', null] // 默认类型
      //   }
      //   return [p.type, p.subType]
      // })
      // return params
    }
  }

  /**
   * 提取自定义类型
   * @param subType 子类型字符串
   * @returns 包含原始类型和提取的自定义类型的对象
   */
  static extractCustomSubType(subType: string): { original: string; custom: string | null } {
    if (!subType) {
      return { original: subType, custom: null }
    }

    // 检查是否包含自定义类型结构
    const hasObjectType = subType.includes('}')
    const hasArraySuffix = subType.includes('[]')

    if (!hasObjectType && !hasArraySuffix) {
      // 没有 {} 和 []，整个字符串就是自定义类型
      return { original: subType, custom: subType }
    }

    if (hasObjectType) {
      // 有 {}，提取 } 后面的部分
      const objectEndIndex = subType.lastIndexOf('}')
      if (objectEndIndex !== -1) {
        const afterObject = subType.substring(objectEndIndex + 1)
        if (afterObject && afterObject !== '[]') {
          // 提取自定义类型名（保留 [] 后缀）
          return { original: subType, custom: afterObject }
        }
      }
    }

    if (!hasObjectType && hasArraySuffix) {
      // 只有 []，提取 [] 前面的部分
      const arrayStartIndex = subType.indexOf('[]')
      if (arrayStartIndex !== -1) {
        const beforeArray = subType.substring(0, arrayStartIndex)
        if (beforeArray) {
          return { original: subType, custom: subType }
        }
      }
    }

    // 没有检测到自定义类型结构，返回原始类型
    return { original: subType, custom: null }
  }

  /**
   * 校验类型是否兼容
   * @param sourceType 源节点的出参（限定一个 如果是多个出参  应该是多个port 这里直接给具体那个port的类型1）
   * @param targetType 目标节点的所有入参
   * @returns 是否兼容
   */
  static validateTypeCompatibility(sourceType: string[], targetType: string[][]): boolean {
    const mainType = sourceType[0]
    const subType = sourceType[1]

    // 提取自定义类型
    const sourceTypeInfo = this.extractCustomSubType(subType)
    const effectiveSubType = sourceTypeInfo.custom || sourceTypeInfo.original

    // 主对象为任意类型 则都可以连
    if (
      mainType === 'any' ||
      (effectiveSubType && (effectiveSubType === 'any' || effectiveSubType.includes('any[')))
    ) {
      return true
    }

    // 遍历目标类型，只要有一个满足条件就返回true
    for (let i = 0; i < targetType.length; i++) {
      const targetMainType = targetType[i][0]
      const targetSubType = targetType[i][1]

      // 提取目标类型的自定义类型
      const targetTypeInfo = this.extractCustomSubType(targetSubType)
      const effectiveTargetSubType = targetTypeInfo.custom || targetTypeInfo.original

      return ValidatorManager.compareType(
        mainType,
        effectiveSubType,
        targetMainType,
        effectiveTargetSubType
      )
    }
    return false
  }

  static compareType(
    sourceType: string,
    sourceSubType: string,
    targetType: string,
    targetSubType: string
  ): boolean {
    // 主类型为任意类型 则都可以连
    if (sourceType === 'any' || targetType === 'any') return true
    // 子类型为任意类型 则都可以连
    if (sourceSubType === 'any' || targetSubType === 'any') return true
    // 子类型为任意数组 则任意数组都可以连
    if (
      sourceSubType &&
      targetSubType &&
      ((sourceSubType.includes('any[') && targetSubType.includes('[]')) ||
        (targetSubType.includes('any[') && sourceSubType.includes('[]')))
    ) {
      return true
    }
    // table类型需要校验subType类型
    if (sourceType === 'table' && targetType === 'table') {
      if (sourceSubType === targetSubType) return true
    } else {
      // 其他类型直接比较mainType
      if (sourceType === targetType) return true
    }

    return false
  }
}
