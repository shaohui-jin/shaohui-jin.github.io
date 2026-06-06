import { Node } from '@antv/x6'
import { LogicType, WorkflowNode } from '@/types/workflow'

// 判断是否自定义
export const isCustom = (node: Node) => {
  return node.shape === 'customNode'
}

// 判断是否 ifelse
export const isIfElseNode = (node: WorkflowNode): boolean => {
  return node && node.funcType === 'logic' && node.logicData?.logicType === LogicType.IFELSE
}

export const isCalculatorNode = (node: WorkflowNode): boolean => {
  return node && node.funcType === 'logic' && node.logicData?.logicType === LogicType.CALCULATOR
}
