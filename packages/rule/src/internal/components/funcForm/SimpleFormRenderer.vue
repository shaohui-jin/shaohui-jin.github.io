<template>
  <el-form
    :model="formData"
    :label-width="labelWidth"
    class="simple-form-renderer"
    ref="formRef"
    @submit.prevent
  >
    <el-form-item v-for="(field, index) in fields" :key="field.id" :prop="field.id">
      <!-- 自定义标签插槽 -->
      <template #label>
        <el-tooltip
          :disabled="!field.attributes?.paramSubType"
          :content="field.attributes.paramSubType"
          placement="top"
        >
          <div class="param-label-col">
            <span class="param-label">{{ field.label }}</span>
            <span class="param-type-under">({{ field.attributes?.paramType }})</span>
          </div>
        </el-tooltip>
      </template>

      <div class="form-field-container">
        <div class="main-control">
          <!-- 节点选择模式 -->
          <template v-if="field.sourceType === 'node'">
            <el-select
              v-model="formData[field.id]"
              placeholder="请选择节点"
              filterable
              clearable
              @change="handleFieldChange(field.id, $event)"
            >
              <el-option
                v-for="opt in nodeOptions || []"
                :key="opt.value"
                :label="opt.label"
                :value="opt.value"
              />
            </el-select>
          </template>
          <!-- 手动输入模式 -->
          <template v-else>
            <!-- select 类型特殊处理，自动渲染下拉选项 -->
            <el-select
              v-if="field.type === 'select'"
              v-model="formData[field.id]"
              :placeholder="field.placeholder"
              :disabled="field.disabled"
              filterable
              clearable
              allow-create
              default-first-option
              :multiple="field.attributes.multiple"
              @change="handleFieldChange(field.id, $event)"
            >
              <el-option
                v-for="opt in field.attributes.defaultOptions ? field.options : field.options || []"
                :key="opt.value"
                :label="opt.label"
                :value="opt.value"
              >
                <div>
                  <span style="float: left">
                    {{ opt.name }}
                    <span>{{ opt.label }}</span>
                  </span>
                  <span style="float: right">
                    {{ opt.type }}
                  </span>
                </div>
              </el-option>
            </el-select>
            <!-- 其他类型 -->
            <component
              v-else
              :is="getComponent(field.type)"
              v-model="formData[field.id]"
              v-bind="field.attributes"
              :placeholder="field.placeholder"
              :disabled="field.disabled"
              :type="
                ['textarea', 'function'].includes(field.type)
                  ? 'textarea'
                  : field.attributes?.inputType || 'text'
              "
              :nodeData="nodeData"
              @change="handleFieldChange(field.id, $event)"
            />
          </template>
          <el-tooltip
            v-if="field.attributes?.desc"
            :content="field.attributes.desc"
            placement="top"
            :show-after="500"
            popper-class="field-desc-tooltip"
            :popper-style="{ maxWidth: '300px', wordWrap: 'break-word', wordBreak: 'break-all' }"
          >
            <div class="field-attributes-desc">
              {{ field.attributes.desc }}
            </div>
          </el-tooltip>
        </div>
        <!-- 模式切换按钮 -->
        <el-button class="mode-toggle-btn" @click="$emit('mode-change')" title="数据类型切换">
          <el-icon><SwitchIcon /></el-icon>
        </el-button>
      </div>
    </el-form-item>
    <div v-if="fields.length === 0" class="form-desc">-</div>
  </el-form>
</template>

<script setup lang="ts">
import { ref, watch, computed, inject, type PropType } from 'vue'
import {
  ElForm,
  ElFormItem,
  ElInput,
  ElSelect,
  ElSwitch,
  ElInputNumber,
  ElOption,
  ElButton,
  ElIcon,
  ElTooltip
} from 'element-plus'
import { Switch as SwitchIcon } from '@element-plus/icons-vue'
import { Attributes, InputData, LogicType } from '@/types/workflow'
import { getAllAvailableOptionsKey } from '@/injectKeys'

const getAllAvailableOptions = inject(getAllAvailableOptionsKey)
const props = defineProps({
  data: {
    type: Array<InputData>,
    required: true
  },
  labelWidth: {
    type: String,
    default: '70px'
  },
  nodeOptions: {
    type: Array as PropType<Array<{ label: string; value: string; name?: string; type?: string }>>,
    default: () => []
  },
  nodeData: {
    type: Object
  },
})

const emit = defineEmits(['update:modelValue', 'change', 'mode-change'])

// 表单引用
const formRef = ref()

// 表单数据
const formData = ref({})

// 组件映射表
const componentMap = {
  input: ElInput,
  select: ElSelect,
  switch: ElSwitch,
  inputNumber: ElInputNumber,
  textarea: ElInput, // textarea 也用 ElInput
}

// 获取组件
const getComponent = type => {
  return componentMap[type] || ElInput
}

type FieldItem = {
  id: string
  type: string
  attributes: Attributes
  label: string
  placeholder: string
  disabled: boolean
  defaultValue: string
  sourceType?: string
  options?: Array<{ label: string; value: string; desc?: string; name?: string; type?: string }>
}

const fields = ref<FieldItem[]>([])
watch(
  () => props.data,
  val => {
    if (!val || val.length === 0) {
      formData.value = {}
      return
    }
    fields.value = val.map((e, i) => {
      const item = {} as FieldItem
      item.id = `${e.paramName}_${i}`
      item.type = e.widgetType ?? 'input'
      item.attributes = {
        paramType: 'string',
        inputType: 'text',
        label: e.paramName,
        ...e.attributes,
        placeholder: `请输入值`
      }
      item.label = item.attributes?.label || e.paramName
      item.placeholder = item.attributes?.placeholder
      item.disabled = item.attributes?.disabled
      // item.parentSource = val.source
      // item.sourceType = val.sourceType
      item.defaultValue = e.sourceType === 'node' && !e.source
            ? ''
            : e.source || e.defaultValue
      item.options = (
        props.nodeData.funcType === 'logic' &&
        props.nodeData.logicData?.logicType === LogicType.GLOBAL_VARIABLE
          ? getAllAvailableOptions(e)
          : e.options
      )?.map(e => ({ ...e, type: item.attributes.paramType }))

      if (
        formData.value[item.id] === undefined &&
        item.defaultValue !== undefined &&
        item.defaultValue !== null &&
        item.defaultValue !== ''
      ) {
        formData.value[item.id] = item.defaultValue
      }
      return item
    })
  },
  {
    immediate: true,
    deep: true
  }
)

// 处理字段变化
const handleFieldChange = (fieldId, value) => {
  emit('change', { fieldId, value, formData: formData.value })
}

// 监听数据变化
watch(
  formData,
  newData => {
    for (const key in newData) {
      // console.log('newData[key]==',JSON.parse(JSON.stringify(newData[key])), JSON.parse(JSON.stringify(formData.value)))
      if (!newData[key]) return // 20250827修改输入框无法清除值问题bug245362
      // console.log("=====formDaga====")
      emit('change', { fieldId: key, value: newData[key], formData: formData.value })
    }
  },
  { deep: true }
)

// 暴露方法 - 兼容原有 FormRenderer 的 API
defineExpose({
  // 获取表单数据
  getFormData: async () => {
    // eslint-disable-next-line no-useless-catch
    try {
      await formRef.value?.validate()
      return formData.value
    } catch (error) {
      throw error
    }
  },
  // 设置表单数据
  setFormData: data => {
    formData.value = { ...data }
  },
  // 重置表单
  resetForm: () => {
    formData.value = {}
    formRef.value?.resetFields()
  },
  // 设置表单配置 - 兼容原有 API
  setFormJson: json => {
    // 这里可以处理表单配置的更新
    console.log('setFormJson called with:', json)
  }
})
</script>

<style scoped>
.simple-form-renderer {
  padding: 0;
}

.simple-form-renderer :deep(.el-form-item) {
  margin-bottom: 18px;
  display: flex;
  align-items: flex-start;
}

/* 调整表单项布局 */
.simple-form-renderer :deep(.el-form-item__label) {
  padding: 0;
  height: auto;
  line-height: 1.2;
  text-align: right;
  flex-shrink: 0;
  position: relative; /* 添加相对定位 */
}

/* 移除 element-plus 的默认 margin */
.simple-form-renderer :deep(.el-form-item__content) {
  margin-left: 0 !important;
  padding-left: 12px; /* 固定的左边距 */
  flex: 1;
  min-width: 0;
  display: flex;
  justify-content: flex-start;
  position: relative; /* 添加相对定位 */
}

.form-field-container {
  flex: 1;
  min-width: 0;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 8px;
}

.main-control {
  flex: 1;
  min-width: 0;
}

.mode-toggle-btn {
  margin-top: 2px;
  flex-shrink: 0;
  height: 30px;
  padding: 6px;
  width: 30px;
}

/* 默认标签样式 */
.default-label {
  font-size: 14px;
  font-weight: 500;
  line-height: 32px;
  display: block;
  text-align: right;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  user-select: none;
}

/* 带类型信息的标签样式 */
.param-label-col {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  user-select: none;
  gap: 1px;
  padding: 4px 0;
  width: 100%; /* 确保宽度撑满 */
  min-width: 0; /* 允许内容收缩 */
}

.param-label {
  color: #333;
  font-size: 13px;
  font-weight: 500;
  text-align: right;
  width: 100%; /* 确保宽度撑满 */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  user-select: none;
  line-height: 1.2;
}

.param-type-under {
  color: #aaa;
  font-size: 11px;
  text-align: right;
  width: 100%; /* 确保宽度撑满 */
  user-select: none;
  line-height: 1;
}

/* 字段描述文案样式 */
.field-attributes-desc {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
  line-height: 1.4;
  word-break: break-all;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
}

/* 确保所有输入控件宽度一致 */
.simple-form-renderer :deep(.el-input),
.simple-form-renderer :deep(.el-select),
.simple-form-renderer :deep(.el-input-number) {
  width: 100%;
}

/* 修复 element-plus 的一些默认样式 */
.simple-form-renderer :deep(.el-form-item__label-wrap) {
  width: 100%;
}

.simple-form-renderer :deep(.el-form-item__label::before),
.simple-form-renderer :deep(.el-form-item__label::after) {
  display: none !important;
}

.simple-form-renderer :deep(.el-select) {
  width: 100% !important;
  min-width: 100px;
  max-width: 100%;
  flex-shrink: 0;
}

.simple-form-renderer :deep(.el-select__tags) {
  width: 100% !important;
  max-width: 100% !important;
  min-width: 0 !important;
  flex-wrap: wrap;
  overflow: hidden;
}

.simple-form-renderer :deep(.el-select__input) {
  width: 100% !important;
  min-width: 0 !important;
}

/* 全局tooltip样式覆盖 */
:global(.field-desc-tooltip) {
  max-width: 300px !important;
}

:global(.field-desc-tooltip .el-tooltip__content) {
  max-width: 300px !important;
  word-wrap: break-word !important;
  word-break: break-all !important;
  white-space: pre-wrap !important;
  line-height: 1.4 !important;
}
</style>
