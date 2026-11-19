<script setup lang="ts">
import { computed, type Component } from "vue";
import DemoWidgetTabs from "@/works/comp/doc/demo/DemoWidgetTabs.vue";
import CanvasPreview from "@/works/comp/doc/preview/CanvasPreview.vue";
import CrudPreview from "@/works/comp/doc/preview/CrudPreview.vue";
import DocPreview from "@/works/comp/doc/preview/DocPreview.vue";
import ImagePreview from "@/works/comp/doc/preview/ImagePreview.vue";
import InteractionPreview from "@/works/comp/doc/preview/InteractionPreview.vue";
import StatusPreview from "@/works/comp/doc/preview/StatusPreview.vue";
import WidgetPreview from "@/works/comp/doc/preview/WidgetPreview.vue";

const views: Record<string, Component> = {
  tables: CrudPreview,
  "base-search": CrudPreview,
  "base-search-field": CrudPreview,
  "base-search-drawer": CrudPreview,
  "base-column-setting": CrudPreview,
  "base-crud": CrudPreview,
  tag: StatusPreview,
  dot: StatusPreview,
  "dot-slot": StatusPreview,
  "image-3d": ImagePreview,
  "image-carousel": ImagePreview,
  "image-carousel-autoplay": ImagePreview,
  "image-pointer": ImagePreview,
  "image-pointer-gap": ImagePreview,
  "image-lightbox": ImagePreview,
  "code-block": DocPreview,
  "code-block-plain": DocPreview,
  "code-block-theme": DocPreview,
  "widget-tabs": DocPreview,
  "widget-tabs-flush": DocPreview,
  "canvas-time": CanvasPreview,
  "canvas-count-up": CanvasPreview,
  "split-pane": WidgetPreview,
  "drag-sort-list": WidgetPreview,
  "floating-toolbar": WidgetPreview,
  "tree-transfer": WidgetPreview,
  "step-wizard": WidgetPreview,
  "context-menu": WidgetPreview,
  "heatmap-calendar": WidgetPreview,
  "i-split-pane": InteractionPreview,
  "i-drag-sort": InteractionPreview,
  "i-float-toolbar": InteractionPreview,
  "i-tree-transfer": InteractionPreview,
  "i-step-wizard": InteractionPreview,
  "i-context-menu": InteractionPreview,
  "i-count-up": InteractionPreview,
  "i-heatmap": InteractionPreview,
  "i-lightbox": InteractionPreview,
};

const flushKeys = new Set(["tables", "base-column-setting", "base-crud"]);

const props = defineProps<{
  previewKey: string;
  code: string;
}>();

const view = computed(() => views[props.previewKey]);
const flush = computed(() => flushKeys.has(props.previewKey));
</script>

<template>
  <DemoWidgetTabs :code="code" :flush="flush">
    <component :is="view" :name="previewKey" />
  </DemoWidgetTabs>
</template>
