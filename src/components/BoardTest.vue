<script setup lang="ts">
// TODO ONLY FOR DEV TESTING , DELETE FROM ROUTER TOO
import { useAuthStore } from '@/stores/useAuthStore'
import { useHttpClient } from '@/stores/useHttpClient'
import type { ChessParty } from '@/types/ChessParty'
import { reactive, ref, type Ref } from 'vue'
import { BoardApi, TheChessboard, type BoardConfig } from 'vue3-chessboard'
import 'vue3-chessboard/style.css'

const notLoaded: Ref<boolean> = ref(false)
const client = useHttpClient()
const authStore = useAuthStore()

let playerColor: "white" | "black" | undefined
let chessParty: ChessParty;
const boardConfig: BoardConfig = reactive({})

client.get("api/v1/games/1").then( (result: ChessParty) => {
  chessParty = result
  if(chessParty.white == authStore.getId()) playerColor = "white"
  else if(chessParty.black == authStore.getId()) playerColor = "black"
  boardConfig.orientation = playerColor == undefined ? "white" : playerColor
  boardConfig.viewOnly = playerColor == undefined ? true : false
  notLoaded.value = true
})


async function test(board: BoardApi) {
  console.log("createdBOARD")
  board.loadPgn(chessParty.moveUci.join(" "))
}

</script>

<template>
  <div v-if="notLoaded">
    <TheChessboard
    reactive-config
    :player-color='playerColor'
    @board-created="test"
    :board-config="boardConfig"></TheChessboard>
  </div>
  <div v-else>
    <TheChessboard></TheChessboard>
  </div>
</template>
