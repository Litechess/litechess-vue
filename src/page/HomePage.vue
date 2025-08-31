<script setup lang="ts">
import { useAuthStore } from '@/stores/useAuthStore'
import { computed } from 'vue'

const auth = useAuthStore()
const user = computed(() => auth.user)

function login() {
  auth.login()
}

function logout() {
  auth.logout()
}

</script>
<template>
  <div style="padding: 2rem;">
    <h1>🏠 Домашняя страница</h1>

    <p>Добро пожаловать на шахматный сайт!</p>

    <div style="margin-top: 1rem;">
      <p v-if="user">🔓 Вы вошли как <strong>{{ user.profile.name }}</strong></p>
      <p v-if="user">🔓 INFO: <pre>{{ user }}</pre></p>
      <p v-else>🔒 Вы не авторизованы</p>

      <button @click="login" v-if="!user" style="margin-top: 1rem;">
        🔐 Войти
      </button>
      <button @click="logout" v-if="user" style="margin-top: 1rem;">
        🚪 Выйти
      </button><br>
      <router-link to="/game">/play</router-link>
    </div>
  </div>
</template>
