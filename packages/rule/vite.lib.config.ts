import { resolve } from "node:path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import dts from "vite-plugin-dts";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [
    vue(),
    dts({
      tsconfigPath: "./tsconfig.lib.json",
      outDir: "dist",
      entryRoot: "src",
      include: ["src/index.ts"],
      staticImport: true,
      insertTypesEntry: false,
      rollupTypes: false,
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src/internal", import.meta.url)),
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      formats: ["es", "cjs"],
      fileName: (format) => (format === "es" ? "index.mjs" : "index.js"),
    },
    rollupOptions: {
      external: [
        "vue",
        /^vue\//,
        "element-plus",
        /^element-plus\//,
        "@element-plus/icons-vue",
        "monaco-editor",
        /^monaco-editor\//,
        "@monaco-editor/loader",
        "jsh-core",
        /^jsh-core\//,
        "jsh-comp",
        /^jsh-comp\//,
      ],
      output: {
        exports: "named",
      },
    },
    cssCodeSplit: false,
    sourcemap: true,
  },
});
