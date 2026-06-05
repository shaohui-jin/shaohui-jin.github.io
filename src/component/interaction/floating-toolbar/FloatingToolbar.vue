<script setup lang="ts">
import type { FloatingToolbarProps, FloatingToolbarEmits } from "@/type/interaction";

defineOptions({ name: "FloatingToolbar" });

defineProps<FloatingToolbarProps>();
const emit = defineEmits<FloatingToolbarEmits>();

function onAction(action: string) {
  emit("action", action);
}
</script>

<template>
  <Transition name="float-toolbar-slide">
    <div v-if="count > 0" class="float-toolbar">
      <span class="float-toolbar__count">已选 {{ count }} 项</span>
      <slot :on-action="onAction" />
    </div>
  </Transition>
</template>

<style scoped lang="scss">
@use "@/style/variables" as *;

.float-toolbar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  background: color-mix(in srgb, $lib-text-primary 88%, $lib-bg-card);
  color: $lib-bg-card;
  border: 1px solid color-mix(in srgb, $lib-border-color 60%, transparent);
  border-radius: $lib-radius-md;
  font-size: $lib-font-size-sm;
  box-shadow: 0 4px 16px rgb(0 0 0 / 20%);
  z-index: 10;

  &__count { flex-shrink: 0; }
}

.float-toolbar-slide-enter-active,
.float-toolbar-slide-leave-active {
  transition: transform 0.25s ease, opacity 0.25s ease;
}

.float-toolbar-slide-enter-from,
.float-toolbar-slide-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
</style>
