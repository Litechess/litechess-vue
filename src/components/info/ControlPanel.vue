<script setup lang="ts">
import { NFlex, NButton } from 'naive-ui';
import ArrowIcon from '../icon/ArrowIcon.vue';
import EqualIcon from '../icon/EqualIcon.vue';
import FlagIcon from '../icon/FlagIcon.vue';
import BalanceIcon from '../icon/BalanceIcon.vue';
import { NPopconfirm } from 'naive-ui';

const props = defineProps<{
  viewPrevious?: () => void
  viewNext?: () => void
  stopView?: () => void
  showSurrenderButton?: boolean
  showDrawButton?: boolean
  onSurrender?: () => void
  onDraw?: () => void
}>();

const buttonSize = 30;

</script>

<template>
  <n-flex justify="center" :size="25">
    <n-flex inline :size="5">
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
    <n-flex inline :size="5">
      <n-popconfirm
        v-if="showSurrenderButton"
        @positive-click="onSurrender">
        <template #trigger>
          <n-button ghost type="error">
            <flag-icon />
          </n-button>
        </template>
        Surrender?
      </n-popconfirm>
      <n-popconfirm
        v-if="showDrawButton"
        @positive-click="onDraw">
        <template #trigger>
          <n-button ghost type="info">
            <balance-icon />
          </n-button>
        </template>
        Offer a draw?
      </n-popconfirm>
    </n-flex>
  </n-flex>
</template>
