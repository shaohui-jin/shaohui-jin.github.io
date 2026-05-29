import { nextTick, ref, type Ref } from "vue";
import type { BaseTableColumn } from "@/type/crud";
import { canvasCellFont } from "../theme/tableSurface";
import { formatCell, visibleColumns } from "./column";
import { hitTestTable } from "./tableHitTest";

const TOOLTIP_SKIP_TYPES = new Set(["selection", "switch", "image", "tableSlot"]);

function cellTextMaxWidth(col: BaseTableColumn, cellWidth: number): number {
  if (col.type === "status-custom") {
    return Math.max(0, cellWidth - 32);
  }
  return Math.max(0, cellWidth - 16);
}

export interface CanvasTooltipOptions {
  columns: () => BaseTableColumn[];
  colWidths: () => number[];
  data: () => Record<string, unknown>[];
  headerHeight: () => number;
  rowHeight: () => number;
  scrollX: () => number;
  scrollY: () => number;
  measureTextWidth: (text: string) => number;
}

export function useCanvasTooltip(
  containerRef: Ref<HTMLElement | null>,
  options: CanvasTooltipOptions,
) {
  const tooltipAnchorRef = ref<HTMLElement>();
  const tooltipVisible = ref(false);
  const tooltipContent = ref("");

  let lastColIndex = -1;
  let lastRowIndex = -1;
  let rafId = 0;

  function handleMove(e: MouseEvent) {
    const container = containerRef.value;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const sx = options.scrollX();
    const sy = options.scrollY();
    const docX = e.clientX - rect.left + sx;
    const docY = e.clientY - rect.top + sy;

    const vis = visibleColumns(options.columns());
    const widths = options.colWidths();
    const data = options.data();

    const hit = hitTestTable(
      docX,
      docY,
      options.headerHeight(),
      options.rowHeight(),
      widths,
      data.length,
    );

    if (!hit || hit.kind === "header") {
      tooltipVisible.value = false;
      lastColIndex = -1;
      lastRowIndex = -1;
      return;
    }

    const { colIndex, rowIndex } = hit;

    if (colIndex === lastColIndex && rowIndex === lastRowIndex) {
      return;
    }

    const cellChanged = lastColIndex !== -1 || lastRowIndex !== -1;
    lastColIndex = colIndex;
    lastRowIndex = rowIndex;

    const col = vis[colIndex];
    if (!col || col.showOverflowTooltip === false || TOOLTIP_SKIP_TYPES.has(col.type ?? "")) {
      tooltipVisible.value = false;
      return;
    }

    const row = data[rowIndex];
    if (!row) {
      tooltipVisible.value = false;
      return;
    }

    const text = formatCell(col, row, rowIndex);
    if (!text) {
      tooltipVisible.value = false;
      return;
    }

    const cellW = widths[colIndex] ?? 0;
    const maxW = cellTextMaxWidth(col, cellW);
    const textW = options.measureTextWidth(text);

    if (textW <= maxW) {
      tooltipVisible.value = false;
      return;
    }

    let cellLeft = 0;
    for (let i = 0; i < colIndex; i++) {
      cellLeft += widths[i] ?? 0;
    }
    const cellTop = options.headerHeight() + rowIndex * options.rowHeight();

    tooltipContent.value = text;

    if (cellChanged && tooltipVisible.value) {
      tooltipVisible.value = false;
      nextTick(() => {
        if (tooltipAnchorRef.value) {
          tooltipAnchorRef.value.style.left = `${cellLeft + cellW / 2 - sx}px`;
          tooltipAnchorRef.value.style.top = `${cellTop - sy}px`;
        }
        tooltipVisible.value = true;
      });
    } else {
      if (tooltipAnchorRef.value) {
        tooltipAnchorRef.value.style.left = `${cellLeft + cellW / 2 - sx}px`;
        tooltipAnchorRef.value.style.top = `${cellTop - sy}px`;
      }
      tooltipVisible.value = true;
    }
  }

  function onContainerMousemove(e: MouseEvent) {
    cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => handleMove(e));
  }

  function onContainerMouseleave() {
    cancelAnimationFrame(rafId);
    tooltipVisible.value = false;
    lastColIndex = -1;
    lastRowIndex = -1;
  }

  function hideTooltip() {
    tooltipVisible.value = false;
    lastColIndex = -1;
    lastRowIndex = -1;
  }

  return {
    tooltipAnchorRef,
    tooltipVisible,
    tooltipContent,
    onContainerMousemove,
    onContainerMouseleave,
    hideTooltip,
  };
}

/* ---- Text measurement helpers ---- */

let _measureCtx: CanvasRenderingContext2D | null = null;

/** Canvas 2D text width measurement (for canvas / canvas-tile modes) */
export function canvas2DMeasureTextWidth(text: string): number {
  if (!_measureCtx) {
    const c = document.createElement("canvas");
    c.width = 1;
    c.height = 1;
    _measureCtx = c.getContext("2d")!;
  }
  _measureCtx.font = canvasCellFont();
  return _measureCtx.measureText(text).width;
}
