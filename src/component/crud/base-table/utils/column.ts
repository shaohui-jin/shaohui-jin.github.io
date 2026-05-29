import { omit } from "lodash-es";
import { tableLayoutDefaults, tableSurfaceConfig } from "../theme/tableSurface";
import type { BaseTableColumn } from "@/type/crud";

/**
 * ElTableColumn 相关属性的默认值。
 * 用户传入的列配置会覆盖此处的默认值。
 * 注意：showOverflowTooltip 通过 ElTable 组件级 show-overflow-tooltip 设置，
 * 不在此处注入，以利用 EP 原生的继承机制。
 */
export const columnDefaults: Partial<BaseTableColumn> = {};

/**
 * 将默认配置与用户列配置合并：用户配置优先。
 */
export function normalizeColumn(col: BaseTableColumn): BaseTableColumn {
  return { ...columnDefaults, ...col };
}

/** 批量标准化列配置 */
export function normalizeColumns(columns: BaseTableColumn[]): BaseTableColumn[] {
  return columns.map(normalizeColumn);
}

/** 这些字段不传给 el-table-column 的 bind */
const TABLE_BIND_OMIT = [
  "key",
  "label",
  "title",
  "type",
  "formatter",
  "show",
  "groupItems",
  "children",
  "onclick",
  "successText",
  "failText",
  "isSuccess",
  "desc",
  "activeValue",
  "inactiveValue",
  "disabled",
  "colorMap",
  "columns",
  "popoverWidth",
  "filter",
  "filterPlaceholder",
  "objectSpanMethod",
  "beforeChange",
  "tableSlot",
  "slotName",
  "click",
];

/**
 * 传给 `el-table-column` 的绑定。
 * Element Plus 表头依赖 `label`，行数据依赖 `prop`（本库列配置使用 `key` 字段）。
 */
export function getTableColumnBinds(item: BaseTableColumn): Record<string, unknown> {
  const normalized = normalizeColumn(item);
  const rest = omit(normalized as unknown as Record<string, unknown>, TABLE_BIND_OMIT);
  return {
    ...rest,
    label: headerText(item),
    prop: item.key,
  };
}

export function visibleColumns(columns: BaseTableColumn[]): BaseTableColumn[] {
  return columns.filter((c) => c.show !== false);
}

/** 列设置图标列（固定右侧，不参与列设置面板排序） */
export function createEditColumnConfig(): BaseTableColumn {
  return {
    key: "__editColumn__",
    type: "editColumn",
    fixed: "right",
    width: 48,
    resizable: false,
  };
}

export function stripEditColumn(columns: BaseTableColumn[]): BaseTableColumn[] {
  return columns.filter((c) => c.type !== "editColumn");
}

export function withEditColumn(columns: BaseTableColumn[], enabled: boolean): BaseTableColumn[] {
  const base = stripEditColumn(columns);
  if (!enabled) return base;
  return [...base, createEditColumnConfig()];
}

export function headerText(col: BaseTableColumn): string {
  if (col.type === "selection" || col.type === "index") {
    return "";
  }
  return String(col.label ?? col.title ?? col.key);
}

/** 无匹配或未配置 colorMap 时的圆点底色（与历史 status-custom 样式一致） */
export const statusCustomLampDefaultColor = tableSurfaceConfig.neutralLamp;

/** `status-custom` 列：根据 `row[col.key]` 在 colorMap 中取灯色 */
export function statusCustomLampColor(col: BaseTableColumn, row: Record<string, unknown>): string {
  if (col.type !== "status-custom") {
    return statusCustomLampDefaultColor;
  }
  const map = col.colorMap;
  if (!map) {
    return statusCustomLampDefaultColor;
  }
  const raw = row[col.key];
  if (raw === null || raw === undefined) {
    return statusCustomLampDefaultColor;
  }
  const hit = map[String(raw)];
  return typeof hit === "string" ? hit : statusCustomLampDefaultColor;
}

export function formatCell(
  col: BaseTableColumn,
  row: Record<string, unknown> | object,
  index: number,
): string {
  const r = row as Record<string, unknown>;
  const raw = r[col.key];
  if (col.formatter) {
    return col.formatter(r, col, raw);
  }
  if (col.type === "index") {
    return String(index + 1);
  }
  if (col.type === "selection") {
    return "";
  }
  if (col.type === "switch") {
    const active = (col.activeValue as string | number | boolean) ?? true;
    return raw === active ? "开" : "关";
  }
  if (col.type === "tableSlot") {
    return "查看";
  }
  if (raw === null || raw === undefined) {
    return "";
  }
  if (typeof raw === "object") {
    return JSON.stringify(raw);
  }
  return String(raw);
}

/**
 * 计算每列像素宽度，与 Element Plus `el-table` 策略对齐：
 * - 设置了 `width` 的列为固定列，直接使用原值（不强制最小宽度）
 * - 未设置 `width` 的列为弹性列，以 `minWidth` 或 `defaultColumnWidth` 为基准，均分剩余空间
 */
export function layoutColumnWidths(columns: BaseTableColumn[], innerWidth: number): number[] {
  const vis = visibleColumns(columns);
  if (vis.length === 0) {
    return [];
  }

  const meta = vis.map((c): { fixed: boolean; base: number; minW: number } => {
    if (c.type === "selection") {
      const w = c.width ?? tableLayoutDefaults.selectionColumnWidth;
      return { fixed: true, base: w, minW: w };
    }
    if (c.type === "index") {
      const w = c.width ?? tableLayoutDefaults.indexColumnWidth;
      return { fixed: true, base: w, minW: w };
    }
    if (c.width != null) {
      return { fixed: true, base: c.width, minW: c.width };
    }
    const base = c.minWidth ?? tableLayoutDefaults.defaultColumnWidth;
    return { fixed: false, base, minW: c.minWidth ?? tableLayoutDefaults.minColumnWidth };
  });

  const fixedTotal = meta.reduce((s, m) => s + (m.fixed ? m.base : 0), 0);
  const flexItems = meta.filter((m) => !m.fixed);
  const flexBaseTotal = flexItems.reduce((s, m) => s + m.base, 0);
  const remaining = innerWidth - fixedTotal;

  if (flexItems.length === 0) {
    return meta.map((m) => m.base);
  }

  if (remaining >= flexBaseTotal) {
    const extra = remaining - flexBaseTotal;
    const addPerFlex = extra / flexItems.length;
    return meta.map((m) => (m.fixed ? m.base : Math.floor(m.base + addPerFlex)));
  }

  const scale = Math.max(0, remaining / flexBaseTotal);
  return meta.map((m) => (m.fixed ? m.base : Math.max(m.minW, Math.floor(m.base * scale))));
}

/**
 * switch 列切换：调用 beforeChange 阻断钩子，通过后直接修改 row 数据。
 * 返回切换后的新值；若被阻断则返回 null。
 */
export async function trySwitchToggle(
  row: Record<string, unknown>,
  col: BaseTableColumn,
): Promise<unknown> {
  if (col.disabled) return null;
  const activeVal = (col.activeValue as string | number | boolean) ?? true;
  const inactiveVal = (col.inactiveValue as string | number | boolean) ?? false;
  const newValue = row[col.key] === activeVal ? inactiveVal : activeVal;

  if (col.beforeChange) {
    try {
      const allowed = await col.beforeChange(row, col);
      if (!allowed) return null;
    } catch {
      return null;
    }
  }

  row[col.key] = newValue;
  return newValue;
}
