<script setup lang="ts">
import { onMounted, ref, shallowRef } from "vue";
import { File, Repl, Sandbox, useStore } from "@vue/repl";
import "@vue/repl/style.css";
import type { DemoBlock } from "./createMarkdownEngine";

const props = defineProps<{
  demo: DemoBlock;
}>();

function buildFiles(): Record<string, File> {
  return Object.fromEntries(
    Object.entries(props.demo.files).map(([name, code]) => [name, new File(name, code)]),
  );
}

const store = useStore({
  files: ref(buildFiles()),
  activeFilename: ref("App.vue"),
  mainFile: ref("App.vue"),
});

/**
 * 必须先 init 再挂预览：否则首次编译/重建预览时 import map 可能还没登记，
 * 预览 iframe 会报 `Failed to resolve module specifier "vue"` 并渲染空白。
 */
const ready = ref(false);

onMounted(async () => {
  try {
    await store.init();
  } catch {
    // 单个 demo 编译失败不该影响整篇文章，预览区会显示空/报错，其余 demo 照常
  }
  ready.value = true;
});

const codeOpen = ref(false);
const editing = ref(false);
const loadingEditor = ref(false);
/** CodeMirror 编辑器组件，首次进入编辑态时才动态加载（约 527 KB） */
const editor = shallowRef<null | (typeof import("@vue/repl/codemirror-editor"))["default"]>(null);

async function toggleEdit(): Promise<void> {
  if (editing.value) {
    editing.value = false;
    return;
  }

  if (!editor.value) {
    loadingEditor.value = true;
    try {
      const mod = await import("@vue/repl/codemirror-editor");
      editor.value = mod.default;
    } finally {
      loadingEditor.value = false;
    }
  }

  editing.value = true;
}

function resetCode(): void {
  // 注意：不能整体替换 store.files，那会让预览重建时丢失 import map
  // （报 Failed to resolve module specifier "vue"）。逐文件改 code 走的是和手动编辑相同的路径。
  for (const [name, code] of Object.entries(props.demo.files)) {
    const file = store.files[name];
    if (file) {
      if (file.code !== code) file.code = code;
    } else {
      store.addFile(new File(name, code));
    }
  }
  store.setActive("App.vue");
}
</script>

<template>
  <div class="vp-demo">
    <div class="vp-demo__preview" :class="{ 'vp-demo__preview--edit': editing }">
      <div v-if="loadingEditor || !ready" class="vp-demo__loading">
        {{ loadingEditor ? "编辑器加载中…" : "预览加载中…" }}
      </div>
      <!--
        用 v-show 而不是 v-if：Repl 卸载时其内部 PreviewProxy 仍在 watch 里往已移除的
        iframe postMessage，会抛 "Cannot read properties of null (reading 'postMessage')"。
        一旦创建就保留在 DOM 里（隐藏），只切换显隐。
      -->
      <div v-show="editing" class="vp-demo__editor">
        <Repl v-if="editor" :editor="editor" :store="store" />
      </div>
      <Sandbox v-if="ready && !editing && !loadingEditor" :store="store" />
    </div>
    <div class="vp-demo__actions">
      <button
        v-if="editing"
        type="button"
        class="vp-demo__toggle"
        @click="resetCode"
      >
        重置代码
      </button>
      <button type="button" class="vp-demo__toggle" @click="codeOpen = !codeOpen">
        {{ codeOpen ? "收起代码" : "查看代码" }}
      </button>
      <button type="button" class="vp-demo__toggle" @click="toggleEdit">
        {{ editing ? "退出编辑" : "在线编辑" }}
      </button>
    </div>
    <pre v-if="codeOpen" class="vp-demo__code"><code>{{ demo.code }}</code></pre>
  </div>
</template>

<style scoped lang="scss">
@use "../style/variables" as *;

.vp-demo {
  margin: $doc-sp-md 0;
  border: 1px solid $doc-border-color;
  border-radius: $doc-radius-lg;
  overflow: hidden;
}

.vp-demo__preview {
  height: 320px;
  background: #fff;
}

/* 编辑态要高一些，CodeMirror 太矮不好用 */
.vp-demo__preview--edit {
  height: 480px;
}

.vp-demo__preview :deep(iframe) {
  width: 100%;
  height: 100%;
  border: 0;
}

.vp-demo__preview--edit :deep(.vue-repl) {
  height: 100%;
}

.vp-demo__editor {
  height: 100%;
}

.vp-demo__loading {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: $doc-text-secondary;
  font-size: $doc-fs-sm;
}

.vp-demo__actions {
  display: flex;
  justify-content: flex-end;
  gap: $doc-sp-xs;
  padding: $doc-sp-xs $doc-sp-md;
  background: $doc-bg-subtle;
  border-top: 1px solid $doc-border-color;
}

.vp-demo__toggle {
  padding: 2px $doc-sp-sm;
  border: 0;
  background: transparent;
  color: $doc-color-primary;
  font-size: $doc-fs-xs;
  cursor: pointer;
}

.vp-demo__code {
  margin: 0;
  padding: $doc-sp-md;
  background: $doc-bg-subtle;
  border-top: 1px solid $doc-border-color;
  font-size: $doc-fs-xs;
  line-height: 1.6;
  overflow: auto;
  max-height: 360px;
}
</style>
