<script setup lang="ts">
import { homeProjects } from "../homeData";
</script>

<template>
  <section id="home-projects" class="home-section">
    <div class="home-section__head">
      <div>
        <h2 class="home-section__title">个人项目</h2>
        <p class="home-section__desc">五个自己做着玩的东西，形态多为 Cursor 扩展 / Skill / MCP</p>
      </div>
    </div>

    <div class="home-projects">
      <a
        v-for="project in homeProjects"
        :key="project.name"
        class="home-card home-project"
        :class="{ 'home-project--more': project.placeholder }"
        :style="{ '--accent': project.accent }"
        :href="project.href"
        target="_blank"
        rel="noreferrer"
      >
        <div class="home-project__top">
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
        </div>
        <p class="home-project__desc">{{ project.desc }}</p>
        <div class="home-project__foot">
          <span class="home-project__host">{{ project.host }}</span>
          <span class="home-project__go">
            {{ project.action ?? (project.placeholder ? "前往" : "访问") }} ↗
          </span>
        </div>
      </a>
    </div>
  </section>
</template>
