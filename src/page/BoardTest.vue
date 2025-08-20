<script setup lang="ts">
// TODO ONLY FOR DEV TESTING , DELETE FROM ROUTER TO
import { NFlex, NCard,  NButton, NScrollbar } from 'naive-ui'
import ChessBoard from '@/components/ChessBoard.vue'
import PlayerBoardInfo from '@/components/PlayerBoardInfo.vue'
import GameTimer from '@/components/GameTimer.vue'
import {  ref } from 'vue'
import type { BoardApi, CapturedPieces, MoveEvent } from 'vue3-chessboard'
import MoveTable from '@/components/MoveTable.vue'
import { ArrowIcon, UndoIcon, EqualIcon } from '@/components/icon'

const takedPieceWhite = ref([]);
const takedPieceBlack = ref([]);
const moves = ref([])

const undo = () => {
  const lastMove: MoveEvent | undefined = boardApi.getLastMove()
  if(lastMove === undefined) return
  if(lastMove.captured != undefined) {
    const takedPieceArr = lastMove.color == 'w' ? takedPieceWhite : takedPieceBlack
    takedPieceArr.value.pop()
  }
  boardApi.undoLastMove()
  moves.value.pop()
}
// composable
let boardApi: BoardApi;

const onMove = (move: MoveEvent) => {
  moves.value = boardApi.getHistory()
  const pieces: CapturedPieces = boardApi.getCapturedPieces();
  takedPieceBlack.value = pieces.black;
  takedPieceWhite.value = pieces.white;
}

const onCreated = (api: BoardApi) => {
  boardApi = api
}

const viewNext = () => {
  boardApi.viewNext()
}

const viewPrevious = () => {
  boardApi.viewPrevious()
}

const stopView = () => {
  boardApi.stopViewingHistory()
}


</script>

<template>
  <n-flex justify="center" align="center" style="height: 100vh; width: 100vw">
    <n-flex style="width: 80%; height: 90%;" justify="center" align="center">
      <n-flex style="height: 100%;" vertical :size="15 ">
        <n-flex justify="space-between">
          <player-board-info
            color = "b"
            name="Player1"
            avatar="https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg"
            :pieces="takedPieceWhite"
          />
          <game-timer/>
        </n-flex>
        <chess-board :board-created="onCreated" player-color="s" :move="onMove"/>
        <n-flex justify="space-between">
          <player-board-info
            color = "w"
            name="Player2"
            avatar="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
            :pieces="takedPieceBlack"
          />
          <game-timer/>
        </n-flex>
      </n-flex>
      <n-flex style="height: 100%; width: 30%">
        <n-card>
          <n-scrollbar style="max-height: 45em">
            <move-table :moves="moves" v-if="moves.length != 0"/>
           </n-scrollbar>
           <n-button @click="undo">
            <undo-icon/>
           </n-button>
           <n-button @click="viewPrevious">
            <arrow-icon/>
           </n-button>
           <n-button @click="stopView">
            <equal-icon/>
           </n-button>
           <n-button @click="viewNext">
            <arrow-icon rotated/>
           </n-button>

        </n-card>
      </n-flex>
    </n-flex>
  </n-flex>
</template>

<style scoped></style>
