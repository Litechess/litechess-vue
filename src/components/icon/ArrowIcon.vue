<script setup lang="ts">
import { NIcon } from 'naive-ui';

const props = defineProps<{
  rotated?: boolean
  size: number
}>();
</script>
:style="props.rotated ? 'transform: rotate(180deg);' : ''"
<template>
  <n-icon :size="size">
    <svg
      :style="props.rotated ? 'transform: rotate(180deg);' : ''"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24">
      <path
        d="M16.88 2.88a1.25 1.25 0 0 0-1.77 0L6.7 11.29a.996.996 0 0 0 0 1.41l8.41 8.41c.49.49 1.28.49 1.77 0s.49-1.28 0-1.77L9.54 12l7.35-7.35c.48-.49.48-1.28-.01-1.77z"
        fill="currentColor"/>
    </svg>
  </n-icon>
</template>
