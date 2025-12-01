<script setup lang="ts">
import { h, ref, watch, type Component } from 'vue'
import { useAuthStore } from './stores/useAuthStore'
import { useStompSocketStore } from './stores/useStompSocketStore'
import { NConfigProvider, NFlex, NMenu, NGlobalStyle, darkTheme, NLayout, NLayoutContent, NLayoutSider, NIcon, type MenuOption, NText } from 'naive-ui'
import { NNotificationProvider } from 'naive-ui'
import GameIcon from './components/icon/GameIcon.vue'
import { RouterLink } from 'vue-router'
import LeaveIcon from './components/icon/LeaveIcon.vue'
import ProfileIcon from './components/icon/ProfileIcon.vue'

const stompSocketStore = useStompSocketStore()
const authStore = useAuthStore()
const collapsed = ref(true)

function renderIcon(icon: Component) {
  return () => h(NIcon, { size: 30 }, { default: () => h(icon) })
}

function renderLabel(label: string) {
  return () => h(NText, { style: { fontSize: '20px' }}, { default: () => label })
}

function renderRouterLabel(label: string, to: string) {
  return () =>
    h(
      RouterLink,
      { to },
      { default: renderLabel(label) }
    )
}


const menuOptions: MenuOption[] = [
  {
    label: renderRouterLabel('Profile', `/user`),
    key: 'profile',
    icon: renderIcon(ProfileIcon),
  },
  {
    label: renderRouterLabel('Play', '/game'),
    key: 'play-option',
    icon: renderIcon(GameIcon),
  }
]

const menuFooterOptions: MenuOption[] = [
  {
    label: renderLabel('Exit'),
    key: 'exit',
    icon: renderIcon(LeaveIcon),
  },
]

const handleExit = () => {
  authStore.logout()
}



watch(
  () => authStore.user,
  (newUser) => {
    if (newUser && authStore.isRegistered) {
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
    <n-layout has-sider>
      <n-layout-sider v-if="authStore.isRegistered"
        collapse-mode="width"
        :collapsed="collapsed"
        :collapsed-width="40"
        :width="200"
        show-trigger="bar"
        @collapse="collapsed = true"
        @expand="collapsed = false"
        bordered>
        <n-flex vertical justify="space-between" style="height: 100%">
          <n-menu
            :collapsed="collapsed"
            :collapsed-width="40"
            :collapsed-icon-size="22"
            :options="menuOptions">

          </n-menu>
          <n-menu
            :collapsed="collapsed"
            :collapsed-width="40"
            :collapsed-icon-size="22"
            :options="menuFooterOptions"
            @update:value="handleExit">

          </n-menu>
        </n-flex>
      </n-layout-sider>
      <n-layout-content content-style="min-height: calc(100dvh - 6rem); padding: 1rem; min-width: 320px;">
        <n-notification-provider>
          <router-view>

          </router-view>
        </n-notification-provider>
      </n-layout-content>
    </n-layout>
  </n-config-provider>
</template>

<style scoped></style>
