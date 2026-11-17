<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";

const display = ref(0);
const target = 98765;
const duration = 2000;
let startTime = 0;
let animId = 0;

function easeOut(t: number) {
  return 1 - (1 - t) ** 3;
}

function tick(now: number) {
  if (!startTime) startTime = now;
  const progress = Math.min(1, (now - startTime) / duration);
  display.value = Math.floor(easeOut(progress) * target);
  if (progress < 1) animId = requestAnimationFrame(tick);
}

function replay() {
  cancelAnimationFrame(animId);
  startTime = 0;
  display.value = 0;
  animId = requestAnimationFrame(tick);
}

onMounted(() => {
  animId = requestAnimationFrame(tick);
});

onBeforeUnmount(() => cancelAnimationFrame(animId));
</script>

<template>
  <div class="count-up">
    <div class="count-up__value">{{ display.toLocaleString() }}</div>
    <div class="count-up__meta">
      <span class="count-up__trend">↑ 12.5%</span>
      <span class="count-up__label">总访问量</span>
    </div>
    <button class="count-up__btn" @click="replay">重播</button>
  </div>
</template>

<style scoped lang="scss">
.count-up {
  text-align: center;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  color: #fff;

  &__value {
    font-size: 36px;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
    letter-spacing: 1px;
  }

  &__meta {
    margin-top: 8px;
    font-size: 13px;
    opacity: 0.9;
  }

  &__trend {
    margin-right: 12px;
    color: #a8f0c6;
  }

  &__btn {
    margin-top: 12px;
    padding: 4px 16px;
    border: 1px solid rgb(255 255 255 / 40%);
    border-radius: 4px;
    background: transparent;
    color: #fff;
    cursor: pointer;
    font-size: 12px;
  }
}
</style>
