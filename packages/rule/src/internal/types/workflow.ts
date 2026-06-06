/**
 * 节点位置坐标
 */
export interface Position {
  x: number // X坐标
  y: number // Y坐标
}

export interface Attributes {
  paramType: string // 字段类型
  paramSubType?: string // 字段子类型
  inputType: string //
  label: string // 字段文案
  desc?: string // 字段描述
  placeholder?: string
  disabled?: boolean
  multiple?: boolean
  defaultOptions?: unknown
  [key: string]: unknown
}
/**
 * 节点输入参数数据
 */
export interface InputData {
  paramName: string // 参数名称
  type: string // 参数类型
  subType?: string // 参数子类型
  defaultValue?: any // 默认值
  source: string // 来源节点ID 或者输入框的字符串
  sourceType?: 'input' | 'node' | 'global' // 来源类型 global: 全局 node: 联线可选节点， input: 文本输入节点，
  sourceIndex?: string // 来源索引
  portId?: string // 唯一端口ID
  widgetType?: string // 控件类型
  attributes?: Attributes // 控件属性
  options?: Array<{ label: string; value: string; desc?: string; name?: string; type?: string }> // 下拉选择选项
  dynamicOptions?: Record<string, Array<{ label: string; value: string }>> // 动态选项配置
  linkedParams?: string[] // 联动参数列表，当此参数变化时会影响哪些其他参数
  linkedSource?: string // 联动源参数，标识此参数的选项来源
}

/**
 * 节点输出参数数据
 */
export interface OutputData {
  paramName: string // 参数名称
  type: string // 参数类型
  subType?: string // 参数子类型
  value?: any // 参数值
  functionCode?: string // 条件检查
  portId?: string // 唯一端口ID
  attributes?: Attributes // 控件属性
}

export enum LogicType {
  IFELSE = 'if_else',
  GLOBAL_PARAM = 'global_param',
  GLOBAL_VARIABLE = 'global_variable',
  CALCULATOR = 'calculator',
  ADD = '+'
}

/**
 * 逻辑节点数据
 */
export interface LogicData {
  logicType: LogicType
  source?: string
  condition?: string
}

/**
 * 工作流节点
 */
export interface WorkflowNode {
  id: string
  funcId: string
  funcType: 'func' | 'logic'
  title: string
  remark?: string
  pos?: Position
  inputData: InputData[]
  outputData: OutputData[]
  config?: string
  condition?: string
  logicData?: LogicData
  path?: string
  className?: string
  func?: string
  width?: number
  height?: number
  children?: string[]
  isCollapsed?: boolean
}

export interface GroupNodeData {
  id: string
  title: string
  children: string[]
  isCollapsed: boolean
  pos: Position
  width: number
  height: number
}

/**
 * 工作流边（连接）
 */
export interface WorkflowEdge {
  id: string
  type: string
  source: string
  target: string
  sourcePort?: string
  targetPort?: string
}

/**
 * 搜索相关类型定义
 */
export interface SearchHistoryItem {
  name: string
  funcId: string
  funcType: string
}

export interface SearchResult {
  keyword: string
  results: any[]
  timestamp: number
}

/**
 * 工作流数据
 */
export interface WorkflowData {
  id: string
  nodeList: WorkflowNode[]
  edges: WorkflowEdge[]
  groupList: GroupNodeData[]
  lua: string
  ruleName: string
}

/**
 * 节点类型定义
 */
export interface NodeType {
  type: string
  funcId: string
  title: string
  icon: string
  show?: boolean
  text?: string
}
