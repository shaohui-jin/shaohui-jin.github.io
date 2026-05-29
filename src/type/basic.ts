// ============================================================
// 基础组件类型声明
// ============================================================

// --- Tag ---
export type TagType = "success" | "warning" | "info" | "danger";

export interface TagProps {
  /** 标签文案 */
  label: string;
  /** 视觉类型 */
  type?: TagType;
}

// --- Dot ---
export interface DotProps {
  /** 圆点颜色，任意 CSS 颜色值 */
  color?: string;
  /** 显示文本 */
  text?: string;
}

// --- Image3D ---
export interface Image3DProps {
  /** 图片地址 */
  src: string;
}

// --- ImageCarousel ---
export interface ImageCarouselProps {
  /** 图片地址列表 */
  imageUrls: string[];
  /** 默认选中下标 */
  defaultIndex?: number;
}

// --- ImagePointer ---
export interface ImagePointerProps {
  /** 图片地址列表 */
  imageUrls: string[];
}

// --- TextEraseArea ---
export interface TextEraseAreaProps {
  /** 文本内容 */
  content: string;
}

// --- TextOverflowArea ---
export interface TextOverflowAreaProps {
  /** 容器高度（px） */
  height?: number;
  /** 内边距（px） */
  padding?: number;
  /** 文本内容 */
  content: string;
}

// --- CanvasTime ---
export interface CanvasTimeProps {
  /** 粒子颜色 */
  color?: string;
  /** 画布背景色 */
  bgColor?: string;
}

// --- CodeBlock ---
export interface CodeBlockProps {
  /** 需要复制的原始代码文本 */
  code: string;
  /** 经 highlight 处理后的 HTML（若不传则直接展示 code） */
  highlighted?: string;
}

// --- WidgetTabs ---
export interface WidgetTabsProps {
  /** 代码 Tab 展示的源代码文本 */
  code: string;
  /** 经 highlight 处理后的代码 HTML */
  highlighted: string;
  /** 预览区是否贴边（默认 true） */
  flush?: boolean;
}
