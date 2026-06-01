<script setup lang="ts">
import { NButton, NCard, NFlex, NText } from 'naive-ui';
import MoveTable from '../MoveTable.vue';
import ControlPanel from './ControlPanel.vue';
import type { BoardState } from '@/composables/useBoard';
import type { GameStatus } from '@/types/ChessParty';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps<{
  boardState: BoardState,
  onSurrender?: () => void,
  onDraw?: () => void,
  onDrawDecline?: () => void,
  showGameEventButton?: boolean
  showDrawOfferPanel?: boolean
  gameStatus?: GameStatus
}>()

const { t } = useI18n()

const gameStatus = computed(() => {
  return props.gameStatus ?? props.boardState.gameStatus.value
})
</script>

<template>
  <n-flex vertical justify="space-between">
    <n-text style="font-size: 20px"> {{ props.boardState.openingName.value }}</n-text>
    <n-card v-if="props.showDrawOfferPanel" size="small" embedded>
      <n-flex vertical :size="12">
        <n-text strong>{{ t('boardPage.playTab.drawOfferIncomingTitle') }}</n-text>
        <n-text depth="3">{{ t('boardPage.playTab.drawOfferIncomingDescription') }}</n-text>
        <n-flex justify="end">
          <n-button secondary @click="props.onDrawDecline">
            {{ t('boardPage.playTab.declineDrawOffer') }}
          </n-button>
          <n-button type="info" @click="props.onDraw">
            {{ t('common.accept') }}
          </n-button>
        </n-flex>
      </n-flex>
    </n-card>
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
