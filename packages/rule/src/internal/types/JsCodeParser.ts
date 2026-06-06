/**
 * 节点处理器接口
 * 定义了处理工作流节点的基本接口
 * 每个处理器需要实现两个方法：
 * 1. canProcess: 判断是否可以处理该节点
 * 2. process: 处理节点并生成对应的Lua代码
 */
export interface INodeProcessor {
  /**
   * 判断是否可以处理该节点
   * @param node 工作流节点
   * @returns 如果可以处理返回true，否则返回false
   */
  canProcess(node: any): boolean

  /**
   * 处理节点并生成Lua代码
   * @param node 工作流节点
   * @param context 处理上下文，包含工作流信息、函数映射等
   * @returns 生成的Lua代码字符串
   */
  process(node: any, context: ProcessingContext): string
}

/**
 * 处理上下文，用于在节点处理过程中共享数据
 * 包含工作流信息、函数映射、变量映射和模块集合
 */
export interface ProcessingContext {
  /** 工作流配置对象，包含节点列表和边信息 */
  workflow: any
  /** 函数ID到函数信息的映射 */
  funcMap: Map<string, any>
  /** 节点ID到变量名的映射 */
  varMap: Map<string, string>
  /** 需要导入的Lua模块集合 */
  modules: Set<string>
  /** 已处理的节点ID集合 */
  processedNodes: Set<string>
}

/**
 * 条件分支信息
 * 用于存储条件判断节点的分支信息
 */
export interface ConditionBranch {
  /** 分支节点信息 */
  node: any
  /** 分支边信息 */
  edge: any
}

// 分支类型
export type BranchType = 'if' | 'elseif' | 'else'

// 分支信息
export interface BranchInfo {
  logicNodeId: string // 所属的逻辑节点ID
  branchType: BranchType // 分支类型
  branchIndex: number // 分支序号(0=if, 1=elseif, 2=else)
  condition: string // 条件表达式
  nodes: string[] // 该分支下的所有节点ID
  exitNodes: string[] // 该分支的出口节点ID
}

// 节点分析信息
export interface NodeAnalysis {
  type: 'normal' | 'condition' // 节点类型
  level: number // 节点层级
  branchInfo?: BranchInfo // 所属分支信息
  isMergePoint?: boolean // 是否是汇合点
  isSameSourceMergePoint?: boolean // 是否是同源分支汇合点
  isDifferentSourceMergePoint?: boolean // 是否是不同源分支汇合点
  localBranches?: string[] // 每条入边最近的ifelse分支ID
  rootBranches?: string[] // 每条入边最上游的ifelse分支ID
  branchSourceMap?: Record<string, string> // 分支ID -> 实际上游节点ID
}

// 分析结果
export interface AnalysisResult {
  nodeAnalysis: Map<string, NodeAnalysis> // 节点分析信息
  branchInfoMap: Map<string, BranchInfo> // 分支信息映射
  nodeBranchMap: Map<string, BranchInfo> // 节点所属分支映射
  executionOrder: string[] // 节点执行顺序（主链路）
}
