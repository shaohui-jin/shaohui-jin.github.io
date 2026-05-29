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
      staticImport: true,
      insertTypesEntry: true,
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    lib: {
      entry: {
        index: resolve(__dirname, "src/index.ts"),
        "util/index": resolve(__dirname, "src/util/index.ts"),
        "util/color": resolve(__dirname, "src/util/color.ts"),
        "util/number": resolve(__dirname, "src/util/number.ts"),
        "util/object": resolve(__dirname, "src/util/object.ts"),
        "util/array": resolve(__dirname, "src/util/array.ts"),
        "util/clipboard": resolve(__dirname, "src/util/clipboard.ts"),
        "util/debounce": resolve(__dirname, "src/util/debounce.ts"),
        "util/optimize": resolve(__dirname, "src/util/optimize.ts"),
        "util/permission": resolve(__dirname, "src/util/permission.ts"),
        "util/typescript": resolve(__dirname, "src/util/typescript.ts"),
        "type/index": resolve(__dirname, "src/type/index.ts"),
        "type/basic": resolve(__dirname, "src/type/basic.ts"),
        "type/crud": resolve(__dirname, "src/type/crud.ts"),
      },
      formats: ["es", "cjs"],
      fileName: (format, entryName) => {
        const ext = format === "es" ? "mjs" : "js";
        return `${entryName}.${ext}`;
      },
    },
    rollupOptions: {
      external: [
        "vue",
        /^vue\//,
        "element-plus",
        /^element-plus\//,
        "@element-plus/icons-vue",
        "lodash-es",
        /^lodash-es\//,
        "canvaskit-wasm",
      ],
      output: {
        exports: "named",
        globals: {
          vue: "Vue",
          "element-plus": "ElementPlus",
        },
      },
    },
    cssCodeSplit: false,
    sourcemap: true,
  },
});
