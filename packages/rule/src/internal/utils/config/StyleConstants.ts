/**
 * 工作流节点样式常量定义
 * 颜色使用 jsh-core 的 --comp-* CSS 变量，保持与全局主题一致
 */

export const COLORS = {
  primary: 'var(--comp-color-primary, #409eff)',

  error: 'var(--el-color-danger, #f56c6c)',
  success: 'var(--comp-color-success, #67c23a)',
  warning: 'var(--comp-color-warning, #e6a23c)',

  border: 'var(--comp-border-color, #ebeef5)',
  borderLight: 'var(--comp-border-medium, #dcdfe6)',

  background: {
    white: 'var(--comp-bg-card, #fff)',
    light: 'var(--comp-bg-page, #f5f7fa)',
    lighter: 'var(--comp-bg-subtle, #fafafa)',
    dark: 'var(--comp-bg-muted, #f4f4f5)'
  },

  text: {
    primary: 'var(--comp-text-primary, #303133)',
    secondary: 'var(--comp-text-secondary, #909399)',
    disabled: 'var(--comp-text-secondary, #909399)',
    white: '#ffffff'
  },

  selection: 'var(--comp-color-primary, #409eff)'
} as const

// 只保留真正需要统一管理的尺寸常量
export const SIZES = {
  // 端口尺寸 - 这些确实需要统一
  port: {
    radius: 5,
    plusRadius: 8
  }
} as const

// 边样式配置
export const EDGE_STYLES = {
  error: { 
    stroke: COLORS.error, 
    strokeWidth: 2 
  },
  normal: { 
    stroke: COLORS.primary, 
    strokeWidth: 2 
  },
  pass: { 
    stroke: COLORS.primary, 
    strokeWidth: 2 
  },
  alert: { 
    stroke: COLORS.border, 
    strokeWidth: 2 
  }
}

// 端口属性配置
export const PORT_ATTRS = {
  circle: { 
    r: SIZES.port.radius, 
    magnet: true, 
    stroke: COLORS.primary, 
    strokeWidth: 2.5, 
    fill: COLORS.text.white 
  },
  plus: { 
    r: SIZES.port.plusRadius, 
    stroke: COLORS.primary, 
    strokeWidth: 2.5, 
    fill: COLORS.primary, 
    display: 'none', 
    cursor: 'pointer'
  },
  plusText: { 
    text: '+', 
    fill: COLORS.text.white, 
    fontSize: 18, 
    textAnchor: 'middle', 
    textVerticalAnchor: 'middle', 
    display: 'none', 
    pointerEvents: 'none' 
  }
} as const
