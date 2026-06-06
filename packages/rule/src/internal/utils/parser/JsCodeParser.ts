import { LogicType, WorkflowData, WorkflowNode } from '@/types/workflow'
import { AnalyzerManager } from '../manager/AnalyzerManager'
import { GlobalParam } from '../parserFunc/GlobalParam'
import { Calculator } from '../parserFunc/Calculator'
import { GlobalVariable } from '../parserFunc/GlobalVariable'
import { BranchInfo, NodeAnalysis } from '@/types/JsCodeParser'
import { CodeFactory } from '../factory/CodeFactory'
import { isIfElseNode } from '@/utils/common/NodeType'
import { getFunctionCode } from '@/utils/parser/FuncParser'

// 模块信息接口
interface ModuleInfo {
  path: string
  name: string
  func: string
}

// 代码生成器类
export class JsCodeParser {
  private workflow!: WorkflowData
  private funcData: any
  private modules: Map<string, ModuleInfo>
  private codeMap!: Record<string, string>
  private analyzer!: AnalyzerManager
  private nodeAnalysis!: Map<string, NodeAnalysis>
  private branchInfoMap!: Map<string, BranchInfo>
  private executionOrder: string[] = []

  // 不同节点类型
  private calculator: Calculator
  private globalParam: GlobalParam
  private globalVariable: GlobalVariable

  private hasDiffMerge = false

  private isGenerateTestLuaScript: boolean = true

  constructor() {
    const paramNameResolverFunc = (nodeId: string, branchContext?: any) =>
      this.getArgParamNameForLogic(nodeId, branchContext)

    this.globalParam = new GlobalParam()
    this.globalVariable = new GlobalVariable()
    this.calculator = new Calculator()

    this.modules = new Map()
  }

  public generate(workflow: WorkflowData, funcData: any): string {
    this.clear()
    this.workflow = workflow
    this.funcData = funcData
    this.codeMap = getFunctionCode(workflow.nodeList).codeMap
    this.analyzer = new AnalyzerManager(workflow)
    const analysisResult = this.analyzer.analyze()
    this.nodeAnalysis = analysisResult.nodeAnalysis
    this.branchInfoMap = analysisResult.branchInfoMap
    this.executionOrder = analysisResult.executionOrder
    const code = this.doGenerate()
    this.clear()
    return code
  }

  private clear() {
    this.funcData = null
    this.modules.clear()
    this.executionOrder = []
    if (this.nodeAnalysis) this.nodeAnalysis.clear()
    if (this.branchInfoMap) this.branchInfoMap.clear()
    if (this.analyzer) this.analyzer.clear()
    this.hasDiffMerge = false
  }

  // 生成完整的 Lua 代码
  private doGenerate(): string {
    // 1. 收集模块信息
    this.collectModules()

    // 2. 生成代码
    let code = ''
    code += this.generateModuleDeclarations()
    code += this.generateFunctionCode()
    code += `const doWork = (root, context) => {\n`
    code += this.generateVariableDeclarations()
    code += this.generateMainFlow()
    code += this.generateReturnStatement()
    code += '}\n'

    return code
  }

  // 收集所有需要的模块信息
  private collectModules(): void {
    this.workflow.nodeList.forEach(node => {
      if (node.funcId) {
        const funcInfo = this.funcData.find((f: any) => f.funcId == node.funcId)
        if (funcInfo) {
          const moduleKey = `${funcInfo.path}/${funcInfo.className}`
          this.modules.set(moduleKey, {
            path: funcInfo.path,
            name: funcInfo.className,
            func: funcInfo.funcName
          })
        }
      }
    })
  }

  // 生成模块声明和导入
  private generateModuleDeclarations(): string {
    let code = '\n// 声明函数通用日志模块\n'

    // 加测试模块工具方法
    code += `const log = console.log\n`
    code += `const warn = console.warn\n`
    code += `const error = console.error\n`

    code += '\n'
    return code
  }

  // 函数提取到最外面
  private generateFunctionCode(): string {
    let code = '// 声明表达式所有变量\n'
    Object.keys(this.codeMap).forEach(key => {
      const nodeId = key.split('_')[0]
      const node = this.analyzer.getNodeById(nodeId)

      const dataArray = this.getNodeIncomingEdges(nodeId)
      // 如果有data 就当做全部都是有前缀的
      const funcTarget = this.codeMap[key].includes('data')
        ? dataArray.map(e => e.key).join(', ')
        : 'data'
      const levelOne = '\n  '
      const levelTwo = '\n    '
      // if else 不需要采用自闭函数
      if (isIfElseNode(node)) {
        code += `const ${CodeFactory.functionPrefix}_${key} = (${funcTarget}) => {${levelOne} return ${this.codeMap[key]} \n}`
      } else {
        const funcCode = this.codeMap[key].trim()
          ? `return (${this.codeMap[key]
              .trim()
              .split('\n')
              .map(e => levelTwo + e)
              .join('')}${levelOne})(${funcTarget})`
          : `return ''`
        code += `const ${CodeFactory.functionPrefix}_${key} = (${funcTarget}) => {${levelOne}${funcCode} \n}`
      }

      code += '\n\n'
    })
    return code
  }

  // 生成变量声明
  private generateVariableDeclarations(): string {
    let code = '\t// 声明所有变量\n'

    // 使用 Set 来存储已声明的变量，避免重复
    const declaredVars = new Set<string>()

    // 声明主流程节点变量
    this.workflow.nodeList.forEach(node => {
      const varName = isIfElseNode(node) ? `tempResult_${node.id}` : `result_${node.id}`

      if (!declaredVars.has(varName)) {
        // if else默认是any类型，其他的获取返回参数的第一项的值
        code += `\tlet ${varName} = null\n`
        declaredVars.add(varName)
      }

      // 在测试模式下，为函数节点添加错误变量声明
      // if (this.isGenerateTestLuaScript && node.funcType === 'func') {
      //   const errorVarName = `error_${node.id}`
      //   if (!declaredVars.has(errorVarName)) {
      //     code += `\tlocal ${errorVarName}\n`
      //     declaredVars.add(errorVarName)
      //   }
      // }
    })

    // 添加分支执行标志声明
    // const flagDeclarations = this.analyzer.getFlagDeclarations()
    // if (flagDeclarations.length > 0) {
    //   this.hasDiffMerge = true
    //   code += '\n\t-- 分支执行标志\n'
    //   flagDeclarations.forEach(flagVar => {
    //     code += `\tlocal ${flagVar} = false\n`
    //   })
    // }

    // 添加不同源汇合点标志声明
    // const mergeDeclarations = this.analyzer.getMergeDeclarations()
    // if (mergeDeclarations.length > 0) {
    //   code += '\n\t-- 不同源汇合点标志\n'
    //   mergeDeclarations.forEach(mergeVar => {
    //     code += `\tlocal ${mergeVar} = false\n`
    //   })
    // }

    code += '\n'
    return code
  }

  // 生成主流程代码（顺序遍历 nodeList，按类型/层级/分支信息生成结构）
  private generateMainFlow(): string {
    let code = ''
    let diffMergeCount = 0

    for (const nodeId of this.executionOrder) {
      const analysis = this.nodeAnalysis.get(nodeId)
      if (!analysis) continue
      if (analysis.level === 0) {
        // 只生成主流程起点节点
        const node = this.analyzer.getNodeById(nodeId)
        if (node) {
          code += this.generateNodeCode(node, 1, new Set())
        }
      } else if (analysis.level === 1) {
        // 汇合节点特殊处理
        if (this.analyzer.isDifferentMerge(nodeId)) {
          code += this.generateDifferentSourceMergeBlock(nodeId, diffMergeCount)
          diffMergeCount++
        }
      }
    }
    return code
  }

  // 获取上有节点输入映射
  private getNodeIncomingEdges(nodeId: string): Array<{ key: string; value: string }> {
    // 基于 edges 查找所有上游节点
    const incomingEdges = (this.workflow.edges || []).filter(edge => edge.target === nodeId)
    if (!incomingEdges.length) {
      console.warn(`[LuaGen] 节点 ${nodeId} 没有找到输入节点`)
      return []
    }

    // 按 edges 顺序收集 source 节点 id
    const sourceIds = incomingEdges.map(edge => edge.source)
    const resultVars: string[] = []
    // 支持嵌套ifelse的场景
    sourceIds.forEach(id => {
      const resolvedSourceIds = this.resolveParamSourceAll(id)
      resolvedSourceIds.forEach(sourceId => {
        const node = this.analyzer.getNodeById(sourceId)
        resultVars.push(CodeFactory.getNodeVarName(node))
      })
    })

    // 构建 rst/rst1/rst2... 到 resultVar 的映射
    const dataArray: Array<{ key: string; value: string }> = []
    resultVars.forEach((v, idx) => {
      const key = idx === 0 ? 'data' : `data${idx}`
      dataArray.push({ key, value: v })
    })
    return dataArray
  }

  // 生成条件表达式
  private generateConditionExpression(
    logicNode: WorkflowNode,
    outputIndex = 0,
    logicId,
    dataArray: Array<{ key: string; value: string }>
  ): string {
    try {
      // 获取指定索引的 outputData
      const output = logicNode.outputData?.[outputIndex]
      if (!output?.functionCode) {
        return 'true' // 对于 else 分支，返回 true
      }

      return `function_${logicId}_${output.portId}(${dataArray.map(e => e.value).join(', ')})`
    } catch (error) {
      console.error('[LuaGen] 生成条件表达式失败:', error)
      return ''
    }
  }

  // 生成 if-else 结构体
  private generateIfElseBlock(
    node: WorkflowNode,
    indent: number,
    generated: Set<string>,
    dataArray: Array<{ key: string; value: string }>,
    _branchContext?: any
  ): string {
    try {
      const logicId = node.id
      let code = `${CodeFactory.indent(indent)}// 条件分支 ${logicId}\n`

      // 获取当前逻辑节点的所有分支
      const branchList: Array<BranchInfo & { branchId: string }> = []
      this.branchInfoMap.forEach((branch, branchId) => {
        if (branchId.split('_')[0] === logicId) {
          branchList.push({ ...branch, branchId })
        }
      })
      const _indent = CodeFactory.indent(indent)
      // 生成分支结构
      branchList.forEach((branch, idx) => {
        const output = node.outputData[idx]
        if (!output) return

        let _code = `function_${logicId}_${output.portId}(${dataArray
          .map(e => e.value)
          .join(', ')})`

        // 生成条件语句
        if (branch.branchType === 'if') {
          code += `${_indent}if (${_code}) {\n`
        } else if (branch.branchType === 'elseif') {
          code += `${CodeFactory.indent(indent)}} else if (${_code}) {\n`
        } else {
          code += `${CodeFactory.indent(indent)}} else {\n`
        }

        // 处理分支内的节点（分支感知）
        branch.nodes.forEach((nid: string) => {
          const branchNode = this.analyzer.getNodeById(nid)
          if (branchNode) {
            code += this.generateNodeCode(branchNode, indent + 1, generated, branch)
          }
        })

        // 分支执行标志赋值
        // if (this.hasDiffMerge) {
        //   const flagVar = `flag_${branch.branchId}`
        //   code += `${CodeFactory.indent(indent + 1)}${flagVar} = true\n`
        // }
        console.log('branch', branch)
        // 分支出口赋值
        if (branch.exitNodes.length > 0) {
          const exitId = branch.exitNodes[0]
          const exitNode = this.analyzer.getNodeById(exitId)
          const node = this.analyzer.getNodeById(logicId)
          if (exitNode) {
            code += `${CodeFactory.indent(indent + 1)}${CodeFactory.getNodeVarName(
              node
            )} = ${CodeFactory.getNodeVarName(exitNode)}\n`
          }
        }
      })

      code += `${CodeFactory.indent(indent)}}\n`
      return code
    } catch (error) {
      console.error('[LuaGen] 生成 if-else 结构体失败:', error)
      return ''
    }
  }

  /**
   * 为给定的工作流节点生成代码
   * @param {WorkflowNode} node - 需要生成代码的流程节点
   * @param {number} indent - 生成代码时用于缩进的空格数量
   * @param {Set<string>} generated - 已生成节点ID的集合，用于避免重复
   * @param {any} [branchContext] - 可选的分支相关上下文，用于条件或逻辑节点
   * @return {string} 生成的代码字符串
   */
  private generateNodeCode(
    node: WorkflowNode,
    indent: number,
    generated: Set<string>,
    branchContext?: any
  ): string {
    let code = ''
    const analysis = this.nodeAnalysis.get(node.id)
    if (!analysis) {
      return code
    }

    // 分析是否有前置代码需要生成 如全局变量
    code += this.generatePreAddedCode(node, indent, generated, branchContext)

    // 生成注释
    if (node.remark && node.funcType === 'func') {
      code += `${CodeFactory.indent(indent)}-- ${node.remark.replace(/\n/g, ' ')}\n`
    }

    // 主线代码生成
    // if (node.funcType === 'func' && node.funcId) {
    //   code += this.generateFuncCodeWithBranch(node, indent, branchContext)
    // } else if (node.funcType === 'logic') {
    code += this.generateLogicNodeCode(node, indent, generated, branchContext)
    // }

    return code
  }

  // 分支感知的函数参数生成
  private generateFuncCodeWithBranch(
    node: WorkflowNode,
    indent: number,
    branchContext?: any
  ): string {
    // TODO: 函数调整
    let code = ''
    const funcInfo = this.funcData.find(rule => rule.funcId == node.funcId)
    if (funcInfo) {
      const moduleName = this.convertToLuaVarName(funcInfo.className)
      const args = this.generateFunctionArgsWithBranch(node, branchContext)

      if (this.isGenerateTestLuaScript) {
        // 测试模式：使用 exec 函数包装，包含错误处理
        const errorVarName = `error_${node.id}`
        // 根据是否有参数来决定是否添加逗号
        const argsPart = args ? `, ${args}` : ''
        code += `${CodeFactory.indent(
          indent
        )}-- 记录抽象函数执行日志，正式脚本会还原为：${CodeFactory.getNodeVarName(
          node
        )} = ${moduleName}.${funcInfo.funcName}(${args})\n`
        code += `${CodeFactory.indent(indent)}${CodeFactory.getNodeVarName(
          node
        )}, ${errorVarName} = exec.func_and_log(func_step_logs, ${node.id}, ${moduleName}.${
          funcInfo.funcName
        }${argsPart})\n`

        // 补充 error信息校验 如果失败则 直接返回
        code += `${CodeFactory.indent(indent)}if ${errorVarName} then\n`
        code += `${CodeFactory.indent(indent + 1)}return ${CodeFactory.getNodeVarName(
          node
        )}, ${errorVarName}\n`
        code += `${CodeFactory.indent(indent)}end\n`
      } else {
        // 正常模式：直接函数调用
        code += `${CodeFactory.indent(indent)}${CodeFactory.getNodeVarName(node)} = ${moduleName}.${
          funcInfo.funcName
        }(${args})\n`
      }
    }
    return code
  }

  /**
   * 为指定的工作流节点生成预置代码
   * @param {WorkflowNode} node - 需生成预添加代码的工作流节点
   * @param {number} indent - 生成代码时用于缩进的空格数
   * @param {Set<string>} generated - 已处理节点的标识符集合，用于避免重复
   * @param {any} [branchContext] - 可选的与包含节点的分支相关的上下文信息
   * @return {string} T 生成的预添加代码字符串。若未找到全局变量映射路径或其不包含节点的ID，则返回空字符串
   */
  private generatePreAddedCode(
    node: WorkflowNode,
    indent: number,
    generated: Set<string>,
    branchContext?: any
  ): string {
    let addCode = ''
    // 若无则直接返回
    const globalVarMapPath = this.analyzer.getGlobalVarMapPath()

    if (globalVarMapPath.size == 0 || !globalVarMapPath.has(node.id)) {
      return addCode
    }
    // 全局变量节点链路作为 前置代码生成
    const paths = globalVarMapPath.get(node.id)

    if (paths && paths.length > 0) {
      paths.forEach(path => {
        const node = this.analyzer.getNodeById(path)

        if (node) {
          addCode += this.generateNodeCode(node, indent, generated, branchContext)
        }
      })
    }
    return addCode
  }

  /*
   * 给部分逻辑节点提供 准确的参数名的逻辑
   * 比如 子属性提取节点 类型转换节点 可能会直接连接到 ifelse后 此时就需要获取真正的取值对象
   */
  private getArgParamNameForLogic(nodeId: string, branchContext?: any): string {
    const analysis = this.nodeAnalysis.get(nodeId)
    const isMerge = this.isMergeNode(nodeId)
    const branchId = branchContext?.branchId
    const resultVar = this.getArgParamName(nodeId, isMerge, analysis, branchId)
    return resultVar
  }

  /*
   * 抽象出来公用的 获取参数名的逻辑
   * 主要是 汇合节点的处理 以及ifelse溯源的逻辑
   */
  private getArgParamName(
    targetSource: string,
    isMerge: boolean,
    analysis: NodeAnalysis | undefined,
    branchId: string
  ): string {
    // 汇合节点分支感知处理
    if (isMerge && analysis) {
      // 同源分支汇合点：保持现有逻辑
      if (analysis.isSameSourceMergePoint && branchId && analysis.branchSourceMap?.[branchId]) {
        // 需要找到对应边指定的上游节点
        const sourceIds = Object.values(analysis.branchSourceMap)
        if (sourceIds.length > 0 && sourceIds.includes(targetSource)) {
          const sourceNodeId = analysis.branchSourceMap[branchId]
          targetSource = sourceNodeId
        }
      } else if (analysis.isDifferentSourceMergePoint) {
        // 对于不同源汇合点，我们需要根据分支来源选择合适的参数
        // 使用了连接出口的节点id的参数 才需要将 result_xxx 转换为根ifelse的 tempResult_xxx
        // 其他的走通用逻辑
        for (const [_, sourceNodeId] of Object.entries(analysis.branchSourceMap ?? {})) {
          if (sourceNodeId === targetSource) {
            const rootBranchId = this.analyzer.findRootIfElseBranchIdByNodeId(targetSource)
            const node = this.analyzer.getNodeById(rootBranchId)
            if (node) return CodeFactory.getNodeVarName(node)
          }
        }
      }
    }
    // 递归追溯：如果参数引用为ifelse节点，递归其参数链路，直到遇到第一个非条件节点
    const resolvedId = this.resolveParamSource(targetSource)
    const node = this.analyzer.getNodeById(resolvedId)
    return CodeFactory.getNodeVarName(node)
  }

  // 递归追溯：如果参数引用为ifelse节点，递归其参数链路（inputData配置的source），直到遇到第一个非条件节点
  private resolveParamSource(paramSourceId: string): string {
    const nodeAnalysis = this.nodeAnalysis.get(paramSourceId)
    // 非条件节点 直接返回
    if (!nodeAnalysis || nodeAnalysis.type != 'condition') {
      return paramSourceId
    }
    // 条件节点 递归追溯
    let resolvedId = paramSourceId
    const inputList = this.analyzer.getNodeInput(paramSourceId)
    if (inputList) {
      inputList.forEach(input => {
        if (input.source) {
          resolvedId = this.resolveParamSource(input.source)
          return resolvedId
        }
      })
    }
    return resolvedId
  }

  // 递归追溯：如果参数引用为ifelse节点，递归其参数链路（inputData配置的source），返回所有入边的第一个非条件节点
  private resolveParamSourceAll(paramSourceId: string): string[] {
    const nodeAnalysis = this.nodeAnalysis.get(paramSourceId)
    // 非条件节点 直接返回当前节点ID
    if (!nodeAnalysis || nodeAnalysis.type != 'condition') {
      return [paramSourceId]
    }

    // 条件节点 递归追溯所有入边
    const result: string[] = []
    const inputList = this.analyzer.getNodeInput(paramSourceId)
    if (inputList) {
      inputList.forEach(input => {
        if (input.source) {
          const resolvedIds = this.resolveParamSourceAll(input.source)
          result.push(...resolvedIds)
        }
      })
    }

    return result
  }

  private generateFunctionArgsWithBranch(node: WorkflowNode, branchContext?: any): string {
    if (node.inputData === undefined || node.inputData === null) {
      return ''
    }
    const analysis = this.nodeAnalysis.get(node.id)
    const isMerge = this.isMergeNode(node.id)
    const branchId = branchContext?.branchId
    const args = node.inputData
      .map(input => {
        if (input.sourceType === 'input') {
          if (input.type == 'string') {
            if (
              input.source === '$root' ||
              input.source === '$target' ||
              input.source === '$context'
            ) {
              return input.source.replace('$', '')
            } else if (input.source == 'nil') {
              return `nil`
            } else {
              return `"${input.source}"`
            }
          } else if (
            input.type == 'table' &&
            (input.subType == 'number[]' || input.subType == 'string[]') &&
            'length' in (input.source as any)
          ) {
            if (input.subType == 'number[]') {
              return `{${(input.source as any).join(',')}}`
            } else {
              return `{${(input.source as any).map(item => `"${item}"`).join(',')}}`
            }
          } else if (input.type == 'function') {
            // 表达式 暂时先移除 input.paramName == 'expression'
            return `expression_${node.id}_${input.portId}`
          } else if (input.type == 'boolean') {
            return String(input.source) == 'true' ? 'true' : 'false'
          }
          return input.source
        } else if (input.sourceType === 'node') {
          const resultVar = this.getArgParamName(input.source, isMerge, analysis, branchId)
          return resultVar
        }
        return ''
      })
      .filter(param => param !== undefined && param !== '')
      .join(', ')

    // 如果没有参数，返回空字符串，避免生成多余的逗号
    return args.trim()
  }

  // 判断是否为汇合节点（有多个前驱）
  private isMergeNode(nodeId: string): boolean {
    // 获取所有指向该节点的边
    const incomingEdges = (this.workflow.edges || []).filter((edge: any) => edge.target === nodeId)
    return incomingEdges.length > 1
  }

  // 生成逻辑节点代码
  private generateLogicNodeCode(
    node: WorkflowNode,
    indent: number,
    generated: Set<string>,
    branchContext?: any
  ): string {
    let code = ''
    const dataArray = this.getNodeIncomingEdges(node.id)
    if (node.logicData?.logicType === LogicType.GLOBAL_VARIABLE) {
      code = this.globalVariable.generateCode(node, indent, this.analyzer)
    }
    if (node.logicData?.logicType === LogicType.CALCULATOR) {
      code = this.calculator.generateCode(node, indent, dataArray)
    }
    if (node.logicData?.logicType === LogicType.GLOBAL_PARAM) {
      code = this.globalParam.generateCode(node, indent)
    }
    if (node.logicData?.logicType === LogicType.IFELSE) {
      code = this.generateIfElseBlock(node, indent, generated, dataArray, branchContext)
    }

    return code
  }

  // 获取主流程最后一个节点
  private getMainFlowLastNode(): WorkflowNode | null {
    // 执行顺序是 this.executionOrder 从 executionOrder 找到所有层级为0的最后节点
    for (let i = this.executionOrder.length - 1; i >= 0; i--) {
      const nodeId = this.executionOrder[i]
      const node = this.analyzer.getNodeById(nodeId)
      if (node && this.nodeAnalysis.get(nodeId)?.level === 0) {
        return node
      }
    }
    return null
  }

  // 生成返回语句
  private generateReturnStatement(): string {
    const lastNode = this.getMainFlowLastNode()
    console.log('lastNode', lastNode)
    // if (this.hasDiffMerge) {
    //   // 如果有不同源汇合点 则从后往前校验 返回一个有值的结果
    //   // 当出现有不同源汇合点的时候  往往说明 节点流转 有数据结果合并 需要返回一个有值的结果
    //   const mergeDeclarations = this.analyzer.getMergeDeclarations()
    //   const mergeParts = []
    //   for (let i = mergeDeclarations.length - 1; i >= 0; i--) {
    //     const mergeVar = mergeDeclarations[i]
    //     mergeParts.push(mergeVar)
    //   }
    //   const rstVar = CodeFactory.getNodeVarName(lastNode)
    //   const rstCode = mergeParts.join(' or ')
    //   return `\n\treturn ${rstCode} or ${rstVar}\n`
    // }

    return `\n\treturn ${CodeFactory.getNodeVarName(lastNode)}\n`
  }

  // 工具函数：将连字符转换为下划线
  private convertToLuaVarName(name: string): string {
    return name.replace(/-/g, '_')
  }

  // 新增：生成不同源分支汇合点的 if flag...then 结构
  private generateDifferentSourceMergeBlock(nodeId: string, diffMergeCount: number): string {
    const analysis = this.nodeAnalysis.get(nodeId)
    if (!analysis) return ''

    // 1. 获取分组后的 flag 条件
    const ifCond = this.generateGroupedFlagCondition(nodeId)
    const indent = 1
    // 2. 收集所有子孙节点（遇到新的不同源分支汇合点时递归）
    const descendants = this.analyzer.collectDescendants(nodeId)
    // 3. 生成 if 结构
    let code = `\n${CodeFactory.indent(indent)}-- 不同源分支汇合点\n`
    code += `${CodeFactory.indent(indent)}if ${ifCond} then\n`
    // 4. 生成本汇合点及其所有子孙节点代码（本地去重）
    const localVisited = new Set<string>()
    // 先生成本节点
    code += this.generateNodeCode(this.analyzer.getNodeById(nodeId), indent + 1, localVisited)
    localVisited.add(nodeId)
    // 再生成所有子孙节点
    for (const descId of descendants) {
      if (localVisited.has(descId)) continue
      const descNode = this.analyzer.getNodeById(descId)
      code += this.generateNodeCode(descNode, indent + 1, localVisited)
      localVisited.add(descId)
    }
    // 5. merge 变量赋值 统一收集不同源汇合点后 按顺序就是匹配的 mergeVar
    const mergeVar = this.analyzer.getMergeDeclarations()[diffMergeCount]
    if (mergeVar) {
      // 取最后一个子孙节点的变量名
      const lastId = descendants.length > 0 ? descendants[descendants.length - 1] : nodeId
      const node = this.analyzer.getNodeById(lastId)
      code += `${CodeFactory.indent(indent + 1)}${mergeVar} = ${CodeFactory.getNodeVarName(node)}\n`

      // 在测试模式下，为不同源分支汇合点添加记录日志
      if (this.isGenerateTestLuaScript) {
        code += `${CodeFactory.indent(
          indent + 1
        )}-- 记录基础函数执行日志，正式脚本不会有下面这行代码\n`
        code += `${CodeFactory.indent(
          indent + 1
        )}exec.logic_and_log(func_step_logs, ${nodeId}, ${mergeVar})\n`
      }
    }
    code += `${CodeFactory.indent(indent)}end\n`
    return code
  }

  // 生成分组后的flag条件
  private generateGroupedFlagCondition(nodeId: string): string {
    const analysis = this.nodeAnalysis.get(nodeId)
    if (!analysis || !analysis.branchSourceMap) return 'true'

    // 获取汇合点的所有入边
    const incomingEdges = (this.workflow.edges || []).filter((edge: any) => edge.target === nodeId)

    // 按根ifelse节点ID分组
    const groups = new Map<string, string[]>()

    incomingEdges.forEach(edge => {
      const sourceNodeId = edge.source
      // 找到对应的分支ID
      const branchSourceMap = analysis.branchSourceMap ?? {}
      const branchId = Object.keys(branchSourceMap).find(
        key => branchSourceMap[key] === sourceNodeId
      )

      if (branchId) {
        // 找到根ifelse节点ID
        const rootIfElseId = this.analyzer.findRootIfElseBranchIdByNodeId(sourceNodeId)

        if (rootIfElseId) {
          if (!groups.has(rootIfElseId)) {
            groups.set(rootIfElseId, [])
          }
          // 支持多分支到汇合点
          const analysis = this.nodeAnalysis.get(sourceNodeId)
          if (analysis && analysis.localBranches) {
            // 多分支到汇合点
            analysis.localBranches.forEach(branch => {
              groups.get(rootIfElseId)?.push(`flag_${branch}`)
            })
          } else {
            // 单分支到汇合点
            groups.get(rootIfElseId)?.push(`flag_${branchId}`)
          }
        }
      }
    })

    // 生成分组条件
    const groupConditions: string[] = []
    groups.forEach((flags, _rootId) => {
      if (flags.length > 0) {
        // 同组内用or连接
        groupConditions.push(`(${flags.join(' or ')})`)
      }
    })

    // 组间用and连接
    return groupConditions.length > 0 ? groupConditions.join(' and ') : 'true'
  }
}
