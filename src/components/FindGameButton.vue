<script setup lang="ts">

import { useMatchQueue } from '@/composables/useMatchQueue';
import { useLiveGameStore } from '@/stores/useLiveGameStore';
import type { TimeControl } from '@/types/ChessParty';
import { NButton } from 'naive-ui';
import { ref, toRefs, watch } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps<{
  onQueue?: (inQueue: boolean) => void
  timeControl: TimeControl
}>();

const matchQueue = useMatchQueue()
const { inQueue } = toRefs(matchQueue)
const buttonText = ref("FIND GAME")
const loading = ref(false)

const router = useRouter()
const activeGameStore = useLiveGameStore()

const gameFindedCallback = (gameId: string) => {
  activeGameStore.load(gameId)
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

watch(
  inQueue,
  (newValue) => {
    buttonText.value = newValue ? "CANCEL" : "FIND GAME"
    loading.value = newValue
    props.onQueue?.(newValue)
  }, { immediate: true}
)


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
