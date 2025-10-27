<script setup lang="ts">
import { NButton, NIcon, NFlex, NText  } from 'naive-ui'
import { ChevronDown } from '@vicons/ionicons5'
import { computed, type Component } from 'vue';


const props = defineProps<{
  modelValue: boolean,
  icon?: Component
  label?: string
}>()

const emit = defineEmits(['update:modelValue'])
const label = computed(() => props.label ?? '')

function toggle() {
  emit('update:modelValue', !props.modelValue)
}
</script>

<template>
  <n-button
    tertiary
    @click="toggle"
  >
    <n-flex justify="center" align="center" style="gap: 8px;">
      <n-flex>
        <n-icon v-if="props.icon"
          :component="props.icon"
          :size="24"/>
      </n-flex>
      <n-text style="font-size: 18px;"> {{ label }}</n-text>
    </n-flex>

    <n-icon
      :component="ChevronDown"
      size="18"
      :style="{
        position: 'absolute',
        right: '0.75rem',
        top: '50%',
        transform: `translateY(-50%) rotate(${modelValue ? 180 : 0}deg)`,
        transition: 'transform 0.25s ease',
        pointerEvents: 'none'
      }"
    />
  </n-button>
</template>

