<script setup lang="ts">
import { ref, onMounted } from "vue";
import { rgbaToHex } from "@/util/color";
import type { TextEraseAreaProps } from "@/type/basic";

defineOptions({ name: "TextEraseArea" });

defineProps<TextEraseAreaProps>();

const containerRef = ref<HTMLDivElement>();
const bgColor = ref("#ffffff");

onMounted(() => {
  if (containerRef.value) {
    bgColor.value = rgbaToHex(window.getComputedStyle(containerRef.value).backgroundColor);
  }
});
</script>

<template>
  <div ref="containerRef" class="text-erase-area">
    <p class="content">{{ content }}</p>
    <p class="erase">
      <span class="erase-text" :style="{ '--bg': bgColor }">{{ content }}</span>
    </p>
  </div>
</template>

<style scoped lang="scss">
.text-erase-area {
  width: 100%;
  padding: 1em;
  line-height: 2;
  text-indent: 2em;
  position: relative;

  p {
    text-align: start;
    word-break: break-all;
  }

  .erase {
    position: absolute;
    inset: 1em;

    .erase-text {
      --percentage: 0%;
      background: linear-gradient(
        to right,
        transparent var(--percentage),
        var(--bg, #fff) calc(var(--percentage) + 10px)
      );
      color: transparent;
      animation: erase 5s forwards linear;
    }
  }
}

@keyframes erase {
  to {
    --percentage: 100%;
  }
}

@property --percentage {
  syntax: "<percentage>";
  inherits: false;
  initial-value: 0%;
}
</style>
