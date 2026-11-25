<script setup lang="ts">
import { computed, inject } from "vue";
import { PLAYGROUND_NAV_KEY } from "../../../route/navigation";
import { homeProjects, HOME_PROJECT_LIMIT } from "../homeData";
import { setPendingProject } from "../../works/worksSelection";

const emit = defineEmits<{ (e: "open-all"): void }>();

const nav = inject(PLAYGROUND_NAV_KEY, null);

/** 首页只铺前几张，完整列表在作品页 */
const previewProjects = computed(() => homeProjects.slice(0, HOME_PROJECT_LIMIT));

/** 点卡片进作品页并直接展开该项目的 README */
function openProject(name: string) {
  setPendingProject(name);
  nav?.to("works", "works");
}
</script>

<template>
  <section id="home-projects" class="home-section">
    <div class="home-section__head">
      <div>
        <h2 class="home-section__title">个人项目</h2>
        <p class="home-section__desc">自己做的工具和站点，包括编辑器扩展、Skill 和 MCP。</p>
      </div>
      <button class="home-section__more" @click="emit('open-all')">全部项目 →</button>
    </div>

    <div class="home-projects">
      <button
        v-for="project in previewProjects"
        :key="project.name"
        class="home-card home-project"
        :class="{ 'home-project--more': project.placeholder }"
        :style="{ '--accent': project.accent }"
        @click="openProject(project.name)"
      >
        <span class="home-project__top">
          <span class="home-project__icon">
            <!-- 图标路径写死在 homeData.ts 里，不涉及用户输入 -->
            <!-- eslint-disable vue/no-v-html -->
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.6"
              stroke-linecap="round"
              stroke-linejoin="round"
              v-html="project.icon"
            />
            <!-- eslint-enable vue/no-v-html -->
          </span>
          <span class="home-project__name">{{ project.name }}</span>
        </span>
        <span class="home-project__desc">{{ project.desc }}</span>
        <span class="home-project__foot">
          <span class="home-project__host">{{ project.host }}</span>
          <span class="home-project__go">查看 ↗</span>
        </span>
      </button>
    </div>
  </section>
</template>
