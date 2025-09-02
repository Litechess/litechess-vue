<script setup lang="ts">

import type { ChessParty, PlayerSide } from '@/types/ChessParty';
import ChessBoard from './ChessBoard.vue';
import { NFlex, NCard, NText } from 'naive-ui';
import type { BoardApi, BoardConfig } from 'vue3-chessboard';

interface Props {
  chessParty: ChessParty
  orientation?: PlayerSide
}

const props = defineProps<Props>();

const viewOnlyConfig: BoardConfig = {
  viewOnly: true,
  orientation: props.orientation == undefined ? "white" : props.orientation
}

async function boardCreated(boardApi: BoardApi) {
  boardApi.loadPgn(props.chessParty.moveUci.join(' '))
}

</script>

<template>
  <n-card>
    <n-flex vertical align="center" justify="center" :style="{ flexDirection: props.orientation == 'black' ? 'column-reverse' : 'column' }">
      <n-text style="font-size: 18px"> {{ props.chessParty.black.name }}</n-text>
      <n-flex>
        <chess-board
          :board-config="viewOnlyConfig"
          @board-created="boardCreated"
          style="width: 300px"/>
      </n-flex>
      <n-text style="font-size: 18px"> {{ props.chessParty.white.name }}</n-text>
    </n-flex>
  </n-card>
</template>

<style scoped>

</style>
