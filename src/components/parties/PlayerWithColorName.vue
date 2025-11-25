<script setup lang="ts">
import type { PlayerSide } from '@/types/ChessParty';
import { computed } from 'vue';
import { NFlex } from 'naive-ui';
import { NIcon } from 'naive-ui';
import { NText } from 'naive-ui';

const props = defineProps<{
  color?: PlayerSide
  playerName?: string
  border?: boolean
}>();

const BLACK_COLOR_HEX = "#2c2e2c"
const WHITE_COLOR_HEX = "#c0c4c0"
const color = computed(() => {
  return props.color == "black" ? BLACK_COLOR_HEX : WHITE_COLOR_HEX
})

const playerName = computed(() => {
  return props.playerName
})

const iconBorder = computed(() => {
  return props.border ?? false;
})
const iconStyle = computed(() => {
  if (!iconBorder.value) return {}
  return {
    border: '2px solid #00ff00',
    borderRadius: '4px',
    display: 'inline-flex'
  }
})

</script>

<template>
  <n-flex align="center">
    <n-icon :style="iconStyle">
      <svg style="color: brown;" width="800px" height="800px" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--emojione" preserveAspectRatio="xMidYMid meet"><path :fill="color" d="M2 2h60v60H2z"></path></svg>
    </n-icon>
    <n-text> {{ playerName }} </n-text>
  </n-flex>
</template>
