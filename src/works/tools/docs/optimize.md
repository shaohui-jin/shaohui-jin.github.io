---
title: 性能优化
order: 70
---

# 性能优化

## performChunk

分片执行大任务，避免阻塞主线程导致页面卡顿

### 基础用法

```typescript
import { performChunk } from "@/utils/optimize";

performChunk(100000, (item, i) => {
  // 每项任务处理
}, (task) => {
  requestAnimationFrame(() => {
    const start = performance.now();
    task(() => performance.now() - start < 16);
  });
});
```

### 配置参数

```typescript
declare const performChunk: (
  data: number | any[],
  taskHandler: (item: any, index: number) => void,
  scheduler: (run: (goOn: () => boolean) => void) => void
) => void;
```

### 参数说明

| 名称 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| data | `number \| any[]` | — | 是 | 任务数据（数字=执行次数，数组=遍历） |
| taskHandler | `(item, index) => void` | — | 是 | 每项任务的处理函数 |
| scheduler | `(run) => void` | — | 是 | 调度器，控制执行时机 |

### 代码实现

```typescript
/**
 * 分片执行大任务，避免阻塞主线程
 * @param data 任务数据（数字表示执行次数，数组则遍历处理）
 * @param taskHandler 每项任务的处理函数
 * @param scheduler 调度器，控制任务执行时机
 */
export const performChunk = (
  data: number | any[],
  taskHandler: (item: any, index: number) => void,
  scheduler: (run: (goOn: () => boolean) => void) => void,
): void => {
  const arr: any[] = typeof data === "number" ? new Array(data).fill(data) : data;
  if (arr.length === 0) return;

  let i = 0;
  function _run() {
    if (i === arr.length) return;
    scheduler((goOn) => {
      while (goOn() && i < arr.length) {
        taskHandler(arr[i], i);
        i++;
      }
      _run();
    });
  }
  _run();
};
```

## concurRequest

并发请求控制，限制最大同时请求数

### 基础用法

```typescript
import { concurRequest } from "@/utils/optimize";

const results = await concurRequest([
  "/api/data1",
  "/api/data2",
  "/api/data3",
  "/api/data4",
], 2);  // 最大2个并发
```

### 配置参数

```typescript
declare const concurRequest: (urls?: string[], maxNum?: number) => Promise<Response[]>;
```

### 参数说明

| 名称 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| urls | `string[]` | `[]` | 否 | 请求 URL 列表 |
| maxNum | `number` | `3` | 否 | 最大并发数 |
| 返回值 | `Promise<Response[]>` | — | 是 | 所有响应结果 |

### 代码实现

```typescript
/**
 * 并发请求控制
 * @param urls 请求 URL 集合
 * @param maxNum 最大并发数，默认 3
 */
export const concurRequest = (urls: string[] = [], maxNum: number = 3): Promise<Response[]> => {
  return new Promise((resolve) => {
    if (urls.length === 0) {
      resolve([]);
      return;
    }
    let nextIndex = 0;
    let finishCount = 0;
    const result: Response[] = [];

    function _request() {
      if (nextIndex >= urls.length) return;
      const i = nextIndex;
      const url = urls[nextIndex++];
      fetch(url).then((resp) => {
        result[i] = resp;
        finishCount++;
        if (finishCount === urls.length) {
          resolve(result);
        }
        _request();
      });
    }
    for (let i = 0; i < Math.min(maxNum, urls.length); i++) {
      _request();
    }
  });
};
```
