// 用于测量文本宽度的 canvas 上下文（单例模式）
let measureCanvas: HTMLCanvasElement | null = null
let measureCtx: CanvasRenderingContext2D | null = null

/**
 * 初始化用于测量文本的 canvas
 */
const initMeasureCanvas = (): void => {
  if (!measureCanvas) {
    measureCanvas = document.createElement('canvas')
    measureCtx = measureCanvas.getContext('2d')
  }
}

/**
 * 使用 canvas 测量文本宽度
 * @param text 要测量的文本
 * @param fontSize 字体大小，默认 14
 * @param fontWeight 字体粗细，默认 '400'
 * @param fontFamily 字体族，默认 'Arial'
 * @returns 文本宽度（像素）
 */
export const measureTextWidth = (
  text: string,
  fontSize = 14,
  fontWeight: string | number = '400',
  fontFamily = 'Arial'
): number => {
  if (typeof text !== 'string') {
    text = String(text || '')
  }
  initMeasureCanvas()
  if (!measureCtx) {
    // 如果 canvas 不可用，使用估算值
    return text.length * (fontSize * 0.6)
  }
  const font = `${fontWeight} ${fontSize}px ${fontFamily}`
  measureCtx.font = font
  return measureCtx.measureText(text).width
}

/**
 * 截断文本并添加省略号
 * @param text 要截断的文本
 * @param maxWidth 最大宽度（像素）
 * @param fontSize 字体大小，默认 14
 * @param fontWeight 字体粗细，默认 '400'
 * @param fontFamily 字体族，默认 'Arial'
 * @returns 截断后的文本（如果超出则添加省略号）
 */
export const truncateText = (
  text: string,
  maxWidth: number,
  fontSize = 14,
  fontWeight: string | number = '400',
  fontFamily = 'Arial'
): string => {
  if (typeof text !== 'string') {
    text = String(text || '')
  }
  const fullWidth = measureTextWidth(text, fontSize, fontWeight, fontFamily)
  if (fullWidth <= maxWidth) {
    return text
  }

  // 计算省略号的宽度
  const ellipsisWidth = measureTextWidth('...', fontSize, fontWeight, fontFamily)
  const availableWidth = maxWidth - ellipsisWidth

  // 二分查找合适的截断位置
  let left = 0
  let right = text.length
  let result = ''

  while (left < right) {
    const mid = Math.floor((left + right) / 2)
    const testText = text.substring(0, mid)
    const testWidth = measureTextWidth(testText, fontSize, fontWeight, fontFamily)

    if (testWidth <= availableWidth) {
      result = testText
      left = mid + 1
    } else {
      right = mid
    }
  }

  return result + '...'
}

/**
 * 根据最大宽度将文本拆分为多行，并返回带换行符的文本
 * @param text 原始文本
 * @param maxWidth 每行最大宽度（像素）
 * @param fontSize 字体大小，默认 14
 * @param fontWeight 字体粗细，默认 '400'
 * @param fontFamily 字体族，默认 'Arial'
 * @param maxLines 最大行数（可选）。超出时最后一行会追加省略号
 * @returns 带换行符的文本
 */
export const wrapTextByWidth = (
  text: string,
  maxWidth: number,
  fontSize = 14,
  fontWeight: string | number = '400',
  fontFamily = 'Arial',
  maxLines?: number
): string => {
  if (typeof text !== 'string') {
    text = String(text || '')
  }

  if (!text || maxWidth <= 0) {
    return ''
  }

  const paragraphs = text.split('\n')
  const lines: string[] = []

  for (const paragraph of paragraphs) {
    // 保留空行
    if (paragraph.length === 0) {
      lines.push('')
      continue
    }

    let start = 0
    while (start < paragraph.length) {
      let left = start + 1
      let right = paragraph.length
      let best = start + 1

      // 二分查找：找到从 start 开始可容纳的最长子串
      while (left <= right) {
        const mid = Math.floor((left + right) / 2)
        const candidate = paragraph.slice(start, mid)
        const width = measureTextWidth(candidate, fontSize, fontWeight, fontFamily)

        if (width <= maxWidth) {
          best = mid
          left = mid + 1
        } else {
          right = mid - 1
        }
      }

      // 理论兜底：至少前进一个字符，避免死循环
      if (best <= start) {
        best = start + 1
      }

      lines.push(paragraph.slice(start, best))
      start = best
    }
  }

  // 不限制行数，直接返回
  if (!maxLines || maxLines <= 0 || lines.length <= maxLines) {
    return lines.join('\n')
  }

  // 超出最大行数：截断并为最后一行追加省略号
  const visible = lines.slice(0, maxLines)
  const lastIdx = visible.length - 1
  visible[lastIdx] = truncateText(visible[lastIdx], maxWidth, fontSize, fontWeight, fontFamily)
  return visible.join('\n')
}