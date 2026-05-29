<script setup lang="ts">
import { computed, ref } from "vue";
import changelogRaw from "../../../CHANGELOG.md?raw";

interface ChangeItem {
  label: string;
  text: string;
}

interface ChangeGroup {
  type: string;
  items: ChangeItem[];
}

interface ChangeModule {
  name: string;
  groups: ChangeGroup[];
}

interface VersionBlock {
  version: string;
  date: string;
  modules: ChangeModule[];
}

function getGroupColor(type: string): string {
  if (type.includes("新增")) return "#10b981";
  if (type.includes("调整") || type.includes("修改")) return "#4366f1";
  if (type.includes("修复")) return "#f59e0b";
  if (type.includes("移除") || type.includes("删除")) return "#ef4444";
  return "#94a3b8";
}

function parseChangelog(raw: string): VersionBlock[] {
  const blocks: VersionBlock[] = [];
  const lines = raw.split("\n");
  let ver: VersionBlock | null = null;
  let mod: ChangeModule | null = null;
  let grp: ChangeGroup | null = null;

  for (const line of lines) {
    const vMatch = line.match(/^## (v[\d.]+)(?:[（(](.+?)[）)])?/);
    if (vMatch) {
      ver = { version: vMatch[1], date: vMatch[2] ?? "", modules: [] };
      blocks.push(ver);
      mod = null;
      grp = null;
      continue;
    }
    if (!ver) continue;

    const h3 = line.match(/^### (.+)/);
    if (h3) {
      mod = { name: h3[1], groups: [] };
      ver.modules.push(mod);
      grp = null;
      continue;
    }

    const h4 = line.match(/^#### (.+)/);
    if (h4 && mod) {
      grp = { type: h4[1], items: [] };
      mod.groups.push(grp);
      continue;
    }

    const itemMatch = line.match(/^- \*\*(.+?)\*\*[：:](.+)/);
    if (itemMatch) {
      const item = { label: itemMatch[1], text: itemMatch[2].trim() };
      if (grp) {
        grp.items.push(item);
      } else if (mod) {
        if (!mod.groups.length) mod.groups.push({ type: "", items: [] });
        mod.groups[mod.groups.length - 1].items.push(item);
      }
      continue;
    }

    const plainItem = line.match(/^- (.+)/);
    if (plainItem && !plainItem[1].startsWith("*")) {
      const item = { label: "", text: plainItem[1].trim() };
      if (grp) grp.items.push(item);
      else if (mod) {
        if (!mod.groups.length) mod.groups.push({ type: "", items: [] });
        mod.groups[mod.groups.length - 1].items.push(item);
      }
      continue;
    }

    const subItem = line.match(/^\s+- (.+)/);
    if (subItem) {
      const target = grp ?? mod?.groups[mod.groups.length - 1];
      if (target && target.items.length > 0) {
        const last = target.items[target.items.length - 1];
        last.text += `；${subItem[1].trim()}`;
      }
    }
  }

  return blocks;
}

const versions = computed(() => parseChangelog(changelogRaw));
const expandedIdx = ref(0);

function toggleVersion(idx: number) {
  expandedIdx.value = expandedIdx.value === idx ? -1 : idx;
}
</script>

<template>
  <div class="cl">
    <div class="cl__list">
      <div v-for="(v, idx) in versions" :key="v.version" class="cl__ver">
        <div class="cl__ver-head" @click="toggleVersion(idx)">
          <span class="cl__dot" :class="{ 'is-latest': idx === 0 }" />
          <span class="cl__ver-tag">{{ v.version }}</span>
          <span class="cl__ver-date">{{ v.date }}</span>
          <span class="cl__arrow" :class="{ 'is-open': expandedIdx === idx }" />
        </div>

        <Transition name="cl-expand">
          <div v-show="expandedIdx === idx" class="cl__body">
            <div v-for="mod in v.modules" :key="mod.name" class="cl__mod">
              <div class="cl__mod-name">{{ mod.name }}</div>
              <template v-for="g in mod.groups" :key="g.type">
                <div v-if="g.type" class="cl__grp-type">
                  <span class="cl__grp-dot" :style="{ background: getGroupColor(g.type) }" />
                  {{ g.type }}
                </div>
                <div class="cl__items">
                  <div v-for="(item, i) in g.items" :key="i" class="cl__item">
                    <span
                      class="cl__item-bullet"
                      :style="{ background: getGroupColor(g.type) }"
                    />
                    <div class="cl__item-content">
                      <code v-if="item.label" class="cl__tag">{{ item.label }}</code>
                      <span>{{ item.text }}</span>
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "../../style/variables" as *;

.cl {
  max-width: 720px;
}

// --- 时间线 ---
.cl__list {
  position: relative;
  padding-left: 20px;

  &::before {
    content: "";
    position: absolute;
    left: 3px;
    top: 10px;
    bottom: 10px;
    width: 1px;
    background: $doc-border-color;
  }
}

.cl__ver {
  position: relative;
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }
}

.cl__ver-head {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  padding: 4px 0;
  user-select: none;

  &:hover .cl__ver-tag {
    color: $doc-color-primary;
  }
}

.cl__dot {
  position: absolute;
  left: -20px;
  top: 10px;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: $doc-border-color;
  border: 2px solid $doc-bg-card;
  z-index: 1;

  &.is-latest {
    background: $doc-color-primary;
    box-shadow: 0 0 0 3px rgba($doc-color-primary, 0.15);
  }
}

.cl__ver-tag {
  font-family: $doc-font-mono;
  font-size: $doc-fs-md;
  font-weight: 600;
  color: $doc-text-heading;
  transition: color 0.2s;
}

.cl__ver-date {
  font-size: $doc-fs-xs;
  color: $doc-text-secondary;
  background: $doc-bg-muted;
  padding: 1px 8px;
  border-radius: $doc-radius-sm;
}

.cl__arrow {
  display: inline-block;
  width: 0;
  height: 0;
  margin-left: auto;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 5px solid $doc-text-secondary;
  transition: transform 0.25s;

  &.is-open {
    transform: rotate(180deg);
  }
}

// --- 内容区 ---
.cl__body {
  padding-top: 8px;
}

.cl__mod {
  margin-bottom: 12px;

  &:last-child {
    margin-bottom: 0;
  }
}

.cl__mod-name {
  font-size: $doc-fs-sm;
  font-weight: 600;
  color: $doc-text-heading;
  padding: 2px 0;
  margin-bottom: 4px;
}

.cl__grp-type {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: $doc-fs-sm;
  font-weight: 500;
  color: $doc-text-primary;
  margin: 10px 0 4px;
  padding-left: 4px;

  &:first-child {
    margin-top: 0;
  }
}

.cl__grp-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.cl__items {
  padding-left: 18px;
}

.cl__item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin: 0;
  padding: 3px 0;
  font-size: $doc-fs-sm;
  line-height: 1.7;
  color: $doc-text-regular;
}

.cl__item-bullet {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  flex-shrink: 0;
  margin-top: 9px;
  opacity: 0.6;
}

.cl__item-content {
  flex: 1;
  min-width: 0;
}

.cl__tag {
  display: inline;
  font-family: $doc-font-mono;
  font-size: $doc-fs-xs;
  color: $doc-color-primary;
  background: rgba($doc-color-primary, 0.06);
  padding: 1px 6px;
  border-radius: $doc-radius-sm;
  margin-right: 4px;
}

// --- Transitions ---
.cl-expand-enter-active,
.cl-expand-leave-active {
  transition: all 0.25s ease;
  overflow: hidden;
}

.cl-expand-enter-from,
.cl-expand-leave-to {
  opacity: 0;
  max-height: 0;
}
</style>
