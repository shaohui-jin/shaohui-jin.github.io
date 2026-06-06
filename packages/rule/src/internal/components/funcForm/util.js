/**
 * 1.将注释数组转换为JSON对象 - 修复版本
 * @param comments - 注释数组
 * @returns 返回适合FormRenderer渲染的表单配置对象
 */
export const parseCommentsToJSON = comments => {
  const result = {
    params: [],
    returns: null
  }

  comments.forEach(comment => {
    const content = comment.value.trim()

    // 处理 @param 注释
    if (content.startsWith('@param')) {
      const param = parseParamComment(content)
      if (param) {
        result.params.push(param)
      }
    }

    // 处理 @return 注释
    if (content.startsWith('@return')) {
      const returnInfo = parseReturnComment(content)
      if (returnInfo) {
        result.returns = returnInfo
      }
    }

    // 处理 @field 注释 (用于扩展已存在的table类型参数或返回值)
    if (content.startsWith('@field')) {
      const field = parseFieldComment(content)
      if (field) {
        // 修复：传入 result 参数以支持 return[] 语法
        addFieldToParam(result.params, field, result)
      }
    }
  })

  return result
}

/**
 * 解析 @param 注释
 * @param content - 注释内容
 * @returns 解析后的参数对象
 */
function parseParamComment(content) {
  // 匹配格式: @param name type label # config
  const paramMatch = content.match(/@param\s+(\S+)\s+(\S+)\s+([^#]*?)(?:\s*#\s*(.*))?$/)

  if (!paramMatch) return null

  const [, name, type, label, configString] = paramMatch

  const param = {
    name: name.trim(),
    type: type.trim(),
    label: label.trim(),
    // required: true,
    default: null,
    options: null,
    desc: null,
    paramGroup: null, // 用于参数分组
    fields: [] // 用于table类型的子字段
  }

  // 解析参数配置信息
  if (configString) {
    parseParamConfig(param, configString)
  }

  return param
}

/**
 * 解析 @return 注释 - 增强版本，支持字段结构
 * @param content - 注释内容
 * @returns 解析后的返回值对象
 */
function parseReturnComment(content) {
  // 匹配格式: @return type label
  const returnMatch = content.match(/@return\s+(\S+)\s+(.*)$/)

  if (!returnMatch) return null

  const [, type, label] = returnMatch

  return {
    type: type.trim(),
    label: label.trim(),
    fields: [] // 用于存储通过 @field return[] 定义的字段
  }
}

/**
 * 解析 @field 注释
 * @param content - 注释内容
 * @returns 解析后的字段对象
 */
function parseFieldComment(content) {
  // 匹配格式: @field parentName.fieldName type label
  // 或: @field parentName[].fieldName type label (数组元素字段)
  const fieldMatch = content.match(/@field\s+([^\s]+)\s+(\S+)\s+(.*)$/)

  if (!fieldMatch) return null

  const [, fieldPath, type, label] = fieldMatch

  return {
    fieldPath: fieldPath.trim(),
    type: type.trim(),
    label: label.trim()
  }
}

/**
 * 将字段添加到对应的参数中 - 修复版本，支持 return[] 语法
 * @param params - 参数数组
 * @param field - 字段对象
 * @param result - 结果对象（包含 returns 字段）
 */
function addFieldToParam(params, field, result) {
  const pathParts = field.fieldPath.split('.')
  const paramName = pathParts[0]

  // 特殊处理 return[] 情况
  if (paramName === 'return[]') {
    // 如果是返回值数组的字段，添加到 returns 对象中
    if (result && result.returns) {
      if (!result.returns.fields) {
        result.returns.fields = []
      }

      result.returns.fields.push({
        name: pathParts.slice(1).join('.'),
        type: field.type,
        label: field.label,
        isArrayElement: true
      })
    }
    return
  } else if (paramName === 'return') {
    // 如果是返回值对象的字段，添加到 returns 对象中
    if (result && result.returns) {
      if (!result.returns.fields) {
        result.returns.fields = []
      }

      result.returns.fields.push({
        name: pathParts.slice(1).join('.'),
        type: field.type,
        label: field.label,
        isArrayElement: false
      })
    }
    return
  }

  // 找到对应的参数
  const param = params.find(p => p.name === paramName || p.name === paramName.replace('[]', ''))

  if (param) {
    if (!param.fields) param.fields = []

    param.fields.push({
      name: pathParts.slice(1).join('.'),
      type: field.type,
      label: field.label,
      isArrayElement: field.fieldPath.includes('[]')
    })
    // 分析并设置 table 的子类型
    if (param.type === 'table') {
      param.paramSubType = analyzeTableSubType(param)
    }
  }
}

/**
 * 分析 table 类型的子类型和结构
 * @param param - 参数对象
 * @returns 返回子类型描述字符串
 */
function analyzeTableSubType(param) {
  if (!param.fields || param.fields.length === 0) {
    return 'unknown' // 没有字段定义，无法确定类型
  }

  // 检查是否是数组类型
  // 检查是否是数组类型
  const isArray = param.fields.some(field => field.isArrayElement)
  let diyType = ''

  if (isArray) {
    // 数组类型：检查元素类型
    const elementFields = param.fields.filter(field => field.isArrayElement)

    // 检查是否是简单类型数组
    if (elementFields.length === 1 && !elementFields[0].name.includes('.')) {
      // 简单数组：如 string[], number[]
      const elementType = elementFields[0].type
      if (['string', 'number', 'boolean'].includes(elementType)) {
        return `${elementType}[]`
      } else if (elementType.startsWith('$')) {
        return `${elementType.slice(1)}[]`
      }
    }

    // 复杂对象数组：分析对象结构
    const objectStructure = {}
    elementFields.forEach(field => {
      const fieldName = field.name.split('.')[0] // 取第一个点之前的部分
      if (!fieldName && field.type.startsWith('$')) {
        diyType = field.type.slice(1)
      } else {
        objectStructure[fieldName] = field.type
      }
    })

    return `{${Object.entries(objectStructure)
      .map(([key, type]) => `${key}:${type}`)
      .join(',')}}${diyType}[]`
  } else {
    // 纯对象类型：分析对象结构
    const objectStructure = {}
    param.fields.forEach(field => {
      const fieldName = field.name.split('.')[0] // 取第一个点之前的部分
      if (!fieldName && field.type.startsWith('$')) {
        diyType = field.type.slice(1)
      } else {
        objectStructure[fieldName] = field.type
      }
    })

    return `{${Object.entries(objectStructure)
      .map(([key, type]) => `${key}:${type}`)
      .join(',')}}${diyType}`
  }
}

/**
 * 解析参数配置信息
 * @param paramObject - 参数对象，用于存储解析结果
 * @param configString - 配置字符串，包含默认值、选项、描述等信息
 */
function parseParamConfig(paramObject, configString) {
  const parts = configString.split(
    /\s+(?=default:|options:|componentType:|multiple:|paramGroup:|desc:|defaultOptions:|min:|max:)/
  )

  parts.forEach(part => {
    part = part.trim()
    if (part.startsWith('default:')) {
      const defaultValue = part.substring(8)
      paramObject.default = parseValue(defaultValue, paramObject.type)
    } else if (part.startsWith('options:')) {
      const optionsValue = part.substring(8)
      paramObject.options = parseValue(optionsValue, 'array')
    } else if (part.startsWith('desc:')) {
      const descValue = part.substring(5)
      paramObject.desc = descValue
    } else if (part.startsWith('componentType:')) {
      const componentTypeValue = part.substring(14)
      paramObject.componentType = componentTypeValue
      // 新增：如果是 select-multi，自动标记为多选
      if (componentTypeValue === 'select-multi') {
        paramObject.multiple = true
      }
    } else if (part.startsWith('paramGroup:')) {
      const paramGroupValue = part.substring(11)
      paramObject.paramGroup = paramGroupValue.trim()
    } else if (part.startsWith('defaultOptions:')) {
      const defaultOptions = part.substring(15)
      paramObject.defaultOptions = defaultOptions.trim() === 'true'
    } else if (part.startsWith('min:')) {
      const min = part.substring(4)
      paramObject.min = Number(min.trim())
    } else if (part.startsWith('max:')) {
      const max = part.substring(4)
      paramObject.max = Number(max.trim())
    }
  })
}

/**
 * 根据类型解析值
 * @param value - 字符串值
 * @param type - 类型
 * @returns 解析后的值
 */
function parseValue(value, type) {
  value = value.trim()

  // 移除首尾的引号（只处理整个字符串被引号包围的情况）
  if (
    (value.startsWith("'") && value.endsWith("'")) ||
    (value.startsWith('"') && value.endsWith('"'))
  ) {
    value = value.slice(1, -1)
  }

  try {
    // 检查是否是 JSON 格式（数组或对象）
    if (value.startsWith('[') || value.startsWith('{')) {
      // 将单引号替换为双引号以符合 JSON 标准
      const jsonValue = convertToValidJSON(value)
      return JSON.parse(jsonValue)
    }

    // 根据类型转换
    switch (type) {
      case 'number':
        return parseFloat(value)
      case 'boolean':
        return value === 'true'
      case 'string':
        return value
      default:
        // 对于其他类型，尝试JSON解析
        try {
          if (value.startsWith('[') || value.startsWith('{')) {
            const jsonValue = convertToValidJSON(value)
            return JSON.parse(jsonValue)
          }
          return value
        } catch {
          return value
        }
    }
  } catch (error) {
    // 解析失败，返回原字符串
    console.warn('解析值失败:', value, error)
    return value
  }
}

/**
 * 将包含单引号的 JavaScript 对象字符串转换为有效的 JSON 字符串
 * @param str - 原始字符串
 * @returns 转换后的 JSON 字符串
 */
function convertToValidJSON(str) {
  // 先处理字符串，避免影响其他替换
  let result = str

  // 1. 处理对象键名（无引号的键名，支持中文和特殊字符）: {name:xxx} -> {"name":xxx}
  // 使用更宽松的正则表达式，支持中文、冒号等特殊字符
  result = result.replace(/(\{|,)\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:/g, '$1"$2":')

  // 2. 处理字符串值的单引号: :'value' -> :"value"
  result = result.replace(/:\s*'([^']*)'/g, ':"$1"')

  // 3. 处理数组开头的单引号字符串: ['value' -> ["value"
  result = result.replace(/\[\s*'([^']*)'/g, '["$1"')

  // 4. 处理数组中间的单引号字符串: ,'value' -> ,"value"
  result = result.replace(/,\s*'([^']*)'/g, ',"$1"')

  // 5. 处理数组结尾的单引号字符串: 'value'] -> "value"]
  result = result.replace(/'(\s*[\],}])/g, '"$1')

  // 6. 处理对象中字符串值后面的情况: 'value', -> "value",
  result = result.replace(/'(\s*,)/g, '"$1')

  // 7. 处理对象结尾的字符串值: 'value'} -> "value"}
  result = result.replace(/'(\s*})/g, '"$1')

  return result
}

/**
 * 2.将解析后的注释JSON转换为FormRenderer可用的表单配置
 * @param jsonData - 解析后的注释JSON对象
 * @returns 返回适合FormRenderer渲染的表单配置对象
 */
export const parseJSONToFormConfig = (jsonData, key = 'input') => {
  const json = JSON.parse(JSON.stringify(jsonData))
  const formConfig = {
    formConfig: {
      labelWidth: 'auto',
      labelPosition: 'right',
      size: 'default',
      disabled: false,
      scrollToError: true,
      showMessage: true,
      events: { onMounted: '' },
      globalStyle: ''
    },
    widgetList: []
  }

  // 处理参数列表
  if (json.params && Array.isArray(json.params)) {
    ;(key === 'output' ? [json.returns] : json.params).forEach(param => {
      const widget = createWidget(param)
      if (widget) {
        // 如果返回的是数组（多个子组件），则逐个添加
        if (Array.isArray(widget)) {
          formConfig.widgetList.push(...widget)
        } else {
          formConfig.widgetList.push(widget)
        }
      }
    })
  }

  return formConfig
}

/**
 * 根据参数类型创建对应的表单组件配置
 * @param param - 参数对象
 * @returns 返回组件配置
 */
function createWidget(param) {
  const baseAttributes = {
    hidden: false,
    label: param.label || param.name,
    desc: param.desc || null,
    placeholder: `请输入${param.label || param.name}`,
    width: '',
    labelWidth: '',
    labelPosition: '',
    disabled: false,
    size: '',
    cssClass: [],
    paramType: param.type,
    paramSubType: param.paramSubType || null,
    paramGroup: param.paramGroup || null
  }

  const baseConfig = {
    label: param.label || param.name,
    id: param.name,
    type: getComponentType(param),
    attributes: {
      ...baseAttributes,
      // table类型仅在非多选时禁用，多选下拉允许编辑
      disabled: param.type === 'table' && !param.multiple ? true : baseAttributes.disabled,
      // 根据类型设置特殊属性
      inputType:
        param.type === 'textarea' ? 'textarea' : param.type === 'inputNumber' ? 'number' : 'text',
      // 数组类型的placeholder提示
      placeholder: param.type.endsWith('[]')
        ? `请输入${param.label || param.name}（$${
            ['string', 'number'].includes(param.type.replace('[]', ''))
              ? '多个值用逗号分隔'
              : 'JSON格式'
          }）`
        : baseAttributes.placeholder
    },
    rules: param.required
      ? [{ required: true, message: `请输入${param.label || param.name}` }]
      : [],
    events: { onChange: '', onMounted: '' },
    isFormItem: true,
    defaultValue: param.default !== null ? param.default : undefined
  }

  // 处理选项配置
  if (param.options && Array.isArray(param.options)) {
    baseConfig.options = param.options.map(opt => {
      if (typeof opt === 'object' && opt !== null) {
        const key = Object.keys(opt)[0]
        return { label: key, value: opt[key] }
      }
      return { label: String(opt), value: opt }
    })

    // 布尔类型的特殊处理
    if (param.type === 'boolean' && param.componentType !== 'select') {
      baseConfig.attributes.activeText = baseConfig.options[0]?.label || '是'
      baseConfig.attributes.inactiveText = baseConfig.options[1]?.label || '否'
    }

    // select类型的特殊处理
    if (param.type === 'select') {
      baseConfig.attributes.multiple = param.type.includes('[]')
      baseConfig.attributes.filterable = true
      baseConfig.attributes.clearable = true
    }
  }

  return baseConfig
}

/**
 * 表单数据适配器相关函数
 */

// 支持的组件类型列表
const SUPPORTED_COMPONENT_TYPES = [
  'input',
  'select',
  'switch',
  'inputNumber',
  'textarea',
  'function'
]

/**
 * 过滤不支持的组件
 * @param {Array} widgetList - 组件列表
 * @returns {Array} 过滤后的组件列表
 */
export const filterUnsupportedComponents = widgetList => {
  if (!Array.isArray(widgetList)) {
    return []
  }

  return widgetList.filter(widget => {
    // 检查组件类型是否在支持列表中
    return SUPPORTED_COMPONENT_TYPES.includes(widget.type)
  })
}

/**
 * 适配表单生成器数据
 * @param {Object} formConfig - 表单配置对象
 * @returns {Object} 适配后的表单配置
 */
export const adaptFormGeneratorData = formConfig => {
  if (!formConfig || typeof formConfig !== 'object') {
    return {
      formConfig: {
        labelWidth: 'auto',
        labelPosition: 'right',
        size: 'default',
        disabled: false,
        scrollToError: true,
        showMessage: true,
        events: { onMounted: '' },
        globalStyle: ''
      },
      widgetList: []
    }
  }

  // 确保 formConfig 存在
  const adaptedConfig = {
    formConfig: {
      labelWidth: 'auto',
      labelPosition: 'right',
      size: 'default',
      disabled: false,
      scrollToError: true,
      showMessage: true,
      events: { onMounted: '' },
      globalStyle: '',
      ...formConfig.formConfig
    },
    widgetList: []
  }

  // 处理组件列表
  if (Array.isArray(formConfig.widgetList)) {
    adaptedConfig.widgetList = formConfig.widgetList.map(widget => {
      // 确保每个组件都有必要的属性
      const adaptedWidget = {
        id: widget.id || `widget_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: widget.type || 'input',
        label: widget.label || '',
        attributes: {
          label: widget.attributes?.label || widget.label || '',
          placeholder: widget.attributes?.placeholder || `请输入${widget.label || ''}`,
          disabled: widget.attributes?.disabled || false,
          ...widget.attributes
        },
        rules: widget.rules || [],
        events: widget.events || { onChange: '', onMounted: '' },
        isFormItem: widget.isFormItem !== false,
        defaultValue: widget.defaultValue,
        options: widget.options || []
      }

      // 特殊处理某些组件类型
      if (adaptedWidget.type === 'textarea') {
        adaptedWidget.attributes.inputType = 'textarea'
      } else if (adaptedWidget.type === 'inputNumber') {
        adaptedWidget.attributes.inputType = 'number'
      }

      return adaptedWidget
    })
  }

  return adaptedConfig
}

/**
 * 一步完成Lua注释到表单配置的转换
 * @param {Array} comments - Lua注释数组
 * @param {string} type - 'input' 或 'output'
 * @returns {Object} 适配后的表单配置
 */
export const parseLuaToFormConfig = (comments, type = 'input') => {
  // 支持的组件类型列表
  const SUPPORTED_COMPONENT_TYPES = [
    'input',
    'select',
    'switch',
    'inputNumber',
    'textarea',
    'function'
  ]
  // 解析注释为JSON
  const codeJson = parseCommentsToJSON(comments)
  // 创建基础表单配置
  const formConfig = {
    formConfig: {
      labelWidth: 'auto',
      labelPosition: 'right',
      size: 'default',
      disabled: false,
      scrollToError: true,
      showMessage: true,
      events: { onMounted: '' },
      globalStyle: ''
    },
    widgetList: []
  }

  // 处理参数列表
  if (codeJson.params && Array.isArray(codeJson.params)) {
    const params = type === 'output' ? [codeJson.returns] : codeJson.params
    params.forEach(param => {
      if (!param) return
      // 分析 table 类型的子类型
      if (param.type === 'table' && param.fields) {
        param.paramSubType = analyzeTableSubType(param)
      }
      const widget = createOptimizedWidget(param, SUPPORTED_COMPONENT_TYPES)
      if (widget) {
        // 如果返回的是数组（多个子组件），则逐个添加
        if (Array.isArray(widget)) {
          formConfig.widgetList.push(...widget)
        } else {
          formConfig.widgetList.push(widget)
        }
      }
    })
  }

  return formConfig
}

/**
 * 根据参数类型确定组件类型和属性
 * @param {Object} param - 参数对象
 * @returns {Object} 组件配置
 */
function createOptimizedWidget(param, supportedTypes) {
  // 获取基础组件类型
  // debugger
  const componentType = getComponentType(param)
  if (!supportedTypes.includes(componentType)) {
    return null
  }

  const baseAttributes = {
    hidden: false,
    label: param.label || param.name,
    desc: param.desc || null,
    placeholder: `请输入${param.label || param.name}`,
    width: '',
    labelWidth: '',
    labelPosition: '',
    disabled: false,
    size: '',
    cssClass: [],
    paramType: param.type,
    paramSubType: param.paramSubType || null,
    paramGroup: param.paramGroup || null,
    defaultOptions: param.defaultOptions || null,
    min: param.min,
    max: param.max
  }

  // 处理默认值
  let defaultValue = param.default
  if (param.type.endsWith('[]') && Array.isArray(param.default)) {
    const elementType = param.type.replace('[]', '')
    if (elementType === 'string' || elementType === 'number') {
      defaultValue = param.default.join(',')
    } else {
      defaultValue = JSON.stringify(param.default)
    }
  }

  const baseConfig = {
    label: param.label || param.name,
    id: param.name,
    type: componentType,
    attributes: {
      ...baseAttributes,
      // table类型仅在非多选时禁用，多选下拉允许编辑
      disabled: param.type === 'table' && !param.multiple ? true : baseAttributes.disabled,
      // 根据类型设置特殊属性
      inputType:
        componentType === 'textarea'
          ? 'textarea'
          : componentType === 'inputNumber'
          ? 'number'
          : 'text',
      // 数组类型的placeholder提示
      placeholder: param.type.endsWith('[]')
        ? `请输入${param.label || param.name}（$${
            ['string', 'number'].includes(param.type.replace('[]', ''))
              ? '多个值用逗号分隔'
              : 'JSON格式'
          }）`
        : baseAttributes.placeholder
    },
    rules: param.required
      ? [{ required: true, message: `请输入${param.label || param.name}` }]
      : [],
    events: { onChange: '', onMounted: '' },
    isFormItem: true,
    defaultValue: defaultValue,
    options: []
  }

  // 处理选项配置
  if (param.options && Array.isArray(param.options)) {
    baseConfig.options = param.options.map(opt => {
      if (typeof opt === 'object' && opt !== null) {
        const key = Object.keys(opt)[0]
        return { label: key, value: opt[key] }
      }
      return { label: String(opt), value: opt }
    })

    // 布尔类型的特殊处理
    if (param.type === 'boolean' && componentType === 'switch') {
      baseConfig.attributes.activeText = baseConfig.options[0]?.label || '是'
      baseConfig.attributes.inactiveText = baseConfig.options[1]?.label || '否'
    }

    // select类型的特殊处理
    if (componentType === 'select') {
      baseConfig.attributes.multiple = param.type.includes('[]')
      baseConfig.attributes.filterable = true
      baseConfig.attributes.clearable = true
    }
  }

  // 处理多选标记
  if (param.multiple) {
    baseConfig.attributes.multiple = true
  }

  return baseConfig
}

/**
 * 根据参数类型确定基础组件类型
 * @param {Object} param - 参数对象
 * @returns {string} 组件类型
 */
function getComponentType(param) {
  // 如果有选项，优先使用select或switch
  if (param.options && Array.isArray(param.options)) {
    if (param.type === 'boolean' && param.componentType !== 'select') {
      return 'switch'
    }
    return 'select'
  }

  // 根据类型确定组件
  switch (param.type) {
    case 'string':
      return 'input'
    case 'number':
      return 'inputNumber'
    case 'boolean':
      return 'switch'
    case 'table':
      return 'input'
    case 'function':
      return 'function'
    default:
      // 处理数组类型
      if (param.type.endsWith('[]')) {
        const elementType = param.type.replace('[]', '')
        // 简单类型使用input，复杂类型使用textarea
        return ['string', 'number'].includes(elementType) ? 'input' : 'textarea'
      }
      return 'input'
  }
}
