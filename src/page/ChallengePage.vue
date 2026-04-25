<script setup lang="ts">
import GameView from '@/components/game/GameView.vue'
import { useMediaQuery } from '@vueuse/core'
import { useAuthStore } from '@/stores/useAuthStore'
import type { Challenge, PlayerColor } from '@/types/Challenge'
import type { PlayerSide, TimeControl } from '@/types/ChessParty'
import {
  NAvatar,
  NButton,
  NCard,
  NDivider,
  NFlex,
  NText,
  useNotification,
} from 'naive-ui'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const authStore = useAuthStore()
const notification = useNotification()
const { t } = useI18n()
const isCompact = useMediaQuery('(max-width: 1100px)')

const challenge = computed<Challenge>(() => ({
  id: 'test-challenge-id',
  initiator: '0b2df2c3-b52f-4d2f-a9ec-111111111111',
  opponent: null,
  initiatorSide: 'BLACK',
  control: {
    initTime: 180000,
    increment: 2000,
  },
}))

const initiatorInfo = computed(() => ({
  nickname: 'MagnusMock',
  avatarUrl: '',
}))

const currentUserId = computed(() => authStore.getId())

const isInitiator = computed(() => {
  return currentUserId.value === challenge.value.initiator
})

const canAccept = computed(() => {
  return currentUserId.value !== null && !isInitiator.value
})

const orientation = computed<PlayerSide>(() => {
  if (challenge.value.initiatorSide === null) {
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

function mapColorToSide(color: PlayerColor): PlayerSide {
  return color === 'WHITE' ? 'white' : 'black'
}

function flipSide(side: PlayerSide): PlayerSide {
  return side === 'white' ? 'black' : 'white'
}

function formatControl(control: TimeControl): string {
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

function formatChallengeSide(side: PlayerColor | null): string {
  if (side === 'WHITE') return t('challengePage.sideWhite')
  if (side === 'BLACK') return t('challengePage.sideBlack')
  return t('challengePage.sideRandom')
}

function formatViewerSide(): string {
  if (challenge.value.initiatorSide === null) {
    return t('challengePage.sideRandom')
  }

  return formatChallengeSide(orientation.value === 'white' ? 'WHITE' : 'BLACK')
}

function acceptChallenge(): void {
  if (!canAccept.value) {
    return
  }

  notification.info({
    title: t('challengePage.acceptAction'),
    content: t('challengePage.acceptStub'),
    duration: 4000,
  })
}
</script>

<template>
  <n-flex style="height: calc(100dvh - 2rem)" justify="center" align="center">
    <n-flex justify="center" :style="contentStyle">
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
              :src="initiatorInfo.avatarUrl || undefined"
            >
              {{ initiatorInfo.nickname.slice(0, 1).toUpperCase() }}
            </n-avatar>

            <n-flex vertical :size="4">
              <n-text depth="3">{{ t('challengePage.initiator') }}</n-text>
              <n-text style="font-size: 20px; font-weight: 600">
                {{ initiatorInfo.nickname }}
              </n-text>
            </n-flex>
          </n-flex>

          <n-divider style="margin: 0" />

          <n-flex vertical :size="14">
            <n-flex vertical :size="4">
              <n-text depth="3">{{ t('challengePage.control') }}</n-text>
              <n-text style="font-size: 18px">
                {{ formatControl(challenge.control) }}
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
        </n-flex>
      </n-card>
    </n-flex>
  </n-flex>
</template>

<style scoped></style>
