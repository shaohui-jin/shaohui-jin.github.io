<script setup lang="ts">
import { computed, ref, watch, onMounted, onBeforeUnmount } from "vue";
import changelogRaw from "../../CHANGELOG.md?raw";

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
const visible = ref(false);
const expandedIdx = ref(0);
const rootRef = ref<HTMLElement>();

function toggle() {
  visible.value = !visible.value;
}

function toggleVersion(idx: number) {
  expandedIdx.value = expandedIdx.value === idx ? -1 : idx;
}

function onClickOutside(e: MouseEvent) {
  if (visible.value && rootRef.value && !rootRef.value.contains(e.target as Node)) {
    visible.value = false;
  }
}

let savedScrollY = 0;

function lockScroll(lock: boolean) {
  if (window.innerWidth > 1024) return;
  if (lock) {
    savedScrollY = window.scrollY;
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${savedScrollY}px`;
    document.body.style.width = "100%";
  } else {
    document.body.style.overflow = "";
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.width = "";
    window.scrollTo(0, savedScrollY);
  }
}

watch(visible, (v) => lockScroll(v));

onMounted(() => document.addEventListener("mousedown", onClickOutside));
onBeforeUnmount(() => {
  document.removeEventListener("mousedown", onClickOutside);
  lockScroll(false);
});
</script>

<template>
  <div ref="rootRef" class="cl">
    <button class="cl__trigger" @click="toggle">
      <span class="cl__trigger-dot" />
      <span>变更记录</span>
      <span class="cl__trigger-ver">{{ versions[0]?.version }}</span>
      <span class="cl__trigger-arrow" :class="{ 'is-open': visible }" />
    </button>

    <Transition name="cl-backdrop">
      <div v-show="visible" class="cl__backdrop" @click="visible = false" />
    </Transition>
    <Transition name="cl-slide">
      <div v-show="visible" class="cl__panel">
        <div class="cl__list">
          <div
            v-for="(v, idx) in versions"
            :key="v.version"
            class="cl__ver"
          >
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
                    <div v-if="g.type" class="cl__grp-type">{{ g.type }}</div>
                    <div class="cl__items">
                      <p v-for="(item, i) in g.items" :key="i" class="cl__item">
                        <code v-if="item.label" class="cl__tag">{{ item.label }}</code>
                        <span>{{ item.text }}</span>
                      </p>
                    </div>
                  </template>
                </div>
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped lang="scss">
@use "./variables" as *;

.cl {
  position: relative;
}

// --- 触发按钮 ---
.cl__trigger {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  font-size: $doc-fs-xs;
  color: $doc-text-secondary;
  background: transparent;
  border: 1px solid $doc-border-color;
  border-radius: $doc-radius-pill;
  cursor: pointer;
  transition: all 0.2s;
  user-select: none;
  white-space: nowrap;

  &:hover {
    color: $doc-color-primary;
    border-color: $doc-color-primary;
  }
}

.cl__trigger-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: $doc-color-primary;
}

.cl__trigger-ver {
  font-family: $doc-font-mono;
  font-size: $doc-fs-xs;
  color: $doc-color-primary;
  background: rgba($doc-color-primary, 0.08);
  padding: 1px 6px;
  border-radius: $doc-radius-sm;
}

.cl__trigger-arrow {
  display: inline-block;
  width: 0;
  height: 0;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 5px solid currentColor;
  transition: transform 0.25s;
  margin-left: 2px;

  &.is-open {
    transform: rotate(180deg);
  }
}

// --- 面板 ---
.cl__panel {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  z-index: 200;
  width: 480px;
  padding: 16px 20px;
  background: $doc-bg-card;
  border: 1px solid $doc-border-color;
  border-radius: $doc-radius-lg;
  box-shadow: 0 6px 24px rgb(0 0 0 / 10%);
  max-height: min(460px, calc(100vh - 80px));
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 5px;
  }

  &::-webkit-scrollbar-thumb {
    background: #dcdfe6;
    border-radius: 3px;
  }
}

// --- 时间线 ---
.cl__list {
  position: relative;
  padding-left: 16px;

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
  margin-bottom: 12px;

  &:last-child {
    margin-bottom: 0;
  }
}

.cl__ver-head {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 2px 0;
  user-select: none;

  &:hover .cl__ver-tag {
    color: $doc-color-primary;
  }
}

.cl__dot {
  position: absolute;
  left: -16px;
  top: 8px;
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
  font-size: $doc-fs-sm;
  font-weight: 600;
  color: $doc-text-heading;
  transition: color 0.2s;
}

.cl__ver-date {
  font-size: 11px;
  color: $doc-text-secondary;
  background: $doc-bg-muted;
  padding: 0 6px;
  border-radius: $doc-radius-sm;
}

.cl__arrow {
  display: inline-block;
  width: 0;
  height: 0;
  margin-left: auto;
  border-left: 3.5px solid transparent;
  border-right: 3.5px solid transparent;
  border-top: 4px solid $doc-text-secondary;
  transition: transform 0.25s;

  &.is-open {
    transform: rotate(180deg);
  }
}

// --- 内容区 ---
.cl__body {
  padding-top: 6px;
}

.cl__mod {
  margin-bottom: 8px;

  &:last-child {
    margin-bottom: 0;
  }
}

.cl__mod-name {
  font-size: $doc-fs-xs;
  font-weight: 600;
  color: $doc-text-heading;
  padding: 2px 0;
  margin-bottom: 2px;
}

.cl__grp-type {
  font-size: 11px;
  color: $doc-text-secondary;
  padding-left: 4px;
  margin: 4px 0 2px;

  &::before {
    content: "› ";
    color: $doc-border-color;
  }
}

.cl__items {
  padding-left: 4px;
}

.cl__item {
  margin: 0;
  padding: 1px 0;
  font-size: $doc-fs-xs;
  line-height: 1.7;
  color: $doc-text-regular;
}

.cl__tag {
  display: inline;
  font-family: $doc-font-mono;
  font-size: 11px;
  color: $doc-color-primary;
  background: rgba($doc-color-primary, 0.06);
  padding: 0 5px;
  border-radius: 2px;
  margin-right: 4px;
}

// --- 遮罩 ---
.cl__backdrop {
  display: none;
}

// --- 平板端 ---
@media (max-width: $doc-bp-tablet) {
  .cl {
    position: static;
  }

  .cl__panel {
    position: fixed;
    top: 57px;
    right: 0;
    width: 420px;
    max-height: calc(100vh - 57px);
    border-radius: 0 0 0 $doc-radius-lg;
  }

  .cl__backdrop {
    display: block;
    position: fixed;
    inset: 0;
    top: 57px;
    z-index: 199;
    background: rgb(0 0 0 / 30%);
  }
}

// --- 手机端 ---
@media (max-width: $doc-bp-mobile) {
  .cl {
    position: static;
  }

  .cl__trigger {
    padding: 6px 10px;
    gap: 4px;

    > span:nth-child(2) {
      display: none;
    }
  }

  .cl__panel {
    position: fixed;
    top: 57px;
    left: 0;
    right: 0;
    width: auto;
    border-radius: 0;
    border-left: none;
    border-right: none;
    max-height: calc(100vh - 57px);
    padding: 16px;
  }

  .cl__backdrop {
    display: block;
    position: fixed;
    inset: 0;
    top: 57px;
    z-index: 199;
    background: rgb(0 0 0 / 30%);
  }
}

// --- Transitions ---
.cl-slide-enter-active,
.cl-slide-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.cl-slide-enter-from,
.cl-slide-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

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

.cl-backdrop-enter-active,
.cl-backdrop-leave-active {
  transition: opacity 0.2s ease;
}

.cl-backdrop-enter-from,
.cl-backdrop-leave-to {
  opacity: 0;
}
</style>
