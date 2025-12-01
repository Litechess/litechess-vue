<script setup lang="ts">
import { NFlex } from 'naive-ui';
import FindGameButton from '../FindGameButton.vue';
import type { ChessParty } from '@/types/ChessParty';
import TimeControlCollapseButton from './TimeControlCollapseButton.vue';
import { computed, ref } from 'vue';
import { TIME_CONTROLS } from '@/types/ChessParty';
import ActiveGameCollapseButton from './ActiveGameCollapseButton.vue';
import { NScrollbar } from 'naive-ui';
import { useMatchQueue } from '@/composables/useMatchQueue';

const props = defineProps<{
  currentGameId?: string
  activeGames?: readonly ChessParty[]
}>()

const timeControl = ref(TIME_CONTROLS.Rapid[1])
const matchQueue = useMatchQueue()
const isActiveTimes = computed(() => {
  return !matchQueue.inQueue
})

</script>

<template>
  <n-scrollbar style="max-height: 690px">
    <n-flex vertical>
      <find-game-button :time-control="timeControl"/>
      <time-control-collapse-button v-model="timeControl" :is-active="isActiveTimes"/>
      <active-game-collapse-button :selected-game-id="props.currentGameId"/>
    </n-flex>
  </n-scrollbar>
</template>

<style scoped>

</style>
