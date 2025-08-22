<script setup lang="ts">
import { reactive, ref, toRefs } from 'vue'

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
import { useApi } from '@/composables/useApi'
import type { ChessParty } from '@/types/ChessParty'

const route = useRoute()
const gameId: number = Number(route.params.gameId)

const chessGame = useChessGame()
const api = useApi()
const isLoaded = ref(false)
const { playerSide, moves, takedPieceWhite, takedPieceBlack } = toRefs(chessGame)
const boardConfig: BoardConfig = reactive({})

api.getChessGame(gameId).then( (result: ChessParty) => {
  chessGame.setChessParty(result)
  boardConfig.orientation = playerSide.value
  boardConfig.viewOnly = playerSide.value == undefined ? true : false
  isLoaded.value = true
})

async function boardCreated(api: BoardApi) {
  chessGame.setBoardApi(api)
  chessGame.subscribe()
}

function test() {
  boardConfig.viewOnly = false
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
        <chess-board :board-created="boardCreated" :player-color="playerSide" :move="chessGame.sendMove" :board-config="boardConfig"/>
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
           <n-button @click="chessGame.viewPrevious">
            <arrow-icon/>
           </n-button>
           <n-button @click="chessGame.viewNext">
            <equal-icon/>
           </n-button>
           <n-button @click="chessGame.stopView">
            <arrow-icon rotated/>
           </n-button>
            <router-link to="/">/home</router-link>
            <router-link to="/play">/play</router-link>
            <n-button @click="test">test</n-button>
        </n-card>
      </n-flex>
    </n-flex>
  </n-flex>
</template>
