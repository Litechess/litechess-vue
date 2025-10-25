<script setup lang="ts">
import type { ChessParty, PlayerSide } from '@/types/ChessParty'
import { NFlex, NCard, NText } from 'naive-ui'
import LiveGameView from './game/LiveGameView.vue'
import { useAuthStore } from '@/stores/useAuthStore'
import { computed } from 'vue'

interface Props {
  chessParty: ChessParty
  orientation?: PlayerSide
  boardSize?: number
  isSelected: boolean
}

const props = defineProps<Props>()
const authStore = useAuthStore()

function getOrientation(game: ChessParty) {
  if (game.black.id == authStore.getId()) {
    return 'black'
  } else {
    return 'white'
  }
}

const orientation = computed(() => {
  return props.orientation ?? getOrientation(props.chessParty)
})

const style = computed(() => {
  return props.isSelected ? { 'background-color': 'rgba(37, 100, 37, 0.35)' } : {}
})
</script>

<template>
  <n-card :content-style="style">
    <n-flex
      vertical
      align="center"
      justify="center"
      :style="{ flexDirection: orientation == 'black' ? 'column-reverse' : 'column'}"
    >
      <n-text style="font-size: 18px"> {{ props.chessParty.black.name }}</n-text>
      <n-flex>
        <live-game-view
          :chess-party="props.chessParty"
          :view-only="true"
          :player-info-show="false"
          :player-side="orientation"
          :board-size="props.boardSize"
        />
      </n-flex>
      <n-text style="font-size: 18px"> {{ props.chessParty.white.name }}</n-text>
    </n-flex>
  </n-card>
</template>

<style scoped>

</style>
