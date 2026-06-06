<template>
  <!-- 全屏编辑器覆盖层 -->
  <Teleport to="body">
    <div v-if="isFullscreen" class="base-fullscreen-editor-overlay">
      <div class="base-fullscreen-editor-container">
        <div class="base-editor-toolbar">
          <el-button type="primary" size="small" circle @click.stop="copyContent">
            <el-icon><DocumentCopy /></el-icon>
          </el-button>
          <el-button type="primary" size="small" circle @click.stop="toggleFullscreen">
            <el-icon><Close /></el-icon>
          </el-button>
        </div>
        <div ref="fullEditorContainer" class="monaco-editor-container"></div>
      </div>
    </div>
  </Teleport>

  <!-- 主编辑器容器 -->
  <div class="base-editor-wrapper">
    <div class="base-editor-toolbar">
      <el-button type="primary" size="small" circle @click.stop="copyContent">
        <el-icon><DocumentCopy /></el-icon>
      </el-button>
      <el-button type="primary" size="small" circle @click.stop="toggleFullscreen">
        <el-icon><FullScreen /></el-icon>
      </el-button>
    </div>
    <div ref="editorContainer" class="editorContainer" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, defineExpose, watch, onBeforeUnmount } from 'vue'
import { ElMessage } from 'element-plus'
import { DocumentCopy, FullScreen, Close } from '@element-plus/icons-vue'
import { getDefaultMonacoEditorConfig } from '@/utils/config/MonacoEditor'
import * as monaco from 'monaco-editor'
import { MonacoInstance, MonacoManager } from '@/utils/manager/MonacoManager'
import { GetPromise } from '@/utils/ts'

const manager = MonacoManager.getInstance()

// 容器对象
const editorContainer = ref()
let monacoId: GetPromise<ReturnType<typeof manager['createInstance']>>['id'] | null = null
let codeEditor: monaco.editor.IStandaloneCodeEditor | null = null

// 全屏状态
const isFullscreen = ref(false)
const fullEditorContainer = ref()
let fullMonacoId: GetPromise<ReturnType<typeof manager['createInstance']>>['id'] | null = null
let fullCodeEditor: monaco.editor.IStandaloneCodeEditor | null = null

// 声明一个input事件
const emit = defineEmits(['update:modelValue'])

defineOptions({
  name: 'BaseEditor'
})

// 从父组件中接收
const props = defineProps({
  language: {
    type: String,
    default: 'typescript'
  },
  modelValue: {
    type: String,
    default: '',
    required: true
  }
})

onMounted(() => {
  manager
    .createInstance(editorContainer.value, {
      ...getDefaultMonacoEditorConfig(),
      value: props.modelValue,
      language: props.language
    })
    .then(({ id, editor }: MonacoInstance) => {
      monacoId = id
      codeEditor = editor
      // 设置监听事件
      codeEditor.onDidChangeModelContent(() => {
        emit('update:modelValue', codeEditor?.getValue())
      })
    })
})

onBeforeUnmount(() => {
  if (monacoId) manager.disposeInstance(monacoId)
  if (fullMonacoId) manager.disposeInstance(fullMonacoId)
})

watch(
  () => props.modelValue,
  newValue => {
    if (codeEditor && newValue !== codeEditor.getValue()) {
      codeEditor.setValue(newValue)
    }
  },
  { immediate: false }
)

// 复制代码内容
const copyContent = () => {
  if (codeEditor) {
    const content = codeEditor.getValue()
    navigator.clipboard
      .writeText(content)
      .then(() => {
        ElMessage.success('代码内容已复制到剪贴板')
      })
      .catch(() => {
        ElMessage.error('复制失败，请手动选择复制')
      })
  }
}

// 切换全屏
const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value

  if (isFullscreen.value) {
    // 进入全屏
    document.body.style.overflow = 'hidden'

    // 延迟创建全屏编辑器
    setTimeout(() => {
      createFullscreenEditor()
    }, 100)
  } else {
    // 退出全屏
    document.body.style.overflow = ''
  }
}

// 创建全屏编辑器
const createFullscreenEditor = () => {
  manager
    .createInstance(fullEditorContainer.value, {
      ...getDefaultMonacoEditorConfig(true),
      value: codeEditor?.getValue() || '',
      language: props.language
    })
    .then(({ id, editor }: MonacoInstance) => {
      fullCodeEditor = editor
      fullMonacoId = id
      // 设置监听事件
      fullCodeEditor.onDidChangeModelContent(() => {
        const content = fullCodeEditor?.getValue() || ''
        emit('update:modelValue', content)
        // 同步到原编辑器
        if (codeEditor) {
          codeEditor.setValue(content)
        }
      })
      // 布局编辑器
      setTimeout(() => {
        fullCodeEditor?.layout()
        fullCodeEditor?.focus()
      }, 100)
    })
}

const setValue = (value: string) => {
  codeEditor?.setValue(value)
}

const getValue = (): string => {
  return codeEditor?.getValue() || ''
}

defineExpose({
  setValue,
  getValue,
  copyContent,
  toggleFullscreen
})
</script>

<style lang="scss" scoped>
.base-editor-wrapper {
  position: relative;
  height: 100%;
  width: 100%;
  flex: 1;
}

.editorContainer {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  overflow: hidden;
  position: relative;
  height: 100%;
  width: 100%;
  flex: 1;
}

.base-editor-toolbar {
  position: absolute;
  top: 5px;
  right: 5px;
  z-index: 100;
  display: flex;
  gap: 0px;
  border-radius: 4px;
  padding: 2px;
}

/* 全屏编辑器样式 */
.base-fullscreen-editor-overlay {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  background-color: #1e1e1e;
  z-index: 99999;
  display: flex;
  flex-direction: column;
}

.base-fullscreen-editor-container {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;

  .base-editor-toolbar {
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
</style>
