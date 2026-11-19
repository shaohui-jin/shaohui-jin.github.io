---
title: 权限管理
order: 80
---

# 权限管理

## usePermission

权限管理 hook，基于位运算实现高性能权限判断

### 基础用法

```typescript
import { usePermission } from "@/utils/permission";

const perms = ["add", "edit", "delete", "view"] as const;
const { getPermission, hasPermission, switchPermission } = usePermission(perms);

let v = getPermission(["add", "edit"]); // 3
hasPermission(v, "add"); // true
v = switchPermission(v, "add"); // 2
hasPermission(v, "add"); // false
```

### 配置参数

```typescript
declare const usePermission: <T extends readonly string[]>(
  permissions: T,
) => {
  getPermission: (p: Array<T[number]>) => number;
  hasPermission: (v: number, p: T[number]) => boolean;
  switchPermission: (v: number, p: T[number]) => number;
};
```

### 参数说明

| 名称                    | 类型                      | 默认值 | 必填 | 说明                   |
| ----------------------- | ------------------------- | ------ | ---- | ---------------------- |
| permissions             | `readonly string[]`       | —      | 是   | 权限字段列表           |
| 返回值.getPermission    | `(p: string[]) => number` | —      | 是   | 根据字段列表获取权限值 |
| 返回值.hasPermission    | `(v, p) => boolean`       | —      | 是   | 判断是否拥有某权限     |
| 返回值.switchPermission | `(v, p) => number`        | —      | 是   | 切换某权限（异或）     |

### 代码实现

```typescript
/**
 * 权限管理 hook（基于位运算）
 * @param permissions 权限字段列表
 * @example
 * const { hasPermission, getPermission, switchPermission } = usePermission(['add', 'edit', 'delete'] as const)
 */
export const usePermission = <T extends readonly string[]>(permissions: T) => {
  type Permission = T[number];
  const permissionEnums: Record<string, number> = {};
  permissions.forEach((p, i) => {
    permissionEnums[p] = 1 << i;
  });

  return {
    /** 根据权限列表获取权限值 */
    getPermission: (p: Permission[]): number => {
      return Array.from(new Set(p)).reduce((acc, cur) => {
        return acc ^ (permissionEnums[cur] || 0);
      }, 0);
    },
    /** 判断是否拥有某权限 */
    hasPermission: (v: number, p: Permission): boolean => {
      if (!Object.prototype.hasOwnProperty.call(permissionEnums, p)) {
        console.warn(`Permissions has not "${p}"`);
        return false;
      }
      return !!(v & permissionEnums[p]);
    },
    /** 切换权限（异或） */
    switchPermission: (v: number, p: Permission): number => {
      return v ^ (permissionEnums[p] || 0);
    },
  };
};
```
