---
title: 交互预览
groupTitle: 交互预览
order: 240
---

# 交互预览

9 个高交互组件的概念验证。参数与对应组件页一致。

## SplitPane

拖拽调整左右比例，双击还原。

::: comp-preview i-split-pane

```vue
<template>
  <SplitPane v-model:ratio="0.5" />
</template>
```

:::

### Props

| 名称                  | 类型     | 默认值 | 必填 | 说明                |
| --------------------- | -------- | ------ | ---- | ------------------- |
| ratio / v-model:ratio | `number` | `0.5`  | 否   | 左侧面板占比（0~1） |
| minRatio              | `number` | `0.2`  | 否   | 最小占比            |
| maxRatio              | `number` | `0.8`  | 否   | 最大占比            |

### Events

| 名称         | 参数              | 说明                     |
| ------------ | ----------------- | ------------------------ |
| update:ratio | `(ratio: number)` | v-model:ratio 更新       |
| change       | `(ratio: number)` | 拖拽或双击还原后比例变化 |

## DragSortList

HTML5 拖拽调整列表顺序。

::: comp-preview i-drag-sort

```vue
<template>
  <DragSortList v-model="items" />
</template>
```

:::

### Props

| 名称                 | 类型             | 默认值 | 必填 | 说明               |
| -------------------- | ---------------- | ------ | ---- | ------------------ |
| modelValue / v-model | `DragSortItem[]` | —      | 是   | 可拖拽排序的列表项 |

### Events

| 名称              | 参数                      | 说明               |
| ----------------- | ------------------------- | ------------------ |
| update:modelValue | `(items: DragSortItem[])` | v-model 更新       |
| change            | `(items: DragSortItem[])` | 排序完成后列表变化 |

## FloatingToolbar

多选后底部浮出批量操作。

::: comp-preview i-float-toolbar

```vue
<template>
  <FloatingToolbar :count="selected" @action="handle" />
</template>
```

:::

### Props

| 名称  | 类型     | 默认值 | 必填 | 说明                          |
| ----- | -------- | ------ | ---- | ----------------------------- |
| count | `number` | —      | 是   | 选中数量，大于 0 时显示工具栏 |

### Events

| 名称   | 参数               | 说明                 |
| ------ | ------------------ | -------------------- |
| action | `(action: string)` | 点击工具栏按钮时触发 |

## TreeTransfer

树形权限左右穿梭。

::: comp-preview i-tree-transfer

```vue
<template>
  <TreeTransfer v-model="checkedKeys" :data="tree" />
</template>
```

:::

### Props

| 名称                 | 类型                 | 默认值 | 必填 | 说明             |
| -------------------- | -------------------- | ------ | ---- | ---------------- |
| data                 | `TreeTransferNode[]` | —      | 是   | 树形数据源       |
| modelValue / v-model | `string[]`           | —      | 是   | 已选节点 id 列表 |

### Events

| 名称              | 参数              | 说明               |
| ----------------- | ----------------- | ------------------ |
| update:modelValue | `(ids: string[])` | v-model 更新       |
| change            | `(ids: string[])` | 穿梭后已选节点变化 |

## StepWizard

多步表单与校验拦截。

::: comp-preview i-step-wizard

```vue
<template>
  <StepWizard :steps="steps" @finish="submit" />
</template>
```

:::

### Props

| 名称                | 类型               | 默认值 | 必填 | 说明         |
| ------------------- | ------------------ | ------ | ---- | ------------ |
| steps               | `StepWizardStep[]` | —      | 是   | 步骤配置列表 |
| step / v-model:step | `number`           | `0`    | 否   | 当前步骤索引 |

### Events

| 名称        | 参数             | 说明              |
| ----------- | ---------------- | ----------------- |
| update:step | `(step: number)` | v-model:step 更新 |
| change      | `(step: number)` | 步骤切换          |
| finish      | —                | 最后一步点击完成  |

## ContextMenu

右键弹出操作菜单。

::: comp-preview i-context-menu

```vue
<template>
  <ContextMenu :items="menuItems" @select="onSelect" />
</template>
```

:::

### Props

| 名称  | 类型                | 默认值 | 必填 | 说明       |
| ----- | ------------------- | ------ | ---- | ---------- |
| items | `ContextMenuItem[]` | —      | 是   | 菜单项列表 |

### Events

| 名称   | 参数                      | 说明       |
| ------ | ------------------------- | ---------- |
| select | `(item: ContextMenuItem)` | 选中菜单项 |

## CountUp

数字滚动动画与趋势展示。参数与 CanvasCountUp 相同。

::: comp-preview i-count-up

```vue
<template>
  <CanvasCountUp :value="98765" :duration="2000" />
</template>
```

:::

### Props

| 名称     | 类型     | 默认值 | 必填 | 说明           |
| -------- | -------- | ------ | ---- | -------------- |
| value    | `number` | —      | 是   | 目标数值       |
| duration | `number` | `2000` | 否   | 动画时长（ms） |

### Events

| 名称   | 参数 | 说明             |
| ------ | ---- | ---------------- |
| finish | —    | 数字滚动动画完成 |

### 特殊说明

- 通过 ref 调用 restart() 重新播放动画

## HeatmapCalendar

日格悬停详情与色阶图例。

::: comp-preview i-heatmap

```vue
<template>
  <HeatmapCalendar :data="dailyCounts" />
</template>
```

:::

### Props

| 名称 | 类型            | 默认值 | 必填 | 说明                             |
| ---- | --------------- | ------ | ---- | -------------------------------- |
| data | `HeatmapCell[]` | —      | 是   | 热力图单元格数据（date + count） |

### Events

| 名称       | 参数                  | 说明       |
| ---------- | --------------------- | ---------- |
| cell-click | `(cell: HeatmapCell)` | 点击单元格 |

## LightboxGallery

全屏预览与键盘导航。参数与 ImageLightbox 相同。

::: comp-preview i-lightbox

```vue
<template>
  <ImageLightbox v-model:index="index" :urls="images" />
</template>
```

:::

### Props

| 名称                  | 类型       | 默认值 | 必填 | 说明         |
| --------------------- | ---------- | ------ | ---- | ------------ |
| urls                  | `string[]` | —      | 是   | 图片地址列表 |
| index / v-model:index | `number`   | `0`    | 否   | 当前预览索引 |

### Events

| 名称         | 参数              | 说明               |
| ------------ | ----------------- | ------------------ |
| update:index | `(index: number)` | v-model:index 更新 |
| change       | `(index: number)` | 预览索引变化       |
| open         | `(index: number)` | 打开灯箱           |
| close        | —                 | 关闭灯箱           |
