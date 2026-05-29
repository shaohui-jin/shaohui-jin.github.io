<script setup lang="ts">
import {
  computed,
  onActivated,
  onDeactivated,
  onMounted,
  onUnmounted,
  ref,
  toRef,
  watch,
} from "vue";
import { ElTooltip } from "element-plus";
import type { BaseTableColumn } from "@/type/crud";
import { TABLE_TOOLTIP_POPPER_CLASS } from "../theme/tableSurface";
import { layoutColumnWidths, trySwitchToggle, visibleColumns } from "../utils/column";
import { drawTable2D } from "../utils/canvasDraw";
import { hitTestTable } from "../utils/tableHitTest";
import { useBaseTableSelection } from "../utils/useBaseTableSelection";
import {
  isClickOnSlotText,
  isClickOnSwitch,
  useCanvasSlotPopup,
} from "../utils/useCanvasSlotPopup";
import { useCanvasTooltip, canvas2DMeasureTextWidth } from "../utils/useCanvasTooltip";
import { useCanvasScrollbar } from "../utils/useCanvasScrollbar";
import { useCanvasCheckboxHover } from "../utils/useCanvasCheckboxHover";
import TableSlotPopup from "./TableSlotPopup.vue";

defineOptions({ name: "BaseTableCanvas" });

const props = defineProps<{
  tableData: Record<string, unknown>[];
  columns: BaseTableColumn[];
  rowHeight: number;
  headerHeight: number;
  emptyText: string;
  rowKey: string;
}>();

const emit = defineEmits<{
  selectionChange: [rows: Record<string, unknown>[]];
}>();

const containerRef = ref<HTMLDivElement | null>(null);
const canvasRef = ref<HTMLCanvasElement | null>(null);
const scrollX = ref(0);
const scrollY = ref(0);
const cssW = ref(400);
const cssH = ref(300);

let ro: ResizeObserver | null = null;
let raf = 0;
let active = true;

const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;

const colWidths = computed(() => layoutColumnWidths(props.columns, cssW.value));

const totalWidth = computed(() => colWidths.value.reduce((a, b) => a + b, 0));

const totalHeight = computed(() => props.headerHeight + props.tableData.length * props.rowHeight);

const tableDataRef = toRef(props, "tableData");
const selection = useBaseTableSelection(props.rowKey, tableDataRef);

const { slotTriggerRef, slotPopup, openSlotPopup, closeSlotPopup } =
  useCanvasSlotPopup(containerRef);
const { hoverSelCol, hoverSelRow, updateHover, clearHover } = useCanvasCheckboxHover();

const {
  tooltipAnchorRef,
  tooltipVisible,
  tooltipContent,
  onContainerMousemove: _tooltipMousemove,
  onContainerMouseleave: _tooltipMouseleave,
  hideTooltip,
} = useCanvasTooltip(containerRef, {
  columns: () => props.columns,
  colWidths: () => colWidths.value,
  data: () => props.tableData,
  headerHeight: () => props.headerHeight,
  rowHeight: () => props.rowHeight,
  scrollX: () => scrollX.value,
  scrollY: () => scrollY.value,
  measureTextWidth: canvas2DMeasureTextWidth,
});

function onContainerMousemove(e: MouseEvent) {
  _tooltipMousemove(e);
  if (
    updateHover(
      e,
      containerRef.value,
      canvasRef.value,
      props.columns,
      colWidths.value,
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
  totalWidth: () => totalWidth.value,
  totalHeight: () => totalHeight.value,
  headerHeight: () => props.headerHeight,
  onScroll: schedulePaint,
});

function clampScroll() {
  const maxX = Math.max(0, totalWidth.value - cssW.value);
  const maxY = Math.max(0, totalHeight.value - cssH.value);
  scrollX.value = Math.min(maxX, Math.max(0, scrollX.value));
  scrollY.value = Math.min(maxY, Math.max(0, scrollY.value));
}

function paint() {
  const canvas = canvasRef.value;
  const vis = visibleColumns(props.columns);
  if (!canvas || vis.length === 0) {
    return;
  }
  canvas.width = cssW.value * dpr;
  canvas.height = cssH.value * dpr;
  canvas.style.width = `${cssW.value}px`;
  canvas.style.height = `${cssH.value}px`;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return;
  }
  drawTable2D({
    ctx,
    width: cssW.value * dpr,
    height: cssH.value * dpr,
    scrollX: scrollX.value,
    scrollY: scrollY.value,
    headerHeight: props.headerHeight,
    rowHeight: props.rowHeight,
    columns: props.columns,
    data: props.tableData,
    colWidths: colWidths.value,
    dpr,
    emptyText: props.emptyText,
    rowKey: props.rowKey,
    selectedKeys: selection.selectedKeys.value,
    hoverSelCol: hoverSelCol.value,
    hoverSelRow: hoverSelRow.value,
  });
}

function schedulePaint() {
  cancelAnimationFrame(raf);
  if (!active) return;
  raf = requestAnimationFrame(() => {
    clampScroll();
    paint();
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
    colWidths.value,
    props.tableData.length,
  );
  if (!hit) {
    closeSlotPopup();
    return;
  }
  const col = vis[hit.colIndex];
  if (col?.type === "tableSlot" && hit.kind === "body") {
    if (isClickOnSlotText(docX, colWidths.value, hit.colIndex)) {
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
        colWidths.value,
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

onMounted(() => {
  const el = containerRef.value;
  if (!el) {
    return;
  }
  ro = new ResizeObserver((entries) => {
    const cr = entries[0]?.contentRect;
    if (cr) {
      cssW.value = Math.floor(cr.width);
      cssH.value = Math.floor(cr.height);
      schedulePaint();
    }
  });
  ro.observe(el);
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

watch([scrollX, scrollY, colWidths], () => schedulePaint());

watch(selection.selectedKeys, () => schedulePaint(), { deep: true });
</script>

<template>
  <div
    ref="containerRef"
    class="crud-base-table__canvas"
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
    <canvas ref="canvasRef" class="crud-base-table__canvas-surface" @click="onCanvasClick" />
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
.crud-base-table__canvas {
  position: relative;
  height: 100%;
  min-height: 120px;
  outline: none;
  overflow: hidden;
}

.crud-base-table__canvas-surface {
  display: block;
  vertical-align: top;
  cursor: default;
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
  background-color: #909399;
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
