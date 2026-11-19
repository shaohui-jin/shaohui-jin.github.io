---
title: 颜色
order: 10
---

# 颜色

## rgbaToHex

将 rgba/rgb 颜色字符串转为十六进制颜色值

### 基础用法

```typescript
import { rgbaToHex } from "@/utils/color";

rgbaToHex("rgba(255, 0, 0, 1)");   // "#ff0000"
rgbaToHex("rgb(0, 128, 255)");     // "#0080ff"
```

### 配置参数

```typescript
declare const rgbaToHex: (color: string) => string;
```

### 参数说明

| 名称 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| color | `string` | — | 是 | rgba 或 rgb 颜色字符串 |
| 返回值 | `string` | — | 是 | 十六进制颜色字符串，如 #ff0000 |

### 代码实现

```typescript
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
```

## hexToRGBA

将十六进制颜色转为 rgba 字符串

### 基础用法

```typescript
import { hexToRGBA } from "@/utils/color";

hexToRGBA("#ff0000", 1);    // "rgba(255, 0, 0, 1)"
hexToRGBA("#ff0000");       // "rgb(255, 0, 0)"
```

### 配置参数

```typescript
declare const hexToRGBA: (hex: string, alpha?: number) => string;
```

### 参数说明

| 名称 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| hex | `string` | — | 是 | 十六进制颜色字符串 #RRGGBB |
| alpha | `number` | — | 否 | 可选，透明度 0~1 |
| 返回值 | `string` | — | 是 | rgba 或 rgb 字符串 |

### 代码实现

```typescript
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
```

## colorToRGBA

将十六进制颜色转为 { r, g, b } 对象

### 基础用法

```typescript
import { colorToRGBA } from "@/utils/color";

colorToRGBA("#ff5733");  // { r: 255, g: 87, b: 51 }
```

### 配置参数

```typescript
declare const colorToRGBA: (hex: string) => { r: number; g: number; b: number };
```

### 参数说明

| 名称 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| hex | `string` | — | 是 | 十六进制颜色字符串 |
| 返回值 | `{ r: number; g: number; b: number }` | — | 是 | RGB 对象 |

### 代码实现

```typescript
/**
 * 十六进制颜色转 { r, g, b } 对象
 */
export const colorToRGBA = (hex: string): { r: number; g: number; b: number } => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
};
```
