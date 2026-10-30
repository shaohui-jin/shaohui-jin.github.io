/**
 * CHANGELOG.md 解析。
 *
 * 完整变更记录页（ChangelogDocPage）与门户首页右上角的「更新日志」浮层
 * 共用这一份解析逻辑，避免两处各写一套导致展示口径不一致。
 *
 * 支持的 Markdown 结构（与仓库根目录 CHANGELOG.md 约定一致）：
 *
 *   ## v1.1.0（2026-06-20）   ← 版本 + 日期
 *   ### jsh-core              ← 模块
 *   #### 新增                 ← 变更类型
 *   - **BaseTable**：说明      ← 条目
 */

export interface ChangeItem {
  label: string;
  text: string;
}

export interface ChangeGroup {
  type: string;
  items: ChangeItem[];
}

export interface ChangeModule {
  name: string;
  groups: ChangeGroup[];
}

export interface VersionBlock {
  version: string;
  date: string;
  modules: ChangeModule[];
}

/** 行内反引号拆出来的片段，`code` 为 true 时渲染成行内代码 */
export interface TextSegment {
  code: boolean;
  text: string;
}

/**
 * 把 `xxx` 拆成片段。
 *
 * 变更记录页与首页浮层都是纯文本插值（`{{ text }}`），反引号会被原样打出来，
 * 看着像语法错误。与其把 CHANGELOG.md 里的反引号删掉——那源文件就不算
 * Markdown 了——不如在这里拆一次，两个渲染处共用。
 */
export function splitInlineCode(text: string): TextSegment[] {
  const segments: TextSegment[] = [];
  const pattern = /`([^`]+)`/g;
  let last = 0;
  let match: RegExpExecArray | null = pattern.exec(text);

  while (match) {
    if (match.index > last) segments.push({ code: false, text: text.slice(last, match.index) });
    segments.push({ code: true, text: match[1] });
    last = match.index + match[0].length;
    match = pattern.exec(text);
  }

  if (last < text.length) segments.push({ code: false, text: text.slice(last) });
  return segments;
}

/** 变更类型 → 标识色 */
export function getGroupColor(type: string): string {
  if (type.includes("新增")) return "#10b981";
  if (type.includes("调整") || type.includes("修改")) return "#4366f1";
  if (type.includes("修复")) return "#f59e0b";
  if (type.includes("移除") || type.includes("删除")) return "#ef4444";
  return "#94a3b8";
}

export function parseChangelog(raw: string): VersionBlock[] {
  const blocks: VersionBlock[] = [];
  const lines = raw.split("\n");
  let ver: VersionBlock | null = null;
  let mod: ChangeModule | null = null;
  let grp: ChangeGroup | null = null;

  for (const line of lines) {
    const vMatch = line.match(/^## (v[\d.]+)(?:[（(](.+?)[）)])?/);
    if (vMatch) {
      ver = { version: vMatch[1], date: vMatch[2] ?? "", modules: [] };
      blocks.push(ver);
      mod = null;
      grp = null;
      continue;
    }
    if (!ver) continue;

    const h3 = line.match(/^### (.+)/);
    if (h3) {
      mod = { name: h3[1], groups: [] };
      ver.modules.push(mod);
      grp = null;
      continue;
    }

    const h4 = line.match(/^#### (.+)/);
    if (h4 && mod) {
      grp = { type: h4[1], items: [] };
      mod.groups.push(grp);
      continue;
    }

    const itemMatch = line.match(/^- \*\*(.+?)\*\*[：:](.+)/);
    if (itemMatch) {
      const item = { label: itemMatch[1], text: itemMatch[2].trim() };
      if (grp) {
        grp.items.push(item);
      } else if (mod) {
        if (!mod.groups.length) mod.groups.push({ type: "", items: [] });
        mod.groups[mod.groups.length - 1].items.push(item);
      }
      continue;
    }

    const plainItem = line.match(/^- (.+)/);
    if (plainItem && !plainItem[1].startsWith("*")) {
      const item = { label: "", text: plainItem[1].trim() };
      if (grp) grp.items.push(item);
      else if (mod) {
        if (!mod.groups.length) mod.groups.push({ type: "", items: [] });
        mod.groups[mod.groups.length - 1].items.push(item);
      }
      continue;
    }

    const subItem = line.match(/^\s+- (.+)/);
    if (subItem) {
      const target = grp ?? mod?.groups[mod.groups.length - 1];
      if (target && target.items.length > 0) {
        const last = target.items[target.items.length - 1];
        last.text += `；${subItem[1].trim()}`;
      }
    }
  }

  return blocks;
}

/** 把某个版本的全部条目拍平成一句话，供浮层里做摘要展示 */
export function summarizeVersion(block: VersionBlock, limit = 3): string {
  const texts: string[] = [];
  for (const mod of block.modules) {
    for (const grp of mod.groups) {
      for (const item of grp.items) {
        texts.push(item.label ? `${item.label}：${item.text}` : item.text);
        if (texts.length >= limit) return texts.join("；");
      }
    }
  }
  return texts.join("；");
}
