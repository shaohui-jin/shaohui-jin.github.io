import { resolve } from "node:path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

const utilEntries = [
  "index",
  "color",
  "number",
  "object",
  "array",
  "clipboard",
  "debounce",
  "optimize",
  "permission",
  "typescript",
] as const;

export default defineConfig({
  plugins: [
    dts({
      tsconfigPath: "./tsconfig.json",
      outDir: "dist",
      include: utilEntries.map((name) => `src/${name}.ts`),
      staticImport: true,
      insertTypesEntry: true,
    }),
  ],
  build: {
    outDir: "dist",
    emptyOutDir: true,
    lib: {
      entry: Object.fromEntries(
        utilEntries.map((name) => [name, resolve(__dirname, `src/${name}.ts`)]),
      ),
      formats: ["es", "cjs"],
      fileName: (format, entryName) => {
        const ext = format === "es" ? "mjs" : "js";
        return `${entryName}.${ext}`;
      },
    },
    rollupOptions: {
      external: ["vue", /^vue\//],
      output: {
        exports: "named",
      },
    },
    sourcemap: true,
  },
});
