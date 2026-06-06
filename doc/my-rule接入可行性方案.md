# my-rule 接入 my-comp Monorepo 可行性方案

> 评估日期：2026-06-06  
> 源项目：`G:\_ _project\自己\my-rule`（包名 `design-rule`）  
> 目标仓库：`my-comp` monorepo

---

## 一、结论摘要

| 维度 | 评估 |
| ---- | ---- |
| **整体可行性** | ✅ 可行，双页面 + 静态化 + 双模式构建，预估 **2.5~3.5 人日** |
| **推荐形态** | 新建 `packages/rule`（npm 名 `jsh-rule`），以**业务模块包**接入，而非组件库子目录 |
| **Demo 展示** | ✅ 可在 `examples` 新增顶级 Tab「规则设计」，与「配置系统」「变更记录」同级全屏展示 |
| **依赖瘦身** | ✅ 约 40% 依赖可移除（pure-admin 残留 + 未引用包），迁移时应一并清理 |
| **主要风险** | Monaco/X6 构建体积、Tailwind 样式迁移工作量、后端 API 依赖、vue-router 嵌入方式 |
| **主题约束** | **禁止保留 Tailwind**；所有颜色/字号/圆角统一消费 `jsh-core` 的 `--comp-*` SCSS 变量 |

**建议分阶段推进**：先完成依赖清理 + 包化骨架 + Demo Tab 壳子，再逐步替换样式与 API。

### 1.1 精简策略：仅保留两个核心页面

经确认，`my-rule` **只需保留**：

| 保留 | 源文件 | 迁移后导出名 |
| ---- | ------ | ------------ |
| 规则编辑器 | `src/views/rule.vue` | `RuleDesigner.vue` |
| 函数编辑器 | `src/views/func.vue` | `FuncEditor.vue` |

其余页面（`views/error/*`、`views/*/detail.vue`）及配套路由可**整包删除**。

**收益：显著降低风险、缩小迁移范围**

| 风险/复杂度 | 仅双页面后 |
| ----------- | ---------- |
| vue-router 冲突 | ✅ **可完全消除** — 删除 `router/`，designer 内 `router.push` 改 `emit('switch-func')` |
| 死代码清理 | ✅ 范围明确，不会误删业务组件 |
| `@vueuse/motion` | ✅ 可移除（仅 error 页使用） |
| 迁移文件量 | ✅ `src/views/` 2 个 + 依赖树，而非整站 |
| Monaco/X6 构建 | ⚠️ 不变（核心依赖仍在） |
| API 依赖 | ✅ **可完全消除** — 静态化 + 删除 axios/api |
| Tailwind → SCSS | ⚠️ 略减（`App.vue` 可删，主要剩 `func.vue`） |

**双页面依赖树（不可删除）**：

```
rule.vue
├── panels/DndPanel, AttrPanelDrawer (+ FuncPanel, ConditionPanel, CalculatorPanel)
├── designer/index.vue (+ WorkflowValidationModal)
├── TestDrawer/
├── data/builtinNodes（原 store 静态数据）, utils/*, types/, config/, injectKeys/
└── base/BaseNodeIcon, BaseFunctionInput (+ hooks/useDialogDrag)

func.vue
├── base/BaseEditor, BasePre, BaseFormRender
├── funcForm/SimpleFormRenderer
├── utils/parser/JSDocParser, FormParser
├── 删除 ruleCache 相关逻辑（onActivated 跨页传参）
└── utils/manager/MonacoManager
```

**可安全删除（与双页面无关）**：

`views/error/`、`views/*/detail.vue`、`router/`、`App.vue`、`layout/`、`components/BaseTable/`、`components/layout/`、`plugins/`、`directives/`、`assets/status/`（error 页 SVG）

---

## 二、源项目画像

### 2.1 项目性质

`my-rule` 是一个 **Vue 3 独立 SPA 应用**（非组件库），核心功能：

| 页面 | 路由 | 功能 |
| ---- | ---- | ---- |
| 规则编辑器 | `/rule` | AntV X6 工作流画布 + 节点属性面板 + 脚本生成 |
| 函数编辑器 | `/func` | Monaco 编写 JSDoc 函数 + 动态表单预览 |

附带 `doc/` 三篇技术文档（工作流生成器、函数编辑器、X6 画布）。

### 2.2 与 my-comp 的关系

- **零交叉引用**：`my-rule` 未使用 `jsh-comp` / `comp-vue-lib`
- **重复实现**：`my-rule` 内有自研 `BaseTable`/`BaseSearch` 等 CRUD 组件，但**当前页面未引用**（pure-admin 模板残留）
- **技术栈差异**：

| 项 | my-comp | my-rule |
| -- | ------- | ------- |
| 样式 | SCSS + `jsh-core` CSS 变量 | Tailwind CSS v3 + 硬编码 EP 变量（**迁移时全部替换**） |
| 路由 | 无（App.vue 手动切换） | vue-router |
| 状态 | 无全局 store | pinia |
| EP 版本 | ^2.8.8 | ~2.2.32 |
| 构建 | Turborepo 多包 | 单应用 Vite 4 |

---

## 三、接入架构方案

### 3.1 目标目录结构（双模式：独立 dev + lib 导出组件）

```
my-comp/
├── packages/
│   └── rule/                          # ★ jsh-rule
│       ├── package.json
│       ├── index.html                 # 独立 dev 入口
│       ├── vite.config.ts             # app 模式：pnpm dev 本地预览两页面
│       ├── vite.lib.config.ts         # lib 模式：build 导出组件
│       └── src/
│           ├── index.ts               # lib 导出入口
│           ├── dev/                   # 仅 dev 用，不打入 lib
│           │   ├── main.ts
│           │   └── App.vue            # el-tabs 切换两页面
│           ├── component/
│           │   ├── js-doc-editor/
│           │   │   └── JsDocEditor.vue      # ← func.vue（语义化重命名）
│           │   └── workflow-designer/
│           │       └── WorkflowDesigner.vue   # ← rule.vue（语义化重命名）
│           ├── internal/              # 两组件内部依赖，不单独导出
│           │   ├── designer/、panels/、base/、TestDrawer/ …
│           │   ├── utils/、types/、config/
│           │   └── data/              # ★ 静态数据（替代原 api/axios）
│           └── style/
├── examples/
│   ├── demo/
│   │   ├── js-doc-editor/DemoJsDocEditor.vue
│   │   └── workflow-designer/DemoWorkflowDesigner.vue
│   └── App.vue                        # 新增两个 topTab
└── doc/my-rule接入可行性方案.md
```

**双模式工作流**：

| 模式 | 命令 | 产物 |
| ---- | ---- | ---- |
| 独立开发 | `pnpm --filter jsh-rule dev` | 本地预览 `JsDocEditor` + `WorkflowDesigner` |
| 库构建 | `pnpm --filter jsh-rule build` | `dist/index.mjs` 导出两组件 |
| Demo 消费 | `pnpm dev`（examples） | 分别挂载两个组件为独立 Tab |

### 3.2 包依赖关系

```
jsh-core ──┐
jsh-comp ──┤（可选，后续替换 BaseForm 等）
jsh-tool ──┘
     ↑
  jsh-rule（独立业务包，依赖 X6 / Monaco / pinia / vue-router）
     ↑
  examples（Demo Tab 消费 jsh-rule 导出组件）
```

> **分类说明**：`rule` 不属于 `basic` / `crud` / `interaction` 组件目录，应作为 `packages/` 下**独立业务包**，与 `comp` 平级。接入前须按项目约定确认包名与是否对外发布。

### 3.3 Demo Tab 接入方式

`examples/App.vue` 新增**两个独立顶级 Tab**（非子 Tab 嵌套）：

```
组件文档 | 工具函数 | 配置系统 | JsDoc 编辑器 | 规则编排 | 变更记录
```

```vue
<!-- topTab === 'js-doc-editor' -->
<div class="doc-content doc-content--full">
  <JsDocEditor />
</div>

<!-- topTab === 'workflow-designer' -->
<div class="doc-content doc-content--full">
  <WorkflowDesigner />
</div>
```

**组件命名对照**：

| 原文件 | 新组件名 | 目录 |
| ------ | -------- | ---- |
| `views/func.vue` | `JsDocEditor` | `component/js-doc-editor/` |
| `views/rule.vue` | `WorkflowDesigner` | `component/workflow-designer/` |

**嵌入策略**：组件嵌入（lib 导出）。`designer` 内「添加函数 / 跳转函数编辑」功能**删除**（见 §5.9）。

### 3.4 静态化策略（移除 axios）

**原则**：不引入 `axios` / `qs`，不做 HTTP 请求；原 API 调用注释或替换为静态逻辑。

| 原调用点 | 静态化处理 |
| -------- | ---------- |
| `func.vue` → `saveFuncData` POST | 改为 `localStorage` 持久化 + `ElMessage.success` |
| `TestDrawer` → api/test、WorkFlowApi 导入 | **已是死 import**（`executeTest` 实际用 `new Function()` 本地执行），直接删除 import |
| `api/` 整个目录 | 删除；**类型定义**迁至 `src/types/` |
| `axios/` 整个目录 | 删除 |
| `main.ts` Axios.defaults | 删除 |

**静态数据模块** `src/internal/data/`：

- `functionTemplates.ts` — JsDoc 编辑器默认模版
- `builtinNodes.ts` — 规则编排内置节点（原 `store/baseFunction` 静态数据可迁入）
- `sampleWorkflow.ts` — 可选示例工作流（Demo 初始数据）

> 核查结论：`TestDrawer.executeTest` 已走本地 `new Function()` 执行，移除 axios **不影响**测试抽屉核心功能；仅需清理死 import 和 `func.vue` 保存逻辑。

---

## 四、依赖清理清单

### 4.1 确认无用 — 迁移时直接移除

#### dependencies（17 项）

| 包 | 原因 |
| -- | ---- |
| `@antv/layout` | 源码零引用 |
| `@pureadmin/descriptions` | 仅 global.d.ts 类型残留，实际用 EP `ElDescriptions` |
| `@pureadmin/table` | 仅类型残留，自研 BaseTable 也未被页面使用 |
| `@pureadmin/utils` | 仅 `vite.config.ts` 构建统计用，可删或内联 |
| `@tailwindcss/postcss` | postcss 实际用 tailwindcss v3 |
| `tailwindcss` | 迁移后全部改用 SCSS，不再保留 |
| `animate.css` | 零引用 |
| `clipboard` | 用的是 `navigator.clipboard` API |
| `echarts` | `plugins/echarts` 存在但 main.ts 未注册 |
| `highlight.js` | 零引用 |
| `js-cookie` | 零引用 |
| `jsencrypt` | 零引用 |
| `mockjs` | mock 目录不存在，插件未启用 |
| `vue-i18n` | 零引用 |
| `vue-types` | 零引用 |
| `responsive-storage` | 仅 global.d.ts 类型 |
| `path`（npm polyfill） | Node 内置 `path` 即可 |
| `dayjs` | 业务代码零引用（仅 vite 构建脚本） |

#### devDependencies（建议移除 12+ 项）

`@pureadmin/theme`、`@intlify/unplugin-vue-i18n`、`@iconify-*`、`vite-plugin-mock`、`vite-plugin-cdn-import`、`vite-plugin-compression`、`rollup-plugin-visualizer`、`sass-loader`、`husky`/`lint-staged`/`commitlint`（monorepo 根统一管理）

### 4.2 连同死代码一并删除

| 目录/文件 | 说明 |
| --------- | ---- |
| `src/components/BaseTable/*` | 无页面引用，与 jsh-comp 重复 |
| `src/components/layout/*` | 无引用 |
| `src/layout/index.vue` | 未挂路由 |
| `src/plugins/element-plus/` | main.ts 已直接全量注册 EP |
| `src/plugins/echarts/` | 未注册 |
| `src/views/*/detail.vue` | 孤儿文件 |
| `types/global.d.ts` 中 pure-admin 类型 | 清理后重写 |

### 4.3 保留的核心依赖

| 包 | 用途 |
| -- | ---- |
| `@antv/x6` | 工作流画布核心 |
| `dagre` | 一键自动布局 |
| `monaco-editor` + `@monaco-editor/loader` + `vite-plugin-monaco-editor` | 代码编辑器 |
| `vue` / `pinia` | 应用框架（**vue-router 可移除**，由 Demo Tab 切换） |
| `element-plus` | UI（需升级到 ^2.8 对齐 monorepo） |
| ~~`axios` + `qs`~~ | **移除**，改静态数据 + localStorage |
| `@vueuse/core` | `useVModel` 等 |
| ~~`@vueuse/motion`~~ | 仅 error 页使用，**双页面策略下移除** |
| `click-outside-vue3` | 点击外部关闭 |
| `sass` | 全部样式统一为 SCSS + `jsh-core` 变量 |

### 4.4 瘦身效果预估

| 指标 | 迁移前 | 清理后 |
| ---- | ------ | ------ |
| dependencies 数量 | 34 | ~17 |
| devDependencies 数量 | 58 | ~25 |
| 死代码目录 | 5+ | 0 |
| node_modules 体积 | 未精确统计 | 预计减少 30~40% |

---

## 五、技术难点与对策

### 5.1 Monaco Editor 构建

**现状**：`vite-plugin-monaco-editor` + `viteStaticCopy` 复制 `vs/` 到 dist。

**对策**：
- `packages/rule/vite.config.ts` 保留 monaco 插件配置
- `examples/vite.config.ts` 合并 monaco 相关 plugin（或 rule 包预构建时处理）
- GitHub Pages 部署需确保 `vs/` 静态资源路径正确（当前 my-comp base 为 `/my-comp/`）

### 5.2 构建体积

X6 + Monaco 合计约 **2~4 MB**（gzip 后仍显著）。对策：

- Demo Tab 使用 `defineAsyncComponent` 懒加载
- 不与 jsh-comp 主包混编，独立 `jsh-rule` 包
- turbo `build` 中 rule 包独立产物

### 5.3 样式体系统一（硬性要求：全部依赖 jsh-core）

**原则**：`jsh-rule` 内禁止 Tailwind class、禁止硬编码色值、禁止在 `styles/index.css` 覆写 `--el-*` 变量。所有视觉 token 通过 `jsh-core` 注入。

#### 需删除的样式基础设施

| 文件 | 处理 |
| ---- | ---- |
| `tailwind.config.js` | 删除 |
| `postcss.config.js` 中 tailwind 插件 | 删除 |
| `src/styles/index.css` | 删除（含 `@tailwind` 指令和硬编码 `--el-color-primary` 等） |

#### Tailwind class → SCSS 迁移范围

当前 Tailwind 使用集中在 4 个文件（约 56 处 `theme-*` class）：

| 文件 | 处理 |
| ---- | ---- |
| `views/func.vue` | 布局 class 改 scoped SCSS + flex/grid；颜色改 `$lib-*` 变量 |
| `components/panels/AttrPanelDrawer.vue` | 同上 |
| `components/base/BaseFormRender.vue` | 同上 |
| `App.vue` | 同上 |

其余组件已使用 `<style lang="scss">` 或语义化 class，迁移量可控。

#### 颜色映射（my-rule 自定义蓝 → jsh-core）

| my-rule Tailwind token | 替换为 |
| ---------------------- | ------ |
| `theme-dark` (#014f9c) | `$lib-color-primary`（或 `color-mix` 派生深色） |
| `theme-medium` (#3c79b4) | `$lib-color-primary` |
| `theme-light` / `theme-lighter` | `color-mix(in srgb, $lib-color-primary X%, white)` |
| `bg-white` | `$lib-bg-card` |
| `border-theme-lighter` | `$lib-border-color` |
| `text-theme-dark` | `$lib-text-heading` |

#### 样式引用方式

```scss
// packages/rule 组件内
@use "jsh-core/style/variables" as *;

.rule-card {
  background: $lib-bg-card;
  border: 1px solid $lib-border-color;
  border-radius: $lib-radius-md;
  color: $lib-text-primary;
}
```

#### EP 主题同步

- rule 模块**不独立** `createCompLib`
- 消费 `examples` 入口已注入的全局 `--comp-*` / `--el-*` 变量
- X6 画布节点颜色从 `useLibConfig()` 读取 `theme.colorPrimary` 等派生

### 5.4 后端 API 依赖（静态化后消除）

**现状**：仅 `func.vue` 的 `saveFuncData` 实际发起 HTTP；`TestDrawer` 的 api import 为死代码。

**对策**：
- 删除 `axios/`、`api/` 目录及 `qs` 依赖
- `saveFuncData` → `localStorage.setItem('jsh-rule:func', ...)` + 成功提示
- 类型从 `api/*.ts` 提取到 `types/`，不保留请求函数
- **风险等级：低**（已确认 TestDrawer 测试走本地执行）

### 5.5 vue-router 冲突（双页面策略下可消除）

**现状**：examples 无 vue-router；`my-rule` 仅双页面，且 designer 内仅 1 处 `router.push({ name: 'functionEdit' })`。

**对策**：
- 抽离 `RuleDesigner` / `FuncEditor` 为**无路由**单页组件
- **整包删除** `router/`、`App.vue`、`views/error/`
- designer 内 `router.push` 改为 `emit('open-func-editor')`，由 Demo Tab 切换
- **`vue-router` 从 dependencies 移除**
- pinia store 在组件 `onMounted` 时初始化

### 5.6 Element Plus 版本对齐

`my-rule` EP ~2.2.32 → 升级到 `^2.8.8`（与 monorepo 一致）。需回归测试：
- `el-drawer` / `el-dialog` API 变化
- CSS 变量命名

### 5.7 双模式 Vite（dev app + lib build）

**模式说明**（与 `jsh-comp` 的纯 lib 构建互补）：

| 配置文件 | 模式 | 用途 |
| -------- | ---- | ---- |
| `vite.config.ts` | `app` | `index.html` → `src/dev/main.ts`，独立调试两页面 |
| `vite.lib.config.ts` | `lib` | 多入口导出 `JsDocEditor` + `WorkflowDesigner` |

**lib 导出入口**：

```ts
// packages/rule/src/index.ts
export { default as JsDocEditor } from "./component/js-doc-editor/JsDocEditor.vue";
export { default as WorkflowDesigner } from "./component/workflow-designer/WorkflowDesigner.vue";
export type { /* 按需 */ } from "./types";
```

**风险与对策**：

| 风险 | 等级 | 对策 |
| ---- | ---- | ---- |
| 双 vite 配置维护 | 低 | alias / scss 抽公共 `vite.shared.ts` |
| ~~pinia 在嵌入组件中失效~~ | ✅ **可消除** | 见 §5.8：store 改为 composable / props，移除 pinia 依赖 |
| Monaco `vs/` 静态资源 | 中 | lib build 时 `viteStaticCopy`；examples vite 同步 monaco 插件 |
| X6 节点 SVG（`public/rsvg/`） | 低 | 迁入 `src/assets/` 用 `import` 或 vite asset 处理 |
| lib 构建 EP 重复注册 | 低 | lib 模式 external `element-plus`，不 `app.use` |

**结论**：双模式是**成熟模式**（类似 Storybook / 组件 dev app），jsh-comp 已有 `vite.lib.config.ts` 先例；rule 包额外增加 dev app **不增加本质风险**，反而降低联调成本。

### 5.8 Store 目录不迁移（整包删除）

**原则**：`src/store/` **整体不迁移**。两页面本身不依赖 pinia 作为必要基础设施；原 store 仅是过度封装。

| 原 store 内容 | 两页面是否真正需要 | 处理 |
| ------------- | ------------------ | ---- |
| `BaseFunctionNode[]` 静态数组 | DndPanel 需要节点列表数据 | 提取到 `internal/data/builtinNodes.ts`，DndPanel 直接 `import` |
| `BaseFunctionNodeType` 类型 | designer / DndPanel 需要 | 提取到 `types/workflow.ts` |
| `useFunctionStore().getFuncNode()` | 仅是懒加载上述静态数组的包装 | **不迁移**，改直接 import |
| `ruleCache`（全部） | 跨页面临时缓存，**当前无使用场景** | **整包删除**，不迁移、不替代 |
| `useRuleStore` / `useCanvasStore` | 零引用 | 不迁移 |
| `BaseNodeIcon` 导入 store | **死 import** | 删除 |

**ruleCache 处理**：`func.vue` 中 `onActivated` + `functionStore.currentFunction` 逻辑一并删除。

**收益**：`pinia` 不引入；`store/` 目录不存在。

### 5.9 删除「添加函数 / 跳转函数编辑」

**决策**：designer 左侧面板只展示代码内置节点，不提供跳转用户自定义函数编辑的入口。

**需删除的代码**：

| 位置 | 内容 |
| ---- | ---- |
| `baseFunction` 静态数据 | `funcId: '999'`、`LogicType.ADD`、`title: '添加函数'` 条目 |
| `designer/startDragPreview` | `if (item.type === LogicType.ADD)` 分支 + `ElMessageBox` + `router.push` |
| `designer` import | `useRouter`（移除后不再需要 vue-router） |

**保留**：DndPanel 展示的内置逻辑节点（全局参数、全局变量、条件、计算器等代码定义的节点）。

---

## 六、实施路线图

### Phase 0 — 准备（0.5 天）

- [ ] 确认包名 `jsh-rule`、组件名 `JsDocEditor` / `WorkflowDesigner`
- [ ] 确认 examples 两个 Tab 文案

### Phase 1 — 骨架迁移 + 静态化 + 样式统一（1.5~2 天）

- [ ] 创建 `packages/rule/`，迁移双页面依赖树至 `internal/`
- [ ] 重命名：`func.vue` → `JsDocEditor.vue`，`rule.vue` → `WorkflowDesigner.vue`
- [ ] 删除 `axios/`、`api/`、`store/`（不迁移）；静态数据提取到 `data/`，跨页改 props
- [ ] `saveFuncData` 改 localStorage；清理 TestDrawer / designer 死 import
- [ ] `BasePre` 替换为 `jsh-comp` 的 `CodeBlock`
- [ ] Tailwind → SCSS + `jsh-core` 变量
- [ ] 配置 `vite.config.ts`（dev app）+ `vite.lib.config.ts`（lib 导出）
- [ ] 添加 `src/dev/` 独立预览入口
- [ ] 更新 `pnpm-workspace.yaml`、`turbo.json`

### Phase 2 — Demo 接入（0.5~1 天）

- [ ] `examples` 新增 `js-doc-editor`、`workflow-designer` 两个 topTab
- [ ] 删除 designer「添加函数」节点及跳转逻辑
- [ ] examples vite 合并 monaco 插件
- [ ] 验证：`jsh-rule dev` → `pnpm dev` → `pnpm build:playground`

### Phase 3 — 打磨（0.5 天，可选）

- [ ] 复用 `jsh-comp` 的 `CodeBlock` 替换 `BasePre`
- [ ] 迁移 `my-rule/doc/` 三篇文档
- [ ] 更新架构设计 / CHANGELOG

---

## 七、与项目规范的衔接

| 规范项 | 处理方式 |
| ------ | -------- |
| 组件三分目录 | **不适用** — rule 是业务模块包，不是 `component/` 子目录 |
| 新增 `packages/` 子目录 | 须开发者确认（本方案建议 `packages/rule`） |
| Demo 规范 | 规则设计 Tab 可走全屏模式（类似 ConfigProvider），不必强制 DemoWidgetTabs |
| 路径引用 | rule 包内用 `@/`；跨包用 `jsh-comp` / `jsh-core` / `jsh-tool` |
| 三端适配 | rule 画布区域需单独验证移动端（X6 触摸交互、Monaco 窄屏） |

---

## 八、风险矩阵

| 风险 | 等级 | 缓解 |
| ---- | ---- | ---- |
| 构建失败（monaco/x6） | 中 | 保留原 vite 插件配置，分步验证 |
| Demo 首屏变慢 | 中 | 异步加载 + 独立 chunk |
| API 不可用导致 Demo 空白 | ~~高~~ → **已消除** | 静态化，无 HTTP 依赖 |
| 移动端画布不可用 | 中 | 标注「建议 PC 端使用」，或隐藏移动端 Tab |
| Tailwind 迁移遗漏导致样式缺失 | 中 | Phase 1 逐文件迁移 + 视觉回归 |

---

## 九、已确认决策

| 项 | 决定 |
| -- | ---- |
| Tab 文案 | 「JsDoc 编辑器」+「规则编排」 |
| 包名 | `jsh-rule` |
| npm 发布 | **暂不发布**（`package.json` 设 `"private": true`，见下方说明） |
| axios | 不引入，纯静态 + localStorage |
| BasePre | 替换为 `jsh-comp` 的 `CodeBlock` |
| pinia / store | **不迁移** `store/`；`ruleCache` 整包删除；静态节点数据 → `data/` |
| private | `jsh-rule` 设 `"private": true` |
| 原仓库 | `my-rule` 保持不动，作备份溯源 |

### 关于 `private: true` 的含义

`package.json` 中 `"private": true` 表示这个包**不会被发布到 npm 公共仓库**（不能执行 `npm publish`）。它只是 monorepo 内部通过 `workspace:*` 给 `examples` 用的本地包。以后若要公开发布，去掉该字段即可。

---

## 附录：清理后 package.json 草案

```json
{
  "name": "jsh-rule",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "types": "./dist/index.d.ts"
    }
  },
  "dependencies": {
    "@antv/x6": "^3.0.0",
    "@monaco-editor/loader": "^1.7.0",
    "@vueuse/core": "^9.13.0",
    "click-outside-vue3": "^4.0.1",
    "dagre": "^0.8.5",
    "element-plus": "^2.8.8",
    "jsh-core": "workspace:*",
    "jsh-comp": "workspace:*",
    "monaco-editor": "^0.54.0",
    "vue": "^3.5.13"
  },
  "peerDependencies": {
    "element-plus": "^2.8.0",
    "vue": "^3.4.0"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^5.2.0",
    "@vitejs/plugin-vue-jsx": "^3.0.0",
    "sass": "^1.81.0",
    "typescript": "~5.6.3",
    "vite": "^5.4.11",
    "vite-plugin-monaco-editor": "^1.1.0",
    "vite-plugin-static-copy": "^3.2.0",
    "vue-tsc": "^2.1.10"
  }
}
```

> 双页面 + 静态化策略下 `pinia`、`axios`、`qs`、`vue-router`、`@vueuse/motion`、`mitt`、`element-resize-detector` 均可移除。
