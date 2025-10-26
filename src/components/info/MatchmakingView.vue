<script setup lang="ts">
import { NFlex, NText, NScrollbar } from 'naive-ui';
import FindGameButton from '../FindGameButton.vue';
import { RouterLink } from 'vue-router';
import type { ChessParty } from '@/types/ChessParty';
import GameCard from '../GameCard.vue';

const props = defineProps<{
  currentGameId?: string
  activeGames?: readonly ChessParty[]
}>()

</script>

<template>
  <n-flex vertical>
    <find-game-button />
    <n-flex justify="center">
        <n-text style="font-size: 18px" v-if="props.activeGames && props.activeGames.length > 0">Active games</n-text>
        <n-scrollbar style="max-height: 42em; min-height: 42em">
          <n-flex justify="center" :size="10">
            <router-link
              :to="`/game/${activeGame.id}`"
              style="text-decoration: none; color: inherit"
              v-for="activeGame in props.activeGames"
              :key="activeGame.id"
            >
              <game-card
                :board-size="300"
                :isSelected="props.currentGameId === activeGame.id"
                :chessParty="activeGame"
              />
            </router-link>
          </n-flex>
        </n-scrollbar>
    </n-flex>
  </n-flex>
</template>

<style scoped>

</style>
