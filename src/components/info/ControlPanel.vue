<script setup lang="ts">
import { NFlex, NButton, NDropdown } from 'naive-ui';
import { h, type Ref } from 'vue';
import ArrowIcon from '../icon/ArrowIcon.vue';
import EqualIcon from '../icon/EqualIcon.vue';
import { nextTick, ref } from 'vue';
import FlagIcon from '../icon/FlagIcon.vue';
import BalanceIcon from '../icon/BalanceIcon.vue';

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

const surrenderButton: Ref<InstanceType<typeof NButton> | null> = ref(null)
const drawButton: Ref<InstanceType<typeof NButton> | null> = ref(null)

const closeButton = (buttonRef: Ref<InstanceType<typeof NButton> | null>) => {
  nextTick(() => {
    buttonRef.value?.handleClick(new MouseEvent('click'))
  })
}

function getOptions(title: string, onAccept: () => void, onDecline: () => void) {
  return () => h(
    'div',
    {
      style: `
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 12px;
      `
    },
    [
      h(
        'div',
        {
          style: `
            margin-bottom: 10px;
            text-align: center;
            font-size: 14px;
          `
        },
        `${title}`
      ),

      h(
        'div',
        { style: 'display: flex; gap: 8px;' },
        [
          h(
            NButton,
            {
              type: 'primary',
              size: 'small',
              onClick: () => onAccept()
            },
            { default: () => 'Yes' }
          ),
          h(
            NButton,
            {
              type: 'error',
              size: 'small',
              onClick: () => onDecline()
            },
            { default: () => 'No' }
          )
        ]
      )
    ]
  )
}

const surrenderRender = getOptions('Surrender?',
() => {
  props.onSurrender?.()
  closeButton(surrenderButton)
},
() => {
  closeButton(surrenderButton)
})

const drawRender = getOptions('Send draw proposition?',
() => {
  props.onDraw?.()
  closeButton(drawButton)
},
() => {
  closeButton(drawButton)
})


const surrenderOptions = [
  {
    key: 'header',
    type: 'render',
    render: surrenderRender
  }
]

const drawOptions = [
  {
    key: 'header',
    type: 'render',
    render: drawRender
  }
]
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
      <n-dropdown
        v-if="showSurrenderButton"
        trigger="click"
        :options="surrenderOptions">
        <n-button ref="surrenderButton" ghost type="error">
          <flag-icon />
        </n-button>
      </n-dropdown>
      <n-dropdown
        v-if="showDrawButton"
        trigger="click"
        :options="drawOptions">
        <n-button ref="drawButton" ghost type="info">
          <balance-icon />
        </n-button>
      </n-dropdown>
    </n-flex>
  </n-flex>
</template>
