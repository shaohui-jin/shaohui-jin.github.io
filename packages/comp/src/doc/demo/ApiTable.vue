<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { ElPopover } from "element-plus";
import type { ApiRow, EventRow, SlotRow } from "../type/types";
import {
  formatApiTypeHint,
  getApiTypeHint,
  shouldShowTypeHint,
} from "../type/apiTypeHints";

type TableType = "props" | "events" | "slots";

withDefaults(
  defineProps<{
    type?: TableType;
    rows?: ApiRow[] | EventRow[] | SlotRow[];
  }>(),
  { rows: () => [] },
);

const expandedRows = ref<Set<number>>(new Set());
const isTouchLike = ref(false);

function toggleRow(index: number) {
  if (expandedRows.value.has(index)) {
    expandedRows.value.delete(index);
  } else {
    expandedRows.value.add(index);
  }
}

function updateTouchLike() {
  if (typeof window === "undefined") return;
  isTouchLike.value = window.matchMedia(`(max-width: 1024px)`).matches;
}

function hintContent(typeName: string) {
  const hint = getApiTypeHint(typeName);
  if (!hint) return "";
  const title = hint.title ? `${hint.title}：` : "";
  return `${title}${formatApiTypeHint(hint)}`;
}

onMounted(() => {
  updateTouchLike();
  window.addEventListener("resize", updateTouchLike);
});

onUnmounted(() => {
  window.removeEventListener("resize", updateTouchLike);
});
</script>

<template>
  <!-- 桌面端：常规表格 -->
  <div class="api-table-wrap api-table--desktop">
    <table v-if="(type ?? 'props') === 'props'" class="api-table">
      <thead>
        <tr>
          <th>属性</th>
          <th>类型</th>
          <th>默认值</th>
          <th>必填</th>
          <th>说明</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows as ApiRow[]" :key="row.name">
          <td>
            <code>{{ row.name }}</code>
          </td>
          <td>
            <span class="api-type-cell">
              <code class="api-type">{{ row.type }}</code>
              <ElPopover
                v-if="shouldShowTypeHint(row.type)"
                :trigger="isTouchLike ? 'click' : 'hover'"
                :width="420"
                placement="top"
              >
                <template #reference>
                  <button type="button" class="api-type-hint" aria-label="查看类型说明"></button>
                </template>
                <span class="api-type-hint-pop">{{ hintContent(row.type) }}</span>
              </ElPopover>
            </span>
          </td>
          <td>
            <code v-if="row.default !== '—'">{{ row.default }}</code>
            <span v-else>—</span>
          </td>
          <td>{{ row.required ? "是" : "否" }}</td>
          <td>{{ row.desc }}</td>
        </tr>
      </tbody>
    </table>

    <table v-else-if="(type ?? 'props') === 'events'" class="api-table">
      <thead>
        <tr>
          <th>事件名</th>
          <th>参数</th>
          <th>说明</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows as EventRow[]" :key="row.name">
          <td>
            <code>{{ row.name }}</code>
          </td>
          <td>
            <span class="api-type-cell">
              <code class="api-type">{{ row.payload }}</code>
              <ElPopover
                v-if="shouldShowTypeHint(row.payload)"
                :trigger="isTouchLike ? 'click' : 'hover'"
                :width="420"
                placement="top"
              >
                <template #reference>
                  <button type="button" class="api-type-hint" aria-label="查看类型说明"></button>
                </template>
                <span class="api-type-hint-pop">{{ hintContent(row.payload) }}</span>
              </ElPopover>
            </span>
          </td>
          <td>{{ row.desc }}</td>
        </tr>
      </tbody>
    </table>

    <table v-else class="api-table">
      <thead>
        <tr>
          <th>插槽名</th>
          <th>说明</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows as SlotRow[]" :key="row.name">
          <td>
            <code>{{ row.name }}</code>
          </td>
          <td>{{ row.desc }}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- 移动端：精简展开 -->
  <div class="api-table--mobile">
    <table v-if="(type ?? 'props') === 'props'" class="api-table api-table-c">
      <thead>
        <tr>
          <th>属性</th>
          <th>说明</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="(row, idx) in rows as ApiRow[]" :key="row.name">
          <tr
            class="api-table-c__row"
            :class="{ 'api-table-c__row--open': expandedRows.has(idx) }"
            @click="toggleRow(idx)"
          >
            <td>
              <code>{{ row.name }}</code>
              <span v-if="row.required" class="api-table-c__required">*</span>
            </td>
            <td>{{ row.desc }}</td>
          </tr>
          <tr v-show="expandedRows.has(idx)" class="api-table-c__detail">
            <td colspan="2">
              <span class="api-table-c__label">类型：</span>
              <span class="api-type-cell">
                <code class="api-type">{{ row.type }}</code>
                <ElPopover
                  v-if="shouldShowTypeHint(row.type)"
                  :trigger="isTouchLike ? 'click' : 'hover'"
                  :width="420"
                  placement="top"
                >
                  <template #reference>
                    <button type="button" class="api-type-hint" aria-label="查看类型说明"></button>
                  </template>
                  <span class="api-type-hint-pop">{{ hintContent(row.type) }}</span>
                </ElPopover>
              </span>
              <span v-if="row.default !== '—'" class="api-table-c__default">
                &nbsp;| 默认：<code>{{ row.default }}</code>
              </span>
            </td>
          </tr>
        </template>
      </tbody>
    </table>

    <table v-else-if="(type ?? 'props') === 'events'" class="api-table api-table-c">
      <thead>
        <tr>
          <th>事件名</th>
          <th>说明</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="(row, idx) in rows as EventRow[]" :key="row.name">
          <tr
            class="api-table-c__row"
            :class="{ 'api-table-c__row--open': expandedRows.has(idx) }"
            @click="toggleRow(idx)"
          >
            <td>
              <code>{{ row.name }}</code>
            </td>
            <td>{{ row.desc }}</td>
          </tr>
          <tr v-show="expandedRows.has(idx)" class="api-table-c__detail">
            <td colspan="2">
              <span class="api-table-c__label">参数：</span>
              <span class="api-type-cell">
                <code class="api-type">{{ row.payload }}</code>
                <ElPopover
                  v-if="shouldShowTypeHint(row.payload)"
                  :trigger="isTouchLike ? 'click' : 'hover'"
                  :width="420"
                  placement="top"
                >
                  <template #reference>
                    <button type="button" class="api-type-hint" aria-label="查看类型说明"></button>
                  </template>
                  <span class="api-type-hint-pop">{{ hintContent(row.payload) }}</span>
                </ElPopover>
              </span>
            </td>
          </tr>
        </template>
      </tbody>
    </table>

    <table v-else class="api-table api-table-c">
      <thead>
        <tr>
          <th>插槽名</th>
          <th>说明</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows as SlotRow[]" :key="row.name">
          <td>
            <code>{{ row.name }}</code>
          </td>
          <td>{{ row.desc }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped lang="scss">
@use "../style/variables" as *;
@use "../style/demo";

.api-table--desktop {
  display: block;
}

.api-table--mobile {
  display: none;
}

@media (max-width: $doc-bp-mobile) {
  .api-table--desktop {
    display: none;
  }

  .api-table--mobile {
    display: block;
  }
}

.api-table-c__row {
  cursor: pointer;
  user-select: none;

  &:hover {
    background: $doc-bg-hover;
  }

  td:first-child {
    white-space: nowrap;

    &::before {
      content: "▸ ";
      color: $doc-text-secondary;
      font-size: 11px;
    }
  }

  &.api-table-c__row--open td:first-child::before {
    content: "▾ ";
  }
}

.api-table-c__detail {
  td {
    padding-left: 24px !important;
    font-size: $doc-fs-xs;
    color: $doc-text-secondary;
    background: $doc-bg-subtle;
  }
}

.api-table-c__required {
  color: #f56c6c;
  font-weight: 700;
  margin-left: 2px;
}

.api-table-c__label {
  font-weight: 500;
}

.api-type-hint {
  box-sizing: border-box;
  appearance: none;
  display: inline-grid;
  place-items: center;
  width: 16px;
  height: 16px;
  margin-left: 4px;
  padding: 0;
  border: 1px solid $doc-border-color;
  border-radius: 50%;
  background: $doc-bg-card;
  color: $doc-color-primary;
  font-size: 0;
  line-height: 0;
  cursor: help;
  flex-shrink: 0;

  &::after {
    content: "?";
    font-family: system-ui, sans-serif;
    font-size: 10px;
    font-weight: 700;
    line-height: 1;
  }
}

.api-type-hint-pop {
  display: block;
  font-size: $doc-fs-xs;
  line-height: 1.6;
  color: $doc-text-regular;
  white-space: normal;
  word-break: break-word;
}
</style>
