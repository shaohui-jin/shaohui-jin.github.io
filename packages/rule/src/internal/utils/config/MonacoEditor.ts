import { editor } from 'monaco-editor'
import IStandaloneEditorConstructionOptions = editor.IStandaloneEditorConstructionOptions

/**
 * 获取默认的Monaco编辑器配置
 * @param isFull
 */
export const getDefaultMonacoEditorConfig = (
  isFull: boolean = false
): IStandaloneEditorConstructionOptions => {
  return {
    language: 'javascript',
    // language: 'lua',
    automaticLayout: true, // 自动调整布局
    theme: 'vs',
    lineNumbers: 'off',
    roundedSelection: false,
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    readOnly: false,
    readOnlyMessage: { value: '不可以修改哦', supportThemeIcons: true, supportHtml: true }, // 为只读时编辑内日提示词
    codeLens: false, // 代码透镜
    folding: true, // 代码折叠
    foldingStrategy: 'auto', // 折叠策略
    tabCompletion: 'on', // 代码提示按tab完成
    smoothScrolling: false, // 滚动动画
    snippetSuggestions: 'inline', // 代码提示
    fontSize: isFull ? 14 : 12,
    wordWrap: 'on',
    wordBasedSuggestions: 'allDocuments', // 禁用基于单词的智能提示（例如，自动完成）
    quickSuggestions: true // 启用快速建议（例如，输入时自动显示建议）
  }
}
