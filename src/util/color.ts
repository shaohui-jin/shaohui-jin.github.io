/**
 * rgba/rgb 颜色字符串转十六进制颜色
 */
export const rgbaToHex = (color: string): string => {
  const val = color
    .replace(/rgba?\(/, "")
    .replace(/\)/, "")
    .replace(/[\s+]/g, "")
    .split(",");
  const a = parseFloat(val[3] || "1");
  const r = Math.floor(a * parseInt(val[0]) + (1 - a) * 255);
  const g = Math.floor(a * parseInt(val[1]) + (1 - a) * 255);
  const b = Math.floor(a * parseInt(val[2]) + (1 - a) * 255);
  return (
    "#" +
    ("0" + r.toString(16)).slice(-2) +
    ("0" + g.toString(16)).slice(-2) +
    ("0" + b.toString(16)).slice(-2)
  );
};

/**
 * 十六进制颜色转 rgba 字符串
 */
export const hexToRGBA = (hex: string, alpha?: number): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  if (alpha !== undefined) {
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  return `rgb(${r}, ${g}, ${b})`;
};

/**
 * 十六进制颜色转 { r, g, b } 对象
 */
export const colorToRGBA = (hex: string): { r: number; g: number; b: number } => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
};
