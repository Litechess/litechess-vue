<script setup lang="ts">
import type { PlayerSide } from '@/types/ChessParty';
import { NFlex, NCountdown, type CountdownProps } from 'naive-ui'
import { h } from 'vue';

interface Props {
  duration?: number
  color?: PlayerSide
  active: boolean
}

defineProps<Props>();
const renderTimes: CountdownProps['render'] = ({
  minutes,
  seconds
}) => {
  return [
    h('span', [String(minutes).padStart(2, '0')]),
    ':',
    h('span', [String(seconds).padStart(2, '0')]),
  ]
}
</script>

<template>
  <n-flex :class="{ inactive: !active }" style="background-color: #2b2b2b; font-size: 2em; color: #c2c0c0; border-radius: 5px;">
    <n-countdown
      :render="renderTimes"
      :duration="duration ? duration : 0"
      :active="active"/>
  </n-flex>
</template>

<style scoped>
.inactive {
  opacity: 0.5;
  pointer-events: none; /* чтобы нельзя было взаимодействовать */
}
</style>
