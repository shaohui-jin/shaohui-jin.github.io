import { Config, SUPPORTED_COMPONENT_TYPES } from './FormParser'

interface FuncTag {
  tag: string
  content: string
}

interface FuncTags {
  desc: string
  tags: FuncTag[]
}

export interface InputAndOutput {
  key: string
  type: string
  name: string
  typeRecord?: {
    [key: string]: string
  }
  config: Config
}

export interface Function {
  desc: string
  input: InputAndOutput[]
  output: InputAndOutput[]
  examples: string[]
}

export interface JsDocData {
  metadata: {
    parsedAt: string
    version: string
  }
  functions: Function[]
  classes: Array<any>
  summary: {
    totalFunctions: number
    totalClasses: number
    totalTags: number
  }
}

/**
 * 是否需要处理详细类型
 * @params {string} str 类型
 * @returns {boolean}
 * */
const shouldTypeRecord = (str: string): boolean => {
  return str === 'object' || str === 'object[]'
}

export default class JSDocParser {
  private funcTags: FuncTags[] = []

  init() {
    this.funcTags = []
  }
  /**
   * 解析JavaScript代码并提取JSDoc注释
   * @param {string} code - JavaScript源代码
   * @returns {JsDocData} 包含JSDoc信息的JSON对象
   */
  parseCode(code: string): JsDocData {
    this.init()
    try {
      this.extractJSDocComments(code)
      return this.generateOutput()
    } catch (error) {
      throw new Error(`解析失败: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  /**
   * 从代码中提取JSDoc注释
   * @param {string} code - JavaScript源代码
   */
  extractJSDocComments(code: string) {
    const jsdocRegex = /\/\*\*[\s\S]*?\*\//g
    const comments = code.match(jsdocRegex) || []

    comments.forEach(comment => {
      const jsdocInfo = this.parseJSDocComment(comment)
      if (jsdocInfo) {
        this.funcTags.push(jsdocInfo)
      }
    })
  }

  /**
   * 解析单个JSDoc注释块
   * @param {string} comment - JSDoc注释文本
   * @returns {FuncTags|null} 解析后的JSDoc信息
   */
  parseJSDocComment(comment: string): FuncTags | null {
    let content = comment
      .replace(/^\/\*\*?/, '')
      .replace(/\*\/$/, '')
      .trim()

    const lines = content.split('\n').map(line => line.replace(/^\s*\*?\s?/, ''))

    const funcTags: FuncTags = {
      desc: '',
      tags: []
    }

    // 函数描述可能会换行
    const funcDescList: string[] = []

    lines.forEach(line => {
      if (line.startsWith('@')) {
        const tagMatch = line.match(/^@(\w+)\s+(.*)/)
        if (tagMatch) {
          const [, tagName, tagContent] = tagMatch
          funcTags.tags.push({
            tag: tagName,
            content: tagContent.trim()
          })
        }
      } else {
        funcDescList.push(line)
      }
    })
    funcTags.desc = funcDescList.join('\n').trim()
    return funcTags.desc || funcTags.tags.length > 0 ? funcTags : null
  }

  /**
   * 生成输出JSON
   * @returns {JsDocData} 格式化后的JSON输出
   */
  generateOutput(): JsDocData {
    const output: JsDocData = {
      metadata: {
        parsedAt:
          new Date().toLocaleDateString().replaceAll('/', '-') +
          ' ' +
          new Date().toLocaleTimeString(),
        version: '1.0.0'
      },
      functions: [],
      classes: [],
      summary: {
        totalFunctions: 0,
        totalClasses: 0,
        totalTags: 0
      }
    }

    this.funcTags.forEach((item: FuncTags) => {
      const functionInfo: Function = this.extractFunctionInfo(item)
      if (functionInfo) {
        output.functions.push(functionInfo)
      }
    })

    output.summary.totalFunctions = output.functions.length
    output.summary.totalClasses = output.classes.length
    output.summary.totalTags = this.funcTags.reduce((sum, curr) => sum + curr.tags.length, 0)

    return output
  }

  /**
   * 从JSDoc信息中提取函数信息
   * @param {FuncTags} funcTag - JSDoc解析信息
   * @returns {Function|null} 函数信息对象
   */
  extractFunctionInfo(funcTag: FuncTags): Function | null {
    const functionInfo: Function = {
      desc: funcTag.desc,
      input: [],
      output: [],
      examples: []
    }
    let tagParamType = ''
    let tagReturnType = ''
    for (let i = 0; i < funcTag.tags.length; i++) {
      const tag = funcTag.tags[i]
      switch (tag.tag) {
        case 'param':
          tagParamType = this.matchAndPush(tag.content, tagParamType, functionInfo, 'input')
          break
        case 'return':
        case 'returns':
          tagReturnType = this.matchAndPush(tag.content, tagReturnType, functionInfo, 'output')
          break
        case 'example':
          functionInfo.examples.push(tag.content)
          break
        case 'class':
          // 处理类信息
          break
      }
    }

    const inputList = functionInfo.input.filter(e => !e.type.includes('object'))
    const outputList = functionInfo.output.filter(e => !e.type.includes('object'))

    if (new Set(inputList.map(e => e.name)).size !== inputList.length) {
      throw new Error('函数输入字段存在重复')
    }

    if (new Set(outputList.map(e => e.name)).size !== outputList.length) {
      throw new Error('函数输出字段存在重复')
    }
    // console.log('functionInfo', functionInfo)
    return functionInfo.input.length > 0 || functionInfo.output ? functionInfo : null
  }

  /**
   * 解析函数字段配置
   * @param tagContent
   * @param ｛string｝ tagType 上一个字段类型
   * @param {Function} functionInfo 函数基本信息，处理input或output数据
   * @param {'input'|'output'} pushKey  输入或输出
   * @returns {string} 当前字段类型
   */
  matchAndPush(
    tagContent: string,
    tagType: string,
    functionInfo: Function,
    pushKey: 'input' | 'output'
  ): string {
    const paramMatch = tagContent.match(/\{(.*)\}\s+(\S+)\s+(\S+)(\s+\#\s+(.*))?/)
    if (paramMatch) {
      const type = paramMatch[1]
      const key = paramMatch[2]
      const name = paramMatch[3]
      const config = this.extractConfig(paramMatch[4] || '#', type)
      const index = functionInfo[pushKey].length - 1

      // 说明是前面对象的参数
      if (key.includes('.') && !shouldTypeRecord(type) && tagType === key.split('.')[0]) {
        if (!functionInfo[pushKey][index]['typeRecord']) {
          functionInfo[pushKey][index]['typeRecord'] = {}
        }
        functionInfo[pushKey][index]['typeRecord'][key.split('.')[1]] = type
      } else {
        tagType = key
        functionInfo[pushKey].push({
          key,
          type,
          name,
          config
        })
      }
    }
    return tagType
  }

  /**
   * 从字段配置中提取配置
   * @param {string} config 配置字符串
   * @param {string} type 解析的数据类型
   */
  extractConfig(config: string, type: string): Config {
    const has = Object.prototype.hasOwnProperty
    const option: Config = config
      .split('#')[1]
      .split(';')
      .reduce((acc, cur) => {
        const index = cur.indexOf(':')
        if (index !== -1) {
          acc[cur.substr(0, index).trim()] = cur.substr(index + 1).trim()
        }
        return acc
      }, {})
    if (has.call(option, 'value')) {
      // console.log('props', option)
      // console.log('type', type)
      option.value = type === 'number' ? Number(option.value) : option.value
    }
    if (has.call(option, 'options')) {
      option.options = eval((option?.options as string) || '[]')
    }
    if (has.call(option, 'props')) {
      // option.props = eval(`(${option?.props as string})`)
      option.props = new Function(`return ${option?.props as string}`)()
    }
    if (has.call(option, 'compType') && !SUPPORTED_COMPONENT_TYPES.includes(option.compType)) {
      delete option.compType
    }
    return option
  }
}
