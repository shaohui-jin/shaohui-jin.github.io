<script setup lang="ts">
import { computed, inject } from "vue";
import { parseChangelog, splitInlineCode, summarizeVersion } from "jsh-core";
import changelogRaw from "../../../CHANGELOG.md?raw";
import { PLAYGROUND_NAV_KEY } from "../route/navigation";

const emit = defineEmits<{ (e: "close"): void }>();
const nav = inject(PLAYGROUND_NAV_KEY, null);

const PREVIEW_COUNT = 3;

const allVersions = computed(() => parseChangelog(changelogRaw));
const previewVersions = computed(() =>
  allVersions.value.slice(0, PREVIEW_COUNT).map((block) => ({
    version: block.version,
    date: block.date,
    summary: summarizeVersion(block, 3) || "该版本没有可展示的条目",
  })),
);

function openFullChangelog() {
  nav?.to("system", "changelog");
  emit("close");
}
</script>

<template>
  <div class="pop-panel" role="dialog" aria-label="更新日志">
    <div class="pop-panel__head">
      <span class="pop-panel__title">更新日志</span>
      <button class="pop-panel__close" aria-label="关闭" @click="emit('close')">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
        >
          <line x1="6" y1="6" x2="18" y2="18" />
          <line x1="18" y1="6" x2="6" y2="18" />
        </svg>
      </button>
    </div>

    <div class="pop-logs">
      <button
        v-for="item in previewVersions"
        :key="item.version"
        class="pop-log"
        @click="openFullChangelog"
      >
        <div class="pop-log__head">
          <span class="pop-log__ver">{{ item.version }}</span>
          <span class="pop-log__date">{{ item.date }}</span>
        </div>
        <p class="pop-log__body">
          <template v-for="(seg, si) in splitInlineCode(item.summary)" :key="si">
            <code v-if="seg.code" class="pop-log__code">{{ seg.text }}</code>
            <template v-else>{{ seg.text }}</template>
          </template>
        </p>
      </button>
    </div>

    <div class="pop-panel__foot">
      <span>最近 {{ previewVersions.length }} 个版本</span>
      <button @click="openFullChangelog">查看全部 →</button>
    </div>
  </div>
</template>
