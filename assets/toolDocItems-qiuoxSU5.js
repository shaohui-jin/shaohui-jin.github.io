const e={rgbaToHex:{key:"rgbaToHex",name:"rgbaToHex",desc:"将 rgba/rgb 颜色字符串转为十六进制颜色值",signature:"declare const rgbaToHex: (color: string) => string;",usage:`import { rgbaToHex } from "jsh-tool/color";

rgbaToHex("rgba(255, 0, 0, 1)");   // "#ff0000"
rgbaToHex("rgb(0, 128, 255)");     // "#0080ff"`,api:[{name:"color",type:"string",default:"—",required:!0,desc:"rgba 或 rgb 颜色字符串"},{name:"返回值",type:"string",default:"—",required:!0,desc:"十六进制颜色字符串，如 #ff0000"}]},hexToRGBA:{key:"hexToRGBA",name:"hexToRGBA",desc:"将十六进制颜色转为 rgba 字符串",signature:"declare const hexToRGBA: (hex: string, alpha?: number) => string;",usage:`import { hexToRGBA } from "jsh-tool/color";

hexToRGBA("#ff0000", 1);    // "rgba(255, 0, 0, 1)"
hexToRGBA("#ff0000");       // "rgb(255, 0, 0)"`,api:[{name:"hex",type:"string",default:"—",required:!0,desc:"十六进制颜色字符串 #RRGGBB"},{name:"alpha",type:"number",default:"—",required:!1,desc:"可选，透明度 0~1"},{name:"返回值",type:"string",default:"—",required:!0,desc:"rgba 或 rgb 字符串"}]},colorToRGBA:{key:"colorToRGBA",name:"colorToRGBA",desc:"将十六进制颜色转为 { r, g, b } 对象",signature:"declare const colorToRGBA: (hex: string) => { r: number; g: number; b: number };",usage:`import { colorToRGBA } from "jsh-tool/color";

colorToRGBA("#ff5733");  // { r: 255, g: 87, b: 51 }`,api:[{name:"hex",type:"string",default:"—",required:!0,desc:"十六进制颜色字符串"},{name:"返回值",type:"{ r: number; g: number; b: number }",default:"—",required:!0,desc:"RGB 对象"}]},getRandom:{key:"getRandom",name:"getRandom",desc:"获取指定范围内的随机整数",signature:"declare const getRandom: (min: number, max: number) => number;",usage:`import { getRandom } from "jsh-tool/number";

getRandom(1, 10);   // 1~10 随机整数
getRandom(0, 100);  // 0~100 随机整数`,api:[{name:"min",type:"number",default:"—",required:!0,desc:"最小值"},{name:"max",type:"number",default:"—",required:!0,desc:"最大值"},{name:"返回值",type:"number",default:"—",required:!0,desc:"范围内随机整数"}]},scaleFormat:{key:"scaleFormat",name:"scaleFormat",desc:"格式化小数，解决浮点精度问题",signature:"declare const scaleFormat: (value?: string, scale?: number) => string;",usage:`import { scaleFormat } from "jsh-tool/number";

scaleFormat((0.1 + 0.2).toString());  // "0.30"
scaleFormat("3.14159", 3);            // "3.142"`,api:[{name:"value",type:"string",default:'"0"',required:!1,desc:"待格式化数据"},{name:"scale",type:"number",default:"2",required:!1,desc:"保留小数位数"},{name:"返回值",type:"string",default:"—",required:!0,desc:"格式化后的字符串"}]},flattenObj:{key:"flattenObj",name:"flattenObj",desc:"对象扁平化，将嵌套对象转为单层 key.path 格式",signature:"declare const flattenObj: (obj: Record<string, any>, prefix?: string) => Record<string, any>;",usage:`import { flattenObj } from "jsh-tool/object";

flattenObj({ a: { b: 1 }, c: 2 });
// { "a.b": 1, "c": 2 }

flattenObj({ a: { b: 1 } }, "prefix");
// { "prefix.a.b": 1 }`,api:[{name:"obj",type:"Record<string, any>",default:"—",required:!0,desc:"需要扁平化的对象"},{name:"prefix",type:"string",default:'""',required:!1,desc:"键名前缀"},{name:"返回值",type:"Record<string, any>",default:"—",required:!0,desc:"扁平化后的单层对象"}]},unFlatten:{key:"unFlatten",name:"unFlatten",desc:"扁平化还原，将 key.path 格式还原为嵌套对象",signature:"declare const unFlatten: (obj: Record<string, any>) => Record<string, any>;",usage:`import { unFlatten } from "jsh-tool/object";

unFlatten({ "a.b": 1, c: 2 });
// { a: { b: 1 }, c: 2 }`,api:[{name:"obj",type:"Record<string, any>",default:"—",required:!0,desc:"扁平化的对象"},{name:"返回值",type:"Record<string, any>",default:"—",required:!0,desc:"还原后的嵌套对象"}]},isObjEqual:{key:"isObjEqual",name:"isObjEqual",desc:"深度比较两个对象是否相同",signature:"declare function isObjEqual(obj1: Record<string, any>, obj2: Record<string, any>): boolean;",usage:`import { isObjEqual } from "jsh-tool/object";

isObjEqual({ a: 1, b: { c: 2 } }, { a: 1, b: { c: 2 } });  // true
isObjEqual({ a: 1 }, { a: 2 });                              // false`,api:[{name:"obj1",type:"Record<string, any>",default:"—",required:!0,desc:"对象一"},{name:"obj2",type:"Record<string, any>",default:"—",required:!0,desc:"对象二"},{name:"返回值",type:"boolean",default:"—",required:!0,desc:"是否相同"}]},isObjEmpty:{key:"isObjEmpty",name:"isObjEmpty",desc:"判断对象是否为空",signature:"declare const isObjEmpty: (obj: Record<string, any>) => boolean;",usage:`import { isObjEmpty } from "jsh-tool/object";

isObjEmpty({});        // true
isObjEmpty({ a: 1 }); // false`,api:[{name:"obj",type:"Record<string, any>",default:"—",required:!0,desc:"需要判断的对象"},{name:"返回值",type:"boolean",default:"—",required:!0,desc:"是否为空"}]},flattenTree:{key:"flattenTree",name:"flattenTree",desc:"树形集合扁平化，递归展开 children 为一维数组",signature:"declare const flattenTree: (arr: any[], childrenKey?: string) => any[];",usage:`import { flattenTree } from "jsh-tool/array";

flattenTree([
  { name: "A", children: [{ name: "B" }, { name: "C" }] },
  { name: "D", children: [] },
]);
// [{ name: "A", children: [...] }, { name: "B" }, { name: "C" }, { name: "D", children: [] }]`,api:[{name:"arr",type:"any[]",default:"—",required:!0,desc:"树形数组"},{name:"childrenKey",type:"string",default:'"children"',required:!1,desc:"子节点字段名"},{name:"返回值",type:"any[]",default:"—",required:!0,desc:"扁平化后的数组"}]},isArrEqual:{key:"isArrEqual",name:"isArrEqual",desc:"比较两个基础类型数组是否包含相同元素（无序）",signature:"declare function isArrEqual(arr1: Array<string | number>, arr2: Array<string | number>): boolean;",usage:`import { isArrEqual } from "jsh-tool/array";

isArrEqual([1, 2, 3], [3, 2, 1]);  // true
isArrEqual([1, 2], [1, 3]);        // false`,api:[{name:"arr1",type:"Array<string | number>",default:"—",required:!0,desc:"数组一"},{name:"arr2",type:"Array<string | number>",default:"—",required:!0,desc:"数组二"},{name:"返回值",type:"boolean",default:"—",required:!0,desc:"是否相同"}]},copyToClipboard:{key:"copyToClipboard",name:"copyToClipboard",desc:"复制文本到剪贴板，使用 Clipboard API + execCommand fallback",signature:"declare const copyToClipboard: (text: string) => Promise<boolean>;",usage:`import { copyToClipboard } from "jsh-tool/clipboard";

const success = await copyToClipboard("要复制的文本");
if (success) console.log("复制成功");`,api:[{name:"text",type:"string",default:"—",required:!0,desc:"要复制的文本"},{name:"返回值",type:"Promise<boolean>",default:"—",required:!0,desc:"是否成功"}]},debounce:{key:"debounce",name:"debounce",desc:"防抖函数，延迟执行直到停止触发",signature:`declare const debounce: (
  fn: (...args: any[]) => any,
  delay?: number,
  immediate?: boolean
) => (...args: any[]) => void;`,usage:`import { debounce } from "jsh-tool/debounce";

const handleResize = debounce(() => {
  console.log("resize settled");
}, 300);

// 第三个参数 true 表示首次立即执行
const handleClick = debounce(fn, 500, true);`,api:[{name:"fn",type:"(...args: any[]) => any",default:"—",required:!0,desc:"需要防抖的函数"},{name:"delay",type:"number",default:"300",required:!1,desc:"延迟时间（ms）"},{name:"immediate",type:"boolean",default:"false",required:!1,desc:"是否首次立即执行"},{name:"返回值",type:"(...args: any[]) => void",default:"—",required:!0,desc:"防抖后的函数"}]},useDebounceRef:{key:"useDebounceRef",name:"useDebounceRef",desc:"防抖响应式 ref，set 操作延迟触发更新",signature:"declare const useDebounceRef: <T>(value: T, delay?: number) => Ref<T>;",usage:`import { useDebounceRef } from "jsh-tool/debounce";

const keyword = useDebounceRef("", 500);
// keyword.value = "abc" → 500ms 后才触发依赖更新`,api:[{name:"value",type:"T",default:"—",required:!0,desc:"初始值"},{name:"delay",type:"number",default:"300",required:!1,desc:"延迟时间（ms）"},{name:"返回值",type:"Ref<T>",default:"—",required:!0,desc:"防抖 ref"}]},performChunk:{key:"performChunk",name:"performChunk",desc:"分片执行大任务，避免阻塞主线程导致页面卡顿",signature:`declare const performChunk: (
  data: number | any[],
  taskHandler: (item: any, index: number) => void,
  scheduler: (run: (goOn: () => boolean) => void) => void
) => void;`,usage:`import { performChunk } from "jsh-tool/optimize";

performChunk(100000, (item, i) => {
  // 每项任务处理
}, (task) => {
  requestAnimationFrame(() => {
    const start = performance.now();
    task(() => performance.now() - start < 16);
  });
});`,api:[{name:"data",type:"number | any[]",default:"—",required:!0,desc:"任务数据（数字=执行次数，数组=遍历）"},{name:"taskHandler",type:"(item, index) => void",default:"—",required:!0,desc:"每项任务的处理函数"},{name:"scheduler",type:"(run) => void",default:"—",required:!0,desc:"调度器，控制执行时机"}]},concurRequest:{key:"concurRequest",name:"concurRequest",desc:"并发请求控制，限制最大同时请求数",signature:"declare const concurRequest: (urls?: string[], maxNum?: number) => Promise<Response[]>;",usage:`import { concurRequest } from "jsh-tool/optimize";

const results = await concurRequest([
  "/api/data1",
  "/api/data2",
  "/api/data3",
  "/api/data4",
], 2);  // 最大2个并发`,api:[{name:"urls",type:"string[]",default:"[]",required:!1,desc:"请求 URL 列表"},{name:"maxNum",type:"number",default:"3",required:!1,desc:"最大并发数"},{name:"返回值",type:"Promise<Response[]>",default:"—",required:!0,desc:"所有响应结果"}]},usePermission:{key:"usePermission",name:"usePermission",desc:"权限管理 hook，基于位运算实现高性能权限判断",signature:`declare const usePermission: <T extends readonly string[]>(permissions: T) => {
  getPermission: (p: Array<T[number]>) => number;
  hasPermission: (v: number, p: T[number]) => boolean;
  switchPermission: (v: number, p: T[number]) => number;
};`,usage:`import { usePermission } from "jsh-tool/permission";

const perms = ["add", "edit", "delete", "view"] as const;
const { getPermission, hasPermission, switchPermission } = usePermission(perms);

let v = getPermission(["add", "edit"]);  // 3
hasPermission(v, "add");                 // true
v = switchPermission(v, "add");          // 2
hasPermission(v, "add");                 // false`,api:[{name:"permissions",type:"readonly string[]",default:"—",required:!0,desc:"权限字段列表"},{name:"返回值.getPermission",type:"(p: string[]) => number",default:"—",required:!0,desc:"根据字段列表获取权限值"},{name:"返回值.hasPermission",type:"(v, p) => boolean",default:"—",required:!0,desc:"判断是否拥有某权限"},{name:"返回值.switchPermission",type:"(v, p) => number",default:"—",required:!0,desc:"切换某权限（异或）"}]},getValue:{key:"getValue",name:"getValue<T>",desc:"TypeScript 类型体操：将对象属性转为 getter 方法类型",implementation:"type getValue<T> = {\n  [K in keyof T as `get${Capitalize<K & string>}`]: T[K];\n};",usage:`import type { getValue } from "jsh-tool/typescript";

interface User { age: number; name: string; }
type Getters = getValue<User>;
// { getAge: number; getName: string; }`,api:[{name:"T",type:"泛型参数",default:"—",required:!0,desc:"源对象类型"},{name:"结果",type:"映射类型",default:"—",required:!0,desc:"属性名加 get 前缀并首字母大写"}]},setValue:{key:"setValue",name:"setValue<T>",desc:"TypeScript 类型体操：将对象属性转为 setter 方法类型",implementation:"type setValue<T> = {\n  [K in keyof T as `set${Capitalize<K & string>}`]: T[K];\n};",usage:`import type { setValue } from "jsh-tool/typescript";

interface User { age: number; name: string; }
type Setters = setValue<User>;
// { setAge: number; setName: string; }`,api:[{name:"T",type:"泛型参数",default:"—",required:!0,desc:"源对象类型"},{name:"结果",type:"映射类型",default:"—",required:!0,desc:"属性名加 set 前缀并首字母大写"}]},getOptional:{key:"getOptional",name:"getOptional<T>",desc:"TypeScript 类型体操：提取对象中所有可选属性",implementation:`type getOptional<T> = {
  [K in keyof T as T[K] extends Required<T>[K] ? never : K]: T[K];
};`,usage:`import type { getOptional } from "jsh-tool/typescript";

interface Config { host: string; port?: number; debug?: boolean; }
type Opts = getOptional<Config>;
// { port?: number; debug?: boolean; }`,api:[{name:"T",type:"泛型参数",default:"—",required:!0,desc:"源对象类型"},{name:"结果",type:"条件映射类型",default:"—",required:!0,desc:"仅包含可选属性"}]},setOptional:{key:"setOptional",name:"setOptional<T, K>",desc:"TypeScript 类型体操：将指定属性设为可选",implementation:"type setOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;",usage:`import type { setOptional } from "jsh-tool/typescript";

interface User { name: string; age: number; email: string; }
type Relaxed = setOptional<User, "age" | "email">;
// { name: string; age?: number; email?: string; }`,api:[{name:"T",type:"泛型参数",default:"—",required:!0,desc:"源对象类型"},{name:"K",type:"keyof T",default:"—",required:!0,desc:"要设为可选的属性联合"}]},arrayToUnion:{key:"arrayToUnion",name:"arrayToUnion<T>",desc:"TypeScript 类型体操：将 as const 数组转为联合类型",implementation:"type arrayToUnion<T extends readonly any[]> = T[number];",usage:`import type { arrayToUnion } from "jsh-tool/typescript";

const modes = ["add", "edit", "view"] as const;
type Mode = arrayToUnion<typeof modes>;
// "add" | "edit" | "view"`,api:[{name:"T",type:"readonly any[]",default:"—",required:!0,desc:"as const 数组类型"},{name:"结果",type:"联合类型",default:"—",required:!0,desc:"数组元素的联合"}]},getCompType:{key:"getCompType",name:"getCompType",desc:"获取组件实例 ref 类型的语法糖函数",signature:"declare function getCompType<T extends abstract new (...args: any) => any>(_comp: T): Ref<InstanceType<T>>;",usage:`import { getCompType } from "jsh-tool/typescript";
import { ElForm } from "element-plus";

const formRef = getCompType(ElForm);
// 等价于 ref<InstanceType<typeof ElForm>>()
await formRef.value?.validate();`,api:[{name:"_comp",type:"组件构造函数",default:"—",required:!0,desc:"Vue 组件"},{name:"返回值",type:"Ref<InstanceType<T>>",default:"—",required:!0,desc:"组件实例 ref"}]}};export{e as t};
