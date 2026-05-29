import { ref } from "vue";

/** 将对象属性转为 getter 方法类型 */
export type getValue<T> = {
  [K in keyof T as `get${Capitalize<K & string>}`]: T[K];
};

/** 将对象属性转为 setter 方法类型 */
export type setValue<T> = {
  [K in keyof T as `set${Capitalize<K & string>}`]: T[K];
};

/** 提取对象中所有可选属性 */
export type getOptional<T> = {
  [K in keyof T as T[K] extends Required<T>[K] ? never : K]: T[K];
};

/** 将指定属性设为可选 */
export type setOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/** 数组转联合类型 */
export type arrayToUnion<T extends readonly any[]> = T[number];

/**
 * 获取组件实例 ref（语法糖）
 * @example const formRef = getCompType(ElForm)
 */
export function getCompType<T extends abstract new (...args: any) => any>(_comp: T) {
  return ref<InstanceType<T>>();
}
