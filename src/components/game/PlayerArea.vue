<script setup lang="ts">
import PlayerBoardInfo from './PlayerBoardInfo.vue'
import GameTimer from '../GameTimer.vue'
import type { PlayerInfo, PlayerSide, Timer } from '@/types/ChessParty'
import { NFlex } from 'naive-ui'
import { computed } from 'vue'

const props = defineProps<{
  playerInfo?: PlayerInfo | null
  color?: PlayerSide
  pieces?: readonly string[]
  materialDiff?: number
  timerShow?: boolean
  timer?: Timer
  onTimerFinish?: (side: PlayerSide) => void
}>()

const DEFAULT_COLOR: PlayerSide = 'white'
const DEFAULT_PIECES: string[] = []
const DEFAULT_MATERIAL_DIFF: number = 0
const DEFAULT_SHOW_TIMER: boolean = false
const DEFAULT_TIMER_VALUE: number = 0
const DEFAULT_ACTIVE_TIMER: boolean = false

const color = computed<PlayerSide>(() => {
  return props.color ?? DEFAULT_COLOR
})
const pieces = computed<readonly string[]>(() => {
  return props.pieces ?? DEFAULT_PIECES
})
const materialDiff = computed<number>(() => {
  return props.materialDiff ?? DEFAULT_MATERIAL_DIFF
})
const playerInfo = computed<PlayerInfo>(() => {
  return (
    props.playerInfo ?? {
      id: '',
      name: color.value === 'white' ? 'White Player' : 'Black Player',
    }
  )
})
const timerShow = computed<boolean>(() => {
  return props.timerShow ?? DEFAULT_SHOW_TIMER
})
const timerValue = computed<number>(() => {
  return props.timer ? props.timer.duration : DEFAULT_TIMER_VALUE
})
const timerActive = computed<boolean>(() => {
  return props.timer ? props.timer.active : DEFAULT_ACTIVE_TIMER
})

const onTimerFinished = () => {
  props.onTimerFinish?.(color.value)
}

const userId = computed(() => {
  return props.playerInfo?.id
})

</script>

<template>
  <n-flex justify="space-between">
    <player-board-info
      :user-id="userId"
      :color="color"
      :name="playerInfo.name"
      avatar="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
      :pieces="pieces"
      :materialDiff="materialDiff"
    />
    <game-timer
      v-if="timerShow"
      :active="timerActive"
      :duration="timerValue"
      :key="timerValue"
      :on-finish="onTimerFinished"
    />
  </n-flex>
</template>
