// ============================================================
// 交互组件类型声明
// ============================================================

export interface SplitPaneProps {
  /** 左侧面板占比 0~1（v-model:ratio） */
  ratio?: number;
  /** 最小占比 */
  minRatio?: number;
  /** 最大占比 */
  maxRatio?: number;
}

export interface SplitPaneEmits {
  (e: "update:ratio", ratio: number): void;
  (e: "change", ratio: number): void;
}

export interface DragSortItem {
  id: string | number;
  label: string;
}

export interface DragSortListProps {
  /** 列表项（v-model） */
  modelValue: DragSortItem[];
}

export interface DragSortListEmits {
  (e: "update:modelValue", items: DragSortItem[]): void;
  (e: "change", items: DragSortItem[]): void;
}

export interface FloatingToolbarProps {
  /** 选中数量，大于 0 时显示工具栏 */
  count: number;
}

export interface FloatingToolbarEmits {
  (e: "action", action: string): void;
}

export interface TreeTransferNode {
  id: string;
  label: string;
  children?: TreeTransferNode[];
}

export interface TreeTransferProps {
  /** 树形数据 */
  data: TreeTransferNode[];
  /** 已选节点 id（v-model） */
  modelValue: string[];
}

export interface TreeTransferEmits {
  (e: "update:modelValue", ids: string[]): void;
  (e: "change", ids: string[]): void;
}

export interface StepWizardStep {
  title: string;
  description?: string;
}

export interface StepWizardProps {
  steps: StepWizardStep[];
  /** 当前步骤（v-model:step） */
  step?: number;
}

export interface StepWizardEmits {
  (e: "update:step", step: number): void;
  (e: "change", step: number): void;
  (e: "finish"): void;
}

export interface ContextMenuItem {
  label: string;
  shortcut?: string;
  danger?: boolean;
  action?: string;
}

export interface ContextMenuProps {
  items: ContextMenuItem[];
}

export interface ContextMenuEmits {
  (e: "select", item: ContextMenuItem): void;
}

export interface CanvasTimeProps {
  /** 粒子颜色 */
  color?: string;
  /** 画布背景色 */
  bgColor?: string;
}

export interface CanvasCountUpProps {
  /** 目标数值 */
  value: number;
  /** 动画时长（ms） */
  duration?: number;
}

export interface CanvasCountUpEmits {
  (e: "finish"): void;
}

export interface HeatmapCell {
  date: string;
  count: number;
}

export interface HeatmapCalendarProps {
  data: HeatmapCell[];
}

export interface HeatmapCalendarEmits {
  (e: "cell-click", cell: HeatmapCell): void;
}
