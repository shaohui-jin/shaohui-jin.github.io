function escapeHtml(code: string): string {
  return code
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Demo 代码 Tab：Vue 模板片段高亮 */
export function highlightDemoCode(code: string): string {
  return escapeHtml(code);
}

/** 工具函数代码示例高亮（TypeScript） */
export function highlightTsCode(code: string): string {
  return escapeHtml(code);
}

