/**
 * strip-ai-trailers 的边界测试。
 *
 * 正文里出现 Co-authored-by 字样不能被删。
 * 真人的 Co-authored-by 必须保留。
 * 删完后不能留多余空行。
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { stripAiTrailers, isAiTrailer } from "./strip-ai-trailers.mjs";

test("剥掉工具尾注，正文保持不变", () => {
  const input = [
    "fix: 修一个问题",
    "",
    "这里是正文，解释为什么。",
    "",
    "Co-authored-by: Cursor <cursoragent@cursor.com>",
    "",
  ].join("\n");

  const { message, removed } = stripAiTrailers(input);
  assert.equal(removed.length, 1);
  assert.equal(message, "fix: 修一个问题\n\n这里是正文，解释为什么。\n");
});

test("没有尾注时原样返回", () => {
  const input = "feat: 加一个功能\n\n正文。\n";
  const { message, removed } = stripAiTrailers(input);
  assert.deepEqual(removed, []);
  assert.equal(message, input);
});

test("保留真人的 Co-authored-by", () => {
  const input = ["feat: 结对完成", "", "Co-authored-by: 张三 <zhangsan@example.com>", ""].join(
    "\n",
  );

  const { message, removed } = stripAiTrailers(input);
  assert.deepEqual(removed, []);
  assert.match(message, /zhangsan@example\.com/);
});

test("工具与真人尾注并存时只删工具那条", () => {
  const input = [
    "feat: 结对完成",
    "",
    "Co-authored-by: 张三 <zhangsan@example.com>",
    "Co-authored-by: Cursor <cursoragent@cursor.com>",
    "",
  ].join("\n");

  const { message, removed } = stripAiTrailers(input);
  assert.equal(removed.length, 1);
  assert.match(message, /zhangsan@example\.com/);
  assert.doesNotMatch(message, /cursoragent/i);
  assert.equal(message, "feat: 结对完成\n\nCo-authored-by: 张三 <zhangsan@example.com>\n");
});

test("正文中间提到 Co-authored-by 不被误删", () => {
  const input = [
    "docs: 说明提交约定",
    "",
    "不写 Co-authored-by: Cursor 这类尾注，Author 只留仓库主人。",
    "",
  ].join("\n");

  const { message, removed } = stripAiTrailers(input);
  assert.deepEqual(removed, []);
  assert.equal(message, input);
});

test("正文本身以 Key: value 结尾也不误伤", () => {
  const input = ["fix: 修配置", "", "注意: 这一行不是尾注，是正文的一部分。", ""].join("\n");

  const { removed } = stripAiTrailers(input);
  assert.deepEqual(removed, []);
});

test("Generated with 页脚也会被剥掉", () => {
  const input = ["feat: 某功能", "", "Generated with [Cursor](https://cursor.com)", ""].join("\n");

  const { message, removed } = stripAiTrailers(input);
  assert.equal(removed.length, 1);
  assert.equal(message, "feat: 某功能\n");
});

test("CRLF 输入保持 CRLF", () => {
  const input = "fix: 修\r\n\r\nCo-authored-by: Cursor <cursoragent@cursor.com>\r\n";
  const { message, removed } = stripAiTrailers(input);
  assert.equal(removed.length, 1);
  assert.equal(message, "fix: 修\r\n");
});

test("多条工具尾注一次清空", () => {
  const input = [
    "feat: 一堆",
    "",
    "Co-authored-by: Cursor <cursoragent@cursor.com>",
    "Co-authored-by: Copilot <noreply@github.com>",
    "",
  ].join("\n");

  const { message, removed } = stripAiTrailers(input);
  assert.equal(removed.length, 2);
  assert.equal(message, "feat: 一堆\n");
});

test("isAiTrailer 只认工具署名", () => {
  assert.equal(isAiTrailer("Co-authored-by: Cursor <cursoragent@cursor.com>"), true);
  assert.equal(isAiTrailer("Co-authored-by: 李四 <lisi@example.com>"), false);
  assert.equal(isAiTrailer("Signed-off-by: jsh <x@example.com>"), false);
});
