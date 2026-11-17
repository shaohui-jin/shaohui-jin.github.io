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

/**
 * 判断对象是否为空
 */
export const isObjEmpty = (obj: ObjectType): boolean => {
  return Object.keys(obj).length === 0;
};
