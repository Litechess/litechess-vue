<script setup lang="ts">
import type { ChessParty, PlayerInfo, PlayerSide, Timer } from '@/types/ChessParty'
import BoardView from './BoardView.vue'
import PlayerArea from './PlayerArea.vue'
import { computed, inject, ref, type ComputedRef } from 'vue'
import type { BoardApi, MoveEvent } from 'vue3-chessboard'
import { BoardKey } from '@/composables/useBoard'
import { NFlex } from 'naive-ui'

const props = defineProps<{
  whiteTimer?: Timer
  blackTimer?: Timer
  timerShow?: boolean
  orientation?: PlayerSide
  viewOnly?: boolean
  playerSide?: PlayerSide
  chessParty?: ChessParty
  onCreate?: (api: BoardApi) => void
  onMove?: (move: MoveEvent) => void
}>()

const boardState = inject(BoardKey, undefined)

const materialDiff: ComputedRef<number | undefined> = computed(() => {
  return boardState ? boardState.materialDiff.value : undefined
})

const takedPieceWhite: ComputedRef<readonly string[] | undefined> = computed(() => {
  return boardState ? boardState.takedPieceWhite.value : undefined
})

const takedPieceBlack: ComputedRef<readonly string[] | undefined> = computed(() => {
  return boardState ? boardState.takedPieceBlack.value : undefined
})

const chessParty = ref<ChessParty | undefined>(props.chessParty)

const playerInfoWhite: ComputedRef<PlayerInfo | undefined> = computed(() =>
  chessParty.value ? chessParty.value.white : undefined,
)
const playerInfoBlack: ComputedRef<PlayerInfo | undefined> = computed(() =>
  chessParty.value ? chessParty.value.black : undefined,
)
const gameId: ComputedRef<string | undefined> = computed(() =>
  chessParty.value ? chessParty.value.id : undefined,
)
const timerShow: ComputedRef<boolean> = computed(() => {
  return props.timerShow ?? false
})
</script>

<template>
  <n-flex justify="center" :style="{ flexDirection: playerSide === 'black' ? 'column-reverse' : 'column' }">
    <player-area
      :player-info="playerInfoWhite"
      color="black"
      :material-diff="materialDiff"
      :pieces="takedPieceBlack"
      :timer="props.blackTimer"
      :timer-show="timerShow"
    />
    <board-view
      :player-side="props.playerSide"
      :orientation="props.orientation"
      :view-only="props.viewOnly"
      :game-id="gameId"
      :on-create="props.onCreate"
      :on-move="props.onMove"
    />
    <player-area
      :player-info="playerInfoBlack"
      color="white"
      :material-diff="materialDiff"
      :pieces="takedPieceWhite"
      :timer="props.whiteTimer"
      :timer-show="timerShow"
    />
  </n-flex>
</template>
