<script setup lang="ts">
import { computed, inject, nextTick, onBeforeUnmount, onMounted, provide, ref } from "vue";
import { playgroundNavigation, resolveRouteView, resolveTabMeta } from "./route/runtimeRoutes";
import { PLAYGROUND_NAV_KEY } from "./route/navigation";
import { buildPath, parsePath } from "./route/url";
import { getNavVisual } from "./route/navIcons";
import HeaderThemePopover from "./home/HeaderThemePopover.vue";
import HeaderChangelogPopover from "./home/HeaderChangelogPopover.vue";

// navTabs 已过滤掉 hidden 模块（如 system），topTabs 保留全量用于解析路由
const navTabs = playgroundNavigation.navTabs;

const initialLocation = parsePath(location.pathname);
const topTab = ref(initialLocation?.tabKey ?? playgroundNavigation.initialTabKey);
const activeRouteByTab = ref<Record<string, string>>({
  ...playgroundNavigation.initialRouteByTab,
  ...(initialLocation?.routeKey ? { [initialLocation.tabKey]: initialLocation.routeKey } : {}),
});

// 深链接里的 routeKey 可能已经失效（文章被删 / 手改地址栏）：
// 回落该模块的默认路由，并把地址栏改回去，免得留一个打不开的 URL
if (
  initialLocation?.routeKey &&
  !resolveRouteView(initialLocation.tabKey, initialLocation.routeKey)
) {
  const fallback = playgroundNavigation.initialRouteByTab[initialLocation.tabKey] ?? "";
  activeRouteByTab.value = { ...activeRouteByTab.value, [initialLocation.tabKey]: fallback };
  history.replaceState(null, "", buildPath(initialLocation.tabKey, fallback));
} else if (initialLocation && !initialLocation.routeKey) {
  // 只给了模块、没给具体路由（`/docs`）：补成该模块的默认路由。
  // 这样地址栏与实际内容一一对应，复制出去就是精确链接。
  // 默认路由与模块同名的（`/workflow-designer`）不补，buildPath 本来就只写一段
  const fallback = playgroundNavigation.initialRouteByTab[initialLocation.tabKey] ?? "";
  if (fallback && fallback !== initialLocation.tabKey) {
    history.replaceState(null, "", buildPath(initialLocation.tabKey, fallback));
  }
} else if (!initialLocation) {
  // 整条路径对不上任何模块（手改地址栏 / 旧链接）：回首页并清掉地址栏
  history.replaceState(null, "", "/");
}

const navOpen = ref(false);
const listOpen = ref(false);
const activePop = ref<"theme" | "log" | null>(null);
const contentRef = ref<HTMLElement | null>(null);

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

const activeTabMeta = computed(() => resolveTabMeta(topTab.value) ?? navTabs[0]);
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

/**
 * 状态变化后把地址栏同步过去。
 *
 * 用 pushState 而不是 replaceState，浏览器的前进/后退才有东西可退；
 * 后退由 handlePopState 反向还原状态，所以这里不再触发 popstate。
 */
function syncUrl(): void {
  const path = buildPath(topTab.value, activeRouteKey.value);
  if (location.pathname === path) return;
  history.pushState(null, "", path);
}

/** 唯一滚动容器是 .doc-content，切模块 / 换文章都要回到顶部 */
async function resetScroll() {
  await nextTick();
  contentRef.value?.scrollTo({ top: 0 });
}

function isMenuTab(tabKey: string): boolean {
  return resolveTabMeta(tabKey)?.mode === "menu";
}

function ensureRoute(tabKey: string): void {
  if (activeRouteByTab.value[tabKey]) return;
  const fallback = playgroundNavigation.initialRouteByTab[tabKey];
  if (!fallback) return;
  activeRouteByTab.value = { ...activeRouteByTab.value, [tabKey]: fallback };
}

function switchTopTab(tabKey: string, routeKey?: string): void {
  topTab.value = tabKey;
  // 带 routeKey 时直接落位，避免「先切到默认路由再切到目标路由」留下两条历史
  if (routeKey) {
    activeRouteByTab.value = { ...activeRouteByTab.value, [tabKey]: routeKey };
  } else {
    ensureRoute(tabKey);
  }
  navOpen.value = false;
  listOpen.value = false;
  activePop.value = null;
  syncUrl();
  void resetScroll();
}

function selectRoute(routeKey: string): void {
  activeRouteByTab.value = { ...activeRouteByTab.value, [topTab.value]: routeKey };
  navOpen.value = false;
  listOpen.value = false;
  syncUrl();
  void resetScroll();
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

function goHome(): void {
  switchTopTab(navTabs[0]?.key ?? "home");
}

function togglePop(name: "theme" | "log"): void {
  activePop.value = activePop.value === name ? null : name;
}

function closePop(): void {
  activePop.value = null;
}

// 首页文章卡、浮层里的「打开完整配置」都通过这个口子跨模块跳转。
// routeKey 一次性带进去，只写一条历史记录，后退不会退回中间态
provide(PLAYGROUND_NAV_KEY, {
  to(tabKey: string, routeKey?: string) {
    switchTopTab(tabKey, routeKey);
  },
});

function handleKeydown(event: KeyboardEvent): void {
  if (event.key !== "Escape") return;
  activePop.value = null;
  navOpen.value = false;
  listOpen.value = false;
}

/**
 * 浏览器前进 / 后退。
 *
 * 这里只还原状态，绝不能再调 syncUrl —— 地址栏已经是目标路径，
 * 再 push 一次会把历史越堆越多，后退永远退不完。
 */
function handlePopState(): void {
  const parsed = parsePath(location.pathname);
  if (!parsed) return;
  topTab.value = parsed.tabKey;
  if (parsed.routeKey) {
    activeRouteByTab.value = { ...activeRouteByTab.value, [parsed.tabKey]: parsed.routeKey };
  }
  activePop.value = null;
  navOpen.value = false;
  listOpen.value = false;
  void resetScroll();
}

onMounted(() => {
  window.addEventListener("keydown", handleKeydown);
  window.addEventListener("popstate", handlePopState);
});
onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleKeydown);
  window.removeEventListener("popstate", handlePopState);
});

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
      <!-- 目录按钮只在有侧边栏的模块 + 手机端出现 -->
      <button
        v-if="activeTabMeta?.mode === 'menu'"
        class="doc-header__menu-btn"
        :class="{ 'is-open': navOpen }"
        aria-label="目录"
        @click="navOpen = !navOpen"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.9"
          stroke-linecap="round"
        >
          <line x1="4" y1="7" x2="20" y2="7" />
          <line x1="4" y1="12" x2="20" y2="12" />
          <line x1="4" y1="17" x2="20" y2="17" />
        </svg>
      </button>

      <button class="brand" aria-label="回到首页" @click="goHome">
        <span class="brand__mark">
          <!-- 雾形标识：两条波浪线。刻意不用三条直线——那在左上角会被误读成汉堡菜单 -->
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.2"
            stroke-linecap="round"
          >
            <path d="M3 9q3-3.4 6 0t6 0t6 0" />
            <path d="M3 15.5q3-3.4 6 0t6 0t6 0" />
          </svg>
        </span>
        <span class="brand__name">雾起</span>
      </button>

      <nav class="doc-header__nav">
        <button
          v-for="tab in navTabs"
          :key="tab.key"
          class="nav__item"
          :class="{ 'is-active': topTab === tab.key }"
          @click="switchTopTab(tab.key)"
        >
          <!-- 图标路径来自 route/navIcons.ts 的静态常量，不涉及用户输入 -->
          <!-- eslint-disable vue/no-v-html -->
          <svg
            class="nav__icon"
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
            v-html="getNavVisual(tab.key).paths"
          />
          <!-- eslint-enable vue/no-v-html -->
          <span>{{ tab.label }}</span>
        </button>
      </nav>

      <div class="header-actions">
        <!-- 主题配置：替代原 system/config 的导航入口 -->
        <button
          class="icon-btn"
          :class="{ 'is-active': activePop === 'theme' }"
          aria-label="主题配置"
          title="主题配置"
          @click="togglePop('theme')"
        >
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="12" cy="12" r="9" />
            <circle cx="9" cy="9.5" r="1.2" fill="currentColor" stroke="none" />
            <circle cx="15" cy="9.5" r="1.2" fill="currentColor" stroke="none" />
            <circle cx="9.5" cy="15" r="1.2" fill="currentColor" stroke="none" />
          </svg>
        </button>

        <!-- 更新日志：替代原 system/changelog 的导航入口 -->
        <button
          class="icon-btn"
          :class="{ 'is-active': activePop === 'log' }"
          aria-label="更新日志"
          title="更新日志"
          @click="togglePop('log')"
        >
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="12" cy="12" r="9" />
            <polyline points="12 7.5 12 12 15.5 13.8" />
          </svg>
        </button>

        <a
          class="icon-btn"
          href="https://github.com/shaohui-jin"
          target="_blank"
          rel="noreferrer"
          aria-label="GitHub"
          title="GitHub"
        >
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.7"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path
              d="M9 19c-4 1.5-4-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.3 4.3 0 0 0-.1-3.2s-1-.3-3.4 1.3a11.6 11.6 0 0 0-6.2 0C6.5 2.8 5.5 3.1 5.5 3.1a4.3 4.3 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21"
            />
          </svg>
        </a>
      </div>
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
            <el-sub-menu v-for="group in activeMenuGroups" :key="group.key" :index="group.key">
              <template #title>
                <span
                  class="doc-nav__group"
                  :style="{
                    color:
                      group.accent ?? resolveFirstLevelRandomColor(`${topTab}-group-${group.key}`),
                  }"
                >
                  <span
                    class="doc-nav__group-marker"
                    :style="{
                      backgroundColor:
                        group.accent ??
                        resolveFirstLevelRandomColor(`${topTab}-group-${group.key}`),
                    }"
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
                  :style="{
                    backgroundColor: resolveFirstLevelRandomColor(`${topTab}-flat-${item.key}`),
                  }"
                />
                <span>{{ item.label }}</span>
              </span>
              <span class="doc-nav__item-tag">{{ item.tag }}</span>
            </el-menu-item>
          </template>
        </el-menu>
        <section ref="contentRef" class="doc-content">
          <component :is="activeView.component" v-if="activeView" v-bind="activeView.props" />
        </section>
      </template>

      <template v-else>
        <section
          ref="contentRef"
          :class="[
            'doc-content',
            'doc-content--full',
            {
              'doc-content--canvas-full': topTab === 'workflow-designer',
              'doc-content--home': topTab === 'home',
            },
          ]"
        >
          <component :is="activeView.component" v-if="activeView" v-bind="activeView.props" />
        </section>
      </template>
    </main>

    <!-- 移动端底栏：system 拆走后正好 5 项，不再需要「更多」面板 -->
    <nav class="doc-bottom-tabs">
      <button
        v-for="tab in navTabs"
        :key="tab.key"
        :class="['doc-bottom-tabs__item', { active: topTab === tab.key }]"
        @click="handleBottomTab(tab.key)"
      >
        <!-- eslint-disable vue/no-v-html -->
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
          stroke-linecap="round"
          stroke-linejoin="round"
          v-html="getNavVisual(tab.key).paths"
        />
        <!-- eslint-enable vue/no-v-html -->
        <span>{{ getNavVisual(tab.key).short }}</span>
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
    <div
      v-if="listOpen && activeTabMeta?.mode === 'menu'"
      class="doc-panel-backdrop"
      @click="listOpen = false"
    />

    <!-- 右上角浮层：主题配置 / 更新日志 -->
    <Transition name="pop-fade">
      <div v-if="activePop" class="pop-layer">
        <div class="pop-layer__backdrop" @click="closePop" />
        <HeaderThemePopover v-if="activePop === 'theme'" @close="closePop" />
        <HeaderChangelogPopover v-else @close="closePop" />
      </div>
    </Transition>
  </div>
</template>

<style scoped lang="scss">
@use "./style/variables" as *;
@use "./style/el-overrides" as *;

.doc {
  display: flex;
  flex-direction: column;
  height: 100vh;
  height: 100dvh;
  background: $doc-bg-page;
  color: $doc-text-primary;
}

// ============================================================
// 顶栏
// ============================================================
.doc-header {
  flex: none;
  display: flex;
  align-items: center;
  gap: $doc-sp-6;
  height: $doc-header-h;
  padding: 0 $doc-sp-6;
  border-bottom: 1px solid $doc-border-color;
  background: $doc-bg-card;
  transition:
    background-color 0.2s,
    border-color 0.2s;
}

.doc-header__menu-btn {
  display: none;
  place-items: center;
  flex: none;
  width: 32px;
  height: 32px;
  padding: 0;
  border: none;
  border-radius: $doc-radius-inner;
  background: transparent;
  color: $doc-text-secondary;
  cursor: pointer;

  &:hover {
    color: $doc-color-primary;
    background: $doc-bg-muted;
  }
}

// -- 品牌 --
.brand {
  flex: none;
  display: inline-flex;
  align-items: center;
  gap: $doc-sp-2;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
}

.brand__mark {
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  border-radius: $doc-radius-inner;
  color: #fff;
  background: $doc-color-primary;
  transition: background-color 0.2s;
}

.brand__name {
  font-size: $doc-fs-lg;
  font-weight: 600;
  letter-spacing: 0.06em;
  color: $doc-text-heading;
  white-space: nowrap;
}

// -- 模块导航：图标 + 文字 + 下划线指示 --
.doc-header__nav {
  display: flex;
  align-items: stretch;
  height: 100%;
  gap: $doc-sp-1;
}

.nav__item {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 0 $doc-sp-3;
  border: none;
  background: transparent;
  font-size: $doc-fs-base;
  color: $doc-text-secondary;
  white-space: nowrap;
  cursor: pointer;
  transition: color 0.2s;

  &:hover {
    color: $doc-color-primary;
  }

  // 选中态：主色文字 + 2px 下划线，比色块更克制
  &.is-active {
    color: $doc-color-primary;
    font-weight: 600;

    &::after {
      content: "";
      position: absolute;
      left: $doc-sp-3;
      right: $doc-sp-3;
      bottom: -1px;
      height: 2px;
      border-radius: 2px 2px 0 0;
      background: $doc-color-primary;
    }
  }
}

.nav__icon {
  flex: none;
  opacity: 0.9;
}

// -- 右侧动作 --
.header-actions {
  display: flex;
  align-items: center;
  gap: $doc-sp-1;
  margin-left: auto;
}

.icon-btn {
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border: none;
  border-radius: $doc-radius-inner;
  background: transparent;
  color: $doc-text-secondary;
  cursor: pointer;
  transition:
    color 0.2s,
    background-color 0.2s;

  &:hover,
  &.is-active {
    color: $doc-color-primary;
    background: $doc-bg-muted;
  }
}

// ============================================================
// 主体
// ============================================================
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

// 首页自己管留白（hero 需要顶到边缘），必须排在 --full 之后覆盖
.doc-content--home {
  padding: 0;
  overflow-x: hidden;
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

// ============================================================
// 平板：导航收紧（保留文字，只压字号与内边距）
// ============================================================
@media (max-width: $doc-bp-tablet) {
  .nav__item {
    gap: $doc-sp-1;
    padding: 0 $doc-sp-2;
    font-size: $doc-fs-sm;

    &.is-active::after {
      left: $doc-sp-2;
      right: $doc-sp-2;
    }
  }

  .nav__icon {
    width: 14px;
    height: 14px;
  }
}

// ============================================================
// 手机：导航移到底部 tabbar，侧边栏改抽屉
// ============================================================
@media (max-width: $doc-bp-mobile) {
  .doc-header {
    height: $doc-header-h-sm;
    gap: $doc-sp-2;
    padding: 0 $doc-sp-4;
  }

  .doc-header__menu-btn {
    display: grid;
  }

  .doc-header__nav {
    display: none;
  }

  .brand__name {
    font-size: $doc-fs-md;
  }

  .doc-nav {
    position: fixed;
    left: 0;
    top: $doc-header-h-sm;
    bottom: $doc-tabbar-h;
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
    inset: $doc-header-h-sm 0 $doc-tabbar-h;
    background: rgb(0 0 0 / 25%);
    z-index: 20;
  }

  .doc-bottom-tabs {
    display: flex;
    flex: none;
    border-top: 1px solid $doc-border-color;
    background: $doc-bg-card;
  }

  .doc-bottom-tabs__item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2px;
    height: $doc-tabbar-h;
    padding: 0;
    border: none;
    background: transparent;
    font-size: 10px;
    letter-spacing: 0.02em;
    color: $doc-text-secondary;
    cursor: pointer;
    transition: color 0.2s;

    &.active {
      color: $doc-color-primary;
      font-weight: 600;
    }
  }

  .doc-panel {
    display: flex;
    flex-direction: column;
    position: fixed;
    left: 0;
    right: 0;
    bottom: $doc-tabbar-h;
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
    inset: $doc-header-h-sm 0 $doc-tabbar-h;
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

<!-- 浮层是全局定位元素，样式不能带 scoped，单独走一份全局表 -->
<style lang="scss">
@use "./style/popover";
</style>
