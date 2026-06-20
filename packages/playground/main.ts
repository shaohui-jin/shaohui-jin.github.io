import { createApp } from "vue";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import { createCompLib, elementPlusLocale } from "jsh-core";
import { BaseTable } from "jsh-comp";
import "jsh-rule/style.css";
import App from "./App.vue";

const lib = createCompLib({}, { enabled: true, key: "comp-lib-demo" });

const app = createApp(App);
app.use(ElementPlus, { locale: elementPlusLocale });
app.use(lib);
app.component("BaseTable", BaseTable);
app.provide("compLib", lib);
app.mount("#app");
