/**
 * CanvasKit `locateFile`：
 * - 开发（Vite）：从本地 `node_modules/canvaskit-wasm/bin` 解析，不访问 CDN。
 * - 构建产物：与 JS chunk 同目录的 `canvaskit.wasm`（由构建插件复制到 assets）。
 * - 可传 `customBaseUrl` 指向自建静态目录覆盖。
 *
 * 注意：`new URL` 的首参需避免模板字符串，否则 Vite 可能错误折叠静态资源路径。
 */
export function canvaskitLocateFile(file: string, customBaseUrl?: string): string {
  if (customBaseUrl) {
    return `${customBaseUrl.replace(/\/$/, "")}/${file}`;
  }
  if (import.meta.env?.DEV) {
    return new URL("../../../../../node_modules/canvaskit-wasm/bin/" + file, import.meta.url).href;
  }
  return new URL("./" + file, import.meta.url).href;
}
