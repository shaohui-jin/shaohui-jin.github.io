/**
 * 把对象转为formData
 */
export function objToFormData(obj: Recordable) {
  const formData = new FormData()
  Object.keys(obj).forEach(key => {
    formData.append(key, obj[key] as string | Blob)
  })
  return formData
}

/**
 * 获取字典标签
 * @param options 字典选项
 * @param value 字典值
 * @returns 字典标签
 */
export function getDictLabel(options: any[], value: string): string {
  const option = options.find(item => item.value === value)
  return option ? option.name : value
}

/**
 * 格式化毫秒数，保留小数点后两位
 * @param ms 毫秒数
 * @returns 格式化后的毫秒字符串
 */
export const formatMilliseconds = (ms: number): string => {
  if (typeof ms !== 'number' || isNaN(ms)) {
    return '-'
  }
  return `${ms.toFixed(3)} ms`
}