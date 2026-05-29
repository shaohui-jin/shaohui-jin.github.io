<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { colorToRGBA } from "@/util/color";
import { getRandom } from "@/util/number";
import type { CanvasTimeProps } from "@/type/basic";

defineOptions({ name: "CanvasTime" });

const props = withDefaults(defineProps<CanvasTimeProps>(), {
  color: "#000000",
  bgColor: "#ffffff",
});

const canvasRef = ref<HTMLCanvasElement>();
let animId = 0;

onMounted(() => {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return;

  canvas.width = canvas.clientWidth * devicePixelRatio;
  canvas.height = canvas.clientHeight * devicePixelRatio;

  class Particle {
    size: number;
    x: number;
    y: number;

    constructor() {
      const r = Math.min(canvas!.width, canvas!.height) / 2;
      const rad = (getRandom(0, 360) * Math.PI) / 180;
      const cx = canvas!.width / 2;
      const cy = canvas!.height / 2;
      this.x = cx + r * Math.cos(rad);
      this.y = cy + r * Math.sin(rad);
      this.size = getRandom(2 * devicePixelRatio, 5 * devicePixelRatio);
    }

    draw() {
      ctx!.beginPath();
      ctx!.fillStyle = props.color;
      ctx!.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx!.fill();
    }

    moveTo(tx: number, ty: number) {
      const duration = 500;
      const sx = this.x;
      const sy = this.y;
      const xSpeed = (tx - sx) / duration;
      const ySpeed = (ty - sy) / duration;
      const startTime = Date.now();
      const _move = () => {
        const t = Date.now() - startTime;
        this.x = sx + xSpeed * t;
        this.y = sy + ySpeed * t;
        if (t >= duration) {
          this.x = tx;
          this.y = ty;
          return;
        }
        requestAnimationFrame(_move);
      };
      _move();
    }
  }

  const particles: Particle[] = [];
  let text = "";

  const getText = () => new Date().toTimeString().substring(0, 8);

  const clear = () => ctx.clearRect(0, 0, canvas!.width, canvas!.height);

  const getPoints = (): Array<[number, number]> => {
    const { width, height, data } = ctx.getImageData(0, 0, canvas!.width, canvas!.height);
    const points: Array<[number, number]> = [];
    const gap = 4;
    const target = colorToRGBA(props.color);
    for (let i = 0; i < width; i += gap) {
      for (let j = 0; j < height; j += gap) {
        const idx = (i + j * width) * 4;
        if (data[idx] === target.r && data[idx + 1] === target.g && data[idx + 2] === target.b && data[idx + 3] === 255) {
          points.push([i, j]);
        }
      }
    }
    return points;
  };

  const update = () => {
    const curText = getText();
    if (text === curText) return;
    clear();
    text = curText;
    ctx.fillStyle = props.color;
    ctx.textBaseline = "middle";
    const fontSize = Math.min(140, canvas!.width / (6 * devicePixelRatio)) * devicePixelRatio;
    ctx.font = `${fontSize}px 'Microsoft YaHei', sans-serif`;
    ctx.textAlign = "center";
    ctx.fillText(text, canvas!.width / 2, canvas!.height / 2);

    const points = getPoints();
    clear();
    for (let i = 0; i < points.length; i++) {
      let p = particles[i];
      if (!p) {
        p = new Particle();
        particles.push(p);
      }
      p.moveTo(points[i][0], points[i][1]);
    }
    if (points.length < particles.length) {
      particles.splice(points.length);
    }
  };

  const draw = () => {
    clear();
    update();
    particles.forEach((p) => p.draw());
    animId = requestAnimationFrame(draw);
  };
  draw();
});

onBeforeUnmount(() => {
  cancelAnimationFrame(animId);
});
</script>

<template>
  <canvas ref="canvasRef" class="canvas-time" :style="{ background: bgColor }" />
</template>

<style scoped lang="scss">
.canvas-time {
  width: 100%;
  height: 100%;
}
</style>
