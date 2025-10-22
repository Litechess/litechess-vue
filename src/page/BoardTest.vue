<script setup lang="ts">
import { useApi } from '@/composables/useApi'
import { useBoard } from '@/composables/useBoard'
import { useAuthStore } from '@/stores/useAuthStore'
import { type ChessParty, type GameStatus, type PlayerSide } from '@/types/ChessParty'
import { NFlex } from 'naive-ui'
import { computed, ref, watch, type Ref } from 'vue'
import { useRoute } from 'vue-router'
import { BoardApi } from 'vue3-chessboard'
import LiveGameView from '@/components/game/LiveGameView.vue'
import SideInfoPanel from '@/components/info/SideInfoPanel.vue'

const boardState = useBoard()
const authStore = useAuthStore()
const api = useApi()
const route = useRoute()

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

const onCreate = (api: BoardApi) => {
  boardApi.value = api
}

const onTimerFinish = (side: PlayerSide) => {
  if(chessParty.value && side === "white") chessParty.value.status = "WIN_BLACK"
  else if(chessParty.value && side == "black") chessParty.value.status = "WIN_WHITE"
}

const showGameInfo = computed(() => {
  return gameIdParam.value ? true : false
})

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
  <n-flex style="height: calc(100dvh - 2rem)" justify="center" align="center">
    <n-flex justify="center">
      <live-game-view
        :board-state="boardState"
        :player-info-show="true"
        :chess-party="chessParty"
        :orientation="orientation"
        :view-only="viewOnly"
        :player-side="playerSide"
        :on-create="onCreate"
        :on-timer-finish="onTimerFinish"
      />
      <n-flex>
        <side-info-panel
          :gameId="gameIdParam"
          :show-game-info="showGameInfo"
          :board-state="boardState"
          :game-status="gameStatus"/>
      </n-flex>
    </n-flex>
  </n-flex>
</template>

<style scoped></style>
