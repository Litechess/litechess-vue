<script setup lang="ts">
import { useAuthStore } from '@/stores/useAuthStore'
import { useChessSocketStore } from '@/stores/useChessSocketStore'
import { useHttpClient } from '@/stores/useHttpClient'
import type { ChessParty } from '@/types/ChessParty'
import type { MoveRequest } from '@/types/MoveRequest'
import type { GameInfoToSub } from '@/types/Socket'
import { reactive, ref } from 'vue'

import { useRoute } from 'vue-router'
import { BoardApi, TheChessboard, type BoardConfig, type MoveEvent } from 'vue3-chessboard'
import 'vue3-chessboard/style.css'

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

async function boardCreated(api: BoardApi) {
  api.loadPgn(chessParty.moveUci.join(" "))
  const gameInfo: GameInfoToSub = {
    gameId: gameId,
    boardApi: api,
  }
  boardApi = api

  chessSocketStore.subscribe(gameInfo)
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

  chessSocketStore.sendMove(gameId, moveRequest)
}
</script>
<template>
  <div>
    <div v-if="isLoaded">
      <TheChessboard
        reactive-config
        @board-created="boardCreated"
        :board-config="boardConfig"
        :player-color="playerColor"
        @move="moveHandler"
      ></TheChessboard>
    </div>
    <div v-else>
      <TheChessboard :board-config="{viewOnly: true}"></TheChessboard>
    </div>
    <router-link to="/">/home</router-link>
    <br />
    <router-link to="/play">/play</router-link>
  </div>
</template>
