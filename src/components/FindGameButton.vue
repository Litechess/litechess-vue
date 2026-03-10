<script setup lang="ts">

import { useMatchQueue } from '@/composables/useMatchQueue';
import { useLiveGameStore } from '@/stores/useLiveGameStore';
import type { TimeControl } from '@/types/ChessParty';
import { NButton } from 'naive-ui';
import { computed, onMounted, toRefs } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

const props = defineProps<{
  onQueue?: (inQueue: boolean) => void
  timeControl: TimeControl
}>();

const { t } = useI18n()

let gameFindSound: HTMLAudioElement | null;
onMounted(() => {
  gameFindSound = new Audio('/sounds/Confirmation.mp3');
})

const matchQueue = useMatchQueue()
const { inQueue } = toRefs(matchQueue)
const buttonText = computed(() => {
  return inQueue.value ? t('boardPage.matchmakingTab.cancelButton').toUpperCase() : t('boardPage.matchmakingTab.playButton').toUpperCase()
})

// const loading = computed(() => {
//   return inQueue.value
// })

const router = useRouter()
const activeGameStore = useLiveGameStore()

const gameFindedCallback = (gameId: string) => {
  activeGameStore.load(gameId)
  if(gameFindSound !== null) {
    gameFindSound.play()
  }

  router.push(`/game/${gameId}`)
}

function click() {
  if(inQueue.value == false) {
    matchQueue.enterInQueue(gameFindedCallback, props.timeControl)
  } else {
    console.log("Leave")
    matchQueue.leaveFromQueue()
  }
}

</script>

<template>
<n-button
  type="primary"
  size="large"
  @click="click"
  style="font-size: 20px"> {{ buttonText }} </n-button>
</template>

<style scoped>

</style>
