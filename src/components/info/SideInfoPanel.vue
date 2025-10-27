<script setup lang="ts">
import { NTabPane, NTabs, NCard, type TabsInst } from 'naive-ui';
import { computed, h, nextTick, ref, watch, type Ref } from 'vue';
import GameInfoView from './GameInfoView.vue';
import PieceText from '../PieceText.vue';
import MatchmakingView from './MatchmakingView.vue';
import ImageText from '../ImageText.vue';
import type { ChessParty, GameStatus } from '@/types/ChessParty';
import type { BoardState } from '@/composables/useBoard';

const props = defineProps<{
  boardState?: BoardState
  gameStatus?: GameStatus
  gameId?: string
  activeGames?: readonly ChessParty[]
}>()

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
  (oldVal, newVal) => {
    if (newVal) {
      selectedTab.value = oldVal ? selectedTab.value : GAME_TAB_NAME
    } else {
      selectedTab.value = MATCHMAKING_TAB_NAME
    }

    nextTick(() => tabRef.value?.syncBarPosition())
  },
  { immediate: true },
)

</script>

<template>
  <n-card style="height: 100%">
    <n-tabs
      style="width: 400px"
      type="line"
      justify-content="center"
      size="large"
      ref="tabRef"
      v-model:value="selectedTab">

      <n-tab-pane v-if="gameId"
        :name="GAME_TAB_NAME"
        :tab="piecePane">
        <game-info-view v-if="boardState"
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
