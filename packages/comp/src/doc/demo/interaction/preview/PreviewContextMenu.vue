<script setup lang="ts">
import { ref, onBeforeUnmount } from "vue";

const menu = ref({ visible: false, x: 0, y: 0 });
const log = ref("右键或长按区域");

const items = [
  { label: "编辑", shortcut: "Ctrl+E" },
  { label: "复制", shortcut: "Ctrl+C" },
  { label: "删除", shortcut: "Del", danger: true },
];

function openMenu(e: MouseEvent) {
  e.preventDefault();
  menu.value = { visible: true, x: e.clientX, y: e.clientY };
}

function onSelect(label: string) {
  log.value = `选择了：${label}`;
  menu.value.visible = false;
}

function closeMenu() {
  menu.value.visible = false;
}

onBeforeUnmount(closeMenu);
</script>

<template>
  <div
    class="ctx-target"
    @contextmenu="openMenu"
    @click="closeMenu"
  >
    {{ log }}（在此区域右键）
    <Teleport to="body">
      <ul
        v-if="menu.visible"
        class="ctx-menu"
        :style="{ left: `${menu.x}px`, top: `${menu.y}px` }"
        @click.stop
      >
        <li
          v-for="item in items"
          :key="item.label"
          :class="{ danger: item.danger }"
          @click="onSelect(item.label)"
        >
          <span>{{ item.label }}</span>
          <span class="ctx-menu__shortcut">{{ item.shortcut }}</span>
        </li>
      </ul>
    </Teleport>
  </div>
</template>

<style scoped lang="scss">
.ctx-target {
  height: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f7fa;
  border: 1px dashed #dcdfe6;
  border-radius: 8px;
  font-size: 13px;
  color: #606266;
  user-select: none;
}

.ctx-menu {
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
