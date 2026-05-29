import { onMounted, onUnmounted, reactive, ref, type Ref } from "vue";
import type { BaseTableColumn } from "@/type/crud";
import { tableSurfaceConfig } from "../theme/tableSurface";

/** 判断点击坐标是否落在 switch 图形区域内（40×20 居中绘制） */
export function isClickOnSwitch(
  docX: number,
  docY: number,
  colWidths: number[],
  colIndex: number,
  headerHeight: number,
  rowHeight: number,
  rowIndex: number,
): boolean {
  let cellLeft = 0;
  for (let i = 0; i < colIndex; i++) {
    cellLeft += colWidths[i];
  }
  const cellWidth = colWidths[colIndex] ?? 0;
  const switchW = 40;
  const switchH = 20;
  const cx = cellLeft + cellWidth / 2;
  const rowTop = headerHeight + rowIndex * rowHeight;
  const cy = rowTop + rowHeight / 2;
  return (
    docX >= cx - switchW / 2 &&
    docX <= cx + switchW / 2 &&
    docY >= cy - switchH / 2 &&
    docY <= cy + switchH / 2
  );
}

/** 判断点击坐标是否落在 tableSlot 单元格的"查看"文字区域内 */
export function isClickOnSlotText(docX: number, colWidths: number[], colIndex: number): boolean {
  let cellLeft = 0;
  for (let i = 0; i < colIndex; i++) {
    cellLeft += colWidths[i];
  }
  const padding = 8;
  const charWidth = tableSurfaceConfig.fontSizeCell;
  const textWidth = 2 * charWidth + 6;
  return docX >= cellLeft + padding - 2 && docX <= cellLeft + padding + textWidth;
}

export interface CanvasSlotPopupState {
  visible: boolean;
  row: Record<string, unknown> | null;
  column: BaseTableColumn | null;
  x: number;
  y: number;
}

/**
 * canvas 系模式共用的 tableSlot 弹窗状态管理。
 * 提供锚点 ref、弹窗状态、打开/关闭方法，以及画布外的 click-outside 自动关闭。
 */
export function useCanvasSlotPopup(containerRef: Ref<HTMLElement | null>) {
  const slotTriggerRef = ref<HTMLElement>();

  const slotPopup: CanvasSlotPopupState = reactive({
    visible: false,
    row: null,
    column: null,
    x: 0,
    y: 0,
  });

  function openSlotPopup(row: Record<string, unknown>, col: BaseTableColumn, x: number, y: number) {
    slotPopup.row = row;
    slotPopup.column = col;
    slotPopup.x = x;
    slotPopup.y = y;
    slotPopup.visible = true;
  }

  function closeSlotPopup() {
    slotPopup.visible = false;
  }

  function onDocumentMousedown(e: MouseEvent) {
    if (!slotPopup.visible) return;
    if (containerRef.value?.contains(e.target as Node)) return;
    if ((e.target as HTMLElement)?.closest?.(".table-slot-popover")) return;
    slotPopup.visible = false;
  }

  onMounted(() => {
    document.addEventListener("mousedown", onDocumentMousedown);
  });

  onUnmounted(() => {
    document.removeEventListener("mousedown", onDocumentMousedown);
  });

  return { slotTriggerRef, slotPopup, openSlotPopup, closeSlotPopup };
}
