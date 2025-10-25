<script setup lang="ts">

import { useMatchQueue } from '@/composables/useMatchQueue';
import { useLiveGameStore } from '@/stores/useLiveGameStore';
import { NButton } from 'naive-ui';
import { ref, toRefs, watch } from 'vue';
import { useRouter } from 'vue-router';

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
    matchQueue.enterInQueue(gameFindedCallback)
  } else {
    console.log("Leave")
    matchQueue.leaveFromQueue()
  }
}

watch(
  inQueue,
  (newValue) => {
    if(newValue) {
      buttonText.value = "CANCEL"
      loading.value = true
    }
    else {
      buttonText.value = "FIND GAME"
      loading.value = false
    }
  }
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
