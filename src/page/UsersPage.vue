<script setup lang="ts">
import { useApi } from '@/composables/useApi'
import type { UserInfo } from '@/types/UserInfo'
import {
  NAvatar,
  NCard,
  NDataTable,
  NEmpty,
  NFlex,
  NInput,
  NResult,
  NScrollbar,
  NSelect,
  NSpin,
  NText,
  type DataTableColumns,
  type SelectOption,
} from 'naive-ui'
import { computed, h, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

type UserListRow = UserInfo & {
  online: boolean
}

type OnlineFilter = 'all' | 'online' | 'offline'
type SortOption = 'nickname-asc' | 'nickname-desc' | 'created-desc' | 'created-asc'

const api = useApi()
const router = useRouter()
const { t } = useI18n()

const users = ref<UserListRow[]>([])
const searchQuery = ref('')
const onlineFilter = ref<OnlineFilter>('all')
const sortBy = ref<SortOption>('nickname-asc')
const loading = ref(false)
const loadFailed = ref(false)

const onlineOptions = computed<SelectOption[]>(() => [
  { label: t('usersPage.filters.allStatuses'), value: 'all' },
  { label: t('usersPage.filters.onlineOnly'), value: 'online' },
  { label: t('usersPage.filters.offlineOnly'), value: 'offline' },
])

const sortOptions = computed<SelectOption[]>(() => [
  { label: t('usersPage.sort.nicknameAsc'), value: 'nickname-asc' },
  { label: t('usersPage.sort.nicknameDesc'), value: 'nickname-desc' },
  { label: t('usersPage.sort.createdDesc'), value: 'created-desc' },
  { label: t('usersPage.sort.createdAsc'), value: 'created-asc' },
])

const filteredUsers = computed<UserListRow[]>(() => {
  const normalizedQuery = searchQuery.value.trim().toLocaleLowerCase()

  return [...users.value]
    .filter((user) => {
      if (normalizedQuery.length === 0) {
        return true
      }

      return user.nickname.toLocaleLowerCase().includes(normalizedQuery)
    })
    .filter((user) => {
      if (onlineFilter.value === 'online') {
        return user.online
      }

      if (onlineFilter.value === 'offline') {
        return !user.online
      }

      return true
    })
    .sort((left, right) => {
      switch (sortBy.value) {
        case 'nickname-desc':
          return right.nickname.localeCompare(left.nickname, 'ru')
        case 'created-desc':
          return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()
        case 'created-asc':
          return new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime()
        case 'nickname-asc':
        default:
          return left.nickname.localeCompare(right.nickname, 'ru')
      }
    })
})

const usersCountText = computed(() => {
  return t('usersPage.foundCount', {
    shown: filteredUsers.value.length,
    total: users.value.length,
  })
})

const columns = computed<DataTableColumns<UserListRow>>(() => [
  {
    title: t('usersPage.columns.user'),
    key: 'nickname',
    render: (row) => {
      return h(
        NFlex,
        {
          inline: true,
          align: 'center',
          size: 12,
        },
        {
          default: () => [
            h(NAvatar, {
              size: 40,
              src: row.avatarUrl || undefined,
            }),
            h(
              NFlex,
              {
                vertical: true,
                size: 2,
              },
              {
                default: () => [
                  h(NText, { strong: true }, { default: () => row.nickname }),
                  h(NText, { depth: 3 }, { default: () => row.id }),
                ],
              },
            ),
          ],
        },
      )
    },
  },
  {
    title: t('usersPage.columns.status'),
    key: 'online',
    render: (row) => {
      return h(
        NText,
        { type: row.online ? 'success' : 'error', strong: row.online },
        { default: () => row.online ? t('userPage.online') : t('userPage.offline') },
      )
    },
  },
  {
    title: t('usersPage.columns.registrationDate'),
    key: 'createdAt',
    render: (row) => formatDate(row.createdAt),
  },
])

async function loadUsers() {
  loading.value = true
  loadFailed.value = false

  try {
    const loadedUsers = await api.getAllUsers()

    const onlineStatuses = await Promise.allSettled(
      loadedUsers.map(async (user) => ({
        id: user.id,
        online: (await api.getUserOnline(user.id)).online,
      })),
    )

    const onlineMap = new Map<string, boolean>()
    onlineStatuses.forEach((result, index) => {
      const userId = loadedUsers[index].id
      onlineMap.set(userId, result.status === 'fulfilled' ? result.value.online : false)
    })

    users.value = loadedUsers.map((user) => ({
      ...user,
      online: onlineMap.get(user.id) ?? false,
    }))
  } catch {
    loadFailed.value = true
  } finally {
    loading.value = false
  }
}

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString('ru-RU')
}

function openUser(userId: string) {
  router.push(`/user/${userId}`)
}

function createRowProps(row: UserListRow) {
  return {
    style: 'cursor: pointer;',
    onClick: () => {
      openUser(row.id)
    },
  }
}

onMounted(async () => {
  await loadUsers()
})
</script>

<template>
  <div class="users-page">
    <n-flex vertical :size="24" align="center">
      <n-text tag="h1" class="page-title">
        {{ t('usersPage.title') }}
      </n-text>

      <div class="page-content">
        <n-card class="filters-panel">
          <n-flex vertical :size="14">
            <n-flex justify="space-between" align="center" :wrap="true">
              <n-text strong>
                {{ usersCountText }}
              </n-text>
            </n-flex>
            <n-flex class="filters-row" :size="16">
            <n-input
              v-model:value="searchQuery"
              clearable
              :placeholder="t('usersPage.filters.searchPlaceholder')"
            />
            <n-select
              v-model:value="onlineFilter"
              :options="onlineOptions"
            />
            <n-select
              v-model:value="sortBy"
              :options="sortOptions"
            />
            </n-flex>
          </n-flex>
        </n-card>

        <n-card class="table-panel" :bordered="true" content-style="height: 100%">
          <n-spin v-if="loading" size="large">
            <div class="table-state" />
          </n-spin>

          <n-result
            v-else-if="loadFailed"
            class="table-state"
            status="error"
            :title="t('usersPage.loadErrorTitle')"
            :description="t('usersPage.loadErrorDescription')"
          />

          <n-empty
            v-else-if="filteredUsers.length === 0"
            class="table-state"
            :description="t('usersPage.empty')"
            size="huge"
          />

          <n-scrollbar v-else class="table-scroll">
            <n-data-table
              class="users-table"
              :columns="columns"
              :data="filteredUsers"
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
.users-page {
  width: 100%;
}

.page-title {
  margin: 0;
  font-size: 42px;
  font-weight: 800;
  text-align: center;
}

.page-content {
  width: min(92%, 1180px);
  margin: 0 auto;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 20px;
}

.filters-panel {
  width: 100%;
}

.filters-row {
  width: 100%;
}

.filters-row > * {
  flex: 1 1 220px;
}

.table-panel {
  min-width: 0;
  height: calc(100dvh - 250px);
}

.users-table {
  width: 100%;
}

.table-scroll {
  height: 100%;
}

.table-state {
  height: 100%;
  min-height: 260px;
}

@media (max-width: 900px) {
  .page-content {
    width: min(96%, 100%);
  }

  .filters-row {
    flex-direction: column;
  }

  .table-panel {
    height: calc(100dvh - 320px);
  }
}
</style>
