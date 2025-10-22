<script setup lang="ts">
import { NFlex, NButton } from 'naive-ui';
import ArrowIcon from '../icon/ArrowIcon.vue';
import EqualIcon from '../icon/EqualIcon.vue';

const props = defineProps<{
  viewPrevious?: () => void
  viewNext?: () => void
  stopView?: () => void
}>();

const buttonSize = 35;
</script>

<template>
  <n-flex justify="center" :size="5">
    <n-button @click="props.viewPrevious">
      <arrow-icon :size="buttonSize" />
    </n-button>
    <n-button @click="props.stopView">
      <equal-icon :size="buttonSize" />
    </n-button>
    <n-button @click="props.viewNext">
      <arrow-icon :size="buttonSize" rotated />
    </n-button>
  </n-flex>
</template>
