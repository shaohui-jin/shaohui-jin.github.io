<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import { homeProjects } from "../home/homeData";
import READMEView from "./READMEView.vue";
import { takePendingProject } from "./worksSelection";

/** 「更多项目」是外链占位，不进左列 */
const projects = homeProjects.filter((project) => !project.placeholder);

const selected = ref<string | null>(null);
const gridRef = ref<HTMLElement | null>(null);
const listRef = ref<HTMLElement | null>(null);

const activeProject = computed(
  () => projects.find((project) => project.name === selected.value) ?? null,
);

const isOpen = computed(() => selected.value !== null);

const reduceMotion = ref(false);

onMounted(() => {
  reduceMotion.value = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // 首页点卡片进来时直接展开该项
  const pending = takePendingProject();
  if (pending && projects.some((project) => project.name === pending)) {
    selected.value = pending;
  }
});

interface FlipRecord {
  el: HTMLElement;
  first: DOMRect;
}

/**
 * 卡片从网格飞向左列。
 *
 * 先记录每张卡在网格里的位置，等左列渲染完再量一次，
 * 用两个位置的差值做 transform 补间，卡片就视觉上「飞」过去了。
 */
async function openProject(name: string): Promise<void> {
  if (selected.value === name) return;

  const grid = gridRef.value;
  const cards = grid ? Array.from(grid.querySelectorAll<HTMLElement>("[data-card]")) : [];
  const records: FlipRecord[] = cards.map((el) => ({ el, first: el.getBoundingClientRect() }));

  selected.value = name;
  await nextTick();

  if (reduceMotion.value) return;

  for (const record of records) {
    const cardName = record.el.dataset.card ?? "";
    const target = listRef.value?.querySelector<HTMLElement>(`[data-item="${cardName}"]`);
    if (!target) continue;

    const last = target.getBoundingClientRect();
    const dx = record.first.left - last.left;
    const dy = record.first.top - last.top;
    if (!dx && !dy) continue;

    target.animate(
      [{ transform: `translate(${dx}px, ${dy}px)` }, { transform: "translate(0, 0)" }],
      {
        duration: 380,
        easing: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    );
  }
}

function closeProject(): void {
  selected.value = null;
}

function onKeydown(event: KeyboardEvent): void {
  if (event.key === "Escape" && isOpen.value) closeProject();
}

onMounted(() => window.addEventListener("keydown", onKeydown));
onBeforeUnmount(() => window.removeEventListener("keydown", onKeydown));
</script>

<template>
  <section class="works-page" :class="{ 'works-page--open': isOpen }">
    <div class="works-layout">
      <!-- 左列：未选中时是网格，选中后收成单列 -->
      <div class="works-side">
        <div class="works-side__head">
          <button v-if="isOpen" class="works-side__back" @click="closeProject">← 全部项目</button>
          <template v-else>
            <h1>个人项目</h1>
            <p>自己做的工具和站点，包括编辑器扩展、Skill 和 MCP。</p>
          </template>
        </div>

        <div v-if="!isOpen" ref="gridRef" class="works-grid">
          <button
            v-for="project in projects"
            :key="project.name"
            :data-card="project.name"
            class="works-card"
            :style="{ '--accent': project.accent }"
            @click="openProject(project.name)"
          >
            <span class="works-card__top">
              <span class="works-card__icon">
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
              <span class="works-card__name">{{ project.name }}</span>
            </span>
            <span class="works-card__desc">{{ project.desc }}</span>
            <span class="works-card__foot">
              <span class="works-card__host">{{ project.host }}</span>
              <span class="works-card__go">查看 ↗</span>
            </span>
          </button>
        </div>

        <div v-else ref="listRef" class="works-list">
          <button
            v-for="project in projects"
            :key="project.name"
            :data-item="project.name"
            class="works-item"
            :class="{ 'is-active': project.name === selected }"
            :style="{ '--accent': project.accent }"
            @click="openProject(project.name)"
          >
            <span class="works-item__icon">
              <!-- eslint-disable vue/no-v-html -->
              <svg
                width="16"
                height="16"
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
            <span class="works-item__text">
              <span class="works-item__name">{{ project.name }}</span>
              <span class="works-item__desc">{{ project.desc }}</span>
            </span>
          </button>

          <a
            class="works-item works-item--more"
            href="https://github.com/shaohui-jin?tab=repositories"
            target="_blank"
            rel="noreferrer"
          >
            <span class="works-item__text">
              <span class="works-item__name">更多项目</span>
              <span class="works-item__desc">还没整理成卡片，先去 GitHub 翻一翻</span>
            </span>
          </a>
        </div>
      </div>

      <!-- 右侧 README -->
      <Transition name="works-panel">
        <div v-if="activeProject" class="works-detail">
          <READMEView :key="activeProject.name" :project="activeProject" />
        </div>
      </Transition>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use "../../styles/site/variables" as *;

// 作品页自己开一份 border-box。
// 站点没有全局 reset，卡片是 width: 100% + padding + border 的组合，
// 按 content-box 算会比 260px 的左列宽出 26px，底部就会冒出横向滚动条。
.works-page,
.works-page *,
.works-page *::before,
.works-page *::after {
  box-sizing: border-box;
}

.works-page {
  height: 100%;
  padding: $doc-sp-6 $doc-sp-5 $doc-sp-7;
  box-sizing: border-box;

  @media (max-width: $doc-bp-mobile) {
    padding: $doc-sp-4 $doc-sp-3 $doc-sp-5;
  }
}

.works-layout {
  display: flex;
  gap: $doc-sp-5;
  height: 100%;
  min-height: 0;

  @media (max-width: $doc-bp-mobile) {
    flex-direction: column;
    gap: $doc-sp-4;
    height: auto;
  }
}

.works-side {
  flex: none;
  display: flex;
  flex-direction: column;
  min-height: 0;
  width: 100%;

  .works-page--open & {
    width: 260px;

    @media (max-width: $doc-bp-tablet) {
      width: 220px;
    }

    @media (max-width: $doc-bp-mobile) {
      width: 100%;
    }
  }
}

.works-side__head {
  flex: none;
  margin-bottom: $doc-sp-4;

  h1 {
    margin: 0 0 $doc-sp-2;
    font-size: $doc-fs-xl;
    font-weight: 600;
    color: $doc-text-heading;
  }

  p {
    margin: 0;
    font-size: $doc-fs-sm;
    color: $doc-text-regular;
  }
}

.works-side__back {
  display: inline-flex;
  align-items: center;
  min-height: 32px;
  padding: 0 $doc-sp-2;
  margin-left: -$doc-sp-2;
  font-size: $doc-fs-sm;
  color: $doc-text-regular;
  background: none;
  border: 0;
  border-radius: $doc-radius-md;
  cursor: pointer;

  &:hover {
    color: $doc-color-primary;
  }
}

.works-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: $doc-sp-4;

  @media (max-width: $doc-bp-tablet) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: $doc-bp-mobile) {
    grid-template-columns: 1fr;
  }
}

.works-card {
  display: flex;
  flex-direction: column;
  padding: $doc-sp-4;
  min-height: 148px;
  text-align: left;
  background: $doc-bg-card;
  border: 1px solid $doc-border-color;
  border-radius: $doc-radius-card;
  cursor: pointer;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;

  &:hover {
    border-color: color-mix(in srgb, var(--accent, #{$doc-color-primary}) 45%, transparent);
    box-shadow: $doc-shadow-lg;
  }

  &:focus-visible {
    outline: 2px solid $doc-color-primary;
    outline-offset: 2px;
  }
}

.works-card__top {
  display: flex;
  align-items: center;
  gap: $doc-sp-3;
  min-width: 0;
}

.works-card__icon {
  flex: none;
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border-radius: $doc-radius-inner;
  color: var(--accent, #{$doc-color-primary});
  background: color-mix(in srgb, var(--accent, #{$doc-color-primary}) 12%, transparent);
}

.works-card__name {
  font-size: $doc-fs-md;
  font-weight: 600;
  line-height: 1.4;
  color: $doc-text-heading;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.works-card__desc {
  margin-top: $doc-sp-3;
  font-size: $doc-fs-sm;
  line-height: 1.65;
  color: $doc-text-regular;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.works-card__foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: $doc-sp-2;
  margin-top: auto;
  padding-top: $doc-sp-4;
}

.works-card__host {
  font-size: $doc-fs-xs;
  color: $doc-text-secondary;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.works-card__go {
  flex: none;
  font-size: $doc-fs-xs;
  color: $doc-text-secondary;
  transition: color 0.2s;
}

.works-card:hover .works-card__go {
  color: var(--accent, #{$doc-color-primary});
}

.works-list {
  display: flex;
  flex-direction: column;
  gap: $doc-sp-2;
  min-height: 0;
  overflow: hidden auto;

  @media (max-width: $doc-bp-mobile) {
    flex-direction: row;
    overflow-x: auto;
    padding-bottom: $doc-sp-2;
  }
}

.works-item {
  display: flex;
  align-items: flex-start;
  gap: $doc-sp-3;
  width: 100%;
  padding: $doc-sp-3;
  text-align: left;
  background: transparent;
  border: 1px solid transparent;
  border-radius: $doc-radius-inner;
  cursor: pointer;

  &:hover {
    background: $doc-bg-subtle;
  }

  &.is-active {
    background: color-mix(in srgb, var(--accent, #{$doc-color-primary}) 8%, transparent);
    border-color: color-mix(in srgb, var(--accent, #{$doc-color-primary}) 35%, transparent);
  }

  &:focus-visible {
    outline: 2px solid $doc-color-primary;
    outline-offset: 1px;
  }

  @media (max-width: $doc-bp-mobile) {
    flex: none;
    width: 220px;
  }
}

.works-item__icon {
  flex: none;
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  border-radius: $doc-radius-sm;
  color: var(--accent, #{$doc-color-primary});
  background: color-mix(in srgb, var(--accent, #{$doc-color-primary}) 12%, transparent);
}

.works-item__text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.works-item__name {
  font-size: $doc-fs-sm;
  font-weight: 600;
  color: $doc-text-heading;
}

.works-item__desc {
  font-size: $doc-fs-xs;
  line-height: 1.5;
  color: $doc-text-secondary;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.works-item--more {
  margin-top: auto;
  text-decoration: none;
  border-style: dashed;
  border-color: $doc-border-color;

  @media (max-width: $doc-bp-mobile) {
    margin-top: 0;
  }
}

.works-detail {
  flex: 1;
  min-width: 0;
  min-height: 0;

  @media (max-width: $doc-bp-mobile) {
    height: 70vh;
  }
}

.works-panel-enter-active,
.works-panel-leave-active {
  transition:
    opacity 0.28s ease,
    transform 0.28s cubic-bezier(0.22, 1, 0.36, 1);
}

.works-panel-enter-from,
.works-panel-leave-to {
  opacity: 0;
  transform: translateX(16px);
}

@media (prefers-reduced-motion: reduce) {
  .works-panel-enter-active,
  .works-panel-leave-active {
    transition: none;
  }
}
</style>
