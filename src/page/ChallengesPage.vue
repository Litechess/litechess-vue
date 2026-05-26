<script setup lang="ts">
import { useApi } from '@/composables/useApi'
import { useAuthStore } from '@/stores/useAuthStore'
import type { PlayerSide, TimeControl } from '@/types/ChessParty'
import type { Challenge, PlayerColor } from '@/types/Challenge'
import type { UserInfo } from '@/types/UserInfo'
import {
  NButton,
  NCard,
  NDataTable,
  NEmpty,
  NFlex,
  NResult,
  NScrollbar,
  NSlider,
  NSpin,
  NText,
  useNotification,
  type DataTableColumns,
} from 'naive-ui'
import { computed, h, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

type ChallengeListRow = Challenge & {
  originalId: string
  initiatorName: string
  opponentName: string
}

const api = useApi()
const authStore = useAuthStore()
const router = useRouter()
const notification = useNotification()
const { t } = useI18n()

const challenges = ref<Challenge[]>([])
const userMap = ref<Record<string, UserInfo | null>>({})
const loading = ref(false)
const loadFailed = ref(false)
const creating = ref(false)
const initialMinutes = ref(10)
const incrementSeconds = ref(5)
const selectedSide = ref<PlayerSide | 'random'>('random')

const challengeRows = computed<ChallengeListRow[]>(() => {
  return challenges.value
    .filter((challenge) => {
      return (challenge.status ?? 'WAITING') === 'WAITING'
    })
    .map((challenge) => ({
      ...challenge,
      originalId: challenge.id,
      initiatorName: resolveUserName(challenge.initiator),
      opponentName: challenge.opponent === null
        ? t('challengesPage.anyone')
        : resolveUserName(challenge.opponent),
    }))
})

const columns = computed<DataTableColumns<ChallengeListRow>>(() => [
  {
    title: t('challengesPage.columns.initiator'),
    key: 'initiator',
    render: (row) => {
      return h(NText, { strong: true }, { default: () => row.initiatorName })
    },
  },
  {
    title: t('challengesPage.columns.access'),
    key: 'opponent',
    render: (row) => {
      return h(NText, { depth: row.opponent === null ? 3 : 1 }, { default: () => row.opponentName })
    },
  },
  {
    title: t('challengesPage.columns.side'),
    key: 'initiatorSide',
    render: (row) => formatSide(row.initiatorSide),
  },
  {
    title: t('challengesPage.columns.timeControl'),
    key: 'timeControl',
    render: (row) => formatControl(row.timeControl),
  },
])

async function loadChallenges() {
  loading.value = true
  loadFailed.value = false

  try {
    const loadedChallenges = await api.getAllChallenges()
    challenges.value = loadedChallenges
    await loadUserNames(loadedChallenges)
  } catch {
    loadFailed.value = true
  } finally {
    loading.value = false
  }
}

function formatMinutes(value: number): string {
  const wholeMinutes = Math.floor(value)
  const hasHalfMinute = value % 1 !== 0

  if (wholeMinutes === 0 && hasHalfMinute) {
    return `30 ${t('time.seconds.short')}`
  }

  if (hasHalfMinute) {
    return `${wholeMinutes} ${t('time.minutes.short')} 30 ${t('time.seconds.short')}`
  }

  return `${wholeMinutes} ${t('time.minutes.short')}`
}

function formatSeconds(value: number): string {
  return `${value} ${t('time.seconds.short')}`
}

function selectSide(side: PlayerSide | 'random'): void {
  selectedSide.value = side
}

function mapSide(side: PlayerSide | 'random') {
  if (side === 'random') {
    return null
  }

  return side === 'white' ? 'WHITE' : 'BLACK'
}

async function createChallenge() {
  const initiator = authStore.getId()
  if (!initiator || creating.value) {
    return
  }

  creating.value = true

  try {
    const challenge = await api.createChallenge({
      initiator,
      opponent: null,
      initiatorSide: mapSide(selectedSide.value),
      timeControl: {
        initTime: initialMinutes.value * 60 * 1000,
        increment: incrementSeconds.value * 1000,
      },
    })

    await router.push(`/challenge/${challenge.id}`)
  } catch {
    notification.error({
      title: t('challengePage.title'),
      content: t('challengePage.createError'),
      duration: 4000,
    })
  } finally {
    creating.value = false
  }
}

async function loadUserNames(items: Challenge[]) {
  const ids = Array.from(
    new Set(
      items.flatMap((challenge) => {
        return challenge.opponent === null
          ? [challenge.initiator]
          : [challenge.initiator, challenge.opponent]
      }),
    ),
  )

  const missingIds = ids.filter((id) => userMap.value[id] === undefined)

  if (missingIds.length === 0) {
    return
  }

  const settled = await Promise.allSettled(
    missingIds.map(async (id) => ({
      id,
      user: await api.getUserInfo(id),
    })),
  )

  const nextMap = { ...userMap.value }

  settled.forEach((result, index) => {
    const id = missingIds[index]

    if (result.status === 'fulfilled') {
      nextMap[id] = result.value.user
      return
    }

    nextMap[id] = null
  })

  userMap.value = nextMap
}

function resolveUserName(userId: string): string {
  return userMap.value[userId]?.nickname ?? userId
}

function formatControl(control: TimeControl | null | undefined): string {
  if (control == null || (control.initTime === 0 && control.increment === 0)) {
    return t('challengesPage.noTimeControl')
  }

  const initMinutes = control.initTime / 60000
  const incrementSeconds = control.increment / 1000

  return `${trimTrailingZero(initMinutes)} ${t('time.minutes.short')} + ${trimTrailingZero(incrementSeconds)} ${t('time.seconds.short')}`
}

function formatSide(side: PlayerColor | null): string {
  if (side === 'WHITE') {
    return t('challengesPage.sideWhite')
  }

  if (side === 'BLACK') {
    return t('challengesPage.sideBlack')
  }

  return t('challengesPage.sideRandom')
}

function trimTrailingZero(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1).replace(/\.0$/, '')
}

function openChallenge(id: string) {
  router.push(`/challenge/${id}`)
}

function createRowProps(row: ChallengeListRow) {
  return {
    style: 'cursor: pointer;',
    onClick: () => {
      openChallenge(row.originalId)
    },
  }
}

onMounted(async () => {
  await loadChallenges()
})
</script>

<template>
  <div class="challenges-page">
    <n-flex vertical :size="24" align="center">
      <n-text tag="h1" class="page-title">
          {{ t('challengesPage.title') }}
      </n-text>

      <div class="page-content">
        <n-card class="table-panel" :bordered="true" content-style="height: 100%">
          <n-spin v-if="loading" size="large">
            <div class="table-state" />
          </n-spin>

          <n-result
            v-else-if="loadFailed"
            class="table-state"
            status="error"
            :title="t('challengesPage.loadErrorTitle')"
            :description="t('challengesPage.loadErrorDescription')"
          />

          <n-empty
            v-else-if="challengeRows.length === 0"
            class="table-state"
            :description="t('challengesPage.empty')"
            size="huge"
          />

          <n-scrollbar v-else class="table-scroll">
            <n-data-table
              class="challenges-table"
              :columns="columns"
              :data="challengeRows"
              :row-props="createRowProps"
              :max-height="99999"
            />
          </n-scrollbar>
        </n-card>

        <n-card class="create-panel" :title="t('boardPage.matchmakingTab.createParty')">
          <n-flex vertical :size="18">
            <n-flex vertical :size="8">
              <n-text strong>{{ t('boardPage.matchmakingTab.initialTime') }}</n-text>
              <n-slider
                v-model:value="initialMinutes"
                :min="0.5"
                :max="180"
                :step="0.5"
                :format-tooltip="formatMinutes"
              />
              <n-text depth="3">{{ formatMinutes(initialMinutes) }}</n-text>
            </n-flex>

            <n-flex vertical :size="8">
              <n-text strong>{{ t('boardPage.matchmakingTab.increment') }}</n-text>
              <n-slider
                v-model:value="incrementSeconds"
                :min="0"
                :max="180"
                :step="5"
                :format-tooltip="formatSeconds"
              />
              <n-text depth="3">+{{ formatSeconds(incrementSeconds) }}</n-text>
            </n-flex>

            <n-flex vertical :size="8">
              <n-text strong>{{ t('boardPage.matchmakingTab.side') }}</n-text>
              <n-flex>
                <n-button
                  :type="selectedSide === 'white' ? 'primary' : 'default'"
                  :ghost="selectedSide === 'white'"
                  :tertiary="selectedSide !== 'white'"
                  block
                  @click="selectSide('white')"
                >
                  {{ t('boardPage.matchmakingTab.sideWhite') }}
                </n-button>

                <n-button
                  :type="selectedSide === 'random' ? 'primary' : 'default'"
                  :ghost="selectedSide === 'random'"
                  :tertiary="selectedSide !== 'random'"
                  block
                  @click="selectSide('random')"
                >
                  {{ t('boardPage.matchmakingTab.sideRandom') }}
                </n-button>

                <n-button
                  :type="selectedSide === 'black' ? 'primary' : 'default'"
                  :ghost="selectedSide === 'black'"
                  :tertiary="selectedSide !== 'black'"
                  block
                  @click="selectSide('black')"
                >
                  {{ t('boardPage.matchmakingTab.sideBlack') }}
                </n-button>
              </n-flex>
            </n-flex>

            <n-button
              type="primary"
              block
              :loading="creating"
              @click="createChallenge"
            >
              {{ t('boardPage.matchmakingTab.confirmCreateParty') }}
            </n-button>
          </n-flex>
        </n-card>
      </div>
    </n-flex>
  </div>
</template>

<style scoped>
.challenges-page {
  width: 100%;
}

.page-title {
  margin: 0;
  font-size: 42px;
  font-weight: 800;
  text-align: center;
}

.page-content {
  width: min(90%, 1240px);
  margin: 0 auto;
  display: grid;
  grid-template-columns: minmax(0, 820px) 360px;
  gap: 24px;
  align-items: start;
  justify-content: center;
}

.table-panel {
  min-width: 0;
  height: calc(100dvh - 180px);
}

.challenges-table {
  width: 100%;
}

.table-scroll {
  height: 100%;
}

.table-state {
  height: 100%;
  min-height: 240px;
}

.create-panel {
  width: 100%;
}

@media (max-width: 1200px) {
  .page-content {
    width: min(94%, 980px);
    grid-template-columns: minmax(0, 1fr);
  }

  .table-panel {
    height: calc(100dvh - 260px);
  }

  .create-panel {
    width: 100%;
  }
}
</style>
