/**
 * 剥掉工具自动追加的协作尾注。
 *
 * 背景：部分编辑器在提交时会把命令改写成带
 * `--trailer "Co-authored-by: …"` 的形式，于是每个提交都多一条协作者。
 * 本仓库约定提交信息里不留这类署名，Author / Committer 只留仓库主人。
 *
 * 为什么用 hook 而不是靠自觉：注入发生在命令行改写层，`--no-verify`
 * 之外没法从提交信息侧感知；写下来又会漏。commit-msg 是唯一能稳定
 * 看到最终提交信息、又能在落盘前改它的位置。
 *
 * 用法（git 传入待写入的提交信息文件路径）：
 *   node scripts/hooks/strip-ai-trailers.mjs .git/COMMIT_EDITMSG
 *
 * 退出码恒为 0：这是清理，不是拦截。拦下来只会逼人 --no-verify，
 * 而 --no-verify 会连带跳过所有别的检查。
 */
import { readFileSync, writeFileSync, realpathSync } from "node:fs";

/**
 * 要剥掉的尾注。只匹配工具署名，不碰真人的 Co-authored-by。
 *
 * 判据是名字或邮箱命中工具特征，而不是凡 Co-authored-by 就删。
 * 后者会把结对编程时真人协作者的署名一起删掉。
 */
const AI_SIGNATURES = [
  /cursoragent@cursor\.com/i,
  /^\s*co-authored-by:\s*cursor\b/i,
  /^\s*co-authored-by:\s*(github\s+)?copilot\b/i,
  /^\s*co-authored-by:\s*claude(\s+code)?\b/i,
  /^\s*co-authored-by:\s*(windsurf|codeium|devin|aider)\b/i,
  /^\s*(?:🤖\s*)?generated\s+(?:with|by)\s+\[?\s*(cursor|copilot|claude|codeium)/i,
];

/** 这一行是不是该删的尾注 */
export function isAiTrailer(line) {
  return AI_SIGNATURES.some((re) => re.test(line));
}

/**
 * 从提交信息里移除工具尾注。
 *
 * 只处理最后一个段落。正文中间偶然提到 Co-authored-by 的说明文字不能被误删。
 *
 * @param {string} message 完整提交信息
 * @returns {{ message: string, removed: string[] }}
 */
export function stripAiTrailers(message) {
  const eol = message.includes("\r\n") ? "\r\n" : "\n";
  const lines = message.split(/\r?\n/);

  /*
   * 只看最后一个段落。正文与尾部页脚之间一定有换行分隔。
   * Generated with 不是 Key: value 形态，从尾部按 trailer 语法往上扫会漏掉它。
   */
  let end = lines.length - 1;
  while (end >= 0 && lines[end].trim() === "") end--;
  if (end < 0) return { message, removed: [] };

  let start = end;
  while (start > 0 && lines[start - 1].trim() !== "") start--;

  const removed = [];
  const kept = [];
  for (let i = start; i <= end; i++) {
    if (isAiTrailer(lines[i])) removed.push(lines[i]);
    else kept.push(lines[i]);
  }
  if (removed.length === 0) return { message, removed: [] };

  const head = lines.slice(0, start);
  while (head.length && head[head.length - 1].trim() === "") head.pop();

  const out = kept.length ? [...head, "", ...kept] : head;
  return { message: out.join(eol) + eol, removed };
}

/** 命令行入口 */
function main() {
  const file = process.argv[2];
  if (!file) {
    process.exit(0);
  }

  const original = readFileSync(file, "utf8");
  const { message, removed } = stripAiTrailers(original);
  if (removed.length === 0) process.exit(0);

  writeFileSync(file, message, "utf8");
  process.stderr.write(`[commit-msg] 已移除 ${removed.length} 条协作尾注（约定：不加工具署名）\n`);
  for (const line of removed) process.stderr.write(`[commit-msg]   - ${line.trim()}\n`);
}

const entry = process.argv[1];
if (entry) {
  let same = false;
  try {
    same = realpathSync(entry) === realpathSync(new URL(import.meta.url));
  } catch {
    same = false;
  }
  if (same) main();
}

export { main };
