import { createApp } from "vue";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import { createCompLib, elementPlusLocale } from "@/app/core";
import { BaseTable } from "@/works/comp";
import "highlight.js/styles/github.css";
import App from "./App.vue";

const lib = createCompLib({}, { enabled: true, key: "comp-lib-demo" });

const app = createApp(App);
app.use(ElementPlus, { locale: elementPlusLocale });
app.use(lib);
app.component("BaseTable", BaseTable);
app.provide("compLib", lib);
app.mount("#app");
