<script setup lang="ts">
import type { ChessParty } from '@/types/ChessParty';
import { getSimpleStatus } from '@/util/ChessPartyUtil';
import { computed, ref, watch } from 'vue';
import { NFlex, NProgress, NText, useThemeVars, NStatistic, NIcon} from 'naive-ui';
import GameIcon from '../icon/GameIcon.vue';

const props = defineProps<{
  parties: ChessParty[]
  playerId: string
}>();

const themeVars = useThemeVars()

const wins = ref(0)
const loses = ref(0)
const draws = ref(0)
const total = ref(0)

const winPercantage = computed(() => {
  if (total.value === 0) return 0
  return Math.round((wins.value / total.value) * 100 * 100) / 100
})

const losePercentage = computed(() => {
  if (total.value === 0) return 0
  return Math.round((loses.value / total.value) * 100 * 100) / 100
})

const drawPercentage = computed(() => {
  if (total.value === 0) return 0
  return Math.round((draws.value / total.value) * 100 * 100) / 100
})

watch(
  () => props.parties,
  () => {
    let currWins = 0;
    let currLoses = 0;
    let currDraws = 0;
    let currTotal = 0;

    props.parties.forEach(party => {
      currTotal++;
      const simpleStatus = getSimpleStatus(party.status)
      const isWinWhite = party.white.id === props.playerId && simpleStatus === 'WIN_WHITE'
      const isWinBlack = party.black.id === props.playerId && simpleStatus === 'WIN_BLACK'
      const isDraw = party.status === 'DRAW'

      if(isWinBlack || isWinWhite) currWins++
      if(isDraw) currDraws++
      if(!isWinBlack && !isWinWhite && !isDraw) currLoses++

      wins.value = currWins
      loses.value = currLoses
      draws.value = currDraws
      total.value = currTotal
    })
  },
  { immediate: true },
)



</script>

<template>
  <n-flex justify="space-between">
    <n-flex>
      <n-flex :size="50">
        <n-statistic>
          <template #label>
            <n-text depth="3" style="font-size: 26px">Games</n-text>
          </template>
          <n-flex align="center" :size="0">
              <n-icon :size="57">
                <GameIcon/>
              </n-icon>
              <n-text style="font-size: 35px;"> {{ total }}</n-text>
          </n-flex>
        </n-statistic>
        <n-flex :size="25">
          <n-statistic>
            <template #label>
              <n-text depth="3" type="success" style="font-size: 17px">Wins</n-text>
            </template>
            <n-flex align="center" :size="0">
                <n-text type="success" style="font-size: 27px;"> {{ wins }}</n-text>
            </n-flex>
          </n-statistic>
          <n-statistic>
            <template #label>
              <n-text depth="3" type="error" style="font-size: 17px">Loses</n-text>
            </template>
            <n-flex align="center" :size="0">
                <n-text type="error" style="font-size: 27px;"> {{ loses }}</n-text>
            </n-flex>
          </n-statistic>
          <n-statistic>
            <template #label>
              <n-text depth="3" type="info" style="font-size: 17px">Draws</n-text>
            </template>
            <n-flex align="center" :size="0">
                <n-text type="info" style="font-size: 27px;"> {{ draws }}</n-text>
            </n-flex>
          </n-statistic>
        </n-flex>
      </n-flex>
    </n-flex>
    <n-flex :size="35" align="center">
      <n-flex vertical align="center">
        <n-progress
          type="circle"
          :color="themeVars.successColor"
          :percentage="winPercantage"
          :indicator-text-color="themeVars.successColor"/>
      </n-flex>
      <n-flex vertical align="center">
        <n-progress
          type="circle"
          :color="themeVars.errorColor"
          :percentage="losePercentage"
          :indicator-text-color="themeVars.errorColor"/>
      </n-flex>
      <n-flex vertical align="center">
        <n-progress
          type="circle"
          :percentage="drawPercentage"
          :indicator-text-color="themeVars.infoColor"/>
      </n-flex>
    </n-flex>
  </n-flex>
</template>
