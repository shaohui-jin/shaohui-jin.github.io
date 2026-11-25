import js from "@eslint/js";
import pluginVue from "eslint-plugin-vue";
import tseslint from "typescript-eslint";
import skipFormatting from "@vue/eslint-config-prettier";

export default tseslint.config(
  { ignores: ["dist", "node_modules", "*.min.js"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs["flat/recommended"],
  {
    files: ["**/*.vue"],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
      },
    },
  },
  // Node 脚本（构建期与 git 钩子）需要 node 全局变量
  {
    files: ["scripts/**/*.{js,mjs}", "build/**/*.ts"],
    languageOptions: {
      globals: {
        process: "readonly",
        console: "readonly",
        URL: "readonly",
        Buffer: "readonly",
      },
    },
  },
  skipFormatting,
);
