import nodeIdFactory from './NodeIdFactory'
import { type WorkflowNode, LogicType, GroupNodeData } from '@/types/workflow'
import { CustomNode, getCustomNodeConfig } from '@/utils/manager/CustomNodeManager'

export const createNewNode = (nodeData: WorkflowNode): CustomNode | WorkflowNode => {
  const newId = nodeIdFactory.next()
  // 创建新的节点数据
  const newNodeData: WorkflowNode = {
    ...nodeData,
    id: newId,
    pos: {
      x: nodeData.pos?.x || 0,
      y: (nodeData.pos?.y || 0) + 120
    },
    inputData: (nodeData.inputData ?? []).map(input => ({
      ...input,
      source: input.sourceType === 'node' ? '' : input.source
    }))
  }

  // 使用NodeFactory创建X6节点
  return createX6Node(newNodeData)
}

// 创建函数节点
export function createFuncNode(funcMeta: any): WorkflowNode {
  return {
    id: nodeIdFactory.next(),
    funcType: 'func',
    funcId: funcMeta.funcId,
    title: funcMeta.title || funcMeta.label,
    inputData: (funcMeta.inputData?.widgetList || []).map((widget: any, idx: number) => ({
      paramName: widget.id,
      type: widget.attributes.paramType, //参数类型
      subType: widget.attributes.paramSubType, //参数子类型
      widgetType: widget.type, //控件类型
      source: ['table', 'any'].includes(widget.attributes.paramType) ? '' : widget.defaultValue,
      sourceType:
        ['table', 'any'].includes(widget.attributes.paramType) && !widget.attributes.multiple
          ? 'node'
          : 'input',
      portId: `in_${idx + 1}`,
      defaultValue: widget.defaultValue,
      options: widget.options,
      rules: widget.rules, // 规则 是否必须
      attributes: widget.attributes // 属性
    })),
    outputData: (funcMeta.outputData?.widgetList || []).map((widget: any, idx: number) => ({
      paramName: widget.id,
      type: widget.attributes.paramType,
      subType: widget.attributes.paramSubType,
      widgetType: widget.type,
      portId: `out_${idx + 1}`,
      defaultValue: widget.defaultValue,
      options: widget.options,
      rules: widget.rules,
      attributes: widget.attributes
    })),
    pos: { x: 100, y: 100 },
    remark: funcMeta.remark || ''
  } as WorkflowNode
}

/**
 * 创建X6节点
 * @param nodeData 节点数据
 * @param isPreview 是否为预览节点
 * @returns X6节点实例
 */
export const createX6Node = (nodeData: WorkflowNode, isPreview = false): CustomNode => {
  const config = getCustomNodeConfig(nodeData)
  console.log('createX6Node', nodeData, '转换后', config)
  const rectNode = new CustomNode({
    ...config,
    x: isPreview ? 0 : config.x || 0,
    y: isPreview ? 0 : config.y || 0
  })
  // console.log('rectNode====', config, nodeData)
  if (nodeData.isCollapsed) {
    rectNode.toggleCollapse()
  }
  return rectNode
}

export {}
