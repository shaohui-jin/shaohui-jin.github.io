/** 各 Demo 预览区对应的示例代码（供 DemoWidgetTabs 代码 Tab 展示） */
export const demoCodes = {
  baseSearch: `<BaseSearch
  v-model="formData"
  :params="searchParams"
  :loading="loading"
  @search="onSearch"
  @reset="onReset"
  @change="onChange"
/>`,

  baseSearchField: `<ElForm label-width="80px">
  <ElFormItem label="关键词">
    <BaseSearchField
      v-model="formData.searchKeyword"
      :field="keywordField"
      @change="onChange"
    />
  </ElFormItem>
  <ElFormItem label="状态">
    <BaseSearchField v-model="formData.status" :field="selectField" @change="onChange" />
  </ElFormItem>
  <ElFormItem label="日期范围">
    <BaseSearchField v-model="formData.dateRange" :field="dateField" @change="onChange" />
  </ElFormItem>
  <ElFormItem label="优先级">
    <BaseSearchField v-model="formData.priority" :field="radioField" @change="onChange" />
  </ElFormItem>
</ElForm>`,

  baseSearchDrawer: `<BaseSearchDrawer
  ref="drawerRef"
  v-model="formData"
  :params="drawerParams"
  @search="onSearch"
  @reset="onReset"
/>

<ElButton type="primary" @click="drawerRef?.open()">打开高级筛选</ElButton>`,

  baseColumnSetting: `<BaseTable
  mode="element"
  :table-data="tableData"
  :columns="tableColumns"
  height="360px"
  @edit-column="openSetting"
/>

<BaseColumnSetting ref="settingRef" v-model:columns="columns" @confirm="onConfirm" />`,

  baseCrud: `<BaseCrud
  mode="element"
  v-model:search-model="searchModel"
  v-model:columns="columns"
  :search-params="searchParams"
  :drawer-params="drawerParams"
  :table-data="tableData"
  :loading="loading"
  table-height="360px"
  @search="onSearch"
  @reset="onReset"
  @column-confirm="onColumnConfirm"
/>`,

  statusTag: `<StatusTag label="成功" type="success" />
<StatusTag label="警告" type="warning" />
<StatusTag label="信息" type="info" />
<StatusTag label="危险" type="danger" />`,

  statusDotBasic: `<StatusDot color="#67c23a" text="运行中" />
<StatusDot color="#e6a23c" text="待审核" />
<StatusDot color="#f56c6c" text="已停止" />`,

  statusDotSlot: `<StatusDot color="#409eff">
  <span style="margin-left: 6px; font-weight: 600">自定义内容</span>
</StatusDot>`,
} as const;
