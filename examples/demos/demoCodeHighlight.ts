import hljs from "highlight.js/lib/core";
import xml from "highlight.js/lib/languages/xml";

hljs.registerLanguage("xml", xml);

/** Demo 代码 Tab：Vue 模板片段高亮 */
export function highlightDemoCode(code: string): string {
  return hljs.highlight(code, { language: "xml" }).value;
}
