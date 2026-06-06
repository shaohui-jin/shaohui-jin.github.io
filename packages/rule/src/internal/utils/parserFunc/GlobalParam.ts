import { WorkflowNode } from '@/types/workflow'
import { CodeFactory } from '../factory/CodeFactory'

export class GlobalParam {
  constructor() {}

  // 生成全局参数节点代码
  public generateCode(node: WorkflowNode, indent: number): string {
    let code = ''

    // 获取全局参数类型
    const globalParamType = this.getGlobalParamType(node)
    if (!globalParamType) {
      return code
    }

    // 生成直接赋值代码
    const resultVar = CodeFactory.getNodeVarName(node)

    code += `${CodeFactory.indent(indent)}${resultVar} = ${globalParamType}\n`
    code += `${CodeFactory.indent(indent)}log("全局参数：获取节点 ${
      node.id
    } 的结果", ${resultVar})\n`

    return code
  }

  // 获取全局参数类型
  private getGlobalParamType(node: WorkflowNode): string | null {
    // 从inputData中获取
    // const inputParam = node.inputData?.find(input => input.paramName === 'paramType')
    // if (inputParam?.source && ['root', 'target', 'context'].includes(inputParam.source)) {
    //   return inputParam.source
    // }
    // return 'root'
    return node.inputData[0].source
  }
}
