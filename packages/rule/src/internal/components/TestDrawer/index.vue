<template>
  <!-- 全屏编辑器 - 移到 body 层级 -->
  <Teleport to="body">
    <!-- 脚本编辑器全屏 -->
    <div v-if="isFullscreen" class="fullscreen-editor-overlay">
      <div class="fullscreen-editor-container">
        <div class="editor-toolbar">
          <el-button type="primary" size="small" circle @click.stop="toggleFullscreen">
            <el-icon><Close /></el-icon>
          </el-button>
        </div>
        <div ref="fullEditorRef" class="monaco-editor-container"></div>
      </div>
    </div>
  </Teleport>

  <el-drawer
    v-model="visible"
    title="测试"
    :teleported="false"
    :before-close="closeDrawer"
    :close-on-press-escape="false"
    :close-on-click-modal="true"
    destroy-on-close
  >
    <el-tabs v-model="activeTab" class="test-tabs" :stretch="true">
      <el-tab-pane label="数据检测" name="json" lazy>
        <div class="tab-content">
          <span>全场景数据</span>
          <div ref="inputParamRootRef" class="monaco-editor-container"></div>
          <span>指定上下文</span>
          <div ref="inputParamContentRef" class="monaco-editor-container"></div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="脚本展示" name="script">
        <div class="tab-content">
          <div class="script-header">
            <el-button type="primary" :loading="isExecuting" @click.stop="executeTest">
              {{ isExecuting ? '执行中...' : '执行测试' }}
            </el-button>
          </div>
          <div class="editor-container">
            <div class="editor-toolbar">
              <el-button type="primary" size="small" circle @click.stop="toggleFullscreen">
                <el-icon><component :is="isFullscreen ? Close : FullScreen" /></el-icon>
              </el-button>
            </div>
            <div ref="editorRef" class="monaco-editor-container"></div>
          </div>
        </div>
      </el-tab-pane>

      <el-tab-pane label="执行结果" name="result" :disabled="testDisabled" lazy>
        <div class="tab-content">
          <div ref="testContentRef" class="monaco-editor-container"></div>
          <div class="no-content-tip">
            <el-empty description="暂无执行结果"></el-empty>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref, defineEmits, defineExpose, onUnmounted, onMounted, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { FullScreen, Close } from '@element-plus/icons-vue'
import {
  type ExecutionRecordData,
  type RuleDebugResponseResult
} from '@/types/ruleApi'
import { getDefaultMonacoEditorConfig } from '@/utils/config/MonacoEditor'
import { MonacoInstance, MonacoManager } from '@/utils/manager/MonacoManager'

// 定义主题常量
const DARK_THEME = 'vs'
const LIGHT_THEME = 'vs'

// 定义事件
const emit = defineEmits(['close', 'node-click'])

// 状态变量
const activeTab = ref('json')
const isExecuting = ref(false) // 执行测试状态
const testResult = ref<RuleDebugResponseResult>({
  duration: 0,
  funcStepLogs: [],
  message: '',
  success: false
})
const nodeMap = ref<Map<string, any>>(new Map())

const visible = ref(false)

// 是否全屏状态
const isFullscreen = ref(false)

const manager = MonacoManager.getInstance()

// 编辑器容器引用
const editorRef = ref<HTMLElement | null>(null)
const fullEditorRef = ref<HTMLElement | null>(null)
const inputParamRootRef = ref<HTMLElement | null>(null)
const inputParamContentRef = ref<HTMLElement | null>(null)
const outputContentRef = ref<HTMLElement | null>(null)

// 编辑器实例
let editor: MonacoInstance['editor'] | null = null
let fullEditor: MonacoInstance['editor'] | null = null
let inputParamRoot: MonacoInstance['editor'] | null = null
let inputParamContent: MonacoInstance['editor'] | null = null
let outputContent: MonacoInstance['editor'] | null = null

const scriptContent = ref('')
const inputParam = ref({
  root: '{}',
  content: '{}'
})
const testContent = ref('')
const testDisabled = ref(true)
// 执行测试
const executeTest = async () => {
  if (!scriptContent.value) {
    ElMessage.warning('请输入脚本内容')
    return
  }
  // 设置执行状态
  isExecuting.value = true
  try {
    testDisabled.value = true
    activeTab.value = 'result'
    ;(() => {
      console.log('箭头函数立即执行')
    })()
    const fn = new Function(scriptContent.value)
    const result = fn()
    testContent.value = JSON.stringify(result ?? null)
    testDisabled.value = false
  } catch (error) {
    console.error('测试执行失败:', error)
  } finally {
    // 重置执行状态
    isExecuting.value = false
  }
}

// 打开抽屉
const openDrawer = (data: ExecutionRecordData) => {
  scriptContent.value = data.code
  const configData = JSON.parse(data.configData)
  nodeMap.value = new Map<string, any>()
  configData.nodeList.forEach((node: any) => {
    nodeMap.value.set(node.id, node)
  })
  visible.value = true
  nextTick(() => {
    if (!editorRef.value) return
    manager
      .createInstance(editorRef.value, {
        ...getDefaultMonacoEditorConfig(),
        value: scriptContent.value
      })
      .then(({ id, editor: _editor }: MonacoInstance) => {
        editor = _editor
        // 设置监听事件
        editor.onDidChangeModelContent(() => {
          scriptContent.value = editor?.getValue() || ''
        })
      })
    manager
      .createInstance(inputParamRootRef.value, {
        ...getDefaultMonacoEditorConfig(),
        value: inputParam.value.root,
        language: 'json'
      })
      .then(({ id, editor: _editor }: MonacoInstance) => {
        inputParamRoot = _editor
        // 设置监听事件
        inputParamRoot.onDidChangeModelContent(() => {
          inputParam.value.root = inputParamRoot?.getValue() || ''
        })
      })
    manager
      .createInstance(inputParamContentRef.value, {
        ...getDefaultMonacoEditorConfig(),
        value: inputParam.value.content,
        language: 'json'
      })
      .then(({ id, editor: _editor }: MonacoInstance) => {
        inputParamContent = _editor
        // 设置监听事件
        inputParamContent.onDidChangeModelContent(() => {
          inputParam.value.content = inputParamContent?.getValue() || ''
        })
      })
    manager
      .createInstance(outputContentRef.value, {
        ...getDefaultMonacoEditorConfig(),
        value: testContent.value,
        language: 'text'
      })
      .then(({ id, editor: _editor }: MonacoInstance) => {
        outputContent = _editor
        // 设置监听事件
        outputContent.onDidChangeModelContent(() => {
          testContent.value = outputContent?.getValue() || ''
        })
      })
  })
}

// 关闭抽屉
const closeDrawer = () => {
  editor && editor.dispose()
  fullEditor && fullEditor.dispose()
  testResult.value = {
    duration: 0,
    funcStepLogs: [],
    message: '',
    success: false
  }
  scriptContent.value = ''
  nodeMap.value.clear()
  isFullscreen.value = false
  visible.value = false
  emit('close')
}

// 打开关闭全屏bianjiqq8i
const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value

  if (isFullscreen.value) {
    setTimeout(() => {
      manager
        .createInstance(fullEditorRef.value, {
          ...getDefaultMonacoEditorConfig(),
          value: scriptContent.value
        })
        .then(({ id, editor: _editor }: MonacoInstance) => {
          fullEditor = _editor
          // 设置监听事件
          fullEditor.onDidChangeModelContent(() => {
            scriptContent.value = fullEditor?.getValue() || ''
          })
        })
    }, 100)
  } else {
    // 销毁全屏编辑器
    fullEditor.dispose()
  }
}

onMounted(() => {})

onUnmounted(() => {})

defineExpose({
  openDrawer,
  closeDrawer
})
</script>

<style lang="scss" scoped>
@use "jsh-core/style/variables" as *;

.test-tabs {
  height: 100%;
  display: flex;
  flex-direction: column;

  :deep(.el-tabs__header) {
    flex-shrink: 0;
  }

  :deep(.el-tabs__content) {
    flex: 1 1 0;
    //height: calc(100% - 40px);
    overflow: hidden;
    .el-tab-pane {
      height: 100%;
    }
  }

  :deep(.el-tabs__item) {
    padding: 0;
  }

  :deep(.el-tabs__item.is-active) {
    background: var(--el-color-primary-light-9, #ecf5ff);
    color: $lib-color-primary;
  }
}

.tab-content {
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  .no-content-tip {
    padding: 0;
    background-color: $lib-bg-card;
  }

  .script-header {
    display: flex;
    margin-bottom: 16px;
    gap: 10px;
    flex-shrink: 0;
    flex-direction: column;
  }

  .monaco-editor-container {
    width: 100%;
    flex: 1 1 0;
    border: 1px solid $lib-border-medium;
    border-radius: $lib-radius-sm;
  }
}

.editor-container {
  height: 100%;
  border: 1px solid $lib-border-medium;
  border-radius: $lib-radius-sm;
  overflow: hidden;
  position: relative;
  display: flex;
  flex: 1;
  min-height: 0;

  .editor-toolbar {
    position: absolute;
    top: 5px;
    right: 5px;
    z-index: 100;
    display: flex;
    gap: 0;
    border-radius: $lib-radius-sm;
    padding: 2px;
  }
}

/* 全屏编辑器样式 */
.fullscreen-editor-overlay {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  background-color: #1e1e1e;
  z-index: 99999;
  display: flex;
  flex-direction: column;
  .fullscreen-editor-container {
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;
    flex-direction: column;
    .editor-toolbar {
      position: absolute;
      top: 20px;
      right: 20px;
      z-index: 100000;
      display: flex;
      gap: 0px;
    }
    .monaco-editor-container {
      width: 100%;
      height: 100%;
      flex: 1;
    }
  }
}
</style>
