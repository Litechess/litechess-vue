<script setup lang="ts">
import type { PlayerColor } from '@/types/ChessParty';
import { BoardApi, TheChessboard, type MoveableColor, type MoveEvent } from 'vue3-chessboard'
import 'vue3-chessboard/style.css'

interface Props {
  boardCreated: (api: BoardApi) => void
  playerColor: PlayerColor
  move: (move: MoveEvent) => void
}

const props = defineProps<Props>();
let chessBoardColor: MoveableColor | undefined = undefined;
if(props.playerColor == "w") chessBoardColor = "white"
else if(props.playerColor == "b") chessBoardColor = "black"

</script>

<template>
  <TheChessboard
  :reactive-config="true"
  :player-color="chessBoardColor"
  @board-created="props.boardCreated"
  @move="props.move"/>
</template>

<style scoped>

</style>
