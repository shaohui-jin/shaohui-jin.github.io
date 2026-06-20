<script setup lang="ts">
import { computed, inject, ref } from "vue";
import { playgroundNavigation, resolveRouteView } from "./route/runtimeRoutes";

const topTabs = playgroundNavigation.topTabs;
const topTab = ref(playgroundNavigation.initialTabKey);
const activeRouteByTab = ref<Record<string, string>>({ ...playgroundNavigation.initialRouteByTab });

const navOpen = ref(false);
const listOpen = ref(false);
const compLib = inject<{
  config: {
    theme: {
      colorPrimary: string;
      colorSuccess: string;
      colorWarning: string;
    };
  };
}>("compLib");
const firstLevelColorIndexMap = new Map<string, number>();

const activeTabMeta = computed(
  () => topTabs.find((tab) => tab.key === topTab.value) ?? topTabs[0],
);
const activeMenuGroups = computed(() => playgroundNavigation.tabGroups[topTab.value] ?? []);
const activeFlatItems = computed(() => playgroundNavigation.tabRoutes[topTab.value] ?? []);
const activeRouteKey = computed(
  () =>
    activeRouteByTab.value[topTab.value] ??
    playgroundNavigation.initialRouteByTab[topTab.value] ??
    "",
);
const activeView = computed(() => {
  const current = resolveRouteView(topTab.value, activeRouteKey.value);
  if (current) return current;
  const fallback = playgroundNavigation.initialRouteByTab[topTab.value];
  return fallback ? resolveRouteView(topTab.value, fallback) : undefined;
});
const activeOpenGroupKeys = computed(() => {
  const route = resolveRouteView(topTab.value, activeRouteKey.value);
  if (route?.groupKey) return [route.groupKey];
  const firstGroup = activeMenuGroups.value[0]?.key;
  return firstGroup ? [firstGroup] : [];
});

function isMenuTab(tabKey: string): boolean {
  return topTabs.find((tab) => tab.key === tabKey)?.mode === "menu";
}

function ensureRoute(tabKey: string): void {
  if (activeRouteByTab.value[tabKey]) return;
  const fallback = playgroundNavigation.initialRouteByTab[tabKey];
  if (!fallback) return;
  activeRouteByTab.value = { ...activeRouteByTab.value, [tabKey]: fallback };
}

function switchTopTab(tabKey: string): void {
  topTab.value = tabKey;
  ensureRoute(tabKey);
  navOpen.value = false;
  listOpen.value = false;
}

function selectRoute(routeKey: string): void {
  activeRouteByTab.value = { ...activeRouteByTab.value, [topTab.value]: routeKey };
  navOpen.value = false;
  listOpen.value = false;
}

function handleBottomTab(tabKey: string): void {
  if (!isMenuTab(tabKey)) {
    switchTopTab(tabKey);
    return;
  }
  if (topTab.value !== tabKey) {
    switchTopTab(tabKey);
    listOpen.value = true;
    return;
  }
  listOpen.value = !listOpen.value;
}

function resolveFirstLevelRandomColor(key: string): string {
  if (!firstLevelColorIndexMap.has(key)) {
    firstLevelColorIndexMap.set(key, Math.floor(Math.random() * 3));
  }

  const palette = [
    compLib?.config.theme.colorPrimary ?? "#409eff",
    compLib?.config.theme.colorSuccess ?? "#67c23a",
    compLib?.config.theme.colorWarning ?? "#e6a23c",
  ];
  return palette[firstLevelColorIndexMap.get(key) ?? 0];
}
</script>

<template>
  <div class="doc">
    <header class="doc-header">
      <button class="doc-header__menu-btn" @click="navOpen = !navOpen">☰</button>
      <h1 class="doc-header__title">comp lib</h1>
      <nav class="doc-header__tabs">
        <button
          v-for="tab in topTabs"
          :key="tab.key"
          :class="['doc-header__tab', { active: topTab === tab.key }]"
          @click="switchTopTab(tab.key)"
        >
          {{ tab.label }}
        </button>
      </nav>
    </header>

    <main class="doc-main">
      <template v-if="activeTabMeta?.mode === 'menu'">
        <div v-if="navOpen" class="doc-backdrop" @click="navOpen = false" />
        <el-menu
          :key="`${topTab}-${activeOpenGroupKeys[0] ?? ''}`"
          :default-active="activeRouteKey"
          class="doc-nav"
          :class="{ 'doc-nav--open': navOpen }"
          :default-openeds="activeOpenGroupKeys"
          :unique-opened="true"
          @select="selectRoute"
        >
          <template v-if="activeMenuGroups.length > 0">
            <el-sub-menu
              v-for="group in activeMenuGroups"
              :key="group.key"
              :index="group.key"
            >
              <template #title>
                <span
                  class="doc-nav__group"
                  :style="{ color: group.accent ?? resolveFirstLevelRandomColor(`${topTab}-group-${group.key}`) }"
                >
                  <span
                    class="doc-nav__group-marker"
                    :style="{ backgroundColor: group.accent ?? resolveFirstLevelRandomColor(`${topTab}-group-${group.key}`) }"
                  />
                  <span>{{ group.title }}</span>
                </span>
              </template>
              <el-menu-item v-for="item in group.items" :key="item.key" :index="item.key">
                <span class="doc-nav__item-name">{{ item.label }}</span>
                <span class="doc-nav__item-tag">{{ item.tag }}</span>
              </el-menu-item>
            </el-sub-menu>
          </template>
          <template v-else>
            <el-menu-item v-for="item in activeFlatItems" :key="item.key" :index="item.key">
              <span
                class="doc-nav__item-name doc-nav__item-name--flat"
                :style="{ color: resolveFirstLevelRandomColor(`${topTab}-flat-${item.key}`) }"
              >
                <span
                  class="doc-nav__group-marker"
                  :style="{ backgroundColor: resolveFirstLevelRandomColor(`${topTab}-flat-${item.key}`) }"
                />
                <span>{{ item.label }}</span>
              </span>
              <span class="doc-nav__item-tag">{{ item.tag }}</span>
            </el-menu-item>
          </template>
        </el-menu>
        <section class="doc-content">
          <component v-if="activeView" :is="activeView.component" v-bind="activeView.props" />
        </section>
      </template>

      <template v-else>
        <section
          :class="[
            'doc-content',
            'doc-content--full',
            { 'doc-content--canvas-full': topTab === 'workflow-designer' },
          ]"
        >
          <component v-if="activeView" :is="activeView.component" v-bind="activeView.props" />
        </section>
      </template>
    </main>

    <nav class="doc-bottom-tabs">
      <button
        v-for="tab in topTabs"
        :key="tab.key"
        :class="['doc-bottom-tabs__item', { active: topTab === tab.key }]"
        @click="handleBottomTab(tab.key)"
      >
        {{ tab.label }}
      </button>
    </nav>

    <Transition name="panel">
      <div v-if="listOpen && activeTabMeta?.mode === 'menu'" class="doc-panel">
        <div class="doc-panel__header">
          <span>选择{{ activeTabMeta?.label }}</span>
          <button class="doc-panel__close" @click="listOpen = false">✕</button>
        </div>
        <div class="doc-panel__body">
          <template v-if="activeMenuGroups.length > 0">
            <template v-for="group in activeMenuGroups" :key="group.key">
              <div
                class="doc-panel__group"
                :style="{ color: resolveFirstLevelRandomColor(`${topTab}-group-${group.key}`) }"
              >
                {{ group.title }}
              </div>
              <button
                v-for="item in group.items"
                :key="item.key"
                :class="['doc-panel__item', { active: activeRouteKey === item.key }]"
                @click="selectRoute(item.key)"
              >
                <span>{{ item.label }}</span>
                <small>{{ item.tag }}</small>
              </button>
            </template>
          </template>
          <template v-else>
            <button
              v-for="item in activeFlatItems"
              :key="item.key"
              :class="['doc-panel__item', { active: activeRouteKey === item.key }]"
              @click="selectRoute(item.key)"
            >
              <span
                class="doc-nav__item-name--flat"
                :style="{ color: resolveFirstLevelRandomColor(`${topTab}-flat-${item.key}`) }"
              >
                {{ item.label }}
              </span>
              <small>{{ item.tag }}</small>
            </button>
          </template>
        </div>
      </div>
    </Transition>
    <div v-if="listOpen && activeTabMeta?.mode === 'menu'" class="doc-panel-backdrop" @click="listOpen = false" />
  </div>
</template>

<style scoped lang="scss">
@use "./style/variables" as *;
@use "./style/el-overrides" as *;

.doc {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: $doc-bg-page;
  color: $doc-text-primary;
}

.doc-header {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 56px;
  padding: 0 16px;
  border-bottom: 1px solid $doc-border-color;
  background: $doc-bg-card;
}

.doc-header__menu-btn {
  display: none;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: $doc-radius-md;
  background: transparent;
}

.doc-header__title {
  margin: 0;
  font-size: $doc-fs-lg;
  color: $doc-color-primary;
  white-space: nowrap;
}

.doc-header__tabs {
  display: flex;
  gap: 8px;
  margin-left: 12px;
}

.doc-header__tab {
  border: none;
  background: transparent;
  color: $doc-text-secondary;
  padding: 6px 8px;
  border-radius: $doc-radius-sm;
}

.doc-header__tab.active {
  color: $doc-color-primary;
  background: rgb(98 106 239 / 10%);
}

.doc-main {
  flex: 1;
  display: flex;
  min-height: 0;
}

.doc-nav {
  width: 260px;
  border-right: 1px solid $doc-border-color;
  background: $doc-bg-card;
  overflow: auto;

  :deep(.el-sub-menu__title) {
    height: 36px;
    line-height: 36px;
    font-size: 13px;
    padding-right: 10px;
  }

  :deep(.el-menu-item) {
    height: 32px;
    line-height: 32px;
    font-size: 12px;
    padding-right: 10px;
  }
}

.doc-nav__group {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
}

.doc-nav__group-marker {
  width: 12px;
  height: 12px;
  border-radius: 3px;
  flex-shrink: 0;
}

.doc-nav__item-name {
  flex: 1;
}

.doc-nav__item-name--flat {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  font-size: 13px;
}

.doc-nav__item-tag {
  margin-left: 6px;
  font-size: 11px;
  color: $doc-text-secondary;
}

.doc-content {
  flex: 1;
  min-width: 0;
  padding: 24px;
  overflow: auto;
}

.doc-content--full {
  padding: 20px;
}

.doc-content--canvas-full {
  padding: 0;
  overflow: hidden;
}

.doc-backdrop {
  display: none;
}

.doc-bottom-tabs {
  display: none;
}

.doc-panel,
.doc-panel-backdrop {
  display: none;
}

@media (max-width: $doc-bp-tablet) {
  .doc-header__menu-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .doc-header__tabs {
    display: none;
  }

  .doc-nav {
    position: fixed;
    left: 0;
    top: 56px;
    bottom: 52px;
    z-index: 30;
    transform: translateX(-100%);
    transition: transform 0.2s ease;
  }

  .doc-nav--open {
    transform: translateX(0);
  }

  .doc-backdrop {
    display: block;
    position: fixed;
    inset: 56px 0 52px;
    background: rgb(0 0 0 / 25%);
    z-index: 20;
  }

  .doc-bottom-tabs {
    display: flex;
    border-top: 1px solid $doc-border-color;
    background: $doc-bg-card;
  }

  .doc-bottom-tabs__item {
    flex: 1;
    border: none;
    background: transparent;
    min-height: 52px;
    font-size: 12px;
    color: $doc-text-secondary;
  }

  .doc-bottom-tabs__item.active {
    color: $doc-color-primary;
    font-weight: 600;
  }

  .doc-panel {
    display: flex;
    flex-direction: column;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 52px;
    max-height: 60vh;
    background: $doc-bg-card;
    border-radius: 12px 12px 0 0;
    z-index: 40;
  }

  .doc-panel__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    border-bottom: 1px solid $doc-border-color;
  }

  .doc-panel__close {
    border: none;
    background: transparent;
  }

  .doc-panel__body {
    overflow: auto;
    padding: 8px 0;
  }

  .doc-panel__group {
    padding: 10px 16px 6px;
    font-size: 11px;
    font-weight: 600;
  }

  .doc-panel__item {
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    border: none;
    background: transparent;
    min-height: 40px;
    padding: 0 16px;
    color: $doc-text-primary;
  }

  .doc-panel__item.active {
    color: $doc-color-primary;
    background: rgb(98 106 239 / 10%);
  }

  .doc-panel-backdrop {
    display: block;
    position: fixed;
    inset: 56px 0 52px;
    background: rgb(0 0 0 / 25%);
    z-index: 35;
  }

  .panel-enter-active,
  .panel-leave-active {
    transition: transform 0.2s ease;
  }

  .panel-enter-from,
  .panel-leave-to {
    transform: translateY(100%);
  }
}
</style>
