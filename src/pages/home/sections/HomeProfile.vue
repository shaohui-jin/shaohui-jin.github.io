<script setup lang="ts">
import { ref } from "vue";
import { homeProfile, homeSocials } from "../homeData";

defineProps<{ updatedAt: string }>();

// GIF 挂了就退回文字头像，不让卡片塌成一块空白
const avatarFailed = ref(false);
</script>

<template>
  <section id="home-about" class="home-section">
    <div class="home-section__head">
      <div>
        <h2 class="home-section__title">关于我</h2>
        <p class="home-section__desc">写代码，也写字</p>
      </div>
    </div>

    <div class="home-profile">
      <div class="home-profile__avatar">
        {{ homeProfile.avatarFallback }}
        <img
          v-if="!avatarFailed"
          :src="homeProfile.avatar"
          :alt="homeProfile.name"
          loading="lazy"
          @error="avatarFailed = true"
        />
      </div>

      <div class="home-profile__main">
        <div class="home-profile__name-row">
          <h3 class="home-profile__name">{{ homeProfile.name }}</h3>
          <span class="home-profile__role">{{ homeProfile.role }}</span>
        </div>
        <p class="home-profile__bio">{{ homeProfile.bio }}</p>
        <div class="home-profile__socials">
          <a
            v-for="link in homeSocials"
            :key="link.label"
            class="home-social"
            :href="link.href"
            target="_blank"
            rel="noreferrer"
          >
            {{ link.label }}
          </a>
        </div>
      </div>

      <div class="home-profile__aside">
        <span class="home-profile__aside-label">最近更新</span>
        <span class="home-profile__aside-value">{{ updatedAt }}</span>
        <a
          class="home-profile__aside-link"
          :href="homeProfile.repoUrl"
          target="_blank"
          rel="noreferrer"
        >
          {{ homeProfile.repoLabel }}
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
            <path d="M7 17L17 7" />
            <path d="M9 7h8v8" />
          </svg>
        </a>
      </div>
    </div>
  </section>
</template>
