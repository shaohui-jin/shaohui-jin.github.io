<script setup lang="ts">
import { defineAsyncComponent } from "vue";

defineProps<{ name: string }>();

const PreviewSplitPane = defineAsyncComponent(
  () => import("../demo/interaction/preview/PreviewSplitPane.vue"),
);
const PreviewDragSortList = defineAsyncComponent(
  () => import("../demo/interaction/preview/PreviewDragSortList.vue"),
);
const PreviewFloatingToolbar = defineAsyncComponent(
  () => import("../demo/interaction/preview/PreviewFloatingToolbar.vue"),
);
const PreviewTreeTransfer = defineAsyncComponent(
  () => import("../demo/interaction/preview/PreviewTreeTransfer.vue"),
);
const PreviewStepWizard = defineAsyncComponent(
  () => import("../demo/interaction/preview/PreviewStepWizard.vue"),
);
const PreviewContextMenu = defineAsyncComponent(
  () => import("../demo/interaction/preview/PreviewContextMenu.vue"),
);
const PreviewCountUp = defineAsyncComponent(
  () => import("../demo/interaction/preview/PreviewCountUp.vue"),
);
const PreviewHeatmapCalendar = defineAsyncComponent(
  () => import("../demo/interaction/preview/PreviewHeatmapCalendar.vue"),
);
const PreviewLightboxGallery = defineAsyncComponent(
  () => import("../demo/interaction/preview/PreviewLightboxGallery.vue"),
);
</script>

<template>
  <PreviewSplitPane v-if="name === 'i-split-pane'" />
  <PreviewDragSortList v-else-if="name === 'i-drag-sort'" />
  <PreviewFloatingToolbar v-else-if="name === 'i-float-toolbar'" />
  <PreviewTreeTransfer v-else-if="name === 'i-tree-transfer'" />
  <PreviewStepWizard v-else-if="name === 'i-step-wizard'" />
  <PreviewContextMenu v-else-if="name === 'i-context-menu'" />
  <PreviewCountUp v-else-if="name === 'i-count-up'" />
  <PreviewHeatmapCalendar v-else-if="name === 'i-heatmap'" />
  <PreviewLightboxGallery v-else-if="name === 'i-lightbox'" />
</template>
