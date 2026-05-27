# 版本变更记录

## v0.8.0（2026-05-27）

### 组件模块

#### 新增组件

- **BaseCrud**：搜索栏、表格、列设置、高级筛选联动页骨架

#### 组件调整

- **BaseSearchField**：独立搜索字段组件，供 BaseSearch 系列复用
- **BaseSearch**：容器查询响应式布局；空字符串字段自动移出 v-model
- **BaseTable**：新增 editColumn 列类型，表头 Setting 图标打开列设置
- **BaseColumnSetting / BaseCrud**：列设置入口改为表格最右 editColumn 列
- **ApiTable**：类型列颜色跟随主题主色；类型提示问号居中与尺寸统一

### 配置模块

#### 配置调整

- **default 主题**：表格 surface 文字/背景/边框色与 light 预设对齐
- **Element Plus 国际化**：默认中文语言包；ConfigProvider 包裹 ElConfigProvider
- **主题注入**：saveConfig 同步 Element Plus `--el-*` CSS 变量

### 工程化

- **DemoWidgetTabs**：演示区预览/代码 Tab（border-card）、highlight.js 高亮、复制按钮
- **Demo 规范**：特殊说明、最近事件 footer、代码 Tab 约定写入 Cursor 规则
- **组件目录**：StatusTag / StatusDot 归入 basic；移除无 Demo 的历史组件

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
