<script setup lang="ts">
import { watch } from 'vue'
import { useAuthStore } from './stores/useAuthStore'
import { useStompSocketStore } from './stores/useStompSocketStore'
const stompSocketStore = useStompSocketStore()
const authStore = useAuthStore()

watch(
  () => authStore.user,
  (newUser) => {
    if (newUser) {
      console.log('login')
      stompSocketStore.connect()
    } else {
      console.log('logout')
      stompSocketStore.disconnect()
    }
  },
  { immediate: true },
)
</script>

<template>
  <router-view>

  </router-view>
</template>

<style scoped></style>
