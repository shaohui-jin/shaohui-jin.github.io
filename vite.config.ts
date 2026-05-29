import { copyFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath, URL } from "node:url";

/** 将 canvaskit.wasm 和字体复制到构建输出的 assets 目录，供 skia-wasm 模式运行时加载 */
function copySkiaAssets(): import("vite").Plugin {
  return {
    name: "copy-skia-assets",
    closeBundle() {
      const root = fileURLToPath(new URL(".", import.meta.url));
      const destDir = resolve(root, "dist-playground/assets");
      mkdirSync(destDir, { recursive: true });
      copyFileSync(
        resolve(root, "node_modules/canvaskit-wasm/bin/canvaskit.wasm"),
        resolve(destDir, "canvaskit.wasm"),
      );
      try {
        copyFileSync(
          resolve(
            root,
            "node_modules/@fontsource/noto-sans-sc/files/noto-sans-sc-chinese-simplified-400-normal.woff2",
          ),
          resolve(destDir, "NotoSansSC-400.woff2"),
        );
      } catch {
        /* @fontsource/noto-sans-sc 未安装时跳过 */
      }
    },
  };
}

/** 本地示例应用（开发调试组件库） */
export default defineConfig({
  root: "examples",
  base: '/my-comp',
  build: {
    outDir: "../dist-playground",
    emptyOutDir: true,
  },
  plugins: [vue(), copySkiaAssets()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "comp-vue-lib": fileURLToPath(new URL("./src/index.ts", import.meta.url)),
    },
  },
  server: {
    port: 5173,
    host: true,
    watch: {
      usePolling: true,
      interval: 1000,
    },
  },
});
