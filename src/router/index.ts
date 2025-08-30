
import BoardTest from '@/page/BoardTest.vue'
import { useAuthStore } from '@/stores/useAuthStore'
import { createRouter, createWebHistory } from 'vue-router'


const HomePage = () => import("@/page/HomePage.vue")
const PlayPage = () => import("@/page/PlayPage.vue")
const BoardPage = () => import("@/page/BoardPage.vue")
const LoginCallbackAuthPage = () => import("@/page/LoginCallbackPage.vue")

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage
    },
    {
      path: '/auth/login-callback',
      name: 'loginCallback',
      component: LoginCallbackAuthPage
    },
    {
      path: '/game/:gameId?',
      name: 'board',
      component: BoardPage,
      meta: { requiresAuth: true }
    },
    {
      path: '/test',
      name: 'test',
      component: BoardTest
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
