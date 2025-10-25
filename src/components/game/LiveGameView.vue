<script setup lang="ts">
import type { ChessParty, PlayerSide } from '@/types/ChessParty';
import GameView from './GameView.vue';
import type { BoardApi, MoveEvent } from 'vue3-chessboard';
import { useLiveGame } from '@/composables/useLiveGame';
import { useTimers } from '@/composables/useTimers';
import { computed, watch } from 'vue';
import { type BoardState, useBoard } from '@/composables/useBoard';
import { useServerTimeSyncStore } from '@/stores/useServerTymeSyncStore';
import type { LiveGameResponse } from '@/types/LiveGame';

const props = defineProps<{
  boardState?: BoardState
  playerInfoShow?: boolean
  orientation?: PlayerSide
  playerSide?: PlayerSide
  viewOnly?: boolean
  boardSize?: number
  chessParty?: ChessParty
  onCreate?: (api: BoardApi) => void
  onMove?: (move: MoveEvent) => void
  onTimerFinish?: (side: PlayerSide) => void
}>()

const boardState = props.boardState ?? useBoard()

const liveGame = useLiveGame()
const timers = useTimers()
const serverTimeStore = useServerTimeSyncStore()

const timerShow = computed(() => {
  return !!props.chessParty?.timeControl
})

function getRemaining(deadline: number): number {
  return Math.max(deadline - serverTimeStore.getServerNow(), 0)
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
  if (props.chessParty?.timeControl != null) {
    console.log('TRY SET TIME')
    console.log(liveGame)

    timers.white.value.duration = getRemaining(liveGame.game.currentTimers.WHITE)
    timers.black.value.duration = getRemaining(liveGame.game.currentTimers.BLACK)
    if (timers.isActive.value === false) timers.start(boardState.currentTurn.value)
  }
})

liveGame.setAfterMoveCallback((moveMessage) => {
  if (props.chessParty?.timeControl != null) {
    timers.white.value.duration = getRemaining(moveMessage.timers.WHITE)
    timers.black.value.duration = getRemaining(moveMessage.timers.BLACK)
  }
})

const onCreated = (api: BoardApi) => {
  if (props.chessParty === undefined || api === undefined) {
    return
  }

  if (props.chessParty?.status === 'NOT_FINISHED') {
    liveGame.subscribe(props.chessParty.id, api)
  }

  props.onCreate?.(api)
}

const onMoved = (move: MoveEvent) => {
  timers.swap()
  console.log(boardState.currentTurn.value === props.playerSide)
  if (boardState.currentTurn.value === props.playerSide) return
  liveGame.sendMove(move)

  props.onMove?.(move)
}

const onTimerFinished = (side: PlayerSide) => {
  console.log("timer stop")
  timers.stop()
  if (side === 'white') {
    timers.white.value.duration = 0
  }
  else {
    timers.white.value.duration = 0
  }
  props.onTimerFinish?.(side)
}

watch(() => props.chessParty, (party) => {
    timers.reset()
    if(party === undefined) {
      liveGame.unsubcribe()
      return
    }

    if (party.timeControl != null && party.status !== 'NOT_FINISHED') {
      const lastTimerWhite =
        getLastTimerValue(party.timerHistory, 'white') ??
        party.timeControl.initTime
      const lastTimerBlack =
        getLastTimerValue(party.timerHistory, 'black') ??
        party.timeControl.initTime
      timers.white.value.duration = party.status === 'WIN_BLACK' ? 0 : lastTimerWhite
      timers.black.value.duration = party.status === 'WIN_WHITE' ? 0 : lastTimerBlack
    }

    console.log(party)
}, { immediate: true })
</script>


<template>
  <game-view
    :board-state="boardState"
    :chess-party="props.chessParty"
    :timer-show="timerShow"
    :black-timer="timers.black.value"
    :white-timer="timers.white.value"
    :orientation="props.orientation"
    :view-only="props.viewOnly"
    :player-side="props.playerSide"
    :player-info-show="props.playerInfoShow"
    :on-create="onCreated"
    :on-move="onMoved"
    :on-timer-finish="onTimerFinished"
    :board-size="props.boardSize"/>
</template>
