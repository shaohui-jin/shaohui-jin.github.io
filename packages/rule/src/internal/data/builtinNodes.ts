import { type WorkflowNode, LogicType } from "@/types/workflow";

export type BaseFunctionNodeType = {
  funcId: string;
  type: LogicType;
  title: string;
  show?: boolean;
  text?: string;
  template: Partial<WorkflowNode> | null;
};

export const builtinNodes: BaseFunctionNodeType[] = [
  {
    funcId: "1",
    type: LogicType.GLOBAL_PARAM,
    title: "全局参数",
    template: {
      id: "",
      funcId: "",
      funcType: "logic",
      logicData: { logicType: LogicType.GLOBAL_PARAM },
      title: "全局参数",
      remark: "引用全局参数(root/context)，将对应的值直接返回给当前节点",
      inputData: [
        {
          paramName: "paramType",
          type: "any",
          subType: "any",
          source: "root",
          sourceType: "node",
          portId: "in_1",
          defaultValue: "root",
          widgetType: "select",
          attributes: {
            paramType: "string",
            inputType: "text",
            label: "参数类型",
            desc: "这是参数类型的描述",
          },
          options: [
            { label: "root(全场景数据)", value: "root", desc: "全场景数据" },
            { label: "context(指定上下文)", value: "context", desc: "指定上下文" },
          ],
        },
      ],
      outputData: [
        {
          paramName: "result",
          type: "any",
          subType: "any",
          portId: "out_1",
          attributes: {
            paramType: "any",
            inputType: "text",
            label: "返回结果",
          },
        },
      ],
    },
  },
  {
    funcId: "2",
    type: LogicType.GLOBAL_VARIABLE,
    title: "全局变量",
    template: {
      id: "",
      funcId: "",
      funcType: "logic",
      logicData: { logicType: LogicType.GLOBAL_VARIABLE },
      title: "全局变量",
      remark: "获取任意节点的结果",
      inputData: [
        {
          paramName: "nodeId",
          type: "string",
          source: "",
          sourceType: "global",
          widgetType: "select",
          portId: "in_1",
          defaultValue: "",
          attributes: {
            paramType: "string",
            inputType: "text",
            label: "节点Id",
          },
          options: [],
        },
      ],
      outputData: [
        {
          paramName: "result",
          type: "any",
          subType: "any",
          portId: "out_1",
          attributes: {
            paramType: "any",
            inputType: "text",
            label: "返回结果",
          },
        },
      ],
    },
  },
  {
    funcId: "3",
    type: LogicType.CALCULATOR,
    title: "计算器",
    template: {
      id: "",
      funcId: "",
      funcType: "logic",
      logicData: { logicType: LogicType.CALCULATOR, source: "", condition: "" },
      title: "计算器",
      remark:
        "函数名称不受影响，data、data1等为连接当前节点的上游参数\n" +
        "function demo(data, data1, data2) {\n" +
        "    return { data, data1, data2 }\n" +
        "}",
      inputData: [
        {
          paramName: "data",
          type: "any",
          subType: "any",
          source: "",
          sourceType: "input",
          portId: "in_1",
          defaultValue: "",
          attributes: {
            paramType: "any",
            inputType: "text",
            label: "上游数据",
          },
        },
      ],
      outputData: [
        {
          paramName: "result",
          type: "any",
          subType: "any",
          functionCode:
            "function demo(data, data1, data2) {\n" + "    return { data, data1, data2 }\n" + "}",
          portId: "out_1",
          attributes: {
            paramType: "any",
            inputType: "text",
            label: "返回结果",
          },
        },
      ],
    },
  },
  {
    funcId: "4",
    type: LogicType.IFELSE,
    title: "条件函数",
    template: {
      id: "",
      funcId: "",
      funcType: "logic",
      logicData: { logicType: LogicType.IFELSE, source: "", condition: "" },
      title: "条件判断",
      remark: "填写函数表达式，如 `data === true`，data、data1等为连接当前节点的上游参数",
      inputData: [
        {
          paramName: "data",
          type: "any",
          subType: "any",
          source: "",
          sourceType: "input",
          portId: "in_1",
          defaultValue: "",
          attributes: {
            paramType: "any",
            inputType: "text",
            label: "上游数据",
          },
        },
      ],
      outputData: [
        {
          paramName: "result",
          type: "any",
          subType: "any",
          functionCode: "",
          portId: "out_1",
          attributes: {
            paramType: "any",
            inputType: "text",
            label: "if",
          },
        },
        {
          paramName: "result",
          type: "any",
          subType: "any",
          functionCode: "",
          portId: "out_2",
          attributes: {
            paramType: "any",
            inputType: "text",
            label: "else",
          },
        },
      ],
    },
  },
];
