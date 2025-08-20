<script setup lang="ts">
import { useAuthStore } from '@/stores/useAuthStore'
import { useChessSocketStore } from '@/stores/useChessSocketStore'
import { useHttpClient } from '@/stores/useHttpClient'
import type { ChessParty } from '@/types/ChessParty'
import type { MoveRequest } from '@/types/MoveRequest'
import type { GameInfoToSub } from '@/types/Socket'
import { reactive, ref } from 'vue'

import { useRoute } from 'vue-router'
import { BoardApi, type BoardConfig, type CapturedPieces, type MoveEvent } from 'vue3-chessboard'
import 'vue3-chessboard/style.css'
import { NFlex, NCard,  NButton, NScrollbar } from 'naive-ui'
import ChessBoard from '@/components/ChessBoard.vue'
import PlayerBoardInfo from '@/components/PlayerBoardInfo.vue'
import GameTimer from '@/components/GameTimer.vue'
import { ArrowIcon, UndoIcon, EqualIcon } from '@/components/icon'
import MoveTable from '@/components/MoveTable.vue'

const chessSocketStore = useChessSocketStore()
const httpClient = useHttpClient()
const authStore = useAuthStore()
const route = useRoute()

const isLoaded = ref(false)
const gameId: number = Number(route.params.gameId)
let playerColor: "white" | "black" | undefined
let chessParty: ChessParty;
const boardConfig: BoardConfig = reactive({})
let boardApi: BoardApi;
console.log(gameId)

httpClient.get(`api/v1/games/${gameId}`).then( (result: ChessParty) => {
  console.log(result)
  chessParty = result
  if(chessParty.white == authStore.getId()) playerColor = "white"
  else if(chessParty.black == authStore.getId()) playerColor = "black"
  boardConfig.orientation = playerColor == undefined ? "white" : playerColor
  boardConfig.viewOnly = playerColor == undefined ? true : false
  isLoaded.value = true
})

const takedPieceWhite = ref([]);
const takedPieceBlack = ref([]);
const moves = ref([])

const viewNext = () => {
  boardApi.viewNext()
}

const viewPrevious = () => {
  boardApi.viewPrevious()
}

const stopView = () => {
  boardApi.stopViewingHistory()
}

const undo = () => {
  // const lastMove: MoveEvent | undefined = boardApi.getLastMove()
  // if(lastMove === undefined) return
  // if(lastMove.captured != undefined) {
  //   const takedPieceArr = lastMove.color == 'w' ? takedPieceWhite : takedPieceBlack
  //   takedPieceArr.value.pop()
  // }
  // boardApi.undoLastMove()
  // moves.value.pop()
}

function updateCapturedPiece() {
  moves.value = boardApi.getHistory()
  const pieces: CapturedPieces = boardApi.getCapturedPieces();
  takedPieceBlack.value = pieces.black;
  takedPieceWhite.value = pieces.white;
}

function updateMoveHistory() {
  moves.value = boardApi.getHistory()
}

async function boardCreated(api: BoardApi) {
  api.loadPgn(chessParty.moveUci.join(" "))
  const gameInfo: GameInfoToSub = {
    gameId: gameId,
    boardApi: api,
  }
  boardApi = api

  updateCapturedPiece()
  updateMoveHistory()
  chessSocketStore.subscribe(gameInfo, () => {
    updateCapturedPiece()
    updateMoveHistory()
  })
}

function moveHandler(move: MoveEvent) {
  if (boardApi?.getTurnColor() == playerColor) return
  console.log('send move')
  const moveRequest: MoveRequest = {
    from: move.from,
    to: move.to,
    promotion: move.promotion || null,
    san: move.san,
  }

  updateCapturedPiece()

  chessSocketStore.sendMove(gameId, moveRequest)
}

</script>
<template>
  <n-flex justify="center" align="center" style="height: 100vh; width: 100vw">
    <n-flex style="width: 80%; height: 90%;" justify="center" align="center">
      <n-flex style="height: 100%;" vertical :size="15 " v-if="isLoaded">
        <n-flex justify="space-between">
          <player-board-info
            color = "b"
            name="Player1"
            avatar="https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg"
            :pieces="takedPieceWhite"
          />
          <game-timer/>
        </n-flex>
        <chess-board :board-created="boardCreated" :player-color="playerColor" :move="moveHandler" :board-config="boardConfig"/>
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
            <router-link to="/">/home</router-link>
            <router-link to="/play">/play</router-link>
        </n-card>
      </n-flex>
    </n-flex>
  </n-flex>
</template>
