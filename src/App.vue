<script setup lang="ts">
import { useStompSocketStore } from './stores/useStompSocketStore';

const stompSocketStore = useStompSocketStore()
stompSocketStore.connect('http://localhost:8080/ws')
</script>

<template>
  <router-view>

  </router-view>
</template>

<style scoped></style>
