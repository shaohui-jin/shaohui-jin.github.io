import type { BaseTableColumn } from "@/type/crud";
import {
  canvasCellFont,
  canvasEmptyFont,
  canvasHeaderFont,
  tableLayoutDefaults,
  tableSurfaceConfig,
  type TableSurfaceConfig,
} from "../theme/tableSurface";
import { keyString, rowKeyValue } from "./selectionKeys";
import { formatCell, headerText, statusCustomLampColor, visibleColumns } from "./column";

export interface DrawTable2DOptions {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  scrollX: number;
  scrollY: number;
  headerHeight: number;
  rowHeight: number;
  columns: BaseTableColumn[];
  data: Record<string, unknown>[];
  colWidths: number[];
  /** 设备像素比，用于对齐线条 */
  dpr: number;
  emptyText: string;
  /** 与 ElTable row-key 一致 */
  rowKey: string;
  /** 已选行的 keyString 集合 */
  selectedKeys: Set<string>;
  /** Hover 状态的 selection 列索引，-1 表示无 hover */
  hoverSelCol?: number;
  /** Hover 状态的行索引，-2=无, -1=header, >=0=body 行 */
  hoverSelRow?: number;
  /** 可选的 surface 配置，用于动态主题 */
  surfaceConfig?: TableSurfaceConfig;
}

const t = tableSurfaceConfig;
const CB = 14;

function drawCheckbox2D(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  checked: boolean,
  indeterminate: boolean,
  hover: boolean = false,
) {
  const x = centerX - CB / 2;
  const y = centerY - CB / 2;
  const r = 2;
  ctx.save();
  if (checked || indeterminate) {
    ctx.fillStyle = t.checkboxCheckedBg;
    fillRoundRect(ctx, x, y, CB, CB, r);
    if (indeterminate) {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(x + 3, y + CB / 2 - 1, CB - 6, 2);
    } else {
      ctx.beginPath();
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 1.5;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.moveTo(x + 3, y + CB / 2);
      ctx.lineTo(x + CB / 2 - 0.5, y + CB - 4);
      ctx.lineTo(x + CB - 3, y + 3);
      ctx.stroke();
    }
  } else {
    ctx.strokeStyle = hover ? t.checkboxCheckedBg : t.checkboxBorder;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + CB, y, x + CB, y + CB, r);
    ctx.arcTo(x + CB, y + CB, x, y + CB, r);
    ctx.arcTo(x, y + CB, x, y, r);
    ctx.arcTo(x, y, x + CB, y, r);
    ctx.closePath();
    ctx.stroke();
  }
  ctx.restore();
}

function fillRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
  ctx.fill();
}

function drawSwitch2D(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  checked: boolean,
  disabled: boolean,
) {
  const trackW = 40;
  const trackH = 20;
  const thumbR = 7;
  const gap = 3;
  const x = centerX - trackW / 2;
  const y = centerY - trackH / 2;

  ctx.save();
  ctx.fillStyle = disabled ? "#a8abb2" : checked ? "#409eff" : "#dcdfe6";
  fillRoundRect(ctx, x, y, trackW, trackH, trackH / 2);

  const thumbX = checked ? x + trackW - gap - thumbR : x + gap + thumbR;
  ctx.beginPath();
  ctx.arc(thumbX, centerY, thumbR, 0, Math.PI * 2);
  ctx.fillStyle = "#ffffff";
  ctx.fill();
  ctx.restore();
}

function drawStatusCustom2D(
  ctx: CanvasRenderingContext2D,
  cellLeft: number,
  y: number,
  cw: number,
  rowHeight: number,
  col: BaseTableColumn,
  row: Record<string, unknown>,
  rowIndex: number,
) {
  const text = formatCell(col, row, rowIndex);
  const cy = y + rowHeight / 2;
  ctx.save();
  ctx.beginPath();
  ctx.arc(cellLeft + 8 + 4, cy, 4, 0, Math.PI * 2);
  ctx.fillStyle = statusCustomLampColor(col, row);
  ctx.fill();
  ctx.fillStyle = t.textPrimary;
  ctx.textAlign = "left";
  ctx.font = canvasCellFont();
  const tx = cellLeft + 8 + 8 + 8;
  const maxW = Math.max(0, cw - (tx - cellLeft) - 8);
  ctx.beginPath();
  ctx.rect(cellLeft + 1, y + 1, cw - 2, rowHeight - 2);
  ctx.clip();
  ctx.fillText(truncateText(ctx, text, maxW), tx, cy);
  ctx.restore();
}

function selectionAllState(
  data: Record<string, unknown>[],
  rowKey: string,
  selected: Set<string>,
): { all: boolean; indeterminate: boolean } {
  if (data.length === 0) {
    return { all: false, indeterminate: false };
  }
  let n = 0;
  for (const r of data) {
    if (selected.has(keyString(rowKeyValue(r, rowKey)))) {
      n++;
    }
  }
  return {
    all: n === data.length,
    indeterminate: n > 0 && n < data.length,
  };
}

export function drawTable2D(o: DrawTable2DOptions): void {
  const {
    ctx,
    width,
    height,
    scrollX,
    scrollY,
    headerHeight,
    rowHeight,
    columns,
    data,
    colWidths,
    dpr,
    emptyText,
    rowKey,
    selectedKeys,
  } = o;

  const t = o.surfaceConfig ?? tableSurfaceConfig;

  const vis = visibleColumns(columns);
  ctx.save();
  ctx.scale(dpr, dpr);
  const w = width / dpr;
  const h = height / dpr;

  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = t.surfaceBg;
  ctx.fillRect(0, 0, w, h);

  const totalW = colWidths.reduce((a, b) => a + b, 0);

  if (vis.length === 0) {
    ctx.fillStyle = t.textEmpty;
    ctx.font = canvasEmptyFont();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(emptyText, w / 2, h / 2);
    ctx.restore();
    return;
  }

  const { all: headerAll, indeterminate: headerIndeterminate } = selectionAllState(
    data,
    rowKey,
    selectedKeys,
  );

  function paintHeaderRow() {
    ctx.fillStyle = t.headerBg;
    ctx.fillRect(0, 0, Math.min(w, totalW - scrollX), headerHeight);
    ctx.strokeStyle = t.borderColor;
    ctx.lineWidth = 1;
    let hx = -scrollX;
    for (let i = 0; i < vis.length; i++) {
      const col = vis[i]!;
      const cw = colWidths[i] ?? tableLayoutDefaults.defaultColumnWidth;
      const cellLeft = hx;
      if (cellLeft + cw > 0 && cellLeft < w) {
        ctx.strokeRect(cellLeft, 0, cw, headerHeight);
        if (col.type === "selection") {
          const hoverH = i === o.hoverSelCol && o.hoverSelRow === -1;
          drawCheckbox2D(
            ctx,
            cellLeft + cw / 2,
            headerHeight / 2,
            headerAll,
            headerIndeterminate,
            hoverH,
          );
        } else {
          const ht = headerText(col);
          if (ht) {
            ctx.save();
            ctx.beginPath();
            ctx.rect(cellLeft + 1, 0, cw - 2, headerHeight);
            ctx.clip();
            ctx.font = canvasHeaderFont();
            ctx.fillStyle = t.textHeader;
            ctx.textAlign = "left";
            ctx.fillText(ht, cellLeft + 8, headerHeight / 2);
            ctx.restore();
          }
        }
      }
      hx += cw;
    }
  }

  if (data.length === 0) {
    paintHeaderRow();
    ctx.fillStyle = t.textEmpty;
    ctx.font = canvasEmptyFont();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(emptyText, w / 2, headerHeight + Math.max(0, (h - headerHeight) / 2));
    ctx.strokeStyle = t.borderColor;
    ctx.strokeRect(0, 0, w, h);
    ctx.restore();
    return;
  }

  const x0 = -scrollX;
  ctx.textBaseline = "middle";

  ctx.font = canvasCellFont();

  const startRow = Math.max(0, Math.floor((scrollY - headerHeight) / rowHeight));
  const endRow = Math.min(data.length - 1, Math.ceil((scrollY + h - headerHeight) / rowHeight));

  // Clip body to area below header, draw rows first
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, headerHeight, w, h - headerHeight);
  ctx.clip();

  for (let r = startRow; r <= endRow; r++) {
    const row = data[r]!;
    const y = headerHeight + r * rowHeight - scrollY;
    if (y + rowHeight < headerHeight || y > h) {
      continue;
    }
    ctx.fillStyle = r % 2 === 1 ? t.rowStripe : t.rowBase;
    ctx.fillRect(0, y, Math.min(w, totalW - scrollX), rowHeight);

    let cx = x0;
    for (let c = 0; c < vis.length; c++) {
      const col = vis[c]!;
      const cw = colWidths[c] ?? tableLayoutDefaults.defaultColumnWidth;
      const cellLeft = cx;
      if (cellLeft + cw > 0 && cellLeft < w) {
        ctx.strokeStyle = t.borderColor;
        ctx.strokeRect(cellLeft, y, cw, rowHeight);

        if (col.type === "selection") {
          const checked = selectedKeys.has(keyString(rowKeyValue(row, rowKey)));
          const hoverB = c === o.hoverSelCol && r === o.hoverSelRow;
          drawCheckbox2D(ctx, cellLeft + cw / 2, y + rowHeight / 2, checked, false, hoverB);
        } else if (col.type === "switch") {
          const active = (col.activeValue as string | number | boolean) ?? true;
          drawSwitch2D(
            ctx,
            cellLeft + cw / 2,
            y + rowHeight / 2,
            row[col.key] === active,
            Boolean(col.disabled),
          );
        } else if (col.type === "status-custom") {
          drawStatusCustom2D(ctx, cellLeft, y, cw, rowHeight, col, row, r);
        } else {
          const text = formatCell(col, row, r);
          ctx.fillStyle = t.textPrimary;
          const align =
            col.type === "index"
              ? "center"
              : col.align === "center"
                ? "center"
                : col.align === "right"
                  ? "right"
                  : "left";
          ctx.textAlign = align;
          const tx =
            align === "center"
              ? cellLeft + cw / 2
              : align === "right"
                ? cellLeft + cw - 8
                : cellLeft + 8;
          const maxW = cw - 16;
          ctx.save();
          ctx.beginPath();
          ctx.rect(cellLeft + 1, y + 1, cw - 2, rowHeight - 2);
          ctx.clip();
          ctx.font = canvasCellFont();
          ctx.fillText(truncateText(ctx, text, maxW), tx, y + rowHeight / 2);
          ctx.restore();
        }
      }
      cx += cw;
    }
  }

  ctx.restore(); // restore body clip

  // Header drawn last so it stays on top
  paintHeaderRow();

  ctx.strokeStyle = t.borderColor;
  ctx.strokeRect(0, 0, w, h);

  ctx.restore();
}

function truncateText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string {
  if (ctx.measureText(text).width <= maxWidth) {
    return text;
  }
  let end = text.length;
  while (end > 0 && ctx.measureText(`${text.slice(0, end)}…`).width > maxWidth) {
    end--;
  }
  return `${text.slice(0, end)}…`;
}
