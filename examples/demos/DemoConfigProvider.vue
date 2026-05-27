<script setup lang="ts">
import { ref, computed, reactive, inject } from "vue";
import { ConfigProvider, BaseTable, StatusDot } from "../../src";
import type { LibConfig, ResolvedLibConfig } from "../../src/config/configTypes";
import { defaultLibConfig } from "../../src/config/configDefaults";
import type { BaseTableColumn } from "../../src/components/crud/base-table/types";

const lib = inject<{ saveConfig: (c: LibConfig) => void; config: ResolvedLibConfig }>("compLib")!;

// --- Theme 配置 ---
const themeForm = reactive({
  colorPrimary: lib.config.theme.colorPrimary,
  colorSuccess: lib.config.theme.colorSuccess,
  colorWarning: lib.config.theme.colorWarning,
  textHeading: lib.config.theme.textHeading,
  textPrimary: lib.config.theme.textPrimary,
  textRegular: lib.config.theme.textRegular,
  textSecondary: lib.config.theme.textSecondary,
  bgPage: lib.config.theme.bgPage,
  bgCard: lib.config.theme.bgCard,
  bgSubtle: lib.config.theme.bgSubtle,
  bgMuted: lib.config.theme.bgMuted,
  borderColor: lib.config.theme.borderColor,
  borderMedium: lib.config.theme.borderMedium,
  fontSizeBase: lib.config.theme.fontSizeBase,
  fontSizeSm: lib.config.theme.fontSizeSm,
  radiusSm: lib.config.theme.radiusSm,
  radiusMd: lib.config.theme.radiusMd,
});

// --- Table 布局配置 ---
const tableForm = reactive({
  rowHeight: lib.config.table.rowHeight,
  headerHeight: lib.config.table.headerHeight,
  fontSizeCell: lib.config.table.fontSizeCell,
  fontSizeEmpty: lib.config.table.fontSizeEmpty,
  headerFontWeight: lib.config.table.headerFontWeight,
  cellFontWeight: lib.config.table.cellFontWeight,
  minColumnWidth: lib.config.table.minColumnWidth,
  defaultColumnWidth: lib.config.table.defaultColumnWidth,
});

// --- 配置 JSON 预览 ---
const configJson = computed(() =>
  JSON.stringify({ theme: { ...themeForm }, table: { ...tableForm } }, null, 2),
);

// --- 保存到 localStorage（刷新后生效） ---
const saved = ref(false);
function handleSave() {
  lib.saveConfig({ theme: { ...themeForm }, table: { ...tableForm } });
  saved.value = true;
  setTimeout(() => {
    saved.value = false;
  }, 2000);
}

// --- 预设方案 ---
function applyPreset(preset: Partial<typeof themeForm>, tablePatch?: Partial<typeof tableForm>) {
  Object.assign(themeForm, preset);
  if (tablePatch) Object.assign(tableForm, tablePatch);
}

const presets = {
  default: () => {
    Object.assign(themeForm, defaultLibConfig.theme);
    Object.assign(tableForm, defaultLibConfig.table);
  },
  light: () =>
    applyPreset({
      colorPrimary: "#409eff",
      colorSuccess: "#67c23a",
      colorWarning: "#e6a23c",
      textHeading: "#1d2129",
      textPrimary: "#303133",
      textRegular: "#606266",
      textSecondary: "#909399",
      bgPage: "#f5f7fa",
      bgCard: "#ffffff",
      bgSubtle: "#fafbfc",
      bgMuted: "#f4f4f5",
      borderColor: "#ebeef5",
      borderMedium: "#dcdfe6",
      fontSizeBase: 14,
      fontSizeSm: 13,
      radiusSm: 3,
      radiusMd: 6,
    }),
  purple: () =>
    applyPreset({
      colorPrimary: "#6366f1",
      colorSuccess: "#10b981",
      colorWarning: "#f59e0b",
      textHeading: "#1e1b4b",
      textPrimary: "#312e81",
      textRegular: "#4338ca",
      textSecondary: "#6366f1",
      bgPage: "#f5f3ff",
      bgCard: "#ffffff",
      bgSubtle: "#eef2ff",
      bgMuted: "#e0e7ff",
      borderColor: "#e0e7ff",
      borderMedium: "#c7d2fe",
      fontSizeBase: 14,
      fontSizeSm: 13,
      radiusSm: 4,
      radiusMd: 8,
    }),
  dark: () =>
    applyPreset({
      colorPrimary: "#7aa2f7",
      colorSuccess: "#9ece6a",
      colorWarning: "#e0af68",
      textHeading: "#a9b1d6",
      textPrimary: "#9aa5ce",
      textRegular: "#787c99",
      textSecondary: "#565a6e",
      bgPage: "#1a1b26",
      bgCard: "#24283b",
      bgSubtle: "#1f2335",
      bgMuted: "#343a52",
      borderColor: "#3b4261",
      borderMedium: "#4e5579",
      fontSizeBase: 14,
      fontSizeSm: 13,
      radiusSm: 4,
      radiusMd: 8,
    }),
};

// --- 当前激活面板 ---
const activeTab = ref<"theme" | "table">("theme");

// --- 表格示例数据 ---
const columns: BaseTableColumn[] = [
  { key: "id", label: "ID", width: 60 },
  { key: "name", label: "姓名", width: 120 },
  {
    key: "status",
    label: "状态",
    type: "status-custom",
    width: 100,
    colorMap: { active: "#67c23a", inactive: "#909399" },
  },
  { key: "email", label: "邮箱" },
  { key: "dept", label: "部门", width: 100 },
];

const tableData = [
  { id: 1, name: "张三", status: "active", email: "zhangsan@example.com", dept: "技术部" },
  { id: 2, name: "李四", status: "inactive", email: "lisi@example.com", dept: "产品部" },
  { id: 3, name: "王五", status: "active", email: "wangwu@example.com", dept: "设计部" },
  { id: 4, name: "赵六", status: "active", email: "zhaoliu@example.com", dept: "运营部" },
  { id: 5, name: "钱七", status: "inactive", email: "qianqi@example.com", dept: "市场部" },
  { id: 6, name: "孙八", status: "active", email: "sunba@example.com", dept: "研发部" },
];

// --- 配置字段分组 ---
const themeColorFields = [
  { key: "colorPrimary", label: "主色" },
  { key: "colorSuccess", label: "成功色" },
  { key: "colorWarning", label: "警告色" },
] as const;

const themeTextFields = [
  { key: "textHeading", label: "标题文字" },
  { key: "textPrimary", label: "主要文字" },
  { key: "textRegular", label: "常规文字" },
  { key: "textSecondary", label: "次要文字" },
] as const;

const themeBgFields = [
  { key: "bgPage", label: "页面背景" },
  { key: "bgCard", label: "卡片背景" },
  { key: "bgSubtle", label: "浅色背景" },
  { key: "bgMuted", label: "灰底背景" },
] as const;

const themeBorderFields = [
  { key: "borderColor", label: "边框色" },
  { key: "borderMedium", label: "深边框色" },
] as const;

const themeNumericFields = [
  { key: "fontSizeBase", label: "基础字号", min: 12, max: 20, unit: "px" },
  { key: "fontSizeSm", label: "小号字", min: 10, max: 16, unit: "px" },
  { key: "radiusSm", label: "小圆角", min: 0, max: 12, unit: "px" },
  { key: "radiusMd", label: "中圆角", min: 0, max: 16, unit: "px" },
] as const;

const tableNumericFields = [
  { key: "rowHeight", label: "行高", min: 28, max: 60, unit: "px" },
  { key: "headerHeight", label: "表头高度", min: 28, max: 60, unit: "px" },
  { key: "fontSizeCell", label: "单元格字号", min: 11, max: 18, unit: "px" },
  { key: "fontSizeEmpty", label: "空态字号", min: 12, max: 20, unit: "px" },
  { key: "headerFontWeight", label: "表头字重", min: 400, max: 800, unit: "" },
  { key: "cellFontWeight", label: "单元格字重", min: 300, max: 700, unit: "" },
  { key: "minColumnWidth", label: "最小列宽", min: 40, max: 120, unit: "px" },
  { key: "defaultColumnWidth", label: "默认列宽", min: 80, max: 200, unit: "px" },
] as const;

const showJson = ref(false);
</script>

<template>
  <div class="demo-config">
    <header class="demo-config__header">
      <h2>配置注入系统演示</h2>
      <p>调整配置后点击「保存」写入 localStorage，刷新页面生效。</p>
    </header>

    <div class="demo-config__layout">
      <!-- 左侧控制面板 -->
      <aside class="demo-config__panel">
        <!-- 预设 + 保存 -->
        <div class="demo-config__presets">
          <button
            v-for="(fn, key) in presets"
            :key="key"
            class="demo-config__preset-btn"
            @click="fn()"
          >
            {{ key }}
          </button>
          <button class="demo-config__preset-btn demo-config__preset-btn--save" @click="handleSave">
            {{ saved ? "已保存" : "保存" }}
          </button>
        </div>

        <!-- 标签切换 -->
        <div class="demo-config__tabs">
          <button
            :class="['demo-config__tab', { active: activeTab === 'theme' }]"
            @click="activeTab = 'theme'"
          >
            Theme 主题
          </button>
          <button
            :class="['demo-config__tab', { active: activeTab === 'table' }]"
            @click="activeTab = 'table'"
          >
            Table 布局
          </button>
        </div>

        <!-- Theme 面板 -->
        <div v-show="activeTab === 'theme'" class="demo-config__form">
          <h4>品牌色</h4>
          <div class="demo-config__color-group">
            <label v-for="f in themeColorFields" :key="f.key" class="demo-config__color-field">
              <input v-model="themeForm[f.key]" type="color" />
              <span class="demo-config__color-info">
                <span class="demo-config__color-label">{{ f.label }}</span>
                <code>{{ themeForm[f.key] }}</code>
              </span>
            </label>
          </div>

          <h4>文字色</h4>
          <div class="demo-config__color-group">
            <label v-for="f in themeTextFields" :key="f.key" class="demo-config__color-field">
              <input v-model="themeForm[f.key]" type="color" />
              <span class="demo-config__color-info">
                <span class="demo-config__color-label">{{ f.label }}</span>
                <code>{{ themeForm[f.key] }}</code>
              </span>
            </label>
          </div>

          <h4>背景色</h4>
          <div class="demo-config__color-group">
            <label v-for="f in themeBgFields" :key="f.key" class="demo-config__color-field">
              <input v-model="themeForm[f.key]" type="color" />
              <span class="demo-config__color-info">
                <span class="demo-config__color-label">{{ f.label }}</span>
                <code>{{ themeForm[f.key] }}</code>
              </span>
            </label>
          </div>

          <h4>边框色</h4>
          <div class="demo-config__color-group">
            <label v-for="f in themeBorderFields" :key="f.key" class="demo-config__color-field">
              <input v-model="themeForm[f.key]" type="color" />
              <span class="demo-config__color-info">
                <span class="demo-config__color-label">{{ f.label }}</span>
                <code>{{ themeForm[f.key] }}</code>
              </span>
            </label>
          </div>

          <h4>数值</h4>
          <div class="demo-config__slider-group">
            <label v-for="f in themeNumericFields" :key="f.key" class="demo-config__slider-field">
              <span class="demo-config__slider-label">
                {{ f.label }}
                <code>{{ themeForm[f.key] }}{{ f.unit }}</code>
              </span>
              <input v-model.number="themeForm[f.key]" type="range" :min="f.min" :max="f.max" />
            </label>
          </div>
        </div>

        <!-- Table 布局面板 -->
        <div v-show="activeTab === 'table'" class="demo-config__form">
          <h4>布局与字号</h4>
          <div class="demo-config__slider-group">
            <label v-for="f in tableNumericFields" :key="f.key" class="demo-config__slider-field">
              <span class="demo-config__slider-label">
                {{ f.label }}
                <code>{{ tableForm[f.key] }}{{ f.unit }}</code>
              </span>
              <input v-model.number="tableForm[f.key]" type="range" :min="f.min" :max="f.max" />
            </label>
          </div>
          <p class="demo-config__note">表格颜色从 Theme 统一配置自动派生，无需单独设置。</p>
        </div>
      </aside>

      <!-- 右侧预览区域 -->
      <section class="demo-config__main">
        <ConfigProvider :theme="{ ...themeForm }" :table="{ ...tableForm }">
          <div class="demo-config__preview" :style="{ background: themeForm.bgPage }">
            <div
              class="demo-config__card"
              :style="{ background: themeForm.bgCard, borderColor: themeForm.borderColor }"
            >
              <h4 :style="{ color: themeForm.textHeading }">BaseTable 预览</h4>
              <BaseTable mode="element" :table-data="tableData" :columns="columns" height="240px" />
            </div>

            <div
              class="demo-config__card"
              :style="{ background: themeForm.bgCard, borderColor: themeForm.borderColor }"
            >
              <h4 :style="{ color: themeForm.textHeading }">品牌色</h4>
              <div class="demo-config__swatches">
                <div
                  v-for="item in [
                    { color: themeForm.colorPrimary, label: '主色 Primary' },
                    { color: themeForm.colorSuccess, label: '成功 Success' },
                    { color: themeForm.colorWarning, label: '警告 Warning' },
                  ]"
                  :key="item.label"
                  class="demo-config__swatch"
                >
                  <span class="demo-config__swatch-block" :style="{ background: item.color }" />
                  <span class="demo-config__swatch-info">
                    <span :style="{ color: themeForm.textPrimary }">{{ item.label }}</span>
                    <code :style="{ color: themeForm.textSecondary }">{{ item.color }}</code>
                  </span>
                </div>
              </div>
            </div>

            <div
              class="demo-config__card"
              :style="{ background: themeForm.bgCard, borderColor: themeForm.borderColor }"
            >
              <h4 :style="{ color: themeForm.textHeading }">按钮与标签</h4>
              <div class="demo-config__btn-row">
                <span
                  class="demo-config__btn"
                  :style="{ background: themeForm.colorPrimary, borderRadius: themeForm.radiusSm + 'px' }"
                >
                  主要按钮
                </span>
                <span
                  class="demo-config__btn demo-config__btn--outline"
                  :style="{
                    color: themeForm.colorPrimary,
                    borderColor: themeForm.colorPrimary,
                    borderRadius: themeForm.radiusSm + 'px',
                  }"
                >
                  次要按钮
                </span>
                <span
                  class="demo-config__tag"
                  :style="{ background: themeForm.colorPrimary + '1a', color: themeForm.colorPrimary, borderRadius: themeForm.radiusSm + 'px' }"
                >
                  标签 A
                </span>
                <span
                  class="demo-config__tag"
                  :style="{ background: themeForm.colorSuccess + '1a', color: themeForm.colorSuccess, borderRadius: themeForm.radiusSm + 'px' }"
                >
                  标签 B
                </span>
                <span
                  class="demo-config__tag"
                  :style="{ background: themeForm.colorWarning + '1a', color: themeForm.colorWarning, borderRadius: themeForm.radiusSm + 'px' }"
                >
                  标签 C
                </span>
              </div>
            </div>

            <div
              class="demo-config__card"
              :style="{ background: themeForm.bgCard, borderColor: themeForm.borderColor }"
            >
              <h4 :style="{ color: themeForm.textHeading }">背景层级</h4>
              <div class="demo-config__bg-layers">
                <div
                  v-for="item in [
                    { bg: themeForm.bgPage, label: 'bgPage' },
                    { bg: themeForm.bgSubtle, label: 'bgSubtle' },
                    { bg: themeForm.bgMuted, label: 'bgMuted' },
                    { bg: themeForm.bgCard, label: 'bgCard' },
                  ]"
                  :key="item.label"
                  class="demo-config__bg-layer"
                  :style="{
                    background: item.bg,
                    borderColor: themeForm.borderColor,
                    borderRadius: themeForm.radiusSm + 'px',
                  }"
                >
                  <span :style="{ color: themeForm.textPrimary }">{{ item.label }}</span>
                  <code :style="{ color: themeForm.textSecondary }">{{ item.bg }}</code>
                </div>
              </div>
            </div>

            <div
              class="demo-config__card"
              :style="{ background: themeForm.bgCard, borderColor: themeForm.borderColor }"
            >
              <h4 :style="{ color: themeForm.textHeading }">StatusDot 组件</h4>
              <div class="demo-config__dots">
                <StatusDot :color="themeForm.colorSuccess" text="在线" />
                <StatusDot :color="themeForm.textSecondary" text="离线" />
                <StatusDot :color="themeForm.colorWarning" text="忙碌" />
                <StatusDot :color="themeForm.colorPrimary" text="会议中" />
                <StatusDot text="默认" />
              </div>
            </div>

            <div
              class="demo-config__card"
              :style="{ background: themeForm.bgCard, borderColor: themeForm.borderColor }"
            >
              <h4 :style="{ color: themeForm.textHeading }">文字层级预览</h4>
              <p
                :style="{
                  color: themeForm.textHeading,
                  fontSize: themeForm.fontSizeBase + 'px',
                  fontWeight: 600,
                }"
              >
                标题文字 (textHeading)
              </p>
              <p :style="{ color: themeForm.textPrimary, fontSize: themeForm.fontSizeBase + 'px' }">
                主要文字 (textPrimary) — 用于正文内容
              </p>
              <p :style="{ color: themeForm.textRegular, fontSize: themeForm.fontSizeSm + 'px' }">
                常规文字 (textRegular) — 用于辅助信息
              </p>
              <p :style="{ color: themeForm.textSecondary, fontSize: themeForm.fontSizeSm + 'px' }">
                次要文字 (textSecondary) — 用于最弱信息
              </p>
            </div>

            <div
              class="demo-config__card"
              :style="{ background: themeForm.bgCard, borderColor: themeForm.borderColor }"
            >
              <h4 :style="{ color: themeForm.textHeading }">边框与圆角</h4>
              <div class="demo-config__border-demo">
                <div
                  class="demo-config__border-box"
                  :style="{
                    borderColor: themeForm.borderColor,
                    borderRadius: themeForm.radiusSm + 'px',
                    color: themeForm.textRegular,
                  }"
                >
                  borderColor + radiusSm ({{ themeForm.radiusSm }}px)
                </div>
                <div
                  class="demo-config__border-box"
                  :style="{
                    borderColor: themeForm.borderMedium,
                    borderRadius: themeForm.radiusMd + 'px',
                    color: themeForm.textRegular,
                  }"
                >
                  borderMedium + radiusMd ({{ themeForm.radiusMd }}px)
                </div>
              </div>
            </div>
          </div>
        </ConfigProvider>

        <!-- 配置 JSON 输出 -->
        <div class="demo-config__json-section">
          <button class="demo-config__json-toggle" @click="showJson = !showJson">
            {{ showJson ? "收起" : "展开" }}配置 JSON（可直接复制到 createCompLib 使用）
          </button>
          <pre v-show="showJson" class="demo-config__json">{{ configJson }}</pre>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "./variables" as *;

.demo-config__header {
  margin-bottom: $doc-sp-lg;

  h2 {
    margin: 0 0 4px;
    font-size: $doc-fs-xl;
    font-weight: 600;
    color: $doc-text-heading;
  }

  p {
    margin: 0;
    font-size: $doc-fs-sm;
    color: $doc-text-secondary;
  }
}

.demo-config__layout {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: $doc-sp-lg;
  align-items: start;
}

.demo-config__panel {
  position: sticky;
  top: 16px;
  padding: 0 $doc-sp-md 0 0;
  max-height: calc(100vh - 32px);
  overflow-y: auto;
}

.demo-config__presets {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: $doc-sp-md;
}

.demo-config__preset-btn {
  flex: 1;
  min-width: 50px;
  padding: 5px 0;
  font-size: $doc-fs-xs;
  border: none;
  border-radius: $doc-radius-sm;
  background: $doc-bg-card;
  cursor: pointer;
  text-transform: capitalize;
  transition: all 0.15s;
  color: $doc-text-regular;

  &:hover {
    background: $doc-bg-muted;
    color: $doc-color-primary;
  }

  &--save {
    background: $doc-color-primary;
    color: #fff;
    font-weight: 600;

    &:hover {
      opacity: 0.85;
      background: $doc-color-primary;
      color: #fff;
    }
  }
}

.demo-config__tabs {
  display: flex;
  margin-bottom: $doc-sp-md;
  gap: 4px;
}

.demo-config__tab {
  flex: 1;
  padding: 6px 0;
  border: none;
  background: transparent;
  font-size: $doc-fs-sm;
  font-weight: 500;
  color: $doc-text-secondary;
  cursor: pointer;
  border-radius: $doc-radius-sm;
  transition: all 0.15s;

  &.active {
    color: $doc-color-primary;
    background: $doc-bg-card;
    font-weight: 600;
  }

  &:hover:not(.active) {
    color: $doc-text-primary;
  }
}

.demo-config__form {
  h4 {
    margin: $doc-sp-sm 0 6px;
    font-size: $doc-fs-xs;
    font-weight: 600;
    color: $doc-text-secondary;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
}

.demo-config__color-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.demo-config__color-field {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 6px;
  border-radius: $doc-radius-sm;
  cursor: pointer;
  transition: background 0.1s;

  &:hover {
    background: $doc-bg-subtle;
  }

  input[type="color"] {
    width: 24px;
    height: 24px;
    border: 1px solid $doc-border-color;
    border-radius: $doc-radius-sm;
    padding: 0;
    cursor: pointer;
    flex-shrink: 0;
  }
}

.demo-config__color-info {
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 1;
  min-width: 0;
}

.demo-config__color-label {
  font-size: $doc-fs-xs;
  color: $doc-text-regular;
  white-space: nowrap;
}

.demo-config__color-info code {
  font-size: 11px;
  color: $doc-text-secondary;
  font-family: $doc-font-mono;
  margin-left: auto;
}

.demo-config__slider-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.demo-config__slider-field {
  display: flex;
  flex-direction: column;
  gap: 2px;

  input[type="range"] {
    width: 100%;
    height: 16px;
    cursor: pointer;
  }
}

.demo-config__slider-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: $doc-fs-xs;
  color: $doc-text-regular;

  code {
    font-size: 11px;
    color: $doc-text-secondary;
    font-family: $doc-font-mono;
  }
}

.demo-config__note {
  margin: $doc-sp-md 0 0;
  padding: $doc-sp-sm $doc-sp-md;
  background: $doc-bg-subtle;
  border-radius: $doc-radius-sm;
  font-size: $doc-fs-xs;
  color: $doc-text-secondary;
  line-height: 1.5;
}

// --- 预览区域 ---
.demo-config__main {
  display: flex;
  flex-direction: column;
  gap: $doc-sp-md;
}

.demo-config__preview {
  padding: $doc-sp-lg;
  border-radius: $doc-radius-lg;
  display: flex;
  flex-direction: column;
  gap: $doc-sp-md;
  transition: background 0.3s;
}

.demo-config__card {
  padding: $doc-sp-md;
  border-radius: $doc-radius-md;
  transition: all 0.3s;

  h4 {
    margin: 0 0 $doc-sp-sm;
    font-size: $doc-fs-base;
    font-weight: 600;
  }

  p {
    margin: 4px 0;
    line-height: 1.6;
  }
}

.demo-config__swatches {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.demo-config__swatch {
  display: flex;
  align-items: center;
  gap: 8px;
}

.demo-config__swatch-block {
  width: 36px;
  height: 36px;
  border-radius: $doc-radius-sm;
  flex-shrink: 0;
}

.demo-config__swatch-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: $doc-fs-xs;

  code {
    font-size: 11px;
    font-family: $doc-font-mono;
  }
}

.demo-config__btn-row {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
}

.demo-config__btn {
  display: inline-flex;
  align-items: center;
  padding: 6px 16px;
  font-size: $doc-fs-sm;
  font-weight: 500;
  color: #fff;
  cursor: default;
  transition: all 0.2s;
}

.demo-config__btn--outline {
  background: transparent !important;
  border: 1px solid;
}

.demo-config__tag {
  display: inline-flex;
  align-items: center;
  padding: 2px 10px;
  font-size: $doc-fs-xs;
  font-weight: 500;
}

.demo-config__bg-layers {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 8px;
}

.demo-config__bg-layer {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 16px 8px;
  border: 1px solid;
  font-size: $doc-fs-xs;

  code {
    font-size: 11px;
    font-family: $doc-font-mono;
  }
}

.demo-config__border-demo {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.demo-config__border-box {
  flex: 1;
  min-width: 160px;
  padding: 12px 16px;
  border: 1px solid;
  font-size: $doc-fs-xs;
  text-align: center;
}

.demo-config__dots {
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;
}

// --- JSON ---
.demo-config__json-section {
  border-radius: $doc-radius-md;
  overflow: hidden;
}

.demo-config__json-toggle {
  width: 100%;
  padding: 8px 0;
  background: none;
  border: none;
  font-size: $doc-fs-sm;
  color: $doc-text-secondary;
  cursor: pointer;
  text-align: left;
  font-weight: 500;
  transition: color 0.15s;

  &:hover {
    color: $doc-color-primary;
  }
}

.demo-config__json {
  padding: $doc-sp-md;
  margin: 0;
  font-size: 12px;
  line-height: 1.5;
  font-family: $doc-font-mono;
  color: $doc-text-regular;
  background: $doc-bg-card;
  overflow: auto;
  max-height: 400px;
}

// --- 平板端 ---
@media (max-width: $doc-bp-tablet) {
  .demo-config__layout {
    grid-template-columns: 1fr;
  }

  .demo-config__panel {
    position: static;
    max-height: none;
  }
}

// --- 移动端 ---
@media (max-width: $doc-bp-mobile) {
  .demo-config__header {
    margin-bottom: $doc-sp-md;

    h2 {
      font-size: $doc-fs-lg;
    }
  }

  .demo-config__layout {
    gap: $doc-sp-md;
  }

  .demo-config__panel {
    padding: $doc-sp-sm;
  }

  .demo-config__presets {
    gap: 4px;

    .demo-config__preset-btn {
      min-width: 44px;
      min-height: 32px;
      padding: 4px 2px;
    }
  }

  .demo-config__tab {
    min-height: 36px;
  }

  .demo-config__color-field {
    padding: 6px;

    input[type="color"] {
      width: 32px;
      height: 32px;
    }
  }

  .demo-config__slider-field {
    input[type="range"] {
      height: 24px;
    }
  }

  .demo-config__preview {
    padding: $doc-sp-sm;
  }

  .demo-config__card {
    padding: $doc-sp-sm;

    h4 {
      font-size: $doc-fs-sm;
    }
  }

  .demo-config__dots {
    gap: 12px;
  }

  .demo-config__json {
    max-height: 240px;
    font-size: 11px;
  }
}
</style>
