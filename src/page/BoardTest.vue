<script setup lang="ts">
import GameView from '@/components/game/GameView.vue'
import { useApi } from '@/composables/useApi'
import { BoardKey, useBoard } from '@/composables/useBoard'
import { useLiveGame } from '@/composables/useLiveGame'
import { useServerTimeSync } from '@/composables/useServerTimeSync'
import { useAuthStore } from '@/stores/useAuthStore'
import { GameStatus, type ChessParty, type PlayerSide } from '@/types/ChessParty'
import { NFlex } from 'naive-ui'
import { computed, provide, ref, watch, type Ref } from 'vue'
import { useRoute } from 'vue-router'
import { RouterLink } from 'vue-router'
import FindGameButton from '@/components/FindGameButton.vue'
import { useTimers } from '@/composables/useTimers'
import { BoardApi, type MoveEvent } from 'vue3-chessboard'
import type { LiveGameResponse } from '@/types/LiveGame'

const boardState = useBoard()
const authStore = useAuthStore()
const liveGame = useLiveGame()
const timers = useTimers()
const api = useApi()
const route = useRoute()
const serverTimeSync = useServerTimeSync(10000)

provide(BoardKey, boardState)

function getRemaining(deadline: number): number {
  return Math.max(deadline - serverTimeSync.getServerNow(), 0)
}

function getLastTimerValue(timerHistory: number[], side: PlayerSide): number | null {
  if (side == 'white' && timerHistory.length >= 1)
    return timerHistory.length % 2 == 0
      ? timerHistory[timerHistory.length - 2]
      : timerHistory[timerHistory.length - 1]
  else if (side == 'black' && timerHistory.length >= 2)
    return timerHistory.length % 2 == 0
      ? timerHistory[timerHistory.length - 1]
      : timerHistory[timerHistory.length - 2]
  return null
}

liveGame.setAfterSyncCallback((liveGame: LiveGameResponse) => {
  boardState.updateState()
  if (chessParty.value?.timeControl != null) {
    console.log('TRY SET TIME')
    console.log(liveGame)

    timers.white.value.duration = getRemaining(liveGame.game.currentTimers.WHITE)
    timers.black.value.duration = getRemaining(liveGame.game.currentTimers.BLACK)
    if (timers.isActive.value === false) timers.start(boardState.currentTurn.value)
  }
})

liveGame.setAfterMoveCallback((moveMessage) => {
  if (chessParty.value?.timeControl != null) {
    timers.white.value.duration = getRemaining(moveMessage.timers.WHITE)
    timers.black.value.duration = getRemaining(moveMessage.timers.BLACK)
  }
})

const gameIdParam = computed(() => {
  return route.params.gameId.length > 0 ? String(route.params.gameId) : undefined
})

const chessParty = ref<ChessParty | undefined>(undefined)

const timerShow = computed(() => {
  if (chessParty.value === undefined || chessParty.value.timeControl === null) return false
  return true
})

const playerSide = computed(() => {
  if (chessParty.value === undefined) return undefined
  const userId: string = authStore.getId()!
  if (userId === chessParty.value.white.id) return 'white'
  else if (userId === chessParty.value.black.id) return 'black'
  return undefined
})

const orientation = computed(() => {
  if (playerSide.value === undefined) return 'white'
  return playerSide.value
})

const gameStatus: Ref<GameStatus | undefined> = computed(() => {
  if (chessParty.value === undefined) return undefined
  return chessParty.value.status
})

const viewOnly = computed(() => {
  return (playerSide.value ? false : true) || (gameStatus.value !== "NOT_FINISHED" && gameStatus.value !== undefined)
})

const boardApi: Ref<BoardApi | undefined> = ref(undefined)

const onCreate = (api: BoardApi) => {
  boardApi.value = api
}

const onMove = (move: MoveEvent) => {
  timers.swap()
  if (boardState.currentTurn.value === playerSide.value) return
  liveGame.sendMove(move)
}

const onTimerFinish = (side: PlayerSide) => {
  console.log("timer stop")
  timers.stop()
  if (side === 'white') {
    timers.white.value.duration = 0
    if(chessParty.value) chessParty.value.status = "WIN_BLACK"
  }
  else {
    timers.white.value.duration = 0
    if(chessParty.value) chessParty.value.status = "WIN_WHITE"
  }
}

watch(
  gameIdParam,
  async (id) => {
    if (id === undefined) {
      chessParty.value = undefined
      liveGame.unsubcribe()
      return
    }
    const loadedParty: ChessParty = await api.getChessGame(id)
    chessParty.value = {
      ...loadedParty,
      id: String(loadedParty.id),
    }

    timers.reset()
    if (chessParty.value?.timeControl != null && chessParty.value?.status !== 'NOT_FINISHED') {
      const lastTimerWhite =
        getLastTimerValue(chessParty.value.timerHistory, 'white') ??
        chessParty.value.timeControl.initTime
      const lastTimerBlack =
        getLastTimerValue(chessParty.value.timerHistory, 'black') ??
        chessParty.value.timeControl.initTime
      timers.white.value.duration = chessParty.value.status === 'WIN_BLACK' ? 0 : lastTimerWhite
      timers.black.value.duration = chessParty.value.status === 'WIN_WHITE' ? 0 : lastTimerBlack
    }

    console.log(chessParty.value)
  },
  { immediate: true },
)

watch(boardApi, (api) => {
  if (chessParty.value === undefined || api === undefined) {
    return
  }

  if (gameIdParam.value && chessParty.value.status === 'NOT_FINISHED') {
    liveGame.subscribe(gameIdParam.value, api)
  }
})
</script>

<template>
  <n-flex>
    <game-view
      :timer-show="timerShow"
      :black-timer="timers.black.value"
      :white-timer="timers.white.value"
      :chess-party="chessParty"
      :orientation="orientation"
      :view-only="viewOnly"
      :player-side="playerSide"
      :on-create="onCreate"
      :on-move
      :on-timer-finish="onTimerFinish"
    />
    <router-link to="/test/70">TEST</router-link>
    <router-link to="/test/71">TEST</router-link>
    <router-link to="/test/72">TEST</router-link>
    <router-link to="/test">REMOVE</router-link>
    <FindGameButton />
  </n-flex>
</template>

<style scoped></style>
