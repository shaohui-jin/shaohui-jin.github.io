<script setup lang="ts">
import { ref, onMounted } from "vue";

const canvasRef = ref<HTMLCanvasElement>();
const imgSrc = "https://picsum.photos/seed/crop/400/300";
const scale = ref(1);
const offset = ref({ x: 0, y: 0 });
const dragging = ref(false);
const lastPos = ref({ x: 0, y: 0 });

function draw() {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.onload = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, offset.value.x, offset.value.y, img.width * scale.value, img.height * scale.value);
    ctx.strokeStyle = "#409eff";
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 4]);
    const cx = canvas.width / 2 - 60;
    const cy = canvas.height / 2 - 60;
    ctx.strokeRect(cx, cy, 120, 120);
  };
  img.src = imgSrc;
}

function onWheel(e: WheelEvent) {
  e.preventDefault();
  scale.value = Math.min(3, Math.max(0.5, scale.value + (e.deltaY > 0 ? -0.1 : 0.1)));
  draw();
}

function onDown(e: PointerEvent) {
  dragging.value = true;
  lastPos.value = { x: e.clientX, y: e.clientY };
}

function onMove(e: PointerEvent) {
  if (!dragging.value) return;
  offset.value.x += e.clientX - lastPos.value.x;
  offset.value.y += e.clientY - lastPos.value.y;
  lastPos.value = { x: e.clientX, y: e.clientY };
  draw();
}

function onUp() {
  dragging.value = false;
}

onMounted(draw);
</script>

<template>
  <div class="cropper">
    <canvas
      ref="canvasRef"
      width="320"
      height="240"
      @wheel="onWheel"
      @pointerdown="onDown"
      @pointermove="onMove"
      @pointerup="onUp"
      @pointerleave="onUp"
    />
    <p class="cropper__hint">滚轮缩放 · 拖拽移动 · 虚线框为裁剪区域</p>
  </div>
</template>

<style scoped lang="scss">
.cropper {
  canvas {
    display: block;
    width: 100%;
    max-width: 320px;
    border: 1px solid #e4e7ed;
    border-radius: 8px;
    cursor: grab;
    touch-action: none;

    &:active {
      cursor: grabbing;
    }
  }

  &__hint {
    margin: 8px 0 0;
    font-size: 12px;
    color: #909399;
  }
}
</style>
