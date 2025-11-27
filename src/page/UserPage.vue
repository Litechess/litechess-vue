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

const nickName = ref('Olegnickname')
const registrationDate = ref('2025.01.01')
const status = ref('offline')
const tabSelect = ref('Stats')
const parties: Ref<ChessParty[]> = ref([])
const api = useApi()
const route = useRoute()

const userId = computed(() => {
  return String(route.params.userId)
})

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
  },
  { immediate: true },
)

</script>

<template>
  <n-flex justify="center" style="height: calc(100dvh - 2rem)">
    <n-flex style="width: 50%" vertical :size="30">
      <n-card>
        <n-flex>
          <n-avatar :size="125" src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg" />
          <n-flex style="align-items: flex-start" vertical justify="space-between">
            <n-text style="font-size: 2.5em" strong> {{ nickName }}</n-text>
            <n-flex inline>
              <n-flex inline :size="5">
                <n-text style="font-size: 1em">Registration date: </n-text>
                <n-text strong type="info" style="font-size: 1em"> {{ registrationDate }}</n-text>
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
