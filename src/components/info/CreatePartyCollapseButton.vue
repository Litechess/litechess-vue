<script setup lang="ts">
import { ref } from 'vue';
import {
  NButton,
  NCard,
  NCollapseTransition,
  NFlex,
  NSlider,
  NText,
} from 'naive-ui';
import DropdownButton from '../DropdownButton.vue';
import type { PlayerSide } from '@/types/ChessParty';
import { useI18n } from 'vue-i18n';

type PartySide = PlayerSide | 'random'

const props = defineProps<{
  isOpen?: boolean
}>();

const { t } = useI18n();
const emit = defineEmits<{
  confirm: [
    payload: {
      initialMinutes: number
      incrementSeconds: number
      side: PartySide
    },
  ]
}>();

const isOpen = ref(props.isOpen ?? false);
const initialMinutes = ref(10);
const incrementSeconds = ref(5);
const selectedSide = ref<PartySide>('random');

function formatMinutes(value: number): string {
  const wholeMinutes = Math.floor(value);
  const hasHalfMinute = value % 1 !== 0;

  if (wholeMinutes === 0 && hasHalfMinute) {
    return `30 ${t('time.seconds.short')}`;
  }

  if (hasHalfMinute) {
    return `${wholeMinutes} ${t('time.minutes.short')} 30 ${t('time.seconds.short')}`;
  }

  return `${wholeMinutes} ${t('time.minutes.short')}`;
}

function formatSeconds(value: number): string {
  return `${value} ${t('time.seconds.short')}`;
}

function selectSide(side: PartySide): void {
  selectedSide.value = side;
}

function confirmCreateParty(): void {
  emit('confirm', {
    initialMinutes: initialMinutes.value,
    incrementSeconds: incrementSeconds.value,
    side: selectedSide.value,
  });
}
</script>

<template>
  <DropdownButton v-model="isOpen" :label="t('boardPage.matchmakingTab.createParty')" />
  <n-collapse-transition :show="isOpen">
    <n-card>
      <n-flex vertical :size="18">
        <n-flex vertical :size="8">
          <n-text strong>{{ t('boardPage.matchmakingTab.initialTime') }}</n-text>
          <n-slider
            v-model:value="initialMinutes"
            :min="0"
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
              v-if="selectedSide !== 'white'"
              tertiary
              block
              @click="selectSide('white')"
            >
              {{ t('boardPage.matchmakingTab.sideWhite') }}
            </n-button>
            <n-button
              v-else
              type="primary"
              ghost
              block
              @click="selectSide('white')"
            >
              {{ t('boardPage.matchmakingTab.sideWhite') }}
            </n-button>

            <n-button
              v-if="selectedSide !== 'random'"
              tertiary
              block
              @click="selectSide('random')"
            >
              {{ t('boardPage.matchmakingTab.sideRandom') }}
            </n-button>
            <n-button
              v-else
              type="primary"
              ghost
              block
              @click="selectSide('random')"
            >
              {{ t('boardPage.matchmakingTab.sideRandom') }}
            </n-button>

            <n-button
              v-if="selectedSide !== 'black'"
              tertiary
              block
              @click="selectSide('black')"
            >
              {{ t('boardPage.matchmakingTab.sideBlack') }}
            </n-button>
            <n-button
              v-else
              type="primary"
              ghost
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
          @click="confirmCreateParty"
        >
          {{ t('boardPage.matchmakingTab.confirmCreateParty') }}
        </n-button>
      </n-flex>
    </n-card>
  </n-collapse-transition>
</template>

<style scoped>

</style>
