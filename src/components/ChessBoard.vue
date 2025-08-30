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

</script>

<template>
  <TheChessboard
  reactive-config
  :player-color="props.playerColor"
  :board-config="props.boardConfig"
  @board-created="props.boardCreated"
  @move="props.move"/>
</template>

<style scoped>

</style>
