import type { WorkflowNode, NodeType } from './workflow'

// DndPanel 组件 Props
export interface DndPanelProps {
  nodeTypes?: NodeType[]
}

// DndPanel 组件 Emits
export interface DndPanelEmits {
  (e: 'nodeMouseDown', event: MouseEvent, node: NodeType): void
}

// PropertyPanel 组件 Props
export interface PropertyPanelProps {
  selectedNode: WorkflowNode | null
  getAvailableSourceOptions?: (param: any) => any[]
  getOutputTargetName?: (param: any) => string
  onParamSourceChange?: (param: any, value: any) => void
  onParamInputChange?: (param: any, value: any) => void
  getAvailableTargetOptions?: () => any[]
  getAllAvailableOptions?: (param: any) => any[]
}

// PropertyPanel 组件 Emits
export interface PropertyPanelEmits {
  (e: 'nodeUpdate', nodeId: string, data: Partial<WorkflowNode>): void
  (e: 'paramInputChange', param: any, value: any): void
  (e: 'paramSourceChange', param: any, value: any): void
}
