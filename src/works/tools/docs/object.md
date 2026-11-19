---
title: 对象
order: 30
---

# 对象

## flattenObj

对象扁平化，将嵌套对象转为单层 key.path 格式

### 基础用法

```typescript
import { flattenObj } from "@/utils/object";

flattenObj({ a: { b: 1 }, c: 2 });
// { "a.b": 1, "c": 2 }

flattenObj({ a: { b: 1 } }, "prefix");
// { "prefix.a.b": 1 }
```

### 配置参数

```typescript
declare const flattenObj: (obj: Record<string, any>, prefix?: string) => Record<string, any>;
```

### 参数说明

| 名称   | 类型                  | 默认值 | 必填 | 说明               |
| ------ | --------------------- | ------ | ---- | ------------------ |
| obj    | `Record<string, any>` | —      | 是   | 需要扁平化的对象   |
| prefix | `string`              | `""`   | 否   | 键名前缀           |
| 返回值 | `Record<string, any>` | —      | 是   | 扁平化后的单层对象 |

### 代码实现

```typescript
type ObjectType = Record<string, any>;

/**
 * 对象扁平化
 * @example flattenObj({ a: { b: 1 }, c: 2 }) // { "a.b": 1, "c": 2 }
 */
export const flattenObj = (obj: ObjectType, prefix: string = ""): ObjectType => {
  return Object.keys(obj).reduce((acc, k) => {
    const pre = prefix.length ? prefix + "." : "";
    if (typeof obj[k] === "object" && obj[k] !== null) {
      Object.assign(acc, flattenObj(obj[k], pre + k));
    } else {
      acc[pre + k] = obj[k];
    }
    return acc;
  }, {} as ObjectType);
};
```

## unFlatten

扁平化还原，将 key.path 格式还原为嵌套对象

### 基础用法

```typescript
import { unFlatten } from "@/utils/object";

unFlatten({ "a.b": 1, c: 2 });
// { a: { b: 1 }, c: 2 }
```

### 配置参数

```typescript
declare const unFlatten: (obj: Record<string, any>) => Record<string, any>;
```

### 参数说明

| 名称   | 类型                  | 默认值 | 必填 | 说明             |
| ------ | --------------------- | ------ | ---- | ---------------- |
| obj    | `Record<string, any>` | —      | 是   | 扁平化的对象     |
| 返回值 | `Record<string, any>` | —      | 是   | 还原后的嵌套对象 |

### 代码实现

```typescript
type ObjectType = Record<string, any>;

/**
 * 扁平化还原
 * @example unFlatten({ 'a.b': 1, c: 2 }) // { a: { b: 1 }, c: 2 }
 */
export const unFlatten = (obj: ObjectType): ObjectType => {
  const result: ObjectType = {};
  for (const key in obj) {
    const keys = key.split(".");
    let nestedObj = result;
    for (let i = 0; i < keys.length - 1; i++) {
      if (!nestedObj[keys[i]]) {
        nestedObj[keys[i]] = {};
      }
      nestedObj = nestedObj[keys[i]];
    }
    nestedObj[keys[keys.length - 1]] = obj[key];
  }
  return result;
};
```

## isObjEqual

深度比较两个对象是否相同

### 基础用法

```typescript
import { isObjEqual } from "@/utils/object";

isObjEqual({ a: 1, b: { c: 2 } }, { a: 1, b: { c: 2 } }); // true
isObjEqual({ a: 1 }, { a: 2 }); // false
```

### 配置参数

```typescript
declare function isObjEqual(obj1: Record<string, any>, obj2: Record<string, any>): boolean;
```

### 参数说明

| 名称   | 类型                  | 默认值 | 必填 | 说明     |
| ------ | --------------------- | ------ | ---- | -------- |
| obj1   | `Record<string, any>` | —      | 是   | 对象一   |
| obj2   | `Record<string, any>` | —      | 是   | 对象二   |
| 返回值 | `boolean`             | —      | 是   | 是否相同 |

### 代码实现

```typescript
type ObjectType = Record<string, any>;

/**
 * 深度比较两个对象是否相同
 */
export function isObjEqual(obj1: ObjectType, obj2: ObjectType): boolean {
  if (!obj1 || !obj2) return false;
  const aProps = Object.getOwnPropertyNames(obj1);
  const bProps = Object.getOwnPropertyNames(obj2);
  if (aProps.length !== bProps.length) return false;
  for (let i = 0; i < aProps.length; i++) {
    const propName = aProps[i];
    const propA = obj1[propName];
    const propB = obj2[propName];
    if (!Object.prototype.hasOwnProperty.call(obj2, propName)) return false;
    if (propA instanceof Object) {
      if (!isObjEqual(propA, propB)) return false;
    } else if (propA !== propB) {
      return false;
    }
  }
  return true;
}
```

## isObjEmpty

判断对象是否为空

### 基础用法

```typescript
import { isObjEmpty } from "@/utils/object";

isObjEmpty({}); // true
isObjEmpty({ a: 1 }); // false
```

### 配置参数

```typescript
declare const isObjEmpty: (obj: Record<string, any>) => boolean;
```

### 参数说明

| 名称   | 类型                  | 默认值 | 必填 | 说明           |
| ------ | --------------------- | ------ | ---- | -------------- |
| obj    | `Record<string, any>` | —      | 是   | 需要判断的对象 |
| 返回值 | `boolean`             | —      | 是   | 是否为空       |

### 代码实现

```typescript
type ObjectType = Record<string, any>;

/**
 * 判断对象是否为空
 */
export const isObjEmpty = (obj: ObjectType): boolean => {
  return Object.keys(obj).length === 0;
};
```
