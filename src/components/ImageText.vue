<script setup lang="ts">
import type { Component } from 'vue';
import { NText, NFlex } from 'naive-ui'


interface Props {
  icon?: Component
  text: string
}

defineEmits<{
  (e: 'click'): void
}>()

const props = defineProps<Props>();

</script>

<template>
  <n-flex @click="$emit('click')" align="center" :size="3">
    <component :is="props.icon" v-if="props.icon"/>
    <n-text> {{ props.text }}</n-text>
  </n-flex>
</template>

<style scoped>

</style>
