export type StatusTagType = "success" | "warning" | "info" | "danger";

export interface StatusTagProps {
  /** 标签文案 */
  label: string;
  /** 视觉类型 */
  type?: StatusTagType;
}
