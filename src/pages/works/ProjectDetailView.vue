<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import MarkdownRenderer from "@/doc-render/MarkdownRenderer.vue";
import type { HomeProject } from "../home/homeData";
import { loadRepoReadme } from "./readmeLoader";

const props = defineProps<{ project: HomeProject }>();

/** 有线上地址才出现预览 Tab */
const hasDemo = computed(() => Boolean(props.project.demo));

/** 手机端不内嵌预览，只给跳转 */
const isMobile = ref(false);
let mobileQuery: MediaQueryList | null = null;

function syncIsMobile(event?: MediaQueryListEvent): void {
  isMobile.value = event ? event.matches : (mobileQuery?.matches ?? false);
}

onMounted(() => {
  mobileQuery = window.matchMedia("(max-width: 768px)");
  syncIsMobile();
  mobileQuery.addEventListener("change", syncIsMobile);
});

onBeforeUnmount(() => {
  mobileQuery?.removeEventListener("change", syncIsMobile);
  mobileQuery = null;
});

type Tab = "demo" | "readme";

const tab = ref<Tab>(hasDemo.value ? "demo" : "readme");

/** 手机端默认落在 README，避免一进来就是跳转块 */
watch(
  isMobile,
  (mobile) => {
    if (mobile && hasDemo.value) tab.value = "readme";
  },
  { immediate: true },
);

/** 预览 iframe 懒加载：第一次切到预览才创建，避免一进页面就拉整站 */
const demoMounted = ref(false);

const loading = ref(false);
const source = ref<string | null>(null);
const failed = ref(false);

const repoFull = computed(() => (props.project.repo ? `shaohui-jin/${props.project.repo}` : ""));
const repoUrl = computed(() => props.project.href);

watch(
  tab,
  (next) => {
    if (next === "demo" && !isMobile.value) demoMounted.value = true;
  },
  { immediate: true },
);

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
  <article class="detail-view">
    <header class="detail-view__bar">
      <div class="detail-view__title">
        <span class="detail-view__name">{{ project.name }}</span>
        <span class="detail-view__repo">{{ repoFull }}</span>
      </div>

      <div class="detail-view__actions">
        <!-- 有部署才出这个切换；没有时直接显示 README，不留空 Tab -->
        <div v-if="hasDemo" class="detail-view__tabs" role="tablist">
          <button
            role="tab"
            class="detail-view__tab"
            :class="{ 'is-active': tab === 'demo' }"
            :aria-selected="tab === 'demo'"
            @click="tab = 'demo'"
          >
            预览
          </button>
          <button
            role="tab"
            class="detail-view__tab"
            :class="{ 'is-active': tab === 'readme' }"
            :aria-selected="tab === 'readme'"
            @click="tab = 'readme'"
          >
            README
          </button>
        </div>

        <a
          v-if="hasDemo && tab === 'demo' && !isMobile"
          class="detail-view__link"
          :href="project.demo"
          target="_blank"
          rel="noreferrer"
        >
          新窗口打开 ↗
        </a>
        <a v-else class="detail-view__link" :href="repoUrl" target="_blank" rel="noreferrer">
          在 GitHub 打开 ↗
        </a>
      </div>
    </header>

    <!-- 预览：桌面 / 平板懒加载 iframe，手机端只给跳转 -->
    <div v-show="tab === 'demo' && hasDemo" class="detail-view__demo">
      <iframe
        v-if="demoMounted && !isMobile"
        :src="project.demo"
        class="detail-view__frame"
        title="线上预览"
        loading="lazy"
        referrerpolicy="no-referrer"
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-downloads"
      />

      <div v-else-if="isMobile" class="detail-view__empty detail-view__empty--center">
        <p class="detail-view__desc">{{ project.name }}</p>
        <p class="detail-view__hint">移动端不内嵌预览，点下面按钮在浏览器里打开。</p>
        <a class="detail-view__button" :href="project.demo" target="_blank" rel="noreferrer">
          打开线上预览 ↗
        </a>
      </div>
    </div>

    <div v-show="tab === 'readme' || !hasDemo" class="detail-view__body">
      <p v-if="loading" class="detail-view__hint">正在读取 README…</p>

      <div v-else-if="failed || !source" class="detail-view__empty">
        <p class="detail-view__desc">{{ project.desc }}</p>
        <p class="detail-view__hint">这个仓库还没有 README，先去 GitHub 看源码和目录说明。</p>
        <a class="detail-view__button" :href="repoUrl" target="_blank" rel="noreferrer">
          前往 {{ repoFull }} ↗
        </a>
      </div>

      <MarkdownRenderer v-else :source="source" plain />
    </div>
  </article>
</template>

<style scoped lang="scss">
@use "../../styles/site/variables" as *;

.detail-view {
  display: flex;
  flex-direction: column;
  min-height: 0;
  height: 100%;
  background: $doc-bg-card;
  border: 1px solid $doc-border-color;
  border-radius: $doc-radius-card;
  overflow: hidden;
}

.detail-view__bar {
  flex: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: $doc-sp-3;
  padding: $doc-sp-3 $doc-sp-4;
  border-bottom: 1px solid $doc-border-color;
}

.detail-view__title {
  display: flex;
  align-items: baseline;
  gap: $doc-sp-2;
  min-width: 0;
}

.detail-view__name {
  font-size: $doc-fs-md;
  font-weight: 600;
  color: $doc-text-heading;
}

.detail-view__repo {
  font-size: $doc-fs-xs;
  color: $doc-text-secondary;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.detail-view__actions {
  flex: none;
  display: flex;
  align-items: center;
  gap: $doc-sp-3;
}

.detail-view__tabs {
  display: flex;
  gap: 2px;
  padding: 2px;
  background: $doc-bg-subtle;
  border-radius: $doc-radius-md;
}

.detail-view__tab {
  min-height: 28px;
  padding: 0 $doc-sp-3;
  font-size: $doc-fs-xs;
  color: $doc-text-regular;
  background: transparent;
  border: 0;
  border-radius: $doc-radius-sm;
  cursor: pointer;

  &:hover {
    color: $doc-text-heading;
  }

  &.is-active {
    color: $doc-text-heading;
    background: $doc-bg-card;
    box-shadow: $doc-shadow-sm;
  }

  &:focus-visible {
    outline: 2px solid $doc-color-primary;
    outline-offset: 1px;
  }
}

.detail-view__link {
  flex: none;
  font-size: $doc-fs-xs;
  color: $doc-color-primary;
  text-decoration: none;
  white-space: nowrap;

  &:hover {
    text-decoration: underline;
  }
}

.detail-view__demo {
  flex: 1;
  min-height: 0;
  background: $doc-bg-subtle;
}

.detail-view__frame {
  display: block;
  width: 100%;
  height: 100%;
  border: 0;
}

.detail-view__body {
  flex: 1;
  min-height: 0;
  overflow: auto;
  padding: $doc-sp-4 $doc-sp-5;
}

.detail-view__hint {
  margin: 0;
  font-size: $doc-fs-sm;
  color: $doc-text-secondary;
}

.detail-view__empty {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: $doc-sp-3;
}

/* 移动端的预览跳转块居中显示 */
.detail-view__empty--center {
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: $doc-sp-5;
  text-align: center;
}

.detail-view__desc {
  margin: 0;
  font-size: $doc-fs-md;
  color: $doc-text-heading;
}

.detail-view__button {
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
  .detail-view__body {
    padding: $doc-sp-3 $doc-sp-4;
  }

  .detail-view__bar {
    flex-wrap: wrap;
    gap: $doc-sp-2;
  }

  .detail-view__actions {
    gap: $doc-sp-2;
  }

  .detail-view__tab {
    min-height: 32px;
    padding: 0 $doc-sp-4;
  }
}
</style>
