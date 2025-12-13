<script setup lang="ts">
import { NFlex, NCard, NAvatar, NText, NDivider } from 'naive-ui';
import { computed, ref, watch, type Ref } from 'vue';
import { NTabs, NTabPane } from 'naive-ui';
import { type ChessParty } from '@/types/ChessParty';
import PartyTableView from '@/components/parties/PartyTableView.vue';
import { useApi } from '@/composables/useApi';
import { useRoute } from 'vue-router';
import type { ChessPartyFilter } from '@/types/Requests';
import PartyStatsView from '@/components/parties/PartyStatsView.vue';
import type { UserInfo } from '@/types/UserInfo';
import { useAuthStore } from '@/stores/useAuthStore';
import { useMediaQuery } from '@vueuse/core';

const isMobile = useMediaQuery('(max-width: 767px)')

const justifyContent = computed(() => {
  return isMobile.value ? 'start' : 'center'
})

const adaptiveWidth = computed(() => {
  return isMobile.value ? '100%' : '50%'
})

const authStore = useAuthStore()
const userId = computed(() => {
  return String(route.params.userId)
})

const userInfo: Ref<UserInfo | undefined> = ref(undefined)

const userName = computed(() => {
  return userInfo.value?.nickname ?? ''
})

const userRegistrationDate = computed(() => {
  if(userInfo.value === undefined) return new Date(0).toLocaleDateString("ru-RU")
  return new Date(userInfo.value.createdAt).toLocaleDateString("ru-RU")

})


const status = ref('offline')
const tabSelect = ref('Stats')
const parties: Ref<ChessParty[]> = ref([])
const api = useApi()
const route = useRoute()


const isLoadingPartyData = ref(true);

async function loadParties() {
  const filters: ChessPartyFilter = {
    finish: true,
    live: false,
    playerId: userId.value
  }

    api.getAllGames(filters).then((res) => {
      parties.value = res
      isLoadingPartyData.value = false;
  }).catch(() => {
    console.log("HANDLE UNKNOWN USER ID")
  })
}

watch(
  () => route.params.userId,
  async () => {
    loadParties()
    api.getUserInfo(userId.value).then((res) => {
      userInfo.value = res
    })
    api.getUserOnline(userId.value).then((res) => {
      if (res.online || authStore.getId() === userId.value) {
        status.value = "online"
      } else {
        status.value = "offline"
      }
    })
  },
  { immediate: true },
)

</script>

<template>
  <n-flex :justify="justifyContent" style="height: calc(100dvh - 2rem)">
    <n-flex :style="{ width: adaptiveWidth }" vertical :size="30">
      <n-card>
        <n-flex>
          <n-avatar :size="125" />
          <n-flex style="align-items: flex-start" vertical justify="space-between">
            <n-text style="font-size: 2.5em" strong> {{ userName }}</n-text>
            <n-flex inline>
              <n-flex inline :size="5">
                <n-text style="font-size: 1em">Registration date: </n-text>
                <n-text strong type="info" style="font-size: 1em"> {{ userRegistrationDate }}</n-text>
              </n-flex>
              <n-flex inline :size="5">
                <n-text style="font-size: 1em">Status: </n-text>
                <n-text strong :type="status == 'online' ? 'success' : 'error'" style="font-size: 1em"> {{ status }}</n-text>
              </n-flex>
            </n-flex>
          </n-flex>
        </n-flex>
        <n-divider/>
        <n-tabs v-model:value="tabSelect" type="segment" animated>
          <n-tab-pane name="Stats"/>
          <n-tab-pane name="Parties"/>
        </n-tabs>
      </n-card>
      <n-card v-if="tabSelect == 'Stats'">
        <party-stats-view
          :parties="parties"
          :playerId="userId"/>
      </n-card>
      <n-card v-if="tabSelect == 'Parties'">
        <party-table-view
          :parties="parties"
          :playerId="userId"
          :loading="isLoadingPartyData"
        />
      </n-card>
    </n-flex>
  </n-flex>
</template>

<style scoped>

</style>
