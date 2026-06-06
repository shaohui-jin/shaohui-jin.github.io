import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import monacoEditorPluginModule from "vite-plugin-monaco-editor";

const monacoEditorPlugin =
  (monacoEditorPluginModule as { default?: typeof monacoEditorPluginModule }).default ??
  monacoEditorPluginModule;
import { viteStaticCopy } from "vite-plugin-static-copy";
import { fileURLToPath, URL } from "node:url";

const compSrc = fileURLToPath(new URL("../comp/src", import.meta.url));

function compAliasResolver(): import("vite").Plugin {
  const tryResolve = (base: string) => {
    const candidates = [base, `${base}.ts`, `${base}.vue`, `${base}.js`, resolve(base, "index.ts")];
    return candidates.find((p) => existsSync(p)) ?? null;
  };

  return {
    name: "rule-dev-comp-resolver",
    enforce: "pre",
    resolveId(source, importer) {
      if (source === "jsh-comp/style.css") return "\0virtual:jsh-comp-style";
      const normalizedImporter = importer?.replace(/\\/g, "/") ?? "";
      if (!normalizedImporter.includes("packages/comp") || !source.startsWith("@/")) return null;
      return tryResolve(resolve(compSrc, source.slice(2)));
    },
    load(id) {
      if (id === "\0virtual:jsh-comp-style") return "";
    },
  };
}

/** jsh-rule 独立 dev 预览 */
export default defineConfig({
  root: fileURLToPath(new URL(".", import.meta.url)),
  plugins: [
    compAliasResolver(),
    vue(),
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
      "@": fileURLToPath(new URL("./src/internal", import.meta.url)),
      "jsh-core/style": fileURLToPath(new URL("../core/src/style", import.meta.url)),
      "jsh-core": fileURLToPath(new URL("../core/src/index.ts", import.meta.url)),
      "jsh-comp": fileURLToPath(new URL("../comp/src/index.ts", import.meta.url)),
    },
  },
  server: {
    port: 5174,
    host: true,
  },
});
