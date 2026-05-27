<script setup lang="ts">
import { computed, type Component, ref, watch } from "vue";
import DemoBaseTable from "./demos/DemoBaseTable.vue";
import DemoBaseSearch from "./demos/DemoBaseSearch.vue";
import DemoBaseSearchField from "./demos/DemoBaseSearchField.vue";
import DemoBaseSearchDrawer from "./demos/DemoBaseSearchDrawer.vue";
import DemoBaseColumnSetting from "./demos/DemoBaseColumnSetting.vue";
import DemoBaseCrud from "./demos/DemoBaseCrud.vue";
import DemoStatusTag from "./demos/DemoStatusTag.vue";
import DemoStatusDot from "./demos/DemoStatusDot.vue";
import DemoConfigProvider from "./demos/DemoConfigProvider.vue";
import ChangelogPanel from "./demos/ChangelogPanel.vue";

type TopTab = "docs" | "config" | "changelog";

const pageMap: Record<string, Component> = {
  tables: DemoBaseTable,
  "base-search": DemoBaseSearch,
  "base-search-field": DemoBaseSearchField,
  "base-search-drawer": DemoBaseSearchDrawer,
  "base-column-setting": DemoBaseColumnSetting,
  "base-crud": DemoBaseCrud,
  "status-tag": DemoStatusTag,
  "status-dot": DemoStatusDot,
};

const FIRST_LEAF_KEY = "tables";

const topTab = ref<TopTab>("docs");
const activeName = ref(FIRST_LEAF_KEY);
const activePage = computed(() => pageMap[activeName.value] ?? DemoBaseTable);

const navOpen = ref(false);

function handleSelect(key: string) {
  activeName.value = key;
  navOpen.value = false;
}

function switchTopTab(tab: TopTab) {
  topTab.value = tab;
  navOpen.value = false;
  if (tab === "docs") {
    activeName.value = FIRST_LEAF_KEY;
  }
}

watch(topTab, () => {
  navOpen.value = false;
});
</script>

<template>
  <div class="doc">
    <header class="doc-header">
      <div class="doc-header__inner">
        <button class="doc-header__menu-btn" @click="navOpen = !navOpen">
          <span class="menu-icon" :class="{ 'menu-icon--open': navOpen }" />
        </button>
        <h1 class="doc-header__title">comp lib</h1>
        <nav class="doc-header__tabs">
          <button
            :class="['doc-header__tab', { active: topTab === 'docs' }]"
            @click="switchTopTab('docs')"
          >
            组件文档
          </button>
          <button
            :class="['doc-header__tab', { active: topTab === 'config' }]"
            @click="switchTopTab('config')"
          >
            配置系统
          </button>
          <button
            :class="['doc-header__tab', { active: topTab === 'changelog' }]"
            @click="switchTopTab('changelog')"
          >
            变更记录
          </button>
        </nav>
      </div>
    </header>

    <main class="doc-main">
      <template v-if="topTab === 'docs'">
        <div class="doc-nav-backdrop" :class="{ visible: navOpen }" @click="navOpen = false" />
        <el-menu
          :default-active="activeName"
          class="doc-nav"
          :class="{ 'doc-nav--open': navOpen }"
          :default-openeds="['crud', 'basic']"
          @select="handleSelect"
        >
          <el-sub-menu index="crud">
            <template #title>
              <el-icon><i class="nav-icon nav-icon--crud" /></el-icon>
              <span>CRUD 组件</span>
            </template>
            <el-menu-item index="tables">
              <span class="nav-item__name">BaseTable</span>
              <span class="nav-item__tag">表格</span>
            </el-menu-item>
            <el-menu-item index="base-search">
              <span class="nav-item__name">BaseSearch</span>
              <span class="nav-item__tag">搜索</span>
            </el-menu-item>
            <el-menu-item index="base-search-field">
              <span class="nav-item__name">BaseSearchField</span>
              <span class="nav-item__tag">字段</span>
            </el-menu-item>
            <el-menu-item index="base-search-drawer">
              <span class="nav-item__name">BaseSearchDrawer</span>
              <span class="nav-item__tag">抽屉</span>
            </el-menu-item>
            <el-menu-item index="base-column-setting">
              <span class="nav-item__name">BaseColumnSetting</span>
              <span class="nav-item__tag">列设置</span>
            </el-menu-item>
            <el-menu-item index="base-crud">
              <span class="nav-item__name">BaseCrud</span>
              <span class="nav-item__tag">联动</span>
            </el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="basic">
            <template #title>
              <el-icon><i class="nav-icon nav-icon--widget" /></el-icon>
              <span>基础组件</span>
            </template>
            <el-menu-item index="status-tag">
              <span class="nav-item__name">StatusTag</span>
              <span class="nav-item__tag">标签</span>
            </el-menu-item>
            <el-menu-item index="status-dot">
              <span class="nav-item__name">StatusDot</span>
              <span class="nav-item__tag">圆点</span>
            </el-menu-item>
          </el-sub-menu>
        </el-menu>

        <div class="doc-content">
          <component :is="activePage" />
        </div>
      </template>

      <template v-else-if="topTab === 'config'">
        <div class="doc-content doc-content--full">
          <div class="doc-panel">
            <DemoConfigProvider />
          </div>
        </div>
      </template>

      <template v-else>
        <div class="doc-content doc-content--full">
          <div class="doc-panel">
            <ChangelogPanel />
          </div>
        </div>
      </template>
    </main>
  </div>
</template>

<style scoped lang="scss">
@use "./demos/variables" as *;
@use "./demos/el-overrides" as *;

.doc {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  background: $doc-bg-page;
  font-family: $doc-font-family;
  color: $doc-text-primary;
}

// ============================================================
// Header
// ============================================================
.doc-header {
  flex: none;
  z-index: 100;
  height: 56px;
  background: $doc-bg-card;
  border-bottom: 1px solid $doc-border-color;
  box-shadow: $doc-shadow-sm;
}

.doc-header__inner {
  padding: 0 32px;
  display: flex;
  align-items: center;
  height: 100%;
  gap: 0;
}

.doc-header__menu-btn {
  display: none;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: $doc-radius-md;
  margin-right: $doc-sp-sm;

  &:hover {
    background: $doc-bg-muted;
  }
}

.menu-icon {
  position: relative;
  display: block;
  width: 18px;
  height: 2px;
  background: $doc-text-primary;
  border-radius: 1px;
  transition: background 0.2s;

  &::before,
  &::after {
    content: "";
    position: absolute;
    left: 0;
    width: 100%;
    height: 2px;
    background: $doc-text-primary;
    border-radius: 1px;
    transition: transform 0.2s;
  }

  &::before {
    top: -6px;
  }

  &::after {
    top: 6px;
  }

  &--open {
    background: transparent;

    &::before {
      top: 0;
      transform: rotate(45deg);
    }

    &::after {
      top: 0;
      transform: rotate(-45deg);
    }
  }
}

.doc-header__title {
  margin: 0;
  margin-right: $doc-sp-2xl;
  font-size: $doc-fs-lg;
  font-weight: 700;
  color: $doc-color-primary;
  letter-spacing: -0.01em;
  white-space: nowrap;
}

// ============================================================
// 顶部 Tab 导航
// ============================================================
.doc-header__tabs {
  display: flex;
  align-items: center;
  height: 100%;
  gap: 4px;
}

.doc-header__tab {
  position: relative;
  height: 100%;
  padding: 0 16px;
  border: none;
  background: none;
  font-size: $doc-fs-sm;
  font-weight: 500;
  color: $doc-text-secondary;
  cursor: pointer;
  white-space: nowrap;
  transition: color 0.2s;

  &:hover {
    color: $doc-text-primary;
  }

  &.active {
    color: $doc-color-primary;
    font-weight: 600;

    &::after {
      content: "";
      position: absolute;
      bottom: 0;
      left: 16px;
      right: 16px;
      height: 2px;
      background: $doc-color-primary;
      border-radius: 1px 1px 0 0;
    }
  }
}

// ============================================================
// Main
// ============================================================
.doc-main {
  flex: 1 1 0;
  display: flex;
  min-height: 0;
  position: relative;
  overflow: hidden;
}

.doc-nav-backdrop {
  display: none;
}

.doc-nav {
  width: 240px;
  flex-shrink: 0;
  border-right: 1px solid $doc-border-color;
  background: $doc-bg-card;
  padding-top: $doc-sp-sm;
  overflow-y: auto;
  scrollbar-width: none;
  transition: transform 0.3s ease;

  &::-webkit-scrollbar {
    display: none;
  }

  @include el-menu-nav;
}

.nav-icon {
  display: inline-block;
  width: 16px;
  height: 16px;
  border-radius: $doc-radius-sm;

  &--crud {
    background: $doc-color-warning;
  }

  &--widget {
    background: $doc-color-success;
  }
}

.nav-item__name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: $doc-font-mono;
  font-size: $doc-fs-sm;
}

.nav-item__tag {
  flex-shrink: 0;
  margin-left: $doc-sp-xs;
  font-size: 11px;
  line-height: 1;
  color: $doc-text-secondary;
  background: $doc-bg-muted;
  padding: 3px 6px;
  border-radius: $doc-radius-sm;
}

.doc-content {
  flex: 1 1 0;
  min-width: 0;
  padding: 28px 32px 48px;
  overflow: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }

  &--full {
    max-width: 100%;
  }
}

.doc-panel {
  background: $doc-bg-card;
  border-radius: $doc-radius-lg;
  padding: $doc-sp-2xl 32px;
}

// ============================================================
// 平板端 (768px ~ 1024px)
// ============================================================
@media (max-width: $doc-bp-tablet) {
  .doc-header__inner {
    padding: 0 20px;
  }

  .doc-header__title {
    margin-right: $doc-sp-lg;
  }

  .doc-header__tab {
    padding: 0 12px;
  }

  .doc-nav {
    width: 200px;
  }

  .doc-content {
    padding: 24px 24px 40px;
  }

  .doc-panel {
    padding: $doc-sp-xl $doc-sp-2xl;
  }
}

// ============================================================
// 移动端 (< 768px)
// ============================================================
@media (max-width: $doc-bp-mobile) {
  .doc-header {
    height: auto;
    min-height: 48px;
  }

  .doc-header__inner {
    flex-wrap: wrap;
    padding: 0 $doc-sp-lg;
    height: auto;
  }

  .doc-header__menu-btn {
    display: flex;
  }

  .doc-header__title {
    font-size: $doc-fs-md;
    margin-right: auto;
  }

  .doc-header__tabs {
    width: 100%;
    height: 40px;
    border-top: 1px solid $doc-border-color;
    gap: 0;
  }

  .doc-header__tab {
    flex: 1;
    height: 100%;
    padding: 0 8px;
    font-size: $doc-fs-xs;
    text-align: center;
  }

  .doc-nav-backdrop {
    display: block;
    position: fixed;
    inset: 0;
    z-index: 98;
    background: rgb(0 0 0 / 30%);
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s;

    &.visible {
      opacity: 1;
      pointer-events: auto;
    }
  }

  .doc-nav {
    position: fixed;
    top: 88px;
    left: 0;
    bottom: 0;
    z-index: 99;
    width: 260px;
    transform: translateX(-100%);
    box-shadow: $doc-shadow-lg;
    overflow-y: auto;

    &--open {
      transform: translateX(0);
    }
  }

  .doc-content {
    padding: 20px $doc-sp-lg 32px;
  }

  .doc-panel {
    padding: $doc-sp-lg;
    border-radius: $doc-radius-md;
  }
}
</style>
