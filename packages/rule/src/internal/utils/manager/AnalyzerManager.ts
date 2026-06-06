import { LogicType, WorkflowData, WorkflowEdge, WorkflowNode } from '@/types/workflow'
import { AnalysisResult, NodeAnalysis, BranchInfo } from '@/types/JsCodeParser'
import { isIfElseNode } from '@/utils/common/NodeType'

// 执行顺序结果类型定义
interface ExecutionOrderResult {
  main: string[] // 主链路执行路径
}

export class AnalyzerManager {
  private workflow: WorkflowData | null = null
  private nodeAnalysis: Map<string, NodeAnalysis>
  private branchInfoMap: Map<string, BranchInfo>
  private nodeBranchMap: Map<string, BranchInfo>
  private branchNodeCache: Map<string, Set<string>>
  private globalVarMapPath: Map<string, string[]> // 全局变量的节点map
  private mergePointCache: Map<string, { sources: string[]; logicNodeId: string }>

  // 新增：节点和边的索引Map
  private nodeMap: Map<string, WorkflowNode>
  private outEdgeMap: Map<string, Array<any>>
  private inEdgeMap: Map<string, Array<any>>

  private diffMergePointCache: Map<string, string[]>
  private executionOrderResult: ExecutionOrderResult

  constructor(workflow: WorkflowData) {
    this.workflow = workflow
    this.nodeAnalysis = new Map()
    this.branchInfoMap = new Map()
    this.nodeBranchMap = new Map()
    this.branchNodeCache = new Map()
    this.mergePointCache = new Map()
    this.globalVarMapPath = new Map()
    // 新增初始化
    this.nodeMap = new Map()
    this.outEdgeMap = new Map()
    this.inEdgeMap = new Map()

    this.diffMergePointCache = new Map()
    this.executionOrderResult = { main: [] }
  }

  public clear() {
    this.workflow = null
    this.nodeAnalysis.clear()
    this.branchInfoMap.clear()
    this.nodeBranchMap.clear()
    this.branchNodeCache.clear()
    this.mergePointCache.clear()
    this.nodeMap.clear()
    this.outEdgeMap.clear()
    this.inEdgeMap.clear()
    this.diffMergePointCache.clear()
    this.globalVarMapPath.clear()
  }

  /**
   * 获取节点分析类型
   */
  private getNodeAnalysisType(node: WorkflowNode): 'normal' | 'condition' {
    if (isIfElseNode(node)) {
      return 'condition'
    }
    return 'normal'
  }

  /**
   * 分析工作流
   */
  public analyze(): AnalysisResult {
    // 1. 初始化节点和边的索引Map
    this.initNodeMap()
    // 2. 先计算一波节点依赖关系
    this.executionOrderResult = this.generateExecutionOrder()
    // 取主链路作为主执行顺序
    let executionOrder = this.executionOrderResult.main
    // 3. 计算节点层级
    this.initNodeLevel(executionOrder)
    // 4. 将节点分配到父分支 (所有节点都可能属于某个分支)
    this.assignNodeToBranch()
    // 5. 记录汇合点信息
    this.processMergePoints()
    // 6. 处理全局参数的逻辑 -会修改执行路径
    executionOrder = this.processGlobalVarPath(executionOrder)
    // 7. 处理不同源汇合点的特殊逻辑
    this.processDifferentSourceMerge()
    // 8. 打印分析结果
    this.printAnalysis()

    return {
      nodeAnalysis: this.nodeAnalysis,
      branchInfoMap: this.branchInfoMap,
      nodeBranchMap: this.nodeBranchMap,
      executionOrder: executionOrder
    }
  }

  private initNodeLevel(executionOrder: string[]): void {
    // 循环遍历拓扑排序后的节点，进行分析
    for (const nodeId of executionOrder) {
      // 2. 获取节点的分析信息
      const analysis = this.nodeAnalysis.get(nodeId)!
      // 3. 计算节点的真实层级
      analysis.level = this.calculateNodeLevel(nodeId)
    }
  }

  private initNodeMap(): void {
    // 通用节点初始化
    for (const node of this.workflow.nodeList) {
      this.nodeMap.set(node.id, node)
      this.outEdgeMap.set(node.id, [])
      this.inEdgeMap.set(node.id, [])
      // 先批量初始化所有 nodeAnalysis
      const nodeType = this.getNodeAnalysisType(node)

      this.nodeAnalysis.set(node.id, {
        type: nodeType,
        level: 0 // 临时层级，后续会计算
      })

      // 如果是条件节点，则创建自己的子分支
      if (nodeType === 'condition') {
        this.buildBranchBase(node)
      }
    }

    // 初始化边关系
    for (const edge of this.workflow.edges) {
      if (this.inEdgeMap.has(edge.target)) {
        this.inEdgeMap.get(edge.target)!.push(edge)
      }

      if (this.outEdgeMap.has(edge.source)) {
        this.outEdgeMap.get(edge.source)!.push(edge)
      }
    }
  }

  /**
   * 同步 nodeBranchMap，使其与分支路径一致
   */
  private syncNodeBranchMapWithPath(branchId: string, path: string[]): void {
    const branchInfo = this.branchInfoMap.get(branchId)
    if (!branchInfo) return
    for (const nodeId of path) {
      this.nodeBranchMap.set(nodeId, branchInfo)
    }
  }

  /**
   * 计算节点的真实层级
   * @param nodeId 节点ID
   */
  private calculateNodeLevel(nodeId: string): number {
    const incomingEdges = this.inEdgeMap.get(nodeId) || []
    if (incomingEdges.length === 0) {
      return 0 // 起点节点
    }
    // 层级等于所有父节点层级的最大值
    let maxParentLevel = 0
    for (const edge of incomingEdges) {
      const parentAnalysis = this.nodeAnalysis.get(edge.source)
      if (parentAnalysis) {
        let parentLevel = parentAnalysis.level
        // 如果父节点是条件节点，当前节点是分支的起点，层级+1
        if (parentAnalysis.type === 'condition') {
          parentLevel++
        }
        if (parentLevel > maxParentLevel) {
          maxParentLevel = parentLevel
        }
      }
    }
    return maxParentLevel
  }

  /**
   * 分析条件节点，创建分支信息，但不递归
   * @param logicNode 条件节点
   */
  private buildBranchBase(logicNode: WorkflowNode): void {
    // 不可改成 outEdgeMap， outEdgeMap 还没初始化
    const branchEdges = this.workflow.edges.filter(e => e.source === logicNode.id)
    // 根据端口排序...
    branchEdges.sort((a, b) => {
      const aPortIdx = Number(a.sourcePort.split('_')[1])
      const bPortIdx = Number(b.sourcePort.split('_')[1])
      return aPortIdx - bPortIdx
    })
    if (branchEdges.length > 2) {
      const twoEdge = branchEdges.splice(1, 1)[0]
      branchEdges.push(twoEdge)
    }

    branchEdges.forEach((edge, idx) => {
      const branchType = idx === 0 ? 'if' : idx === branchEdges.length - 1 ? 'else' : 'elseif'
      const branchId = `${logicNode.id}_${edge.sourcePort}`
      const branchInfo: BranchInfo = {
        logicNodeId: logicNode.id,
        branchType,
        branchIndex: idx, // Keep index for if/else/elseif type, not for ID
        condition: '',
        nodes: [],
        exitNodes: []
      }
      this.branchInfoMap.set(branchId, branchInfo)
    })
  }

  private resetExitNodes(branch: BranchInfo) {
    // 重新计算出口节点
    if (branch.nodes.length > 0) {
      branch.exitNodes = [branch.nodes[branch.nodes.length - 1]]
    } else {
      branch.exitNodes = []
    }
  }

  /**
   * 将节点分配到正确的分支
   * @param node 当前节点
   */
  private assignNodeToBranch(): void {
    this.branchInfoMap.forEach((branch, branchId) => {
      const fullPath = this.collectBranchPathByEdges(branchId)
      if (fullPath.length > 0) {
        // 每个分支的完整路径
        branch.nodes = fullPath
        // 出口节点
        this.resetExitNodes(branch)
        // 同步 nodeBranchMap
        this.syncNodeBranchMapWithPath(branchId, fullPath)
      }
    })
  }

  /**
   * 处理全局参数的逻辑  全局参数的执行顺序 不能按默认走的
   */
  private processGlobalVarPath(executionOrder: string[]): string[] {
    // 获取所有全局参数节点
    const globalParams = Array.from(this.nodeMap.values()).filter(
      node => node.funcType === 'logic' && node.logicData?.logicType === LogicType.GLOBAL_VARIABLE
    )
    // 识别全局参数节点的下游汇合点
    if (globalParams) {
      // 1 处理所有全局参数的执行路径 定义为 全局参数开始 -> 第一个汇合点 （可能有多个）
      globalParams.forEach(node => {
        // 如果 targetNode 是汇合点 以汇合点为key  记录 全局参数 到汇合点的节点路径
        // 否则 就继续往下找后续连接的节点 直到找完所有出边链路上到各自汇合点的路径
        this.findGlobalVarMergePoints(node.id, [node.id])
      })
      // 2.将所有 globalVarMapPath 的值提取到set中
      const globalVarMapPathSet = new Set<string>()
      this.globalVarMapPath.forEach(paths => {
        paths.forEach(path => {
          const pathArray = path.split(',')
          if (pathArray.length > 0) {
            pathArray.forEach(path => {
              globalVarMapPathSet.add(path)
            })
          }
        })
      })
      // 3. 从执行链路中删掉 globalVarMapPathSet 中的路径
      return executionOrder.filter(nodeId => !globalVarMapPathSet.has(nodeId))
    }
    return executionOrder
  }

  /**
   * 递归查找全局参数节点到汇合点的路径
   * @param nodeId 当前节点ID
   * @param currentPath 当前路径
   */
  private findGlobalVarMergePoints(nodeId: string, currentPath: string[]): void {
    const outEdges = this.outEdgeMap.get(nodeId) || []

    for (const edge of outEdges) {
      const targetNodeId = edge.target
      const targetAnalysis = this.nodeAnalysis.get(targetNodeId)

      if (targetAnalysis && targetAnalysis?.isMergePoint) {
        // 找到汇合点，记录路径
        this.globalVarMapPath.set(targetNodeId, currentPath)
      } else {
        // 不是汇合点，继续递归查找
        const newPath = [...currentPath, targetNodeId]
        this.findGlobalVarMergePoints(targetNodeId, newPath)
      }
    }
  }

  /**
   * 处理汇合点
   */
  private processMergePoints(): void {
    const potentialMerges = Array.from(this.nodeMap.values()).filter(
      node => this.inEdgeMap.get(node.id)?.length > 1
    )
    potentialMerges.forEach(node => {
      const incomingEdges = this.inEdgeMap.get(node.id) || []
      const localBranches: string[] = []
      const rootBranches: string[] = []
      const branchSourceMap: Record<string, string> = {}
      const tempRootBranches: string[] = []
      incomingEdges.forEach(edge => {
        // 递归查找最近ifelse分支ID（端口感知）
        const nearestIfElse = this.findNearestIfElseBranchId(edge.source, edge.sourcePort)
        if (nearestIfElse) localBranches.push(nearestIfElse.nearestId)
        // 递归查找根ifelse分支ID（端口感知）
        const rootIfElse = this.findRootIfElseBranchIdByNodeId(edge.source)
        // 这里是用于记录 都有哪些根的ifelse分支 会去重
        if (rootIfElse && !rootBranches.includes(rootIfElse)) rootBranches.push(rootIfElse)
        // 这里是用来统计所有入边的情况 没有ifelse 会是null  所以 tempRootBranches <= 1的话 就是单分支入边
        if (rootIfElse) tempRootBranches.push(rootIfElse)
        // 分支ID与上游节点ID映射
        if (nearestIfElse) {
          branchSourceMap[nearestIfElse.nearestId] = edge.source
          // 当有多重 同源汇合点合流的时候 需要补充所有相关的可能性
          nearestIfElse.allIds.forEach(id => {
            const analysis = this.nodeAnalysis.get(id)!
            if (analysis && analysis.branchSourceMap) {
              for (const [key, _] of Object.entries(analysis.branchSourceMap)) {
                branchSourceMap[key] = edge.source
              }
            }
          })
        }
      })

      const analysis = this.nodeAnalysis.get(node.id)!
      analysis.isMergePoint = true
      analysis.localBranches = localBranches
      analysis.rootBranches = rootBranches
      analysis.branchSourceMap = branchSourceMap

      // 判断是否为同源分支汇合点
      if (tempRootBranches.length > 1) {
        const isSameSource = rootBranches.length == 1

        if (isSameSource) {
          analysis.isSameSourceMergePoint = true
          analysis.isDifferentSourceMergePoint = false
        } else {
          analysis.isSameSourceMergePoint = false
          analysis.isDifferentSourceMergePoint = true
        }
      } else {
        // 如果没有rootBranches，默认为普通多入参汇合点
        analysis.isSameSourceMergePoint = false
        analysis.isDifferentSourceMergePoint = false
      }
    })
  }

  // 端口感知：递归查找最近ifelse分支ID
  private findNearestIfElseBranchId(
    nodeId: string,
    incomingPort?: string,
    allIds: string[] = []
  ): { nearestId: string; allIds: string[] } | null {
    const node = this.nodeMap.get(nodeId)
    allIds.push(nodeId)
    if (isIfElseNode(node) && incomingPort) {
      return { nearestId: `${nodeId}_${incomingPort}`, allIds }
    }
    const inEdges = this.inEdgeMap.get(nodeId) || []
    for (const edge of inEdges) {
      const result = this.findNearestIfElseBranchId(edge.source, edge.sourcePort, allIds)
      if (result) return result
    }
    return null
  }

  // 端口感知：递归查找根ifelse分支ID
  public findRootIfElseBranchIdByNodeId(nodeId: string): string | null {
    let rootIfElseId: string | null = null
    const node = this.nodeMap.get(nodeId)
    if (isIfElseNode(node)) {
      rootIfElseId = nodeId
    }
    const inEdges = this.inEdgeMap.get(nodeId) || []
    for (const edge of inEdges) {
      const result = this.findRootIfElseBranchIdByNodeId(edge.source)
      if (result) {
        // 如果上游有更顶层的ifelse，则以上游为准
        if (!rootIfElseId || result !== rootIfElseId) {
          rootIfElseId = result
        }
      }
    }
    return rootIfElseId
  }

  /**
   * 打印分析结果
   */
  private printAnalysis(): void {
    // 1. 输出所有分支汇合点信息
    console.log('== 分支汇合点分析 ==')
    const mergePoints = Array.from(this.nodeAnalysis.entries()).filter(([_, a]) => a.isMergePoint)

    if (mergePoints.length === 0) {
      console.log('未找到分支汇合点。')
    } else {
      mergePoints.forEach(([nodeId, analysis]) => {
        const localBranches = analysis.localBranches || []
        const rootBranches = analysis.rootBranches || []
        const mergeType = analysis.isSameSourceMergePoint
          ? '同源分支汇合点'
          : analysis.isDifferentSourceMergePoint
          ? '不同源分支汇合点'
          : '普通汇合点'

        console.log(`汇合点: ${nodeId} (层级: ${analysis.level}, 类型: ${mergeType})`)
        console.log(`  - 最近ifelse分支: [${localBranches.join(', ')}]`)
        console.log(`  - 根ifelse分支: [${rootBranches.join(', ')}]`)
        console.log(
          `  - 分支来源: [${Object.entries(analysis.branchSourceMap)
            .map(([key, value]) => `${key}: ${value}`)
            .join(', ')}]`
        )
      })
    }
    console.log('------------------------------------------')

    // 2. 输出节点分析结果表格
    console.log('== 节点分析结果 ==')
    console.log('节点ID    节点标题           节点类型    层级')
    console.log('------------------------------------------')
    this.workflow.nodeList.forEach(node => {
      const analysis = this.nodeAnalysis.get(node.id)
      if (analysis) {
        const idStr = node.id.toString().padEnd(8)
        const titleStr = node.title.padEnd(16)
        const typeStr = analysis.type.padEnd(8)
        const levelStr = (analysis.level + '').padEnd(4)
        console.log(`${idStr}${titleStr}${typeStr}${levelStr}`)
      }
    })
    console.log('------------------------------------------')

    // 3. 详细分支信息
    console.log('== 分支详细信息 ==')
    this.branchInfoMap.forEach((branch, branchId) => {
      console.log(
        `分支ID: ${branchId} (逻辑节点: ${branch.logicNodeId}, 类型: ${branch.branchType})`
      )
      console.log(`  - 包含节点: [${branch.nodes.join(', ')}]`)
      console.log(`  - 出口节点: [${branch.exitNodes.join(', ')}]`)
    })
    console.log('------------------------------------------')

    // 4. 执行顺序
    console.log('== 执行顺序 ==')
    for (const [nodeId, order] of Object.entries(this.executionOrderResult)) {
      console.log(`迭代器ID: ${nodeId}:  ` + order.join(' -> '))
    }
    console.log('------------------------------------------')

    // 5. 全局变量映射
    console.log('== 全局变量映射 globalVarMapPath ==')
    if (this.globalVarMapPath.size === 0) {
      console.log('未找到全局变量映射。')
    } else {
      this.globalVarMapPath.forEach((paths, mergePointId) => {
        console.log(`汇合点 ${mergePointId}: ${paths}`)
      })
    }
    console.log('------------------------------------------')
  }

  /**
   * 通用的拓扑排序算法
   * @param nodes 节点列表
   * @param edges 边列表
   * @returns 拓扑排序结果
   */
  private topologicalSort(
    nodes: string[],
    edges: Array<{ source: string; target: string }>
  ): string[] {
    const inDegree = new Map<string, number>()
    const graph = new Map<string, string[]>()

    // 初始化
    for (const node of nodes) {
      inDegree.set(node, 0)
      graph.set(node, [])
    }

    // 构建图和计算入度
    for (const edge of edges) {
      inDegree.set(edge.target, (inDegree.get(edge.target) || 0) + 1)
      if (!graph.has(edge.source)) {
        continue
      }
      graph.get(edge.source)!.push(edge.target)
    }

    // 拓扑排序
    const queue: string[] = []
    const result: string[] = []

    // 找到所有入度为0的节点
    for (const [nodeId, degree] of inDegree) {
      if (degree === 0) {
        queue.push(nodeId)
      }
    }

    while (queue.length > 0) {
      const u = queue.shift()!
      result.push(u)

      const neighbors = graph.get(u) || []
      for (const v of neighbors) {
        const newDegree = (inDegree.get(v) || 1) - 1
        inDegree.set(v, newDegree)
        if (newDegree === 0) {
          queue.push(v)
        }
      }
    }

    return result
  }

  /**
   * 生成执行顺序
   */
  private generateExecutionOrder(): ExecutionOrderResult {
    // 合并所有节点
    const allNodes = [...this.workflow.nodeList.map(node => node.id)]

    // 使用通用拓扑排序算法
    const executionOrder = this.topologicalSort(allNodes, this.workflow.edges)

    // 分离主链路和迭代器链路
    const mainExecutionOrder: string[] = []
    const result: ExecutionOrderResult = { main: [] }

    for (const nodeId of executionOrder) {
      // 检查是否是迭代器内部节点
      const analysis = this.nodeAnalysis.get(nodeId)

      // 普通节点，添加到主链路
      mainExecutionOrder.push(nodeId)
    }

    result.main = mainExecutionOrder
    return result
  }

  /**
   * 获取分支的起点节点
   * @param branchId 分支ID
   */
  private getBranchStartNodes(branchId: string): string[] {
    const logicNodeId = branchId.split('_')[0]
    const sourcePort = branchId.substring(logicNodeId.length + 1)
    // 使用 outEdgeMap 替换 filter
    const startEdges = (this.outEdgeMap.get(logicNodeId) || []).filter(
      e => e.sourcePort === sourcePort
    )
    return startEdges.map(e => e.target)
  }

  /**
   * 基于边信息的递归遍历
   * @param currentNode 当前节点
   * @param path 路径数组
   * @param visited 已访问节点集合（分支独立）
   * @param targetBranchId 目标分支ID（用于调试）
   */
  private traverseFromNode(
    currentNode: string,
    path: string[],
    visited: Set<string>,
    targetBranchId: string
  ): void {
    if (visited.has(currentNode)) {
      return
    }
    visited.add(currentNode)
    path.push(currentNode)
    // 如果遇到条件节点，递归终止
    const analysis = this.nodeAnalysis.get(currentNode)
    if (analysis && analysis.type === 'condition') {
      return
    }
    // 查找所有后继节点，无条件递归
    const outEdges = this.outEdgeMap.get(currentNode) || []
    for (const edge of outEdges) {
      this.traverseFromNode(edge.target, path, visited, targetBranchId)
    }
  }

  /**
   * 基于边信息收集分支的完整路径
   * @param branchId 分支ID
   */
  private collectBranchPathByEdges(branchId: string): string[] {
    const path: string[] = []
    const visited = new Set<string>() // 分支独立的visited集合
    const startNodes = this.getBranchStartNodes(branchId)
    // 从每个起点开始遍历
    for (const startNode of startNodes) {
      this.traverseFromNode(startNode, path, visited, branchId)
    }
    // 递归结束后主动 clear visited（可选，便于GC）
    visited.clear()
    return path
  }

  // 递归处理指定节点 和其后续所有节点的层级
  private resetNodeLevel(nodeId: string) {
    const outEdges = this.outEdgeMap.get(nodeId) || []
    const childs = []
    outEdges.forEach(edge => {
      const targetNode = this.nodeMap.get(edge.target)
      if (targetNode) {
        const targetAnalysis = this.nodeAnalysis.get(targetNode.id)
        if (targetAnalysis) {
          targetAnalysis.level = this.calculateNodeLevel(targetNode.id)
        }
      }
      childs.push(targetNode.id)
    })

    if (childs.length > 0) {
      childs.forEach(child => {
        this.resetNodeLevel(child)
      })
    }
  }

  /**
   * 递归收集所有后续节点，遇到 stopCondition 返回
   * 普通的ifelse节点由起始是0开始
   * @param nodeId 起始节点ID
   * @param stopCondition 碰到该条件为true的节点时终止递归
   * @returns 所有子孙节点ID（不含起始节点）
   */
  public collectDescendants(nodeId: string, result: Set<string> = new Set()): string[] {
    const outEdges = this.outEdgeMap.get(nodeId) || []

    const analysis = this.nodeAnalysis.get(nodeId)
    if (analysis && analysis.type === 'condition') {
      // 条件节点本身也算 普通的在0的位置会在主流程触发
      // 不同源汇合点的层级是1  需要在这里特殊处理一下
      result.add(nodeId)
      return Array.from(result)
    }

    for (const edge of outEdges) {
      // 如果遇到不同源汇合点，则当前线路终止递归
      const analysis = this.nodeAnalysis.get(edge.target)
      if (analysis && analysis.isDifferentSourceMergePoint) continue

      // 其余全都算到子子孙孙内
      const targetId = edge.target
      if (!result.has(targetId)) {
        result.add(targetId)
        this.collectDescendants(targetId, result)
      }
    }
    return Array.from(result)
  }

  /**
   * 处理不同源汇合点的特殊逻辑
   */
  private processDifferentSourceMerge(): void {
    const differentSourceMergePoints = Array.from(this.nodeAnalysis.entries()).filter(
      ([_, analysis]) => analysis.isDifferentSourceMergePoint
    )
    // 1. 将不同源汇合点本身层级设为0
    differentSourceMergePoints.forEach(([diffMergeId, analysis]) => {
      // 1.1 将不同源汇合点本身层级设为0
      analysis.level = 1
      // 1.2. 将不同源汇合点后续节点层级 按规则重新计算
      this.resetNodeLevel(diffMergeId)
      // 1.3 修改分支出口的信息 移除不同源汇合点本身和后续的内容
      this.branchInfoMap.forEach((branch, _) => {
        if (branch.nodes.includes(diffMergeId)) {
          if (branch.nodes.indexOf(diffMergeId) > 0) {
            branch.nodes = branch.nodes.slice(0, branch.nodes.indexOf(diffMergeId))
            this.resetExitNodes(branch)
          }
        }
      })
      // 1.4 记录不同源汇合点 和 其后续所有子孙节点
      this.diffMergePointCache.set(diffMergeId, this.collectDescendants(diffMergeId))
    })
  }

  public isDifferentMerge(nodeId: string): boolean {
    return this.diffMergePointCache.has(nodeId)
  }

  /**
   * 获取所有分支的 flag 变量声明
   * @returns flag 变量名数组
   */
  public getFlagDeclarations(): string[] {
    if (this.diffMergePointCache.size == 0) {
      return []
    }

    const flagDeclarations: string[] = []
    for (const branchId of this.branchInfoMap.keys()) {
      flagDeclarations.push(`flag_${branchId}`)
    }
    return flagDeclarations
  }

  /**
   * 获取所有不同源汇合点的 merge 变量声明
   * @returns merge 变量名数组
   */
  public getMergeDeclarations(): string[] {
    const mergeDeclarations: string[] = []
    let index = 0
    this.diffMergePointCache.forEach((_, nodeId) => {
      index++
      const analysis = this.nodeAnalysis.get(nodeId)
      if (analysis?.rootBranches && analysis.rootBranches.length > 0) {
        // 提取根节点ID并排序
        const rootNodeIds = analysis.rootBranches.sort().join('_')
        mergeDeclarations.push(`merge_${rootNodeIds}_${index}`)
      }
    })
    return mergeDeclarations
  }

  public getNodeById(nodeId: string): WorkflowNode {
    return this.nodeMap.get(nodeId)!
  }

  public getNodeOutEdge(nodeId: string): WorkflowEdge[] {
    return this.outEdgeMap.get(nodeId) || []
  }

  public getNodeInput(nodeId: string): WorkflowEdge[] {
    return this.inEdgeMap.get(nodeId) || []
  }

  /**
   * 获取完整的执行顺序结果（包含主链路和迭代器链路）
   * @returns 对象格式的执行顺序
   */
  public getFullExecutionOrder(): ExecutionOrderResult {
    return this.executionOrderResult
  }

  /**
   * 获取全局参数到汇合点的映射
   * @returns 全局参数映射，key为汇合点ID，value为从全局参数到汇合点的路径数组
   */
  public getGlobalVarMapPath(): Map<string, string[]> {
    return this.globalVarMapPath
  }
}
