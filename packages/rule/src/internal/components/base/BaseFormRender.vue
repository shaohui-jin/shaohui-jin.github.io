<template>
  <el-form
    :label-width="formJson.formConfig?.labelWidth || '70px'"
    :label-position="(formJson.formConfig?.labelPosition || 'right') as 'left' | 'right' | 'top'"
    class="simple-form-renderer"
    ref="formRef"
    @submit.prevent
  >
    <el-form-item
      v-for="(field, index) in fields"
      :key="field.id + index"
      :prop="field.id"
      :rules="field.rules"
    >
      <!-- 自定义标签插槽 -->
      <template #label>
        <el-tooltip :disabled="!field.attributes.paramTypeRecord" placement="top">
          <template #content>
            {{ field.attributes.paramTypeRecord }}
          </template>
          <div class="param-label-col">
            <span class="param-label">{{ field.label }}</span>
            <span class="param-type-under">({{ field.attributes.paramType }})</span>
          </div>
        </el-tooltip>
      </template>

      <div class="form-field-container">
        <div class="main-control">
          <!-- 手动输入模式 -->
          <template v-if="inputMode === 'manual'">
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
            >
              <el-option
                v-for="(opt, index) in field.options"
                :key="index"
                :label="opt[field.props.label] || opt.label"
                :value="opt[field.props.value] || opt.value"
              >
                <el-tooltip
                  v-if="opt.desc"
                  :content="opt.desc"
                  :disabled="!opt.desc"
                  placement="top"
                  :show-after="500"
                  popper-class="field-desc-tooltip"
                  :popper-style="{
                    maxWidth: '300px',
                    wordWrap: 'break-word',
                    wordBreak: 'break-all'
                  }"
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
                </el-tooltip>
              </el-option>
            </el-select>
            <component
              v-else
              :is="getComponent(field.type)"
              v-model="formData[field.id]"
              :placeholder="field.placeholder"
              :disabled="field.disabled"
              :type="
                ['textarea', 'function'].includes(field.type)
                  ? 'textarea'
                  : field.attributes?.inputType || 'text'
              "
            />
          </template>
          <!-- 节点选择模式 -->
          <template v-else>
            <el-select v-model="formData[field.id]" placeholder="请选择节点" filterable clearable>
              <el-option
                v-for="opt in nodeOptions || []"
                :key="opt.value"
                :label="opt.label"
                :value="opt.value"
              />
            </el-select>
          </template>
          <el-tooltip placement="top" :content="field.attributes?.desc">
            <div class="field-attributes-desc" v-if="field.attributes?.desc">
              {{ field.attributes.desc }}
            </div>
          </el-tooltip>
        </div>
        <!-- 模式切换按钮 -->
        <el-button
          class="mode-toggle-btn"
          :disabled="!field.attributes.paramTypeRecord || inputMode === 'node'"
          @click="$emit('mode-change')"
          title="数据类型切换"
        >
          >
          <el-icon><SwitchIcon /></el-icon>
        </el-button>
      </div>
    </el-form-item>
    <div v-if="fields.length === 0" class="form-desc">-</div>
  </el-form>
</template>

<script lang="ts" setup>
import { ref, watch, computed, onMounted, reactive } from 'vue'
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
import { type PropType } from 'vue'
import { Switch as SwitchIcon } from '@element-plus/icons-vue'
import { FromConfig, DEFAULT_FORM_CONFIG } from '@/utils/parser/FormParser'
import { WorkflowData } from '@/types/workflow'

const props = defineProps({
  formJson: {
    type: Object as PropType<FromConfig>,
    default: DEFAULT_FORM_CONFIG
  },
  inputMode: {
    type: String,
    default: 'input'
  },
  nodeOptions: {
    type: Array as PropType<Array<{ label: string; value: string }>>,
    default: () => []
  },
  nodeData: {
    type: Object
  },
  workflowData: {
    type: Object
  }
})

const emit = defineEmits(['update:modelValue', 'change', 'mode-change'])

// 表单引用
const formRef = ref()

// 表单数据 - 使用 reactive 确保深度响应式
let formData = reactive({})

// 组件映射表
const componentMap = {
  input: ElInput,
  select: ElSelect,
  switch: ElSwitch,
  inputNumber: ElInputNumber,
  textarea: ElInput // textarea 也用 ElInput
}

// 获取组件
const getComponent = type => {
  return componentMap[type] || ElInput
}

type FormFieldItem = {
  id: string
  type: string
  label: string
  placeholder?: string
  disabled?: boolean
  defaultValue?: unknown
  attributes: Record<string, any>
  options: any[]
  props: Record<string, string>
  rules?: any
}

const paramList = ref<unknown[]>([])

// 处理字段配置
const fields = ref<FormFieldItem[]>([])

watch(
  () => props.formJson.compList,
  compList => {
    // 初始化或更新 formData
    compList.forEach(comp => {
      if (!(comp.id in formData)) {
        // 只在不存在时才初始化，避免覆盖已有值
        formData[comp.id] = comp.attributes.value
      }
    })

    fields.value = compList.map((comp, index) => {
      const rawOptions = comp.attributes.options || []
      const rawProps = comp.attributes.props || {}
      return {
        id: comp.id,
        type: comp.attributes.compType,
        label: comp.attributes.label,
        placeholder: comp.attributes?.placeholder,
        disabled: comp.attributes?.disabled,
        defaultValue: comp.attributes.value,
        attributes: comp.attributes || {},
        options: (Array.isArray(rawOptions) ? rawOptions : []) as any[],
        props: (typeof rawProps === 'object' && !Array.isArray(rawProps) ? rawProps : {}) as Record<string, any>
      }
    })
  },
  {
    deep: true,
    once: true
  }
)

// 暴露方法 - 兼容原有 FormRenderer 的 API
defineExpose({
  // 获取表单数据
  getFormData: async () => {
    // eslint-disable-next-line no-useless-catch
    try {
      await formRef.value?.validate()
      return formData
    } catch (error) {
      throw error
    }
  },
  // 设置表单数据
  setFormData: data => {
    formData = data
  },
  // 重置表单
  resetForm: () => {
    formData = {}
    formRef.value?.resetFields()
  },
  // 设置表单配置 - 兼容原有 API
  setFormJson: json => {
    // 这里可以处理表单配置的更新
    console.log('setFormJson called with:', json)
  }
})
</script>

<style lang="scss" scoped>
.simple-form-renderer {
  padding: 0;

  :deep(.el-form-item) {
    margin-bottom: 18px;
    display: flex;
    align-items: flex-start;
  }

  /* 调整表单项布局 */
  :deep(.el-form-item__label) {
    padding: 0;
    height: auto;
    line-height: 1.2;
    text-align: right;
    flex-shrink: 0;
    position: relative; /* 添加相对定位 */
  }

  /* 移除 element-plus 的默认 margin */
  :deep(.el-form-item__content) {
    margin-left: 0 !important;
    padding-left: 12px; /* 固定的左边距 */
    flex: 1;
    min-width: 0;
    display: flex;
    justify-content: flex-start;
    position: relative; /* 添加相对定位 */
  }

  /* 保持 ElementPlus 原有的 hover 交互，不覆盖默认行为 */

  /* 确保所有输入控件宽度一致 */
  :deep(.el-input),
  :deep(.el-select),
  :deep(.el-input-number) {
    width: 100%;
  }

  /* 修复 element-plus 的一些默认样式 */
  :deep(.el-form-item__label-wrap) {
    width: 100%;
  }

  :deep(.el-form-item__label::before),
  :deep(.el-form-item__label::after) {
    display: none !important;
  }

  :deep(.el-select) {
    width: 100% !important;
    min-width: 100px;
    max-width: 100%;
    flex-shrink: 0;
  }

  :deep(.el-select__tags) {
    width: 100% !important;
    max-width: 100% !important;
    min-width: 0 !important;
    flex-wrap: wrap;
    overflow: hidden;
  }

  :deep(.el-select__input) {
    width: 100% !important;
    min-width: 0 !important;
  }
}

.form-field-container {
  flex: 1;
  min-width: 0;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 8px;

  /* 响应式间距调整 */
  @media (max-width: 640px) {
    gap: 6px;
  }
}

.main-control {
  flex: 1;
  min-width: 0;
}

.mode-toggle-btn {
  @apply text-theme-medium hover:text-theme-dark hover:bg-theme-lightest;
  margin-top: 2px;
  flex-shrink: 0;
  height: 30px;
  padding: 6px;
  width: 30px;
  transition: all 0.2s ease;
}

/* 默认标签样式 */
.default-label {
  @apply text-theme-dark;
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
  gap: 2px;
  padding: 4px 0;
  width: 100%; /* 确保宽度撑满 */
  min-width: 0; /* 允许内容收缩 */

  /* 鼠标悬停时的交互效果 */
  &:hover .param-label {
    @apply text-theme-medium;
  }

  &:hover .param-type-under {
    @apply text-theme-light;
    opacity: 1;
  }
}

.param-label {
  @apply text-theme-dark;
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
  @apply text-theme-medium;
  font-size: 11px;
  text-align: right;
  width: 100%; /* 确保宽度撑满 */
  user-select: none;
  line-height: 1;
  opacity: 0.8;
}

/* 字段描述文案样式 */
.field-attributes-desc {
  @apply text-theme-medium;
  font-size: 12px;
  margin-top: 4px;
  line-height: 1.4;
  white-space: normal;
  word-break: break-word;
  overflow-wrap: break-word;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
  opacity: 0.85;
}

/* 全局tooltip样式覆盖 */
.field-desc-tooltip {
  max-width: 300px !important;
}

.field-desc-tooltip .el-tooltip__content {
  max-width: 300px !important;
  word-wrap: break-word !important;
  word-break: break-all !important;
  white-space: pre-wrap !important;
  line-height: 1.4 !important;
}
</style>
