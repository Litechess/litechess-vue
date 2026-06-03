<script setup lang="ts">
import { useApi } from '@/composables/useApi'
import type { ChessParty, TimeControl } from '@/types/ChessParty'
import {
  NCard,
  NDataTable,
  NEmpty,
  NFlex,
  NResult,
  NScrollbar,
  NSpin,
  NText,
  type DataTableColumns,
} from 'naive-ui'
import { computed, h, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

type GameListRow = {
  id: string
  white: string
  black: string
  moves: number
  timeControl: TimeControl | null
}

const api = useApi()
const router = useRouter()
const { t } = useI18n()

const games = ref<ChessParty[]>([])
const loading = ref(false)
const loadFailed = ref(false)

const rows = computed<GameListRow[]>(() => {
  return games.value.map((game) => ({
    id: game.id,
    white: game.white.name,
    black: game.black.name,
    moves: game.moves.length,
    timeControl: game.timeControl,
  }))
})

const columns = computed<DataTableColumns<GameListRow>>(() => [
  {
    title: t('gamesPage.columns.white'),
    key: 'white',
    render: (row) => h(NText, { strong: true }, { default: () => row.white }),
  },
  {
    title: t('gamesPage.columns.black'),
    key: 'black',
  },
  {
    title: t('gamesPage.columns.moves'),
    key: 'moves',
  },
  {
    title: t('gamesPage.columns.timeControl'),
    key: 'timeControl',
    render: (row) => formatControl(row.timeControl),
  },
])

async function loadGames() {
  loading.value = true
  loadFailed.value = false

  try {
    games.value = await api.getAllGames({
      live: true,
      finish: false,
    })
  } catch {
    loadFailed.value = true
  } finally {
    loading.value = false
  }
}

function formatControl(control: TimeControl | null | undefined): string {
  if (control == null || (control.initTime === 0 && control.increment === 0)) {
    return t('gamesPage.noTimeControl')
  }

  const initMinutes = control.initTime / 60000
  const incrementSeconds = control.increment / 1000

  return `${trimTrailingZero(initMinutes)} ${t('time.minutes.short')} + ${trimTrailingZero(incrementSeconds)} ${t('time.seconds.short')}`
}

function trimTrailingZero(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1).replace(/\.0$/, '')
}

function openGame(id: string) {
  router.push(`/game/${id}`)
}

function createRowProps(row: GameListRow) {
  return {
    style: 'cursor: pointer;',
    onClick: () => {
      openGame(row.id)
    },
  }
}

onMounted(async () => {
  await loadGames()
})
</script>

<template>
  <div class="games-page">
    <n-flex vertical :size="24" align="center">
      <n-text tag="h1" class="page-title">
        {{ t('gamesPage.title') }}
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
            :title="t('gamesPage.loadErrorTitle')"
            :description="t('gamesPage.loadErrorDescription')"
          />

          <n-empty
            v-else-if="rows.length === 0"
            class="table-state"
            :description="t('gamesPage.empty')"
            size="huge"
          />

          <n-scrollbar v-else class="table-scroll">
            <n-data-table
              class="games-table"
              :columns="columns"
              :data="rows"
              :row-props="createRowProps"
              :max-height="99999"
            />
          </n-scrollbar>
        </n-card>
      </div>
    </n-flex>
  </div>
</template>

<style scoped>
.games-page {
  width: 100%;
}

.page-title {
  margin: 0;
  font-size: 42px;
  font-weight: 800;
  text-align: center;
}

.page-content {
  width: min(90%, 1100px);
  margin: 0 auto;
}

.table-panel {
  min-width: 0;
  height: calc(100dvh - 180px);
}

.games-table {
  width: 100%;
}

.table-scroll {
  height: 100%;
}

.table-state {
  height: 100%;
  min-height: 240px;
}

@media (max-width: 1200px) {
  .page-content {
    width: min(94%, 980px);
  }

  .table-panel {
    height: calc(100dvh - 140px);
  }
}
</style>
