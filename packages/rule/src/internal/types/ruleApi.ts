import type { InputData, OutputData } from "./workflow";

/** 规则测试执行记录 */
export interface ExecutionRecordData {
  code: string;
  configData: string;
}

/** 函数节点元数据（代码生成用） */
export interface FunctionNode {
  icon: string;
  type: string;
  title: string;
  funcId: string;
  remark: string;
  inputData: InputData[];
  outputData: OutputData[];
  logicData: unknown;
  path: string;
  className: string;
  funcName: string;
}

/** 本地测试执行结果 */
export interface RuleDebugResponseResult {
  duration: number;
  funcStepLogs: Array<Record<string, unknown>>;
  message: string;
  success: boolean;
  error?: unknown;
}
