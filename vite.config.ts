import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import monacoEditorPluginModule from "vite-plugin-monaco-editor";
import { viteStaticCopy } from "vite-plugin-static-copy";

const monacoEditorPlugin =
  (monacoEditorPluginModule as { default?: typeof monacoEditorPluginModule }).default ??
  monacoEditorPluginModule;

/** 构建后把 CanvasKit 和中文字体放到 assets，供 skia 模式按 chunk 相对路径加载 */
function copySkiaAssets(): import("vite").Plugin {
  return {
    name: "copy-skia-assets",
    closeBundle() {
      const destDir = resolve(fileURLToPath(new URL(".", import.meta.url)), "dist/assets");
      mkdirSync(destDir, { recursive: true });
      const copies: Array<[string, string]> = [
        ["node_modules/canvaskit-wasm/bin/canvaskit.wasm", "canvaskit.wasm"],
        [
          "node_modules/@fontsource/noto-sans-sc/files/noto-sans-sc-chinese-simplified-400-normal.woff2",
          "NotoSansSC-400.woff2",
        ],
      ];
      for (const [from, name] of copies) {
        const src = resolve(fileURLToPath(new URL(".", import.meta.url)), from);
        if (!existsSync(src)) continue;
        copyFileSync(src, resolve(destDir, name));
      }
    },
  };
}

/** GitHub Pages 没有 try_files，把 index.html 复制成 404.html，让直接打开子路径仍能进 SPA */
function copyIndexTo404(): import("vite").Plugin {
  let outDir = "";
  return {
    name: "copy-index-to-404",
    apply: "build",
    configResolved(config) {
      outDir = resolve(config.root, config.build.outDir);
    },
    closeBundle() {
      const index = resolve(outDir, "index.html");
      if (!existsSync(index)) return;
      copyFileSync(index, resolve(outDir, "404.html"));
    },
  };
}

export default defineConfig({
  base: "/",
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
  plugins: [
    vue(),
    copySkiaAssets(),
    copyIndexTo404(),
    monacoEditorPlugin({
      languageWorkers: ["editorWorkerService", "json", "typescript", "html", "css"],
    }),
    viteStaticCopy({
      targets: [
        {
          src: "node_modules/monaco-editor/min/vs/**/*",
          dest: "vs",
        },
      ],
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    port: 5173,
    host: true,
  },
});
