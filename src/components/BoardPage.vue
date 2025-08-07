<script setup lang="ts">
import {
  useChessSocketStore,
  type ChessGameInfo,
  type PlayerColor,
} from '@/stores/useChessSocketStore'
import type { MoveRequest } from '@/types/MoveRequest'

import { useRoute } from 'vue-router'
import { BoardApi, TheChessboard, type BoardConfig, type MoveEvent } from 'vue3-chessboard'
import 'vue3-chessboard/style.css'

const chessSocketStore = useChessSocketStore()
const route = useRoute()

const color: string = route.query.color as string
const validColor = color === 'white' || color === 'black' ? color : undefined

const boardConfig: BoardConfig = {
  orientation: validColor,
  viewOnly: color === 'spectator' ? true : false,
}

let boardApi: BoardApi | null = null

async function boardCreated(api: BoardApi) {
  const shortColor: PlayerColor = color.charAt(0) as PlayerColor
  const gameInfo: ChessGameInfo = {
    gameId: 1,
    playerColor: shortColor,
    boardApi: api,
  }
  boardApi = api

  chessSocketStore.subscribe(gameInfo)
}

function moveHandler(move: MoveEvent) {
  if (boardApi?.getTurnColor() == color) return
  console.log('send move')
  const moveRequest: MoveRequest = {
    from: move.from,
    to: move.to,
    promotion: move.promotion || null,
    san: move.san,
  }
  console.log(moveRequest)
  chessSocketStore.sendMove(1, moveRequest)
}
</script>
<template>
  <div>
    <TheChessboard
      @board-created="boardCreated"
      :board-config="boardConfig"
      :player-color="validColor"
      @move="moveHandler"
    ></TheChessboard>
    <router-link to="/">/home</router-link>
    <br />
    <router-link to="/play">/play</router-link>
  </div>
</template>
