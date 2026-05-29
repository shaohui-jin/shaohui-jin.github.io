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

/**
 * 比较两个基础类型数组是否相同
 */
export function isArrEqual(
  arr1: Array<string | number>,
  arr2: Array<string | number>,
): boolean {
  if (arr1.length !== arr2.length) return false;
  const sorted1 = [...arr1].sort();
  const sorted2 = [...arr2].sort();
  return sorted1.every((val, i) => val === sorted2[i]);
}
