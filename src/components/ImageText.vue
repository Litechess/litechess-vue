<script setup lang="ts">
import type { Component } from 'vue';
import { NText } from 'naive-ui'


interface Props {
  icon?: Component
  text: string
}

const props = defineProps<Props>();

</script>

<template>
    <component :is="props.icon" v-if="props.icon"/>
    <n-text> {{ props.text }}</n-text>
</template>

<style scoped>

</style>
