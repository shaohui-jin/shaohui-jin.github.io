import { copyFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { blogMetaPlugin } from "./build/blog-meta";

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
  plugins: [vue(), blogMetaPlugin(), copyIndexTo404()],
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
