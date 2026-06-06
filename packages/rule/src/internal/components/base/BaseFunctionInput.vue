<template>
  <div class="func-wrapper">
    <div class="func-input-body">
      <div
        ref="editorContainer"
        class="func-container el-container"
        :class="{ 'is-disabled': props.disabled }"
      >
        <el-icon @click.capture.stop="showFullScreen">
          <svg
            viewBox="0 0 14 14"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            width="14.000000"
            height="14.000000"
            fill="none"
          >
            <rect id="calculator" width="14.000000" height="14.000000" x="0.000000" y="0.000000" />
            <path
              id="合并"
              d="M2.625 0.875L11.375 0.875C11.8582 0.875 12.25 1.26675 12.25 1.75L12.25 12.25C12.25 12.7332 11.8582 13.125 11.375 13.125L2.625 13.125C2.14175 13.125 1.75 12.7332 1.75 12.25L1.75 1.75C1.75 1.26675 2.14175 0.875 2.625 0.875ZM11.375 1.75L2.625 1.75L2.625 12.25L11.375 12.25L11.375 1.75ZM9.625 2.625C10.1082 2.625 10.5 3.01675 10.5 3.5L10.5 5.25C10.5 5.73325 10.1082 6.125 9.625 6.125L4.375 6.125C3.89175 6.125 3.5 5.73325 3.5 5.25L3.5 3.5C3.5 3.01675 3.89175 2.625 4.375 2.625L9.625 2.625ZM9.625 3.5L4.375 3.5L4.375 5.25L9.625 5.25L9.625 3.5ZM4.375 7C4.85825 7 5.25 7.39175 5.25 7.875C5.25 8.35825 4.85825 8.75 4.375 8.75C3.89175 8.75 3.5 8.35825 3.5 7.875C3.5 7.39175 3.89175 7 4.375 7ZM7 7C7.48325 7 7.875 7.39175 7.875 7.875C7.875 8.35825 7.48325 8.75 7 8.75C6.51675 8.75 6.125 8.35825 6.125 7.875C6.125 7.39175 6.51675 7 7 7ZM10.5 7.875C10.5 7.39175 10.1082 7 9.625 7C9.14175 7 8.75 7.39175 8.75 7.875C8.75 8.35825 9.14175 8.75 9.625 8.75C10.1082 8.75 10.5 8.35825 10.5 7.875ZM4.375 9.625C4.85825 9.625 5.25 10.0168 5.25 10.5C5.25 10.9832 4.85825 11.375 4.375 11.375C3.89175 11.375 3.5 10.9832 3.5 10.5C3.5 10.0168 3.89175 9.625 4.375 9.625ZM7 9.625C7.48325 9.625 7.875 10.0168 7.875 10.5C7.875 10.9832 7.48325 11.375 7 11.375C6.51675 11.375 6.125 10.9832 6.125 10.5C6.125 10.0168 6.51675 9.625 7 9.625ZM10.5 10.5C10.5 10.0168 10.1082 9.625 9.625 9.625C9.14175 9.625 8.75 10.0168 8.75 10.5C8.75 10.9832 9.14175 11.375 9.625 11.375C10.1082 11.375 10.5 10.9832 10.5 10.5Z"
              fill="rgb(174,180,191)"
              fill-rule="evenodd"
            />
          </svg>
        </el-icon>
      </div>
    </div>
  </div>
  <el-dialog
    v-model="fullScreenShow"
    title="表达式编辑器"
    :show-close="false"
    :width="840"
    class="func-dialog"
    append-to-body
    :close-on-click-modal="false"
    :destroy-on-close="true"
    :close-on-press-escape="false"
  >
    <template #default>
      <div ref="editorFullContainer" class="func-dialog-container el-container" />
    </template>
    <template #footer>
      <el-button type="primary" @click="commitExpress">确定</el-button>
      <el-button @click="cancelExpress">取消</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref, Ref } from 'vue'
import { useVModel } from '@vueuse/core'
import { getDefaultMonacoEditorConfig } from '@/utils/config/MonacoEditor'
import * as monaco from 'monaco-editor'
import { MonacoInstance, MonacoManager } from '@/utils/manager/MonacoManager'
import { useDialogDrag } from '@/hooks/useDialogDrag'

defineOptions({
  name: 'BaseFunctionInput'
})

const { initDialog } = useDialogDrag()

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'change', 'clear', 'input', 'blur', 'focus'])

const inputValue = useVModel(props, 'modelValue', emit) as Ref<string>
const dialogInputValue = ref<string>('')
const fullScreenShow = ref(false)

// 容器对象
const editorContainer = ref()
const editorFullContainer = ref()
// 编辑器对象
let codeEditor: monaco.editor.IStandaloneCodeEditor | null = null
let codeEditorId: string | null = null
let codeFullEditor: monaco.editor.IStandaloneCodeEditor | null = null
let codeFullEditorId: string | null = null

const manager = MonacoManager.getInstance()

onMounted(async () => {
  init()
})

onUnmounted(() => {
  if (codeEditorId) manager.disposeInstance(codeEditorId)
  if (codeFullEditorId) manager.disposeInstance(codeFullEditorId)
})

const init = () => {
  nextTick(() => {
    initDialog()
    manager
      .createInstance(editorContainer.value, {
        ...getDefaultMonacoEditorConfig(),
        value: inputValue.value,
        theme: 'vs'
      })
      .then(({ id, editor }: MonacoInstance) => {
        codeEditor = editor
        codeEditorId = id
        // 设置监听事件
        codeEditor.onDidChangeModelContent(() => {
          inputValue.value = codeEditor?.getValue() ?? ''
        })
      })
  })
}

// 打开详细功能
const showFullScreen = () => {
  dialogInputValue.value = inputValue.value
  fullScreenShow.value = true
  codeFullEditor = null
  nextTick(() => {
    initDialog()
    manager
      .createInstance(editorFullContainer.value, {
        ...getDefaultMonacoEditorConfig(),
        value: inputValue.value,
        theme: 'vs'
      })
      .then(({ id, editor }: MonacoInstance) => {
        codeFullEditor = editor
        codeFullEditorId = id
        // 设置监听事件
        codeFullEditor.onDidChangeModelContent(() => {
          dialogInputValue.value = codeFullEditor?.getValue() ?? ''
        })
      })
  })
}

const commitExpress = () => {
  codeEditor?.setValue(dialogInputValue.value)
  fullScreenShow.value = false
}

const cancelExpress = () => {
  dialogInputValue.value = ''
  fullScreenShow.value = false
}

defineExpose({})
</script>

<style lang="scss">
.func-dialog .el-dialog__body {
  padding: 14px;
  height: 600px;
  display: flex;
  flex-direction: row;
  gap: 8px;
  border-top: 1px solid rgba(220, 223, 230, 1);
  border-bottom: 1px solid rgba(220, 223, 230, 1);
}
</style>
<style scoped lang="scss">
:deep(.el-input__wrapper) {
  border-radius: var(--el-input-border-radius, var(--el-border-radius-base));
  padding: 1px 43px 1px 11px;
}
:deep(.el-input-group__append) {
  position: absolute;
  right: 0;
  cursor: pointer;
  padding: 0 12px;
  background-color: unset !important;
  border: 0;
  box-shadow: unset;
}

.el-container {
  // 模拟 el-input textarea 样式
  border: 1px solid var(--el-input-border-color, var(--el-border-color, #dcdfe6));
  border-radius: var(--el-input-border-radius, var(--el-border-radius-base, 4px));
  background-color: var(--el-input-bg-color, var(--el-fill-color-blank, #ffffff));
  padding: 5px 11px;
  box-sizing: border-box;
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  font-size: var(--el-font-size-base, 14px);
  color: var(--el-text-color-regular, #606266);
  line-height: 1.5;
  //overflow: hidden;
  position: relative;

  // 聚焦状态
  &:focus-within {
    border-color: var(--el-input-focus-border-color, var(--el-color-primary, #409eff));
    outline: none;
  }

  // 禁用状态
  &.is-disabled {
    background-color: var(--el-disabled-bg-color, #f5f7fa);
    border-color: var(--el-disabled-border-color, #e4e7ed);
    color: var(--el-disabled-text-color, #a8abb2);
    cursor: not-allowed;
  }

  // 确保 Monaco Editor 不会覆盖容器边框
  :deep(.monaco-editor) {
    border: none !important;
    border-radius: 0 !important;
  }

  :deep(.monaco-editor .overflow-guard) {
    border: none !important;
    border-radius: 0 !important;
  }
}

.func-wrapper {
  width: 100%;
  position: relative;
  flex: 1 1 0;
  //overflow: hidden;
  .func-input-body {
    position: relative;
    .func-container {
      height: 100px;
      :deep(.el-icon) {
        cursor: pointer;
        position: absolute;
        left: 6px;
        top: 8px;
        z-index: 10;
      }
    }
  }
}

.func-dialog-container {
  flex: 1 1 0;
  overflow: hidden;
  border-radius: 8px;
  //.func-dialog-container-editor {
  //  height: 572px;
  :deep(.overflow-guard) {
    border: 1px solid #dcdfe6;
    border-radius: 8px;
  }
  //}
}

:deep(.monaco-editor) {
  --max-height: 256px;
  .suggest-widget {
    //max-height: var(--max-height) !important;  /* 窗口最大高度 */
    //overflow-y: auto !important;   /* 超出时显示滚动条 */
    //border-radius: 6px !important; /* 圆角 */
    //box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important; /* 阴影 */
    //border: 1px solid #e0e0e0 !important; /* 边框 */
    background: #ffffff !important; /* 背景色 */
    //visibility: unset!important;
    //display: unset!important;

    .monaco-list {
      .details-label {
        display: flex !important;
        visibility: visible !important;
        overflow: visible !important;
        font-family: Source Han Sans CN;
        color: #5b5b5e !important;
        font-size: 13px !important;
      }
      .highlight {
        color: #0055ff !important;
      }
      .codicon-suggest-more-info {
        display: none !important;
      }

      .monaco-list-row.focused,
      .monaco-list-row:hover {
        background-color: #f0f0f0 !important;
        * {
          //color: rgba(0, 85, 255, 1)!important;
          color: #0055ff !important;
          //font-weight: 600;
        }

        .details-label {
          color: #5b5b5e !important;
        }
      }
    }
  }
}
</style>
