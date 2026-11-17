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
