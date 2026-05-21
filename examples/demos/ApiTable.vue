<script setup lang="ts">
import { ref } from "vue";
import type { ApiRow, EventRow, SlotRow } from "./types";

type TableType = "props" | "events" | "slots";

const props = defineProps<{
  type?: TableType;
  rows: ApiRow[] | EventRow[] | SlotRow[];
}>();

const expandedRows = ref<Set<number>>(new Set());

function toggleRow(index: number) {
  if (expandedRows.value.has(index)) {
    expandedRows.value.delete(index);
  } else {
    expandedRows.value.add(index);
  }
}

const tableType = props.type ?? "props";
</script>

<template>
  <!-- 桌面端：常规表格 -->
  <div class="api-table-wrap api-table--desktop">
    <table v-if="tableType === 'props'" class="api-table">
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
        <tr v-for="row in (rows as ApiRow[])" :key="row.name">
          <td><code>{{ row.name }}</code></td>
          <td><code class="api-type">{{ row.type }}</code></td>
          <td>
            <code v-if="row.default !== '—'">{{ row.default }}</code>
            <span v-else>—</span>
          </td>
          <td>{{ row.required ? "是" : "否" }}</td>
          <td>{{ row.desc }}</td>
        </tr>
      </tbody>
    </table>

    <table v-else-if="tableType === 'events'" class="api-table">
      <thead>
        <tr>
          <th>事件名</th>
          <th>参数</th>
          <th>说明</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in (rows as EventRow[])" :key="row.name">
          <td><code>{{ row.name }}</code></td>
          <td><code class="api-type">{{ row.payload }}</code></td>
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
        <tr v-for="row in (rows as SlotRow[])" :key="row.name">
          <td><code>{{ row.name }}</code></td>
          <td>{{ row.desc }}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- 移动端：方案 C 精简展开 -->
  <div class="api-table--mobile">
    <table v-if="tableType === 'props'" class="api-table api-table-c">
      <thead>
        <tr>
          <th>属性</th>
          <th>说明</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="(row, idx) in (rows as ApiRow[])" :key="row.name">
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
              <code class="api-type">{{ row.type }}</code>
              <span v-if="row.default !== '—'" class="api-table-c__default">
                &nbsp;| 默认：<code>{{ row.default }}</code>
              </span>
            </td>
          </tr>
        </template>
      </tbody>
    </table>

    <table v-else-if="tableType === 'events'" class="api-table api-table-c">
      <thead>
        <tr>
          <th>事件名</th>
          <th>说明</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="(row, idx) in (rows as EventRow[])" :key="row.name">
          <tr
            class="api-table-c__row"
            :class="{ 'api-table-c__row--open': expandedRows.has(idx) }"
            @click="toggleRow(idx)"
          >
            <td><code>{{ row.name }}</code></td>
            <td>{{ row.desc }}</td>
          </tr>
          <tr v-show="expandedRows.has(idx)" class="api-table-c__detail">
            <td colspan="2">
              <span class="api-table-c__label">参数：</span>
              <code class="api-type">{{ row.payload }}</code>
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
        <tr v-for="row in (rows as SlotRow[])" :key="row.name">
          <td><code>{{ row.name }}</code></td>
          <td>{{ row.desc }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped lang="scss">
@use "./variables" as *;
@use "./demo";

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
</style>
