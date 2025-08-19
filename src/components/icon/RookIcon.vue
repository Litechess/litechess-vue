<script setup lang="ts">
import type { PlayerColor } from '@/types/ChessParty';
import { NIcon } from 'naive-ui';
const props = defineProps<{
  color: PlayerColor
}>();

const styleColor = props.color == "w" ? "#0a0a0a" : "#d9dede"
</script>

<template>
  <n-icon size="18" :color="styleColor">
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 384 512"><path d="M368 32h-56a16 16 0 0 0-16 16v48h-48V48a16 16 0 0 0-16-16h-80a16 16 0 0 0-16 16v48H88.1V48a16 16 0 0 0-16-16H16A16 16 0 0 0 0 48v176l64 32c0 48.33-1.54 95-13.21 160h282.42C321.54 351 320 303.72 320 256l64-32V48a16 16 0 0 0-16-16zM224 320h-64v-64a32 32 0 0 1 64 0zm144 128H16a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h352a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16z" fill="currentColor"></path></svg>
  </n-icon>
</template>
