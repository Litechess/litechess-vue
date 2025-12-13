<script setup lang="ts">
import { useApi } from '@/composables/useApi'
import { useBoard } from '@/composables/useBoard'
import { useAuthStore } from '@/stores/useAuthStore'
import { type ChessParty, type GameStatus } from '@/types/ChessParty'
import { NFlex, useNotification } from 'naive-ui'
import { computed, onMounted, ref, watch, type Ref } from 'vue'
import { useRoute } from 'vue-router'
import { BoardApi, type MoveEvent } from 'vue3-chessboard'
import LiveGameView from '@/components/game/LiveGameView.vue'
import SideInfoPanel from '@/components/info/SideInfoPanel.vue'
import { useLiveGameStore } from '@/stores/useLiveGameStore'
import type { useLiveGame } from '@/composables/useLiveGame'
import type { DrawDecline, DrawProposition, GameResult } from '@/types/MoveRequest'
import { useMediaQuery } from '@vueuse/core'

let moveSound: HTMLAudioElement | null;
let gameFinishSound: HTMLAudioElement | null;
let captureSound: HTMLAudioElement | null;

onMounted(() => {
  moveSound = new Audio('/sounds/Move.mp3')
  gameFinishSound = new Audio('/sounds/GenericNotify.mp3')
  captureSound = new Audio('/sounds/Capture.mp3')

  if(moveSound !== null) {
    moveSound.volume = 0.8;
  }

  if(gameFinishSound !== null) {
    gameFinishSound.volume = 0.8
  }

  if(captureSound !== null) {
    captureSound.volume = 0.8
  }
})

const boardState = useBoard()
const authStore = useAuthStore()
const api = useApi()
const route = useRoute()
const liveGameStore = useLiveGameStore()
const notification = useNotification()
const isMobile = useMediaQuery('(max-width: 767px)')

const justifyContent = computed(() => {
  return isMobile.value ? 'start' : 'center'
})

const gameIdParam = computed(() => {
  return route.params.gameId.length > 0 ? String(route.params.gameId) : undefined
})

const chessParty = ref<ChessParty | undefined>(undefined)

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
const liveGame: Ref<ReturnType<typeof useLiveGame> | undefined> = ref(undefined)

const onSurrender = () => {
  liveGame.value?.surrender()
}

const onDraw = () => {
  liveGame.value?.sendDrawProposition()
}

const onCreate = (api: BoardApi, liveGamee: ReturnType<typeof useLiveGame>): void => {
  boardApi.value = api
  liveGame.value = liveGamee

  liveGame.value.setAfterDrawPropositionCallback((drawProposition: DrawProposition) => {
    if(drawProposition.playerId === authStore.getId()) {
      return;
    }
      notification['info']({
        duration: 7000,
        title: 'Draw Proposition',
        content: 'Opponent has proposed a draw. Send draw proposition for accept.',
    })
  })

  liveGame.value.setAfterDrawDeclineCallback((drawDecline: DrawDecline) => {
    if(drawDecline.playerId === authStore.getId()) {
      return;
    }

    notification['info']({
      duration: 5000,
      title: 'Draw Declined',
      content: 'Draw proposition has been declined by your opponent.',
    })
  })
}

const onGameFinish = (gameResult: GameResult) => {
  if(chessParty.value === undefined) return
  if(gameFinishSound !== null) gameFinishSound.play()
  chessParty.value.status = gameResult.status
}

const showGameEventButtons = computed(() => {
  return playerSide.value !== undefined && gameStatus.value === 'NOT_FINISHED'
})

const showGameInfo = computed(() => {
  return gameIdParam.value ? true : false
})

const onMove = (move: MoveEvent) => {
  if(moveSound !== null && move.captured == undefined) {
    moveSound.currentTime = 0;
    moveSound.play();
  }
  else if(captureSound !== null && move.captured) {
    captureSound.currentTime = 0;
    captureSound.play();
  }
}


watch(
  gameIdParam,
  async (id) => {
    if (id === undefined) {
      chessParty.value = undefined
      return
    }

    const loadedParty: ChessParty = await api.getChessGame(id)
    chessParty.value = {
      ...loadedParty,
      id: String(loadedParty.id),
    }

  },
  { immediate: true },
)

</script>

<template>
  <n-flex style="height: calc(100dvh - 2rem)" :justify="justifyContent" :align="justifyContent">
    <n-flex :justify="justifyContent">
      <live-game-view
        send-move
        :board-state="boardState"
        :player-info-show="true"
        :chess-party="chessParty"
        :orientation="orientation"
        :view-only="viewOnly"
        :player-side="playerSide"
        :on-create="onCreate"
        :on-move="onMove"
        :on-game-finish="onGameFinish"
      />
      <n-flex>
        <side-info-panel
          :show-game-event-button="showGameEventButtons"
          :gameId="gameIdParam"
          :on-surrender="onSurrender"
          :on-draw="onDraw"
          :show-game-info="showGameInfo"
          :board-state="boardState"
          :game-status="gameStatus"
          :active-games="liveGameStore.activeGames"/>
      </n-flex>
    </n-flex>
  </n-flex>
</template>

<style scoped></style>
