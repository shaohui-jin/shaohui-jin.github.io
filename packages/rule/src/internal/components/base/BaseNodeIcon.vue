<template>
  <svg :width="size" :height="size" viewBox="0 0 32 32">
    <rect x="6" y="6" width="20" height="20" rx="6" :fill="iconColor" />
    <text x="16" y="21" text-anchor="middle" font-size="14" fill="#fff">{{ iconText }}</text>
  </svg>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue'

interface Props {
  type?: string
  logicType?: string
  size?: number
}

const props = withDefaults(defineProps<Props>(), {
  size: 24
})

const colors = ['#722ed1', '#eb2f96', '#faad14', '#1890ff']
const iconColor = ref()
const iconText = ref()
watchEffect(() => {
  iconColor.value = colors[Math.floor(Math.random() * colors.length)]

  iconText.value = props.type
    ?.split('_')
    .map(e => e.substr(0, 1))
    .join('')
    .toLocaleUpperCase()
})
</script>

<style scoped>
svg {
  display: inline-block;
  vertical-align: middle;
}
</style>
