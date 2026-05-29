import type { BaseTableColumn } from "@/type/crud";

export type TableHitResult =
  | { kind: "header"; colIndex: number }
  | { kind: "body"; colIndex: number; rowIndex: number }
  | null;

/** 文档坐标（含滚动）：x,y 从表格内容区左上角起算 */
export function hitTestTable(
  docX: number,
  docY: number,
  headerHeight: number,
  rowHeight: number,
  colWidths: number[],
  dataRowCount: number,
): TableHitResult {
  if (docX < 0 || docY < 0) {
    return null;
  }
  let acc = 0;
  let colIndex = -1;
  for (let i = 0; i < colWidths.length; i++) {
    const w = colWidths[i] ?? 0;
    if (docX < acc + w) {
      colIndex = i;
      break;
    }
    acc += w;
  }
  if (colIndex < 0) {
    return null;
  }
  if (docY < headerHeight) {
    return { kind: "header", colIndex };
  }
  const rowIndex = Math.floor((docY - headerHeight) / rowHeight);
  if (rowIndex < 0 || rowIndex >= dataRowCount) {
    return null;
  }
  return { kind: "body", colIndex, rowIndex };
}

export function hasSelectionColumn(columns: BaseTableColumn[]): boolean {
  return columns.some((c) => c.show !== false && c.type === "selection");
}
