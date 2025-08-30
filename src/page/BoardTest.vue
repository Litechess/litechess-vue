<script setup lang="ts">
// TODO ONLY FOR DEV TESTING , DELETE FROM ROUTER TO
import { NFlex, NCard, NTabs, NTabPane, NText, NButton } from 'naive-ui'
import PlayerBoardInfo from '@/components/PlayerBoardInfo.vue'
import { computed, reactive, ref, toRefs, watch } from 'vue'
import { type BoardApi, type BoardConfig, } from 'vue3-chessboard'
import { h } from 'vue'
import 'vue3-chessboard/style.css'
import MoveTable from '@/components/MoveTable.vue'
import ChessBoard from '@/components/ChessBoard.vue'
import { ArrowIcon, EqualIcon } from '@/components/icon'
import PieceText from '@/components/PieceText.vue'
import { useChessGame } from '@/composables/useChessGame'
import GameTimer from '@/components/GameTimer.vue'
import { useApi } from '@/composables/useApi'
import type { ChessParty } from '@/types/ChessParty'
import { useRoute } from 'vue-router'

const route = useRoute()
const api = useApi()
const chessGame = useChessGame()
const gameId: number = Number(route.params.gameId)
const boardConfig: BoardConfig = reactive({})
const isLoaded = ref(false)

api.getChessGame(gameId).then( (result: ChessParty) => {
  chessGame.setChessParty(result)
  boardConfig.orientation = playerSide.value
  boardConfig.viewOnly = playerSide.value == undefined ? true : false
  isLoaded.value = true
})

const { playerSide, moves, takedPieceWhite, takedPieceBlack, openingName, currentPly, materialDiff } = toRefs(chessGame)

// composable
let boardApi: BoardApi
const buttonSize: number = 35
const activeTimerSide = computed(() => {
  return playerSide.value == chessGame.currentTurn.value ? true : false
})

const piecePane = h(PieceText, {
  text: 'game',
  piece: 'p',
})

const selectedMovePly = ref(currentPly.value.valueOf())
watch(() => currentPly.value, (newValue) => {
  selectedMovePly.value = newValue
})

function moveTableClick(ply: number) {
  selectedMovePly.value = ply
  boardApi.viewHistory(ply)
}

function onBoardCreated(api: BoardApi) {
  boardApi = api
  chessGame.setBoardApi(api)
  chessGame.subscribe()
}

const viewNext = () => {
  if(selectedMovePly.value == moves.value.length) return
  boardApi.viewNext()
  selectedMovePly.value = selectedMovePly.value + 1
}

const viewPrevious = () => {
  if(selectedMovePly.value == 1) return
  boardApi.viewPrevious()
  selectedMovePly.value = selectedMovePly.value + -1
}

const stopView = () => {
  boardApi.stopViewingHistory()
  selectedMovePly.value = currentPly.value
}
</script>

<template>
  <n-flex style="height: calc(100dvh - 2rem)" justify="center" align="center">
    <n-flex :size="50" justify="center" v-if="isLoaded">
      <n-flex vertical>
        <n-flex justify="space-between">
          <player-board-info
            color="black"
            name="Player2"
            avatar="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
            :pieces="takedPieceBlack"
            :materialDiff="materialDiff"
          />
          <game-timer :active="!activeTimerSide" :duration="100 * 100 * 60" />
        </n-flex>
        <chess-board
          player-color="white"
          :board-config="boardConfig"
          @move="chessGame.moveHandler"
          @board-created="onBoardCreated"
        />
        <n-flex justify="space-between">
          <player-board-info
            color="white"
            name="Player2"
            avatar="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
            :pieces="takedPieceWhite"
            :materialDiff="materialDiff"
          />
          <game-timer :active="activeTimerSide" :duration="100 * 100 * 60" />
        </n-flex>
      </n-flex>
      <n-flex>
        <n-card>
          <n-tabs style="width: 400px" type="line" animated justify-content="center" size="large">
            <n-tab-pane name="gamePanel" :tab="piecePane">
              <n-flex vertical justify="space-between">
                <n-text> {{ openingName }}</n-text>
                  <move-table
                    :selectMovePly="selectedMovePly"
                    :moves="moves"
                    @move-click="moveTableClick"
                    />
                <n-flex justify="center" :size="5">
                  <n-button @click="viewPrevious">
                    <arrow-icon :size="buttonSize" />
                  </n-button>
                  <n-button @click="stopView">
                    <equal-icon :size="buttonSize" />
                  </n-button>
                  <n-button @click="viewNext">
                    <arrow-icon :size="buttonSize" rotated />
                  </n-button>
                </n-flex>
              </n-flex>
            </n-tab-pane>
          </n-tabs>
        </n-card>
      </n-flex>
    </n-flex>
  </n-flex>
</template>

<style scoped></style>
