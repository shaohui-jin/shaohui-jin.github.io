import { customRef, type Ref } from "vue";

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
