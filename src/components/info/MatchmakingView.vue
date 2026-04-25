<script setup lang="ts">
import { useApi } from '@/composables/useApi';
import { useAuthStore } from '@/stores/useAuthStore';
import { NFlex } from 'naive-ui';
import FindGameButton from '../FindGameButton.vue';
import type { ChessParty } from '@/types/ChessParty';
import type { PlayerSide } from '@/types/ChessParty';
import TimeControlCollapseButton from './TimeControlCollapseButton.vue';
import { computed, ref } from 'vue';
import { TIME_CONTROLS } from '@/types/ChessParty';
import ActiveGameCollapseButton from './ActiveGameCollapseButton.vue';
import { NScrollbar, useNotification } from 'naive-ui';
import { useMatchQueue } from '@/composables/useMatchQueue';
import CreatePartyCollapseButton from './CreatePartyCollapseButton.vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

const props = defineProps<{
  currentGameId?: string
  activeGames?: readonly ChessParty[]
}>()

const timeControl = ref(TIME_CONTROLS.Rapid[1])
const matchQueue = useMatchQueue()
const api = useApi()
const authStore = useAuthStore()
const router = useRouter()
const notification = useNotification()
const { t } = useI18n()
const isActiveTimes = computed(() => {
  return !matchQueue.inQueue
})

function mapSide(side: PlayerSide | 'random') {
  if (side === 'random') return null
  return side === 'white' ? 'WHITE' : 'BLACK'
}

async function createChallenge(payload: {
  initialMinutes: number
  incrementSeconds: number
  side: PlayerSide | 'random'
}) {
  const initiator = authStore.getId()
  if (!initiator) {
    return
  }

  try {
    const challenge = await api.createChallenge({
      initiator,
      opponent: null,
      initiatorSide: mapSide(payload.side),
      timeControl: {
        initTime: payload.initialMinutes * 60 * 1000,
        increment: payload.incrementSeconds * 1000,
      },
    })

    await router.push(`/challenge/${challenge.id}`)
  } catch {
    notification.error({
      title: t('challengePage.title'),
      content: t('challengePage.createError'),
      duration: 4000,
    })
  }
}

</script>

<template>
  <n-scrollbar style="max-height: 690px">
    <n-flex vertical>
      <find-game-button :time-control="timeControl"/>
      <time-control-collapse-button v-model="timeControl" :is-active="isActiveTimes"/>
      <create-party-collapse-button @confirm="createChallenge" />
      <active-game-collapse-button :selected-game-id="props.currentGameId"/>
    </n-flex>
  </n-scrollbar>
</template>

<style scoped>

</style>
