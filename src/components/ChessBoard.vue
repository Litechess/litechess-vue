<script setup lang="ts">

import { BoardApi, TheChessboard, type BoardConfig, type MoveEvent } from 'vue3-chessboard'
import 'vue3-chessboard/style.css'

interface Props {
  boardCreated?: (api: BoardApi) => void
  playerColor?: "white" | "black" | undefined
  move?: (move: MoveEvent) => void
  boardConfig?: BoardConfig
}

const props = defineProps<Props>();

const onCreated = (api: BoardApi) => {
  props.boardCreated?.(api)
}

const onMoved = (move: MoveEvent) => {
  props.move?.(move)
}

</script>

<template>
  <TheChessboard
  style="min-width: 280px"
  reactive-config
  :player-color="props.playerColor"
  :board-config="props.boardConfig"
  @board-created="onCreated"
  @move="onMoved"/>
</template>

<style scoped>

</style>
