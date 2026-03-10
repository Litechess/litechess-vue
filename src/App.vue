<script setup lang="ts">
import { h, ref, watch, type Component, computed } from 'vue'
import { useAuthStore } from './stores/useAuthStore'
import { useStompSocketStore } from './stores/useStompSocketStore'
import {
  NConfigProvider,
  NFlex,
  NMenu,
  NGlobalStyle,
  darkTheme,
  NLayout,
  NLayoutContent,
  NLayoutSider,
  NIcon,
  type MenuOption,
  NText
} from 'naive-ui'
import { NNotificationProvider } from 'naive-ui'
import GameIcon from './components/icon/GameIcon.vue'
import { RouterLink } from 'vue-router'
import LeaveIcon from './components/icon/LeaveIcon.vue'
import ProfileIcon from './components/icon/ProfileIcon.vue'
import { usePageParamStore } from './stores/usePageParamStore'
import { useI18n } from 'vue-i18n'
import LanguageIcon from './components/icon/LanguageIcon.vue'

const stompSocketStore = useStompSocketStore()
const pageParamStore = usePageParamStore()
const authStore = useAuthStore()

const collapsed = ref(true)

const { t, locale } = useI18n()

function renderIcon(icon: Component) {
  return () => h(NIcon, { size: 30 }, { default: () => h(icon) })
}

function renderLabel(label: string) {
  return () =>
    h(
      NText,
      { style: { fontSize: '20px' } },
      { default: () => label }
    )
}

function renderRouterLabel(label: string, to: string) {
  return () =>
    h(
      RouterLink,
      { to },
      { default: renderLabel(label) }
    )
}

function renderRouterLabelReactive(label: string, getTo: () => string) {
  return () =>
    h(
      RouterLink,
      { to: getTo() },
      { default: renderLabel(label) }
    )
}

/* MAIN MENU */

const menuOptions = computed<MenuOption[]>(() => [
  {
    label: renderRouterLabel(t('sidePanel.profile'), '/user'),
    key: 'profile',
    icon: renderIcon(ProfileIcon)
  },
  {
    label: renderRouterLabelReactive(
      t('sidePanel.game'),
      () => `/game/${pageParamStore.lastGameId ?? ''}`
    ),
    key: 'play-option',
    icon: renderIcon(GameIcon)
  }
])

/* FOOTER MENU */

const menuFooterOptions = computed<MenuOption[]>(() => [
  {
    label: renderLabel(t('sidePanel.language')),
    key: 'language',
    icon: renderIcon(LanguageIcon),
    children: [
      {
        label: 'Русский',
        key: 'lang-ru',
        disabled: locale.value === 'ru'
      },
      {
        label: 'English',
        key: 'lang-en',
        disabled: locale.value === 'en'
      }
    ]
  },
  {
    label: renderLabel(t('sidePanel.exit')),
    key: 'exit',
    icon: renderIcon(LeaveIcon)
  }
])

/* FOOTER MENU HANDLER */

function handleFooterMenu(key: string) {
  if (key === 'exit') {
    authStore.logout()
  }

  if (key === 'lang-ru') {
    locale.value = 'ru'
  }

  if (key === 'lang-en') {
    locale.value = 'en'
  }
}

/* SOCKET LOGIN WATCHER */

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
  { immediate: true }
)

/* THEME */

const theme = ref(darkTheme)

const themeOverrides = {
  common: {
    bodyColor: '#1c1c1c'
  }
}
</script>

<template>
  <n-config-provider :theme="theme" :theme-overrides="themeOverrides">
    <n-global-style />

    <n-layout has-sider>
      <n-layout-sider
        v-if="authStore.isRegistered"
        collapse-mode="width"
        :collapsed="collapsed"
        :collapsed-width="40"
        :width="200"
        show-trigger="bar"
        bordered
        @collapse="collapsed = true"
        @expand="collapsed = false"
      >
        <n-flex vertical justify="space-between" style="height: 100%">
          
          <!-- MAIN MENU -->
          <n-menu
            :collapsed="collapsed"
            :collapsed-width="40"
            :collapsed-icon-size="22"
            :options="menuOptions"
          />

          <!-- FOOTER MENU -->
          <n-menu
            :collapsed="collapsed"
            :collapsed-width="40"
            :collapsed-icon-size="22"
            :options="menuFooterOptions"
            @update:value="handleFooterMenu"
          />

        </n-flex>
      </n-layout-sider>

      <n-layout-content
        content-style="min-height: calc(100dvh - 6rem); padding: 1rem; min-width: 320px;"
      >
        <n-notification-provider>
          <router-view />
        </n-notification-provider>
      </n-layout-content>
    </n-layout>
  </n-config-provider>
</template>

<style scoped>
</style>