<script setup lang="ts">
import { computed, inject } from "vue";
import { PLAYGROUND_NAV_KEY } from "../route/navigation";
import { playgroundNavigation } from "../route/runtimeRoutes";
import { homeArticles, homeFooter, homeLatestDate } from "./homeData";
import HomeHero from "./sections/HomeHero.vue";
import HomeProfile from "./sections/HomeProfile.vue";
import HomeProjects from "./sections/HomeProjects.vue";
import HomeArticles from "./sections/HomeArticles.vue";

const nav = inject(PLAYGROUND_NAV_KEY, null);

/**
 * 首屏 meta 里的数字取自路由快照，组件 / 工具加一个就自动 +1，
 * 不需要回首页改文案。
 */
const stats = computed(() => ({
  articles: homeArticles.length,
  components: (playgroundNavigation.tabRoutes.docs ?? []).length,
  tools: (playgroundNavigation.tabRoutes.utils ?? []).length,
}));

function scrollToAbout() {
  document.getElementById("home-about")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function openArticle(key: string) {
  nav?.to("blog", key);
}

function openAllArticles() {
  nav?.to("blog");
}
</script>

<!--
  刻意不使用外层包裹元素：
  .home-hero 的 height: 100% 需要直接对着 .doc-content 的高度生效，
  中间多一层容器（尤其是 flex 容器）会让百分比高度退化，首屏就不再是全屏了。
-->
<template>
  <HomeHero :stats="stats" @scroll-next="scrollToAbout" />

  <div class="home-body">
    <HomeProfile :updated-at="homeLatestDate" />
    <HomeProjects />
    <HomeArticles @open="openArticle" @open-all="openAllArticles" />
  </div>

  <footer class="home-footer">
    <div class="home-footer__line" />
    {{ homeFooter.wish }}
    <span class="home-footer__sep">·</span>
    {{ homeFooter.copyright }}
  </footer>
</template>

<style lang="scss">
@use "./style/home";
</style>
