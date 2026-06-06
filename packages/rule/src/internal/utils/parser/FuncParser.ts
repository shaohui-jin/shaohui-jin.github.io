import { InputData, WorkflowNode } from '@/types/workflow'
import { isCalculatorNode, isIfElseNode } from '@/utils/common/NodeType'

/**
 *  从工作流节点列表中提取和组织功能代码。
 *  If Else 和 计算器节点，它从`outputData`中提取`functionCode`。
 *  对于其他类型的节点，它会进行筛选`inputData`用于查找类型或widgetType为'function'的元素，然后提取`source`代码
 *
 * @param {WorkflowNode[]} nodeList -表示工作流中节点的WorkflowNode对象数组。
 * @returns {{codeMap: Record<string, string>}} - 包含连接的节点和端口ID到各自函数代码的映射。
 */
export const getFunctionCode = (nodeList: WorkflowNode[]) => {
  const codeMap: Record<string, string> = {}

  nodeList.forEach((node: WorkflowNode) => {
    if (isIfElseNode(node)) {
      node.outputData.forEach((e, i, arr) => {
        if (i !== arr.length - 1) {
          codeMap[`${node.id}_${e.portId}`] = e.functionCode ?? ''
        }
      })
    } else if (isCalculatorNode(node)) {
      node.outputData.forEach((e, i, arr) => {
        codeMap[`${node.id}_${e.portId}`] = e.functionCode ?? ''
      })
    } else {
      node.inputData
        .filter(e => e.type === 'function' || e.widgetType === 'function')
        .forEach((e: InputData) => {
          codeMap[`${node.id}_${e.portId}`] = e.source
        })
    }
  })
  console.log('codeMap', codeMap)

  return { codeMap }
}
