---
title: 数组
order: 40
---

# 数组

## flattenTree

树形集合扁平化，递归展开 children 为一维数组

### 基础用法

```typescript
import { flattenTree } from "@/utils/array";

flattenTree([
  { name: "A", children: [{ name: "B" }, { name: "C" }] },
  { name: "D", children: [] },
]);
// [{ name: "A", children: [...] }, { name: "B" }, { name: "C" }, { name: "D", children: [] }]
```

### 配置参数

```typescript
declare const flattenTree: (arr: any[], childrenKey?: string) => any[];
```

### 参数说明

| 名称 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| arr | `any[]` | — | 是 | 树形数组 |
| childrenKey | `string` | `"children"` | 否 | 子节点字段名 |
| 返回值 | `any[]` | — | 是 | 扁平化后的数组 |

### 代码实现

```typescript
/**
 * 树形集合扁平化（递归展开 children）
 * @example flattenTree([{ a: 1, children: [{ b: 11 }] }])
 */
export const flattenTree = (arr: any[], childrenKey = "children"): any[] => {
  return arr.reduce((result, item) => {
    result = result.concat(item);
    const children = childrenKey ? item[childrenKey] : item;
    if (Array.isArray(children)) {
      return result.concat(flattenTree(children, childrenKey));
    }
    return result;
  }, []);
};
```

## isArrEqual

比较两个基础类型数组是否包含相同元素（无序）

### 基础用法

```typescript
import { isArrEqual } from "@/utils/array";

isArrEqual([1, 2, 3], [3, 2, 1]);  // true
isArrEqual([1, 2], [1, 3]);        // false
```

### 配置参数

```typescript
declare function isArrEqual(arr1: Array<string | number>, arr2: Array<string | number>): boolean;
```

### 参数说明

| 名称 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| arr1 | `Array<string \| number>` | — | 是 | 数组一 |
| arr2 | `Array<string \| number>` | — | 是 | 数组二 |
| 返回值 | `boolean` | — | 是 | 是否相同 |

### 代码实现

```typescript
/**
 * 比较两个基础类型数组是否相同
 */
export function isArrEqual(arr1: Array<string | number>, arr2: Array<string | number>): boolean {
  if (arr1.length !== arr2.length) return false;
  const sorted1 = [...arr1].sort();
  const sorted2 = [...arr2].sort();
  return sorted1.every((val, i) => val === sorted2[i]);
}
```
