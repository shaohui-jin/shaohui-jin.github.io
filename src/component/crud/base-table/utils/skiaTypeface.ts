import type { CanvasKit, Typeface } from "canvaskit-wasm";

/**
 * 解析 Skia 绘制文字用的 Typeface：
 * - 优先从本地加载 Noto Sans SC（简体中文），与界面中文一致；
 * - 失败时回退到 CanvasKit 内置等宽默认字体（仅拉丁/数字较可靠）。
 */
export async function resolveSkiaTypeface(ck: CanvasKit): Promise<Typeface | null> {
  const fallback = ck.Typeface.GetDefault();
  try {
    const url = import.meta.env.DEV
      ? new URL(
          "../../../../../node_modules/@fontsource/noto-sans-sc/files/noto-sans-sc-chinese-simplified-400-normal.woff2",
          import.meta.url,
        ).href
      : /* @vite-ignore */ new URL("./NotoSansSC-400.woff2", import.meta.url).href;
    const buf = await fetch(url).then((r) => r.arrayBuffer());
    return ck.Typeface.MakeTypefaceFromData(buf) ?? fallback;
  } catch {
    return fallback;
  }
}
