export interface FrontmatterData {
  [key: string]: string | string[];
}

function unquote(value: string): string {
  const matched = /^(['"])([\s\S]*)\1$/.exec(value);
  return matched ? matched[2] : value;
}

/** 解析本仓库用到的 YAML 子集：`key: value` 与 `key:\n  - item` */
export function parseFrontmatter(raw: string): { data: FrontmatterData; body: string } {
  const matched = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(raw);
  if (!matched) return { data: {}, body: raw };

  const data: FrontmatterData = {};
  let currentKey = "";

  for (const line of matched[1].split(/\r?\n/)) {
    const listItem = /^\s+-\s+(.*)$/.exec(line);
    if (listItem && currentKey) {
      const list = Array.isArray(data[currentKey]) ? (data[currentKey] as string[]) : [];
      list.push(unquote(listItem[1].trim()));
      data[currentKey] = list;
      continue;
    }

    const pair = /^([A-Za-z_][\w-]*)\s*:\s*(.*)$/.exec(line);
    if (!pair) continue;

    currentKey = pair[1];
    const value = pair[2].trim();
    if (value === "") {
      data[currentKey] = [];
    } else if (value.startsWith("[") && value.endsWith("]")) {
      data[currentKey] = value
        .slice(1, -1)
        .split(",")
        .map((item) => unquote(item.trim()))
        .filter(Boolean);
    } else {
      data[currentKey] = unquote(value);
    }
  }

  return { data, body: raw.slice(matched[0].length) };
}
