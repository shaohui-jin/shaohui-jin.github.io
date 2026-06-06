import { OutputData, WorkflowNode } from '@/types/workflow'
import { InjectionKey } from 'vue'

/**
 * 获取输出参数指向的目标节点信息
 * @param node 当前节点对象
 * @param outputParam 当前outputData项
 * @return 目标节点名或"未连接"
 */
export type GetOutputTargetInfo = (nodeData: WorkflowNode, outputParam: OutputData) => string
export const getOutputTargetInfoKey: InjectionKey<GetOutputTargetInfo> =
  Symbol('getOutputTargetInfo')

// 获取可用的上游节点列表
export type GetAvailableSourceOptions = (
  outputParam: OutputData
) => Array<{ label: string; value: string }>
export const getAvailableSourceOptionsKey: InjectionKey<GetAvailableSourceOptions> = Symbol(
  'getAvailableSourceOptions'
)

export type GetAvailableTargetOptions = () => Array<{ label: string; value: string }>
export const getAvailableTargetOptionsKey: InjectionKey<GetAvailableTargetOptions> = Symbol(
  'getAvailableTargetOptions'
)

export type GetAllAvailableOptions = (
  outputParam: OutputData
) => Array<{ label: string; value: string }>
export const getAllAvailableOptionsKey: InjectionKey<GetAllAvailableOptions> =
  Symbol('getAllAvailableOptions')
