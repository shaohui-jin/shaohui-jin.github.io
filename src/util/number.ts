/**
 * 获取指定范围内的随机整数
 */
export const getRandom = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max + 1 - min) + min);
};

/**
 * 格式化小数，解决浮点精度问题
 */
export const scaleFormat = (value: string = "0", scale: number = 2): string => {
  return Number.parseFloat(value).toFixed(scale);
};
