<script setup lang="ts">
import { reactive } from 'vue'

import { useRoute } from 'vue-router'
import { BoardApi, type BoardConfig } from 'vue3-chessboard'
import 'vue3-chessboard/style.css'
import { NFlex, NCard,  NButton, NScrollbar } from 'naive-ui'
import ChessBoard from '@/components/ChessBoard.vue'
import PlayerBoardInfo from '@/components/PlayerBoardInfo.vue'
import GameTimer from '@/components/GameTimer.vue'
import { ArrowIcon, EqualIcon } from '@/components/icon'
import MoveTable from '@/components/MoveTable.vue'
import { useChessGame } from '@/composables/useChessGame'

const route = useRoute()
const gameId: number = Number(route.params.gameId)

let boardApi: BoardApi

const chessGame = useChessGame(gameId)
const boardConfig: BoardConfig = reactive({})

chessGame.loadGame().then( () => {
  boardConfig.orientation = chessGame.playerSide.value == undefined ? "white" : chessGame.playerSide.value
  boardConfig.viewOnly = chessGame.playerSide.value == undefined ? true : false
})

const viewNext = () => {
  boardApi.viewNext()
}

const viewPrevious = () => {
  boardApi.viewPrevious()
}

const stopView = () => {
  boardApi.stopViewingHistory()
}

async function boardCreated(api: BoardApi) {
  chessGame.setBoardApi(api)
  boardApi = api
  chessGame.subscribe()
}

</script>
<template>
  <n-flex justify="center" align="center" style="height: 100vh; width: 100vw">
    <n-flex style="width: 80%; height: 90%;" justify="center" align="center">
      <n-flex style="height: 100%;" vertical :size="15 " v-if="chessGame.isLoaded.value">
        <n-flex justify="space-between">
          <player-board-info
            color = "b"
            name="Player1"
            avatar="https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg"
            :pieces="chessGame.takedPieceWhite.value"
          />
          <game-timer/>
        </n-flex>
        <chess-board :board-created="boardCreated" :player-color="chessGame.playerSide.value" :move="chessGame.sendMove" :board-config="boardConfig"/>
        <n-flex justify="space-between">
          <player-board-info
            color = "w"
            name="Player2"
            avatar="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
            :pieces="chessGame.takedPieceBlack.value"
          />
          <game-timer/>
        </n-flex>
      </n-flex>
      <n-flex style="height: 100%; width: 30%">
        <n-card>
          <n-scrollbar style="max-height: 45em">
            <move-table :moves="chessGame.moves.value" v-if="chessGame.moves.value.length != 0"/>
           </n-scrollbar>
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
