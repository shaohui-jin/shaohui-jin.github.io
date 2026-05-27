/** 搜索表单空字符串：双向绑定时移出 model，避免使用方判空 */
export function isEmptySearchFieldValue(value: unknown): boolean {
  return value === "";
}

export function patchSearchFormField(
  model: Record<string, unknown>,
  key: string,
  value: unknown,
): Record<string, unknown> {
  const next = { ...model };
  if (isEmptySearchFieldValue(value)) {
    delete next[key];
  } else {
    next[key] = value;
  }
  return next;
}

export function omitEmptySearchFields(model: Record<string, unknown>): Record<string, unknown> {
  const next: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(model)) {
    if (!isEmptySearchFieldValue(value)) {
      next[key] = value;
    }
  }
  return next;
}
