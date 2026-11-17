<script setup lang="ts">
import { ref, onBeforeUnmount } from "vue";
import type {
  ContextMenuProps,
  ContextMenuEmits,
  ContextMenuItem,
} from "@/works/comp/type/interaction";

defineOptions({ name: "ContextMenu" });

defineProps<ContextMenuProps>();
const emit = defineEmits<ContextMenuEmits>();

const menu = ref({ visible: false, x: 0, y: 0 });

function open(e: MouseEvent) {
  e.preventDefault();
  menu.value = { visible: true, x: e.clientX, y: e.clientY };
}

function close() {
  menu.value.visible = false;
}

function onSelect(item: ContextMenuItem) {
  emit("select", item);
  close();
}

function onDocClick() {
  close();
}

onBeforeUnmount(close);
</script>

<template>
  <div class="context-menu-trigger" @contextmenu="open" @click="close">
    <slot />
    <Teleport to="body">
      <ul
        v-if="menu.visible"
        class="context-menu"
        :style="{ left: `${menu.x}px`, top: `${menu.y}px` }"
        @click.stop
      >
        <li
          v-for="item in items"
          :key="item.label"
          :class="{ danger: item.danger }"
          @click="onSelect(item)"
        >
          <span>{{ item.label }}</span>
          <span v-if="item.shortcut" class="context-menu__shortcut">{{ item.shortcut }}</span>
        </li>
      </ul>
    </Teleport>
  </div>
</template>

<style scoped lang="scss">
.context-menu-trigger {
  display: block;
}

.context-menu {
  position: fixed;
  z-index: 9999;
  list-style: none;
  margin: 0;
  padding: 4px 0;
  min-width: 160px;
  background: #fff;
  border: 1px solid #e4e7ed;
  border-radius: 6px;
  box-shadow: 0 4px 16px rgb(0 0 0 / 12%);
  font-size: 13px;

  li {
    display: flex;
    justify-content: space-between;
    padding: 8px 16px;
    cursor: pointer;

    &:hover {
      background: #f5f7fa;
    }
    &.danger {
      color: #f56c6c;
    }
  }

  &__shortcut {
    color: #909399;
    font-size: 12px;
  }
}
</style>
