<script setup lang="ts">
import { computed, ref } from "vue";
import { buildPath } from "../../route/url";
import { HOME_ARTICLE_LIMIT, homeArticleGroups, homeArticles } from "../homeData";

const emit = defineEmits<{
  (e: "open", key: string): void;
  (e: "open-all"): void;
}>();

const ALL = "all";
const activeGroup = ref<string>(ALL);

/**
 * 筛选后取前 6 条。
 * 「全部」与分组共用同一套切片逻辑，切分组不会出现空列表 ——
 * 只要该分组有文章，就一定铺得满。
 */
const visibleArticles = computed(() => {
  const source =
    activeGroup.value === ALL
      ? homeArticles
      : homeArticles.filter((item) => item.groupKey === activeGroup.value);
  return source.slice(0, HOME_ARTICLE_LIMIT);
});

/**
 * 卡片是真实 `<a href>`，所以右键「新标签页打开」、中键、Ctrl/⌘ 点击
 * 都交给浏览器按原生行为处理；只有普通左键才拦下来走 SPA 切换。
 * 不判断修饰键的话，`@click.prevent` 会把这些能力一并废掉。
 */
function handleOpen(event: MouseEvent, key: string): void {
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
    return;
  }
  event.preventDefault();
  emit("open", key);
}
</script>

<template>
  <section id="home-articles" class="home-section">
    <div class="home-section__head">
      <div>
        <h2 class="home-section__title">最新文章</h2>
        <p class="home-section__desc">按发布时间倒序</p>
      </div>
      <button class="home-section__more" @click="emit('open-all')">
        全部 {{ homeArticles.length }} 篇
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M5 12h14" />
          <path d="M13 6l6 6-6 6" />
        </svg>
      </button>
    </div>

    <div class="home-chips">
      <button
        class="home-chip"
        :class="{ 'is-active': activeGroup === ALL }"
        @click="activeGroup = ALL"
      >
        全部
      </button>
      <button
        v-for="group in homeArticleGroups"
        :key="group.key"
        class="home-chip home-chip--group"
        :class="{ 'is-active': activeGroup === group.key }"
        :style="{ '--accent': group.accent }"
        @click="activeGroup = group.key"
      >
        {{ group.title }}
      </button>
    </div>

    <div class="home-articles">
      <a
        v-for="article in visibleArticles"
        :key="article.key"
        class="home-card home-article"
        :style="{ '--accent': article.accent }"
        :href="buildPath('blog', article.key)"
        @click="handleOpen($event, article.key)"
      >
        <span class="home-article__tag">{{ article.groupTitle }}</span>
        <h3 class="home-article__title">{{ article.title }}</h3>
        <p v-if="article.excerpt" class="home-article__excerpt">{{ article.excerpt }}</p>
        <span class="home-article__date">{{ article.date }}</span>
      </a>

      <p v-if="visibleArticles.length === 0" class="home-articles__empty">这个分组下还没有文章</p>
    </div>
  </section>
</template>
