<script setup lang="ts">

import { useBoard, type BoardState } from '@/composables/useBoard'
import { BoardApi, TheChessboard, type BoardConfig, type MoveEvent } from 'vue3-chessboard'
import 'vue3-chessboard/style.css'

interface Props {
  boardCreated?: (api: BoardState) => void
  playerColor?: "white" | "black" | undefined
  move?: (move: MoveEvent) => void
  boardConfig?: BoardConfig
}

const props = defineProps<Props>();

const boardState = useBoard()

const onCreated = (api: BoardApi) => {
  boardState.setBoardApi(api)
  props.boardCreated?.(boardState)
}

const onMoved = (move: MoveEvent) => {
  boardState.updateState()
  props.move?.(move)
}

</script>

<template>
  <TheChessboard
  reactive-config
  :player-color="props.playerColor"
  :board-config="props.boardConfig"
  @board-created="onCreated"
  @move="onMoved"/>
</template>

<style scoped>

</style>
