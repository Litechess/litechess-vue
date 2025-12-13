<script setup lang="ts">
import { computed, h, ref, type Component  } from 'vue';
import { NCollapseTransition, NCard, NButton, NText, NGrid, NFlex, NGridItem } from 'naive-ui';
import DropdownButton from '../DropdownButton.vue';
import type { TimeControl } from '@/types/ChessParty';
import { NO_TIME_CONTROL, TIME_CONTROLS } from '@/types/ChessParty';
import TimerIcon from '../icon/TimerIcon.vue';
import { useMediaQuery } from '@vueuse/core';

const props = defineProps<{
  isOpen?: boolean
  isActive?: boolean
  modelValue: TimeControl
}>();

const emit = defineEmits(['update:modelValue'])

const isMobile = useMediaQuery('(max-width: 767px)')
const adaptiveTimeControlFont = computed(() => {
  return isMobile.value ? '0.43rem' : '0.9rem'
})

const isOpen = ref(props.isOpen ?? false)
const timeControl = computed(() => props.modelValue ?? TIME_CONTROLS.Bullet[0])
const isActive = computed(() => props.isActive ?? true)

const title = computed(() => {
    if(timeControl.value.increment === 0 && timeControl.value.initTime === 0) return 'NO TIME CONTROL'
    else return `${formatTime(timeControl.value.initTime)} | +${formatIncrement(timeControl.value.increment)}`
})

const timerIcon: Component = h(TimerIcon)

const formatTime = (ms: number): string => {
  const seconds = ms / 1000;
  const minutes = seconds / 60;
  const hours = minutes / 60;
  const days = hours / 24;

  if (days >= 1) {
    return `${days}${days === 1 ? ' day' : ' days'}`;
  } else if (hours >= 1) {
    return `${hours}${hours === 1 ? ' hour' : ' hours'}`;
  } else if (minutes >= 1) {
    return `${minutes}${minutes === 1 ? ' min' : ' min'}`;
  } else {
    return `${seconds}${seconds === 1 ? ' sec' : ' sec'}`;
  }
};

const formatIncrement = (ms: number): string => {
  const seconds = ms / 1000;

  if (seconds === 0) return '0';
  if (seconds < 60) return `${seconds}s`;

  const minutes = seconds / 60;
  return `${minutes}min`;
};

function onControlClick(control: TimeControl) {
  emit('update:modelValue', control)
}
</script>

<template>
  <DropdownButton :icon="timerIcon" :label="title" v-model="isOpen"/>
  <n-collapse-transition :show="isOpen">
    <n-card>
      <n-flex vertical>
        <n-flex
          vertical
          v-for="(controls, category) in TIME_CONTROLS"
          :key="category"
        >
          <n-text strong>{{ category }}</n-text>
          <n-grid :x-gap="15" :y-gap="10" :cols="3">
            <n-grid-item
              v-for="(control, index) in controls"
              :key="index"
            >
              <n-button v-if="control.increment !== timeControl.increment || control.initTime !== timeControl.initTime"
                tertiary
                :disabled="!isActive"
                block
                :style= "{ fontSize: adaptiveTimeControlFont }"
                @click="onControlClick(control)">
                {{ formatTime(control.initTime) }} | +{{ formatIncrement(control.increment) }}
              </n-button>
              <n-button v-else
                type="primary"
                block ghost
                :style= "{ fontSize: adaptiveTimeControlFont }"
                @click="onControlClick(control)">
                {{ formatTime(control.initTime) }} | +{{ formatIncrement(control.increment) }}
              </n-button>
            </n-grid-item>
          </n-grid>
        </n-flex>
        <n-flex vertical style="margin-top: 20px" :size="5">
          <n-button v-if="timeControl.increment !== 0 || timeControl.initTime !== 0"
            :disabled="!isActive"
            tertiary
            block
            @click="onControlClick(NO_TIME_CONTROL)">NO TIME CONTROL</n-button>
          <n-button v-else
            :disabled="!isActive"
            type="primary"
            ghost
            block
            @click="onControlClick(NO_TIME_CONTROL)">NO TIME CONTROL</n-button>
        </n-flex>
      </n-flex>
    </n-card>
  </n-collapse-transition>
</template>

<style scoped>

</style>

