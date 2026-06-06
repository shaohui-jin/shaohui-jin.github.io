import { InputAndOutput, JsDocData } from '@/utils/parser/JSDocParser'

export type SupportedType = 'input' | 'select' | 'switch' | 'inputNumber' | 'textarea' | 'function'

export type FromConfig = {
  formConfig: {
    labelWidth: string // 文案宽度
    labelPosition: string // 文案排布
    size: 'default' // 组件大小
    events: { onMounted: '' } // 事件
  }
  compList: Array<Attribute>
}

export interface Config {
  value?: string | number // 默认值
  options?: string | Array<any> // 默认数组
  props?:
    | string
    | {
        label?: string // 数组默认显示内容
        value?: string // 数组默认值
        desc?: string // 数组详情描述
      }
  compType?: SupportedType // 组件类型
}

export type FormAttribute = Config & {
  label: string // 文案
  placeholder: string
  labelWidth: string // 单独文案宽度
  disabled: boolean // 禁用状态
  cssClass: string[]
  paramType?: string // 参数类型
  paramTypeRecord?: string // 参数类型详细描述
  compType?: SupportedType // 组件类型
  min?: number
  max?: number
}

interface Attribute {
  id: string
  attributes: FormAttribute
}

// 支持的组件类型列表
export const SUPPORTED_COMPONENT_TYPES: SupportedType[] = [
  'input',
  'select',
  'switch',
  'inputNumber',
  'textarea',
  'function'
]

// 默认表单配置
export const DEFAULT_FORM_CONFIG: FromConfig = {
  formConfig: {
    labelWidth: '70px',
    labelPosition: 'right',
    size: 'default',
    events: { onMounted: '' }
  },
  compList: []
}

// 默认组价配置
const DEFAULT_COMP_ATTRIBUTE: FormAttribute = {
  value: '',
  label: '这是组件文案',
  placeholder: '这是组件未填充提示文案',
  labelWidth: '',
  disabled: false,
  cssClass: []
}

export default class FormParser {
  constructor() {}

  /**
   * 根据输入或输出rst解析生成对应的组件配置
   */
  parseJsToFormConfig(common: InputAndOutput[]): FromConfig {
    // 创建基础表单配置
    const formConfig = JSON.parse(JSON.stringify(DEFAULT_FORM_CONFIG))

    common.forEach(item => {
      const comp = this.createComponent(item, SUPPORTED_COMPONENT_TYPES)
      if (comp) {
        formConfig.compList.push(comp)
      }
    })
    console.log('common', common)
    console.log('formConfig', formConfig)
    return formConfig
  }

  createComponent(param: InputAndOutput, supportedTypes: string[]) {
    const componentType = this.getCompType(param)
    if (!supportedTypes.includes(componentType)) {
      return null
    }

    let baseAttributes: Attribute = {
      id: param.key,
      attributes: {
        ...JSON.parse(JSON.stringify(DEFAULT_COMP_ATTRIBUTE)),
        label: param.name,
        paramType: param.type,
        paramTypeRecord: ['object', 'object[]'].includes(param.type)
          ? `${JSON.stringify(param.typeRecord)}${param.type.includes('[]') ? '[]' : ''}`
          : '',
        compType: componentType,
        placeholder: param.type.endsWith('[]')
          ? `请输入${param.name || param.name}（${
              ['string', 'number'].includes(param.type.replace('[]', ''))
                ? '多个值用逗号分隔'
                : 'JSON格式'
            }）`
          : '',
        ...param.config
      }
    }
    console.log('baseAttributes', baseAttributes)
    return baseAttributes
  }

  /**
   * 根据配置获取组件类型
   * @param param
   */
  getCompType(param: InputAndOutput): SupportedType {
    console.log('getCompType', param)
    // 根据类型确定组件
    switch (param.type) {
      case 'string':
        return 'input'
      case 'number':
        return 'inputNumber'
      case 'boolean':
        return 'switch'
      case 'any':
      case 'object':
        return 'input'
      case 'function':
        return 'function'
      default:
        // 处理数组类型
        if (param.config.compType === 'select') {
          return 'select'
        }
        if (param.type.endsWith('[]')) {
          const elementType = param.type.replace('[]', '')
          // 简单类型使用input，复杂类型使用textarea
          return ['string', 'number'].includes(elementType) ? 'input' : 'textarea'
        }
        return 'input'
    }
  }
}
