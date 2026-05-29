/** 行主键取值（与 ElTable row-key 一致） */
export function rowKeyValue(row: Record<string, unknown>, rowKey: string): unknown {
  return row[rowKey];
}

/** 稳定字符串化，用于 Set 比较 */
export function keyString(v: unknown): string {
  if (v === null || v === undefined) {
    return "\0__null__";
  }
  if (typeof v === "object") {
    try {
      return JSON.stringify(v);
    } catch {
      return String(v);
    }
  }
  return String(v);
}
