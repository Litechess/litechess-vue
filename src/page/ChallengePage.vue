<script setup lang="ts">
import GameView from '@/components/game/GameView.vue'
import { useMediaQuery } from '@vueuse/core'
import { useApi } from '@/composables/useApi'
import { useAuthStore } from '@/stores/useAuthStore'
import { useStompSocketStore, type SubscriptionCallback } from '@/stores/useStompSocketStore'
import type { Challenge, GameCreatedEvent, PlayerColor } from '@/types/Challenge'
import type { PlayerSide, TimeControl } from '@/types/ChessParty'
import type { SocketMessage } from '@/types/Socket'
import type { UserInfo } from '@/types/UserInfo'
import {
  NAvatar,
  NButton,
  NCard,
  NDivider,
  NFlex,
  NInput,
  NInputGroup,
  NResult,
  NSpin,
  NText,
  useNotification,
} from 'naive-ui'
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'

const api = useApi()
const authStore = useAuthStore()
const socketStore = useStompSocketStore()
const route = useRoute()
const router = useRouter()
const notification = useNotification()
const { t } = useI18n()
const isCompact = useMediaQuery('(max-width: 1100px)')

const challenge = ref<Challenge | null>(null)
const initiatorInfo = ref<UserInfo | null>(null)
const loading = ref(false)
const accepting = ref(false)
const loadFailed = ref(false)

let currentSubscriptionDestination: string | null = null
let currentSubscriptionCallback: SubscriptionCallback | null = null

const challengeId = computed(() => {
  const id = route.params.id
  return typeof id === 'string' && id.length > 0 ? id : undefined
})

const currentUserId = computed(() => authStore.getId())

const isInitiator = computed(() => {
  return challenge.value !== null && currentUserId.value === challenge.value.initiator
})

const canAccept = computed(() => {
  if (challenge.value === null || currentUserId.value === null || isInitiator.value) {
    return false
  }

  if (isCreatingParty.value) {
    return false
  }

  if (challenge.value.status === 'ACCEPTED' || challenge.value.status === 'CREATED') {
    return false
  }

  if (challenge.value.opponent === null) {
    return true
  }

  return challenge.value.opponent === currentUserId.value
})

const isCreatingParty = computed(() => {
  if (currentUserId.value === null || isInitiator.value || challenge.value === null) {
    return false
  }

  if (accepting.value) {
    return true
  }

  return challenge.value.status === 'WAITING' && challenge.value.opponent === currentUserId.value
})

const orientation = computed<PlayerSide>(() => {
  if (challenge.value === null || challenge.value.initiatorSide === null) {
    return 'white'
  }

  if (isInitiator.value) {
    return mapColorToSide(challenge.value.initiatorSide)
  }

  return flipSide(mapColorToSide(challenge.value.initiatorSide))
})

const contentStyle = computed(() => ({
  width: '100%',
  flexDirection: isCompact.value ? 'column' : 'row',
  alignItems: isCompact.value ? 'center' : 'flex-start',
}))

const challengeLink = computed(() => {
  if (challenge.value === null) {
    return ''
  }

  return `${window.location.origin}/challenge/${challenge.value.id}`
})

function mapColorToSide(color: PlayerColor): PlayerSide {
  return color === 'WHITE' ? 'white' : 'black'
}

function flipSide(side: PlayerSide): PlayerSide {
  return side === 'white' ? 'black' : 'white'
}

function formatControl(control: TimeControl | null | undefined): string {
  if (control == null) {
    return t('challengePage.noTimeControl')
  }

  if (control.initTime === 0 && control.increment === 0) {
    return t('challengePage.noTimeControl')
  }

  const initMinutes = control.initTime / 60000
  const incrementSeconds = control.increment / 1000

  return `${trimTrailingZero(initMinutes)} ${t('time.minutes.short')} + ${trimTrailingZero(incrementSeconds)} ${t('time.seconds.short')}`
}

function trimTrailingZero(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1).replace(/\.0$/, '')
}

function formatViewerSide(): string {
  if (challenge.value === null || challenge.value.initiatorSide === null) {
    return t('challengePage.sideRandom')
  }

  return orientation.value === 'white' ? t('challengePage.sideWhite') : t('challengePage.sideBlack')
}

function unsubscribeFromChallengeEvents() {
  if (currentSubscriptionDestination && currentSubscriptionCallback) {
    socketStore.unsubscribe(currentSubscriptionDestination, currentSubscriptionCallback)
  }

  currentSubscriptionDestination = null
  currentSubscriptionCallback = null
}

function resolveCreatedGameId(payload: unknown): string | null {
  if (typeof payload !== 'object' || payload === null) {
    return null
  }

  const maybeEvent = payload as Partial<GameCreatedEvent> & {
    payload?: Partial<GameCreatedEvent>
  }

  if (typeof maybeEvent.gameId === 'string' && maybeEvent.gameId.length > 0) {
    return maybeEvent.gameId
  }

  if (typeof maybeEvent.payload?.gameId === 'string' && maybeEvent.payload.gameId.length > 0) {
    return maybeEvent.payload.gameId
  }

  return null
}

async function redirectToGame(gameId: string) {
  unsubscribeFromChallengeEvents()
  await router.push(`/game/${gameId}`)
}

function subscribeToChallengeEvents(id: string) {
  unsubscribeFromChallengeEvents()

  const destination = `/${id}/events`
  const callback: SubscriptionCallback = async (message) => {
    const parsed = JSON.parse(message.body) as SocketMessage | GameCreatedEvent
    const gameId = resolveCreatedGameId(parsed)

    if (!gameId) {
      return
    }

    await redirectToGame(gameId)
  }

  currentSubscriptionDestination = destination
  currentSubscriptionCallback = callback
  socketStore.subscribe(destination, callback)
}

async function loadChallenge(id: string) {
  loading.value = true
  loadFailed.value = false
  challenge.value = null
  initiatorInfo.value = null
  unsubscribeFromChallengeEvents()

  try {
    const loadedChallenge = await api.getChallenge(id)
    challenge.value = loadedChallenge
    initiatorInfo.value = await api.getUserInfo(loadedChallenge.initiator)

    if (loadedChallenge.status === 'CREATED') {
      await redirectToGame(loadedChallenge.id)
      return
    }

    if (loadedChallenge.status === 'WAITING' || loadedChallenge.status === 'ACCEPTED' || loadedChallenge.status === undefined) {
      subscribeToChallengeEvents(loadedChallenge.id)
    }
  } catch {
    loadFailed.value = true
    notification.error({
      title: t('challengePage.loadError'),
      content: t('challengePage.notFound'),
      duration: 4000,
    })
  } finally {
    loading.value = false
  }
}

async function acceptChallenge() {
  if (!challenge.value || !currentUserId.value || !canAccept.value || accepting.value) {
    return
  }

  accepting.value = true

  try {
    challenge.value = await api.acceptChallenge(challenge.value.id, currentUserId.value)

    if (challenge.value !== null && challenge.value.status === 'CREATED') {
      await redirectToGame(challenge.value.id)
    }
  } catch {
    notification.error({
      title: t('challengePage.acceptError'),
      content: t('challengePage.acceptUnavailable'),
      duration: 4000,
    })
  } finally {
    accepting.value = false
  }
}

async function copyChallengeLink() {
  if (!challengeLink.value) {
    return
  }

  try {
    await navigator.clipboard.writeText(challengeLink.value)
    notification.success({
      title: t('challengePage.copyAction'),
      content: t('challengePage.copySuccess'),
      duration: 3000,
    })
  } catch {
    notification.error({
      title: t('challengePage.copyAction'),
      content: t('challengePage.copyError'),
      duration: 3000,
    })
  }
}

watch(
  challengeId,
  async (id) => {
    if (!id) {
      loadFailed.value = true
      return
    }

    await loadChallenge(id)
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  unsubscribeFromChallengeEvents()
})
</script>

<template>
  <n-flex style="height: calc(100dvh - 2rem)" justify="center" align="center">
    <n-spin v-if="loading" size="large" />

    <n-result
      v-else-if="loadFailed || !challenge"
      status="error"
      :title="t('challengePage.notFound')"
      :description="t('challengePage.loadError')"
    />

    <n-flex v-else-if="challenge" justify="center" :style="contentStyle">
      <game-view
        :view-only="true"
        :orientation="orientation"
        :player-side="orientation"
      />

      <n-card style="width: min(360px, 100%)" :title="t('challengePage.title')">
        <n-flex vertical :size="20">
          <n-flex align="center" :size="14">
            <n-avatar
              round
              :size="56"
              :src="initiatorInfo?.avatarUrl || undefined"
            >
              {{ (initiatorInfo?.nickname ?? '?').slice(0, 1).toUpperCase() }}
            </n-avatar>

            <n-flex vertical :size="4">
              <n-text depth="3">{{ t('challengePage.initiator') }}</n-text>
              <n-text style="font-size: 20px; font-weight: 600">
                {{ initiatorInfo?.nickname ?? challenge.initiator }}
              </n-text>
            </n-flex>
          </n-flex>

          <n-divider style="margin: 0" />

          <n-flex vertical :size="14">
            <n-flex vertical :size="4">
              <n-text depth="3">{{ t('challengePage.control') }}</n-text>
              <n-text style="font-size: 18px">
                {{ formatControl(challenge.timeControl) }}
              </n-text>
            </n-flex>

            <n-flex vertical :size="4">
              <n-text depth="3">{{ t('challengePage.side') }}</n-text>
              <n-text style="font-size: 18px">
                {{ formatViewerSide() }}
              </n-text>
            </n-flex>
          </n-flex>

          <n-button
            v-if="canAccept"
            type="primary"
            block
            @click="acceptChallenge"
          >
            {{ t('challengePage.acceptAction') }}
          </n-button>

          <n-button
            v-else-if="isCreatingParty"
            block
            disabled
          >
            {{ t('challengePage.creatingParty') }}
          </n-button>

          <n-flex v-else-if="isInitiator" vertical :size="8">
            <n-text depth="3">{{ t('challengePage.link') }}</n-text>
            <n-input-group>
              <n-input
                :value="challengeLink"
                readonly
              />
              <n-button type="primary" @click="copyChallengeLink">
                {{ t('challengePage.copyAction') }}
              </n-button>
            </n-input-group>
          </n-flex>
        </n-flex>
      </n-card>
    </n-flex>

    <n-spin v-else size="large" />
  </n-flex>
</template>

<style scoped></style>
