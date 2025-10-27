<script setup lang="ts">
import { NFlex } from 'naive-ui';
import FindGameButton from '../FindGameButton.vue';
import type { ChessParty } from '@/types/ChessParty';
import TimeControlCollapseButton from './TimeControlCollapseButton.vue';
import { ref } from 'vue';
import { TIME_CONTROLS } from '@/types/ChessParty';
import ActiveGameCollapseButton from './ActiveGameCollapseButton.vue';
import { NScrollbar } from 'naive-ui';

const props = defineProps<{
  currentGameId?: string
  activeGames?: readonly ChessParty[]
}>()

const timeControl = ref(TIME_CONTROLS.Rapid[1])
const isActiveTimes = ref(false)

const onQueue = (inQueue: boolean) => {
 isActiveTimes.value = !inQueue
}

</script>

<template>
  <n-scrollbar style="max-height: 690px">
    <n-flex vertical>
      <find-game-button :on-queue="onQueue" :time-control="timeControl"/>
      <time-control-collapse-button v-model="timeControl" :is-active="isActiveTimes"/>
      <active-game-collapse-button :selected-game-id="props.currentGameId"/>
    </n-flex>
  </n-scrollbar>
</template>

<style scoped>

</style>
