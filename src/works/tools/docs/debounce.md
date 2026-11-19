---
title: 防抖
order: 60
---

# 防抖

## debounce

防抖函数，延迟执行直到停止触发

### 基础用法

```typescript
import { debounce } from "@/utils/debounce";

const handleResize = debounce(() => {
  console.log("resize settled");
}, 300);

// 第三个参数 true 表示首次立即执行
const handleClick = debounce(fn, 500, true);
```

### 配置参数

```typescript
declare const debounce: (
  fn: (...args: any[]) => any,
  delay?: number,
  immediate?: boolean,
) => (...args: any[]) => void;
```

### 参数说明

| 名称      | 类型                       | 默认值  | 必填 | 说明             |
| --------- | -------------------------- | ------- | ---- | ---------------- |
| fn        | `(...args: any[]) => any`  | —       | 是   | 需要防抖的函数   |
| delay     | `number`                   | `300`   | 否   | 延迟时间（ms）   |
| immediate | `boolean`                  | `false` | 否   | 是否首次立即执行 |
| 返回值    | `(...args: any[]) => void` | —       | 是   | 防抖后的函数     |

### 代码实现

```typescript
/**
 * 防抖函数
 * @param fn 需要防抖的函数
 * @param delay 延迟时间（ms），默认 300
 * @param immediate 是否首次立即执行
 */
export const debounce = (
  fn: (...args: any[]) => any,
  delay: number = 300,
  immediate: boolean = false,
): ((...args: any[]) => void) => {
  let timer: ReturnType<typeof setTimeout> | null = null;
  let isFirst = immediate;
  return function (this: any, ...args: any[]) {
    if (isFirst) {
      fn.apply(this, args);
      isFirst = false;
      return;
    }
    timer && clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
};
```

## useDebounceRef

防抖响应式 ref，set 操作延迟触发更新

### 基础用法

```typescript
import { useDebounceRef } from "@/utils/debounce";

const keyword = useDebounceRef("", 500);
// keyword.value = "abc" → 500ms 后才触发依赖更新
```

### 配置参数

```typescript
declare const useDebounceRef: <T>(value: T, delay?: number) => Ref<T>;
```

### 参数说明

| 名称   | 类型     | 默认值 | 必填 | 说明           |
| ------ | -------- | ------ | ---- | -------------- |
| value  | `T`      | —      | 是   | 初始值         |
| delay  | `number` | `300`  | 否   | 延迟时间（ms） |
| 返回值 | `Ref<T>` | —      | 是   | 防抖 ref       |

### 代码实现

```typescript
import { customRef, type Ref } from "vue";

/**
 * 防抖响应式 ref
 * @param value 初始值
 * @param delay 延迟时间（ms），默认 300
 */
export const useDebounceRef = <T>(value: T, delay: number = 300): Ref<T> => {
  return customRef<T>((track, trigger) => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    return {
      get() {
        track();
        return value;
      },
      set(newValue: T) {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
          value = newValue;
          trigger();
        }, delay);
      },
    };
  });
};
```
