<script setup lang="ts">
import { computed, inject } from "vue";
import type { ResolvedLibConfig } from "jsh-core";
import { homeHero } from "../homeData";

interface HeroStats {
  articles: number;
  components: number;
  tools: number;
}

const props = defineProps<{ stats: HeroStats }>();
const emit = defineEmits<{ (e: "scroll-next"): void }>();

const lib = inject<{ config: ResolvedLibConfig }>("compLib");

/** 相对亮度（0~1），用来判断当前主题是不是暗色 */
function luminance(hex: string): number {
  const raw = hex.replace("#", "").trim();
  const full =
    raw.length === 3
      ? raw
          .split("")
          .map((c) => c + c)
          .join("")
      : raw;
  if (full.length !== 6) return 1;

  const [r, g, b] = [0, 2, 4].map((i) => {
    const v = Number.parseInt(full.slice(i, i + 2), 16) / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

// 原站暗色主题下会把底图换成 black-001，这里按页面背景亮度做同样的切换
const isDark = computed(() => luminance(lib?.config.theme.bgPage ?? "#ffffff") < 0.4);

const heroStyle = computed(() => ({
  "--home-hero-image": `url("${isDark.value ? homeHero.backgroundDark : homeHero.background}")`,
}));

const subtitleParts = homeHero.subtitles;
</script>

<template>
  <section class="home-hero" :style="heroStyle">
    <div class="home-hero__inner">
      <img class="home-hero__logo" :src="homeHero.logo" alt="雾起" width="104" height="104" />
      <h1 class="home-hero__title">{{ homeHero.title }}</h1>
      <p class="home-hero__subtitle">
        <template v-for="(line, index) in subtitleParts" :key="line">
          <i v-if="index > 0">|</i>
          <span>{{ line }}</span>
        </template>
      </p>
      <p class="home-hero__meta">
        <b>{{ props.stats.articles }}</b> 篇文章<i>·</i>
        <b>{{ props.stats.components }}</b> 个组件<i>·</i> <b>{{ props.stats.tools }}</b> 个工具函数
      </p>
    </div>

    <button class="home-hero__scroll" aria-label="向下浏览" @click="emit('scroll-next')">
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.8"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </button>
  </section>
</template>
