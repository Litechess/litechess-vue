<script setup lang="ts">
import { NTabPane, NTabs, NCard, type TabsInst } from 'naive-ui';
import { computed, h, nextTick, ref, watch, type Ref } from 'vue';
import GameInfoView from './GameInfoView.vue';
import PieceText from '../PieceText.vue';
import MatchmakingView from './MatchmakingView.vue';
import ImageText from '../ImageText.vue';
import type { ChessParty, GameStatus } from '@/types/ChessParty';
import type { BoardState } from '@/composables/useBoard';
import { useMediaQuery } from '@vueuse/core';

const props = defineProps<{
  boardState?: BoardState
  gameStatus?: GameStatus
  gameId?: string
  showGameEventButton?: boolean
  onSurrender?: () => void
  onDraw?: () => void
  activeGames?: readonly ChessParty[]
}>()

const isMobile = useMediaQuery('(max-width: 767px)')

const adaptiveWidth = computed(() => {
  return isMobile.value ? '250px' : '400px'
})

const piecePane = h(PieceText, {
  text: 'Game',
  piece: 'p'
})

const matchmakingTab = h(ImageText, {
  text: 'Matchmaking'
})

const boardState = computed(() => props.boardState)

const tabRef = ref<TabsInst | null>(null)

const GAME_TAB_NAME = 'gamePanel'
const MATCHMAKING_TAB_NAME = 'matchmaking'

const gameId = computed(() => {
  return props.gameId ?? undefined
})

const selectedTab: Ref<undefined | string> = ref(undefined)

watch(
  gameId,
  (newVal) => {
      selectedTab.value = newVal ? GAME_TAB_NAME : MATCHMAKING_TAB_NAME
    nextTick(() => tabRef.value?.syncBarPosition())
  },
  { immediate: true },
)

</script>

<template>
  <n-card style="height: 100%">
    <n-tabs
      :style = "{ width: adaptiveWidth }"
      type="line"
      justify-content="center"
      size="large"
      ref="tabRef"
      v-model:value="selectedTab">

      <n-tab-pane v-if="gameId"
        :name="GAME_TAB_NAME"
        :tab="piecePane">
        <game-info-view v-if="boardState"
          :show-game-event-button="props.showGameEventButton"
          :on-surrender="props.onSurrender"
          :on-draw="props.onDraw"
          :board-state="boardState"
          :game-status="props.gameStatus"/>
      </n-tab-pane>
      <n-tab-pane
        :name="MATCHMAKING_TAB_NAME"
        :tab="matchmakingTab"
        display-directive="show:lazy">
          <matchmaking-view
            :active-games="props.activeGames"
            :current-game-id="props.gameId"/>
      </n-tab-pane>
    </n-tabs>
  </n-card>
</template>
