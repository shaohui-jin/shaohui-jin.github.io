<script setup lang="ts">
import { computed, type Component, ref } from "vue";
import DemoBaseTable from "./demos/DemoBaseTable.vue";
import DemoBaseSearch from "./demos/DemoBaseSearch.vue";
import DemoBaseSearchDrawer from "./demos/DemoBaseSearchDrawer.vue";
import DemoBaseColumnSetting from "./demos/DemoBaseColumnSetting.vue";
import DemoHelloButton from "./demos/DemoHelloButton.vue";
import DemoStatusTag from "./demos/DemoStatusTag.vue";
import DemoSearchBar from "./demos/DemoSearchBar.vue";
import DemoTextLink from "./demos/DemoTextLink.vue";
import DemoEmptyPlaceholder from "./demos/DemoEmptyPlaceholder.vue";
import DemoStatusDot from "./demos/DemoStatusDot.vue";
import ChangelogPanel from "./demos/ChangelogPanel.vue";

const pageMap: Record<string, Component> = {
  "tables": DemoBaseTable,
  "base-search": DemoBaseSearch,
  "base-search-drawer": DemoBaseSearchDrawer,
  "base-column-setting": DemoBaseColumnSetting,
  "hello-button": DemoHelloButton,
  "status-tag": DemoStatusTag,
  "search-bar": DemoSearchBar,
  "text-link": DemoTextLink,
  "empty-placeholder": DemoEmptyPlaceholder,
  "status-dot": DemoStatusDot,
};

const activeName = ref("tables");
const activePage = computed(() => pageMap[activeName.value] ?? DemoBaseTable);

const navOpen = ref(false);

function handleSelect(key: string) {
  activeName.value = key;
  navOpen.value = false;
}
</script>

<template>
  <div class="doc">
    <header class="doc-header">
      <div class="doc-header__inner">
        <button class="doc-header__menu-btn" @click="navOpen = !navOpen">
          <span class="menu-icon" :class="{ 'menu-icon--open': navOpen }" />
        </button>
        <h1 class="doc-header__title">Comp Vue Lib</h1>
        <span class="doc-header__badge">组件文档 &amp; 演练场</span>
        <ChangelogPanel class="doc-header__changelog" />
      </div>
    </header>

    <main class="doc-main">
      <div class="doc-nav-backdrop" :class="{ visible: navOpen }" @click="navOpen = false" />
      <el-menu
        :default-active="activeName"
        class="doc-nav"
        :class="{ 'doc-nav--open': navOpen }"
        :default-openeds="['basic', 'crud']"
        @select="handleSelect"
      >
        <el-sub-menu index="crud">
          <template #title>
            <el-icon><i class="nav-icon nav-icon--crud" /></el-icon>
            <span>CRUD 组件</span>
          </template>
          <el-menu-item index="tables">BaseTable 多模式表格</el-menu-item>
          <el-menu-item index="base-search">BaseSearch 搜索栏</el-menu-item>
          <el-menu-item index="base-search-drawer">BaseSearchDrawer 搜索抽屉</el-menu-item>
          <el-menu-item index="base-column-setting">BaseColumnSetting 列设置</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="basic">
          <template #title>
            <el-icon><i class="nav-icon nav-icon--widget" /></el-icon>
            <span>基础组件</span>
          </template>
          <el-menu-item index="hello-button">HelloButton</el-menu-item>
          <el-menu-item index="status-tag">StatusTag</el-menu-item>
          <el-menu-item index="status-dot">StatusDot</el-menu-item>
          <el-menu-item index="search-bar">SearchBar</el-menu-item>
          <el-menu-item index="text-link">TextLink</el-menu-item>
          <el-menu-item index="empty-placeholder">EmptyPlaceholder</el-menu-item>
        </el-sub-menu>
      </el-menu>

      <div class="doc-content">
        <component :is="activePage" />
      </div>
    </main>
  </div>
</template>

<style scoped lang="scss">
@use "./demos/variables" as *;
@use "./demos/el-overrides" as *;

.doc {
  min-height: 100vh;
  background: $doc-bg-page;
  font-family: $doc-font-family;
  color: $doc-text-primary;
}

.doc-header {
  position: sticky;
  top: 0;
  z-index: 100;
  height: 56px;
  background: $doc-bg-card;
  border-bottom: 1px solid $doc-border-color;
  box-shadow: $doc-shadow-sm;
}

.doc-header__inner {
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 $doc-sp-2xl;
  display: flex;
  align-items: center;
  height: 100%;
  gap: $doc-sp-md;
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

  &::before { top: -6px; }
  &::after { top: 6px; }

  &--open {
    background: transparent;

    &::before { top: 0; transform: rotate(45deg); }
    &::after { top: 0; transform: rotate(-45deg); }
  }
}

.doc-header__title {
  margin: 0;
  font-size: $doc-fs-lg;
  font-weight: 700;
  letter-spacing: -0.01em;
}

.doc-header__badge {
  font-size: $doc-fs-xs;
  color: $doc-text-secondary;
  padding: 2px $doc-sp-sm;
  background: $doc-bg-muted;
  border-radius: $doc-radius-pill;
}

.doc-header__changelog {
  margin-left: auto;
}

.doc-main {
  display: flex;
  max-width: 1440px;
  margin: 0 auto;
  min-height: calc(100vh - 56px);
  position: relative;
}

.doc-nav-backdrop {
  display: none;
}

.doc-nav {
  width: 220px;
  flex-shrink: 0;
  border-right: 1px solid $doc-border-color;
  background: $doc-bg-card;
  padding-top: $doc-sp-sm;
  transition: transform 0.3s ease;

  @include el-menu-nav;
}

.nav-icon {
  display: inline-block;
  width: 16px;
  height: 16px;
  border-radius: $doc-radius-sm;

  &--crud { background: $doc-color-warning; }
  &--widget { background: $doc-color-success; }
}

.doc-content {
  flex: 1;
  min-width: 0;
  padding: 28px 32px 48px;
}

// ============================================================
// 平板端 (768px ~ 1024px)
// ============================================================
@media (max-width: $doc-bp-tablet) {
  .doc-nav {
    width: 200px;
  }

  .doc-content {
    padding: 24px 24px 40px;
  }
}

// ============================================================
// 移动端 (< 768px)
// ============================================================
@media (max-width: $doc-bp-mobile) {
  .doc-header__inner {
    padding: 0 $doc-sp-lg;
  }

  .doc-header__menu-btn {
    display: flex;
  }

  .doc-header__badge {
    display: none;
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
    top: 56px;
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
}
</style>
