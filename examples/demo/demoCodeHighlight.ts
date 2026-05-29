import hljs from "highlight.js/lib/core";
import xml from "highlight.js/lib/languages/xml";
import typescript from "highlight.js/lib/languages/typescript";

hljs.registerLanguage("xml", xml);
hljs.registerLanguage("typescript", typescript);

/** Demo 代码 Tab：Vue 模板片段高亮 */
export function highlightDemoCode(code: string): string {
  return hljs.highlight(code, { language: "xml" }).value;
}

/** 工具函数代码示例高亮（TypeScript） */
export function highlightTsCode(code: string): string {
  return hljs.highlight(code, { language: "typescript" }).value;
}

