<script setup lang="ts">
import ChessBoard from '../ChessBoard.vue'
import { type PlayerSide } from '@/types/ChessParty'
import { computed, reactive } from 'vue'
import { BoardApi, type BoardConfig, type MoveEvent } from 'vue3-chessboard'

const props = defineProps<{
  gameId?: string
  playerSide?: PlayerSide
  viewOnly?: boolean
  orientation?: PlayerSide
  onCreate?: (api: BoardApi) => void
  onMove?: (move: MoveEvent) => void
}>()

const DEFAULT_ID: string = '0'
const DEFAULT_VIEW_ONLY: boolean = false
const DEFAULT_ORIENTATION: PlayerSide = 'white'

const orientation = computed<PlayerSide>(() => {
  return props.orientation ?? DEFAULT_ORIENTATION
})
const isViewOnly = computed(() => {
  return props.viewOnly ?? DEFAULT_VIEW_ONLY
})
const gameId = computed(() => {
  return props.gameId ?? DEFAULT_ID
})
const boardKey = computed(() => {
  return props.playerSide ? `${gameId.value}-${props.playerSide}` : gameId.value
})

const boardConfig = reactive<BoardConfig>({
  get orientation() {
    return orientation.value
  },

  get viewOnly() {
    return isViewOnly.value
  },
})

function onCreated(api: BoardApi) {
  props.onCreate?.(api)
}

function onMoved(move: MoveEvent) {
  props.onMove?.(move)
}
</script>

<template>
  <chess-board
    :player-color="playerSide"
    :board-config="boardConfig"
    :board-created="onCreated"
    :move="onMoved"
    :key="boardKey"
  />
</template>
