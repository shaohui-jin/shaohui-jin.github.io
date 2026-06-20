# 版本变更记录

## v1.1.0（2026-06-19 ~ 2026-06-20）

### 组件模块

#### 组件调整

- **BaseTable**：表格布局默认值回收至组件内部，取消对全局 table 配置的依赖

### 规则模块

#### 模块调整

- **jsh-rule**：移除 JsDoc 编辑器链路，仅保留 Workflow Designer 并统一抽屉交互与复制粘贴快捷键行为

### 配置模块

#### 配置调整

- **jsh-core 配置系统**：全局配置收敛为主题配置，配置演示页改为真实 BaseTable 预览并简化应用操作

### 工程化

#### 架构调整

- 演示壳应用迁移为 `packages/playground`，并通过 `RouteRegistry + BaseRouteRegistrar` 聚合 `jsh-comp/jsh-tool/jsh-core/jsh-rule/jsh-blog` 路由
- 补齐文档子路径导出能力（`jsh-comp/doc`、`jsh-tool/doc`），`jsh-rule` 类型产物改为 `vite-plugin-dts` 统一生成

#### 文档更新

- 同步更新 `project-conventions.mdc`、`doc/组件规则流程图.md`、`doc/架构设计.md` 以匹配最新模块边界与注册规范

## v1.0.0（2026-06-06）

### 工程化

#### Monorepo 改造

- 采用 pnpm workspace + Turborepo 编排，根仓库仅负责脚本与规范
- 源码拆分为 `jsh-core`（配置 + SCSS 变量）、`jsh-comp`（组件 + 类型）、`jsh-tool`（工具函数）三个包
- `comp-vue-lib` 更名为 `jsh-comp`，工具函数独立为 `jsh-tool`，不再通过 `jsh-comp/util` 转发
- `examples/` 升级为独立 workspace 包，构建产物仍输出至 `dist-playground/`
- GitHub Actions 升级 checkout / setup-node / pnpm 至 v4，修复依赖安装顺序并启用 `frozen-lockfile`
- 仓库迁移至 `shaohui-jin.github.io`，演示站部署路径从 `/my-comp` 调整为根路径 `/`

#### 项目规范

- `project-conventions.mdc` 同步 monorepo 目录结构、路径引用与 npm 导出规范
- `doc/组件规则流程图.md` 同步包路径节点

## v0.9.0（2026-06-02 ~ 2026-06-05）

### 组件模块

#### 新增组件

- **SplitPane**：可拖拽调整比例的左右分割面板
- **DragSortList**：HTML5 拖拽排序列表
- **FloatingToolbar**：多选后底部浮动批量操作栏
- **TreeTransfer**：树形结构左右穿梭选择
- **StepWizard**：分步表单向导
- **ContextMenu**：右键上下文菜单
- **CanvasCountUp**：Canvas 数字滚动动画
- **HeatmapCalendar**：热力日历
- **ImageLightbox**：缩略图 + 全屏灯箱预览

#### 组件调整

- **CanvasTime**：迁移至 `interaction/`
- **TextEraseArea / TextOverflowArea**：移除组件及 Demo

### 工程化

#### Demo 站

- 新增 9 个交互组件独立 Demo 文档页，侧边栏按功能分类分组
- 移除「交互演示」聚合 Tab，交互组件统一纳入组件文档
- `demoCodes.ts` 全部条目补齐 script 数据定义与 template 完整示例
- `apiTypeHints.ts` 注册交互组件 opaque 类型

#### 项目规范

- **组件三分目录**：`basic/` / `crud/` / `interaction/`，新增组件前须确认分类
- **组件一站式创建规范**：合并进 `project-conventions.mdc`；新增 `doc/组件规则流程图.md`
- **demoCodes.ts** 须含 script 数据定义 + template 完整示例；opaque 类型须注册 `apiTypeHints.ts`

## v0.8.0（2026-05-27 ~ 2026-05-29）

### 组件模块

#### 新增组件

- **BaseCrud**：搜索栏、表格、列设置、高级筛选联动页骨架
- **CodeBlock**：代码展示 + 一键复制，支持 CSS 变量主题化
- **WidgetTabs**：预览/代码 Tab 切换容器，内置 CodeBlock
- **Image3D**：3D 透视图片
- **ImageCarousel**：图片轮播
- **ImagePointer**：图片指针切换
- **TextEraseArea**：文本擦除效果
- **TextOverflowArea**：文本溢出折叠
- **CanvasTime**：Canvas 粒子时钟

#### 组件调整

- **BaseSearchField**：独立搜索字段组件，供 BaseSearch 系列复用
- **BaseSearch**：容器查询响应式布局；空字符串字段自动移出 v-model
- **BaseTable**：新增 editColumn 列类型；表格 surface 配色对齐 Element Plus 原生表格
- **BaseColumnSetting / BaseCrud**：列设置入口改为表格最右 editColumn 列
- **ApiTable**：类型列颜色跟随主题主色；类型提示问号居中与尺寸统一
- **Tag**（原 StatusTag）/ **Dot**（原 StatusDot）：移除 Status 前缀，通用化命名

### 配置模块

#### 配置调整

- **default 主题**：主色 / 功能色 / 圆角对齐 Element Plus 默认风格；表格表头背景、文字色派生自 bgPage / textSecondary
- **light 预设**：使用原 default 的飞书蓝配色方案
- **Element Plus 国际化**：默认中文语言包；ConfigProvider 包裹 ElConfigProvider
- **主题注入**：saveConfig 同步 Element Plus `--el-*` CSS 变量

### 工程化

#### npm 包构建

- 新增 `vite.lib.config.ts` 多入口构建配置
- 组件从主入口 `comp-vue-lib` 导出，工具从 `comp-vue-lib/util` 子路径导出
- `package.json` 配置 `exports` 子路径映射，支持 tree-shaking

#### 目录重构

- `src/components/` → `src/component/`；`src/styles/` → `src/style/`
- 新增 `src/type/` 集中类型声明；新增 `src/util/` 工具函数模块
- 配置 `@/` 路径别名，消除多层相对路径

#### Demo 站

- 演示站菜单适配：平板 / 移动端底部 Tab 栏 + 组件列表浮层
- 新增「工具函数」顶级 Tab，按类别分组展示用法、签名、类型实现
- 统一代码复制功能，组件文档和工具文档共用 CodeBlock

#### 项目规范

- 新增「组件复用原则」「Demo 文档规范」「npm 包导出规范」

## v0.7.0（2026-05-23）

### 组件模块

#### 新增组件

- **ConfigProvider**：主题覆盖组件，支持嵌套

#### 组件调整

- **BaseTable**：集成 `useLibConfig` 读取全局/局部配置
- **StatusDot**：默认颜色改用全局变量
- **BaseColumnSetting / BaseSearch / BaseSearchDrawer / BaseTableElement / BaseTableSkiaWasm**：硬编码颜色替换为全局变量

### 配置模块

#### 新增配置

- **配置注入系统**：`createCompLib()` 工厂函数，初始化时固化配置
- **localStorage 持久化**：`saveConfig()` 保存配置并同步更新内存和 CSS 变量
- **useLibConfig**：组件内消费配置的 composable
- **配置系统 Demo**：预设主题切换、手动保存、移动端适配

#### 配置调整

- **SCSS 变量**：重构为 CSS 变量消费模式，支持运行时动态覆盖
- **Demo 站样式继承**：全面使用 `--comp-*` CSS 变量，侧边栏等全局元素跟随主题
- **构建输出**：Demo 站构建产物移至根目录 `dist-playground`
- **侧边栏菜单**：新增「配置系统」分组

### 工程化

- **命名规范**：新增文件命名语义化规则
- **文件重命名**：`blank.yml` → `deploy-pages.yml`；`tokens.ts` → `colorDefaults.ts`
- **Token → Config 统一**：对外接口 `token` 命名统一替换为 `config`
- **业务型配置移除**：`LibTableConfig` 仅保留布局字段，颜色从 theme 派生
- **Cursor IDE 配置**：新增 `.vscode/settings.json`，保存自动格式化 + Lint 修复
- **Stylelint 修复**：允许 Vue 伪类 `:deep` / `:slotted` / `:global`
- **CHANGELOG 精简**：条目只记录功能变更，去掉实现细节
- **Git 提交规范**：新增提交信息格式约定

## v0.6.0（2026-05-21）

### 组件模块

#### 新增组件

- **ApiTable**：通用 API 文档表格组件，三端适配

#### 组件调整

- **ChangelogPanel**：增强视觉层级，操作类型添加彩色圆点标识
- **BaseTable 文档页**：type 扩展字段合并为 Tabs 切换展示
- **演示站**：移除 HelloButton、SearchBar、TextLink、EmptyPlaceholder 四个 Demo 页面

### 配置模块

#### 配置调整

- **演示站布局**：重构为 flex tree 布局，隐藏滚动条
- **侧边栏菜单**：修复移动端文本省略号问题
- **API 文档块**：增强 box-shadow 立体感
- **Header 对齐**：右侧 padding 与内容区对齐
- **body 间距**：移除浏览器默认 body margin

#### 新增配置

- **Cursor 规则**：新增「架构文档维护」章节
- **架构设计文档**：新增 `doc/架构设计.md`

## v0.5.0（2026-05-15）

### 组件模块

#### 新增组件

- **BaseSearch**：配置式搜索表单，支持固定字段与可展开字段、异步选项加载
- **BaseSearchDrawer**：侧边抽屉式高级搜索表单，移动端全屏适配
- **BaseColumnSetting**：表格列配置面板，支持拖拽排序、显隐切换、冻结列设置

#### 组件调整

- **ChangelogPanel**：滚动锁定扩展到平板端，修复触屏设备背景滚动穿透

### 配置模块

#### 配置调整

- **演示站导航**：BaseTable 移入「CRUD 组件」子菜单；侧边栏超出文本省略号处理

## v0.4.0（2026-05-10）

### 组件模块

#### 组件调整

- **BaseTable**：统一五种模式列宽计算；Canvas 系 checkbox 样式对齐 Element Plus；新增 hover 交互

#### 新增组件

- **ChangelogPanel**：变更记录时间线面板，支持版本折叠展开、三端适配

### 配置模块

#### 新增配置

- **Cursor 规则**：新增项目约定规则文件

### 工程化

- **CHANGELOG.md**：基于 git 提交记录生成版本变更文件

---

## v0.3.0（2026-05-03 ~ 2026-05-05）

### 架构重构 & 多端适配

- **组件与样式抽离**：Demo 页拆分为独立组件，抽离公共样式变量和类型声明
- **新增组件**：StatusDot、CellSwitch、CellStatusCustom、TableSlotPopup
- **三端 UI 适配**：Demo 页适配桌面端、平板端、移动端布局
- **移动端 Canvas 触摸滚动**：三种 Canvas 模式支持触摸滑动与惯性
- **show-overflow-tooltip 优化**：超长文本省略 tooltip 逻辑调整，支持列级控制
- **CanvasKit 构建修复**：修复 Skia WASM 资源定位与字体加载异常
- **打包配置更新**：CI 工作流与 Vite 构建配置调整

---

## v0.2.0（2026-04-24）

### BaseTable 多模式第三版

- **Canvas 滚动体验优化**：改进滚轮滚动，新增自定义滚动条
- **超出宽度省略**：Canvas 系模式支持文本截断省略与悬停提示
- **Skia 模式增强**：checkbox、switch、status-custom 绘制全量对齐
- **Demo 案例优化**：丰富演示页面，新增 API 文档表格
- **CLAUDE.md 编码准则**：新增 LLM 编码行为准则文件
- **CI 与构建**：新增 GitHub Actions 工作流，修复构建异常

---

## v0.1.0（2026-04-16）

### 项目初始化 & BaseTable 多模式

- **项目脚手架**：Vue 3 + TypeScript + Vite 组件库
- **BaseTable 五种渲染模式**：element / virtual / canvas / canvas-tile / skia-wasm
- **统一主题系统**：CSS 变量实现五种模式视觉统一
- **列类型支持**：switch、tableSlot、status-custom、image、index、selection
- **基础组件**：HelloButton、SearchBar、StatusTag、TextLink、EmptyPlaceholder
- **构建配置**：Vite 库模式打包，ESM / CJS 双格式输出
