<script setup lang="ts">
import {
  useChessSocketStore,
  type ChessGameInfo,
  type PlayerColor,
} from '@/stores/useChessSocketStore'

import { useRoute } from 'vue-router'
import { BoardApi, TheChessboard, type BoardConfig, type MoveEvent } from 'vue3-chessboard'
import 'vue3-chessboard/style.css'

const chessSocketStore = useChessSocketStore()
const route = useRoute()

const color: string = route.query.color as string
const validColor = color === 'white' || color === 'black' ? color : undefined

const GAME_ID = 123
const boardConfig: BoardConfig = {
  orientation: validColor,
  viewOnly: color === 'spectator' ? true : false,
}

let boardApi: BoardApi | null = null;

function boardCreated(api: BoardApi) {
  const shortColor: PlayerColor = color.charAt(0) as PlayerColor
  const gameInfo: ChessGameInfo = {
    gameId: GAME_ID,
    playerColor: shortColor,
    boardApi: api,
  }
  boardApi = api;

  chessSocketStore.subscribe(gameInfo)
}

function moveHandler(move: MoveEvent) {
  if(boardApi?.getTurnColor() == color) return;
  console.log('send move')
  chessSocketStore.sendMove(GAME_ID, move)
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
