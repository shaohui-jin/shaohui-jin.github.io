import { WorkflowNode } from '@/types/workflow'
import { isIfElseNode } from '@/utils/common/NodeType'

export class CodeFactory {
  // 创建代码模板类
  private static indentCache = new Map<number, string>()
  public static functionPrefix = `function`

  static indent(level: number): string {
    if (!this.indentCache.has(level)) {
      this.indentCache.set(level, '\t'.repeat(level))
    }
    return this.indentCache.get(level)!
  }

  static getNodeVarName(node: WorkflowNode): string {
    return isIfElseNode(node) ? `tempResult_${node.id}` : `result_${node.id}`
  }

  static getFuncVarName(node: WorkflowNode, inOrOut: 'in' | 'out' = 'out', port = 1): string {
    return `${this.functionPrefix}_${node.id}_${inOrOut}_${port}`
  }
}
