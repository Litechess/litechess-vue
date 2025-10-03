<script setup lang="ts">
// TODO ONLY FOR DEV TESTING , DELETE FROM ROUTER TO
import { NFlex, NCard, NTabs, NTabPane, NText, NButton, NScrollbar } from 'naive-ui'
import PlayerBoardInfo from '@/components/PlayerBoardInfo.vue'
import { computed, reactive, ref, watch, type Ref } from 'vue'
import { type BoardApi, type BoardConfig, type MoveEvent } from 'vue3-chessboard'
import { h } from 'vue'
import MoveTable from '@/components/MoveTable.vue'
import ChessBoard from '@/components/ChessBoard.vue'
import { ArrowIcon, EqualIcon } from '@/components/icon'
import PieceText from '@/components/PieceText.vue'
import GameTimer from '@/components/GameTimer.vue'
import { useApi } from '@/composables/useApi'
import type { ChessParty, PlayerSide } from '@/types/ChessParty'
import { onBeforeRouteUpdate, useRoute } from 'vue-router'
import { RouterLink } from 'vue-router'
import GameCard from '@/components/GameCard.vue'
import { useAuthStore } from '@/stores/useAuthStore'
import FindGameButton from '@/components/FindGameButton.vue'
import ImageText from '@/components/ImageText.vue'
import type { ChessPartyFilter } from '@/types/Requests'
import { useLiveGame } from '@/composables/useLiveGame'
import { useBoard } from '@/composables/useBoard'

const route = useRoute()
const authStore = useAuthStore()
const api = useApi()
const boardState = useBoard()
const liveGame = useLiveGame()
liveGame.setAfterSyncCallback(() => {
  boardState.updateState()
})

const gameIdParam: Ref<string | null> = ref(
  route.params.gameId.length > 0 ? String(route.params.gameId) : null
)

const isGameLoaded = ref(false)
const boardConfig: BoardConfig = reactive({})
const playerWhiteName = ref('Player 1')
const playerBlackName = ref('Player 2')
const activeGames: Ref<ChessParty[]> = ref([])
const selectedValueTab = ref(gameIdParam.value != null ? 'gamePanel' : 'matchmaking')
const playerSide: Ref<PlayerSide | undefined> = ref(undefined)

const activeNonSelectedGames = computed(() => {
  return activeGames.value.filter((game) => game.id != gameIdParam.value)
})

if (gameIdParam.value != null) {

  loadGame(gameIdParam.value).then(() => {
    isGameLoaded.value = true
  })
}

async function fetchActiveGames() {
  const filters: ChessPartyFilter = {
    playerId: authStore.getId()!,
  }

  return api.getAllGames(filters).then((result: ChessParty[]) => {
    activeGames.value = result
  })
}

fetchActiveGames()

async function loadGame(id: string) {
  return api.getChessGame(id).then((result: ChessParty) => {
    if (result.white.id == authStore.getId()) playerSide.value = 'white'
    else if (result.black.id == authStore.getId()) playerSide.value = 'black'
    console.log(result)

    boardConfig.orientation = playerSide.value
    boardConfig.viewOnly = isViewOnly.value

    playerWhiteName.value = result.white.name
    playerBlackName.value = result.black.name
    fetchActiveGames()
  })
}

onBeforeRouteUpdate((to, from, next) => {
  const paramId: string = to.params.gameId as string
  if (paramId.length > 0) {
    loadGame(paramId).then(() => {
      gameIdParam.value = paramId
      isGameLoaded.value = true
      selectedValueTab.value = 'gamePanel'
    })
  } else {
    gameIdParam.value = null
    isGameLoaded.value = false
  }

  next()
})

const isViewOnly = computed(() => {
  return (playerSide.value == undefined) == true
})

watch(isViewOnly, (newValue) => {
  boardConfig.viewOnly = newValue
})

// composable
let boardApi: BoardApi
const buttonSize: number = 35
const activeTimerSide = computed(() => {
  return playerSide.value == boardState.currentTurn.value ? true : false
})
const notLoadedBoardConfig: BoardConfig = {
  viewOnly: true,
}

const piecePane = h(PieceText, {
  text: 'Game',
  piece: 'p',
  onClick: () => {
    if (isGameLoaded.value == false) return
    selectedValueTab.value = 'gamePanel'
  },
})

const matchmakingTab = h(ImageText, {
  text: 'Matchmaking',
  onClick: () => {
    selectedValueTab.value = 'matchmaking'
  },
})

const selectedMovePly = ref(boardState.currentPly.value.valueOf())
watch(
  () => boardState.currentPly.value,
  (newValue) => {
    selectedMovePly.value = newValue
  },
)

function moveTableClick(ply: number) {
  selectedMovePly.value = ply
  boardApi.viewHistory(ply)
}

function onBoardCreated(api: BoardApi) {
  boardApi = api
  boardState.setBoardApi(api)
  if(gameIdParam.value != null) {
    liveGame.subscribe(gameIdParam.value, api)
  }
}

function onMove(move: MoveEvent) {
  boardApi.stopViewingHistory()
  boardState.updateState()
  if(boardApi.getTurnColor() == playerSide.value) return
  liveGame.sendMove(move)
}

function getOrientation(chessParty: ChessParty): PlayerSide {
  const userId: string = authStore.getId()!
  const whiteId = chessParty.white.id
  return userId == whiteId ? 'white' : 'black'
}

const viewNext = () => {
  if (selectedMovePly.value == boardState.moves.value.length) return
  boardApi.viewNext()
  selectedMovePly.value = selectedMovePly.value + 1
}

const viewPrevious = () => {
  if (selectedMovePly.value == 1) return
  boardApi.viewPrevious()
  selectedMovePly.value = selectedMovePly.value + -1
}

const stopView = () => {
  boardApi.stopViewingHistory()
  selectedMovePly.value = boardState.currentPly.value
}
</script>

<template>
  <n-flex style="height: calc(100dvh - 2rem)" justify="center" align="center">
    <n-flex :size="50" justify="center">
      <n-flex :style="{ flexDirection: playerSide == 'white' ? 'column' : 'column-reverse' }">
        <n-flex justify="space-between">
          <player-board-info
            color="black"
            :name="playerBlackName"
            avatar="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
            :pieces="boardState.takedPieceBlack.value"
            :materialDiff="boardState.materialDiff.value"
          />
          <game-timer :active="!activeTimerSide" :duration="100 * 100 * 60" />
        </n-flex>
        <chess-board
          v-if="isGameLoaded"
          :player-color="playerSide"
          :board-config="boardConfig"
          @move="onMove"
          @board-created="onBoardCreated"
          :key="gameIdParam as string"
        />
        <chess-board v-else :board-config="notLoadedBoardConfig" :key="0" />

        <n-flex justify="space-between">
          <player-board-info
            color="white"
            :name="playerWhiteName"
            avatar="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
            :pieces="boardState.takedPieceWhite.value"
            :materialDiff="boardState.materialDiff.value"
          />
          <game-timer :active="activeTimerSide" :duration="100 * 100 * 60" />
        </n-flex>
      </n-flex>
      <n-flex>
        <n-card>
          <n-tabs
            style="width: 400px"
            type="line"
            justify-content="center"
            size="large"
            :value="selectedValueTab"
          >
            <n-tab-pane :disabled="!isGameLoaded" name="gamePanel" :tab="piecePane">
              <n-flex vertical justify="space-between">
                <n-text style="font-size: 20px"> {{ boardState.openingName }}</n-text>
                <move-table
                  :selectMovePly="selectedMovePly"
                  :moves="boardState.moves.value"
                  @move-click="moveTableClick"
                  :gameStatus="boardState.gameStatus.value"
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
            <n-tab-pane name="matchmaking" :tab="matchmakingTab" display-directive="show:lazy">
              <n-flex vertical :size="30">
                <find-game-button />
                <n-flex vertical align="center">
                  <n-text style="font-size: 18px">Active games</n-text>
                  <n-scrollbar style="max-height: 42em; min-height: 42em">
                    <n-flex justify="center" :size="10">
                      <router-link
                        :to="`/game/${activeGame.id}`"
                        style="text-decoration: none; color: inherit"
                        v-for="activeGame in activeNonSelectedGames"
                        :key="activeGame.id"
                      >
                        <game-card
                          :chessParty="activeGame"
                          :orientation="getOrientation(activeGame)"
                        />
                      </router-link>
                    </n-flex>
                  </n-scrollbar>
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
