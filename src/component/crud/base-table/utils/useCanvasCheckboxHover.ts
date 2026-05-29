import { ref } from "vue";
import type { BaseTableColumn } from "@/type/crud";
import { hitTestTable } from "./tableHitTest";
import { visibleColumns } from "./column";

/**
 * Canvas 系模式下 selection checkbox 的 hover 状态追踪。
 * hoverSelRow: -2 = 无 hover, -1 = header, >= 0 = body 行索引
 */
export function useCanvasCheckboxHover() {
  const hoverSelCol = ref(-1);
  const hoverSelRow = ref(-2);

  function updateHover(
    e: MouseEvent,
    container: HTMLElement | null,
    canvas: HTMLCanvasElement | null,
    columns: BaseTableColumn[],
    colWidths: number[],
    headerHeight: number,
    rowHeight: number,
    dataLength: number,
    scrollX: number,
    scrollY: number,
  ): boolean {
    if (!container) return false;
    const rect = container.getBoundingClientRect();
    const docX = e.clientX - rect.left + scrollX;
    const docY = e.clientY - rect.top + scrollY;
    const vis = visibleColumns(columns);
    const hit = hitTestTable(docX, docY, headerHeight, rowHeight, colWidths, dataLength);
    let newCol = -1;
    let newRow = -2;
    if (hit) {
      const col = vis[hit.colIndex];
      if (col?.type === "selection") {
        newCol = hit.colIndex;
        newRow = hit.kind === "header" ? -1 : hit.rowIndex;
      }
    }
    if (canvas) {
      canvas.style.cursor = newCol >= 0 ? "pointer" : "";
    }
    if (newCol !== hoverSelCol.value || newRow !== hoverSelRow.value) {
      hoverSelCol.value = newCol;
      hoverSelRow.value = newRow;
      return true;
    }
    return false;
  }

  function clearHover(canvas: HTMLCanvasElement | null): boolean {
    if (canvas) canvas.style.cursor = "";
    if (hoverSelCol.value !== -1 || hoverSelRow.value !== -2) {
      hoverSelCol.value = -1;
      hoverSelRow.value = -2;
      return true;
    }
    return false;
  }

  return { hoverSelCol, hoverSelRow, updateHover, clearHover };
}
