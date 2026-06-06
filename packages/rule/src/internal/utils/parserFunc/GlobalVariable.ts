import { WorkflowNode } from '@/types/workflow'
import { CodeFactory } from '../factory/CodeFactory'
import { AnalyzerManager } from '@/utils/manager/AnalyzerManager'

export class GlobalVariable {
  constructor() {}

  // 生成全局变量节点代码
  public generateCode(node: WorkflowNode, indent: number, analyzer: AnalyzerManager): string {
    let code = ''

    // 获取输入参数
    const nodeIdParam = node.inputData?.find(input => input.paramName === 'nodeId')

    if (!nodeIdParam) {
      return code
    }

    const resultVar = CodeFactory.getNodeVarName(node)
    const targetNodeId = nodeIdParam.source || nodeIdParam.defaultValue
    const targetNode = analyzer.getNodeById(targetNodeId)
    if (!targetNode) {
      return code
    }

    code += `${CodeFactory.indent(indent)}${resultVar} = ${CodeFactory.getNodeVarName(
      targetNode
    )}\n`
    code += `${CodeFactory.indent(indent)}log("全局变量：获取节点 ${
      node.id
    } 的结果", ${resultVar})\n`

    return code
  }
}
