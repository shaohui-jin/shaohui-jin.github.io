<script setup lang="ts">
import { onActivated, onDeactivated, onMounted, onUnmounted, ref, toRef, watch } from "vue";
import { ElTooltip } from "element-plus";
import type { Canvas, CanvasKit, Font, Paint, Surface, Typeface } from "canvaskit-wasm";
import type { BaseTableColumn } from "@/type/crud";
import {
  cssRgbOrRgbaToRgb,
  hexToRgb,
  tableLayoutDefaults,
  tableSurfaceConfig,
  TABLE_TOOLTIP_POPPER_CLASS,
} from "../theme/tableSurface";
import { canvaskitLocateFile } from "../utils/canvaskitLocate";
import {
  formatCell,
  headerText,
  layoutColumnWidths,
  statusCustomLampColor,
  trySwitchToggle,
  visibleColumns,
} from "../utils/column";
import { keyString, rowKeyValue } from "../utils/selectionKeys";
import { hitTestTable } from "../utils/tableHitTest";
import { resolveSkiaTypeface } from "../utils/skiaTypeface";
import { useBaseTableSelection } from "../utils/useBaseTableSelection";
import {
  isClickOnSlotText,
  isClickOnSwitch,
  useCanvasSlotPopup,
} from "../utils/useCanvasSlotPopup";
import { useCanvasTooltip } from "../utils/useCanvasTooltip";
import { useCanvasScrollbar } from "../utils/useCanvasScrollbar";
import { useCanvasCheckboxHover } from "../utils/useCanvasCheckboxHover";
import TableSlotPopup from "./TableSlotPopup.vue";

defineOptions({ name: "BaseTableSkiaWasm" });

const t = tableSurfaceConfig;

const props = withDefaults(
  defineProps<{
    tableData: Record<string, unknown>[];
    columns: BaseTableColumn[];
    rowHeight: number;
    headerHeight: number;
    emptyText: string;
    /** 与 ElTable row-key 一致 */
    rowKey: string;
    /** 覆盖 CanvasKit WASM 根路径；默认使用本地 node_modules（Vite 解析），不访问 CDN */
    skiaWasmBaseUrl?: string;
  }>(),
  {
    rowKey: "id",
    skiaWasmBaseUrl: undefined,
  },
);

const emit = defineEmits<{
  selectionChange: [rows: Record<string, unknown>[]];
}>();

const tableDataRef = toRef(props, "tableData");
const selection = useBaseTableSelection(props.rowKey, tableDataRef);

const containerRef = ref<HTMLDivElement | null>(null);

const { slotTriggerRef, slotPopup, openSlotPopup, closeSlotPopup } =
  useCanvasSlotPopup(containerRef);
const { hoverSelCol, hoverSelRow, updateHover, clearHover } = useCanvasCheckboxHover();

function skiaEstimateTextWidth(text: string): number {
  const narrowW = t.fontSizeCell * 0.55;
  const wideW = t.fontSizeCell * 1.0;
  let w = 0;
  for (let i = 0; i < text.length; i++) {
    w += text.charCodeAt(i) > 0x7f ? wideW : narrowW;
  }
  return w;
}

const {
  tooltipAnchorRef,
  tooltipVisible,
  tooltipContent,
  onContainerMousemove: _tooltipMousemove,
  onContainerMouseleave: _tooltipMouseleave,
  hideTooltip,
} = useCanvasTooltip(containerRef, {
  columns: () => props.columns,
  colWidths: () => colWidths(),
  data: () => props.tableData,
  headerHeight: () => props.headerHeight,
  rowHeight: () => props.rowHeight,
  scrollX: () => scrollX.value,
  scrollY: () => scrollY.value,
  measureTextWidth: skiaEstimateTextWidth,
});

function onContainerMousemove(e: MouseEvent) {
  _tooltipMousemove(e);
  if (
    updateHover(
      e,
      containerRef.value,
      canvasRef.value,
      props.columns,
      colWidths(),
      props.headerHeight,
      props.rowHeight,
      props.tableData.length,
      scrollX.value,
      scrollY.value,
    )
  ) {
    schedulePaint();
  }
}

function onContainerMouseleave() {
  _tooltipMouseleave();
  if (clearHover(canvasRef.value)) schedulePaint();
}

const canvasRef = ref<HTMLCanvasElement | null>(null);
const loadError = ref("");
/** 与 WASM 加载失败区分：仅 Surface 创建失败 */
const surfaceError = ref("");
const scrollX = ref(0);
const scrollY = ref(0);
const cssW = ref(400);
const cssH = ref(300);

const {
  scrollbarVisible,
  hasVBar,
  hasHBar,
  showScrollbar,
  hideScrollbar,
  vTrackStyle,
  vThumbStyle,
  hTrackStyle,
  hThumbStyle,
  onVThumbMousedown,
  onHThumbMousedown,
  onVThumbTouchstart,
  onHThumbTouchstart,
  onVTrackClick,
  onHTrackClick,
} = useCanvasScrollbar({
  scrollX,
  scrollY,
  cssW,
  cssH,
  totalWidth: () => totalWidth(),
  totalHeight: () => totalHeight(),
  headerHeight: () => props.headerHeight,
  onScroll: schedulePaint,
});

let ck: CanvasKit | null = null;
/** null 时勿用 Font(null)，否则 drawText 不显示 */
let skTypeface: Typeface | null = null;
let paintFont: Font | null = null;
let paintFontEmpty: Font | null = null;
let paintFontHeader: Font | null = null;
let surface: Surface | null = null;
let ro: ResizeObserver | null = null;
let raf = 0;
let active = true;
/** 避免每帧改 canvas 尺寸导致 WebGL 上下文丢失、MakeCanvasSurface 返回 null */
let lastPixelW = 0;
let lastPixelH = 0;

const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;

const colWidths = () => layoutColumnWidths(props.columns, cssW.value);
const totalWidth = () => colWidths().reduce((a, b) => a + b, 0);
const totalHeight = () => props.headerHeight + props.tableData.length * props.rowHeight;

function clampScroll() {
  const maxX = Math.max(0, totalWidth() - cssW.value);
  const maxY = Math.max(0, totalHeight() - cssH.value);
  scrollX.value = Math.min(maxX, Math.max(0, scrollX.value));
  scrollY.value = Math.min(maxY, Math.max(0, scrollY.value));
}

/** CanvasKit 的 Color 第四参为 alpha（0–1），不能传 0–255 */
function skColor(rgb: { r: number; g: number; b: number }, a = 1) {
  return ck!.Color(rgb.r, rgb.g, rgb.b, a);
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

/** 与 EP ElCheckbox 视觉对齐：蓝底白勾/白杠 + 圆角 + hover 边框变蓝 */
function drawSkiaCheckbox(
  skCanvas: Canvas,
  centerX: number,
  centerY: number,
  checked: boolean,
  indeterminate: boolean,
  strokePaint: Paint,
  fillPaint: Paint,
  checkStroke: Paint,
  hover: boolean = false,
) {
  const CB = 14 * dpr;
  const r = 2 * dpr;
  const x = centerX - CB / 2;
  const y = centerY - CB / 2;
  const checkedRgb = hexToRgb(t.checkboxCheckedBg);
  const rrect = ck!.RRectXY(ck!.LTRBRect(x, y, x + CB, y + CB), r, r);

  if (checked || indeterminate) {
    fillPaint.setColor(skColor(checkedRgb));
    skCanvas.drawRRect(rrect, fillPaint);
    if (indeterminate) {
      fillPaint.setColor(skColor({ r: 255, g: 255, b: 255 }));
      const barH = 2 * dpr;
      const barW = CB - 6 * dpr;
      skCanvas.drawRect(
        ck!.LTRBRect(x + 3 * dpr, y + CB / 2 - barH / 2, x + 3 * dpr + barW, y + CB / 2 + barH / 2),
        fillPaint,
      );
    } else {
      checkStroke.setColor(skColor({ r: 255, g: 255, b: 255 }));
      checkStroke.setStrokeWidth(1.5 * dpr);
      skCanvas.drawLine(
        x + 3 * dpr,
        y + CB / 2,
        x + CB / 2 - 0.5 * dpr,
        y + CB - 4 * dpr,
        checkStroke,
      );
      skCanvas.drawLine(
        x + CB / 2 - 0.5 * dpr,
        y + CB - 4 * dpr,
        x + CB - 3 * dpr,
        y + 3 * dpr,
        checkStroke,
      );
    }
  } else {
    const borderRgb = hover ? checkedRgb : hexToRgb(t.checkboxBorder);
    strokePaint.setColor(skColor(borderRgb));
    skCanvas.drawRRect(rrect, strokePaint);
  }
}

async function loadCanvasKit() {
  loadError.value = "";
  try {
    const mod = await import("canvaskit-wasm");
    const init = mod.default;
    ck = await init({
      locateFile: (file: string) => canvaskitLocateFile(file, props.skiaWasmBaseUrl),
    });
    try {
      skTypeface = await resolveSkiaTypeface(ck);
    } catch {
      skTypeface = ck.Typeface.GetDefault();
    }
  } catch {
    loadError.value =
      "CanvasKit（Skia WASM）加载失败：请安装依赖 canvaskit-wasm，或配置可用的 skiaWasmBaseUrl。";
    ck = null;
    skTypeface = null;
  }
}

function disposePaintFonts() {
  paintFont?.delete?.();
  paintFontEmpty?.delete?.();
  paintFontHeader?.delete?.();
  paintFont = null;
  paintFontEmpty = null;
  paintFontHeader = null;
}

function ensurePaintFonts(): { cell: Font; empty: Font; header: Font } {
  const face = skTypeface ?? ck!.Typeface.GetDefault();
  const cellSize = t.fontSizeCell * dpr;
  const emptySize = t.fontSizeEmpty * dpr;
  if (!paintFont || !paintFontEmpty || !paintFontHeader) {
    disposePaintFonts();
    paintFont = new ck!.Font(face, cellSize);
    paintFontEmpty = new ck!.Font(face, emptySize);
    paintFontHeader = new ck!.Font(face, cellSize);
    paintFontHeader.setEmbolden(true);
  } else {
    paintFont.setTypeface(face);
    paintFont.setSize(cellSize);
    paintFontEmpty.setTypeface(face);
    paintFontEmpty.setSize(emptySize);
    paintFontHeader.setTypeface(face);
    paintFontHeader.setSize(cellSize);
    paintFontHeader.setEmbolden(true);
  }
  return { cell: paintFont, empty: paintFontEmpty, header: paintFontHeader };
}

function disposeSurface() {
  surface?.delete?.();
  surface = null;
}

function ensureCanvasSurface(
  canvas: HTMLCanvasElement,
  cssWidth: number,
  cssHeight: number,
): Surface | null {
  if (!ck) {
    return null;
  }
  const w = Math.max(1, Math.floor(cssWidth * dpr));
  const h = Math.max(1, Math.floor(cssHeight * dpr));
  if (surface && w === lastPixelW && h === lastPixelH) {
    return surface;
  }
  disposeSurface();
  canvas.width = w;
  canvas.height = h;
  canvas.style.width = `${cssWidth}px`;
  canvas.style.height = `${cssHeight}px`;
  lastPixelW = w;
  lastPixelH = h;
  const s =
    ck.MakeWebGLCanvasSurface(canvas) ??
    ck.MakeSWCanvasSurface(canvas) ??
    ck.MakeCanvasSurface(canvas);
  surface = s;
  return s;
}

function paintSkia() {
  if (!ck || !canvasRef.value) {
    return;
  }
  const canvas = canvasRef.value;
  const widths = colWidths();
  const tw = totalWidth();
  const vis = visibleColumns(props.columns);
  const selectedKeys = selection.selectedKeys.value;
  const { all: headerAll, indeterminate: headerIndeterminate } = selectionAllState(
    props.tableData,
    props.rowKey,
    selectedKeys,
  );

  const surf = ensureCanvasSurface(canvas, cssW.value, cssH.value);
  if (!surf) {
    surfaceError.value = "CanvasKit 无法创建绘图 Surface（请检查 WebGL/Canvas 是否可用）。";
    return;
  }
  surfaceError.value = "";
  const skCanvas = surf.getCanvas();
  const surfaceRgb = hexToRgb(t.surfaceBg);
  skCanvas.clear(skColor(surfaceRgb));

  const borderRgb = hexToRgb(t.borderColor);
  const strokePaint = new ck.Paint();
  strokePaint.setStyle(ck.PaintStyle.Stroke);
  strokePaint.setStrokeWidth(1);
  strokePaint.setAntiAlias(true);
  strokePaint.setColor(skColor(borderRgb));

  const fillPaint = new ck.Paint();
  fillPaint.setStyle(ck.PaintStyle.Fill);
  fillPaint.setAntiAlias(true);

  const checkStroke = new ck.Paint();
  checkStroke.setStyle(ck.PaintStyle.Stroke);
  checkStroke.setStrokeWidth(1);
  checkStroke.setAntiAlias(true);
  checkStroke.setColor(skColor(hexToRgb(t.textPrimary)));

  const { cell: fontCell, empty: fontEmpty, header: fontHeader } = ensurePaintFonts();

  const wPx = cssW.value * dpr;
  const hPx = cssH.value * dpr;

  if (vis.length === 0) {
    const emptyPaint = new ck.Paint();
    emptyPaint.setAntiAlias(true);
    emptyPaint.setColor(skColor(hexToRgb(t.textEmpty)));
    const txt = props.emptyText;
    const approxHalf = txt.length * t.fontSizeEmpty * dpr * 0.32;
    skCanvas.drawText(
      txt,
      wPx / 2 - approxHalf,
      hPx / 2 + t.fontSizeEmpty * dpr * 0.35,
      emptyPaint,
      fontEmpty,
    );
    strokePaint.setColor(skColor(borderRgb));
    skCanvas.drawRect(ck.LTRBRect(0.5, 0.5, wPx - 0.5, hPx - 0.5), strokePaint);
    surf.flush();
    return;
  }

  const cellTextPaint = new ck.Paint();
  cellTextPaint.setAntiAlias(true);
  cellTextPaint.setColor(skColor(hexToRgb(t.textPrimary)));

  const lampFillPaint = new ck.Paint();
  lampFillPaint.setStyle(ck.PaintStyle.Fill);
  lampFillPaint.setAntiAlias(true);

  const headerTextPaint = new ck.Paint();
  headerTextPaint.setAntiAlias(true);
  headerTextPaint.setColor(skColor(hexToRgb(t.textHeader)));

  const hhPx = props.headerHeight * dpr;

  if (props.tableData.length === 0) {
    // Draw header (only horizontal scroll)
    skCanvas.save();
    skCanvas.translate(-scrollX.value * dpr, 0);
    const headerRgb = hexToRgb(t.headerBg);
    fillPaint.setColor(skColor(headerRgb));
    skCanvas.drawRect(ck.LTRBRect(0, 0, tw * dpr, hhPx), fillPaint);
    let hx2 = 0;
    for (let i = 0; i < vis.length; i++) {
      const col = vis[i]!;
      const cw = (widths[i] ?? tableLayoutDefaults.defaultColumnWidth) * dpr;
      skCanvas.drawRect(ck.LTRBRect(hx2, 0, hx2 + cw, hhPx), strokePaint);
      if (col.type !== "selection") {
        const ht = headerText(col);
        if (ht) {
          skCanvas.drawText(
            ht,
            hx2 + 8 * dpr,
            (props.headerHeight / 2 + 5) * dpr,
            headerTextPaint,
            fontHeader,
          );
        }
      }
      hx2 += cw;
    }
    skCanvas.restore();

    const emptyPaint = new ck.Paint();
    emptyPaint.setAntiAlias(true);
    emptyPaint.setColor(skColor(hexToRgb(t.textEmpty)));
    const txt = props.emptyText;
    const approxHalf = txt.length * t.fontSizeEmpty * dpr * 0.32;
    const ey = (props.headerHeight + Math.max(0, (cssH.value - props.headerHeight) / 2)) * dpr;
    skCanvas.drawText(
      txt,
      (cssW.value / 2) * dpr - approxHalf,
      ey + t.fontSizeEmpty * dpr * 0.35,
      emptyPaint,
      fontEmpty,
    );
    strokePaint.setColor(skColor(borderRgb));
    skCanvas.drawRect(ck.LTRBRect(0.5, 0.5, wPx - 0.5, hPx - 0.5), strokePaint);
    surf.flush();
    return;
  }

  const stripeRgb = hexToRgb(t.rowStripe);
  const baseRgb = hexToRgb(t.rowBase);

  const startRow = Math.max(0, Math.floor((scrollY.value - props.headerHeight) / props.rowHeight));
  const endRow = Math.min(
    props.tableData.length - 1,
    Math.ceil((scrollY.value + cssH.value - props.headerHeight) / props.rowHeight),
  );

  const narrowCharW = t.fontSizeCell * dpr * 0.55;
  const wideCharW = t.fontSizeCell * dpr * 1.0;

  function estimateTextWidth(text: string): number {
    let w = 0;
    for (let i = 0; i < text.length; i++) {
      w += text.charCodeAt(i) > 0x7f ? wideCharW : narrowCharW;
    }
    return w;
  }

  function truncateToFit(text: string, maxW: number): string {
    if (estimateTextWidth(text) <= maxW) return text;
    let w = 0;
    const ellipsisW = narrowCharW;
    for (let i = 0; i < text.length; i++) {
      w += text.charCodeAt(i) > 0x7f ? wideCharW : narrowCharW;
      if (w + ellipsisW > maxW) {
        return `${text.slice(0, Math.max(1, i))}…`;
      }
    }
    return text;
  }

  // Body rows: clip to area below header, translate for scroll
  skCanvas.save();
  skCanvas.clipRect(ck.LTRBRect(0, hhPx, wPx, hPx), ck.ClipOp.Intersect, true);
  skCanvas.translate(-scrollX.value * dpr, -scrollY.value * dpr);

  for (let r = startRow; r <= endRow; r++) {
    const row = props.tableData[r]!;
    const y = props.headerHeight + r * props.rowHeight;
    const yd = y * dpr;
    const rh = props.rowHeight * dpr;
    const rowBg = r % 2 === 1 ? stripeRgb : baseRgb;
    fillPaint.setColor(skColor(rowBg));
    skCanvas.drawRect(ck.LTRBRect(0, yd, tw * dpr, yd + rh), fillPaint);

    let cx = 0;
    for (let c = 0; c < vis.length; c++) {
      const col = vis[c]!;
      const cellW = (widths[c] ?? tableLayoutDefaults.defaultColumnWidth) * dpr;
      strokePaint.setColor(skColor(borderRgb));
      skCanvas.drawRect(ck.LTRBRect(cx, yd, cx + cellW, yd + rh), strokePaint);
      const midY = (y + props.rowHeight / 2 + 5) * dpr;
      if (col.type === "selection") {
        const checked = selectedKeys.has(keyString(rowKeyValue(row, props.rowKey)));
        const hoverB = c === hoverSelCol.value && r === hoverSelRow.value;
        drawSkiaCheckbox(
          skCanvas,
          cx + cellW / 2,
          y * dpr + rh / 2,
          checked,
          false,
          strokePaint,
          fillPaint,
          checkStroke,
          hoverB,
        );
      } else if (col.type === "switch") {
        const activeVal = (col.activeValue as string | number | boolean) ?? true;
        const isOn = row[col.key] === activeVal;
        const isDisabled = Boolean(col.disabled);
        const tW = 40 * dpr;
        const tH = 20 * dpr;
        const tR = 7 * dpr;
        const gap = 3 * dpr;
        const trackX = cx + cellW / 2 - tW / 2;
        const trackY = y * dpr + rh / 2 - tH / 2;
        const trackColor = isDisabled
          ? { r: 168, g: 171, b: 178 }
          : isOn
            ? { r: 64, g: 158, b: 255 }
            : { r: 220, g: 223, b: 230 };
        fillPaint.setColor(skColor(trackColor));
        skCanvas.drawRRect(
          ck.RRectXY(ck.LTRBRect(trackX, trackY, trackX + tW, trackY + tH), tH / 2, tH / 2),
          fillPaint,
        );
        const thumbX = isOn ? trackX + tW - gap - tR : trackX + gap + tR;
        fillPaint.setColor(skColor({ r: 255, g: 255, b: 255 }));
        skCanvas.drawCircle(thumbX, y * dpr + rh / 2, tR, fillPaint);
      } else if (col.type === "status-custom") {
        const text = formatCell(col, row, r);
        lampFillPaint.setColor(skColor(cssRgbOrRgbaToRgb(statusCustomLampColor(col, row))));
        skCanvas.drawCircle(cx + 8 * dpr + 4 * dpr, y * dpr + rh / 2, 4 * dpr, lampFillPaint);
        const tx = cx + 8 * dpr + 8 * dpr + 8 * dpr;
        const maxTw = Math.max(4 * dpr, cellW - (tx - cx) - 8 * dpr);
        const shown = truncateToFit(text, maxTw);
        skCanvas.save();
        skCanvas.clipRect(
          ck!.LTRBRect(cx + 1, yd + 1, cx + cellW - 1, yd + rh - 1),
          ck!.ClipOp.Intersect,
          true,
        );
        skCanvas.drawText(shown, tx, midY, cellTextPaint, fontCell);
        skCanvas.restore();
      } else {
        const text = formatCell(col, row, r);
        const align =
          col.type === "index"
            ? "center"
            : col.align === "center"
              ? "center"
              : col.align === "right"
                ? "right"
                : "left";
        const padding = 8 * dpr;
        const maxTw = Math.max(4 * dpr, cellW - padding * 2);
        const shown = truncateToFit(text, maxTw);
        const shownW = estimateTextWidth(shown);
        let tx: number;
        if (align === "center") {
          tx = cx + cellW / 2 - shownW / 2;
        } else if (align === "right") {
          tx = cx + cellW - padding - shownW;
        } else {
          tx = cx + padding;
        }
        skCanvas.save();
        skCanvas.clipRect(
          ck!.LTRBRect(cx + 1, yd + 1, cx + cellW - 1, yd + rh - 1),
          ck!.ClipOp.Intersect,
          true,
        );
        skCanvas.drawText(shown, tx, midY, cellTextPaint, fontCell);
        skCanvas.restore();
      }
      cx += cellW;
    }
  }

  skCanvas.restore(); // restore body clip + translate

  // Header: drawn last, only horizontal scroll, always at top
  skCanvas.save();
  skCanvas.translate(-scrollX.value * dpr, 0);

  const headerRgb = hexToRgb(t.headerBg);
  fillPaint.setColor(skColor(headerRgb));
  skCanvas.drawRect(ck.LTRBRect(0, 0, tw * dpr, hhPx), fillPaint);

  let hx = 0;
  for (let i = 0; i < vis.length; i++) {
    const col = vis[i]!;
    const cw = (widths[i] ?? tableLayoutDefaults.defaultColumnWidth) * dpr;
    strokePaint.setColor(skColor(borderRgb));
    skCanvas.drawRect(ck.LTRBRect(hx, 0, hx + cw, hhPx), strokePaint);
    if (col.type === "selection") {
      const hoverH = i === hoverSelCol.value && hoverSelRow.value === -1;
      drawSkiaCheckbox(
        skCanvas,
        hx + cw / 2,
        (props.headerHeight / 2) * dpr,
        headerAll,
        headerIndeterminate,
        strokePaint,
        fillPaint,
        checkStroke,
        hoverH,
      );
    } else {
      const ht = headerText(col);
      if (ht) {
        skCanvas.drawText(
          ht,
          hx + 8 * dpr,
          (props.headerHeight / 2 + 5) * dpr,
          headerTextPaint,
          fontHeader,
        );
      }
    }
    hx += cw;
  }

  skCanvas.restore(); // restore header translate

  strokePaint.setColor(skColor(borderRgb));
  skCanvas.drawRect(ck.LTRBRect(0.5, 0.5, wPx - 0.5, hPx - 0.5), strokePaint);

  surf.flush();
}

function schedulePaint() {
  cancelAnimationFrame(raf);
  if (!active) return;
  raf = requestAnimationFrame(() => {
    clampScroll();
    paintSkia();
  });
}

function onWheel(e: WheelEvent) {
  e.preventDefault();
  hideTooltip();
  clearHover(canvasRef.value);
  showScrollbar();
  if (e.shiftKey) {
    scrollX.value += e.deltaY;
  } else {
    scrollY.value += e.deltaY;
  }
  schedulePaint();
}

// -- Touch scroll --
let touchStartX = 0;
let touchStartY = 0;
let touchScrollX0 = 0;
let touchScrollY0 = 0;
let isTouchDragging = false;

function onTouchStart(e: TouchEvent) {
  if (e.touches.length !== 1) return;
  const t = e.touches[0];
  touchStartX = t.clientX;
  touchStartY = t.clientY;
  touchScrollX0 = scrollX.value;
  touchScrollY0 = scrollY.value;
  isTouchDragging = false;
  showScrollbar();
}

function onTouchMove(e: TouchEvent) {
  if (e.touches.length !== 1) return;
  const t = e.touches[0];
  const dx = touchStartX - t.clientX;
  const dy = touchStartY - t.clientY;

  if (!isTouchDragging && Math.abs(dx) < 4 && Math.abs(dy) < 4) return;
  isTouchDragging = true;
  e.preventDefault();

  scrollX.value = touchScrollX0 + dx;
  scrollY.value = touchScrollY0 + dy;
  schedulePaint();
}

function onTouchEnd() {
  isTouchDragging = false;
  hideScrollbar();
}

function onCanvasClick(e: MouseEvent) {
  const canvas = canvasRef.value;
  if (!canvas) {
    return;
  }
  const vis = visibleColumns(props.columns);
  const rect = canvas.getBoundingClientRect();
  const docX = e.clientX - rect.left + scrollX.value;
  const docY = e.clientY - rect.top + scrollY.value;
  const hit = hitTestTable(
    docX,
    docY,
    props.headerHeight,
    props.rowHeight,
    colWidths(),
    props.tableData.length,
  );
  if (!hit) {
    closeSlotPopup();
    return;
  }
  const col = vis[hit.colIndex];
  if (col?.type === "tableSlot" && hit.kind === "body") {
    if (isClickOnSlotText(docX, colWidths(), hit.colIndex)) {
      const row = props.tableData[hit.rowIndex];
      if (row) {
        openSlotPopup(row, col, e.clientX - rect.left, e.clientY - rect.top);
      }
      return;
    }
  }
  closeSlotPopup();
  if (col?.type === "switch" && hit.kind === "body") {
    if (
      isClickOnSwitch(
        docX,
        docY,
        colWidths(),
        hit.colIndex,
        props.headerHeight,
        props.rowHeight,
        hit.rowIndex,
      )
    ) {
      const row = props.tableData[hit.rowIndex];
      if (row) {
        trySwitchToggle(row, col).then((newVal) => {
          if (newVal !== null) schedulePaint();
        });
      }
    }
    return;
  }
  if (col?.type !== "selection") {
    return;
  }
  if (hit.kind === "header") {
    emit("selectionChange", selection.toggleAll());
  } else if (hit.kind === "body") {
    const row = props.tableData[hit.rowIndex];
    if (row) {
      emit("selectionChange", selection.toggleRow(row));
    }
  }
  schedulePaint();
}

onMounted(async () => {
  await loadCanvasKit();
  const el = containerRef.value;
  if (el) {
    ro = new ResizeObserver((entries) => {
      const cr = entries[0]?.contentRect;
      if (cr) {
        cssW.value = Math.floor(cr.width);
        cssH.value = Math.floor(cr.height);
        schedulePaint();
      }
    });
    ro.observe(el);
  }
  schedulePaint();
});

onActivated(() => {
  active = true;
  schedulePaint();
});

onDeactivated(() => {
  active = false;
  cancelAnimationFrame(raf);
});

onUnmounted(() => {
  ro?.disconnect();
  cancelAnimationFrame(raf);
  disposeSurface();
  disposePaintFonts();
  lastPixelW = 0;
  lastPixelH = 0;
  skTypeface = null;
  ck = null;
});

watch(
  () => [
    props.tableData,
    props.columns,
    props.emptyText,
    props.rowHeight,
    props.headerHeight,
    props.rowKey,
  ],
  () => schedulePaint(),
  { deep: true },
);

watch(selection.selectedKeys, () => schedulePaint());
</script>

<template>
  <div
    ref="containerRef"
    class="crud-base-table__skia"
    tabindex="0"
    @wheel="onWheel"
    @mouseenter="showScrollbar"
    @mousemove="onContainerMousemove"
    @mouseleave="
      () => {
        onContainerMouseleave();
        hideScrollbar();
      }
    "
    @touchstart.passive="onTouchStart"
    @touchmove="onTouchMove"
    @touchend="onTouchEnd"
  >
    <div v-if="loadError" class="crud-base-table__skia-message">{{ loadError }}</div>
    <div v-else-if="surfaceError" class="crud-base-table__skia-message">{{ surfaceError }}</div>
    <canvas
      v-show="!loadError"
      ref="canvasRef"
      class="crud-base-table__skia-surface"
      @click="onCanvasClick"
    />
    <div
      v-if="hasVBar"
      class="canvas-scrollbar is-vertical"
      :class="{ 'is-visible': scrollbarVisible }"
      :style="vTrackStyle"
      @click="onVTrackClick"
      @mouseenter="hideTooltip"
      @mousemove.stop
    >
      <div
        class="canvas-scrollbar__thumb"
        :style="vThumbStyle"
        @mousedown="onVThumbMousedown"
        @touchstart="onVThumbTouchstart"
      />
    </div>
    <div
      v-if="hasHBar"
      class="canvas-scrollbar is-horizontal"
      :class="{ 'is-visible': scrollbarVisible }"
      :style="hTrackStyle"
      @click="onHTrackClick"
      @mouseenter="hideTooltip"
      @mousemove.stop
    >
      <div
        class="canvas-scrollbar__thumb"
        :style="hThumbStyle"
        @mousedown="onHThumbMousedown"
        @touchstart="onHThumbTouchstart"
      />
    </div>
    <span
      ref="slotTriggerRef"
      class="crud-base-table__slot-anchor"
      :style="{ left: slotPopup.x + 'px', top: slotPopup.y + 'px' }"
    />
    <TableSlotPopup
      v-model:visible="slotPopup.visible"
      :row="slotPopup.row"
      :column="slotPopup.column"
      :trigger-ref="slotTriggerRef"
    />
    <span ref="tooltipAnchorRef" class="crud-base-table__tooltip-anchor" />
    <ElTooltip
      v-if="tooltipAnchorRef"
      :virtual-ref="tooltipAnchorRef"
      virtual-triggering
      :visible="tooltipVisible"
      :content="tooltipContent"
      placement="top"
      :teleported="true"
      :show-arrow="true"
      :offset="8"
      :enterable="false"
      :popper-class="TABLE_TOOLTIP_POPPER_CLASS"
    />
  </div>
</template>

<style scoped lang="scss">
@use "@/style/variables" as *;

.crud-base-table__skia {
  position: relative;
  height: 100%;
  min-height: 120px;
  outline: none;
  overflow: hidden;
}

.crud-base-table__skia-message {
  padding: 12px;
  font-size: 13px;
  color: var(--el-color-danger);
}

.crud-base-table__skia-surface {
  display: block;
  vertical-align: top;
}

.crud-base-table__slot-anchor,
.crud-base-table__tooltip-anchor {
  position: absolute;
  width: 1px;
  height: 1px;
  pointer-events: none;
}

.canvas-scrollbar {
  position: absolute;
  border-radius: 4px;
  z-index: 1;
  opacity: 0;
  transition: opacity 120ms ease-out;

  &.is-visible {
    opacity: 1;
    transition: opacity 340ms ease-out;
  }

  &.is-vertical {
    right: 2px;
    width: 6px;
  }

  &.is-horizontal {
    bottom: 2px;
    left: 2px;
    height: 6px;
  }
}

.canvas-scrollbar__thumb {
  position: absolute;
  border-radius: inherit;
  background-color: $lib-text-secondary;
  opacity: 0.3;
  cursor: pointer;
  transition: opacity 0.3s;

  &:hover {
    opacity: 0.5;
  }

  .is-vertical & {
    width: 100%;
    left: 0;
  }

  .is-horizontal & {
    height: 100%;
    top: 0;
  }
}
</style>
