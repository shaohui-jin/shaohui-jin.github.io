<script setup lang="ts">
import { computed, type Component, ref, watch, defineAsyncComponent } from "vue";

const DemoBaseTable = defineAsyncComponent(() => import("./demo/base-table/DemoBaseTable.vue"));
const DemoBaseSearch = defineAsyncComponent(() => import("./demo/base-search/DemoBaseSearch.vue"));
const DemoBaseSearchField = defineAsyncComponent(() => import("./demo/base-search-field/DemoBaseSearchField.vue"));
const DemoBaseSearchDrawer = defineAsyncComponent(() => import("./demo/base-search-drawer/DemoBaseSearchDrawer.vue"));
const DemoBaseColumnSetting = defineAsyncComponent(() => import("./demo/base-column-setting/DemoBaseColumnSetting.vue"));
const DemoBaseCrud = defineAsyncComponent(() => import("./demo/base-crud/DemoBaseCrud.vue"));
const DemoTag = defineAsyncComponent(() => import("./demo/tag/DemoTag.vue"));
const DemoDot = defineAsyncComponent(() => import("./demo/dot/DemoDot.vue"));
const DemoImage3D = defineAsyncComponent(() => import("./demo/image-3d/DemoImage3D.vue"));
const DemoImageCarousel = defineAsyncComponent(() => import("./demo/image-carousel/DemoImageCarousel.vue"));
const DemoImagePointer = defineAsyncComponent(() => import("./demo/image-pointer/DemoImagePointer.vue"));
const DemoCanvasTime = defineAsyncComponent(() => import("./demo/canvas-time/DemoCanvasTime.vue"));
const DemoCodeBlock = defineAsyncComponent(() => import("./demo/code-block/DemoCodeBlock.vue"));
const DemoWidgetTabs = defineAsyncComponent(() => import("./demo/widget-tabs/DemoWidgetTabs.vue"));
const DemoSplitPane = defineAsyncComponent(() => import("./demo/split-pane/DemoSplitPane.vue"));
const DemoDragSortList = defineAsyncComponent(() => import("./demo/drag-sort-list/DemoDragSortList.vue"));
const DemoFloatingToolbar = defineAsyncComponent(() => import("./demo/floating-toolbar/DemoFloatingToolbar.vue"));
const DemoTreeTransfer = defineAsyncComponent(() => import("./demo/tree-transfer/DemoTreeTransfer.vue"));
const DemoStepWizard = defineAsyncComponent(() => import("./demo/step-wizard/DemoStepWizard.vue"));
const DemoContextMenu = defineAsyncComponent(() => import("./demo/context-menu/DemoContextMenu.vue"));
const DemoImageLightbox = defineAsyncComponent(() => import("./demo/image-lightbox/DemoImageLightbox.vue"));
const DemoCanvasCountUp = defineAsyncComponent(() => import("./demo/canvas-count-up/DemoCanvasCountUp.vue"));
const DemoHeatmapCalendar = defineAsyncComponent(() => import("./demo/heatmap-calendar/DemoHeatmapCalendar.vue"));
const DemoUtils = defineAsyncComponent(() => import("./demo/utils/DemoUtils.vue"));
const DemoConfigProvider = defineAsyncComponent(() => import("./demo/config-provider/DemoConfigProvider.vue"));
const ChangelogPanel = defineAsyncComponent(() => import("./demo/changelog/ChangelogPanel.vue"));

type TopTab = "docs" | "utils" | "config" | "changelog";

const pageMap: Record<string, Component> = {
  tables: DemoBaseTable,
  "base-search": DemoBaseSearch,
  "base-search-field": DemoBaseSearchField,
  "base-search-drawer": DemoBaseSearchDrawer,
  "base-column-setting": DemoBaseColumnSetting,
  "base-crud": DemoBaseCrud,
  tag: DemoTag,
  dot: DemoDot,
  "image-3d": DemoImage3D,
  "image-carousel": DemoImageCarousel,
  "image-pointer": DemoImagePointer,
  "image-lightbox": DemoImageLightbox,
  "code-block": DemoCodeBlock,
  "widget-tabs": DemoWidgetTabs,
  "canvas-time": DemoCanvasTime,
  "canvas-count-up": DemoCanvasCountUp,
  "split-pane": DemoSplitPane,
  "drag-sort-list": DemoDragSortList,
  "floating-toolbar": DemoFloatingToolbar,
  "tree-transfer": DemoTreeTransfer,
  "step-wizard": DemoStepWizard,
  "context-menu": DemoContextMenu,
  "heatmap-calendar": DemoHeatmapCalendar,
};

/** Demo 侧边栏分组（菜单 tag 与功能分类一致） */
const docMenuGroups = [
  {
    index: "crud",
    title: "CRUD 组件",
    accent: "#e6a23c",
    items: [
      { key: "tables", name: "BaseTable", tag: "表格" },
      { key: "base-search", name: "BaseSearch", tag: "搜索" },
      { key: "base-search-field", name: "BaseSearchField", tag: "字段" },
      { key: "base-search-drawer", name: "BaseSearchDrawer", tag: "抽屉" },
      { key: "base-column-setting", name: "BaseColumnSetting", tag: "列设置" },
      { key: "base-crud", name: "BaseCrud", tag: "联动" },
    ],
  },
  {
    index: "status",
    title: "状态标记",
    accent: "#909399",
    items: [
      { key: "tag", name: "Tag", tag: "状态标记" },
      { key: "dot", name: "Dot", tag: "状态标记" },
    ],
  },
  {
    index: "image",
    title: "图片",
    accent: "#409eff",
    items: [
      { key: "image-3d", name: "Image3D", tag: "图片" },
      { key: "image-carousel", name: "ImageCarousel", tag: "图片" },
      { key: "image-pointer", name: "ImagePointer", tag: "图片" },
      { key: "image-lightbox", name: "ImageLightbox", tag: "图片" },
    ],
  },
  {
    index: "doc",
    title: "文档",
    accent: "#626aef",
    items: [
      { key: "code-block", name: "CodeBlock", tag: "文档" },
      { key: "widget-tabs", name: "WidgetTabs", tag: "文档" },
    ],
  },
  {
    index: "canvas",
    title: "Canvas",
    accent: "#f56c6c",
    items: [
      { key: "canvas-time", name: "CanvasTime", tag: "Canvas" },
      { key: "canvas-count-up", name: "CanvasCountUp", tag: "Canvas" },
    ],
  },
  {
    index: "layout",
    title: "布局",
    accent: "#00bcd4",
    items: [{ key: "split-pane", name: "SplitPane", tag: "布局" }],
  },
  {
    index: "list-op",
    title: "列表操作",
    accent: "#ff9800",
    items: [
      { key: "drag-sort-list", name: "DragSortList", tag: "列表操作" },
      { key: "floating-toolbar", name: "FloatingToolbar", tag: "列表操作" },
    ],
  },
  {
    index: "select",
    title: "选择",
    accent: "#9c27b0",
    items: [{ key: "tree-transfer", name: "TreeTransfer", tag: "选择" }],
  },
  {
    index: "flow",
    title: "流程",
    accent: "#3f51b5",
    items: [{ key: "step-wizard", name: "StepWizard", tag: "流程" }],
  },
  {
    index: "menu",
    title: "菜单",
    accent: "#795548",
    items: [{ key: "context-menu", name: "ContextMenu", tag: "菜单" }],
  },
  {
    index: "viz",
    title: "数据可视化",
    accent: "#009688",
    items: [{ key: "heatmap-calendar", name: "HeatmapCalendar", tag: "数据可视化" }],
  },
] as const;

const docMenuDefaultOpeneds = docMenuGroups.map((g) => g.index);

const FIRST_LEAF_KEY = "tables";
const FIRST_UTILS_KEY = "rgbaToHex";

const topTab = ref<TopTab>("docs");
const activeName = ref(FIRST_LEAF_KEY);
const activeUtilsName = ref(FIRST_UTILS_KEY);
const activePage = computed(() => pageMap[activeName.value] ?? DemoBaseTable);

const navOpen = ref(false);
const compListOpen = ref(false);

function handleSelect(key: string) {
  activeName.value = key;
  navOpen.value = false;
  compListOpen.value = false;
}

function switchTopTab(tab: TopTab) {
  topTab.value = tab;
  navOpen.value = false;
  compListOpen.value = false;
  if (tab === "docs") {
    activeName.value = FIRST_LEAF_KEY;
  } else if (tab === "utils") {
    activeUtilsName.value = FIRST_UTILS_KEY;
  }
}

function handleUtilsSelect(key: string) {
  activeUtilsName.value = key;
  navOpen.value = false;
}

function handleBottomTab(tab: TopTab) {
  if (tab === "docs" || tab === "utils") {
    if (topTab.value === tab) {
      compListOpen.value = !compListOpen.value;
    } else {
      topTab.value = tab;
      requestAnimationFrame(() => {
        compListOpen.value = true;
      });
    }
  } else {
    topTab.value = tab;
    compListOpen.value = false;
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
            :class="['doc-header__tab', { active: topTab === 'utils' }]"
            @click="switchTopTab('utils')"
          >
            工具函数
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
          :default-openeds="docMenuDefaultOpeneds"
          @select="handleSelect"
        >
          <el-sub-menu v-for="group in docMenuGroups" :key="group.index" :index="group.index">
            <template #title>
              <el-icon><i class="nav-icon" :style="{ background: group.accent }" /></el-icon>
              <span class="nav-group__title" :style="{ color: group.accent }">{{ group.title }}</span>
            </template>
            <el-menu-item v-for="item in group.items" :key="item.key" :index="item.key">
              <span class="nav-item__name">{{ item.name }}</span>
              <span class="nav-item__tag">{{ item.tag }}</span>
            </el-menu-item>
          </el-sub-menu>
        </el-menu>

        <div class="doc-content">
          <component :is="activePage" />
        </div>
      </template>

      <template v-else-if="topTab === 'utils'">
        <div class="doc-nav-backdrop" :class="{ visible: navOpen }" @click="navOpen = false" />
        <el-menu
          :default-active="activeUtilsName"
          class="doc-nav"
          :class="{ 'doc-nav--open': navOpen }"
          :default-openeds="['color', 'number', 'object', 'array', 'clipboard', 'debounce-group', 'optimize', 'permission', 'typescript']"
          @select="handleUtilsSelect"
        >
          <el-sub-menu index="color">
            <template #title><span>颜色工具</span></template>
            <el-menu-item index="rgbaToHex">
              <span class="nav-item__name">rgbaToHex</span>
              <span class="nav-item__tag">rgba转hex</span>
            </el-menu-item>
            <el-menu-item index="hexToRGBA">
              <span class="nav-item__name">hexToRGBA</span>
              <span class="nav-item__tag">hex转rgba</span>
            </el-menu-item>
            <el-menu-item index="colorToRGBA">
              <span class="nav-item__name">colorToRGBA</span>
              <span class="nav-item__tag">hex转对象</span>
            </el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="number">
            <template #title><span>数字工具</span></template>
            <el-menu-item index="getRandom">
              <span class="nav-item__name">getRandom</span>
              <span class="nav-item__tag">随机整数</span>
            </el-menu-item>
            <el-menu-item index="scaleFormat">
              <span class="nav-item__name">scaleFormat</span>
              <span class="nav-item__tag">精度格式化</span>
            </el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="object">
            <template #title><span>对象工具</span></template>
            <el-menu-item index="flattenObj">
              <span class="nav-item__name">flattenObj</span>
              <span class="nav-item__tag">扁平化</span>
            </el-menu-item>
            <el-menu-item index="unFlatten">
              <span class="nav-item__name">unFlatten</span>
              <span class="nav-item__tag">还原嵌套</span>
            </el-menu-item>
            <el-menu-item index="isObjEqual">
              <span class="nav-item__name">isObjEqual</span>
              <span class="nav-item__tag">深度比较</span>
            </el-menu-item>
            <el-menu-item index="isObjEmpty">
              <span class="nav-item__name">isObjEmpty</span>
              <span class="nav-item__tag">判空</span>
            </el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="array">
            <template #title><span>数组工具</span></template>
            <el-menu-item index="flattenTree">
              <span class="nav-item__name">flattenTree</span>
              <span class="nav-item__tag">树形展开</span>
            </el-menu-item>
            <el-menu-item index="isArrEqual">
              <span class="nav-item__name">isArrEqual</span>
              <span class="nav-item__tag">无序比较</span>
            </el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="clipboard">
            <template #title><span>剪贴板</span></template>
            <el-menu-item index="copyToClipboard">
              <span class="nav-item__name">copyToClipboard</span>
              <span class="nav-item__tag">复制文本</span>
            </el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="debounce-group">
            <template #title><span>防抖</span></template>
            <el-menu-item index="debounce">
              <span class="nav-item__name">debounce</span>
              <span class="nav-item__tag">延迟执行</span>
            </el-menu-item>
            <el-menu-item index="useDebounceRef">
              <span class="nav-item__name">useDebounceRef</span>
              <span class="nav-item__tag">防抖ref</span>
            </el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="optimize">
            <template #title><span>性能优化</span></template>
            <el-menu-item index="performChunk">
              <span class="nav-item__name">performChunk</span>
              <span class="nav-item__tag">分片执行</span>
            </el-menu-item>
            <el-menu-item index="concurRequest">
              <span class="nav-item__name">concurRequest</span>
              <span class="nav-item__tag">并发控制</span>
            </el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="permission">
            <template #title><span>权限管理</span></template>
            <el-menu-item index="usePermission">
              <span class="nav-item__name">usePermission</span>
              <span class="nav-item__tag">位运算权限</span>
            </el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="typescript">
            <template #title><span>类型体操</span></template>
            <el-menu-item index="getValue">
              <span class="nav-item__name">getValue</span>
              <span class="nav-item__tag">getter映射</span>
            </el-menu-item>
            <el-menu-item index="setValue">
              <span class="nav-item__name">setValue</span>
              <span class="nav-item__tag">setter映射</span>
            </el-menu-item>
            <el-menu-item index="getOptional">
              <span class="nav-item__name">getOptional</span>
              <span class="nav-item__tag">提取可选</span>
            </el-menu-item>
            <el-menu-item index="setOptional">
              <span class="nav-item__name">setOptional</span>
              <span class="nav-item__tag">设为可选</span>
            </el-menu-item>
            <el-menu-item index="arrayToUnion">
              <span class="nav-item__name">arrayToUnion</span>
              <span class="nav-item__tag">数组转联合</span>
            </el-menu-item>
            <el-menu-item index="getCompType">
              <span class="nav-item__name">getCompType</span>
              <span class="nav-item__tag">组件ref类型</span>
            </el-menu-item>
          </el-sub-menu>
        </el-menu>

        <div class="doc-content">
          <DemoUtils :active-key="activeUtilsName" />
        </div>
      </template>

      <template v-else-if="topTab === 'config'">
        <div class="doc-content doc-content--full">
          <div class="doc-panel">
            <DemoConfigProvider />
          </div>
        </div>
      </template>

      <template v-else-if="topTab === 'changelog'">
        <div class="doc-content doc-content--full">
          <div class="doc-panel">
            <ChangelogPanel />
          </div>
        </div>
      </template>
    </main>

    <!-- 底部 Tab 栏（平板/移动端） -->
    <nav class="doc-bottom-bar">
      <button
        :class="['doc-bottom-tab', { active: topTab === 'docs' }]"
        @click="handleBottomTab('docs')"
      >
        <svg class="doc-bottom-tab__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
        <span>组件</span>
      </button>
      <button
        :class="['doc-bottom-tab', { active: topTab === 'utils' }]"
        @click="handleBottomTab('utils')"
      >
        <svg class="doc-bottom-tab__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
        </svg>
        <span>工具</span>
      </button>
      <button
        :class="['doc-bottom-tab', { active: topTab === 'config' }]"
        @click="handleBottomTab('config')"
      >
        <svg class="doc-bottom-tab__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
        <span>配置</span>
      </button>
      <button
        :class="['doc-bottom-tab', { active: topTab === 'changelog' }]"
        @click="handleBottomTab('changelog')"
      >
        <svg class="doc-bottom-tab__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
        <span>变更</span>
      </button>
    </nav>

    <!-- 组件列表面板（平板端：侧边浮层 / 移动端：底部弹出） -->
    <Transition name="doc-complist">
      <div
        v-if="compListOpen && topTab === 'docs'"
        class="doc-complist"
      >
        <div class="doc-complist__header">
          <span>选择组件</span>
          <button class="doc-complist__close" @click="compListOpen = false">✕</button>
        </div>
        <div class="doc-complist__body">
          <template v-for="group in docMenuGroups" :key="group.index">
            <div class="doc-complist__group-title" :style="{ color: group.accent }">{{ group.title }}</div>
            <button
              v-for="item in group.items"
              :key="item.key"
              :class="['doc-complist__item', { active: activeName === item.key }]"
              @click="handleSelect(item.key)"
            >
              <span class="doc-complist__name">{{ item.name }}</span>
              <span class="doc-complist__tag">{{ item.tag }}</span>
            </button>
          </template>
        </div>
      </div>
    </Transition>
    <Transition name="doc-complist-backdrop">
      <div
        v-if="compListOpen && topTab === 'docs'"
        class="doc-complist-backdrop"
        @click="compListOpen = false"
      />
    </Transition>

    <!-- 工具函数列表（移动端） -->
    <Transition name="doc-complist">
      <div
        v-if="compListOpen && topTab === 'utils'"
        class="doc-complist"
      >
        <div class="doc-complist__header">
          <span>选择工具</span>
          <button class="doc-complist__close" @click="compListOpen = false">✕</button>
        </div>
        <div class="doc-complist__body">
          <div class="doc-complist__group-title">颜色工具</div>
          <button v-for="item in [
            { key: 'rgbaToHex', name: 'rgbaToHex', tag: 'rgba转hex' },
            { key: 'hexToRGBA', name: 'hexToRGBA', tag: 'hex转rgba' },
            { key: 'colorToRGBA', name: 'colorToRGBA', tag: 'hex转对象' },
          ]" :key="item.key" :class="['doc-complist__item', { active: activeUtilsName === item.key }]" @click="handleUtilsSelect(item.key); compListOpen = false">
            <span class="doc-complist__name">{{ item.name }}</span>
            <span class="doc-complist__tag">{{ item.tag }}</span>
          </button>
          <div class="doc-complist__group-title">数字工具</div>
          <button v-for="item in [
            { key: 'getRandom', name: 'getRandom', tag: '随机整数' },
            { key: 'scaleFormat', name: 'scaleFormat', tag: '精度格式化' },
          ]" :key="item.key" :class="['doc-complist__item', { active: activeUtilsName === item.key }]" @click="handleUtilsSelect(item.key); compListOpen = false">
            <span class="doc-complist__name">{{ item.name }}</span>
            <span class="doc-complist__tag">{{ item.tag }}</span>
          </button>
          <div class="doc-complist__group-title">对象工具</div>
          <button v-for="item in [
            { key: 'flattenObj', name: 'flattenObj', tag: '扁平化' },
            { key: 'unFlatten', name: 'unFlatten', tag: '还原嵌套' },
            { key: 'isObjEqual', name: 'isObjEqual', tag: '深度比较' },
            { key: 'isObjEmpty', name: 'isObjEmpty', tag: '判空' },
          ]" :key="item.key" :class="['doc-complist__item', { active: activeUtilsName === item.key }]" @click="handleUtilsSelect(item.key); compListOpen = false">
            <span class="doc-complist__name">{{ item.name }}</span>
            <span class="doc-complist__tag">{{ item.tag }}</span>
          </button>
          <div class="doc-complist__group-title">数组工具</div>
          <button v-for="item in [
            { key: 'flattenTree', name: 'flattenTree', tag: '树形展开' },
            { key: 'isArrEqual', name: 'isArrEqual', tag: '无序比较' },
          ]" :key="item.key" :class="['doc-complist__item', { active: activeUtilsName === item.key }]" @click="handleUtilsSelect(item.key); compListOpen = false">
            <span class="doc-complist__name">{{ item.name }}</span>
            <span class="doc-complist__tag">{{ item.tag }}</span>
          </button>
          <div class="doc-complist__group-title">剪贴板</div>
          <button :class="['doc-complist__item', { active: activeUtilsName === 'copyToClipboard' }]" @click="handleUtilsSelect('copyToClipboard'); compListOpen = false">
            <span class="doc-complist__name">copyToClipboard</span>
            <span class="doc-complist__tag">复制文本</span>
          </button>
          <div class="doc-complist__group-title">防抖</div>
          <button v-for="item in [
            { key: 'debounce', name: 'debounce', tag: '延迟执行' },
            { key: 'useDebounceRef', name: 'useDebounceRef', tag: '防抖ref' },
          ]" :key="item.key" :class="['doc-complist__item', { active: activeUtilsName === item.key }]" @click="handleUtilsSelect(item.key); compListOpen = false">
            <span class="doc-complist__name">{{ item.name }}</span>
            <span class="doc-complist__tag">{{ item.tag }}</span>
          </button>
          <div class="doc-complist__group-title">性能优化</div>
          <button v-for="item in [
            { key: 'performChunk', name: 'performChunk', tag: '分片执行' },
            { key: 'concurRequest', name: 'concurRequest', tag: '并发控制' },
          ]" :key="item.key" :class="['doc-complist__item', { active: activeUtilsName === item.key }]" @click="handleUtilsSelect(item.key); compListOpen = false">
            <span class="doc-complist__name">{{ item.name }}</span>
            <span class="doc-complist__tag">{{ item.tag }}</span>
          </button>
          <div class="doc-complist__group-title">权限管理</div>
          <button :class="['doc-complist__item', { active: activeUtilsName === 'usePermission' }]" @click="handleUtilsSelect('usePermission'); compListOpen = false">
            <span class="doc-complist__name">usePermission</span>
            <span class="doc-complist__tag">位运算权限</span>
          </button>
          <div class="doc-complist__group-title">类型体操</div>
          <button v-for="item in [
            { key: 'getValue', name: 'getValue', tag: 'getter映射' },
            { key: 'setValue', name: 'setValue', tag: 'setter映射' },
            { key: 'getOptional', name: 'getOptional', tag: '提取可选' },
            { key: 'setOptional', name: 'setOptional', tag: '设为可选' },
            { key: 'arrayToUnion', name: 'arrayToUnion', tag: '数组转联合' },
            { key: 'getCompType', name: 'getCompType', tag: '组件ref类型' },
          ]" :key="item.key" :class="['doc-complist__item', { active: activeUtilsName === item.key }]" @click="handleUtilsSelect(item.key); compListOpen = false">
            <span class="doc-complist__name">{{ item.name }}</span>
            <span class="doc-complist__tag">{{ item.tag }}</span>
          </button>
        </div>
      </div>
    </Transition>
    <Transition name="doc-complist-backdrop">
      <div
        v-if="compListOpen && topTab === 'utils'"
        class="doc-complist-backdrop"
        @click="compListOpen = false"
      />
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
}

.nav-group__title {
  font-weight: 600;
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
    min-width: 0;
  }
}

.doc-panel {
  background: $doc-bg-card;
  border-radius: $doc-radius-lg;
  padding: $doc-sp-2xl 32px;
  min-width: 0;
  overflow: hidden;
}

// ============================================================
// 底部 Tab 栏（平板/移动端专用，PC 端隐藏）
// ============================================================
$bottom-bar-height: 52px;

.doc-bottom-bar {
  display: none;
}

.doc-bottom-tab {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 6px 0 8px;
  border: none;
  background: transparent;
  cursor: pointer;
  color: $doc-text-secondary;
  font-size: 11px;
  font-weight: 500;
  transition: color 0.15s;

  &.active {
    color: $doc-color-primary;
  }
}

.doc-bottom-tab__icon {
  width: 20px;
  height: 20px;
}

// ============================================================
// 组件列表面板（平板/移动端专用）
// ============================================================
.doc-complist {
  display: none;
}

.doc-complist-backdrop {
  display: none;
}

.doc-complist__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px 10px;
  font-size: $doc-fs-base;
  font-weight: 600;
  color: $doc-text-heading;
  border-bottom: 1px solid $doc-border-color;
}

.doc-complist__close {
  width: 28px;
  height: 28px;
  border: none;
  background: $doc-bg-muted;
  border-radius: 50%;
  font-size: 13px;
  cursor: pointer;
  color: $doc-text-regular;
  display: flex;
  align-items: center;
  justify-content: center;
}

.doc-complist__body {
  overflow-y: auto;
  padding: 4px 0;
}

.doc-complist__group-title {
  padding: 12px 16px 4px;
  font-size: 11px;
  font-weight: 600;
  color: $doc-text-secondary;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.doc-complist__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 12px 16px;
  border: none;
  background: transparent;
  cursor: pointer;
  text-align: left;
  font-size: $doc-fs-sm;
  color: $doc-text-primary;
  min-height: 44px;
  transition: background 0.1s;

  &:active {
    background: $doc-bg-subtle;
  }

  &.active {
    color: $doc-color-primary;
    font-weight: 600;
    background: color-mix(in srgb, $doc-color-primary 6%, transparent);
  }
}

.doc-complist__name {
  font-family: $doc-font-mono;
}

.doc-complist__tag {
  font-size: 11px;
  color: $doc-text-secondary;
  background: $doc-bg-muted;
  padding: 2px 6px;
  border-radius: $doc-radius-sm;
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

  .doc-header__tabs {
    display: none;
  }

  .doc-nav {
    display: none !important;
  }

  .doc-content {
    padding: 24px 24px 16px;
  }

  .doc-panel {
    padding: $doc-sp-xl $doc-sp-2xl;
  }

  .doc-bottom-bar {
    display: flex;
    flex-shrink: 0;
    position: relative;
    background: $doc-bg-card;
    border-top: 1px solid $doc-border-color;
    z-index: 102;
  }

  .doc-complist {
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 56px;
    left: 0;
    bottom: $bottom-bar-height;
    width: 260px;
    background: $doc-bg-card;
    border-right: 1px solid $doc-border-color;
    box-shadow: 2px 0 12px rgb(0 0 0 / 8%);
    z-index: 101;
  }

  .doc-complist-backdrop {
    display: block;
    position: fixed;
    top: 56px;
    left: 0;
    right: 0;
    bottom: $bottom-bar-height;
    background: rgb(0 0 0 / 20%);
    z-index: 100;
  }

  .doc-complist-enter-active,
  .doc-complist-leave-active {
    transition: transform 0.3s ease;
  }

  .doc-complist-enter-from,
  .doc-complist-leave-to {
    transform: translateX(-100%);
  }

  .doc-complist-backdrop-enter-active,
  .doc-complist-backdrop-leave-active {
    transition: opacity 0.3s;
  }

  .doc-complist-backdrop-enter-from,
  .doc-complist-backdrop-leave-to {
    opacity: 0;
  }
}

// ============================================================
// 移动端 (< 768px)
// ============================================================
@media (max-width: $doc-bp-mobile) {
  .doc-header {
    height: 48px;
  }

  .doc-header__inner {
    padding: 0 $doc-sp-lg;
  }

  .doc-header__menu-btn {
    display: none;
  }

  .doc-header__title {
    font-size: $doc-fs-md;
    margin-right: auto;
  }

  .doc-header__tabs {
    display: none;
  }

  .doc-nav {
    display: none !important;
  }

  .doc-nav-backdrop {
    display: none;
  }

  .doc-content {
    padding: 16px $doc-sp-lg 16px;
  }

  .doc-panel {
    padding: $doc-sp-lg;
    border-radius: $doc-radius-md;
    overflow-x: auto;
  }

  .doc-bottom-bar {
    display: flex;
    flex-shrink: 0;
    position: relative;
    background: $doc-bg-card;
    border-top: 1px solid $doc-border-color;
    z-index: 102;
  }

  .doc-complist {
    display: flex;
    flex-direction: column;
    position: fixed;
    top: auto;
    left: 0;
    right: 0;
    bottom: $bottom-bar-height;
    width: auto;
    max-height: 55vh;
    background: $doc-bg-card;
    border-radius: 16px 16px 0 0;
    border-right: none;
    box-shadow: 0 -4px 20px rgb(0 0 0 / 10%);
    z-index: 101;
  }

  .doc-complist-backdrop {
    display: block;
    position: fixed;
    top: 48px;
    left: 0;
    right: 0;
    bottom: $bottom-bar-height;
    background: rgb(0 0 0 / 20%);
    z-index: 100;
  }

  .doc-complist-enter-active,
  .doc-complist-leave-active {
    transition: transform 0.3s ease;
  }

  .doc-complist-enter-from,
  .doc-complist-leave-to {
    transform: translateY(100%);
  }

  .doc-complist-backdrop-enter-active,
  .doc-complist-backdrop-leave-active {
    transition: opacity 0.3s;
  }

  .doc-complist-backdrop-enter-from,
  .doc-complist-backdrop-leave-to {
    opacity: 0;
  }
}
</style>
