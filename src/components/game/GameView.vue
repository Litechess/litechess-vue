<script setup lang="ts">
import type { ChessParty, PlayerSide, Timer } from '@/types/ChessParty'
import BoardView from './BoardView.vue'
import PlayerArea from './PlayerArea.vue'
import { computed, inject } from 'vue'
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
  onTimerFinish?: (side: PlayerSide) => void
}>()

const boardState = inject(BoardKey, undefined)

const materialDiff = computed(() => {
  return boardState ? boardState.materialDiff.value : undefined
})

const takedPieceWhite = computed(() => {
  return boardState ? boardState.takedPieceWhite.value : undefined
})

const takedPieceBlack = computed(() => {
  return boardState ? boardState.takedPieceBlack.value : undefined
})

const playerInfoWhite = computed(() =>
  props.chessParty ? props.chessParty.white : undefined,
)
const playerInfoBlack = computed(() =>
  props.chessParty ? props.chessParty.black : undefined,
)
const gameId = computed(() =>
  props.chessParty ? props.chessParty.id : undefined,
)
const timerShow = computed(() => {
  return props.timerShow ?? false
})

let boardApi: BoardApi
const onCreated = (api: BoardApi) => {
  boardState?.setBoardApi(api)
  boardApi = api
  if(props.chessParty) api.loadPgn(props.chessParty.moves.map((m) => m.san).join(' '))
  props.onCreate?.(api)
}

const onMoved = (move: MoveEvent) => {
  boardApi.stopViewingHistory()
  boardState?.updateState()
  props.onMove?.(move)
}

</script>

<template>
  <n-flex justify="center" :style="{ flexDirection: playerSide === 'black' ? 'column-reverse' : 'column' }">
    <player-area
      :player-info="playerInfoBlack"
      color="black"
      :material-diff="materialDiff"
      :pieces="takedPieceBlack"
      :timer="props.blackTimer"
      :timer-show="timerShow"
      :on-timer-finish="props.onTimerFinish"
    />
    <board-view
      :player-side="props.playerSide"
      :orientation="props.orientation"
      :view-only="props.viewOnly"
      :game-id="gameId"
      :on-create="onCreated"
      :on-move="onMoved"
    />
    <player-area
      :player-info="playerInfoWhite"
      color="white"
      :material-diff="materialDiff"
      :pieces="takedPieceWhite"
      :timer="props.whiteTimer"
      :timer-show="timerShow"
      :on-timer-finish="props.onTimerFinish"
    />
  </n-flex>
</template>
