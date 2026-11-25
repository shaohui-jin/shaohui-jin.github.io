import { inject } from "vue";
import { LIB_PLUGIN_KEY } from "./configInjection";

/** 读写主题配置的句柄；未安装插件时返回 null */
export function useLibPlugin() {
  return inject(LIB_PLUGIN_KEY, null);
}
