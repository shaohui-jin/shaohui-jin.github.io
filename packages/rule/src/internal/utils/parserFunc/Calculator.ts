import { WorkflowNode } from '@/types/workflow'
import { CodeFactory } from '../factory/CodeFactory'

/**
 * 计算器代码生成器
 */
export class Calculator {
  constructor() {}

  public generateCode(
    node: WorkflowNode,
    indent: number,
    dataArray: Array<{ key: string; value: string }>
  ): string {
    let code = ''

    // 获取输入参数
    const resultParam = node.outputData[0].functionCode

    if (!resultParam) {
      code += `\n${CodeFactory.indent(indent)}-- 错误：节点 ${
        node.id
      } 缺少必要的输出参数 ------------------\n\n`
      return code
    }
    // 生成自身变量名
    const resultVar = CodeFactory.getNodeVarName(node)
    // 表达式变量名
    const expressionVar = CodeFactory.getFuncVarName(node)

    let resStr = dataArray.map(e => e.value).join(', ')

    code += `${CodeFactory.indent(indent)}${resultVar} = ${expressionVar}(${resStr}) \n`
    code += `${CodeFactory.indent(indent)}log("计算器：获取节点 ${node.id} 的结果", ${resultVar})\n`

    return code
  }
}
