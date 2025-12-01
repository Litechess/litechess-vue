// stores/authStore.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import authService from '@/auth/authService'
import { User } from 'oidc-client-ts'
import { useApi } from '@/composables/useApi'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const isRegistered = ref<boolean>(false)
  const api = useApi()

  async function loadUser() {
    console.log("LOGINDFSDf")
    const u = await authService.getUser()
    if(u != null) {
      await api.getUserInfo(u.profile.sub).then(() => {
        isRegistered.value = true
      }).catch(() => {
        // ignore
      })
    }

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
    user.value = null;
    return authService.signoutRedirect()
  }

  async function handleLogoutCallback() {
    await authService.signoutCallback()
    user.value = null
  }

  function getId(): string | null {
    return user.value == null? null : user.value.profile.sub
  }


  authService.events.addAccessTokenExpired(() => {
    logout();
  });

  return {
    user,
    login,
    logout,
    loadUser,
    isRegistered,
    handleLoginCallback,
    handleLogoutCallback,
    getId
  }
})
