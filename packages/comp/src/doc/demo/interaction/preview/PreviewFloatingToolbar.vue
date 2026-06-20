<script setup lang="ts">
import { ref, computed } from "vue";
import { ElMessage } from "element-plus";

const rows = ref([
  { id: 1, name: "订单 #1001", checked: false },
  { id: 2, name: "订单 #1002", checked: false },
  { id: 3, name: "订单 #1003", checked: false },
  { id: 4, name: "订单 #1004", checked: false },
]);

const selectedCount = computed(() => rows.value.filter((r) => r.checked).length);
const allChecked = computed({
  get: () => selectedCount.value === rows.value.length && rows.value.length > 0,
  set: (val: boolean) => rows.value.forEach((r) => { r.checked = val; }),
});

function batchAction(action: string) {
  ElMessage.success(`${action} ${selectedCount.value} 项`);
  rows.value.forEach((r) => { r.checked = false; });
}
</script>

<template>
  <div class="float-toolbar-demo">
    <label class="float-toolbar-demo__all">
      <input v-model="allChecked" type="checkbox" /> 全选
    </label>
    <div
      v-for="row in rows"
      :key="row.id"
      class="float-toolbar-demo__row"
    >
      <input v-model="row.checked" type="checkbox" />
      <span>{{ row.name }}</span>
    </div>
    <Transition name="toolbar-slide">
      <div v-if="selectedCount > 0" class="float-toolbar">
        <span>已选 {{ selectedCount }} 项</span>
        <button @click="batchAction('导出')">导出</button>
        <button @click="batchAction('删除')">删除</button>
        <button @click="batchAction('审批')">审批</button>
      </div>
    </Transition>
  </div>
</template>

<style scoped lang="scss">
.float-toolbar-demo {
  position: relative;
  padding-bottom: 56px;

  &__all {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
    font-size: 13px;
    cursor: pointer;
  }

  &__row {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 12px;
    margin-bottom: 6px;
    background: #fafafa;
    border-radius: 6px;
    font-size: 13px;
  }
}

.float-toolbar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  background: #303133;
  color: #fff;
  border-radius: 8px;
  font-size: 13px;
  box-shadow: 0 4px 16px rgb(0 0 0 / 20%);

  button {
    padding: 4px 12px;
    border: 1px solid rgb(255 255 255 / 30%);
    border-radius: 4px;
    background: transparent;
    color: #fff;
    cursor: pointer;
    font-size: 12px;

    &:hover {
      background: rgb(255 255 255 / 10%);
    }
  }
}

.toolbar-slide-enter-active,
.toolbar-slide-leave-active {
  transition: transform 0.25s ease, opacity 0.25s ease;
}

.toolbar-slide-enter-from,
.toolbar-slide-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
</style>
