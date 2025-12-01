<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/useAuthStore'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()

onMounted(async () => {
  await auth.handleLoginCallback()
  router.replace('/')
})
</script>

<template>
  <div style="height: calc(100dvh - 2rem)">

  </div>
</template>


