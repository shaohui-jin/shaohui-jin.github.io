import { copyFileSync, existsSync, mkdirSync, readFileSync, statSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import monacoEditorPluginModule from "vite-plugin-monaco-editor";

const monacoEditorPlugin =
  (monacoEditorPluginModule as { default?: typeof monacoEditorPluginModule }).default ??
  monacoEditorPluginModule;
import { viteStaticCopy } from "vite-plugin-static-copy";
import { fileURLToPath, URL } from "node:url";

/** 将 canvaskit.wasm 和字体复制到构建输出的 assets 目录，供 skia-wasm 模式运行时加载 */
function copySkiaAssets(): import("vite").Plugin {
  return {
    name: "copy-skia-assets",
    closeBundle() {
      const root = fileURLToPath(new URL("..", import.meta.url));
      const destDir = resolve(root, "dist-playground/assets");
      mkdirSync(destDir, { recursive: true });
      try {
        copyFileSync(
          resolve(root, "node_modules/canvaskit-wasm/bin/canvaskit.wasm"),
          resolve(destDir, "canvaskit.wasm"),
        );
      } catch {
        /* canvaskit-wasm 未安装时跳过 */
      }
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

/** 在 dev 模式下为 rule 包的 public 静态资源提供服务 */
function rulePublicServe(): import("vite").Plugin {
  const rulePublic = fileURLToPath(new URL("../packages/rule/public", import.meta.url));
  return {
    name: "rule-public-serve",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url ?? "";
        if (url.startsWith("/rsvg/")) {
          const filePath = resolve(rulePublic, url.slice(1));
          if (existsSync(filePath) && statSync(filePath).isFile()) {
            res.setHeader("Content-Type", "image/svg+xml");
            res.end(readFileSync(filePath));
            return;
          }
        }
        next();
      });
    },
  };
}

/** 统一处理 @/ 别名解析：comp 包和 rule 包根据 importer 路径分别指向不同目录 */
function ruleDevResolver(): import("vite").Plugin {
  const compSrc = fileURLToPath(new URL("../packages/comp/src", import.meta.url));
  const compStyleDir = fileURLToPath(new URL("../packages/comp/src/style", import.meta.url));
  const ruleInternal = fileURLToPath(new URL("../packages/rule/src/internal", import.meta.url));
  const ruleEntry = fileURLToPath(new URL("../packages/rule/src/index.ts", import.meta.url));
  const ruleStyle = fileURLToPath(new URL("../packages/rule/dist/style.css", import.meta.url));
  const coreStyleDir = fileURLToPath(new URL("../packages/core/src/style", import.meta.url));

  const isFile = (p: string) => existsSync(p) && statSync(p).isFile();
  const tryResolve = (base: string) => {
    const candidates = [`${base}.ts`, `${base}.vue`, `${base}.js`, resolve(base, "index.ts"), base];
    return candidates.find(isFile) ?? null;
  };

  return {
    name: "rule-dev-resolver",
    enforce: "pre",
    resolveId(source, importer) {
      if (source === "jsh-rule/style.css") return ruleStyle;
      if (source === "jsh-rule") return ruleEntry;
      if (source.startsWith("jsh-core/style/")) {
        const rel = source.replace("jsh-core/style/", "");
        return tryResolve(resolve(coreStyleDir, rel));
      }
      if (source.startsWith("@/") && importer) {
        const ni = importer.replace(/\\/g, "/");
        if (ni.includes("packages/rule")) {
          return tryResolve(resolve(ruleInternal, source.slice(2)));
        }
        if (source.startsWith("@/style")) {
          return tryResolve(resolve(compStyleDir, source.slice(7)));
        }
        return tryResolve(resolve(compSrc, source.slice(2)));
      }
      return null;
    },
  };
}

/** 本地示例应用（开发调试组件库） */
export default defineConfig({
  root: fileURLToPath(new URL(".", import.meta.url)),
  base: "/",
  build: {
    outDir: "../dist-playground",
    emptyOutDir: true,
  },
  plugins: [
    rulePublicServe(),
    ruleDevResolver(),
    vue(),
    copySkiaAssets(),
    monacoEditorPlugin({
      languageWorkers: ["editorWorkerService", "json", "typescript", "html", "css"],
    }),
    viteStaticCopy({
      targets: [
        {
          src: "node_modules/monaco-editor/min/vs/**/*",
          dest: "vs",
        },
        {
          src: "../packages/rule/public/rsvg/*",
          dest: "rsvg",
        },
      ],
    }),
  ],
  resolve: {
    alias: [
      { find: "jsh-comp/type", replacement: fileURLToPath(new URL("../packages/comp/src/type/index.ts", import.meta.url)) },
      { find: "jsh-comp", replacement: fileURLToPath(new URL("../packages/comp/src/index.ts", import.meta.url)) },
      { find: "jsh-core/style", replacement: fileURLToPath(new URL("../packages/core/src/style", import.meta.url)) },
      { find: "jsh-core", replacement: fileURLToPath(new URL("../packages/core/src/index.ts", import.meta.url)) },
      { find: "jsh-tool/color", replacement: fileURLToPath(new URL("../packages/tool/src/color.ts", import.meta.url)) },
      { find: "jsh-tool/number", replacement: fileURLToPath(new URL("../packages/tool/src/number.ts", import.meta.url)) },
      { find: "jsh-tool", replacement: fileURLToPath(new URL("../packages/tool/src/index.ts", import.meta.url)) },
    ],
  },
  css: {
    preprocessorOptions: {
      scss: {
        importer(url: string, prev: string) {
          if (url.startsWith("@/")) {
            const np = prev.replace(/\\/g, "/");
            if (np.includes("packages/rule")) {
              return { file: resolve(fileURLToPath(new URL("../packages/rule/src/internal", import.meta.url)), url.slice(2)) };
            }
            return { file: resolve(fileURLToPath(new URL("../packages/comp/src", import.meta.url)), url.slice(2)) };
          }
          return null;
        },
      },
    },
  },
  optimizeDeps: {
    exclude: ["jsh-rule"],
  },
  server: {
    port: 5173,
    host: true,
  },
});
