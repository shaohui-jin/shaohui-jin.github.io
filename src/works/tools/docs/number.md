---
title: 数字
order: 20
---

# 数字

## getRandom

获取指定范围内的随机整数

### 基础用法

```typescript
import { getRandom } from "@/utils/number";

getRandom(1, 10); // 1~10 随机整数
getRandom(0, 100); // 0~100 随机整数
```

### 配置参数

```typescript
declare const getRandom: (min: number, max: number) => number;
```

### 参数说明

| 名称   | 类型     | 默认值 | 必填 | 说明           |
| ------ | -------- | ------ | ---- | -------------- |
| min    | `number` | —      | 是   | 最小值         |
| max    | `number` | —      | 是   | 最大值         |
| 返回值 | `number` | —      | 是   | 范围内随机整数 |

### 代码实现

```typescript
/**
 * 获取指定范围内的随机整数
 */
export const getRandom = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max + 1 - min) + min);
};
```

## scaleFormat

格式化小数，解决浮点精度问题

### 基础用法

```typescript
import { scaleFormat } from "@/utils/number";

scaleFormat((0.1 + 0.2).toString()); // "0.30"
scaleFormat("3.14159", 3); // "3.142"
```

### 配置参数

```typescript
declare const scaleFormat: (value?: string, scale?: number) => string;
```

### 参数说明

| 名称   | 类型     | 默认值 | 必填 | 说明             |
| ------ | -------- | ------ | ---- | ---------------- |
| value  | `string` | `"0"`  | 否   | 待格式化数据     |
| scale  | `number` | `2`    | 否   | 保留小数位数     |
| 返回值 | `string` | —      | 是   | 格式化后的字符串 |

### 代码实现

```typescript
/**
 * 格式化小数，解决浮点精度问题
 */
export const scaleFormat = (value: string = "0", scale: number = 2): string => {
  return Number.parseFloat(value).toFixed(scale);
};
```
