<script setup lang="ts">
import { inject, ref } from "vue";
import type { LibConfig, ResolvedLibConfig, ThemePresetKey } from "jsh-core";
import { primarySwatches, themePresetSwatches, themePresets } from "jsh-core";
import { PLAYGROUND_NAV_KEY } from "../route/navigation";

const emit = defineEmits<{ (e: "close"): void }>();
const nav = inject(PLAYGROUND_NAV_KEY, null);

const lib = inject<{
  saveConfig: (config: LibConfig) => void;
  config: ResolvedLibConfig;
}>("compLib");

const presetKeys: ThemePresetKey[] = ["default", "light", "purple", "dark"];
const presetLabels: Record<ThemePresetKey, string> = {
  default: "默认",
  light: "明亮",
  purple: "紫色",
  dark: "暗色",
};

/** 按主色 + 页面背景反查当前命中哪套预设，命中不了就当作自定义 */
function detectPreset(): ThemePresetKey | null {
  if (!lib) return null;
  const current = lib.config.theme;
  return (
    presetKeys.find((key) => {
      const preset = themePresets[key];
      const primary = preset.colorPrimary ?? current.colorPrimary;
      const bgPage = preset.bgPage ?? current.bgPage;
      return (
        primary.toLowerCase() === current.colorPrimary.toLowerCase() &&
        bgPage.toLowerCase() === current.bgPage.toLowerCase()
      );
    }) ?? null
  );
}

const activePreset = ref<ThemePresetKey | null>(detectPreset());
const activePrimary = ref(lib?.config.theme.colorPrimary ?? "#409eff");
const activeRadius = ref(lib?.config.theme.radiusMd ?? 6);

function applyPreset(key: ThemePresetKey) {
  if (!lib) return;
  const preset = themePresets[key];
  // saveConfig 会同时写内存、localStorage 和 <html> 上的 --comp-* 变量，
  // 所以点下去整站立刻变色，不需要等下次刷新
  lib.saveConfig({ theme: { ...preset } });
  activePreset.value = key;
  activePrimary.value = preset.colorPrimary ?? activePrimary.value;
  activeRadius.value = preset.radiusMd ?? activeRadius.value;
}

function applyPrimary(color: string) {
  if (!lib) return;
  lib.saveConfig({ theme: { colorPrimary: color } });
  activePrimary.value = color;
  // 只改主色后就不再等于任何一套预设了
  activePreset.value = null;
}

function applyRadius(radius: number) {
  if (!lib) return;
  lib.saveConfig({
    theme: {
      radiusSm: Math.max(2, Math.round(radius / 2)),
      radiusMd: radius,
      radiusLg: radius + 2,
    },
  });
  activeRadius.value = radius;
}

function openFullConfig() {
  nav?.to("system", "config");
  emit("close");
}
</script>

<template>
  <div class="pop-panel" role="dialog" aria-label="主题配置">
    <div class="pop-panel__head">
      <span class="pop-panel__title">主题配置</span>
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

    <div class="pop-group">
      <span class="pop-group__label">预设</span>
      <div class="pop-presets">
        <button
          v-for="key in presetKeys"
          :key="key"
          class="pop-preset"
          :class="{ 'is-active': activePreset === key }"
          @click="applyPreset(key)"
        >
          <i class="pop-preset__dot" :style="{ '--swatch': themePresetSwatches[key] }" />
          {{ presetLabels[key] }}
        </button>
      </div>
    </div>

    <div class="pop-group">
      <span class="pop-group__label">主色</span>
      <div class="pop-swatches">
        <button
          v-for="color in primarySwatches"
          :key="color"
          class="pop-swatch"
          :class="{ 'is-active': activePrimary.toLowerCase() === color.toLowerCase() }"
          :style="{ '--swatch': color }"
          :aria-label="color"
          @click="applyPrimary(color)"
        />
      </div>
    </div>

    <div class="pop-group">
      <span class="pop-group__label">圆角</span>
      <div class="pop-seg">
        <button
          v-for="radius in [4, 6, 8]"
          :key="radius"
          class="pop-seg__item"
          :class="{ 'is-active': activeRadius === radius }"
          @click="applyRadius(radius)"
        >
          {{ radius === 4 ? "小" : radius === 6 ? "中" : "大" }}
        </button>
      </div>
    </div>

    <div class="pop-panel__foot">
      <span>改动即时预览</span>
      <button @click="openFullConfig">打开完整配置 →</button>
    </div>
  </div>
</template>
