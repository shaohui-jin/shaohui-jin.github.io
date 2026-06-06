import { writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outFile = resolve(__dirname, "../dist/index.d.ts");

const content = `import type { DefineComponent } from "vue";

export declare const JsDocEditor: DefineComponent<
  Record<string, never>,
  Record<string, never>,
  unknown
>;

export declare const WorkflowDesigner: DefineComponent<
  Record<string, never>,
  Record<string, never>,
  unknown
>;
`;

writeFileSync(outFile, content, "utf8");
console.log("[jsh-rule] generated", outFile);
