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
  <div style="padding: 2rem;">
    <h1>🔄 Вход через Keycloak...</h1>
    <p>Пожалуйста, подождите. Идёт авторизация.</p>
  </div>
</template>


