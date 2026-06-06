/**
 * 获取 Promise<T> 的泛型
 * @example
 * type demo = Promise<number>
 * const a: GetPromise<demo> = 1
 */
export type GetPromise<T> = T extends Promise<infer U> ? U : T
