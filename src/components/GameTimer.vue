<script setup lang="ts">
import type { PlayerSide } from '@/types/ChessParty';
import { NFlex, NCountdown, type CountdownProps, type CountdownTimeInfo } from 'naive-ui'
import { h } from 'vue';

interface Props {
  duration: number
  color?: PlayerSide
  active: boolean
  onFinish?: () => void
}

defineProps<Props>();
const renderTimes: CountdownProps['render'] = ({
  hours,
  minutes,
  seconds,
  milliseconds,
}: CountdownTimeInfo) => {
  const totalMilliseconds = (
    hours * 3600000
    + minutes * 60000
    + seconds * 1000
    + milliseconds
  )
  const totalSeconds = Math.round(totalMilliseconds / 1000)
  const displayMinutes = Math.floor(totalSeconds / 60)
  const displaySeconds = totalSeconds % 60

  return [
    h('span', [String(displayMinutes).padStart(2, '0')]),
    ':',
    h('span', [String(displaySeconds).padStart(2, '0')]),
  ]
}

</script>

<template>
  <n-flex :class="{ inactive: !active }" style="background-color: #2b2b2b; font-size: 2em; color: #c2c0c0; border-radius: 5px;">
    <n-countdown
      :precision="3"
      :render="renderTimes"
      :duration="duration"
      :on-finish="onFinish"
      :active="active"/>
  </n-flex>
</template>

<style scoped>
.inactive {
  opacity: 0.5;
  pointer-events: none; /* чтобы нельзя было взаимодействовать */
}
</style>
