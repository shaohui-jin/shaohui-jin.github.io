<script setup lang="ts">
import { ref, computed } from "vue";
import type { TreeTransferProps, TreeTransferEmits, TreeTransferNode } from "@/type/interaction";

defineOptions({ name: "TreeTransfer" });

const props = defineProps<TreeTransferProps>();
const emit = defineEmits<TreeTransferEmits>();

const leftChecked = ref<string[]>([]);

const rightTree = computed(() => buildRightTree(props.data, props.modelValue));

function filterTree(nodes: TreeTransferNode[], exclude: Set<string>): TreeTransferNode[] {
  return nodes
    .map((n) => {
      const children = n.children ? filterTree(n.children, exclude) : undefined;
      if (children?.length) return { ...n, children };
      if (!n.children && !exclude.has(n.id)) return { ...n };
      return null;
    })
    .filter(Boolean) as TreeTransferNode[];
}

const leftTree = computed(() => filterTree(props.data, new Set(props.modelValue)));

function buildRightTree(nodes: TreeTransferNode[], ids: string[]): TreeTransferNode[] {
  const idSet = new Set(ids);
  const result: TreeTransferNode[] = [];
  for (const n of nodes) {
    if (n.children) {
      const children = n.children.filter((c) => idSet.has(c.id));
      if (children.length) result.push({ ...n, children });
    } else if (idSet.has(n.id)) {
      result.push(n);
    }
  }
  return result;
}

function toRight() {
  const next = [...new Set([...props.modelValue, ...leftChecked.value])];
  emit("update:modelValue", next);
  emit("change", next);
  leftChecked.value = [];
}

function toLeft() {
  const remove = new Set(leftChecked.value);
  const next = props.modelValue.filter((id) => !remove.has(id));
  emit("update:modelValue", next);
  emit("change", next);
  leftChecked.value = [];
}

function onLeftCheck(_: unknown, { checkedKeys }: { checkedKeys: string[] }) {
  leftChecked.value = checkedKeys;
}
</script>

<template>
  <div class="tree-transfer">
    <div class="tree-transfer__panel">
      <div class="tree-transfer__title">可选项</div>
      <el-tree
        :data="leftTree"
        show-checkbox
        node-key="id"
        :default-checked-keys="leftChecked"
        @check="onLeftCheck"
      />
    </div>
    <div class="tree-transfer__btns">
      <button :disabled="!leftChecked.length" @click="toRight">&gt;</button>
      <button :disabled="!leftChecked.length" @click="toLeft">&lt;</button>
    </div>
    <div class="tree-transfer__panel">
      <div class="tree-transfer__title">已选项</div>
      <el-tree :data="rightTree" node-key="id" default-expand-all />
    </div>
  </div>
</template>

<style scoped lang="scss">
.tree-transfer {
  display: flex;
  gap: 12px;
  align-items: stretch;

  &__panel {
    flex: 1;
    border: 1px solid var(--comp-border-color, #e4e7ed);
    border-radius: 8px;
    padding: 12px;
    min-height: 200px;
    overflow: auto;
  }

  &__title {
    font-size: 13px;
    font-weight: 600;
    margin-bottom: 8px;
  }

  &__btns {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 8px;

    button {
      width: 32px;
      height: 32px;
      border: 1px solid #dcdfe6;
      border-radius: 4px;
      background: #fff;
      cursor: pointer;

      &:disabled { opacity: 0.4; cursor: not-allowed; }
      &:not(:disabled):hover { color: var(--el-color-primary); border-color: var(--el-color-primary); }
    }
  }
}

@media (max-width: 768px) {
  .tree-transfer { flex-direction: column; &__btns { flex-direction: row; justify-content: center; } }
}
</style>
