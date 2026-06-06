import { nextTick, ref } from 'vue'

/**
 * el-dialog 拖拽 Hooks
 * @param {Object} options 配置选项
 * @returns {Object} 拖拽控制方法
 */
export const useDialogDrag = (
  options: {
    // 拖拽手柄选择器
    handle?: string | null
    // 是否启用边界限制
    boundary?: boolean
    // 拖拽开始回调
    onStart?: ((params: { x: number; y: number; element: HTMLElement }) => void) | null
    // 拖拽移动回调
    onMove?: ((params: { x: number; y: number; element: HTMLElement }) => void) | null
    // 拖拽结束回调
    onEnd?: ((params: { x: number; y: number; element: HTMLElement }) => void) | null
    // 初始化完成回调
    onInitialized?: ((data) => void) | null
    // 是否自动初始化
    autoInit?: boolean
    // 边界限制类型：'window' 或 'mask'（遮罩层）
    boundaryType?: 'window' | 'mask'
    // 初始化重试配置
    retry?: {
      count?: number
      delay?: number
    }
  } = {}
) => {
  const {
    handle = null,
    boundary = true,
    onStart = null,
    onMove = null,
    onEnd = null,
    onInitialized = null,
    autoInit = false,
    boundaryType = 'mask',
    retry = {}
  } = options

  const { count: retryCount = 5, delay: retryDelay = 50 } = retry

  const isDragging = ref(false)
  const isInitialized = ref(false)
  const dragStatus = ref('等待初始化')

  type DragData = {
    startX: number
    startY: number
    offsetX: number
    offsetY: number
    header: HTMLElement | null
    dialog: HTMLElement | null
    mask: HTMLElement | null
    wrapper: HTMLElement | null
    cleanup: (() => void) | null
  }

  const dragData: DragData = {
    startX: 0,
    startY: 0,
    offsetX: 0,
    offsetY: 0,
    header: null,
    dialog: null,
    mask: null,
    wrapper: null,
    cleanup: null
  }

  /**
   * 智能查找对话框元素
   */
  const findDialogSmartly = () => {
    // 尝试多种可能的对话框结构
    const dialogSelectors = [
      // Element Plus 常见结构
      '.el-overlay .el-overlay-dialog .el-dialog',
      '.el-overlay-dialog .el-dialog', 
      '.el-dialog-wrapper .el-dialog',
      '.el-dialog__wrapper .el-dialog',
      
      // 直接查找对话框
      '.el-dialog'
    ]

    for (const selector of dialogSelectors) {
      const dialogs = document.querySelectorAll(selector)
      if (dialogs.length > 0) {
        // 返回最顶层（最后面）的对话框
        const topDialog = dialogs[dialogs.length - 1]
        
        // 向上查找包装容器
        const wrapper = topDialog.closest('.el-overlay-dialog') || 
                       topDialog.closest('.el-overlay') ||
                       topDialog.closest('.el-dialog-wrapper') ||
                       topDialog.closest('.el-dialog__wrapper') ||
                       topDialog.parentElement
        
        const header = topDialog.querySelector('.el-dialog__header')
        const mask = topDialog.closest('.el-overlay')

        if (header) {
          return {
            wrapper,
            dialog: topDialog,
            header,
            mask
          }
        }
      }
    }

    return null
  }

  /**
   * 带重试的初始化
   */
  const initWithRetry = async (retries = retryCount): Promise<boolean> => {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        dragStatus.value = `正在初始化... (尝试 ${attempt}/${retries})`
        
        await nextTick()
        
        const result = findDialogSmartly()
        if (!result) {
          throw new Error('未找到对话框元素')
        }

        const { wrapper, header, dialog, mask } = result

        // 检查元素是否可见（避免找到隐藏的对话框）
        const style = window.getComputedStyle(dialog)
        if (style.display === 'none' || style.visibility === 'hidden') {
          throw new Error('对话框不可见')
        }

        // 更新拖拽数据
        Object.assign(dragData, {
          header,
          dialog,
          wrapper,
          mask,
          cleanup: null
        })

        const cleanup = setupDragBehavior()
        dragData.cleanup = cleanup

        isInitialized.value = true
        dragStatus.value = '拖拽功能已就绪'

        onInitialized?.({ element: dialog, header, mask })
        return true

      } catch (error) {
        const message = error instanceof Error ? error.message : String(error)
        console.warn(`初始化尝试 ${attempt} 失败:`, message)
        
        if (attempt === retries) {
          dragStatus.value = `初始化失败: ${message}`
          return false
        }
        
        // 等待后重试
        await new Promise(resolve => setTimeout(resolve, retryDelay))
      }
    }
    return false
  }

  /**
   * 初始化拖拽功能
   */
  const initDialog = async (): Promise<boolean> => {
    // 先清理之前的
    destroy()
    
    dragStatus.value = '开始初始化拖拽功能...'
    return await initWithRetry()
  }

  /**
   * 设置拖拽行为
   */
  const setupDragBehavior = () => {
    const { header, dialog } = dragData

    if (!header || !dialog) {
      throw new Error('对话框元素未就绪')
    }

    // 设置初始位置
    setInitialPosition(dialog)

    const dragHandle = (handle ? header.querySelector(handle) : header) as HTMLElement | null
    if (!dragHandle) {
      throw new Error(`未找到拖拽手柄: ${handle}`)
    }

    dragHandle.style.cursor = 'move'
    dragHandle.style.userSelect = 'none'

    // 事件处理函数
    const onMouseDown = (e: MouseEvent) => {
      if (handle && !(e.target as HTMLElement | null)?.closest?.(handle)) return
      startDrag(e)
    }

    const onResize = () => setInitialPosition(dialog)

    // 绑定事件
    dragHandle.addEventListener('mousedown', onMouseDown)
    window.addEventListener('resize', onResize)

    // 返回清理函数
    return () => {
      dragHandle.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('resize', onResize)
    }
  }

  /**
   * 设置初始位置（居中）
   */
  const setInitialPosition = (dialog: HTMLElement) => {
    if (!dialog) return

    const container = boundaryType === 'mask' && dragData.mask 
      ? dragData.mask 
      : document.documentElement

    const containerRect = container.getBoundingClientRect()
    const dialogRect = dialog.getBoundingClientRect()

    dialog.style.position = 'absolute'
    dialog.style.left = `${(containerRect.width - dialogRect.width) / 2}px`
    dialog.style.top = `${(containerRect.height - dialogRect.height) / 2}px`
    dialog.style.margin = '0'
  }

  /**
   * 开始拖拽
   */
  const startDrag = (e: MouseEvent) => {
    isDragging.value = true
    const { dialog, header } = dragData
    if (!dialog || !header) return

    const rect = dialog.getBoundingClientRect()

    // 记录起始位置和偏移量
    dragData.startX = e.clientX
    dragData.startY = e.clientY
    dragData.offsetX = e.clientX - rect.left
    dragData.offsetY = e.clientY - rect.top

    header.classList.add('dragging')
    dragStatus.value = '拖拽中...'
    dialog.style.transition = 'none'

    onStart?.({
      x: rect.left,
      y: rect.top,
      element: dialog
    })

    // 绑定全局事件
    const onMouseMove = (e: MouseEvent) => onDrag(e)
    const onMouseUp = () => stopDrag()

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)

    e.preventDefault()
  }

  /**
   * 拖拽移动
   */
  const onDrag = (e: MouseEvent) => {
    if (!isDragging.value) return

    const { dialog, offsetX, offsetY, mask } = dragData
    if (!dialog) return
    const container = boundaryType === 'mask' && mask 
      ? mask 
      : document.documentElement

    const containerRect = container.getBoundingClientRect()
    const dialogRect = dialog.getBoundingClientRect()

    let newX = e.clientX - containerRect.left - offsetX
    let newY = e.clientY - containerRect.top - offsetY

    // 边界限制
    if (boundary) {
      newX = Math.max(0, Math.min(newX, containerRect.width - dialogRect.width))
      newY = Math.max(0, Math.min(newY, containerRect.height - dialogRect.height))
    }

    dialog.style.left = `${newX}px`
    dialog.style.top = `${newY}px`

    onMove?.({
      x: newX,
      y: newY,
      element: dialog
    })
  }

  /**
   * 停止拖拽
   */
  const stopDrag = () => {
    if (!isDragging.value) return
    if (!dragData.header || !dragData.dialog) return

    isDragging.value = false
    dragData.header.classList.remove('dragging')
    dragData.dialog.style.transition = ''

    const rect = dragData.dialog.getBoundingClientRect()
    dragStatus.value = '拖拽结束'

    onEnd?.({
      x: rect.left,
      y: rect.top,
      element: dragData.dialog
    })

    // 移除全局事件
    document.removeEventListener('mousemove', onDrag)
    document.removeEventListener('mouseup', stopDrag)
  }

  /**
   * 重新初始化
   */
  const reinit = async (): Promise<boolean> => {
    isInitialized.value = false
    return await initDialog()
  }

  /**
   * 销毁
   */
  const destroy = () => {
    if (dragData.cleanup) {
      dragData.cleanup()
      dragData.cleanup = null
    }

    // 移除全局事件
    document.removeEventListener('mousemove', onDrag)
    document.removeEventListener('mouseup', stopDrag)

    isInitialized.value = false
    isDragging.value = false
    dragStatus.value = '已销毁'

    // 重置数据
    Object.assign(dragData, {
      header: null,
      dialog: null,
      mask: null,
      wrapper: null,
      cleanup: null
    })
  }

  // 自动初始化
  if (autoInit) {
    nextTick(() => {
      // 延迟初始化确保DOM渲染完成
      setTimeout(() => {
        initDialog()
      }, 100)
    })
  }

  return {
    isDragging,
    isInitialized,
    dragStatus,
    initDialog,
    reinit,
    destroy
  }
}