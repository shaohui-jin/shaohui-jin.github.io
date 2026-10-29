---
title: Vue跟随系统主题切换
lang: zh-CN
date: 2025-05-22 16:26:31
permalink: /Tips/Vue/UseTheme/
---

```vue
<script setup lang="ts">
import { watchEffect } from "./vue";
import { ref } from "vue";

let theme = ref<'light' | 'dark' | 'OS'>('light')
const LOCAL_KEY = 'LOCAL_THEME'
const match =  window.matchMedia('prefers-color-scheme:light')

function followOS() {
  document.documentElement.dataset.theme = match.matches ? 'light' : 'dark'
}

watchEffect(() => {
  localStorage.setItem(LOCAL_KEY, theme.value)
  if (theme.value === 'OS') {
    // 特殊处理
    followOS()
    match.addEventListener('change', followOS)
  } else {
    document.documentElement.dataset.theme = theme.value
    match.removeEventListener('change', followOS)
  }
  
})

export default function useTheme() {
  return {
    theme
  }
}
</script>
```
