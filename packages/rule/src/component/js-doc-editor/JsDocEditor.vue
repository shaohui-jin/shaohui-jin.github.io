<template>
  <div class="js-doc-editor">
    <div class="js-doc-editor__main">
      <section class="js-doc-editor__panel">
        <div class="js-doc-editor__panel-header">
          <el-icon class="js-doc-editor__panel-icon"><EditPen /></el-icon>
          代码编辑器
        </div>
        <div class="js-doc-editor__panel-body">
          <div class="js-doc-editor__editor">
            <BaseEditor ref="JsEditorRef" v-model="state.jsCode" />
          </div>
          <div class="js-doc-editor__actions">
            <el-button :icon="Bottom" @click="loadTemplate">模版</el-button>
            <el-button :icon="Right" type="primary" @click="Js2FormJson">解析</el-button>
            <el-button @click="clearCode">清空</el-button>
            <el-button type="primary" @click="saveFuncData">保存</el-button>
          </div>
        </div>
      </section>

      <section class="js-doc-editor__panel">
        <div class="js-doc-editor__panel-header js-doc-editor__panel-header--green">
          <el-icon class="js-doc-editor__panel-icon"><Document /></el-icon>
          注解解析
        </div>
        <div class="js-doc-editor__panel-body">
          <div class="js-doc-editor__output">
            <CodeBlock :code="annotationCode" />
          </div>
        </div>
      </section>

      <section class="js-doc-editor__panel">
        <div class="js-doc-editor__panel-header js-doc-editor__panel-header--purple">
          <el-icon class="js-doc-editor__panel-icon"><Grid /></el-icon>
          表单预览
        </div>
        <div class="js-doc-editor__panel-body">
          <div class="js-doc-editor__preview">
            <h4 class="js-doc-editor__subtitle">入参配置</h4>
            <BaseFormRender ref="inputFormRendererRef" :formJson="formJson.input" />
            <h4 class="js-doc-editor__subtitle">出参配置</h4>
            <BaseFormRender ref="outputFormRendererRef" :formJson="formJson.output" />
            <h4 class="js-doc-editor__subtitle">备注</h4>
            <el-input
              type="textarea"
              :rows="5"
              maxlength="200"
              show-word-limit
              v-model="state.funcDesc"
              placeholder="请输入备注....."
            />
          </div>
        </div>
      </section>
    </div>

    <section class="js-doc-editor__help">
      <h3 class="js-doc-editor__help-title">
        <el-icon><InfoFilled /></el-icon>
        工具说明
      </h3>
      <div class="js-doc-editor__help-grid">
        <div class="js-doc-editor__help-card">
          <h3 class="js-doc-editor__help-heading">JSDoc 语法</h3>
          <p class="js-doc-editor__help-text">
            语法支持
            <a href="https://jsdoc.nodejs.cn/" target="_blank" rel="noopener noreferrer">JSDoc</a>
          </p>
        </div>
        <div class="js-doc-editor__help-card">
          <h3 class="js-doc-editor__help-heading">自主解析 JSDoc</h3>
          <p class="js-doc-editor__help-text">
            已接入 @param、@return、@example 等注解，轻量级解析器持续扩展中。
          </p>
        </div>
        <div class="js-doc-editor__help-card">
          <h3 class="js-doc-editor__help-heading">自主解析表单</h3>
          <p class="js-doc-editor__help-text">轻量级表单生成器，由注解自动生成入参/出参配置。</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { Bottom, Right, EditPen, Document, Grid, InfoFilled } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus'
import { CodeBlock } from 'jsh-comp'
import BaseEditor from '@/components/base/BaseEditor.vue'
import BaseFormRender from '@/components/base/BaseFormRender.vue'
import JSDocParser, { type JsDocData } from '@/utils/parser/JSDocParser'
import FormParser, { type FromConfig, DEFAULT_FORM_CONFIG } from '@/utils/parser/FormParser'

defineOptions({
  name: 'JsDocEditor'
})

const LOCAL_STORAGE_KEY = 'jsh-rule-func-demo'

const jsDocParser = new JSDocParser()
const formParser = new FormParser()

const getTemplate = () => {
  return `
/**
* 函数demo
* @param {string} name 名字 # placeholder: 请输入名字; desc: 这是很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长的描述

* @param {number} price 工资 # placeholder: 请输入工资; value: 1

* @param {number} employee 员工ID # value: 1; options: [{ id: 1, name: '默认员工名称', price: 100 }]; props: { label: 'name', value: 'id', desc: 'price' }; compType: select

* @param {object[]} employees 多员工 # value: [{ id: 1, name: '默认员工名称', price: 100 }];
* @param {number} employees.id 员工Id
* @param {string} employees.name 员工名字
* @param {number} employees.price 员工工资

* @returns {object} employee 员工
* @returns {string} employee.name 员工名字
* @returns {number} employee.price 员工工资
* @example log({ name: '张三', price: 3000 }, [{ name: '张三', price: 3000 }, { name: '李四', price: 2000 }]); // {name: '张三', price: 3000}
*/
function log(employee, employees, name, price) {
  return employee
}
`
}

const inputFormRendererRef = ref()
const outputFormRendererRef = ref()
const JsEditorRef = ref()
const curFuncParamLen = ref(0)

const formJson = reactive<Record<string, FromConfig>>({
  input: { ...DEFAULT_FORM_CONFIG, compList: [] },
  output: { ...DEFAULT_FORM_CONFIG, compList: [] }
})

const state = reactive({
  id: '',
  funcCode: '',
  functionStatus: '',
  jsCode: '',
  js2JsonCode: {} as Record<string, unknown>,
  funcDesc: '',
  funcName: '',
  className: '',
  path: '',
  funcLuaName: '',
  formJson: {
    input: {
      formConfig: {},
      widgetList: [] as Array<Record<string, unknown>>
    },
    output: {
      formConfig: {},
      widgetList: [] as Array<Record<string, unknown>>
    },
    codeJson: {}
  }
})

const annotationCode = computed(() => {
  if (!state.js2JsonCode || Object.keys(state.js2JsonCode).length === 0) {
    return ''
  }
  return JSON.stringify(state.js2JsonCode, null, 2)
})

const validateData = () => {
  let errorMsg = ''
  if (!state.id || !state.funcName || !state.className || !state.funcLuaName) {
    errorMsg = '信息不全，请检查函数名、方法名、文件名'
  }

  const inputLength = state.formJson.input.widgetList?.length || 0
  const outputLength = state.formJson.output.widgetList?.length || 0

  if (inputLength === 0 && outputLength === 0) {
    errorMsg = '参数信息不全，请至少配置入参或出参'
  }

  if (inputLength !== curFuncParamLen.value) {
    errorMsg = '函数入参数量与注释参数数量不一致，请检查注释是否正确'
  }

  const mainType = ['string', 'number', 'boolean', 'table', 'any', 'function']
  state.formJson.input.widgetList.forEach((item: Record<string, any>) => {
    const type = item.attributes?.paramType as string
    const subType = item.attributes?.paramSubType as string
    if (type === 'table' && subType === 'unkonwn') {
      errorMsg = `入参 ${item.name}: 的子项类型描述有误 请检查注释是否正确`
    }
    if (!mainType.includes(type)) {
      errorMsg = `入参 ${item.name}: 的类型描述有误 请检查注释是否正确`
    }
  })
  state.formJson.output.widgetList.forEach((item: Record<string, any>) => {
    const type = item.attributes?.paramType as string
    const subType = item.attributes?.paramSubType as string
    if (type === 'table' && subType === 'unkonwn') {
      errorMsg = `出参 ${item.name}: 的子项类型描述有误 请检查注释是否正确`
    }
    if (!mainType.includes(type)) {
      errorMsg = `出参 ${item.name}: 的类型描述有误 请检查注释是否正确`
    }
  })

  if (errorMsg) {
    ElNotification({
      message: errorMsg,
      type: 'error',
      duration: 3000
    })
    return false
  }
  return true
}

const saveFuncData = () => {
  if (!validateData()) {
    return
  }
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state))
    ElMessage.success('保存成功')
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '保存失败')
  }
}

const clearCode = () => {
  state.jsCode = ''
  state.js2JsonCode = {}
}

const loadTemplate = () => {
  const templateCode = getTemplate()
  if (!templateCode) return

  const applyTemplate = () => {
    state.jsCode = templateCode
    ElNotification({
      type: 'success',
      message: '加载模版成功',
      duration: 1000
    })
    setTimeout(() => {
      Js2FormJson()
    }, 300)
  }

  if (state.jsCode !== '') {
    ElMessageBox.confirm('将覆盖当前函数，是否继续？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(applyTemplate)
      .catch(() => {
        ElNotification({
          type: 'info',
          message: '取消加载模版'
        })
      })
  } else {
    applyTemplate()
  }
}

const Js2FormJson = () => {
  if (state.jsCode === '') {
    state.js2JsonCode = {}
    return
  }
  try {
    const ast: JsDocData = jsDocParser.parseCode(state.jsCode)
    state.js2JsonCode = ast as unknown as Record<string, unknown>
    curFuncParamLen.value = ast.functions[0]?.input?.length ?? 0

    formJson.input = formParser.parseJsToFormConfig(ast.functions[0]?.input)
    formJson.output = formParser.parseJsToFormConfig(ast.functions[0]?.output)

    ElNotification({
      message: '函数解析表单成功！',
      type: 'success',
      duration: 1000
    })
  } catch (error) {
    ElNotification({
      title: '解析失败',
      message: error instanceof Error ? error.message : String(error),
      type: 'error',
      duration: 1000
    })
  }
}

onMounted(() => {
  state.id = 'demo-1'
  state.funcName = state.funcName || 'demo函数'
  state.className = state.className || 'demo'
  state.funcLuaName = state.funcLuaName || 'demo'

  const saved = localStorage.getItem(LOCAL_STORAGE_KEY)
  if (!saved) return

  try {
    const data = JSON.parse(saved)
    Object.assign(state, data)
    if (data.formJson) {
      state.formJson = data.formJson
    }
    setTimeout(() => {
      Js2FormJson()
    }, 300)
  } catch {
    console.warn('localStorage 数据解析失败')
  }
})
</script>

<style lang="scss" scoped>
@use "jsh-core/style/variables" as *;

.js-doc-editor {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 0;
  height: 100%;
  color: $lib-text-primary;
}

.js-doc-editor__main {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  flex: 1;
  min-height: 0;

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
    min-height: 480px;
  }
}

.js-doc-editor__panel {
  display: flex;
  flex-direction: column;
  min-height: 320px;
  background: $lib-bg-card;
  border: 1px solid $lib-border-color;
  border-radius: $lib-radius-md;
  box-shadow: 0 2px 8px rgb(0 0 0 / 6%);
  overflow: hidden;
}

.js-doc-editor__panel-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  background: $lib-color-primary;

  &--green {
    background: $lib-color-success;
  }

  &--purple {
    background: #7c4dff;
  }
}

.js-doc-editor__panel-icon {
  font-size: 16px;
}

.js-doc-editor__panel-body {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  padding: 12px;
}

.js-doc-editor__editor {
  flex: 1;
  min-height: 280px;
  overflow: hidden;
}

.js-doc-editor__output {
  flex: 1;
  min-height: 240px;
  overflow: auto;
}

.js-doc-editor__preview {
  flex: 1;
  overflow: auto;
}

.js-doc-editor__subtitle {
  margin: 8px 0;
  font-size: 14px;
  font-weight: 500;
  color: $lib-text-primary;
}

.js-doc-editor__actions {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  padding-top: 10px;
  margin-top: auto;
  border-top: 1px solid $lib-border-color;

  @media (min-width: 768px) {
    grid-template-columns: repeat(4, 1fr);
  }
}

.js-doc-editor__help {
  padding: 14px;
  background: $lib-bg-card;
  border: 1px solid $lib-border-color;
  border-radius: $lib-radius-md;
}

.js-doc-editor__help-title {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 0 0 10px;
  font-size: 15px;
  font-weight: 600;
  color: $lib-text-heading;
}

.js-doc-editor__help-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
}

.js-doc-editor__help-card {
  padding: 10px 12px;
  background: $lib-bg-subtle;
  border: 1px solid $lib-border-color;
  border-radius: $lib-radius-sm;
}

.js-doc-editor__help-heading {
  margin: 0 0 4px;
  font-size: 13px;
  font-weight: 600;
  color: $lib-text-heading;
}

.js-doc-editor__help-text {
  margin: 0;
  font-size: 12px;
  line-height: 1.5;
  color: $lib-text-regular;

  a {
    color: $lib-color-primary;
    text-decoration: underline;
  }
}

:deep(.el-button + .el-button) {
  margin-left: 0;
}
</style>
