import * as monaco from 'monaco-editor'

export interface MonacoInstanceOptions {
  value?: string
  language?: string
  theme?: string
  readOnly?: boolean
  [key: string]: any
}

export interface MonacoInstance {
  id: string
  editor: monaco.editor.IStandaloneCodeEditor
  model: monaco.editor.ITextModel
  dispose: () => void
}

export class MonacoManager {
  private static _instance: MonacoManager

  private instances = new Map<string, MonacoInstance>()
  private idSeed = 0

  private constructor() {}

  public static getInstance() {
    if (!this._instance) {
      this._instance = new MonacoManager()
    }
    return this._instance
  }

  public async ensureMonaco(): Promise<typeof monaco> {
    return monaco
  }

  public async createInstance(
    container: HTMLElement,
    options: MonacoInstanceOptions = {}
  ): Promise<MonacoInstance> {
    const id = `editor-${++this.idSeed}`
    const language = options.language || 'javascript'
    const value = options.value || ''

    const model = monaco.editor.createModel(value, language)

    const editor = monaco.editor.create(container, {
      model,
      language,
      theme: options.theme || 'vs-dark',
      readOnly: options.readOnly ?? false,
      automaticLayout: true,
      ...options
    })

    const instance: MonacoInstance = {
      id,
      editor,
      model,
      dispose: () => {
        editor.dispose()
        model.dispose()
        this.instances.delete(id)
      }
    }

    this.instances.set(id, instance)
    return instance
  }

  public getInstance(id: string) {
    return this.instances.get(id) || null
  }

  public disposeInstance(id: string) {
    const inst = this.instances.get(id)
    if (!inst) return
    inst.dispose()
  }

  public disposeAll() {
    this.instances.forEach(inst => inst.dispose())
    this.instances.clear()
  }

  public async registerLanguageCompletion(
    languageId: string,
    provider: monaco.languages.CompletionItemProvider
  ): Promise<monaco.IDisposable> {
    return monaco.languages.registerCompletionItemProvider(languageId, provider)
  }
}
