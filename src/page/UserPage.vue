<script setup lang="ts">
import { NFlex, NCard, NAvatar, NText, NDivider } from 'naive-ui';
import { ref, type Ref } from 'vue';
import { NTabs, NTabPane } from 'naive-ui';
import { TIME_CONTROLS, type ChessParty } from '@/types/ChessParty';
import PartyTableView from '@/components/parties/PartyTableView.vue';

const nickName = ref('Olegnickname')
const PLAYER_ID = '123'
const registrationDate = ref('2025.01.01')
const status = ref('offline')
const tabSelect = ref('Stats')
const parties: Ref<ChessParty[]> = ref([])

parties.value.push({
  id: '123',
  white: {
    id: '123',
    name: 'White',
  },
  black: {
    id: '122',
    name: 'Black',
  },
  moves: [],
  timerHistory: [],
  timeControl: null,
  initFen: 'initFen',
  status: "WIN_BLACK"
})

parties.value.push({
  id: '124',
  white: {
    id: '123',
    name: 'Black',
  },
  black: {
    id: '122',
    name: 'White',
  },
  moves: [],
  timerHistory: [],
  timeControl: TIME_CONTROLS.Blitz[0],
  initFen: 'initFen',
  status: "WIN_WHITE"
})

parties.value.push({
  id: '124',
  white: {
    id: '126',
    name: 'Black',
  },
  black: {
    id: '125',
    name: 'White',
  },
  moves: [],
  timerHistory: [],
  timeControl: null,
  initFen: 'initFen',
  status: "DRAW"
})

parties.value.push({
  id: '124',
  white: {
    id: '129',
    name: 'Black',
  },
  black: {
    id: '128',
    name: 'White',
  },
  moves: [],
  timerHistory: [],
  timeControl: null,
  initFen: 'initFen',
  status: "NOT_FINISHED"
})


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
        <party-table-view
          :parties="parties"
          :playerId="PLAYER_ID"
        />
      </n-card>
      <n-card v-if="tabSelect == 'Parties'">
        Parties
      </n-card>
    </n-flex>
  </n-flex>
</template>

<style scoped>

</style>
