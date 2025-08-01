// stores/authStore.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import authService from '@/auth/authService'
import { User } from 'oidc-client-ts'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)

  async function loadUser() {
    const u = await authService.getUser()
    user.value = u
  }

  function login() {
    return authService.signinRedirect()
  }

  async function handleLoginCallback() {
    await authService.signinCallback()
    await loadUser()
  }

  function logout() {
    return authService.signoutRedirect()
  }

  async function handleLogoutCallback() {
    await authService.signoutCallback()
    user.value = null
  }

  return {
    user,
    login,
    logout,
    loadUser,
    handleLoginCallback,
    handleLogoutCallback,
  }
})
