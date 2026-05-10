# 版本变更记录

## v0.4.0（2026-05-10）

### 组件模块

#### 组件调整
- **BaseTable**：Virtual 模式补全 border 边框；统一五种模式列宽计算对齐 Element Plus；Canvas 系三种模式 checkbox 样式对齐 Element Plus；新增 `useCanvasCheckboxHover` 组合式支持 hover 交互

#### 新增组件
- **ChangelogPanel**：读取 CHANGELOG.md 解析为时间线面板，集成在顶部栏右侧，支持版本折叠展开、点击外部关闭、三端适配、移动端滚动穿透锁定

### 配置模块

#### 新增配置
- **Cursor 规则**：新增 `.cursor/rules/project-conventions.mdc`，统一语言、代码风格、三端适配、CHANGELOG 维护等项目约定

### 工程化

- **CHANGELOG.md**：基于 git 提交记录生成版本变更文件，按天归组，连续日期合并为同一版本

---

## v0.3.0（2026-05-03 ~ 2026-05-05）

### 架构重构 & 多端适配

- **组件与样式抽离**：将 Demo 页拆分为独立组件（DemoBaseTable、DemoSearchBar、DemoStatusDot 等），抽离公共样式变量、Element 覆盖样式、类型声明，提升可维护性
- **新增组件**：StatusDot 状态圆点组件、CellSwitch / CellStatusCustom / TableSlotPopup 单元格子组件独立封装
- **三端 UI 适配**：Demo 页适配桌面端、平板端、移动端布局
- **移动端 Canvas 触摸滚动**：Canvas / Canvas-Tile / Skia 三种模式支持触摸滑动，包括惯性与方向判断
- **show-overflow-tooltip 优化**：Element / Virtual / Skia 模式的超长文本省略 tooltip 逻辑调整，支持列级控制
- **CanvasKit 构建修复**：调整 Skia WASM 资源定位与字体加载逻辑，修复 Vite 构建环境下的异常
- **打包配置更新**：CI 工作流与 Vite 构建配置调整

---

## v0.2.0（2026-04-24）

### BaseTable 多模式第三版

- **Canvas 滚动体验优化**：改进滚轮滚动、Shift+滚轮横向滚动，新增自定义滚动条（`useCanvasScrollbar`）
- **超出宽度省略**：Canvas 系模式支持文本截断省略，新增 `useCanvasTooltip` 悬停显示完整内容
- **Skia 模式增强**：checkbox 勾选/半选绘制、switch 开关绘制、status-custom 状态灯绘制等全量对齐
- **Demo 案例优化**：丰富演示页面，新增 API 文档表格
- **CLAUDE.md 编码准则**：新增 LLM 编码行为准则文件
- **CI 与构建**：新增 GitHub Actions 工作流、移除 lock 文件、修复构建异常

---

## v0.1.0（2026-04-16）

### 项目初始化 & BaseTable 多模式

- **项目脚手架**：基于 Vue 3 + TypeScript + Vite 搭建组件库，配置 ESLint / Prettier / Stylelint / EditorConfig
- **BaseTable 五种渲染模式**：
  - `element`：Element Plus el-table 封装，能力最全
  - `virtual`：el-table-v2 虚拟滚动，适合万级行
  - `canvas`：Canvas 2D 视口重绘，适合超大数据
  - `canvas-tile`：Canvas 整表预渲染 + 视口裁切
  - `skia-wasm`：CanvasKit（Skia WASM）GPU 加速渲染
- **统一主题系统**：`tableSurfaceTokens` + CSS 变量实现五种模式视觉统一
- **列类型支持**：switch 开关、tableSlot 弹窗子表格、status-custom 状态灯、image 图片预览、index 序号、selection 多选
- **基础组件**：HelloButton、SearchBar、StatusTag、TextLink、EmptyPlaceholder
- **构建配置**：Vite 库模式打包，支持 ESM / CJS 双格式输出
