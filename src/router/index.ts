
import { useAuthStore } from '@/stores/useAuthStore'
import { createRouter, createWebHistory } from 'vue-router'


const HomePage = () => import("@/components/HomePage.vue")
const PlayPage = () => import("@/components/PlayPage.vue")
const BoardPage = () => import("@/components/BoardPage.vue")
const LoginCallbackAuthPage = () => import("@/components/LoginCallbackPage.vue")

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage
    },
    {
      path: '/play',
      name: 'play',
      component: PlayPage,
      meta: { requiresAuth: true }
    },
    {
      path: '/auth/login-callback',
      name: 'loginCallback',
      component: LoginCallbackAuthPage
    },
    {
      path: '/board',
      name: 'board',
      component: BoardPage,
      meta: { requiresAuth: true }
    }
  ],
})

router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore()

  if (!auth.user) {
    await auth.loadUser()
  }

  if (to.meta.requiresAuth && !auth.user) {
    return auth.login()
  }

  next()
})

export default router
