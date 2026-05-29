import { computed, ref, type Ref } from "vue";
import { keyString, rowKeyValue } from "./selectionKeys";

/**
 * 多选状态：与 ElTable selection-change 行为一致（按 rowKey 去重）。
 */
export function useBaseTableSelection(rowKey: string, tableData: Ref<Record<string, unknown>[]>) {
  const selectedKeys = ref(new Set<string>());

  function selectedRows(): Record<string, unknown>[] {
    return tableData.value.filter((r) => selectedKeys.value.has(keyString(rowKeyValue(r, rowKey))));
  }

  const isAllSelected = computed(() => {
    const data = tableData.value;
    if (data.length === 0) {
      return false;
    }
    return data.every((r) => selectedKeys.value.has(keyString(rowKeyValue(r, rowKey))));
  });

  const isIndeterminate = computed(() => {
    const data = tableData.value;
    if (data.length === 0) {
      return false;
    }
    const n = data.filter((r) => selectedKeys.value.has(keyString(rowKeyValue(r, rowKey)))).length;
    return n > 0 && n < data.length;
  });

  function isRowSelected(row: Record<string, unknown>): boolean {
    return selectedKeys.value.has(keyString(rowKeyValue(row, rowKey)));
  }

  function setSelected(next: Set<string>) {
    selectedKeys.value = next;
  }

  function toggleRow(row: Record<string, unknown>): Record<string, unknown>[] {
    const k = keyString(rowKeyValue(row, rowKey));
    const next = new Set(selectedKeys.value);
    if (next.has(k)) {
      next.delete(k);
    } else {
      next.add(k);
    }
    selectedKeys.value = next;
    return selectedRows();
  }

  function toggleAll(): Record<string, unknown>[] {
    const data = tableData.value;
    const next = new Set(selectedKeys.value);
    if (data.length === 0) {
      return selectedRows();
    }
    const allOn = data.every((r) => next.has(keyString(rowKeyValue(r, rowKey))));
    if (allOn) {
      data.forEach((r) => next.delete(keyString(rowKeyValue(r, rowKey))));
    } else {
      data.forEach((r) => next.add(keyString(rowKeyValue(r, rowKey))));
    }
    selectedKeys.value = next;
    return selectedRows();
  }

  return {
    selectedKeys,
    isAllSelected,
    isIndeterminate,
    isRowSelected,
    toggleRow,
    toggleAll,
    selectedRows,
    setSelected,
  };
}
