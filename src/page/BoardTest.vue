<script setup lang="ts">
import GameView from '@/components/game/GameView.vue';
import { ChessParty } from '@/types/ChessParty';
import { ref } from 'vue';

const DUMMY_WHITE_ID = 'w1'
const DUMMY_BLACK_ID = 'b1'
const INIT_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
const DEFAULT_STATUS = 'NOT_FINISHED'

const white: ChessParty = {
  id: "1",
  white: { id: "ecccb4d8-4fad-45c4-b073-e77b4ec1ddbe", name: 'White' },
  black: { id: DUMMY_BLACK_ID, name: 'Black' },
  moves: [],
  timerHistory: [],
  timeControl: null,
  initFen: INIT_FEN,
  status: DEFAULT_STATUS
}

const black: ChessParty = {
  id: "2",
  white: { id: DUMMY_WHITE_ID, name: 'White' },
  black: { id: "ecccb4d8-4fad-45c4-b073-e77b4ec1ddbe", name: 'Black' },
  moves: [],
  timerHistory: [],
  timeControl: null,
  initFen: INIT_FEN,
  status: DEFAULT_STATUS
}

const party = ref<ChessParty>(black)

function changeSide() {
  if(party.value.id == white.id) {
    console.log("white equals")
    party.value = black
  } else {
    console.log("black equals")
    party.value = white
  }
}

function changeViewOnly() {
  if(party.value.status == 'NOT_FINISHED')
    party.value.status = 'WIN_BLACK'
  else party.value.status = 'NOT_FINISHED'
}

function setNull() {
  party.value = undefined
}
</script>

<template>
  <game-view :chess-party="party" :view-only="false" player-id="ecccb4d8-4fad-45c4-b073-e77b4ec1ddbe"/>
  <button @click="changeSide">CHANGE SIDE</button>
  <button @click="setNull">NULL</button>
  <button @click="changeViewOnly">VIEW ONLY</button>
</template>

<style scoped></style>
