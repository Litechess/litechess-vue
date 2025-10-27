<script setup lang="ts">
import DropdownButton from '../DropdownButton.vue';
import { type Component, computed, h, ref } from 'vue';
import GameIcon from '../icon/GameIcon.vue';
import { useLiveGameStore } from '@/stores/useLiveGameStore';
import { NCard, NFlex } from 'naive-ui';
import GameCard from '../GameCard.vue';
import { RouterLink } from 'vue-router';

const activeGameIcon: Component = h(GameIcon)

const props = defineProps<{
  isOpen?: boolean
  selectedGameId?: string
}>()
const liveGameStore = useLiveGameStore()

const isOpen = ref(props.isOpen ?? false)
const title = computed(() => {
  return `Active games (${liveGameStore.activeGames.length})`
})
const selectedId = computed(() => {
  return props.selectedGameId ?? undefined
})
</script>

<template>
  <dropdown-button :icon="activeGameIcon" :label="title" v-model="isOpen"/>
  <n-flex v-show="isOpen && liveGameStore.activeGames.length > 0" justify="center">
    <n-card>
      <n-flex justify="center">
        <router-link
          :to="`/game/${activeGame.id}`"
          style="text-decoration: none; color: inherit"
          v-for="activeGame in liveGameStore.activeGames"
          :key="activeGame.id">
          <game-card
            :board-size="300"
            :isSelected="selectedId === activeGame.id"
            :chessParty="activeGame"
          />
        </router-link>
      </n-flex>
    </n-card>
  </n-flex>
</template>
