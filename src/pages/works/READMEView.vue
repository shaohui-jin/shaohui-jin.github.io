<script setup lang="ts">
import { computed, ref, watch } from "vue";
import MarkdownRenderer from "@/doc-render/MarkdownRenderer.vue";
import type { HomeProject } from "../home/homeData";
import { loadRepoReadme } from "./readmeLoader";

const props = defineProps<{ project: HomeProject }>();

const loading = ref(false);
const source = ref<string | null>(null);
const failed = ref(false);

const repoFull = computed(() => (props.project.repo ? `shaohui-jin/${props.project.repo}` : ""));
const repoUrl = computed(() => props.project.href);

watch(
  () => props.project.repo,
  async (repo) => {
    source.value = null;
    failed.value = false;
    if (!repo) return;

    // 已知没有 README 的仓库不必发一次注定 404 的请求
    if (props.project.hasReadme === false) {
      failed.value = true;
      return;
    }

    loading.value = true;
    try {
      const result = await loadRepoReadme(`shaohui-jin/${repo}`);
      source.value = result.source;
      failed.value = result.source === null;
    } catch {
      failed.value = true;
    } finally {
      loading.value = false;
    }
  },
  { immediate: true },
);
</script>

<template>
  <article class="readme-view">
    <header class="readme-view__bar">
      <div class="readme-view__title">
        <span class="readme-view__name">{{ project.name }}</span>
        <span class="readme-view__repo">{{ repoFull }}</span>
      </div>
      <a class="readme-view__link" :href="repoUrl" target="_blank" rel="noreferrer">
        在 GitHub 打开 ↗
      </a>
    </header>

    <div class="readme-view__body">
      <p v-if="loading" class="readme-view__hint">正在读取 README…</p>

      <div v-else-if="failed || !source" class="readme-view__empty">
        <p class="readme-view__desc">{{ project.desc }}</p>
        <p class="readme-view__hint">这个仓库还没有 README，先去 GitHub 看源码和目录说明。</p>
        <a class="readme-view__button" :href="repoUrl" target="_blank" rel="noreferrer">
          前往 {{ repoFull }} ↗
        </a>
      </div>

      <MarkdownRenderer v-else :source="source" plain />
    </div>
  </article>
</template>

<style scoped lang="scss">
@use "../../styles/site/variables" as *;

.readme-view {
  display: flex;
  flex-direction: column;
  min-height: 0;
  height: 100%;
  background: $doc-bg-card;
  border: 1px solid $doc-border-color;
  border-radius: $doc-radius-card;
  overflow: hidden;
}

.readme-view__bar {
  flex: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: $doc-sp-3;
  padding: $doc-sp-3 $doc-sp-4;
  border-bottom: 1px solid $doc-border-color;
}

.readme-view__title {
  display: flex;
  align-items: baseline;
  gap: $doc-sp-2;
  min-width: 0;
}

.readme-view__name {
  font-size: $doc-fs-md;
  font-weight: 600;
  color: $doc-text-heading;
}

.readme-view__repo {
  font-size: $doc-fs-xs;
  color: $doc-text-secondary;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.readme-view__link {
  flex: none;
  font-size: $doc-fs-xs;
  color: $doc-color-primary;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
}

.readme-view__body {
  flex: 1;
  min-height: 0;
  overflow: auto;
  padding: $doc-sp-4 $doc-sp-5;
}

.readme-view__hint {
  margin: 0;
  font-size: $doc-fs-sm;
  color: $doc-text-secondary;
}

.readme-view__empty {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: $doc-sp-3;
}

.readme-view__desc {
  margin: 0;
  font-size: $doc-fs-md;
  color: $doc-text-heading;
}

.readme-view__button {
  display: inline-flex;
  align-items: center;
  min-height: 32px;
  padding: 0 $doc-sp-3;
  font-size: $doc-fs-sm;
  color: $doc-color-primary;
  text-decoration: none;
  border: 1px solid currentcolor;
  border-radius: $doc-radius-md;

  &:hover {
    background: color-mix(in srgb, #{$doc-color-primary} 8%, transparent);
  }
}

@media (max-width: $doc-bp-mobile) {
  .readme-view__body {
    padding: $doc-sp-3 $doc-sp-4;
  }
}
</style>
