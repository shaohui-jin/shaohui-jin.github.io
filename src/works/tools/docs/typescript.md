---
title: 类型体操
order: 90
---

# 类型体操

## getValue

TypeScript 类型体操：将对象属性转为 getter 方法类型

### 基础用法

```typescript
import type { getValue } from "@/utils/typescript";

interface User {
  age: number;
  name: string;
}
type Getters = getValue<User>;
// { getAge: number; getName: string; }
```

### 参数说明

| 名称 | 类型       | 默认值 | 必填 | 说明                          |
| ---- | ---------- | ------ | ---- | ----------------------------- |
| T    | `泛型参数` | —      | 是   | 源对象类型                    |
| 结果 | `映射类型` | —      | 是   | 属性名加 get 前缀并首字母大写 |

### 代码实现

```typescript
/** 将对象属性转为 getter 方法类型 */
export type getValue<T> = {
  [K in keyof T as `get${Capitalize<K & string>}`]: T[K];
};
```

## setValue

TypeScript 类型体操：将对象属性转为 setter 方法类型

### 基础用法

```typescript
import type { setValue } from "@/utils/typescript";

interface User {
  age: number;
  name: string;
}
type Setters = setValue<User>;
// { setAge: number; setName: string; }
```

### 参数说明

| 名称 | 类型       | 默认值 | 必填 | 说明                          |
| ---- | ---------- | ------ | ---- | ----------------------------- |
| T    | `泛型参数` | —      | 是   | 源对象类型                    |
| 结果 | `映射类型` | —      | 是   | 属性名加 set 前缀并首字母大写 |

### 代码实现

```typescript
/** 将对象属性转为 setter 方法类型 */
export type setValue<T> = {
  [K in keyof T as `set${Capitalize<K & string>}`]: T[K];
};
```

## getOptional

TypeScript 类型体操：提取对象中所有可选属性

### 基础用法

```typescript
import type { getOptional } from "@/utils/typescript";

interface Config {
  host: string;
  port?: number;
  debug?: boolean;
}
type Opts = getOptional<Config>;
// { port?: number; debug?: boolean; }
```

### 参数说明

| 名称 | 类型           | 默认值 | 必填 | 说明           |
| ---- | -------------- | ------ | ---- | -------------- |
| T    | `泛型参数`     | —      | 是   | 源对象类型     |
| 结果 | `条件映射类型` | —      | 是   | 仅包含可选属性 |

### 代码实现

```typescript
/** 提取对象中所有可选属性 */
export type getOptional<T> = {
  [K in keyof T as T[K] extends Required<T>[K] ? never : K]: T[K];
};
```

## setOptional

TypeScript 类型体操：将指定属性设为可选

### 基础用法

```typescript
import type { setOptional } from "@/utils/typescript";

interface User {
  name: string;
  age: number;
  email: string;
}
type Relaxed = setOptional<User, "age" | "email">;
// { name: string; age?: number; email?: string; }
```

### 参数说明

| 名称 | 类型       | 默认值 | 必填 | 说明                 |
| ---- | ---------- | ------ | ---- | -------------------- |
| T    | `泛型参数` | —      | 是   | 源对象类型           |
| K    | `keyof T`  | —      | 是   | 要设为可选的属性联合 |

### 代码实现

```typescript
/** 将指定属性设为可选 */
export type setOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
```

## arrayToUnion

TypeScript 类型体操：将 as const 数组转为联合类型

### 基础用法

```typescript
import type { arrayToUnion } from "@/utils/typescript";

const modes = ["add", "edit", "view"] as const;
type Mode = arrayToUnion<typeof modes>;
// "add" | "edit" | "view"
```

### 参数说明

| 名称 | 类型             | 默认值 | 必填 | 说明              |
| ---- | ---------------- | ------ | ---- | ----------------- |
| T    | `readonly any[]` | —      | 是   | as const 数组类型 |
| 结果 | `联合类型`       | —      | 是   | 数组元素的联合    |

### 代码实现

```typescript
/** 数组转联合类型 */
export type arrayToUnion<T extends readonly any[]> = T[number];
```

## getCompType

获取组件实例 ref 类型的语法糖函数

### 基础用法

```typescript
import { getCompType } from "@/utils/typescript";
import { ElForm } from "element-plus";

const formRef = getCompType(ElForm);
// 等价于 ref<InstanceType<typeof ElForm>>()
await formRef.value?.validate();
```

### 配置参数

```typescript
declare function getCompType<T extends abstract new (...args: any) => any>(
  _comp: T,
): Ref<InstanceType<T>>;
```

### 参数说明

| 名称   | 类型                   | 默认值 | 必填 | 说明         |
| ------ | ---------------------- | ------ | ---- | ------------ |
| _comp  | `组件构造函数`         | —      | 是   | Vue 组件     |
| 返回值 | `Ref<InstanceType<T>>` | —      | 是   | 组件实例 ref |

### 代码实现

```typescript
import { ref } from "vue";

/**
 * 获取组件实例 ref（语法糖）
 * @example const formRef = getCompType(ElForm)
 */
export function getCompType<T extends abstract new (...args: any) => any>(_comp: T) {
  return ref<InstanceType<T>>();
}
```
