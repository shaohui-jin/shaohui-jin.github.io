<script setup lang="ts">
import { computed } from "vue";
import type { TextOverflowAreaProps } from "@/type/basic";

defineOptions({ name: "TextOverflowArea" });

const props = withDefaults(defineProps<TextOverflowAreaProps>(), {
  height: 100,
  padding: 16,
});

const computedHeight = computed(() => props.height + "px");
const computedPadding = computed(() => props.padding + "px");
</script>

<template>
  <div class="text-overflow-area">
    <div class="text-container">
      <div class="more">...</div>
      <div class="text-body">
        {{ content }}
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.text-overflow-area {
  width: 100%;
  padding: v-bind(computedPadding);

  .text-container {
    height: v-bind(computedHeight);
    --margin-height: calc(v-bind(computedHeight) - 2 * v-bind(computedPadding));
    overflow: hidden;

    &::before {
      content: "";
      height: var(--margin-height);
      display: block;
    }

    .text-body {
      line-height: 25px;
      margin-top: calc(0px - var(--margin-height));
      text-align: start;
      word-wrap: break-word;
      word-break: break-all;
    }

    .more {
      line-height: 25px;
      float: right;
    }
  }
}
</style>
