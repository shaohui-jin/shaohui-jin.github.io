<script setup lang="ts">
import { ref, computed } from "vue";

interface TreeNode {
  id: string;
  label: string;
  children?: TreeNode[];
}

const treeData: TreeNode[] = [
  {
    id: "1", label: "系统管理", children: [
      { id: "1-1", label: "用户管理" },
      { id: "1-2", label: "角色管理" },
    ],
  },
  {
    id: "2", label: "内容管理", children: [
      { id: "2-1", label: "文章列表" },
      { id: "2-2", label: "分类管理" },
    ],
  },
];

const leftChecked = ref<string[]>(["1-1", "2-1"]);
const rightChecked = ref<string[]>(["1-2"]);

const leftTree = computed(() => filterTree(treeData, (id) => !rightChecked.value.includes(id)));
const rightTree = computed(() => buildRightTree(treeData, rightChecked.value));

function filterTree(nodes: TreeNode[], keep: (id: string) => boolean): TreeNode[] {
  return nodes
    .map((n) => {
      const children = n.children ? filterTree(n.children, keep) : undefined;
      if (children?.length) return { ...n, children };
      if (!n.children && keep(n.id)) return { ...n };
      return null;
    })
    .filter(Boolean) as TreeNode[];
}

function buildRightTree(nodes: TreeNode[], ids: string[]): TreeNode[] {
  const result: TreeNode[] = [];
  for (const n of nodes) {
    if (n.children) {
      const children = n.children.filter((c) => ids.includes(c.id));
      if (children.length) result.push({ ...n, children });
    } else if (ids.includes(n.id)) {
      result.push(n);
    }
  }
  return result;
}

function toRight() {
  rightChecked.value = [...new Set([...rightChecked.value, ...leftChecked.value])];
  leftChecked.value = [];
}

function toLeft() {
  const remove = new Set(leftChecked.value);
  rightChecked.value = rightChecked.value.filter((id) => !remove.has(id));
  leftChecked.value = [];
}

function onLeftCheck(_: unknown, { checkedKeys }: { checkedKeys: string[] }) {
  leftChecked.value = checkedKeys;
}
</script>

<template>
  <div class="tree-transfer">
    <div class="tree-transfer__panel">
      <div class="tree-transfer__title">可选权限</div>
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
      <div class="tree-transfer__title">已选权限</div>
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
    border: 1px solid #e4e7ed;
    border-radius: 8px;
    padding: 12px;
    min-height: 200px;
    overflow: auto;
  }

  &__title {
    font-size: 13px;
    font-weight: 600;
    margin-bottom: 8px;
    color: #303133;
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

      &:disabled {
        opacity: 0.4;
        cursor: not-allowed;
      }

      &:not(:disabled):hover {
        color: var(--el-color-primary);
        border-color: var(--el-color-primary);
      }
    }
  }
}

@media (max-width: 768px) {
  .tree-transfer {
    flex-direction: column;

    &__btns {
      flex-direction: row;
      justify-content: center;
    }
  }
}
</style>
