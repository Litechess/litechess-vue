<script setup lang="ts">
import { ref, watch } from 'vue'
import { useAuthStore } from './stores/useAuthStore'
import { useStompSocketStore } from './stores/useStompSocketStore'
import { NConfigProvider, NGlobalStyle, darkTheme } from 'naive-ui'

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

const theme = ref(darkTheme)
const themeOverrides = {
  common: {
    bodyColor: '#1c1c1c', // фон контента
  },
}
</script>

<template>
  <n-config-provider :theme="theme" :theme-overrides="themeOverrides">
    <n-global-style />
    <router-view> </router-view>
  </n-config-provider>
</template>

<style scoped></style>
