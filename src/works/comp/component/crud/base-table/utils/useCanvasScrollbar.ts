import { computed, onUnmounted, ref, type Ref } from "vue";

const BAR_SIZE = 6;
const BAR_OFFSET = 2;
const MIN_THUMB = 20;

export interface CanvasScrollbarOptions {
  scrollX: Ref<number>;
  scrollY: Ref<number>;
  cssW: Ref<number>;
  cssH: Ref<number>;
  totalWidth: () => number;
  totalHeight: () => number;
  headerHeight: () => number;
  onScroll: () => void;
}

export function useCanvasScrollbar(opts: CanvasScrollbarOptions) {
  const visible = ref(false);
  const dragging = ref(false);
  let cursorInside = false;

  const hasVBar = computed(() => opts.totalHeight() > opts.cssH.value);
  const hasHBar = computed(() => opts.totalWidth() > opts.cssW.value);

  const vTrackHeight = computed(() => {
    const hh = opts.headerHeight();
    const subtract = hasHBar.value ? BAR_SIZE + BAR_OFFSET : 0;
    return Math.max(0, opts.cssH.value - hh - BAR_OFFSET * 2 - subtract);
  });

  const hTrackWidth = computed(() => {
    const subtract = hasVBar.value ? BAR_SIZE + BAR_OFFSET : 0;
    return Math.max(0, opts.cssW.value - BAR_OFFSET * 2 - subtract);
  });

  const vThumbHeight = computed(() => {
    const th = opts.totalHeight();
    const ch = opts.cssH.value;
    if (th <= ch) return 0;
    return Math.max(MIN_THUMB, (ch / th) * vTrackHeight.value);
  });

  const hThumbWidth = computed(() => {
    const tw = opts.totalWidth();
    const cw = opts.cssW.value;
    if (tw <= cw) return 0;
    return Math.max(MIN_THUMB, (cw / tw) * hTrackWidth.value);
  });

  const vThumbTop = computed(() => {
    const maxScroll = Math.max(1, opts.totalHeight() - opts.cssH.value);
    return (opts.scrollY.value / maxScroll) * (vTrackHeight.value - vThumbHeight.value);
  });

  const hThumbLeft = computed(() => {
    const maxScroll = Math.max(1, opts.totalWidth() - opts.cssW.value);
    return (opts.scrollX.value / maxScroll) * (hTrackWidth.value - hThumbWidth.value);
  });

  function showScrollbar() {
    visible.value = true;
    cursorInside = true;
  }

  function hideScrollbar() {
    cursorInside = false;
    if (dragging.value) return;
    visible.value = false;
  }

  // --- Drag (mouse + touch) ---
  let dragAxis: "v" | "h" = "v";
  let dragStartMouse = 0;
  let dragStartScroll = 0;

  function applyDragDelta(pos: number) {
    if (dragAxis === "v") {
      const movable = vTrackHeight.value - vThumbHeight.value;
      if (movable <= 0) return;
      const maxScroll = Math.max(0, opts.totalHeight() - opts.cssH.value);
      const delta = pos - dragStartMouse;
      opts.scrollY.value = Math.max(
        0,
        Math.min(maxScroll, dragStartScroll + (delta / movable) * maxScroll),
      );
    } else {
      const movable = hTrackWidth.value - hThumbWidth.value;
      if (movable <= 0) return;
      const maxScroll = Math.max(0, opts.totalWidth() - opts.cssW.value);
      const delta = pos - dragStartMouse;
      opts.scrollX.value = Math.max(
        0,
        Math.min(maxScroll, dragStartScroll + (delta / movable) * maxScroll),
      );
    }
    opts.onScroll();
  }

  function onDragMove(e: MouseEvent) {
    if (!dragging.value) return;
    applyDragDelta(dragAxis === "v" ? e.clientY : e.clientX);
  }

  function onDragEnd() {
    dragging.value = false;
    window.removeEventListener("mousemove", onDragMove, true);
    window.removeEventListener("mouseup", onDragEnd, true);
    window.removeEventListener("touchmove", onTouchDragMove, true);
    window.removeEventListener("touchend", onTouchDragEnd, true);
    if (!cursorInside) {
      visible.value = false;
    }
  }

  function startDrag(axis: "v" | "h", e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    dragging.value = true;
    dragAxis = axis;
    dragStartMouse = axis === "v" ? e.clientY : e.clientX;
    dragStartScroll = axis === "v" ? opts.scrollY.value : opts.scrollX.value;
    window.addEventListener("mousemove", onDragMove, true);
    window.addEventListener("mouseup", onDragEnd, true);
  }

  function onVThumbMousedown(e: MouseEvent) {
    startDrag("v", e);
  }

  function onHThumbMousedown(e: MouseEvent) {
    startDrag("h", e);
  }

  // --- Touch drag for scrollbar thumbs ---
  function onTouchDragMove(e: TouchEvent) {
    if (!dragging.value || e.touches.length !== 1) return;
    e.preventDefault();
    const t = e.touches[0];
    applyDragDelta(dragAxis === "v" ? t.clientY : t.clientX);
  }

  function onTouchDragEnd() {
    onDragEnd();
  }

  function startTouchDrag(axis: "v" | "h", e: TouchEvent) {
    if (e.touches.length !== 1) return;
    e.preventDefault();
    e.stopPropagation();
    dragging.value = true;
    dragAxis = axis;
    const t = e.touches[0];
    dragStartMouse = axis === "v" ? t.clientY : t.clientX;
    dragStartScroll = axis === "v" ? opts.scrollY.value : opts.scrollX.value;
    window.addEventListener("touchmove", onTouchDragMove, true);
    window.addEventListener("touchend", onTouchDragEnd, true);
  }

  function onVThumbTouchstart(e: TouchEvent) {
    startTouchDrag("v", e);
  }

  function onHThumbTouchstart(e: TouchEvent) {
    startTouchDrag("h", e);
  }

  // --- Track click: jump scroll so the viewport centers on the clicked position ---
  function onVTrackClick(e: MouseEvent) {
    if ((e.target as HTMLElement).classList.contains("canvas-scrollbar__thumb")) return;
    e.preventDefault();
    e.stopPropagation();
    const track = e.currentTarget as HTMLElement;
    const rect = track.getBoundingClientRect();
    const ratio = (e.clientY - rect.top) / vTrackHeight.value;
    const maxScroll = Math.max(0, opts.totalHeight() - opts.cssH.value);
    opts.scrollY.value = Math.max(0, Math.min(maxScroll, ratio * maxScroll));
    opts.onScroll();
  }

  function onHTrackClick(e: MouseEvent) {
    if ((e.target as HTMLElement).classList.contains("canvas-scrollbar__thumb")) return;
    e.preventDefault();
    e.stopPropagation();
    const track = e.currentTarget as HTMLElement;
    const rect = track.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / hTrackWidth.value;
    const maxScroll = Math.max(0, opts.totalWidth() - opts.cssW.value);
    opts.scrollX.value = Math.max(0, Math.min(maxScroll, ratio * maxScroll));
    opts.onScroll();
  }

  onUnmounted(() => {
    window.removeEventListener("mousemove", onDragMove, true);
    window.removeEventListener("mouseup", onDragEnd, true);
    window.removeEventListener("touchmove", onTouchDragMove, true);
    window.removeEventListener("touchend", onTouchDragEnd, true);
  });

  return {
    scrollbarVisible: visible,
    dragging,
    hasVBar,
    hasHBar,
    showScrollbar,
    hideScrollbar,
    vTrackStyle: computed(() => ({
      top: `${opts.headerHeight() + BAR_OFFSET}px`,
      height: `${vTrackHeight.value}px`,
    })),
    vThumbStyle: computed(() => ({
      height: `${vThumbHeight.value}px`,
      transform: `translateY(${vThumbTop.value}px)`,
    })),
    hTrackStyle: computed(() => ({
      width: `${hTrackWidth.value}px`,
    })),
    hThumbStyle: computed(() => ({
      width: `${hThumbWidth.value}px`,
      transform: `translateX(${hThumbLeft.value}px)`,
    })),
    onVThumbMousedown,
    onHThumbMousedown,
    onVThumbTouchstart,
    onHThumbTouchstart,
    onVTrackClick,
    onHTrackClick,
  };
}
