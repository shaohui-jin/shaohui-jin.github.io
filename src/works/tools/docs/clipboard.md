---
title: 剪贴板
order: 50
---

# 剪贴板

## copyToClipboard

复制文本到剪贴板，使用 Clipboard API + execCommand fallback

### 基础用法

```typescript
import { copyToClipboard } from "@/utils/clipboard";

const success = await copyToClipboard("要复制的文本");
if (success) console.log("复制成功");
```

### 配置参数

```typescript
declare const copyToClipboard: (text: string) => Promise<boolean>;
```

### 参数说明

| 名称   | 类型               | 默认值 | 必填 | 说明         |
| ------ | ------------------ | ------ | ---- | ------------ |
| text   | `string`           | —      | 是   | 要复制的文本 |
| 返回值 | `Promise<boolean>` | —      | 是   | 是否成功     |

### 代码实现

```typescript
/**
 * 复制文本到剪贴板（基于 Clipboard API）
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // fallback: execCommand
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    const success = document.execCommand("copy");
    document.body.removeChild(textarea);
    return success;
  }
};
```
