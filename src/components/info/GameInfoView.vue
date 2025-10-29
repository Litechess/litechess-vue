<script setup lang="ts">
import { NFlex, NText } from 'naive-ui';
import MoveTable from '../MoveTable.vue';
import ControlPanel from './ControlPanel.vue';
import type { BoardState } from '@/composables/useBoard';
import type { GameStatus } from '@/types/ChessParty';
import { computed } from 'vue';

const props = defineProps<{
  boardState: BoardState,
  onSurrender?: () => void,
  onDraw?: () => void,
  showGameEventButton?: boolean
  gameStatus?: GameStatus
}>()

const gameStatus = computed(() => {
  return props.gameStatus ?? props.boardState.gameStatus.value
})
</script>

<template>
  <n-flex vertical justify="space-between">
    <n-text style="font-size: 20px"> {{ props.boardState.openingName.value }}</n-text>
    <move-table
      :selectMovePly="props.boardState.currentViewPly.value"
      :moves="props.boardState.moves.value"
      :move-click="props.boardState.viewPly"
      :gameStatus="gameStatus"
    />
    <control-panel
      :on-surrender="props.onSurrender"
      :on-draw="props.onDraw"
      :show-surrender-button="props.showGameEventButton"
      :show-draw-button="props.showGameEventButton"
      :view-next="props.boardState.viewNext"
      :view-previous="props.boardState.viewPrevious"
      :stop-view="props.boardState.stopView"/>
  </n-flex>
</template>
