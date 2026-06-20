<script setup lang="ts">
import { defineAsyncComponent } from "vue";
import DemoWidgetTabs from "../DemoWidgetTabs.vue";

const PreviewSplitPane = defineAsyncComponent(() => import("./preview/PreviewSplitPane.vue"));
const PreviewDragSortList = defineAsyncComponent(() => import("./preview/PreviewDragSortList.vue"));
const PreviewFloatingToolbar = defineAsyncComponent(() => import("./preview/PreviewFloatingToolbar.vue"));
const PreviewTreeTransfer = defineAsyncComponent(() => import("./preview/PreviewTreeTransfer.vue"));
const PreviewStepWizard = defineAsyncComponent(() => import("./preview/PreviewStepWizard.vue"));
const PreviewContextMenu = defineAsyncComponent(() => import("./preview/PreviewContextMenu.vue"));
const PreviewCountUp = defineAsyncComponent(() => import("./preview/PreviewCountUp.vue"));
const PreviewHeatmapCalendar = defineAsyncComponent(() => import("./preview/PreviewHeatmapCalendar.vue"));
const PreviewLightboxGallery = defineAsyncComponent(() => import("./preview/PreviewLightboxGallery.vue"));

const sections = [
  { id: "split-pane", title: "SplitPane 分割面板", desc: "拖拽调整左右比例，双击还原", component: PreviewSplitPane, code: "<SplitPane v-model:ratio=\"0.5\" />" },
  { id: "drag-sort", title: "DragSortList 拖拽排序", desc: "HTML5 拖拽 reorder 列表项", component: PreviewDragSortList, code: "<DragSortList v-model=\"items\" />" },
  { id: "float-toolbar", title: "FloatingToolbar 浮动操作栏", desc: "多选后底部浮出批量操作", component: PreviewFloatingToolbar, code: "<FloatingToolbar :count=\"selected\" @action=\"handle\" />" },
  { id: "tree-transfer", title: "TreeTransfer 树形穿梭", desc: "树形权限左右穿梭", component: PreviewTreeTransfer, code: "<TreeTransfer v-model=\"checkedKeys\" :data=\"tree\" />" },
  { id: "step-wizard", title: "StepWizard 分步向导", desc: "多步表单 + 校验拦截", component: PreviewStepWizard, code: "<StepWizard :steps=\"steps\" @finish=\"submit\" />" },
  { id: "context-menu", title: "ContextMenu 右键菜单", desc: "右键弹出操作菜单", component: PreviewContextMenu, code: "<ContextMenu :items=\"menuItems\" @select=\"onSelect\" />" },
  { id: "count-up", title: "CountUp 数字滚动", desc: "数字滚动动画 + 趋势展示", component: PreviewCountUp, code: "<CountUp :value=\"98765\" :duration=\"2000\" />" },
  { id: "heatmap", title: "HeatmapCalendar 热力日历", desc: "日格 hover 详情 + 色阶图例", component: PreviewHeatmapCalendar, code: "<HeatmapCalendar :data=\"dailyCounts\" />" },
  { id: "lightbox", title: "LightboxGallery 灯箱画廊", desc: "全屏预览 + 键盘导航", component: PreviewLightboxGallery, code: "<LightboxGallery :urls=\"images\" />" },
];
</script>

<template>
  <div class="interaction-page">
    <div class="doc-content__header">
      <h2>交互组件预览</h2>
      <p>9 个高交互组件的概念验证 Demo，供评估是否纳入组件库</p>
    </div>

    <nav class="interaction-nav">
      <a v-for="s in sections" :key="s.id" :href="`#${s.id}`">{{ s.title.split(" ")[0] }}</a>
    </nav>

    <section
      v-for="s in sections"
      :id="s.id"
      :key="s.id"
      class="interaction-section"
    >
      <h3 class="interaction-section__title">{{ s.title }}</h3>
      <p class="interaction-section__desc">{{ s.desc }}</p>
      <DemoWidgetTabs :code="s.code">
        <component :is="s.component" />
      </DemoWidgetTabs>
    </section>
  </div>
</template>

<style scoped lang="scss">
@use "../../style/variables" as *;
@use "../../style/demo";

.interaction-page {
  max-width: 900px;
}

.interaction-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 24px;
  padding: 12px 16px;
  background: $doc-bg-card;
  border: 1px solid $doc-border-color;
  border-radius: $doc-radius-lg;
  position: sticky;
  top: 0;
  z-index: 10;

  a {
    padding: 4px 10px;
    font-size: 12px;
    color: $doc-color-primary;
    text-decoration: none;
    border-radius: $doc-radius-sm;
    background: color-mix(in srgb, $doc-color-primary 8%, transparent);

    &:hover {
      background: color-mix(in srgb, $doc-color-primary 16%, transparent);
    }
  }
}

.interaction-section {
  margin-bottom: 40px;
  scroll-margin-top: 80px;

  &__title {
    margin: 0 0 6px;
    font-size: $doc-fs-md;
    font-weight: 600;
    color: $doc-text-heading;
  }

  &__desc {
    margin: 0 0 16px;
    font-size: $doc-fs-sm;
    color: $doc-text-secondary;
  }
}

@media (max-width: $doc-bp-mobile) {
  .interaction-nav {
    position: static;
  }
}
</style>
